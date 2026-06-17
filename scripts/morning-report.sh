#!/usr/bin/env bash
# morning-report.sh — короткая независимая утренняя сводка для юзера.
# Запускается отдельной routine через 30 мин после writer (на случай если writer упал).
# Делает: git ls новых статей за вчера → Метрика-цифры → TG digest через прокси.
#
# Это НЕЗАВИСИМАЯ страховка. Даже если основная routine отвалилась на середине,
# репортёр всё равно скажет: «вчера написано N статей, цифры такие, статус такой».

set -uo pipefail

LOG=/tmp/morning-report.log
exec > >(tee -a "$LOG") 2>&1

NOTIFY_URL=${NOTIFY_URL:-https://www.sk-yurievich.ru/api/notify}

# Утилита: отправка через прокси
send() {
  local file=$1
  curl -sS --max-time 20 -X POST "$NOTIFY_URL" \
    -H "Content-Type: application/json" \
    -d "$(python3 -c "
import json, sys
print(json.dumps({
  'key': '${NOTIFY_PROXY_KEY}',
  'text': sys.stdin.read(),
  'parse_mode': 'HTML',
}))" < "$file")"
}

YEST=$(date -u -d "yesterday" +%Y-%m-%d 2>/dev/null || date -u -v-1d +%Y-%m-%d)
TODAY=$(date -u +%Y-%m-%d)
SINCE=$(date -u -d "-7 days" +%Y-%m-%d 2>/dev/null || date -u -v-7d +%Y-%m-%d)

# === A) Что появилось в git за вчера ===
WORK=/tmp/yurievich-report
rm -rf "$WORK"
git clone --depth 20 "https://x-access-token:${GITHUB_TOKEN}@github.com/${GITHUB_REPO}.git" "$WORK" > /tmp/clone.log 2>&1
cd "$WORK"

# Коммиты автопилота за последние 24ч с количеством статей
NEW_ARTICLES=$(git log --since="36 hours ago" --name-only --pretty=format: --diff-filter=A \
  | grep -E '^lib/articles/[a-z0-9-]+\.ts$' \
  | grep -v 'index\|_types' \
  | sort -u)
NEW_COUNT=$(echo "$NEW_ARTICLES" | grep -c . || echo 0)
TOTAL=$(ls lib/articles/ 2>/dev/null | grep -E '\.ts$' | grep -v 'index\|_types' | wc -l)

# Заголовки новых статей
NEW_LIST=""
for f in $NEW_ARTICLES; do
  if [ -f "$f" ]; then
    SLUG=$(basename "$f" .ts)
    TITLE=$(grep -m1 '^  title:' "$f" | sed 's/.*: "//;s/",$//' | head -c 100)
    NEW_LIST="${NEW_LIST}• <a href=\"https://www.sk-yurievich.ru/blog/${SLUG}/\">${TITLE}</a>%0A"
  fi
done

# === B) Метрика за последние 24 часа + 7 дней ===
METRIKA_DAY="?"
METRIKA_WEEK="?"
METRIKA_SEARCH="0"
METRIKA_SOURCES=""
if [ -n "${YANDEX_METRIKA_OAUTH_TOKEN:-}" ] && [ -n "${YANDEX_METRIKA_COUNTER_ID:-}" ]; then
  HEAD="Authorization: OAuth ${YANDEX_METRIKA_OAUTH_TOKEN}"
  CID=${YANDEX_METRIKA_COUNTER_ID}

  # За вчера
  DAY_DATA=$(curl -sS --max-time 10 -H "$HEAD" \
    "https://api-metrika.yandex.net/stat/v1/data?ids=$CID&metrics=ym:s:visits,ym:s:users,ym:s:pageviews&date1=$YEST&date2=$YEST")
  METRIKA_DAY=$(echo "$DAY_DATA" | python3 -c "
import json,sys
d = json.load(sys.stdin)
if 'totals' in d:
    v,u,p = d['totals']
    print(f'визиты={int(v)} · посетители={int(u)} · просмотры={int(p)}')
else: print('—')
" 2>/dev/null || echo "—")

  # За неделю
  WEEK_DATA=$(curl -sS --max-time 10 -H "$HEAD" \
    "https://api-metrika.yandex.net/stat/v1/data?ids=$CID&metrics=ym:s:visits,ym:s:users&date1=$SINCE&date2=$TODAY")
  METRIKA_WEEK=$(echo "$WEEK_DATA" | python3 -c "
import json,sys
d = json.load(sys.stdin)
if 'totals' in d:
    v,u = d['totals']
    print(f'визиты={int(v)} · посетители={int(u)}')
else: print('—')
" 2>/dev/null || echo "—")

  # Из поиска за неделю
  SEARCH_DATA=$(curl -sS --max-time 10 -H "$HEAD" \
    "https://api-metrika.yandex.net/stat/v1/data?ids=$CID&metrics=ym:s:visits&dimensions=ym:s:trafficSource&date1=$SINCE&date2=$TODAY")
  METRIKA_SEARCH=$(echo "$SEARCH_DATA" | python3 -c "
import json,sys
d = json.load(sys.stdin)
total = 0
for r in d.get('data', []):
    if 'Search' in r['dimensions'][0]['name'] or 'organic' in r['dimensions'][0]['id']:
        total += int(r['metrics'][0])
print(total)
" 2>/dev/null || echo 0)
fi

# === C) Я.Вебмастер статус ===
HOST_STATUS="—"
QUOTA="?"
if [ -n "${YANDEX_WEBMASTER_OAUTH_TOKEN:-}" ]; then
  HOST_ENC=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$YANDEX_WEBMASTER_HOST_ID")
  YH="Authorization: OAuth ${YANDEX_WEBMASTER_OAUTH_TOKEN}"
  YB="https://api.webmaster.yandex.net/v4/user/${YANDEX_WEBMASTER_USER_ID}/hosts/$HOST_ENC"
  HOST_STATUS=$(curl -sS --max-time 8 -H "$YH" "$YB" | python3 -c "
import json,sys;print(json.load(sys.stdin).get('host_data_status','?'))" 2>/dev/null)
  QUOTA=$(curl -sS --max-time 8 -H "$YH" "$YB/recrawl/quota/" | python3 -c "
import json,sys;d=json.load(sys.stdin);print(f\"{d.get('quota_remainder','?')}/{d.get('daily_quota','?')}\")" 2>/dev/null)
fi

# === D) Формируем сообщение ===
STATUS_ICO="✅"
[ "$NEW_COUNT" -lt 1 ] && STATUS_ICO="⚠️"

cat > /tmp/report.txt <<EOF
${STATUS_ICO} <b>Утренний отчёт · ${TODAY}</b>

📝 <b>За вчера написано:</b> ${NEW_COUNT} статей
<b>В блоге всего:</b> ${TOTAL} страниц

EOF

if [ -n "$NEW_LIST" ]; then
  echo "$NEW_LIST" | sed 's/%0A/\n/g' >> /tmp/report.txt
  echo "" >> /tmp/report.txt
fi

cat >> /tmp/report.txt <<EOF
📊 <b>Я.Метрика — вчера:</b>
${METRIKA_DAY}

📊 <b>За неделю:</b>
${METRIKA_WEEK}
из них из <b>Поиска: ${METRIKA_SEARCH}</b>

🔍 <b>Я.Вебмастер:</b>
статус: ${HOST_STATUS}
квота переобхода: ${QUOTA}

EOF

# Подсказка/прогноз
if [ "$HOST_STATUS" = "NOT_LOADED" ]; then
  echo "ℹ️ Сайт ещё не загружен в индекс Яндекса. Это нормально — ждём 5-10 дней." >> /tmp/report.txt
fi

echo "" >> /tmp/report.txt
echo "💤 От тебя ничего не нужно." >> /tmp/report.txt

send /tmp/report.txt
echo ""
echo "report sent"
