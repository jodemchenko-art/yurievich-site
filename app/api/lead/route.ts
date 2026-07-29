import { NextResponse } from 'next/server';
import { appendFile, mkdir } from 'fs/promises';
import path from 'path';

export const runtime = 'nodejs';

type LeadPayload = {
  source?: string;
  answers?: Array<{ q: string; a: string }>;
  contact?: { name?: string; phone?: string; contactType?: string };
  comment?: string;
  page?: string;
  // CTA внутри статей шлёт имя и телефон плоско, без вложенного contact
  name?: string;
  phone?: string;
};

/**
 * Приём заявки.
 *
 * Две причины, по которым заявка могла пропасть молча:
 *
 * 1. Сообщение уходило с `parse_mode: 'Markdown'`, а внутрь подставлялись имя
 *    и комментарий клиента. Один символ `_`, `*` или `[` в тексте — Telegram
 *    отвечает 400 и не доставляет. Ответ Telegram при этом никто не смотрел.
 *    Шлём обычным текстом: жирный шрифт не стоит потерянной заявки.
 * 2. Роут всегда отвечал `ok: true`, даже когда Telegram отказал: клиент видел
 *    «спасибо», а заявки не существовало нигде. Теперь каждая заявка сперва
 *    ложится в журнал на диск и только потом уходит в Telegram — журнал
 *    переживает и падение бота, и смену токена.
 */

const LEADS_FILE = path.join(process.cwd(), 'data', 'leads.jsonl');

async function saveToJournal(entry: Record<string, unknown>) {
  try {
    await mkdir(path.dirname(LEADS_FILE), { recursive: true });
    await appendFile(LEADS_FILE, JSON.stringify(entry) + '\n', 'utf8');
    return true;
  } catch (err) {
    console.error('[LEAD] journal write failed:', err);
    return false;
  }
}

async function sendToTelegram(token: string, chatId: string, text: string) {
  // Две попытки: сетевой сбой по дороге к api.telegram.org — обычное дело.
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      });
      if (res.ok) return true;
      console.error(`[LEAD] telegram ${res.status}:`, (await res.text()).slice(0, 300));
    } catch (err) {
      console.error(`[LEAD] telegram attempt ${attempt} failed:`, err);
    }
  }
  return false;
}

export async function POST(request: Request) {
  let body: LeadPayload = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const name = body.contact?.name || body.name;
  const phone = body.contact?.phone || body.phone;

  const lines: string[] = ['🆕 Новая заявка с сайта'];
  if (body.source) lines.push(`Источник: ${body.source}`);
  if (name) lines.push(`Имя: ${name}`);
  if (phone) lines.push(`Телефон: ${phone}`);
  if (body.contact?.contactType) lines.push(`Связь: ${body.contact.contactType}`);
  if (body.comment) lines.push(`Комментарий: ${body.comment}`);
  if (body.answers?.length) {
    lines.push('', 'Ответы квиза:');
    for (const { q, a } of body.answers) lines.push(`• ${q} → ${a}`);
  }
  if (body.page) lines.push('', `Страница: ${body.page}`);

  const message = lines.join('\n');

  // Журнал пишем всегда и до отправки — это последняя линия обороны.
  const saved = await saveToJournal({
    at: new Date().toISOString(),
    source: body.source ?? null,
    name: name ?? null,
    phone: phone ?? null,
    comment: body.comment ?? null,
    answers: body.answers ?? null,
    page: body.page ?? null,
  });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  let delivered = false;
  if (token && chatId) {
    delivered = await sendToTelegram(token, chatId, message);
  } else {
    console.log('[LEAD]', message);
  }

  // Заявка потеряна, только если её нет ни в Telegram, ни в журнале.
  if (!delivered && !saved) {
    return NextResponse.json({ ok: false, error: 'not_delivered' }, { status: 502 });
  }

  return NextResponse.json({ ok: true, delivered });
}
