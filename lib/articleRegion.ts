// Привязка гео-статей блога к их району (hub-spoke перелинковка).
//
// Зачем: раньше статьи ссылались на ВСЕ районы одинаково (CommercialLinks) —
// это размывало релевантность. Теперь у гео-статьи есть ОДНА точечная ссылка
// на свой район (сильный анкор), а район автоматически подтягивает свои статьи.
//
// Сюда попадают ТОЛЬКО статьи с явной геопривязкой. Общие статьи про материалы
// и технологию (бетон, арматура, гидроизоляция) региона не имеют — это нормально.

export const ARTICLE_REGION: Record<string, string> = {
  // Всеволожский район (+ Лесколово, Токсово, Колтуши): 'vsevolozhsk',
  'plitnyy-fundament-vsevolozhsk-na-torfe': 'vsevolozhsk',
  'plitnyy-fundament-na-torfe-leskolovo-naziya': 'vsevolozhsk',
  'cena-plity-s-zamenei-grunta-na-torfe-leskolovo': 'vsevolozhsk',
  'cena-vytorfovki-uchastka-10-sotok-leskolovo': 'vsevolozhsk',
  'vytorfovka-uchastka-leskolovo-cena': 'vsevolozhsk',
  'plita-na-svayah-leskolovo': 'vsevolozhsk',
  // Курортный район (Песочный/Дибуны — наша база)
  'fundament-plita-pesochnyy-dibuny': 'kurortnyy',
  // Гатчинский район: 'gatchina',
  // Тосненский район: 'tosno',
  // Выборгский район: 'vyborg',
  // Кировский район: 'kirov',
  // Приозерский район: 'priozersk',
  // Ломоносовский район: 'lomonosov',
  // Санкт-Петербург: 'spb',
  'plitnyy-fundament-10x10-cena-pod-klyuch-spb': 'spb',
};

/** Район для статьи (spoke → hub). undefined для общих статей. */
export function getRegionSlugForArticle(slug: string): string | undefined {
  return ARTICLE_REGION[slug];
}

/** Все статьи района (hub → spoke). */
export function getArticleSlugsForRegion(regionSlug: string): string[] {
  return Object.keys(ARTICLE_REGION).filter((s) => ARTICLE_REGION[s] === regionSlug);
}
