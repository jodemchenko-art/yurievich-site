import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

// IndexNow proxy. Принимает массив URL → пингует api.indexnow.org
// (Яндекс/Bing/Naver) мгновенно. Бесплатно, неограниченно.
//
// POST /api/indexnow  { key, urls: ["https://...", ...] }
// Ключ: NOTIFY_PROXY_KEY (тот же что у /api/notify)
//
// IndexNow требует чтобы по URL https://www.sk-yurievich.ru/<KEY>.txt
// возвращался текст этого же ключа. Файл уже лежит в public/.

const INDEXNOW_KEY = process.env.INDEXNOW_KEY || 'ea95e0754407dbfd9342b191f26ec2c7';

export async function POST(request: Request) {
  let body: { key?: string; urls?: string[] } = {};
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'bad_json' }, { status: 400 });
  }

  const expectedKey = process.env.NOTIFY_PROXY_KEY;
  if (!expectedKey || body.key !== expectedKey) {
    return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 });
  }

  const urls = (body.urls || []).filter((u) => typeof u === 'string' && u.startsWith('https://'));
  if (urls.length === 0) {
    return NextResponse.json({ ok: false, error: 'no_urls' }, { status: 400 });
  }
  if (urls.length > 10000) {
    return NextResponse.json({ ok: false, error: 'too_many_urls' }, { status: 400 });
  }

  // Один URL — bulk-формат принимает Яндекс
  // ВАЖНО: host, keyLocation и URL в urlList должны быть на ОДНОМ домене
  // (канонический у нас — С www, см. lib/site.ts → SITE.url)
  const payload = {
    host: 'www.sk-yurievich.ru',
    key: INDEXNOW_KEY,
    keyLocation: `https://www.sk-yurievich.ru/${INDEXNOW_KEY}.txt`,
    // нормализуем любой адрес к www-канону (и голый, и www → www)
    urlList: urls.map((u) => u.replace(/^https:\/\/(www\.)?sk-yurievich\.ru/, 'https://www.sk-yurievich.ru')),
  };

  try {
    // Яндекс / IndexNow consortium endpoint
    const r = await fetch('https://yandex.com/indexnow', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    const text = await r.text();
    return NextResponse.json({ ok: r.ok, status: r.status, response: text.slice(0, 500) });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: 'fetch_failed', detail: String(err?.message || err) },
      { status: 502 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ ok: true, hint: 'POST { key, urls: [...] }' });
}
