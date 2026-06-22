#!/usr/bin/env bash
# ============================================================
# vps-bootstrap.sh — разворачивает сайт sk-yurievich.ru на РОССИЙСКОМ VPS
# (Ubuntu 22.04/24.04). Полный Next.js: SSR + API-роуты + автодеплой.
# Цель: сайт открывается в РФ без VPN (российский IP, не Vercel).
#
# Запуск (на свежем VPS, под root):
#   apt update && apt install -y git
#   GH_TOKEN=xxxx git clone https://x-access-token:$GH_TOKEN@github.com/jodemchenko-art/yurievich-site.git /var/www/yurievich
#   cd /var/www/yurievich && bash deploy/vps-bootstrap.sh
#
# Переменные окружения (можно задать перед запуском):
#   DOMAIN       — основной домен (по умолчанию sk-yurievich.ru)
#   APP_DIR      — куда ставим (по умолчанию /var/www/yurievich)
#   NODE_MAJOR   — версия Node (по умолчанию 20)
# ============================================================
set -euo pipefail

DOMAIN="${DOMAIN:-sk-yurievich.ru}"
WWW="www.${DOMAIN}"
APP_DIR="${APP_DIR:-/var/www/yurievich}"
NODE_MAJOR="${NODE_MAJOR:-20}"
PORT=3000

echo "==> 1/8 Системные пакеты"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y curl git nginx ufw

echo "==> 2/8 Node.js ${NODE_MAJOR} + pm2"
if ! command -v node >/dev/null || [ "$(node -v | grep -oE '[0-9]+' | head -1)" -lt "$NODE_MAJOR" ]; then
  curl -fsSL "https://deb.nodesource.com/setup_${NODE_MAJOR}.x" | bash -
  apt-get install -y nodejs
fi
npm install -g pm2

echo "==> 3/8 .env (если ещё нет — создаём шаблон, ЗАПОЛНИТЬ значениями)"
if [ ! -f "$APP_DIR/.env" ]; then
  cat > "$APP_DIR/.env" <<'ENVEOF'
# Заполнить реальными значениями из ~/.secrets/yurievich.env
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
NOTIFY_PROXY_KEY=
INDEXNOW_KEY=
NODE_ENV=production
ENVEOF
  echo "   ⚠ Создан шаблон $APP_DIR/.env — впиши токены ДО сборки, иначе формы/уведомления не заработают."
fi

echo "==> 4/8 Сборка проекта"
cd "$APP_DIR"
npm ci
npm run build

echo "==> 5/8 Запуск через pm2 (next start на :$PORT)"
pm2 delete yurievich 2>/dev/null || true
PORT=$PORT pm2 start "npm run start" --name yurievich --time
pm2 save
pm2 startup systemd -u root --hp /root | tail -1 | bash || true

echo "==> 6/8 nginx: реверс-прокси + редирект apex→www (канон у нас www)"
cat > /etc/nginx/sites-available/yurievich <<NGINX
server {
    listen 80;
    server_name ${DOMAIN} ${WWW};

    # apex -> www (301, единое зеркало)
    if (\$host = ${DOMAIN}) { return 301 http://${WWW}\$request_uri; }

    location / {
        proxy_pass http://127.0.0.1:${PORT};
        proxy_http_version 1.1;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
NGINX
ln -sf /etc/nginx/sites-available/yurievich /etc/nginx/sites-enabled/yurievich
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx

echo "==> 7/8 Firewall (80/443/22)"
ufw allow 22/tcp  >/dev/null 2>&1 || true
ufw allow 80/tcp  >/dev/null 2>&1 || true
ufw allow 443/tcp >/dev/null 2>&1 || true
yes | ufw enable >/dev/null 2>&1 || true

echo "==> 8/8 Автодеплой (cron: каждые 10 мин подтягивает новые статьи автопилота)"
cat > /usr/local/bin/yurievich-deploy.sh <<DEPLOY
#!/usr/bin/env bash
set -e
cd ${APP_DIR}
BEFORE=\$(git rev-parse HEAD)
git pull --rebase --autostash || exit 0
AFTER=\$(git rev-parse HEAD)
[ "\$BEFORE" = "\$AFTER" ] && exit 0   # нет изменений — выходим
npm ci
npm run build
pm2 reload yurievich
echo "\$(date) deployed \$AFTER" >> /var/log/yurievich-deploy.log
DEPLOY
chmod +x /usr/local/bin/yurievich-deploy.sh
( crontab -l 2>/dev/null | grep -v yurievich-deploy ; echo "*/10 * * * * /usr/local/bin/yurievich-deploy.sh" ) | crontab -

echo ""
echo "============================================================"
echo "✅ ГОТОВО (HTTP). Сайт слушает на http://${WWW}"
echo ""
echo "ДАЛЬШЕ (по порядку):"
echo "  1) Переключи DNS в Cloudflare: A-записи ${DOMAIN} и ${WWW} -> IP этого сервера,"
echo "     режим 'DNS only' (серое облако, НЕ оранжевое)."
echo "  2) Дождись, пока домен резолвится на этот IP (5-30 мин)."
echo "  3) Включи бесплатный SSL:"
echo "     apt-get install -y certbot python3-certbot-nginx"
echo "     certbot --nginx -d ${DOMAIN} -d ${WWW} --redirect -m info@${DOMAIN} --agree-tos -n"
echo "============================================================"
