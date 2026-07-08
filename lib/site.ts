export const SITE = {
  // === Basic identity ===
  name: 'СК Юрьевич',
  fullName: 'Строительная компания «Юрьевич»',
  legalName: 'СК «Юрьевич»',
  tagline: 'Фундамент под ключ в СПб и Ленобласти — плита, лента, сваи',
  shortDesc:
    'Семейная строительная компания. Монолитные плитные фундаменты и дома из газобетона под ключ в Санкт-Петербурге и Ленобласти. Партнёр ЛСР Газобетон.',
  longDesc:
    'СК «Юрьевич» — семейная строительная компания в Санкт-Петербурге. Специализация — монолитные плитные фундаменты и дома из газобетона под ключ в СПб и Ленобласти. 239 завершённых объектов, рейтинг 5.0★ на Авито, партнёр ЛСР Газобетон. Работают сами братья — без субподряда. Договор с фикс-ценой, поэтапная оплата по приёмке этапов, гарантия 5 лет.',

  // === Domain & URLs ===
  domain: 'sk-yurievich.ru',
  url: 'https://www.sk-yurievich.ru',

  // === Contact ===
  phone: '+7 911 830-01-10',
  phoneRaw: '+79118300110',
  email: 'info@sk-yurievich.ru', // placeholder — will be configured at Reg.ru
  whatsapp: 'https://wa.me/79118300110',
  telegram: 'https://t.me/YuraDem01',
  telegramChannel: 'https://t.me/sk_yurievich',
  vk: 'https://vk.ru/lenbeton78', // сообщество компании ВКонтакте (Ленбетон78)

  // === Location ===
  city: 'Санкт-Петербург',
  region: 'Санкт-Петербург и Ленинградская область',
  baseLocation: 'ул. Пионерстроя, 23Б',
  district: 'Красносельский район',
  postalCode: '198328', // Красносельский район СПб
  fullAddress: 'Россия, Санкт-Петербург, ул. Пионерстроя, д. 23Б',
  geo: { lat: 59.838, lng: 30.129 }, // ул. Пионерстроя 23Б, СПб (Красносельский р-н, по OSM)
  areaServed: ['Санкт-Петербург', 'Ленинградская область'],
  servedRegions: [
    'Всеволожский район',
    'Гатчинский район',
    'Выборгский район',
    'Тосненский район',
    'Кировский район',
    'Приозерский район',
    'Ломоносовский район',
    'Курортный район',
  ],

  // === Trust signals ===
  rating: '5.0',
  reviewsCount: 35,
  projectsCount: 239,
  warrantyYears: 5,
  yearsOnMarket: null, // not confirmed
  partnerOf: 'ЛСР Газобетон',

  // === SEO ===
  defaultOgImage: '/images/og-default.jpg',
  // Коммерческое ядро по реальной частотности Вордстата (СПб + ЛО, июнь 2026).
  keywords: [
    'фундамент под ключ СПб',
    'фундамент под ключ цена',
    'заказать фундамент СПб',
    'монолитная плита под ключ',
    'плитный фундамент цена',
    'ленточный фундамент СПб',
    'ленточный фундамент цена',
    'свайный фундамент СПб',
    'свайно-винтовой фундамент',
    'заливка фундамента СПб',
    'устройство фундамента под ключ',
    'стоимость фундамента Ленинградская область',
    'фундамент для дома из газобетона',
    'дом из газобетона под ключ СПб',
    'фундамент Всеволожск',
    'фундамент Гатчина',
    'фундамент Выборг',
    'СК Юрьевич',
  ],

  // === Verification (fill after registering in Webmaster consoles) ===
  yandexVerification: 'dbea9882d2a34dc0', // → Яндекс.Вебмастер → подтверждение прав → метатег
  googleVerification: 'Z_6ItM2V5MQha6-vH_BFQ64JVMSBaM7GFNBCqqdBKDo', // → Google Search Console → HTML tag

  // === Analytics (fill after creating counters) ===
  yandexMetrikaId: '109522194', // 8-digit number from metrika.yandex.ru
  googleAnalyticsId: '', // G-XXXXXXXXXX
} as const;

export const PRICES = {
  plita: { from: 5500, unit: '₽/м²' },
  korobka: { from: null, unit: 'расчёт по проекту' },
  dom: { from: 38000, unit: '₽/м²' },
} as const;

// Main services for Schema.org Service[] and sitemap
export const SERVICES_LIST = [
  {
    id: 'plitnyi-fundament',
    slug: 'plitnyi-fundament',
    name: 'Монолитный плитный фундамент под ключ',
    shortName: 'Монолитная плита',
    description:
      'Заливка монолитной плиты под ключ в СПб и Ленобласти. Бетон М300, арматура А500С, плита 300 мм по нагрузкам. Заводской паспорт качества, зимнее бетонирование.',
    price: PRICES.plita,
    category: 'Фундаментные работы',
  },
  {
    id: 'gazobeton-korobka',
    slug: 'gazobeton-korobka',
    name: 'Коробка из газобетона ЛСР',
    shortName: 'Газоблок — коробка',
    description:
      'Возведение стен и перегородок из газобетона ЛСР под крышу, без отделки. Газобетон напрямую с завода с паспортом качества.',
    price: PRICES.korobka,
    category: 'Строительство домов',
  },
  {
    id: 'dom-pod-klyuch',
    slug: 'dom-pod-klyuch',
    name: 'Дом из газобетона под ключ',
    shortName: 'Дом под ключ',
    description:
      'Полный цикл строительства дома из газобетона ЛСР в СПб и Ленобласти: фундамент, коробка, кровля, инженерия, черновая отделка. Один договор, фикс-цена.',
    price: PRICES.dom,
    category: 'Строительство домов под ключ',
  },
] as const;
