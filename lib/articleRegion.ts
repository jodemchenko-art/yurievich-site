// Привязка гео-статей блога к их району (hub-spoke перелинковка).
//
// Зачем: раньше статьи ссылались на ВСЕ районы одинаково (CommercialLinks) —
// это размывало релевантность. Теперь у гео-статьи есть ОДНА точечная ссылка
// на свой район (сильный анкор), а район автоматически подтягивает свои статьи.
//
// Сюда попадают ТОЛЬКО статьи с явной геопривязкой. Общие статьи про материалы
// и технологию (бетон, арматура, гидроизоляция) региона не имеют — это нормально.

export const ARTICLE_REGION: Record<string, string> = {
  // Всеволожский район (+ Лесколово, Токсово, Колтуши)
  'plitnyy-fundament-vsevolozhsk-cena': 'vsevolozhsk',
  'plitnyy-fundament-vsevolozhsk-na-torfe': 'vsevolozhsk',
  'plitnyy-fundament-na-torfe-leskolovo-naziya': 'vsevolozhsk',
  'cena-plity-s-zamenei-grunta-na-torfe-leskolovo': 'vsevolozhsk',
  'cena-vytorfovki-uchastka-10-sotok-leskolovo': 'vsevolozhsk',
  'vytorfovka-uchastka-leskolovo-cena': 'vsevolozhsk',
  'plita-na-svayah-leskolovo': 'vsevolozhsk',
  // Курортный район (Песочный/Дибуны — наша база)
  'fundament-plita-pesochnyy-dibuny': 'kurortnyy',
  'plitnyy-fundament-kurortnyy-rayon-spb': 'kurortnyy',
  // Гатчинский район
  'plitnyy-fundament-gatchina-cena': 'gatchina',
  // Тосненский район
  'plitnyy-fundament-tosno-cena': 'tosno',
  // Выборгский район
  'plitnyy-fundament-vyborgskiy-rayon': 'vyborg',
  // Кировский район
  'plitnyy-fundament-kirovskiy-rayon-lo': 'kirov',
  // Приозерский район
  'plitnyy-fundament-priozerskiy-rayon': 'priozersk',
  // Ломоносовский район
  'plitnyy-fundament-lomonosovskiy-rayon-cena': 'lomonosov',
  // Санкт-Петербург
  'monolitnyy-plitnyy-fundament-spb-pod-klyuch': 'spb',
  'plitnyy-fundament-cena-za-m2-spb': 'spb',
  'plitnyy-fundament-10x10-cena-pod-klyuch-spb': 'spb',
  'monolitnaya-plita-12x12-cena-spb': 'spb',
};

/** Район для статьи (spoke → hub). undefined для общих статей. */
export function getRegionSlugForArticle(slug: string): string | undefined {
  return ARTICLE_REGION[slug];
}

/** Все статьи района (hub → spoke). */
export function getArticleSlugsForRegion(regionSlug: string): string[] {
  return Object.keys(ARTICLE_REGION).filter((s) => ARTICLE_REGION[s] === regionSlug);
}
