import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { ARTICLES } from '@/lib/articles';
import { REGIONS } from '@/lib/regions';
import { GLOSSARY } from '@/lib/glossary';
import { LOCALITIES } from '@/lib/localities';

/**
 * Слаги статей, которые уже склеены 301-редиректом в next.config.js.
 * Файлы статей остаются в lib/articles (на них ссылаются перелинковка и архив),
 * но в sitemap.xml их быть не должно: карта сайта обязана вести только на 200,
 * иначе робот тратит краулинговый бюджет на цепочку редиректов.
 *
 * Замер 14.08.2026: 15 таких URL отдавали 308 прямо из sitemap.xml.
 *
 * ⚠️ Держать в синхроне с блоком redirects() в next.config.js.
 * Проверка: `node scripts/check-sitemap.js` — падает, если в карте появился не-200.
 */
const REDIRECTED_SLUGS = new Set<string>([
  'monolitnaya-plita-12x12-cena-spb',
  'monolitnaya-plita-tsena-rabota-spb',
  'monolitnyy-plitnyy-fundament-spb-pod-klyuch',
  'plita-12x12-pod-gazobeton-cena-pod-klyuch',
  'plitnyi-fundament-gazobeton-dom-leningradskaya-oblast-otzyvy',
  'plitnyi-fundament-pod-gazobeton-cena',
  'plitnyy-fundament-cena-za-m2-spb',
  'plitnyy-fundament-gatchina-cena',
  'plitnyy-fundament-kirovskiy-rayon-lo',
  'plitnyy-fundament-kurortnyy-rayon-spb',
  'plitnyy-fundament-lomonosovskiy-rayon-cena',
  'plitnyy-fundament-priozerskiy-rayon',
  'plitnyy-fundament-tosno-cena',
  'plitnyy-fundament-vsevolozhsk-cena',
  'plitnyy-fundament-vyborgskiy-rayon',
]);

export default function sitemap(): MetadataRoute.Sitemap {
  const base = SITE.url;
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${base}/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${base}/blog/`,
      lastModified: now,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${base}/kalkulyator/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${base}/fundament/`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.85,
    },
    {
      url: `${base}/vakansii/`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${base}/privacy/`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ];

  const regionPages: MetadataRoute.Sitemap = REGIONS.map((r) => ({
    url: `${base}/fundament/${r.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9, // Гео-посадки — высокий приоритет для локальной выдачи
  }));

  const localityPages: MetadataRoute.Sitemap = LOCALITIES.map((l) => ({
    url: `${base}/fundament/${l.regionSlug}/${l.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.75, // НЧ-гео-хвосты («фундамент Лесколово»)
  }));

  const kontaktyPage: MetadataRoute.Sitemap = [{
    url: `${base}/kontakty/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }];

  const articlePages: MetadataRoute.Sitemap = ARTICLES.filter(
    (a) => !REDIRECTED_SLUGS.has(a.slug),
  ).map((a) => ({
    url: `${base}/blog/${a.slug}/`,
    lastModified: new Date(a.updatedAt || a.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  // Глоссарий — словарь стройтерминов (метод #89 SEO_YANDEX_100)
  const slovarIndex: MetadataRoute.Sitemap = [{
    url: `${base}/slovar/`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }];
  const slovarTerms: MetadataRoute.Sitemap = GLOSSARY.map((t) => ({
    url: `${base}/slovar/${t.slug}/`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...regionPages,
    ...localityPages,
    ...kontaktyPage,
    ...articlePages,
    ...slovarIndex,
    ...slovarTerms,
  ];
}
