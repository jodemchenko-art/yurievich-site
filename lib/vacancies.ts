// vacancies.ts — описание вакансий для JobPosting Schema (#56 SEO_YANDEX_100)
// Попадание в Яндекс.Работа → бесплатный целевой трафик из «вакансии прораб/бетонщик СПб»

import { SITE } from './site';

export type Vacancy = {
  slug: string;
  title: string;
  description: string;
  responsibilities: string[];
  requirements: string[];
  conditions: string[];
  salaryMin: number;
  salaryMax: number;
  employmentType: 'FULL_TIME' | 'PART_TIME' | 'CONTRACTOR';
  workSchedule?: string;
  experienceMonths?: number;
};

export const VACANCIES: Vacancy[] = [
  {
    slug: 'beton-shchik',
    title: 'Бетонщик-арматурщик на плитные фундаменты',
    description:
      'Ищем бетонщика-арматурщика в бригаду СК «Юрьевич». Работаем в СПб и Ленобласти: монолитные плиты под частные дома (газобетон, каркас, брус), 8-12 объектов в год. Зарплата прозрачная — фикс + сделка на объект. Постоянная работа, без длинных простоев, реальные коллеги-братья, не «контора».',
    responsibilities: [
      'Армирование плиты А500С Ø10-14 двойной сеткой с шагом 200 мм',
      'Монтаж и демонтаж щитовой опалубки',
      'Приём бетона М300 с завода ЛСР, виброуплотнение глубинным вибратором',
      'Выравнивание поверхности заглаживающими машинами',
      'Контроль соблюдения проекта и СП 22.13330.2016',
    ],
    requirements: [
      'Опыт работы на монолитных фундаментах от 1 года',
      'Знание классификации арматуры и марок бетона',
      'Умение читать строительные чертежи',
      'Ответственность, аккуратность, готовность работать вахтой по объектам в ЛО',
      'Граждане РФ или с действующим разрешением на работу',
    ],
    conditions: [
      'Зарплата 100 000 – 150 000 ₽ в зависимости от опыта и сезонной загрузки',
      'Оплата каждую неделю (без задержек — это принципиально)',
      'Транспорт до объектов в ЛО — наш (Газель из базы)',
      'Спецодежда и СИЗ за наш счёт',
      'Никаких субподрядов — работаешь в нашей бригаде с прорабом Валерой',
      'Зимний период работаем (отлажена технология прогрева)',
    ],
    salaryMin: 100000,
    salaryMax: 150000,
    employmentType: 'FULL_TIME',
    workSchedule: '5/2, 9:00-19:00 (на объекте — по логистике)',
    experienceMonths: 12,
  },
  {
    slug: 'prorab-betonnye-raboty',
    title: 'Прораб (производитель работ) на участке плитных фундаментов',
    description:
      'Берём опытного прораба на самостоятельные участки. У нас семейная компания (3 брата Демченко), 239 объектов с 2018 года. Нужен человек который умеет вести объект «от шурфа до сдачи»: организация бригады, контроль качества, общение с заказчиком, отчётность по этапам.',
    responsibilities: [
      'Контроль земляных работ, подушки, армирования, заливки на 2-3 объектах одновременно',
      'Приёмка материалов: бетон по паспортам с завода, арматура с сертификатами',
      'Соблюдение проектной документации и СП 22.13330.2016',
      'Контроль безопасности и сроков на объектах',
      'Коммуникация с заказчиками: акты этапов, ответы на вопросы',
      'Ведение журналов работ и фото-фиксации',
    ],
    requirements: [
      'Высшее или средне-специальное профильное образование (ПГС)',
      'Опыт работы прорабом на бетонных работах от 3 лет',
      'Знание ГОСТ 7473 (бетон), СП 22.13330.2016 (основания)',
      'Личный автомобиль (минимум B-категория) — компенсируем ГСМ',
      'Уверенный пользователь смартфона: фото-отчёты, мессенджеры',
    ],
    conditions: [
      'Зарплата 180 000 – 250 000 ₽ + квартальные премии за объекты сданные в срок',
      'Компенсация ГСМ по фактическому пробегу',
      'Корпоративная мобильная связь',
      'Возможность роста до руководителя направления',
      'Семейный коллектив, без «корпоративной политики»',
    ],
    salaryMin: 180000,
    salaryMax: 250000,
    employmentType: 'FULL_TIME',
    workSchedule: '5/2 с гибким началом дня',
    experienceMonths: 36,
  },
  {
    slug: 'raznorabochiy',
    title: 'Разнорабочий на фундаментные работы',
    description:
      'Берём разнорабочего без опыта на старт — учим всему на объекте. Подойдёт мужчине 20-45 лет, физически здоровому, который готов учиться и зарабатывать. Через 3-6 месяцев — рост до помощника арматурщика, через год — до полноценного бетонщика.',
    responsibilities: [
      'Помощь бригаде: подача материалов, уборка территории, подготовка опалубки',
      'Работа с инструментом: лопата, тачка, виброплита (после обучения)',
      'Помощь при разгрузке арматуры, опалубки, бетона',
      'Уборка участка после завершения этапа',
    ],
    requirements: [
      'Здоровье и физическая выносливость (работа на улице, нагрузки до 25 кг)',
      'Готовность учиться у опытных коллег',
      'Без вредных привычек на работе (алкоголь = увольнение в день обнаружения)',
      'Граждане РФ',
      'Возраст 18-50 лет',
    ],
    conditions: [
      'Зарплата 70 000 – 100 000 ₽ (от 70к на старте, через 3 мес. с прибавкой за освоенный фронт)',
      'Оплата еженедельно',
      'Бесплатное обучение всем строительным специальностям внутри бригады',
      'Спецодежда, СИЗ, обеды на объекте',
      'Возможность вырасти до бетонщика-арматурщика (зарплата +50%)',
    ],
    salaryMin: 70000,
    salaryMax: 100000,
    employmentType: 'FULL_TIME',
    workSchedule: '5/2, 9:00-19:00',
    experienceMonths: 0,
  },
];

export function getVacancyBySlug(slug: string): Vacancy | undefined {
  return VACANCIES.find((v) => v.slug === slug);
}

// JobPosting Schema по schema.org/JobPosting + рекомендациям Яндекс.Работа
export function buildJobPostingSchema(v: Vacancy, today: string) {
  const validThrough = new Date();
  validThrough.setMonth(validThrough.getMonth() + 3);
  return {
    '@type': 'JobPosting',
    '@id': `${SITE.url}/vakansii/${v.slug}/#jobposting`,
    title: v.title,
    description: [
      `<p>${v.description}</p>`,
      `<h3>Обязанности</h3><ul>${v.responsibilities.map((r) => `<li>${r}</li>`).join('')}</ul>`,
      `<h3>Требования</h3><ul>${v.requirements.map((r) => `<li>${r}</li>`).join('')}</ul>`,
      `<h3>Условия</h3><ul>${v.conditions.map((c) => `<li>${c}</li>`).join('')}</ul>`,
    ].join(''),
    datePosted: today,
    validThrough: validThrough.toISOString().split('T')[0],
    employmentType: v.employmentType,
    hiringOrganization: { '@id': `${SITE.url}/#organization` },
    jobLocation: {
      '@type': 'Place',
      address: {
        '@type': 'PostalAddress',
        streetAddress: SITE.baseLocation,
        addressLocality: SITE.city,
        addressRegion: SITE.city,
        postalCode: (SITE as any).postalCode || undefined,
        addressCountry: 'RU',
      },
    },
    applicantLocationRequirements: SITE.areaServed.map((a) => ({
      '@type': 'Country',
      name: a,
    })),
    baseSalary: {
      '@type': 'MonetaryAmount',
      currency: 'RUB',
      value: {
        '@type': 'QuantitativeValue',
        minValue: v.salaryMin,
        maxValue: v.salaryMax,
        unitText: 'MONTH',
      },
    },
    workHours: v.workSchedule,
    experienceRequirements: v.experienceMonths
      ? {
          '@type': 'OccupationalExperienceRequirements',
          monthsOfExperience: v.experienceMonths,
        }
      : undefined,
    industry: 'Строительство',
    occupationalCategory: 'Construction',
  };
}
