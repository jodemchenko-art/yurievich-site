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
import Faq from '@/components/Faq';
import Contacts from '@/components/Contacts';
import { SITE } from '@/lib/site';
import { HOME_FAQ } from '@/lib/faq';

// Per-page metadata override (more SEO-rich title for the homepage)
export const metadata = {
  title: `${SITE.tagline} · ${SITE.name} (договор, гарантия ${SITE.warrantyYears} лет)`,
  description: SITE.longDesc,
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
      <Process />
      <Brothers />
      <LsrBanner />
      <HomeBlogTeaser />
      <Faq />
      <Contacts />
    </>
  );
}
