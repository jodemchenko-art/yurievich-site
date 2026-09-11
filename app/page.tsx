import Motion from '@/components/home/Motion';
import Hero from '@/components/home/Hero';
import ProofStrip from '@/components/home/ProofStrip';
import TypesBlock from '@/components/home/TypesBlock';
import ObjectsChronicle from '@/components/home/ObjectsChronicle';
import HousesGrid from '@/components/home/HousesGrid';
import PriceBlock from '@/components/home/PriceBlock';
import LeadBlock from '@/components/home/LeadBlock';
import WorkflowBlock from '@/components/home/WorkflowBlock';
import FaqBlock from '@/components/home/FaqBlock';
import ContactBlock from '@/components/home/ContactBlock';
import { SITE } from '@/lib/site';
import { HOME_FAQ } from '@/lib/faq';
import { ogDefaults } from '@/lib/seo-snippets';

// Метаданные главной. Wordstat СПб+ЛО 14.08.2026: «фундамент под ключ» 1491,
// «фундамент под ключ цена» 427 (наша позиция 22 — слова «цена» в title не было).
// Замер выдачи 11.09.2026: ★ Яндекс режет, description с ☎ игнорирует → только живой текст.
// Шаблон бренда из layout на корневую страницу не действует — бренд вписан явно.
const HOME_TITLE = 'Фундамент под ключ в Санкт-Петербурге: цена от 5 500 ₽/м²';
const HOME_DESC =
  'Фундамент под ключ в Санкт-Петербурге и Ленобласти от 5 500 ₽/м²: монолитная плита, ленточный и свайный фундамент. ' +
  'Договор с фиксированной ценой, гарантия 5 лет, выезд инженера бесплатно.';

export const metadata = {
  title: `${HOME_TITLE} · ${SITE.name}`,
  description: HOME_DESC,
  alternates: { canonical: '/' },
  openGraph: ogDefaults('/', `${HOME_TITLE} · ${SITE.name}`, HOME_DESC, 'website'),
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
 * 11.09.2026: страница укорочена — разрез плиты, команда, «где проверить» и лента блога
 * переехали на /fundament/plita/, /o-kompanii/, /otzyvy/ и /blog/. На мобильном главная
 * была 27 000 px высотой: 12 экранов до контактов — это не продаёт, а утомляет.
 *
 * Порядок блоков подчинён не «красоте», а последовательности вопросов в голове
 * человека, который выбирает, кому доверить фундамент:
 *   кто вы → что я вообще покупаю → что мне подойдёт → покажите работы (плиты и дома) →
 *   сколько это стоит → [заявка] → как всё будет происходить → кто отвечает →
 *   где вас проверить → остались вопросы → [заявка]
 *
 * 11.09.2026: разрез плиты, команда, пруфы и блог вынесены на свои страницы
 * (/fundament/plita/, /o-kompanii/, /otzyvy/, /blog/) — главная стала вдвое короче.
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
      <TypesBlock />
      <ObjectsChronicle />
      <HousesGrid />
      <PriceBlock />
      <LeadBlock />
      <WorkflowBlock />
      <FaqBlock />
      <ContactBlock />
    </>
  );
}
