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
