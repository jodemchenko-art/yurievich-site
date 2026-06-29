#!/usr/bin/env node
// Генерирует N SEO-статей через Gemini в JSON-формате для scripts/import-articles.js.
// Usage: GOOGLE_AI_STUDIO_KEY=... node scripts/generate-gemini.js [N] [outfile]
// Темы берёт из data/seo-backlog.json, дедуп по data/published.json.
const fs = require('fs');
const path = require('path');

const KEY = process.env.GOOGLE_AI_STUDIO_KEY;
const N = parseInt(process.argv[2] || '2', 10);
const OUT = process.argv[3] || '/tmp/gen.json';
const MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const ROOT = path.resolve(__dirname, '..');

if (!KEY) { console.error('NO GOOGLE_AI_STUDIO_KEY'); process.exit(1); }

const backlog = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/seo-backlog.json'), 'utf8'));
const published = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/published.json'), 'utf8'));
const done = new Set(published.map((p) => (p.primary_query || '').toLowerCase().trim()));

const todo = backlog
  .filter((t) => t.query && !done.has(t.query.toLowerCase().trim()))
  .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
  .slice(0, N);

if (!todo.length) { console.error('Нет новых тем в backlog'); process.exit(2); }

const FACTS = `КОМПАНИЯ: СК «Юрьевич» (семейная стройка, СПб+Ленобласть). Услуги: монолитный плитный фундамент под ключ (от 5500₽/м²), коробка и дом из газобетона ЛСР под ключ (от 38000₽/м²). База: пос. Песочный. Трасты: 239 завершённых объектов, 5.0★/35 отзывов Авито, партнёр ЛСР Газобетон, гарантия 5 лет, фикс-цена в договоре, оплата только по принятым этапам (предоплат на работы НЕТ). Братья (цитируй для живого голоса, варьируй, не в каждой статье): Юрий — руководитель проекта, Валерий — прораб, Евгений — технадзор/снабжение.
ОБЯЗАТЕЛЬНАЯ ФАКТУРА (НЕ выдумывай альтернатив): бетон М300 W6 F150, арматура А500С, толщина плиты 250-350мм по нагрузкам. ГОСТ/СП используй ТОЛЬКО эти и уместные: СП 50-101-2004, СП 22.13330.2016, СП 131.13330.2020, ГОСТ 26633-2015, ГОСТ 31108-2020, ГОСТ Р 52544-2006. Грунты ЛО (используй уместно): Лесколово/Гарболово/Стеклянный — торф 1.5-3.5м, УГВ 0.3-0.8м; Токсово/Кавголово/Юкки/Сертолово — камовые пески/супеси R0=2.5-3.5; Колтуши/Разметелево — моренные суглинки, пучинистые R0=2.0-2.5; Гатчина — карбонатные глины; Назия — болотистая низина; Тосно — пески.
ЗАПРЕЩЕНО: «лидер рынка/№1/лучшие», вода, выдуманные факты, эскроу.`;

const CATS = 'plitnyi-fundament, gazobeton, vybor-fundamenta, gruntovye-usloviya, tekhnologii, sezonnost, gid-zakazchika';

function buildPrompt(t) {
  return `${FACTS}

Напиши ОДНУ глубокую экспертную SEO-статью для блога sk-yurievich.ru по теме: "${t.query}".
Боль аудитории: ${t.target_pain || ''}

Требования:
- Русский, инфостиль, как практик-строитель (не копирайтер). Без воды и клише.
- Ответ на главный вопрос — в первых 2-3 предложениях (BLUF).
- Тело 1600-2200 слов. Структура: <h2>/<h3>, абзацы ≤5 строк, списки, минимум одна <table> где уместно, конкретные цифры/цены/ГОСТы.
- Встрой 1-2 факта компании естественно (239 объектов / грунты ЛО / гарантия 5 лет). Не рекламно.
- FAQ НЕ дублируй в тело — отдельным полем faq.

Верни СТРОГО валидный JSON (без markdown и без тройных кавычек) с полями:
{
 "slug": "латиница-через-дефис по теме, без стоп-слов и года",
 "title": "H1 страницы с ключом, естественно",
 "meta_title": "до 70 символов, ключ в начале, в конце · СК Юрьевич",
 "meta_description": "150-165 символов, с ключом и выгодой",
 "primary_query": "${t.query}",
 "category": "ровно одна из: ${CATS}",
 "keywords": ["5-6 низкочастотных ключей по теме"],
 "word_count": <число слов в html>,
 "faq": [{"q":"вопрос","a":"ответ 2-4 предложения с конкретикой"} ... 5-6 штук],
 "html": "тело статьи в чистом HTML (<h2>,<h3>,<p>,<ul>,<ol>,<li>,<table>,<thead>,<tbody>,<tr>,<th>,<td>,<strong>). БЕЗ <h1>, БЕЗ <html>/<body>, без markdown."
}`;
}

async function generate(t) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`;
  const body = {
    contents: [{ parts: [{ text: buildPrompt(t) }] }],
    generationConfig: { temperature: 0.85, maxOutputTokens: 8192, responseMimeType: 'application/json' },
  };
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  if (!r.ok) throw new Error('Gemini HTTP ' + r.status + ' ' + (await r.text()).slice(0, 200));
  const d = await r.json();
  const txt = d.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!txt) throw new Error('пустой ответ Gemini');
  const a = JSON.parse(txt);
  if (!a.slug || !a.title || !a.html || !Array.isArray(a.faq) || !a.faq.length) {
    throw new Error('неполная статья: ' + t.query);
  }
  if ((a.html || '').split(/\s+/).length < 800) throw new Error('слишком короткая статья: ' + t.query);
  a.slug = String(a.slug).toLowerCase().replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  return a;
}

(async () => {
  const out = [];
  for (const t of todo) {
    try {
      out.push(await generate(t));
      console.error('✓ ' + t.query);
    } catch (e) {
      console.error('✗ ' + t.query + ': ' + e.message);
    }
  }
  if (!out.length) { console.error('Ничего не сгенерировано'); process.exit(3); }
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2));
  console.log(OUT + ' :: статей: ' + out.length);
})();
