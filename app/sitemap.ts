import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { ARTICLES, REDIRECTED_ARTICLE_SLUGS } from '@/lib/articles';
import { REDIRECTED_TERM_SLUGS } from '@/lib/glossary';
import { REGIONS } from '@/lib/regions';
import { GLOSSARY } from '@/lib/glossary';
import { LOCALITIES } from '@/lib/localities';
import { FOUNDATION_TYPES } from '@/lib/foundation-types';

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
  // 11.09.2026 — малоценные и дубли, склеены в типовые страницы / цены / дома
  'fundament-pod-banyu-iz-gazobetona-spb',
  'fundament-plita-pod-garazh-spb',
  'uteplyonnaya-shvedskaya-plita-ushp-spb',
  'plita-s-rebrami-pod-gazobeton-lenoblast',
  'svayno-rostverkovyy-fundament-pod-klyuch-cena-leningradskaya-oblast',
  'dom-iz-gazobetona-lsr-pod-klyuch-cena-za-m2',
  'korobka-iz-gazobetona-pod-kryshu-spb-cena',
  'dom-pod-klyuch-ili-korobka-pod-krysu-gazobeton-spb',
  'skolko-stoit-fundament-pod-dom-pod-klyuch-leningradskaya-oblast',
  'zakazat-zalivku-fundamenta-pod-klyuch-spb-nedorogo',
  'smeta-na-monolitnuyu-plitu-fundamenta-obrazec-spb',
  'cena-plity-fundamenta-12h12-spb',
  'plita-pod-gazobeton-100m2-cena-pod-klyuch',
  'plitnyy-fundament-dlya-gazobetona-lenoblast-otzyvy',
  'plita-na-svayah-leskolovo',
  'plitnyy-fundament-pod-gazobeton-lenoblast-cena-2026',
  'plitnyy-fundament-pod-brus-9x9-cena-lenoblast',
  'plita-250-ili-300-mm-pod-gazobeton-2-etazha',
  'plita-ili-lenta-pod-gazobeton',
  'plita-6x6-pod-gazobeton-cena',
  'plita-6x8-cena-pod-klyuch-spb',
  'plita-9x9-cena-pod-klyuch-spb',
  'plitnyy-fundament-9x12-pod-gazobeton-cena',
  'monolitnaya-plita-8x10-cena-lenoblast',
  'plita-10x12-pod-gazobeton-cena-300mm',
  'plita-300-mm-pod-dvuhetazhnyy-dom-cena',
  'plita-10x10-350mm-dvoynoe-armirovanie-cena',
  'monolitnaya-plita-250-mm-cena-za-m2',
  'plitnyy-fundament-pod-gazobeton-375-mm-cena',
  'plita-pod-dom-s-mansardoy-iz-gazobetona-cena',
  'fundament-pod-dvuhetazhnyy-dom-iz-gazobetona-cena',
  'fundament-pod-karkasnyy-dom-spb',
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
    ...['/ceny/', '/obekty/', '/otzyvy/', '/o-kompanii/', '/doma/', '/doma/ceny/', '/doma/etapy/', '/doma/odnoetazhnye/', '/doma/dvuhetazhnye/'].map((path) => ({
      url: `${base}${path}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: path === '/ceny/' || path === '/doma/' ? 0.95 : 0.8,
    })),
    ...FOUNDATION_TYPES.map((t) => ({
      url: `${base}/fundament/${t.slug}/`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.95,
    })),
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
    (a) => !REDIRECTED_SLUGS.has(a.slug) && !REDIRECTED_ARTICLE_SLUGS.has(a.slug),
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
  const slovarTerms: MetadataRoute.Sitemap = GLOSSARY.filter((t) => !REDIRECTED_TERM_SLUGS.has(t.slug)).map((t) => ({
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
