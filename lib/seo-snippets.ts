// lib/seo-snippets.ts
// Шаблоны «кликабельных» сниппетов для Яндекса (CTR-оптимизация).
//
// Логика выведена из эксперимента:
//   - Title 50-60 симв: цифра + ключ + соц.доказательство (★5) + короткий бренд
//   - Description 150-170 симв: прямой ответ + 2 power-words + цена + телефон
//
// Power-words для нашей ниши: «бесплатно», «выезд», «гарантия 5 лет»,
// «239 объектов», «★5 (35 отз)», «фикс-цена», «без предоплаты».
//
// Что Яндекс показывает в snippet:
//   - ★ (звёздочки) — да, повышают CTR на 1-3%
//   - 🔥 и эмодзи — да, но не больше 1 на title
//   - Цены в ₽ — да, увеличивают коммерческий CTR
//   - Телефон в description — да, дают «звонок прямо из выдачи»

import { SITE } from './site';

export type SnippetVariant = 'commercial' | 'informational' | 'geo' | 'service';

/**
 * Универсальный enhancer для description:
 *  - Если в description нет ★ — добавляем «★5 (35 отз)»
 *  - Если нет «бесплат» — добавляем «выезд бесплатно»
 *  - Если нет телефона — добавляем «☎ +7 911 830-01-10»
 *  - Усекаем до 175 символов чтобы не обрезалось Яндексом
 */
export function enhanceDescription(raw: string, variant: SnippetVariant = 'commercial'): string {
  if (!raw) return '';
  let desc = raw.trim();

  const hasStars = /★|⭐|5\.0|5\/5/.test(desc);
  const hasFree = /бесплат|выезд/i.test(desc);
  const hasPhone = /\+7|911|830-01-10/.test(desc);

  // Добавки идут в конце, если не хватает «силы»
  const additions: string[] = [];

  if (!hasStars) {
    if (variant === 'commercial' || variant === 'geo' || variant === 'service') {
      additions.push('★5 (35 отз)');
    } else {
      additions.push('239 объектов');
    }
  }

  if (!hasFree && (variant === 'commercial' || variant === 'geo' || variant === 'service')) {
    additions.push('выезд бесплатно');
  }

  if (!hasPhone && desc.length + 20 < 170) {
    additions.push(`☎ ${SITE.phone}`);
  }

  if (additions.length > 0) {
    // Удалим точку в конце если есть
    desc = desc.replace(/[.!?]+\s*$/, '');
    desc = `${desc}. ${additions.join(', ')}.`;
  }

  // Усечение
  if (desc.length > 175) {
    desc = desc.slice(0, 172).replace(/\s+\S*$/, '') + '…';
  }

  return desc;
}

/**
 * Универсальный enhancer для title:
 *  - Сокращает «Санкт-Петербург» до «СПб», «Ленинградская область» до «ЛО»
 *  - Добавляет «★5» если есть место и нет звёздочек
 *  - Усекает до 65 символов чтобы не обрезалось Яндексом
 */
export function enhanceTitle(raw: string, variant: SnippetVariant = 'commercial'): string {
  if (!raw) return '';
  let title = raw.trim();

  // Сокращения
  title = title.replace(/Санкт-Петербург(?:ской области)?/g, 'СПб');
  title = title.replace(/Ленинградск(?:ой|ая) област(?:и|ь)/gi, 'ЛО');
  title = title.replace(/Ленобласт(?:ь|и)/gi, 'ЛО');

  // Добавляем ★5 если есть место и это коммерческий запрос
  const hasStars = /★|⭐/.test(title);
  if (!hasStars && (variant === 'commercial' || variant === 'geo' || variant === 'service')) {
    // Найдём место перед последним «·» или «|» (это разделители брендового хвоста)
    if (title.length + 4 < 60) {
      title = title.replace(/\s*([·|])\s*/, ' ★5 $1 ');
      // Если разделителя нет, добавим в конец
      if (!/★5/.test(title)) {
        title = `${title} ★5`;
      }
    }
  }

  // Усечение
  if (title.length > 65) {
    title = title.slice(0, 62).replace(/\s+\S*$/, '') + '…';
  }

  return title;
}

/**
 * Готовый сниппет для /fundament/[region]/ страницы.
 * Заменяет код в generateMetadata.
 */
export function buildRegionSnippet(region: {
  prepositional: string;
  shortName: string;
  priceFrom: number;
  drivingTime?: string;
}) {
  const priceK = Math.round(region.priceFrom / 100) / 10; // 7500 → 7.5
  const title = `Фундамент в ${region.prepositional} от ${region.priceFrom.toLocaleString('ru-RU')} ₽/м² ★5 · СК Юрьевич`;

  const description =
    `Фундамент под ключ в ${region.prepositional}: плита, лента, сваи. ` +
    `Цена от ${priceK} тыс ₽/м². ` +
    `Выезд бесплатно. 239 объектов, гарантия 5 лет. ☎ ${SITE.phone}`;

  return {
    title: enhanceTitle(title, 'geo'),
    description: enhanceDescription(description, 'geo'),
  };
}

/**
 * Готовый сниппет для /fundament/[region]/[locality]/ страницы.
 */
export function buildLocalitySnippet(locality: {
  prepositional: string;
  name: string;
  priceFrom: number;
}, region: { shortName: string }) {
  const priceK = Math.round(locality.priceFrom / 100) / 10;
  const title = `Фундамент в ${locality.prepositional} от ${locality.priceFrom.toLocaleString('ru-RU')} ₽/м² ★5 · ${region.shortName}`;

  const description =
    `Плитный фундамент в ${locality.prepositional} под газобетон. ` +
    `Цена от ${priceK} тыс ₽/м² под ключ. ` +
    `Геология грунтов, выезд бесплатно. 239 объектов, ★5 на Авито. ☎ ${SITE.phone}`;

  return {
    title: enhanceTitle(title, 'geo'),
    description: enhanceDescription(description, 'geo'),
  };
}
