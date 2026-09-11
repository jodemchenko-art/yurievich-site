// lib/seo-snippets.ts
// Title / Description для сниппета выдачи. Единые правила для всего сайта.
//
// ⛔ Замер живой выдачи Яндекса 11.09.2026 (регион СПб, 12 запросов):
//   - ★ из Title Яндекс вырезает, в выдаче остаётся голая «5»: «…от 5 500 ₽/м² 5».
//   - Description с ☎ / ★ / «…» Яндекс игнорировал на ВСЕХ коммерческих страницах
//     и подставлял текст со страницы. «CTR-сниппет» с телефоном никто не видел.
//   - Title длиннее ~58 символов обрезается многоточием, бренд в хвосте не виден.
// Правила (ресёрч 01-stroyka/seo/RESERCH-METADANNYE-11-09-2026.md):
//   без спецсимволов, без усечений «…», ключ и топоним в начале, важное — в начале
//   description, Title без бренда ≤ 60 (жёстко 62), Description 120–200 живыми фразами.
// Проверяет код: `npm run check:meta` (scripts/check-meta.js, валит при нарушении).

import { SITE } from './site';

/** Предлог «в/во» перед топонимом: «во Всеволожском», «во Фрунзенском», но «в Выборгском», «в Вырице». */
export function inPrep(toponym: string): string {
  return /^[ВФвф][^аеёиоуыэюяАЕЁИОУЫЭЮЯ]/.test(toponym) ? `во ${toponym}` : `в ${toponym}`;
}

/** Снимает брендовый хвост «… · СК Юрьевич» — его приклеивает шаблон в app/layout.tsx. */
export function stripBrandTail(input: string): string {
  let s = input.trim();
  const tail = /\s*[·|—–-]\s*(?:СК\s*)?[«"']?Юрьевич[»"']?\s*$/i;
  let guard = 0;
  while (tail.test(s) && guard < 5) {
    s = s.replace(tail, '');
    guard += 1;
  }
  return s.replace(/\s*[·|—–-]\s*$/, '').trim();
}

/** Убирает символы, которые поисковики режут или считают спамом. Ничего не усекает. */
export function cleanSnippetText(input: string): string {
  return input
    .replace(/[★☆⭐☎✓✔🔥•→]/g, ' ')
    .replace(/…/g, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

/** Title статьи/термина: без бренда в строке (его даёт шаблон), без спецсимволов. */
export function buildTitle(raw: string): string {
  return cleanSnippetText(stripBrandTail(raw));
}

/** Description статьи/термина: чистый текст с точкой в конце, без «добавок силы». */
export function buildDescription(raw: string): string {
  const s = cleanSnippetText(raw);
  return /[.!?]$/.test(s) ? s : `${s}.`;
}

/** Сниппет страницы района /fundament/[region]/ */
export function buildRegionSnippet(region: {
  slug: string;
  prepositional: string;
  priceFrom: number;
}) {
  const price = region.priceFrom.toLocaleString('ru-RU');

  if (region.slug === 'spb') {
    return {
      title: `Фундамент под ключ в районах Санкт-Петербурга от ${price} ₽/м²`,
      description:
        `Фундамент под ключ в Санкт-Петербурге по районам города от ${price} ₽/м²: монолитная плита, лента, сваи. ` +
        `Договор с фиксированной ценой, гарантия 5 лет, выезд инженера на участок бесплатно.`,
    };
  }

  const where = inPrep(region.prepositional);
  return {
    title: `Фундамент под ключ ${where}: цена от ${price} ₽/м²`,
    description:
      `Фундамент под ключ ${where} от ${price} ₽/м² с материалами: монолитная плита, лента, сваи под дом из газобетона. ` +
      `Договор с фиксированной ценой, гарантия 5 лет, выезд инженера бесплатно.`,
  };
}

/** Сниппет страницы посёлка /fundament/[region]/[locality]/ */
export function buildLocalitySnippet(locality: { prepositional: string; priceFrom: number }) {
  const price = locality.priceFrom.toLocaleString('ru-RU');
  const where = inPrep(locality.prepositional);
  return {
    title: `Фундамент под ключ ${where}: цена от ${price} ₽/м²`,
    description:
      `Фундамент под ключ ${where} от ${price} ₽/м² с материалами: монолитная плита под дом из газобетона, лента, сваи. ` +
      `Расчёт по грунту участка, договор с фиксированной ценой, гарантия 5 лет.`,
  };
}

type OgType = 'website' | 'article';

/**
 * Единый OpenGraph-блок с картинкой. Next.js сливает metadata поверхностно:
 * стоит дочерней странице задать любое поле openGraph — родительские `images`
 * из layout пропадают. Так 55 страниц остались без og:image (замер 11.09.2026).
 */
export function ogDefaults<T extends OgType>(path: string, title: string, description: string, type: T, image?: string) {
  const src = image || SITE.defaultOgImage;
  const url = src.startsWith('http') ? src : `${SITE.url}${src}`;
  return {
    type,
    locale: 'ru_RU',
    url: `${SITE.url}${path}`,
    title,
    description,
    siteName: SITE.name,
    images: [{ url, width: 1200, height: 630, alt: title }],
  };
}
