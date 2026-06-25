import Hero from '@/components/Hero';
import UtpIcons from '@/components/UtpIcons';
import Services from '@/components/Services';
import QuizSection from '@/components/QuizSection';
import Portfolio from '@/components/Portfolio';
import Reviews from '@/components/Reviews';
import Process from '@/components/Process';
import Brothers from '@/components/Brothers';
import LsrBanner from '@/components/LsrBanner';
import HomeBlogTeaser from '@/components/HomeBlogTeaser';
import LeadMagnetBanner from '@/components/LeadMagnetBanner';
import Faq from '@/components/Faq';
import Contacts from '@/components/Contacts';
import { SITE } from '@/lib/site';
import { HOME_FAQ } from '@/lib/faq';

// Per-page metadata override (CTR-оптимизированный сниппет для главной)
export const metadata = {
  title: 'Плитный фундамент СПб от 7 500 ₽/м² ★5 · СК Юрьевич',
  description:
    'Монолитная плита под газобетон в СПб и ЛО под ключ. Цена от 7,5 тыс ₽/м², гарантия 5 лет, ' +
    'договор с фикс-ценой. 239 объектов, ★5 (35 отз). Выезд бесплатно. ☎ +7 911 830-01-10',
  alternates: { canonical: '/' },
};

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
  mainEntity: HOME_FAQ.map((f) => ({
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
      <section className="section bg-brand-sand">
        <div className="container-x"><LeadMagnetBanner source="home" /></div>
      </section>
      <Process />
      <Brothers />
      <LsrBanner />
      <HomeBlogTeaser />
      <Faq />
      <Contacts />
    </>
  );
}
