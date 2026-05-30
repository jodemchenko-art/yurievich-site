import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

type LeadPayload = {
  source?: string;
  answers?: Array<{ q: string; a: string }>;
  contact?: { name?: string; phone?: string; contactType?: string };
  comment?: string;
  page?: string;
};

export async function POST(request: Request) {
  let body: LeadPayload = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  const lines: string[] = [];
  lines.push(`🆕 *Новая заявка с сайта*`);
  if (body.source) lines.push(`*Источник:* ${body.source}`);
  if (body.contact?.name) lines.push(`*Имя:* ${body.contact.name}`);
  if (body.contact?.phone) lines.push(`*Телефон:* ${body.contact.phone}`);
  if (body.contact?.contactType) lines.push(`*Связь:* ${body.contact.contactType}`);
  if (body.comment) lines.push(`*Комментарий:* ${body.comment}`);
  if (body.answers?.length) {
    lines.push(`\n*Ответы квиза:*`);
    for (const { q, a } of body.answers) lines.push(`• ${q} → ${a}`);
  }
  if (body.page) lines.push(`\n_Страница: ${body.page}_`);

  const message = lines.join('\n');

  // If Telegram is configured, send notification
  if (token && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: 'Markdown',
        }),
      });
    } catch (err) {
      console.error('Telegram send failed:', err);
    }
  } else {
    // Dev fallback: log to server console
    console.log('[LEAD]', message);
  }

  return NextResponse.json({ ok: true });
}
