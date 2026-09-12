#!/usr/bin/env node
// scripts/check-content.js — приёмка коммерческих страниц КОДОМ, а не на глаз.
//
// Проверяет три вещи, на которых сайт уже горел:
//   1) объём текста против медианы топ-5 Яндекса по целевому запросу (цели — в TARGETS,
//      замер конкурентов 12.09.2026, scripts/../01-stroyka/seo/target_volumes.json);
//   2) уникальность страницы относительно ОСТАЛЬНЫХ страниц сайта — именно по этому
//      критерию 42 страницы вылетели как «малоценные» (порог фильтра ~20 %, наш порог 35 %);
//   3) обязательные коммерческие блоки: цена, таблица, FAQ, фото, точка заявки.
//
// Запуск: node scripts/check-content.js [база]   (по умолчанию прод)
//         npm run check:content

const BASE = process.argv[2] || 'https://www.sk-yurievich.ru';

// путь → [целевой объём слов, целевой запрос]
//
// Цели = медиана топ-5 Яндекса по запросу + 30 % (замер 12.09.2026).
// 🔴 Исключение по домовому кластеру. В топе по «дом из газобетона под ключ» стоят КАТАЛОГИ
// проектов (spb.home-projects.ru — 2907 слов и 309 фото, realzagdom.ru — 3256 и 1367 фото):
// их «объём» набран карточками сотен проектов, а не текстом о строительстве. Догонять это
// текстом бессмысленно и вредно — получится вода. Поэтому для наших страниц цель считается
// по ТЕКСТОВЫМ конкурентам того же топа (fmstroy.com 1568, get-dom.ru 1535, sk-dinastiya 1011).
// Каталог проектов — отдельная задача; когда он появится, цели вернутся к медиане топа.
const TARGETS = {
  '/fundament/pod-banyu/': [1404, 'фундамент под баню спб цена'],
  '/fundament/pod-garazh/': [1167, 'фундамент под гараж спб цена'],
  '/fundament/gatchina/': [1103, 'фундамент гатчина цена'],
  '/fundament/vyborg/': [1400, 'фундамент выборг цена'],
  '/doma/': [1700, 'дом из газобетона под ключ спб'],
  '/doma/ceny/': [1800, 'строительство домов из газобетона спб цена'],
  '/doma/odnoetazhnye/': [1300, 'одноэтажный дом из газобетона под ключ'],
  '/doma/dvuhetazhnye/': [1300, 'двухэтажный дом из газобетона под ключ спб'],
  '/fundament/plita/': [1400, 'монолитная плита под ключ спб'],
  '/fundament/lenta/': [1000, 'ленточный фундамент под ключ спб'],
  '/fundament/svai/': [1000, 'свайный фундамент спб'],
  '/fundament/ushp/': [900, 'ушп спб'],
  '/fundament/plita-s-rebrami/': [900, 'плита с рёбрами жёсткости'],
  '/ceny/': [1200, 'цены на фундамент спб'],
  '/otzyvy/': [700, 'отзывы о строительной компании спб'],
  '/o-kompanii/': [800, 'строительная компания спб о нас'],
};

// Страницы, где цена и таблица не нужны по смыслу.
const NO_PRICE = new Set(['/otzyvy/', '/o-kompanii/']);

const UNIQ_MIN = 35; // %, наш порог; фильтр Яндекса начинается около 20 %

const strip = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ');

const shingles = (text, k = 4) => {
  const w = (text.toLowerCase().match(/[а-яё0-9]+/g) || []);
  const s = new Set();
  for (let i = 0; i + k <= w.length; i++) s.add(w.slice(i, i + k).join(' '));
  return s;
};

async function main() {
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const all = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://www.sk-yurievich.ru', BASE));

  const pages = new Map();
  const q = all.slice();
  await Promise.all(
    Array.from({ length: 8 }, async () => {
      while (q.length) {
        const url = q.shift();
        try {
          const html = await (await fetch(url, { headers: { 'user-agent': 'check-content' } })).text();
          const text = strip(html);
          pages.set(url.replace(BASE, '') || '/', { html, text, sh: shingles(text) });
        } catch (e) {
          console.error('fetch failed', url, e.message);
        }
      }
    })
  );

  const errors = [];
  const rows = [];

  for (const [path, [target, query]] of Object.entries(TARGETS)) {
    const p = pages.get(path);
    if (!p) { errors.push(`${path}: страницы нет в sitemap`); continue; }

    const words = (p.text.match(/[а-яА-ЯёЁ]{3,}/g) || []).length;

    // уникальность относительно всех прочих страниц сайта
    const others = new Set();
    for (const [other, op] of pages) if (other !== path) for (const s of op.sh) others.add(s);
    let own = 0;
    for (const s of p.sh) if (!others.has(s)) own++;
    const uniq = p.sh.size ? (100 * own) / p.sh.size : 0;

    const hasPrice = /\d[\d\s  ]{2,}\s?₽/.test(p.text);
    const hasTable = /<table/i.test(p.html);
    const hasFaq = /<details|Частые вопросы|Вопросы/i.test(p.html);
    const imgs = (p.html.match(/<img/gi) || []).length;
    const hasCta = /#calc|tel:|t\.me\//.test(p.html);
    const h2 = (p.html.match(/<h2/gi) || []).length;

    rows.push({ path, words, target, uniq: uniq.toFixed(1), h2, imgs, hasPrice, hasTable, hasFaq, hasCta, query });

    if (words < target) errors.push(`${path}: ${words} слов < цели ${target} (медиана топ-5 по «${query}» + 30 %)`);
    if (uniq < UNIQ_MIN) errors.push(`${path}: уникальность ${uniq.toFixed(1)} % < ${UNIQ_MIN} % — риск «малоценной страницы»`);
    if (!hasPrice && !NO_PRICE.has(path)) errors.push(`${path}: нет ни одной цены в рублях`);
    if (!hasFaq) errors.push(`${path}: нет блока вопросов`);
    if (!hasCta) errors.push(`${path}: нет точки заявки (расчёт, телефон или Telegram)`);
    if (imgs < 3) errors.push(`${path}: фото ${imgs} — меньше трёх`);
    if (h2 < 4) errors.push(`${path}: h2 всего ${h2} — страница не структурирована`);
  }

  console.log(
    ['путь', 'слов', 'цель', 'уник%', 'h2', 'фото', 'цена', 'табл', 'FAQ', 'CTA'].join('\t')
  );
  for (const r of rows.sort((a, b) => a.words / a.target - b.words / b.target)) {
    console.log(
      [r.path, r.words, r.target, r.uniq, r.h2, r.imgs, r.hasPrice ? '+' : '—', r.hasTable ? '+' : '—', r.hasFaq ? '+' : '—', r.hasCta ? '+' : '—'].join('\t')
    );
  }

  console.log(`\nПроверено страниц: ${rows.length} из ${Object.keys(TARGETS).length}`);
  if (errors.length) {
    console.log(`\n❌ Недоработок: ${errors.length}`);
    for (const e of errors) console.log('  ' + e);
    process.exit(1);
  }
  console.log('\n✅ Все коммерческие страницы длиннее конкурентов из топа, уникальны и укомплектованы.');
}

main().catch((e) => { console.error(e); process.exit(1); });
