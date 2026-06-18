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
      // === AI-боты: явно разрешаем, чтобы попадать в Алису/ChatGPT/Perplexity ===
      // Источник: SEO_2026_ВЫЖИМКА.md — 19 экспертов сходятся, что попадание в AI-ответы
      // = ключевой сдвиг 2026 года. Cloudflare по умолчанию блокирует этих ботов —
      // в DNS настройках надо отключить «Block AI Scrapers».
      {
        userAgent: 'GPTBot',          // OpenAI ChatGPT
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'ChatGPT-User',    // ChatGPT browsing
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'OAI-SearchBot',   // OpenAI Search
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'PerplexityBot',
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'Perplexity-User',
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'ClaudeBot',       // Anthropic Claude
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'Claude-Web',
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'Google-Extended', // Google Gemini training/grounding
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'CCBot',           // Common Crawl (используется многими AI)
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'YandexAlice',     // Алиса/Нейро Яндекса
        allow: baseAllow,
        disallow: baseDisallow,
      },
      {
        userAgent: 'Applebot-Extended', // Apple Intelligence
        allow: baseAllow,
        disallow: baseDisallow,
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
