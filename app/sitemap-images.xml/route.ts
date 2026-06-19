import { SITE } from '@/lib/site';
import { ARTICLES } from '@/lib/articles';
import { REGIONS } from '@/lib/regions';

export const dynamic = 'force-static';

export async function GET() {
  const base = SITE.url;

  const escape = (s: string) =>
    s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

  const articleImages = ARTICLES.filter((a) => a.cover_image).map((a) => ({
    pageUrl: `${base}/blog/${a.slug}/`,
    img: `${base}${a.cover_image}`,
    caption: a.cover_alt || a.title,
    title: a.title,
  }));

  const regionImages = REGIONS.map((r) => ({
    pageUrl: `${base}/fundament/${r.slug}/`,
    img: `${base}/images/stock/p${(r.slug.length * 100000) % 99999999}.jpg`,
    caption: `Плитный фундамент в ${r.name} — СК Юрьевич`,
    title: `Плитный фундамент в ${r.name}`,
  }));

  const homeImages = [
    {
      pageUrl: `${base}/`,
      img: `${base}/og-default.jpg`,
      caption: 'СК Юрьевич — фундаменты и дома под ключ в СПб и Ленобласти',
      title: 'СК Юрьевич',
    },
  ];

  const all = [...homeImages, ...articleImages, ...regionImages];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${all
  .map(
    (it) => `  <url>
    <loc>${escape(it.pageUrl)}</loc>
    <image:image>
      <image:loc>${escape(it.img)}</image:loc>
      <image:caption>${escape(it.caption)}</image:caption>
      <image:title>${escape(it.title)}</image:title>
    </image:image>
  </url>`
  )
  .join('\n')}
</urlset>`;

  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
}
