import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';
import { ARTICLES } from '@/lib/articles';
import { REGIONS } from '@/lib/regions';
import { GLOSSARY } from '@/lib/glossary';

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

  const articlePages: MetadataRoute.Sitemap = ARTICLES.map((a) => ({
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

  return [...staticPages, ...regionPages, ...articlePages, ...slovarIndex, ...slovarTerms];
}
