#!/usr/bin/env node
// Импортирует JSON-выход воркфлоу (массив финальных статей) в .ts модули и обновляет lib/articles/index.ts.
//
// Использование:
//   node scripts/import-articles.js input.json
// Где input.json — массив объектов FINAL_SCHEMA из workflow.

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.resolve(__dirname, '..');
const STOCK_DIR = path.join(ROOT, 'public/images/stock');
const ARTICLES_DIR = path.join(ROOT, 'lib/articles');
const INDEX_FILE = path.join(ARTICLES_DIR, 'index.ts');

const STOCK_FILES = fs
  .readdirSync(STOCK_DIR)
  .filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f));

function pickStock(slug, salt = 0) {
  // Детерминированный выбор стоковой картинки по slug
  const hash = crypto
    .createHash('sha1')
    .update(slug + ':' + salt)
    .digest('hex');
  const idx = parseInt(hash.slice(0, 8), 16) % STOCK_FILES.length;
  return '/images/stock/' + STOCK_FILES[idx];
}

function pickCategory(article) {
  const slug = article.slug || '';
  const title = (article.title || '').toLowerCase();
  if (/gazobeton|газобетон/i.test(slug + ' ' + title)) return 'gazobeton';
  if (/vybor|сравнен|или/i.test(slug + ' ' + title)) return 'vybor-fundamenta';
  if (/zimni|зимн|sezon|сезон/i.test(slug + ' ' + title)) return 'sezonnost';
  if (/grunt|грунт|torf|болот|swamp/i.test(slug + ' ' + title)) return 'gruntovye-usloviya';
  if (/tehnolog|tekhnolog|армирован|гидроизол/i.test(slug + ' ' + title)) return 'tekhnologii';
  if (/plit|плита|плитн|fundament/i.test(slug + ' ' + title)) return 'plitnyi-fundament';
  return 'gid-zakazchika';
}

function detectRegion(article) {
  const titleSlug = (article.slug + ' ' + article.title).toLowerCase();
  const regions = [
    ['всеволожск', 'Всеволожский район'],
    ['vsevolozh', 'Всеволожский район'],
    ['гатчин', 'Гатчинский район'],
    ['gatchin', 'Гатчинский район'],
    ['выборг', 'Выборгский район'],
    ['vyborg', 'Выборгский район'],
    ['тосн', 'Тосненский район'],
    ['tosn', 'Тосненский район'],
    ['киров', 'Кировский район'],
    ['kirov', 'Кировский район'],
    ['приозерск', 'Приозерский район'],
    ['priozersk', 'Приозерский район'],
    ['ломоносов', 'Ломоносовский район'],
    ['lomonosov', 'Ломоносовский район'],
    ['курорт', 'Курортный район'],
    ['kurort', 'Курортный район'],
  ];
  for (const [needle, label] of regions) {
    if (titleSlug.includes(needle)) return label;
  }
  return undefined;
}

function calcReadingTime(html, wordCount) {
  const wc = wordCount && Number.isFinite(wordCount) ? wordCount : (html || '').split(/\s+/).length;
  return Math.max(3, Math.round(wc / 200));
}

function replaceImagesWithStock(html, slug) {
  // Подменяем все ссылки на /images/articles/{slug}-N.jpg на детерминированные стоки
  let n = 1;
  return (html || '').replace(/<img\s+([^>]*?)src=["'][^"']+["']([^>]*?)>/gi, (match) => {
    const altMatch = match.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : '';
    const stock = pickStock(slug, n++);
    return `<img src="${stock}" alt="${alt}" loading="lazy" />`;
  });
}

function tsEscape(s) {
  if (typeof s !== 'string') return '';
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$/g, '\\$');
}

function moduleNameFromSlug(slug) {
  // Конвертируем kebab-case в camelCase для имени переменной
  return slug.replace(/-([a-z0-9])/g, (_, c) => c.toUpperCase());
}

function extractTitleWords(title) {
  const words = (title || '').toLowerCase().match(/[а-яёa-z\d]+/g) || [];
  return new Set(words.filter((w) => w.length >= 4));
}

function readExistingTitles() {
  // Возвращает [{slug, words}] для всех уже опубликованных статей
  return fs.readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== '_types.ts')
    .map((f) => {
      const slug = f.replace(/\.ts$/, '');
      try {
        const content = fs.readFileSync(path.join(ARTICLES_DIR, f), 'utf8');
        const m = content.match(/title:\s*"([^"]+)"/);
        return { slug, words: extractTitleWords(m ? m[1] : '') };
      } catch {
        return { slug, words: new Set() };
      }
    });
}

function computeRelatedSlugs(currentSlug, title) {
  const currentWords = extractTitleWords(title);
  if (currentWords.size === 0) return [];

  const existing = readExistingTitles().filter((a) => a.slug !== currentSlug);
  const scored = existing
    .map((a) => {
      let overlap = 0;
      for (const w of currentWords) if (a.words.has(w)) overlap++;
      return { slug: a.slug, overlap };
    })
    .filter((x) => x.overlap > 0)
    .sort((a, b) => b.overlap - a.overlap);

  return scored.slice(0, 3).map((x) => x.slug);
}

function writeArticleModule(article, today) {
  const slug = article.slug;
  if (!slug) throw new Error('article missing slug');

  const category = pickCategory(article);
  const region = detectRegion(article);
  const wordCount = article.word_count || (article.html || '').split(/\s+/).length;
  const readingTime = calcReadingTime(article.html, wordCount);
  const html = replaceImagesWithStock(article.html, slug);
  const cover = pickStock(slug, 0);
  const coverAlt = `${article.title}. СК Юрьевич — фундаменты и дома под ключ в СПб и Ленобласти.`;

  const faq = (article.faq || []).map((f) => ({
    q: String(f.q || '').trim(),
    a: String(f.a || '').trim(),
  }));
  const keywords = (article.keywords || []).map((k) => String(k).trim()).filter(Boolean);
  const publishedAt = today;
  const moduleVar = moduleNameFromSlug(slug);

  const ts = `// Auto-generated. Do not edit by hand — regenerate via scripts/import-articles.js
import type { Article } from './_types';

export const ${moduleVar}: Article = {
  slug: ${JSON.stringify(slug)},
  title: ${JSON.stringify(article.title || '')},
  meta_title: ${JSON.stringify(article.meta_title || article.title || '')},
  meta_description: ${JSON.stringify(article.meta_description || '')},
  publishedAt: ${JSON.stringify(publishedAt)},
  category: ${JSON.stringify(category)},
  ${region ? `region: ${JSON.stringify(region)},` : ''}
  reading_time: ${readingTime},
  word_count: ${wordCount},
  keywords: ${JSON.stringify(keywords)},
  cover_image: ${JSON.stringify(cover)},
  cover_alt: ${JSON.stringify(coverAlt)},
  related_slugs: ${JSON.stringify(computeRelatedSlugs(slug, article.title || ''))},
  faq: ${JSON.stringify(faq, null, 2)},
  html: \`${tsEscape(html)}\`,
};
`;

  const file = path.join(ARTICLES_DIR, `${slug}.ts`);
  fs.writeFileSync(file, ts, 'utf8');
  return { slug, file, moduleVar, category, region, wordCount, readingTime };
}

function rewriteIndex(modules) {
  const sorted = modules.slice();
  const imports = sorted
    .map((m) => `import { ${m.moduleVar} } from './${m.slug}';`)
    .join('\n');
  const list = sorted.map((m) => `  ${m.moduleVar},`).join('\n');

  const out = `import type { Article } from './_types';
${imports}

// Реестр статей блога. Авто-сгенерирован import-articles.js
// Свежие статьи добавляются сюда автоматически.

export const ARTICLES: Article[] = [
${list}
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  if (current.related_slugs && current.related_slugs.length > 0) {
    const named = current.related_slugs
      .map((s) => getArticleBySlug(s))
      .filter(Boolean) as Article[];
    if (named.length >= limit) return named.slice(0, limit);
  }
  const sameCategory = ARTICLES.filter((a) => a.slug !== slug && a.category === current.category);
  const others = ARTICLES.filter((a) => a.slug !== slug && a.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function getArticlesByCategory(category: string): Article[] {
  return ARTICLES.filter((a) => a.category === category);
}

export function getAllSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}

export * from './_types';
`;
  fs.writeFileSync(INDEX_FILE, out, 'utf8');
}

function readExistingModules() {
  return fs
    .readdirSync(ARTICLES_DIR)
    .filter((f) => f.endsWith('.ts') && f !== 'index.ts' && f !== '_types.ts')
    .map((f) => {
      const slug = f.replace(/\.ts$/, '');
      const moduleVar = moduleNameFromSlug(slug);
      return { slug, file: path.join(ARTICLES_DIR, f), moduleVar };
    });
}

function main() {
  const inFile = process.argv[2];
  if (!inFile) {
    console.error('Usage: node scripts/import-articles.js <input.json>');
    process.exit(1);
  }

  const data = JSON.parse(fs.readFileSync(inFile, 'utf8'));
  const articlesData = Array.isArray(data) ? data : data.articles || [];
  if (articlesData.length === 0) {
    console.error('No articles in input');
    process.exit(1);
  }

  // === Quality gates (#15, #23 из SEO_YANDEX_100_AVTOPILOT.txt) ===
  // Отбрасываем тонкие/переоптимизированные/дубль-статьи ДО публикации,
  // чтобы не наловить Антикачество и Баден-Баден от Яндекса.
  const stripTags = (s) => String(s || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCountOf = (html) => stripTags(html).split(/\s+/).filter(Boolean).length;

  const rejected = [];
  const accepted = [];
  for (const a of articlesData) {
    const issues = [];
    const wc = wordCountOf(a.html || '');
    // gate 1: thin content — статья короче 800 слов это спам по нашим стандартам
    if (wc < 800) issues.push(`thin:${wc}w`);
    // gate 2: title переоптимизация — главное ключевое слово повторяется >2 раз в title
    const title = (a.title || '').toLowerCase();
    const titleWords = title.split(/\s+/).filter((w) => w.length >= 4);
    const counts = {};
    titleWords.forEach((w) => { counts[w] = (counts[w] || 0) + 1; });
    const overused = Object.entries(counts).find(([_, c]) => c > 2);
    if (overused) issues.push(`title-overopt:${overused[0]}x${overused[1]}`);
    // gate 3: keyword stuffing в body — главный ключ из title в тексте чаще 1% слов
    const bodyText = stripTags(a.html || '').toLowerCase();
    const mainKey = titleWords.filter((w) => w.length >= 5).slice(0, 2).join(' ');
    if (mainKey && wc > 100) {
      const occurrences = (bodyText.match(new RegExp(mainKey.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
      const density = (occurrences * 100) / wc;
      if (density > 1.5) issues.push(`kw-stuff:${mainKey}@${density.toFixed(2)}%`);
    }
    // gate 4: near-duplicate — пересечение слов с уже опубликованной статьёй >55%
    const titleSet = new Set(titleWords);
    const existingFromFs = readExistingModules();
    for (const m of existingFromFs) {
      const mTitle = m.slug.replace(/-/g, ' ').toLowerCase();
      const mWords = mTitle.split(/\s+/).filter((w) => w.length >= 4);
      if (mWords.length === 0) continue;
      const overlap = mWords.filter((w) => titleSet.has(w)).length;
      const sim = (overlap * 100) / Math.max(titleWords.length, mWords.length);
      if (sim > 55) { issues.push(`near-dup:${m.slug}@${sim.toFixed(0)}%`); break; }
    }

    if (issues.length > 0) {
      rejected.push({ slug: a.slug, title: a.title, issues });
    } else {
      accepted.push(a);
    }
  }

  if (rejected.length > 0) {
    console.error('⚠️  Quality-gate отбраковал', rejected.length, 'статей:');
    for (const r of rejected) {
      console.error(`  ✗ ${r.slug}: ${r.issues.join(', ')}`);
    }
    // Сохраняем отчёт для TG-алерта
    try {
      fs.writeFileSync('/tmp/quality-rejected.json', JSON.stringify(rejected, null, 2));
    } catch {}
  }

  if (accepted.length === 0) {
    console.error('FATAL: после quality-gate не осталось ни одной статьи — публикация отменена');
    process.exit(3);
  }
  if (accepted.length < articlesData.length) {
    console.log(`Quality-gate: ${accepted.length}/${articlesData.length} прошло`);
  }
  articlesData.length = 0;
  articlesData.push(...accepted);

  // Сегодня в UTC YYYY-MM-DD — Date.now запрещён в workflow, но scripts/* запускаются вручную
  const today = new Date().toISOString().slice(0, 10);

  const written = articlesData.map((a) => writeArticleModule(a, today));
  console.log(`✓ Записано модулей: ${written.length}`);
  written.forEach((w) => {
    console.log(`  - lib/articles/${w.slug}.ts (${w.category}${w.region ? ', ' + w.region : ''}, ${w.wordCount} слов, ${w.readingTime} мин)`);
  });

  // Объединяем с уже существующими (на будущее, когда будем добавлять статьи постепенно)
  const existingFromFs = readExistingModules();
  const allBySlug = new Map();
  existingFromFs.forEach((m) => allBySlug.set(m.slug, m));
  written.forEach((m) => allBySlug.set(m.slug, m));

  rewriteIndex([...allBySlug.values()]);
  console.log(`✓ Обновлён lib/articles/index.ts (всего статей: ${allBySlug.size})`);
}

main();
