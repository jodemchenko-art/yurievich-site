import { SITE } from '@/lib/site';
import { ARTICLES } from '@/lib/articles';

export const dynamic = 'force-static';

const escape = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const cdata = (s: string) => `<![CDATA[${s.replace(/]]>/g, ']]]]><![CDATA[>')}]]>`;

const stripTags = (html: string) =>
  html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<a[^>]*>([\s\S]*?)<\/a>/gi, '$1')
    .replace(/<(?!\/?(?:p|h[1-6]|ul|ol|li|figure|img|br|table|tr|td|th|blockquote)\b)[^>]*>/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

export async function GET() {
  const base = SITE.url;

  const items = ARTICLES.slice(0, 50).map((a) => {
    const turboHtml = stripTags(a.html || '');
    return `    <item turbo="true">
      <link>${escape(`${base}/blog/${a.slug}/`)}</link>
      <turbo:source>${escape(`${base}/blog/${a.slug}/`)}</turbo:source>
      <turbo:topic>${escape(a.title)}</turbo:topic>
      <pubDate>${new Date(a.publishedAt).toUTCString()}</pubDate>
      <author>${escape(SITE.fullName)}</author>
      <title>${escape(a.title)}</title>
      <description>${escape(a.meta_description || '')}</description>
      <turbo:content>${cdata(turboHtml)}</turbo:content>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss xmlns:yandex="http://news.yandex.ru" xmlns:media="http://search.yahoo.com/mrss/" xmlns:turbo="http://turbo.yandex.ru" version="2.0">
  <channel>
    <title>${escape(SITE.name + ' — Блог')}</title>
    <link>${escape(base + '/blog/')}</link>
    <description>${escape('Статьи о плитных фундаментах и домах из газобетона в СПб и Ленобласти')}</description>
    <language>ru</language>
${items.join('\n')}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
