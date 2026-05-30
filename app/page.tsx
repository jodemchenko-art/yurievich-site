import Hero from '@/components/Hero';
import UtpIcons from '@/components/UtpIcons';
import Services from '@/components/Services';
import QuizSection from '@/components/QuizSection';
import Portfolio from '@/components/Portfolio';
import Reviews from '@/components/Reviews';
import Process from '@/components/Process';
import Brothers from '@/components/Brothers';
import LsrBanner from '@/components/LsrBanner';
import Faq from '@/components/Faq';
import Contacts from '@/components/Contacts';
import { SITE } from '@/lib/site';

// Per-page metadata override (more SEO-rich title for the homepage)
export const metadata = {
  title: `${SITE.tagline} · ${SITE.name} (договор, гарантия ${SITE.warrantyYears} лет)`,
  description: SITE.longDesc,
  alternates: { canonical: '/' },
};

// FAQ Schema.org — same questions as in Faq.tsx so Google/Yandex can show rich snippets
const FAQ_SCHEMA = [
  {
    q: 'Сколько стоит плитный фундамент в СПб и Ленобласти?',
    a: 'Точную стоимость считаем бесплатно за 1 день. На цену влияет размер дома, грунт, толщина плиты и доставка бетона. После замера присылаем подробную смету с разбивкой по позициям и фиксируем её в договоре. Базовая цена монолитной плиты — от 5 500 ₽/м².',
  },
  {
    q: 'Можно ли заливать фундамент зимой?',
    a: 'Да, льём круглый год. У нас отлажена технология зимнего бетонирования: противоморозные добавки, прогрев бетона, утепление опалубки. Зимняя заливка — одно из наших УТП.',
  },
  {
    q: 'Какую гарантию даёте?',
    a: '5 лет на конструктив. Прописано в гарантийном талоне, который выдаём при сдаче вместе с актом приёмки и паспортами на материалы.',
  },
  {
    q: 'Бывают ли допы во время стройки?',
    a: 'По нашей инициативе — нет. Цена в договоре фиксирована. Если изменения по вашей инициативе — оформляем доп. соглашением с вашим согласием. Без вашей подписи цена не растёт ни на рубль.',
  },
  {
    q: 'Какой бетон используете для монолитной плиты?',
    a: 'Только заводской, с паспортом качества. Для плиты — М300 W6 F150, арматура А500С. На месте показываем паспорт каждой машины. Никакого "своего замеса в бетономешалке".',
  },
  {
    q: 'Можете показать прошлые работы?',
    a: 'Да, в Telegram-канале @Yurastroitdoma — фото и видео с 239 объектов. Также можем свозить вас на ближайший действующий объект в СПб или Ленобласти.',
  },
  {
    q: 'Сколько времени занимает плитный фундамент?',
    a: 'Плита 100 м² — 10-14 рабочих дней. Дом из газобетона под ключ — 3-6 месяцев. Точные сроки прописываем в договоре с пенями за просрочку с нашей стороны.',
  },
  {
    q: 'Как происходит оплата?',
    a: 'Поэтапно: аванс только на материалы по чекам с завода → оплата по принятым этапам. Полный расчёт — только после акта приёмки. На работы предоплаты нет.',
  },
];

// BreadcrumbList for homepage
const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    {
      '@type': 'ListItem',
      position: 1,
      name: 'Главная',
      item: SITE.url,
    },
  ],
};

const FAQ_PAGE_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: FAQ_SCHEMA.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: {
      '@type': 'Answer',
      text: f.a,
    },
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(FAQ_PAGE_SCHEMA) }}
      />

      <Hero />
      <UtpIcons />
      <Services />
      <QuizSection />
      <Portfolio />
      <Reviews />
      <Process />
      <Brothers />
      <LsrBanner />
      <Faq />
      <Contacts />
    </>
  );
}
