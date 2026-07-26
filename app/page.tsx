import Motion from '@/components/home/Motion';
import Hero from '@/components/home/Hero';
import ProofStrip from '@/components/home/ProofStrip';
import SlabAnatomy from '@/components/home/SlabAnatomy';
import TypesBlock from '@/components/home/TypesBlock';
import ObjectsChronicle from '@/components/home/ObjectsChronicle';
import PriceBlock from '@/components/home/PriceBlock';
import LeadBlock from '@/components/home/LeadBlock';
import WorkflowBlock from '@/components/home/WorkflowBlock';
import TeamBlock from '@/components/home/TeamBlock';
import ProofBlock from '@/components/home/ProofBlock';
import FaqBlock from '@/components/home/FaqBlock';
import BlogIndexBlock from '@/components/home/BlogIndexBlock';
import ContactBlock from '@/components/home/ContactBlock';
import { SITE } from '@/lib/site';
import { HOME_FAQ } from '@/lib/faq';

// Per-page metadata override (CTR-оптимизированный сниппет для главной)
export const metadata = {
  title: 'Фундамент под ключ в СПб на пучинистых грунтах, от 5 500 ₽/м²',
  description:
    'Монолитный фундамент под ключ в СПб и Ленобласти на пучинистых грунтах: плита, лента, сваи. ' +
    'Цена от 5 500 ₽/м², выезд инженера бесплатно, договор с фикс-ценой, гарантия 5 лет. ' +
    '239 объектов, ★5 (35 отз). ☎ +7 911 830-01-10',
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

/**
 * ГЛАВНАЯ — редизайн 26.07.2026, система «инженерный чертёж».
 *
 * Порядок блоков подчинён не «красоте», а последовательности вопросов в голове
 * человека, который выбирает, кому доверить фундамент:
 *   кто вы → что я вообще покупаю → что мне подойдёт → покажите работы →
 *   сколько это стоит → [заявка] → как всё будет происходить → кто отвечает →
 *   где вас проверить → остались вопросы → [заявка]
 *
 * Точек заявки ровно три: первый экран (кнопка-якорь), расчёт после цены (#calc)
 * и контакты внизу. Между ними — только объяснение и доказательства: на крупной
 * покупке давление в каждом экране читается как «мне впаривают».
 */
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

      <Motion />

      <Hero />
      <ProofStrip />
      <SlabAnatomy />
      <TypesBlock />
      <ObjectsChronicle />
      <PriceBlock />
      <LeadBlock />
      <WorkflowBlock />
      <TeamBlock />
      <ProofBlock />
      <FaqBlock />
      <BlogIndexBlock />
      <ContactBlock />
    </>
  );
}
