#!/usr/bin/env node
// fundament-bot.js — Telegram-бот для расчёта стоимости фундамента 24/7.
//
// Зачем: люди пишут в личку в любое время суток. Бот собирает данные,
// считает примерную смету, отправляет лида в нашу CRM (через /api/notify).
// Это активный канал лидов, не «пассивный сайт».
//
// Запускается через node-telegram-bot-api на сервере (Vercel cron / VPS).
// Не требует webhook setup — работает через long polling.
//
// Env:
//   FUNDAMENT_BOT_TOKEN — токен от @BotFather (новый бот для этого, не использовать существующий)
//   NOTIFY_PROXY_KEY — для отправки лида в /api/notify
//   NOTIFY_URL — https://yurievich-site.vercel.app/api/notify (минует CF WAF)
//
// Запуск:
//   node scripts/fundament-bot.js

const fs = require('fs');
const path = require('path');

const TOKEN = process.env.FUNDAMENT_BOT_TOKEN;
const NOTIFY_PROXY_KEY = process.env.NOTIFY_PROXY_KEY;
const NOTIFY_URL = process.env.NOTIFY_URL || 'https://yurievich-site.vercel.app/api/notify';
const ADMIN_CHAT_ID = process.env.TELEGRAM_CHAT_ID; // куда отправлять лиды

if (!TOKEN) {
  console.error('ERR: FUNDAMENT_BOT_TOKEN не задан');
  process.exit(1);
}

const API_BASE = `https://api.telegram.org/bot${TOKEN}`;

// === Состояние пользователей (в памяти; для prod — в БД) ===
const sessions = new Map();

const GROUNDS = {
  pesok: { label: 'Пески (сухие)', multiplier: 1.0 },
  suglinok: { label: 'Суглинок', multiplier: 1.15 },
  glina: { label: 'Глина (пучинистая)', multiplier: 1.25 },
  torf: { label: 'Торф (нужна выторфовка)', multiplier: 1.65 },
  boloto: { label: 'Болото (Назия и т.п.)', multiplier: 1.85 },
};

const HOUSES = {
  karkas: { label: 'Каркасный', wallLoad: 0.7 },
  brus: { label: 'Брус / СИП', wallLoad: 0.85 },
  gazobeton: { label: 'Газобетон ЛСР', wallLoad: 1.0 },
  kirpich: { label: 'Кирпич', wallLoad: 1.2 },
};

// === Telegram API helpers ===
async function tgSend(chatId, text, opts = {}) {
  const body = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    disable_web_page_preview: true,
    ...opts,
  };
  const res = await fetch(`${API_BASE}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  return res.json();
}

function buildKeyboard(rows) {
  return {
    reply_markup: {
      inline_keyboard: rows.map((row) =>
        row.map((b) => ({ text: b.label, callback_data: b.data }))
      ),
    },
  };
}

// === Расчёт сметы ===
function calculate(session) {
  const area = session.length * session.width;
  const ground = GROUNDS[session.ground] || GROUNDS.suglinok;
  const house = HOUSES[session.house] || HOUSES.gazobeton;

  // Толщина: газобетон 2 эт → 300мм, остальное 250мм
  const thickness = session.house === 'kirpich' || session.house === 'gazobeton' ? 300 : 250;

  // Базовая цена за м²
  const basePrice = 6500 * ground.multiplier * house.wallLoad;

  // Если торф — добавляем выторфовку
  let extra = 0;
  if (session.ground === 'torf') extra = area * 1500; // 1500 ₽/м² на выторфовку
  if (session.ground === 'boloto') extra = area * 3000;

  const total = Math.round(area * basePrice + extra);
  const min = Math.round(total * 0.92);
  const max = Math.round(total * 1.08);

  return {
    area,
    thickness,
    min,
    max,
    breakdown: {
      bazovy: Math.round(area * basePrice),
      extra,
    },
  };
}

// === Обработчики сообщений ===
async function handleMessage(msg) {
  const chatId = msg.chat.id;
  const text = (msg.text || '').trim();

  if (text === '/start' || text === '/calc' || text === 'Начать') {
    sessions.set(chatId, { step: 'size' });
    return tgSend(
      chatId,
      `<b>Добро пожаловать в калькулятор плитного фундамента СК «Юрьевич»</b>\n\n` +
        `Отвечайте на 4 вопроса — получите расчёт стоимости с разбивкой по позициям и контактом инженера.\n\n` +
        `<b>Вопрос 1.</b> Какой размер плиты вам нужен?`,
      buildKeyboard([
        [
          { label: '6×6', data: 'size:6x6' },
          { label: '6×8', data: 'size:6x8' },
          { label: '8×8', data: 'size:8x8' },
        ],
        [
          { label: '8×10', data: 'size:8x10' },
          { label: '9×10', data: 'size:9x10' },
          { label: '10×10', data: 'size:10x10' },
        ],
        [
          { label: '10×12', data: 'size:10x12' },
          { label: '12×12', data: 'size:12x12' },
          { label: 'Другой', data: 'size:custom' },
        ],
      ])
    );
  }

  if (text === '/help') {
    return tgSend(
      chatId,
      `<b>Команды:</b>\n\n/calc — запустить калькулятор\n/contact — наши контакты\n/about — о компании\n\n` +
        `Вопросы можно задать сразу — мы ответим в течение часа в рабочее время.`
    );
  }

  if (text === '/contact') {
    return tgSend(
      chatId,
      `<b>СК «Юрьевич»</b>\n\n📞 +7 911 830-01-10\n🌐 sk-yurievich.ru\n📍 СПб, ул. Пионерстроя 23Б\n⏰ Пн-Сб 9-21, Вс 10-18`
    );
  }

  if (text === '/about') {
    return tgSend(
      chatId,
      `<b>СК «Юрьевич»</b>\n\nСемейная строительная компания. 3 брата Демченко, 239 завершённых объектов с 2018 года. ` +
        `Монолитные плитные фундаменты и дома из газобетона ЛСР в СПб и Ленобласти. 5★ на Авито (35 отзывов).\n\n` +
        `Гарантия 5 лет, договор с фикс-ценой, поэтапная оплата.`
    );
  }

  // Если у пользователя активная сессия и он шлёт текст — обрабатываем как ввод имени/телефона
  const session = sessions.get(chatId);
  if (session?.step === 'contact_name') {
    session.name = text;
    session.step = 'contact_phone';
    return tgSend(
      chatId,
      `Спасибо, ${text}!\n\n<b>Шаг 5.</b> Ваш телефон (для звонка инженера):`
    );
  }

  if (session?.step === 'contact_phone') {
    session.phone = text;
    return finalizeLead(chatId, session);
  }

  // Если просто текст без команды — направляем
  return tgSend(
    chatId,
    `Я понимаю команды:\n/calc — расчёт фундамента\n/contact — контакты\n/about — о нас`
  );
}

// === Обработчик callback (нажатия на кнопки) ===
async function handleCallback(cb) {
  const chatId = cb.message.chat.id;
  const data = cb.data;
  const session = sessions.get(chatId) || {};

  if (data.startsWith('size:')) {
    const size = data.slice(5);
    if (size === 'custom') {
      session.step = 'custom_size';
      sessions.set(chatId, session);
      return tgSend(chatId, 'Напишите размер в формате <code>9.5x11</code>');
    }
    const [l, w] = size.split('x').map(Number);
    session.length = l;
    session.width = w;
    session.step = 'ground';
    sessions.set(chatId, session);
    return tgSend(
      chatId,
      `<b>Вопрос 2.</b> Какой грунт на участке? (если не знаете — выберите «Не знаю», я подскажу для вашего района)`,
      buildKeyboard([
        [
          { label: '🏖 Пески', data: 'ground:pesok' },
          { label: '🌾 Суглинок', data: 'ground:suglinok' },
        ],
        [
          { label: '🏔 Глина', data: 'ground:glina' },
          { label: '🌳 Торф', data: 'ground:torf' },
        ],
        [
          { label: '💧 Болото', data: 'ground:boloto' },
          { label: '❓ Не знаю', data: 'ground:unknown' },
        ],
      ])
    );
  }

  if (data.startsWith('ground:')) {
    const g = data.slice(7);
    session.ground = g === 'unknown' ? 'suglinok' : g; // по умолчанию суглинок
    session.step = 'house';
    sessions.set(chatId, session);
    return tgSend(
      chatId,
      `<b>Вопрос 3.</b> Какие стены планируете?`,
      buildKeyboard([
        [
          { label: 'Каркас', data: 'house:karkas' },
          { label: 'Брус / СИП', data: 'house:brus' },
        ],
        [
          { label: 'Газобетон ЛСР', data: 'house:gazobeton' },
          { label: 'Кирпич', data: 'house:kirpich' },
        ],
      ])
    );
  }

  if (data.startsWith('house:')) {
    session.house = data.slice(6);
    session.step = 'result';
    sessions.set(chatId, session);

    const calc = calculate(session);
    const groundLabel = GROUNDS[session.ground]?.label || '—';
    const houseLabel = HOUSES[session.house]?.label || '—';

    const lines = [
      `<b>📐 Расчёт плитного фундамента</b>`,
      ``,
      `Размер: <b>${session.length}×${session.width} м</b> (${calc.area} м²)`,
      `Толщина: <b>${calc.thickness} мм</b>`,
      `Грунт: ${groundLabel}`,
      `Стены: ${houseLabel}`,
      ``,
      `<b>Примерная стоимость: ${calc.min.toLocaleString('ru-RU')} – ${calc.max.toLocaleString('ru-RU')} ₽</b>`,
      ``,
      `<i>Это онлайн-расчёт. Точная цена — после бесплатного выезда инженера и шурфа на ваш участок (1-3 дня).</i>`,
      ``,
      `<b>Получить точный расчёт?</b>`,
    ];

    return tgSend(
      chatId,
      lines.join('\n'),
      buildKeyboard([
        [{ label: '✅ Да, отправить инженера', data: 'lead:yes' }],
        [{ label: '🔄 Пересчитать', data: 'lead:redo' }],
        [{ label: '❌ Просто смотрел', data: 'lead:no' }],
      ])
    );
  }

  if (data === 'lead:yes') {
    session.step = 'contact_name';
    sessions.set(chatId, session);
    return tgSend(chatId, `<b>Шаг 4.</b> Как к вам обращаться? (имя)`);
  }

  if (data === 'lead:redo') {
    sessions.delete(chatId);
    return tgSend(chatId, 'Начнём заново. Напишите /calc');
  }

  if (data === 'lead:no') {
    sessions.delete(chatId);
    return tgSend(
      chatId,
      `Хорошо. Если будут вопросы — пишите /calc или зайдите на sk-yurievich.ru/kalkulyator/`
    );
  }
}

// === Финализация лида: отправка нам в TG ===
async function finalizeLead(chatId, session) {
  const calc = calculate(session);
  const lead = {
    name: session.name,
    phone: session.phone,
    size: `${session.length}×${session.width}`,
    area: calc.area,
    ground: GROUNDS[session.ground]?.label,
    house: HOUSES[session.house]?.label,
    priceMin: calc.min,
    priceMax: calc.max,
    chatId,
    source: 'fundament-bot',
    at: new Date().toISOString(),
  };

  // 1. Подтверждение клиенту
  await tgSend(
    chatId,
    `<b>✅ Заявка принята!</b>\n\n` +
      `Имя: ${lead.name}\n` +
      `Телефон: ${lead.phone}\n` +
      `Размер: ${lead.size} м (${lead.area} м²)\n` +
      `Примерная стоимость: ${lead.priceMin.toLocaleString('ru-RU')} – ${lead.priceMax.toLocaleString('ru-RU')} ₽\n\n` +
      `Инженер свяжется с вами в течение часа (рабочие часы Пн-Сб 9-21, Вс 10-18).\n\n` +
      `Если нужно срочно — звоните +7 911 830-01-10`
  );

  // 2. Отправка нам через /api/notify (CRM-точка)
  if (NOTIFY_PROXY_KEY && ADMIN_CHAT_ID) {
    const leadText = [
      `🔥 <b>НОВЫЙ ЛИД из TG-бота</b>`,
      ``,
      `<b>Имя:</b> ${lead.name}`,
      `<b>Телефон:</b> ${lead.phone}`,
      `<b>Размер:</b> ${lead.size} м (${lead.area} м²)`,
      `<b>Грунт:</b> ${lead.ground}`,
      `<b>Стены:</b> ${lead.house}`,
      `<b>Примерная цена:</b> ${lead.priceMin.toLocaleString('ru-RU')} – ${lead.priceMax.toLocaleString('ru-RU')} ₽`,
      ``,
      `<b>Связаться:</b> tg://user?id=${chatId}`,
    ].join('\n');

    try {
      await fetch(NOTIFY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: NOTIFY_PROXY_KEY,
          text: leadText,
          parse_mode: 'HTML',
        }),
      });
    } catch (e) {
      console.error('Не удалось отправить лид в админский чат:', e.message);
    }
  }

  // 3. Сохранение в файл (для backup)
  const leadsFile = path.join(process.cwd(), 'data/leads-bot.jsonl');
  fs.appendFileSync(leadsFile, JSON.stringify(lead) + '\n');

  sessions.delete(chatId);
}

// === Long polling ===
let lastUpdateId = 0;

async function poll() {
  try {
    const res = await fetch(`${API_BASE}/getUpdates?offset=${lastUpdateId + 1}&timeout=30`);
    const data = await res.json();
    if (!data.ok) {
      console.error('getUpdates fail:', data);
      return;
    }
    for (const update of data.result || []) {
      lastUpdateId = update.update_id;
      try {
        if (update.message) await handleMessage(update.message);
        else if (update.callback_query) await handleCallback(update.callback_query);
      } catch (e) {
        console.error('Ошибка обработки update:', e.message);
      }
    }
  } catch (e) {
    console.error('Polling error:', e.message);
    await new Promise((r) => setTimeout(r, 5000));
  }
}

(async () => {
  console.log('🤖 Fundament-бот СК «Юрьевич» запущен');
  console.log('Long polling activated...');

  while (true) {
    await poll();
  }
})();
