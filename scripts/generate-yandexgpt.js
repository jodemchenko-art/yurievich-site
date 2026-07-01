#!/usr/bin/env node
// Генерирует N SEO-статей через YandexGPT в JSON-формате для scripts/import-articles.js.
// РАБОТАЕТ НА РФ-VPS (в отличие от Gemini, который заблокирован с РФ-IP).
// Usage: YANDEX_SA_KEY_FILE=/path/key.json YANDEX_FOLDER_ID=... node scripts/generate-yandexgpt.js [N] [outfile]
// Темы берёт из data/seo-backlog.json, дедуп по data/published.json.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const SA_KEY_FILE = process.env.YANDEX_SA_KEY_FILE;
const FOLDER = process.env.YANDEX_FOLDER_ID || 'b1g3v9fgrhpkmq7eflhu';
const MODEL_NAME = process.env.YANDEX_GPT_MODEL || 'yandexgpt/latest'; // полная модель для качества
const N = parseInt(process.argv[2] || '2', 10);
const OUT = process.argv[3] || '/tmp/gen-yagpt.json';
const ROOT = path.resolve(__dirname, '..');

if (!SA_KEY_FILE || !fs.existsSync(SA_KEY_FILE)) { console.error('NO YANDEX_SA_KEY_FILE'); process.exit(1); }

// --- IAM token из сервисного аккаунта (JWT PS256 -> обмен на IAM) ---
function b64url(buf) { return Buffer.from(buf).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }

async function getIamToken() {
  const sa = JSON.parse(fs.readFileSync(SA_KEY_FILE, 'utf8'));
  let pem = sa.private_key;
  const i = pem.indexOf('-----BEGIN');
  if (i > 0) pem = pem.slice(i); // отрезаем «PLEASE DO NOT REMOVE…»
  const now = Math.floor(Date.now() / 1000);
  const header = { alg: 'PS256', typ: 'JWT', kid: sa.id };
  const payload = {
    aud: 'https://iam.api.cloud.yandex.net/iam/v1/tokens',
    iss: sa.service_account_id,
    iat: now,
    exp: now + 3600,
  };
  const signingInput = b64url(JSON.stringify(header)) + '.' + b64url(JSON.stringify(payload));
  const signer = crypto.createSign('RSA-SHA256');
  signer.update(signingInput);
  const signature = signer.sign({ key: pem, padding: crypto.constants.RSA_PKCS1_PSS_PADDING, saltLength: crypto.constants.RSA_PSS_SALTLEN_DIGEST });
  const jwt = signingInput + '.' + b64url(signature);

  const r = await fetch('https://iam.api.cloud.yandex.net/iam/v1/tokens', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ jwt }),
  });
  if (!r.ok) throw new Error('IAM HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const d = await r.json();
  if (!d.iamToken) throw new Error('нет iamToken в ответе IAM');
  return d.iamToken;
}

const backlog = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/seo-backlog.json'), 'utf8'));
const published = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/published.json'), 'utf8'));
const done = new Set(published.map((p) => (p.primary_query || '').toLowerCase().trim()));

const todo = backlog
  .filter((t) => t.query && !done.has(t.query.toLowerCase().trim()))
  .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
  .slice(0, N);

if (!todo.length) { console.error('Нет новых тем в backlog'); process.exit(2); }

const FACTS = `КОМПАНИЯ: СК «Юрьевич» (семейная стройка, СПб+Ленобласть). Услуги: монолитный плитный фундамент под ключ (от 5500₽/м²), а также ленточный и свайный фундамент под заказ; коробка и дом из газобетона ЛСР под ключ (от 38000₽/м²). База: пос. Песочный. Трасты: 239 завершённых объектов, 5.0★/35 отзывов Авито, партнёр ЛСР Газобетон, гарантия 5 лет, фикс-цена в договоре, оплата только по принятым этапам (предоплат на работы НЕТ). Братья (цитируй для живого голоса, варьируй, не в каждой статье): Юрий — руководитель проекта, Валерий — прораб, Евгений — технадзор/снабжение.
ОБЯЗАТЕЛЬНАЯ ФАКТУРА (НЕ выдумывай альтернатив): бетон М300 W6 F150, арматура А500С, толщина плиты 250-350мм по нагрузкам. Плита 10×10 (100 м²) под ключ ≈ 550 000 ₽. Малые плиты до 50 м² — 7000-9000₽/м². ГОСТ/СП используй ТОЛЬКО эти и уместные: СП 50-101-2004, СП 22.13330.2016, СП 131.13330.2020, ГОСТ 26633-2015, ГОСТ 31108-2020, ГОСТ Р 52544-2006. Грунты ЛО (используй уместно): Лесколово/Гарболово/Стеклянный — торф 1.5-3.5м, УГВ 0.3-0.8м; Токсово/Кавголово/Юкки/Сертолово — камовые пески/супеси R0=2.5-3.5; Колтуши/Разметелево — моренные суглинки, пучинистые R0=2.0-2.5; Гатчина — карбонатные глины; Назия — болотистая низина; Тосно — пески.
ЗАПРЕЩЕНО: «лидер рынка/№1/лучшие», вода, выдуманные факты, эскроу.`;

const CATS = 'plitnyi-fundament, gazobeton, vybor-fundamenta, gruntovye-usloviya, tekhnologii, sezonnost, gid-zakazchika';

function extractJson(txt) {
  let s = String(txt).trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '').trim();
  const a = s.indexOf('{'); const b = s.lastIndexOf('}');
  if (a >= 0 && b > a) s = s.slice(a, b + 1);
  return JSON.parse(s);
}

// один вызов YandexGPT
async function llm(iam, system, user, maxTokens, temperature) {
  const body = {
    modelUri: `gpt://${FOLDER}/${MODEL_NAME}`,
    completionOptions: { stream: false, temperature: temperature ?? 0.6, maxTokens: maxTokens || 2000 },
    messages: [
      { role: 'system', text: system },
      { role: 'user', text: user },
    ],
  };
  const r = await fetch('https://llm.api.cloud.yandex.net/foundationModels/v1/completion', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + iam, 'Content-Type': 'application/json', 'x-folder-id': FOLDER },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error('YandexGPT HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const d = await r.json();
  const txt = d.result?.alternatives?.[0]?.message?.text;
  if (!txt) throw new Error('пустой ответ YandexGPT');
  return txt;
}

// YandexGPT краткий → собираем длинную статью по секциям.
async function generate(iam, t) {
  // 1) ПЛАН статьи
  const planSys = 'Ты — инженер-строитель и SEO-редактор. Отвечаешь строго валидным JSON, без markdown.';
  const planUser = `${FACTS}

Составь план экспертной SEO-статьи для блога sk-yurievich.ru по теме: "${t.query}".
Боль аудитории: ${t.target_pain || ''}

Верни ТОЛЬКО JSON:
{
 "slug": "латиница-через-дефис, без года",
 "title": "H1 с ключом, естественно",
 "meta_title": "до 70 символов, ключ в начале, в конце · СК Юрьевич",
 "meta_description": "150-165 символов, ключ + выгода",
 "category": "ровно одна из: ${CATS}",
 "keywords": ["5-6 низкочастотных ключей"],
 "intro": "вводный абзац 3-4 предложения, ответ на главный вопрос в первых предложениях (BLUF), чистый текст без тегов",
 "sections": [ {"h2":"заголовок раздела","points":"через ; что раскрыть: 2-4 пункта с конкретикой"} ...ровно 8 разделов ],
 "faq": [ {"q":"вопрос","a":"ответ 2-4 предложения с цифрами"} ...5-6 штук ]
}`;
  const plan = extractJson(await llm(iam, planSys, planUser, 3000, 0.5));
  if (!plan.slug || !plan.title || !Array.isArray(plan.sections) || plan.sections.length < 5 || !Array.isArray(plan.faq) || !plan.faq.length) {
    throw new Error('плохой план: ' + t.query);
  }

  // 2) каждую секцию пишем отдельным запросом (YandexGPT силён в коротких кусках)
  const secSys = 'Ты — инженер-практик. Пишешь по-русски, инфостилем, конкретно, только факты. Возвращаешь чистый HTML без markdown и без <h1>.';
  const parts = [];
  for (const s of plan.sections) {
    const secUser = `${FACTS}

Статья: "${t.query}". Пишем ОДИН раздел статьи.
Заголовок раздела: "${s.h2}".
Раскрыть: ${s.points || ''}

Требования:
- 250-350 слов, инфостиль, как строитель-практик. Без воды, без вступлений «в этой статье».
- Конкретные цифры, марки (М300, А500С), ГОСТ/СП где уместно, грунты ЛО.
- Формат: <h2>${s.h2}</h2> затем <p>… абзацы ≤5 строк, при необходимости <ul>/<li> или маленькая <table>.
Верни ТОЛЬКО HTML этого раздела (начни с <h2>). Без markdown, без <h1>, без пояснений.`;
    let html = await llm(iam, secSys, secUser, 1500, 0.6);
    html = String(html).replace(/^```(?:html)?\s*/i, '').replace(/```\s*$/, '').trim();
    parts.push(html);
  }

  const introHtml = plan.intro ? `<p>${String(plan.intro).replace(/<\/?p>/g, '').trim()}</p>\n` : '';
  const html = introHtml + parts.join('\n');

  const a = {
    slug: String(plan.slug).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, ''),
    title: plan.title,
    meta_title: plan.meta_title,
    meta_description: plan.meta_description,
    primary_query: t.query,
    category: plan.category,
    keywords: plan.keywords || [],
    faq: plan.faq,
    html,
    word_count: html.split(/\s+/).length,
  };
  if (!a.slug || !a.title || !a.html || !a.faq.length) throw new Error('неполная статья: ' + t.query);
  if (a.word_count < 900) throw new Error('слишком короткая статья (' + a.word_count + ' слов): ' + t.query);
  return a;
}

(async () => {
  const iam = await getIamToken();
  const out = [];
  for (const t of todo) {
    try {
      out.push(await generate(iam, t));
      console.error('✓ ' + t.query);
    } catch (e) {
      console.error('✗ ' + t.query + ': ' + e.message);
    }
  }
  if (!out.length) { console.error('Ничего не сгенерировано'); process.exit(3); }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(OUT + ' :: статей: ' + out.length);
})();
