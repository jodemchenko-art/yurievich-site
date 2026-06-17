#!/usr/bin/env node
// inject-article-faq.js — наполняет пустые faq:[] в lib/articles/*.ts на основе H2-структуры html.
//
// Логика (#27 из SEO_YANDEX_100_AVTOPILOT.txt):
//  - Из html статьи парсим H2-заголовки и их параграфы
//  - Каждый H2 превращаем в вопрос (если он уже вопрос — оставляем)
//  - Ответ = первые ~60 слов параграфа под H2
//  - Записываем faq: [{q, a}, ...] обратно в .ts модуль
//
// Безопасно: пропускает статьи где faq уже непустой.

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '../lib/articles');

function stripTags(html) {
  return String(html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&mdash;/g, '—')
    .replace(/&ndash;/g, '–')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&laquo;/g, '«')
    .replace(/&raquo;/g, '»')
    .trim();
}

function makeQuestion(h2Text) {
  const t = h2Text.trim().replace(/[?.!]+$/, '');
  // Если уже вопрос — оставляем как есть, добавим ?
  if (/^(как|что|почему|зачем|сколько|когда|где|какой|какая|какие|какое|можно|стоит|нужно)/iu.test(t)) {
    return t + '?';
  }
  // Шаблонные преобразования
  const lower = t.toLowerCase();
  if (/^(цены?|стоимост)/u.test(lower)) return `Сколько стоит ${t.replace(/^цены?\s*на\s*|^стоимость\s*/iu, '')}?`;
  if (/^(сроки?)/u.test(lower)) return `Какие ${t.toLowerCase()}?`;
  if (/^(материалы?|марк[аи])/u.test(lower)) return `Какие ${t.toLowerCase()}?`;
  if (/^(технологи)/u.test(lower)) return `Какая ${t.toLowerCase()}?`;
  if (/^(гарант)/u.test(lower)) return `Какая ${t.toLowerCase()}?`;
  if (/^(преимуществ|недостатк|плюс|минус)/u.test(lower)) return `${t}: какие они?`;
  if (/^(грунт|подушк|армиро|опалубк|бетон|заливк)/u.test(lower)) return `Что такое ${lower}?`;
  // Default: добавляем "Что важно знать о..."
  return `Что нужно знать про ${lower}?`;
}

function compactAnswer(text, targetWords = 60) {
  const words = text.split(/\s+/);
  if (words.length <= targetWords) return text;
  // обрезаем до конца предложения после targetWords
  const truncated = words.slice(0, targetWords + 30).join(' ');
  const lastSentence = truncated.match(/^([\s\S]+?[.!?])\s+[А-ЯЁA-Z]/);
  if (lastSentence) return lastSentence[1];
  return words.slice(0, targetWords).join(' ') + '…';
}

function extractFaq(html, maxItems = 6) {
  // Ищем h2 + первый параграф после него
  const sections = [];
  const h2Re = /<h2[^>]*>([\s\S]*?)<\/h2>([\s\S]*?)(?=<h2[^>]*>|$)/gi;
  let m;
  while ((m = h2Re.exec(html))) {
    const h2Text = stripTags(m[1]);
    const sectionHtml = m[2];
    // первый параграф или первое содержательное предложение
    const pMatch = sectionHtml.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    const pText = pMatch ? stripTags(pMatch[1]) : stripTags(sectionHtml).slice(0, 600);
    if (h2Text && pText.length > 40) {
      sections.push({ h2: h2Text, p: pText });
    }
    if (sections.length >= maxItems) break;
  }
  return sections.map((s) => ({
    q: makeQuestion(s.h2),
    a: compactAnswer(s.p, 60),
  }));
}

// === Чтение .ts модуля ===
function readArticleModule(filePath) {
  const src = fs.readFileSync(filePath, 'utf8');
  // Достаём html (это TS template-literal в свойстве объекта)
  // html: `<p>...</p><h2>...</h2>...`,
  const htmlMatch = src.match(/html:\s*`([\s\S]*?)`\s*,/);
  if (!htmlMatch) return null;
  const html = htmlMatch[1];
  // Проверяем что faq пустой
  const faqMatch = src.match(/faq:\s*\[([\s\S]*?)\]\s*,/);
  if (!faqMatch) return null;
  const isFaqEmpty = !faqMatch[1].trim();
  return { src, html, isFaqEmpty };
}

function writeFaqIntoModule(filePath, faqItems) {
  let src = fs.readFileSync(filePath, 'utf8');
  // Сериализуем массив через JSON.stringify с TS-совместимым форматом
  const faqStr = '[\n' +
    faqItems.map((f) => `    { q: ${JSON.stringify(f.q)}, a: ${JSON.stringify(f.a)} }`).join(',\n') +
    '\n  ]';
  src = src.replace(/faq:\s*\[[\s\S]*?\]\s*,/, `faq: ${faqStr},`);
  fs.writeFileSync(filePath, src);
}

// === main ===
const files = fs
  .readdirSync(ARTICLES_DIR)
  .filter((f) => f.endsWith('.ts') && !['index.ts', '_types.ts'].includes(f));

let touched = 0;
let skipped = 0;
let noFaq = 0;
for (const f of files) {
  const filePath = path.join(ARTICLES_DIR, f);
  const mod = readArticleModule(filePath);
  if (!mod) {
    console.log(`✗ skip (no html/faq field): ${f}`);
    continue;
  }
  if (!mod.isFaqEmpty) {
    console.log(`= already has FAQ: ${f}`);
    skipped++;
    continue;
  }
  const items = extractFaq(mod.html);
  if (items.length === 0) {
    console.log(`✗ couldn't extract FAQ (no H2 with paragraph): ${f}`);
    noFaq++;
    continue;
  }
  writeFaqIntoModule(filePath, items);
  console.log(`✓ ${f}: ${items.length} Q&A добавлено`);
  touched++;
}
console.log(`\nИтого: добавлено ${touched}, пропущено ${skipped} (уже с FAQ), без H2 ${noFaq}`);
