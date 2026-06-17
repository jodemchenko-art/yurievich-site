// Гео-посадки для районов работы СК «Юрьевич».
// Каждый регион даёт уникальную /fundament/[slug]/ посадку под локальную выдачу.

export type RegionGround = 'pesok' | 'suglinok' | 'glina' | 'torf' | 'boloto';

export type Region = {
  slug: string;
  name: string;            // "Всеволожский район" / "Санкт-Петербург"
  shortName: string;       // "Всеволожск" / "СПб" — для коротких заголовков
  prepositional: string;   // "Всеволожском районе" / "Санкт-Петербурге" — для падежа
  localitiesText: string;  // ", включая Лесколово, Токсово, Колтуши"
  defaultGround: RegionGround;
  groundDescription: string; // Описание геологии конкретного района (3-4 предложения)
  examples: { location: string; project: string; price: string }[]; // 3-4 кейса
  priceFrom: number;       // от ₽/м² для этого района
  priceTo: number;         // до ₽/м²
  metroOrLandmark?: string; // ближайший ориентир
  drivingTime: string;     // "30-45 мин от КАД"
  relatedArticleSlugs: string[];
};

export const REGIONS: Region[] = [
  {
    slug: 'vsevolozhsk',
    name: 'Всеволожский район',
    shortName: 'Всеволожск',
    prepositional: 'Всеволожском районе',
    localitiesText: ', включая посёлки Лесколово, Токсово, Колтуши, Куйвози, Сертолово, Гарболово',
    defaultGround: 'suglinok',
    groundDescription:
      'Всеволожский район — это лоскутное одеяло из четырёх геологических зон. Карельский перешеек (Токсово, Кавголово, Юкки) — флювиогляциальные пески с R0 = 2,5-3,5 кгс/см², идеально для плиты 250 мм. Колтушские высоты — моренные суглинки тугопластичные с прослоями глин, пучинистые, нужна плита 300 мм + утеплённая отмостка ЭППС. Низины Лесколово-Гарболово — торфяники 1,5-3,5 м, обязательна выторфовка или сваи. Куйвози-Лемболово — лоскутная геология, перепады каждые 30 метров.',
    examples: [
      { location: 'Лесколово', project: 'Плита 10×10 после выторфовки 1,8 м', price: '1 350 000 ₽' },
      { location: 'Токсово', project: 'Плита 9×12 на песках 250 мм', price: '720 000 ₽' },
      { location: 'Колтуши', project: 'Плита 10×12 на суглинке 300 мм + ЭППС', price: '910 000 ₽' },
    ],
    priceFrom: 5500,
    priceTo: 11500,
    drivingTime: '30-50 мин от КАД',
    relatedArticleSlugs: [
      'plitnyy-fundament-vsevolozhsk-cena',
      'plitnyy-fundament-na-torfe-leskolovo-naziya',
      'gruntovye-vody-blizko-kakoy-fundament-vybrat',
    ],
  },
  {
    slug: 'gatchina',
    name: 'Гатчинский район',
    shortName: 'Гатчина',
    prepositional: 'Гатчинском районе',
    localitiesText: ', включая Гатчину, Сиверский, Вырицу, Коммунар, Новый Свет',
    defaultGround: 'glina',
    groundDescription:
      'Гатчинский район отличается карбонатными глинами с известняковыми прослоями. R0 = 2,0-2,5 кгс/см², но грунт сильнопучинистый — без утеплённой отмостки ленту рвёт за 2-3 сезона. Плита 300 мм с подушкой ПГС 400 мм и ЭППС 80-100 мм по периметру — рабочее решение. УГВ 1,5-3 м, в низинах ближе. В Сиверском и Вырице встречаются торфяные карманы — обязательна геология перед заливкой.',
    examples: [
      { location: 'Гатчина (Новый Свет)', project: 'Плита 8×10 на глине + ЭППС', price: '690 000 ₽' },
      { location: 'Сиверский', project: 'Плита 10×12 с дренажом', price: '880 000 ₽' },
      { location: 'Вырица', project: 'Плита 9×10 после геологии', price: '740 000 ₽' },
    ],
    priceFrom: 5500,
    priceTo: 9500,
    drivingTime: '45-65 мин от КАД',
    relatedArticleSlugs: [
      'plitnyy-fundament-gatchina-cena',
      'puchinistyy-grunt-kakoy-fundament',
      'plita-ili-lenta-pod-gazobeton',
    ],
  },
  {
    slug: 'vyborg',
    name: 'Выборгский район',
    shortName: 'Выборг',
    prepositional: 'Выборгском районе',
    localitiesText: ', включая Выборг, Каменногорск, Светогорск, Приморск',
    defaultGround: 'pesok',
    groundDescription:
      'Выборгский район — это в основном моренные пески и супеси с валунами на скальном основании. R0 = 2,8-3,8 кгс/см², пучение слабое или отсутствует. Плита 250 мм с подушкой ПГС 200 мм работает отлично. В низинах вдоль рек встречаются торфяники — обязательна геология. Далеко от СПб (90-120 км), доставка миксеров дороже, и в общую смету закладываем +50-80 тыс ₽.',
    examples: [
      { location: 'Выборг', project: 'Плита 10×10 на песках 250 мм', price: '630 000 ₽' },
      { location: 'Приморск', project: 'Плита 8×10 на супеси', price: '580 000 ₽' },
      { location: 'Каменногорск', project: 'Плита 9×12 на моренных песках', price: '720 000 ₽' },
    ],
    priceFrom: 5500,
    priceTo: 8500,
    drivingTime: '90-120 мин от КАД',
    relatedArticleSlugs: [
      'plitnyy-fundament-pod-gazobeton-tolschina-armirovanie',
      'plitnyy-fundament-10x10-cena-pod-klyuch-spb',
      'plita-ili-lenta-pod-gazobeton',
    ],
  },
  {
    slug: 'tosno',
    name: 'Тосненский район',
    shortName: 'Тосно',
    prepositional: 'Тосненском районе',
    localitiesText: ', включая Тосно, Никольское, Любань, Ушаки, Шапки',
    defaultGround: 'suglinok',
    groundDescription:
      'Тосненский район — пески и супеси с прослоями суглинков. На Шапках и в окрестностях — моренные суглинки полутвёрдые, R0 = 2,3-2,8 кгс/см². В низинах (Любань, болота вдоль р. Тосны) — торфяники до 2 м, нужна выторфовка. УГВ переменный — 1-3 м. Плита 250-300 мм по нагрузкам, утеплённая отмостка обязательна на суглинках. Зимняя заливка отлично заходит — Тосненский менее ветреный чем Карельский перешеек.',
    examples: [
      { location: 'Тосно', project: 'Плита 10×10 на суглинке', price: '680 000 ₽' },
      { location: 'Никольское', project: 'Плита 9×12 на песках', price: '720 000 ₽' },
      { location: 'Шапки', project: 'Плита 8×10 на моренном суглинке', price: '640 000 ₽' },
    ],
    priceFrom: 5500,
    priceTo: 9000,
    drivingTime: '40-60 мин от КАД',
    relatedArticleSlugs: [
      'plitnyy-fundament-pod-gazobeton-tolschina-armirovanie',
      'puchinistyy-grunt-kakoy-fundament',
      'kak-zalit-plitnyy-fundament-zimoy',
    ],
  },
  {
    slug: 'kirov',
    name: 'Кировский район',
    shortName: 'Кировск',
    prepositional: 'Кировском районе',
    localitiesText: ', включая Кировск, Шлиссельбург, Мгу, Отрадное, Назия',
    defaultGround: 'boloto',
    groundDescription:
      'Кировский район — это значительная часть болотистых низин (Назия, Синявино, Мга). Торф мощностью 2-4 м, под ним — водонасыщенные пески или мягкопластичные суглинки. УГВ часто 0,3-0,8 м от поверхности, весной верховодка выходит. Здесь моноплита почти невозможна — стандартное решение — забивные ж/б сваи 200×200 мм длиной 6-8 м с плитным ростверком. Цена выше из-за работ. В Отрадном и Шлиссельбурге грунты лучше — местами пески и супеси.',
    examples: [
      { location: 'Назия', project: 'Свая 200×200 + плита-ростверк 10×10', price: '1 850 000 ₽' },
      { location: 'Шлиссельбург', project: 'Плита 8×10 на песках', price: '620 000 ₽' },
      { location: 'Отрадное', project: 'Плита 10×12 с дренажом', price: '950 000 ₽' },
    ],
    priceFrom: 5800,
    priceTo: 15000,
    drivingTime: '50-80 мин от КАД',
    relatedArticleSlugs: [
      'plitnyy-fundament-na-torfe-leskolovo-naziya',
      'svai-ili-plita-pod-gazobeton-leningradskaya-oblast',
      'gruntovye-vody-blizko-kakoy-fundament-vybrat',
    ],
  },
  {
    slug: 'priozersk',
    name: 'Приозерский район',
    shortName: 'Приозерск',
    prepositional: 'Приозерском районе',
    localitiesText: ', включая Приозерск, Сосново, Лосево, Кузнечное, Громово',
    defaultGround: 'pesok',
    groundDescription:
      'Приозерский район — Карельский перешеек с превосходными грунтами. Камовые пески, флювиогляциальные отложения, гранитные останцы. R0 = 3,0-4,0 кгс/см² местами. УГВ глубокий, пучение слабое. Плита 250 мм с подушкой 150-200 мм работает идеально. Главная сложность — логистика: 100-140 км от СПб, доставка миксеров с увеличением цены. Часто проекты идут под дачные участки и базы отдыха.',
    examples: [
      { location: 'Сосново', project: 'Плита 9×10 на песках 250 мм', price: '670 000 ₽' },
      { location: 'Лосево', project: 'Плита 8×10 с террасированием', price: '760 000 ₽' },
      { location: 'Громово', project: 'Плита 12×12 на гравийных грунтах', price: '1 080 000 ₽' },
    ],
    priceFrom: 5500,
    priceTo: 8500,
    drivingTime: '100-140 мин от КАД',
    relatedArticleSlugs: [
      'plitnyy-fundament-10x10-cena-pod-klyuch-spb',
      'plitnyy-fundament-pod-gazobeton-tolschina-armirovanie',
      'kogda-luchshe-zalivat-plitnyy-fundament-leningradskaya-oblast',
    ],
  },
  {
    slug: 'lomonosov',
    name: 'Ломоносовский район',
    shortName: 'Ломоносов',
    prepositional: 'Ломоносовском районе',
    localitiesText: ', включая Ломоносов, Кронштадт, Гостилицы, Низино, Большую Ижору',
    defaultGround: 'glina',
    groundDescription:
      'Ломоносовский район — приморская низменность с переменными грунтами. На побережье Финского залива — пески и супеси, в глубине района — глины и моренные суглинки. Близость грунтовых вод — типично 1-2 м от поверхности, в низинах болотистее. Плита 300 мм с гидроизоляцией обязательна. В Гостилицах и Низино — карбонатные глины, аналогичные Гатчинскому району. На Кронштадте и о. Котлин — намывные грунты, требуют отдельной геологии.',
    examples: [
      { location: 'Низино', project: 'Плита 10×10 с гидроизоляцией', price: '850 000 ₽' },
      { location: 'Б. Ижора', project: 'Плита 9×12 на супеси', price: '760 000 ₽' },
      { location: 'Гостилицы', project: 'Плита 8×10 на глине + ЭППС', price: '720 000 ₽' },
    ],
    priceFrom: 5800,
    priceTo: 10000,
    drivingTime: '60-90 мин от КАД',
    relatedArticleSlugs: [
      'gruntovye-vody-blizko-kakoy-fundament-vybrat',
      'puchinistyy-grunt-kakoy-fundament',
      'plitnyy-fundament-pod-gazobeton-tolschina-armirovanie',
    ],
  },
  {
    slug: 'kurortnyy',
    name: 'Курортный район СПб',
    shortName: 'Курортный',
    prepositional: 'Курортном районе СПб',
    localitiesText: ', включая Сестрорецк, Зеленогорск, Солнечное, Репино, Комарово, Песочный',
    defaultGround: 'pesok',
    groundDescription:
      'Курортный район — северное побережье Финского залива и юг Карельского перешейка. Морские и флювиогляциальные пески, R0 = 2,8-3,5 кгс/см². Пучение слабое или отсутствует. Плита 250 мм идеально работает. В Песочном (наша база) и Дюнах УГВ глубокий, проблем с водой нет. В Репино и Комарово ближе к заливу — местами грунтовые воды 1-1,5 м, нужна гидроизоляция. Сезонная заливка возможна весь год.',
    examples: [
      { location: 'Сестрорецк', project: 'Плита 10×12 на песках', price: '760 000 ₽' },
      { location: 'Зеленогорск', project: 'Плита 9×10 на дюнных песках', price: '680 000 ₽' },
      { location: 'Песочный (наша база)', project: 'Плита 8×10 на флювиогляциале', price: '590 000 ₽' },
    ],
    priceFrom: 5500,
    priceTo: 8500,
    drivingTime: '15-45 мин от КАД',
    relatedArticleSlugs: [
      'plitnyy-fundament-kurortnyy-rayon-spb',
      'plitnyy-fundament-10x10-cena-pod-klyuch-spb',
      'plitnyy-fundament-pod-gazobeton-tolschina-armirovanie',
    ],
  },
  {
    slug: 'spb',
    name: 'Санкт-Петербург',
    shortName: 'СПб',
    prepositional: 'Санкт-Петербурге',
    localitiesText: ', включая Парнас, Девяткино, Бугры, Юкки, Шушары, Колпино, Пушкин, Павловск',
    defaultGround: 'suglinok',
    groundDescription:
      'Санкт-Петербург и пригороды имеют переменные грунты в зависимости от района. Парнас, Бугры — моренные суглинки. Юкки, Девяткино — пески и супеси. Шушары, Колпино, юг — глины и торфяники в низинах. Пушкин и Павловск — суглинки с близкими грунтовыми водами. Плита 250-350 мм по нагрузкам и геологии. В черте города часто работа в стеснённых условиях — учитываем при логистике. Зимняя заливка работает весь год.',
    examples: [
      { location: 'Бугры', project: 'Плита 10×10 на суглинке + ЭППС', price: '730 000 ₽' },
      { location: 'Юкки', project: 'Плита 9×12 на песках', price: '720 000 ₽' },
      { location: 'Пушкин', project: 'Плита 8×10 с гидроизоляцией', price: '690 000 ₽' },
    ],
    priceFrom: 5500,
    priceTo: 9500,
    drivingTime: 'в черте города или 15-40 мин от КАД',
    relatedArticleSlugs: [
      'plitnyy-fundament-10x10-cena-pod-klyuch-spb',
      'plitnyy-fundament-cena-za-m2-spb',
      'plitnyy-fundament-vsevolozhsk-cena',
    ],
  },
];

export function getRegionBySlug(slug: string): Region | undefined {
  return REGIONS.find((r) => r.slug === slug);
}

export function getAllRegionSlugs(): string[] {
  return REGIONS.map((r) => r.slug);
}
