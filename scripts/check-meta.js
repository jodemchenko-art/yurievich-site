#!/usr/bin/env node
// scripts/check-meta.js — проверка метаданных ЖИВОГО сайта кодом, а не глазами.
// Обходит все URL из sitemap и валит сборку, если найдены дефекты сниппетов.
//
// Зачем: 11.09.2026 замер выдачи Яндекса показал, что он вырезает ★ из Title
// (в выдаче висела голая «5»), обрезает Title длиннее ~58 символов и целиком
// игнорирует description со спецсимволами (☎ ★ …), подставляя текст со страницы.
//
// Запуск: node scripts/check-meta.js [https://www.sk-yurievich.ru]
//         node scripts/check-meta.js http://127.0.0.1:3000   (после next start)

const BASE = process.argv[2] || 'https://www.sk-yurievich.ru';
const TITLE_MAX = 75;      // с брендом « · СК Юрьевич»; видимая часть Яндекса ~58, Google ~60
const TITLE_CORE_MAX = 62; // часть до бренда — то, что реально видно; цель 50–60
const DESC_MIN = 120;
const DESC_MAX = 200;
const BAD_CHARS = /[★☆⭐☎✓✔🔥…→•]/;
const BAD_CASE = /\bв (В[бвгджзклмнпрстфхцчшщ]|Ф[бвгджзклмнпрстфхцчшщ])/; // «в Всеволожском» → «во Всеволожском»

const pick = (html, re) => {
  const m = html.match(re);
  return m ? m[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#x27;/g, "'").replace(/&nbsp;/g, ' ').trim() : '';
};

async function main() {
  const sm = await (await fetch(`${BASE}/sitemap.xml`)).text();
  const urls = [...sm.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].replace('https://www.sk-yurievich.ru', BASE));
  const rows = [];
  const errors = [];
  const seenTitle = new Map();
  const seenDesc = new Map();

  const q = urls.slice();
  await Promise.all(Array.from({ length: 8 }, async () => {
    while (q.length) {
      const url = q.shift();
      let html;
      try {
        html = await (await fetch(url, { headers: { 'user-agent': 'check-meta' } })).text();
      } catch (e) {
        errors.push(`${url}: fetch failed ${e.message}`);
        continue;
      }
      const title = pick(html, /<title[^>]*>([^<]*)<\/title>/i);
      const desc = pick(html, /<meta[^>]+name="description"[^>]+content="([^"]*)"/i);
      const h1s = [...html.matchAll(/<h1[\s>]/gi)].length;
      const h1 = pick(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i).replace(/<[^>]+>/g, '');
      const canonical = pick(html, /<link[^>]+rel="canonical"[^>]+href="([^"]*)"/i);
      const og = pick(html, /<meta[^>]+property="og:image"[^>]+content="([^"]*)"/i);
      const core = title.replace(/\s*[·|—–]\s*СК Юрьевич\s*$/, '');
      const path = url.replace(BASE, '') || '/';
      rows.push({ path, title, desc, h1 });

      const err = (m) => errors.push(`${path}: ${m}`);
      if (!title) err('нет <title>');
      if (!desc) err('нет description');
      if (title.length > TITLE_MAX) err(`title ${title.length} > ${TITLE_MAX}: «${title}»`);
      if (core.length > TITLE_CORE_MAX) err(`title без бренда ${core.length} > ${TITLE_CORE_MAX}: «${core}»`);
      if (desc && (desc.length < DESC_MIN || desc.length > DESC_MAX)) err(`description ${desc.length} (норма ${DESC_MIN}–${DESC_MAX})`);
      if (BAD_CHARS.test(title)) err(`спецсимвол в title: «${title}»`);
      if (BAD_CHARS.test(desc)) err(`спецсимвол в description: «${desc}»`);
      if ((title.match(/Юрьевич/g) || []).length > 1) err(`бренд дважды в title: «${title}»`);
      if (BAD_CASE.test(title) || BAD_CASE.test(desc) || BAD_CASE.test(h1)) err('предлог «в» перед В/Ф+согласная — нужно «во»');
      if (/СПбе|ЛОе/.test(title + desc + h1)) err('склонение аббревиатуры («в СПбе»)');
      if (h1s !== 1) err(`h1 на странице: ${h1s} (нужен ровно 1)`);
      if (/[а-яё][А-ЯЁ]/.test(h1)) err(`H1 разорван тегом, слова слиплись: «${h1}»`);
      if (canonical && canonical !== url.replace(BASE, 'https://www.sk-yurievich.ru')) err(`canonical ${canonical} ≠ url`);
      if (!og) err('нет og:image');
      if (seenTitle.has(title)) err(`дубль title с ${seenTitle.get(title)}`); else seenTitle.set(title, path);
      if (seenDesc.has(desc)) err(`дубль description с ${seenDesc.get(desc)}`); else seenDesc.set(desc, path);
    }
  }));

  console.log(`Проверено URL: ${rows.length}`);
  if (errors.length) {
    console.log(`\n❌ Дефектов: ${errors.length}\n` + errors.sort().join('\n'));
    process.exit(1);
  }
  console.log('✅ Метаданные чистые: длины, символы, падежи, H1, canonical, og:image, дубли.');
}

main().catch((e) => { console.error(e); process.exit(1); });
