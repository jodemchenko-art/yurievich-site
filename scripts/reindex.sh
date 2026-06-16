#!/bin/bash
# reindex.sh — отправляет список URL на переобход в Яндекс.Вебмастер.
#
# Использование:
#   ./scripts/reindex.sh url1 url2 url3
#   ./scripts/reindex.sh -            # читать URL'ы построчно из stdin
#   ./scripts/reindex.sh --all-blog   # отправить все статьи блога (из сборки sitemap)
#
# Требует в /home/client2/.secrets/yurievich.env:
#   YANDEX_WEBMASTER_OAUTH_TOKEN, YANDEX_WEBMASTER_USER_ID, YANDEX_WEBMASTER_HOST_ID

set -e

SECRETS=/home/client2/.secrets/yurievich.env
[ -f "$SECRETS" ] && . "$SECRETS"

YA_TOKEN=${YANDEX_WEBMASTER_OAUTH_TOKEN:-}
YA_USER=${YANDEX_WEBMASTER_USER_ID:-}
YA_HOST=${YANDEX_WEBMASTER_HOST_ID:-}

if [ -z "$YA_TOKEN" ] || [ -z "$YA_USER" ] || [ -z "$YA_HOST" ]; then
  echo "❌ Webmaster API not configured. Need YANDEX_WEBMASTER_OAUTH_TOKEN + USER_ID + HOST_ID in $SECRETS"
  exit 1
fi

YA_HOST_ENC=$(python3 -c "import urllib.parse,sys;print(urllib.parse.quote(sys.argv[1],safe=''))" "$YA_HOST")
SITEMAP_URL="https://sk-yurievich.ru/sitemap.xml"

collect_blog_urls() {
  # Тянем sitemap, выдёргиваем все /blog/ URL'ы
  curl -sS --max-time 20 "$SITEMAP_URL" 2>/dev/null \
    | grep -oE '<loc>[^<]*</loc>' \
    | sed -E 's|</?loc>||g' \
    | grep '/blog/'
}

URLS=()
if [ "$1" = "--all-blog" ]; then
  mapfile -t URLS < <(collect_blog_urls)
elif [ "$1" = "-" ] || [ -z "$1" ]; then
  mapfile -t URLS
else
  URLS=("$@")
fi

if [ ${#URLS[@]} -eq 0 ]; then
  echo "No URLs to reindex"
  exit 0
fi

# Quota check
QUOTA=$(curl -sS --max-time 10 -H "Authorization: OAuth $YA_TOKEN" \
  "https://api.webmaster.yandex.net/v4/user/$YA_USER/hosts/$YA_HOST_ENC/recrawl/quota/" \
  2>/dev/null | python3 -c "import json,sys;d=json.load(sys.stdin);print(d.get('daily_quota','?'),'/',d.get('quota_remainder','?'))" 2>/dev/null || echo '? / ?')
echo "Дневная квота Я.Вебмастера: $QUOTA"
echo "URL'ов для отправки: ${#URLS[@]}"
echo ""

OK=0
FAIL=0
for url in "${URLS[@]}"; do
  [ -z "$url" ] && continue
  RESP=$(curl -sS --max-time 15 -X POST \
    -H "Authorization: OAuth $YA_TOKEN" \
    -H "Content-Type: application/json" \
    "https://api.webmaster.yandex.net/v4/user/$YA_USER/hosts/$YA_HOST_ENC/recrawl/queue/" \
    -d "{\"url\":\"$url\"}" 2>&1)
  if echo "$RESP" | grep -q '"task_id"'; then
    REMAIN=$(echo "$RESP" | python3 -c "import json,sys;print(json.load(sys.stdin).get('quota_remainder','?'))" 2>/dev/null || echo '?')
    echo "✓ $url (осталось $REMAIN)"
    OK=$((OK+1))
  else
    echo "✗ $url — $RESP"
    FAIL=$((FAIL+1))
  fi
done

echo ""
echo "Готово: $OK успешно, $FAIL ошибок из ${#URLS[@]} URL"
