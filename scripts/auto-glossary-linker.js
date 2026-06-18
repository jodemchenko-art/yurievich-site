#!/usr/bin/env node
// auto-glossary-linker.js — авто-перелинковка статей блога на термины глоссария.
//
// Для каждой статьи: находит первое упоминание термина в тексте и заменяет на ссылку
// <a href="/slovar/<slug>/">текст</a>. Только первое упоминание (чтобы не превращать
// статью в спам ссылок). Не трогает уже-ссылки и контент в <h1>..<h6>.
//
// Эффект:
// - +внутренних ссылок на словарь = бустит словарь в индексе
// - Контекстная навигация для читателей блога
// - Анти-каннибализация: статьи и термины связаны через @id-ссылки в Schema

const fs = require('fs');
const path = require('path');

const ARTICLES_DIR = path.resolve(__dirname, '../lib/articles');
const GLOSSARY_PATH = path.resolve(__dirname, '../lib/glossary.ts');

// Парсим термины из lib/glossary.ts (упрощённо — по slug + term)
const glossarySrc = fs.readFileSync(GLOSSARY_PATH, 'utf-8');
const TERMS = [];
const termBlocks = glossarySrc.matchAll(/slug:\s*'([^']+)',\s*\n\s*term:\s*'([^']+)'/g);
for (const m of termBlocks) {
  TERMS.push({ slug: m[1], term: m[2] });
}
console.log(`Загружено терминов: ${TERMS.length}`);

// Готовим паттерны для каждого термина (включая распространённые формы)
const PATTERNS = TERMS.map((t) => {
  const variants = [t.term];
  // Дополнительные формы для быстрого поиска
  const wordMap = {
    'Бетон М300': ['М300', 'M300', 'м300'],
    'Бетон М200': ['М200', 'м200'],
    'Бетон М400': ['М400', 'м400'],
    'Арматура А500С': ['А500С', 'А500'],
    'Арматура А240': ['А240'],
    'Арматура А400': ['А400'],
    'Газобетон D400': ['D400', 'Д400'],
    'Газобетон D500': ['D500', 'Д500'],
    'Газобетон D600': ['D600', 'Д600'],
    'Водонепроницаемость W6': ['W6', 'В6'],
    'Морозостойкость F150': ['F150', 'F-150'],
    'Плитный фундамент': ['плитного фундамента', 'плитном фундаменте', 'плитный фундамент'],
    'Ленточный фундамент': ['ленточного фундамента', 'ленточный фундамент'],
    'Свайно-винтовой фундамент': ['свайно-винтового', 'свайно-винтовой', 'винтовых свай'],
    'Подушка ПГС': ['ПГС', 'подушки ПГС', 'подушка ПГС'],
    'Выторфовка': ['выторфовку', 'выторфовки'],
    'ЭППС (Экструдированный пенополистирол)': ['ЭППС'],
    'Пучение грунта': ['пучения', 'пучение грунта', 'морозного пучения'],
    'Уровень грунтовых вод (УГВ)': ['УГВ', 'уровня грунтовых вод', 'уровень грунтовых вод'],
    'Геотекстиль': ['геотекстиля', 'геотекстиль'],
    'Виброплита': ['виброплитой'],
    'Виброуплотнение бетона': ['виброуплотнение', 'виброуплотнения'],
    'Опалубка щитовая': ['щитовая опалубка', 'щитовой опалубки'],
    'Шурф': ['шурфа', 'шурфом'],
    'Гидроизоляция фундамента': ['гидроизоляция', 'гидроизоляции'],
    'Дренаж по периметру': ['дренажа по периметру', 'дренаж'],
    'УШП (Утеплённая шведская плита)': ['УШП'],
    'СП 22.13330.2016': ['СП 22.13330.2016', 'СП 22'],
    'СП 63.13330.2018': ['СП 63.13330.2018', 'СП 63'],
    'ГОСТ 7473': ['ГОСТ 7473'],
    'ГОСТ 34028': ['ГОСТ 34028'],
    'Ростверк': ['ростверка', 'ростверк'],
    'Сваи ТИСЭ': ['ТИСЭ', 'сваи ТИСЭ'],
    'Кубики бетона': ['кубики бетона', 'отбор кубиков'],
    'Армопояс (армированный пояс)': ['армопояс', 'армопояса'],
    'Армирование двойной сеткой': ['двойной сеткой', 'двойное армирование'],
    'Класс прочности бетона (B)': ['B22,5', 'B30', 'B15', 'B25'],
    'Пески (грунт)': ['пески', 'песков', 'песках'],
    'Суглинок': ['суглинка', 'суглинок'],
    'Глина': ['глины', 'глине'],
    'Торф': ['торфа', 'торф', 'торфе'],
    'Болото (грунт)': ['болото', 'болота', 'болоте'],
    'Лазерный нивелир': ['нивелиром', 'нивелир'],
    'Фиксатор арматуры': ['фиксаторы арматуры', 'стульчики'],
    'Трамбовка грунта': ['трамбовка', 'трамбовкой'],
    'Толщина плитного фундамента': ['толщина плиты', 'толщине плиты'],
    'Толщина стены газобетонного дома': ['толщина стены газобетона'],
  };
  const extras = wordMap[t.term] || [];
  return {
    slug: t.slug,
    term: t.term,
    variants: [t.term, ...extras].filter((v, i, a) => a.indexOf(v) === i),
  };
});

// Сортируем по длине (длинные сначала) — чтобы не разорвать "Бетон М300" → "Бетон" + "М300"
PATTERNS.sort((a, b) => {
  const aLen = Math.max(...a.variants.map((v) => v.length));
  const bLen = Math.max(...b.variants.map((v) => v.length));
  return bLen - aLen;
});

function injectLinks(html) {
  // Защищённые места: уже-ссылки, заголовки, существующие тэги
  // Strategy: разбиваем на сегменты по существующим тэгам и обрабатываем только текст
  const parts = html.split(/(<\/?[^>]+>)/g);
  const linkedTerms = new Set();

  for (let i = 0; i < parts.length; i++) {
    const seg = parts[i];
    // Пропускаем тэги
    if (seg.startsWith('<')) continue;
    // Пропускаем если внутри ссылки <a>...</a> — посмотрим что было до
    let inLink = false;
    for (let j = i - 1; j >= 0; j--) {
      if (parts[j].match(/<\/a>/)) break;
      if (parts[j].match(/<a\s/)) { inLink = true; break; }
    }
    if (inLink) continue;

    // Пропускаем заголовки
    let inHeading = false;
    for (let j = i - 1; j >= 0; j--) {
      if (parts[j].match(/<\/h[1-6]>/)) break;
      if (parts[j].match(/<h[1-6][^>]*>/)) { inHeading = true; break; }
    }
    if (inHeading) continue;

    // Применяем замены
    let newSeg = seg;
    for (const p of PATTERNS) {
      if (linkedTerms.has(p.slug)) continue; // только первое упоминание

      for (const v of p.variants) {
        // Регулярка: словоclass на границах + не предшествует уже линку
        const re = new RegExp(`(?<![а-яА-Яa-zA-Z0-9])${escapeReg(v)}(?![а-яА-Яa-zA-Z0-9])`, '');
        if (re.test(newSeg)) {
          newSeg = newSeg.replace(re, (matched) => {
            return `<a href="/slovar/${p.slug}/" class="text-brand-ink underline decoration-brand-mute/40 decoration-1 underline-offset-2 hover:decoration-brand-ink hover:decoration-2">${matched}</a>`;
          });
          linkedTerms.add(p.slug);
          break;
        }
      }
    }
    parts[i] = newSeg;
  }

  return { html: parts.join(''), linked: linkedTerms.size };
}

function escapeReg(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// === Main ===
const files = fs
  .readdirSync(ARTICLES_DIR)
  .filter((f) => f.endsWith('.ts') && !['index.ts', '_types.ts'].includes(f));

let totalLinked = 0;
let articlesUpdated = 0;
for (const f of files) {
  const fp = path.join(ARTICLES_DIR, f);
  const src = fs.readFileSync(fp, 'utf-8');

  // Найти html: `....`,
  const htmlMatch = src.match(/(html:\s*`)([\s\S]*?)(`,)/);
  if (!htmlMatch) {
    console.log(`✗ skip (нет html): ${f}`);
    continue;
  }
  const oldHtml = htmlMatch[2];

  // Если уже есть ссылки на /slovar/ — пропускаем (повторный запуск)
  if (oldHtml.includes('/slovar/')) {
    console.log(`= уже есть слов.ссылки: ${f}`);
    continue;
  }

  const { html: newHtml, linked } = injectLinks(oldHtml);
  if (linked === 0) {
    console.log(`. 0 терминов: ${f}`);
    continue;
  }

  // Подставляем новый html обратно
  const newSrc = src.replace(htmlMatch[0], `${htmlMatch[1]}${newHtml}${htmlMatch[3]}`);
  fs.writeFileSync(fp, newSrc);
  console.log(`✓ ${f}: добавлено ${linked} ссылок`);
  totalLinked += linked;
  articlesUpdated++;
}

console.log(`\n=== Итого: ${articlesUpdated} статей обновлено, ${totalLinked} внутренних ссылок добавлено ===`);
