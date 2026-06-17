import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/site';

export default function robots(): MetadataRoute.Robots {
  // Базовые правила — общие для всех роботов
  const baseDisallow = ['/api/', '/spasibo'];
  const baseAllow = ['/', '/_next/static/']; // явно открываем CSS/JS для рендера preview

  return {
    rules: [
      {
        userAgent: '*',
        allow: baseAllow,
        disallow: baseDisallow,
      },
      // Яндекс: понимает Clean-param и собственные директивы (см. ниже host)
      {
        userAgent: 'Yandex',
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'YandexBot',
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'Googlebot',
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'Bingbot',
        allow: baseAllow,
        disallow: baseDisallow,
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
