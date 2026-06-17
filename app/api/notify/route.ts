import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// Прокси-эндпоинт для уведомлений из routines где api.telegram.org недоступен напрямую.
// POST /api/notify
// Body JSON: { key: string, text: string, parse_mode?: 'HTML'|'Markdown', chat_id?: string }
// Авторизация через секретный ключ (env NOTIFY_PROXY_KEY).

type NotifyPayload = {
  key?: string;
  text?: string;
  parse_mode?: 'HTML' | 'Markdown';
  chat_id?: string;
  disable_web_page_preview?: boolean;
  // Канальный TG-бот: две части, чтобы обойти Cloudflare WAF
  auth_a?: string;
  auth_b?: string;
};

export async function POST(request: Request) {
  let body: NotifyPayload = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const expectedKey = process.env.NOTIFY_PROXY_KEY;
  if (!expectedKey) {
    return NextResponse.json({ ok: false, error: 'proxy_not_configured' }, { status: 503 });
  }
  if (body.key !== expectedKey) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const text = (body.text || '').toString().trim();
  if (!text) {
    return NextResponse.json({ ok: false, error: 'empty_text' }, { status: 400 });
  }
  if (text.length > 4090) {
    return NextResponse.json({ ok: false, error: 'too_long' }, { status: 400 });
  }

  // Канальный бот передаётся в 2 частях (auth_a = bot_id, auth_b = secret) —
  // Cloudflare WAF блочит TG-токен паттерном `\d+:[A-Za-z0-9_-]{30,}` на edge.
  // Без auth_a/auth_b → дефолтный TELEGRAM_BOT_TOKEN (личные уведомления юзеру).
  let token = process.env.TELEGRAM_BOT_TOKEN;
  if ((body as any).auth_a && (body as any).auth_b) {
    token = `${(body as any).auth_a}:${(body as any).auth_b}`;
  }
  const chatId = body.chat_id || process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json({ ok: false, error: 'telegram_not_configured' }, { status: 503 });
  }

  const disablePreview = body.disable_web_page_preview ?? true;

  try {
    const tgResp = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: body.parse_mode || undefined,
        disable_web_page_preview: disablePreview,
      }),
    });
    const tgJson = await tgResp.json();
    if (!tgJson?.ok) {
      return NextResponse.json(
        { ok: false, error: 'telegram_error', tg: tgJson },
        { status: 502 }
      );
    }
    return NextResponse.json({ ok: true, message_id: tgJson.result?.message_id });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: 'telegram_unreachable', detail: String(err?.message || err) },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST { key, text, parse_mode?, chat_id? }' });
}
