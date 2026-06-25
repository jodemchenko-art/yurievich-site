import type { Metadata } from 'next';
import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';
import { CATEGORY_LABELS } from '@/lib/articles/_types';
import BlogCard from '@/components/blog/BlogCard';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Блог о фундаментах: цены 2026, грунты ЛО ★5 · СК Юрьевич',
  description:
    'Экспертные статьи о плитных фундаментах и домах из газобетона: цены 2026, грунты Ленобласти, ' +
    '50+ кейсов из 239 объектов. ★5 (35 отз). Без воды. ☎ +7 911 830-01-10',
  alternates: { canonical: '/blog/' },
  openGraph: {
    title: 'Блог о фундаментах и газобетоне — цены 2026 ★5',
    description: 'Цены 2026, грунты ЛО, 50+ статей из 239 объектов СК «Юрьевич». ★5.',
    url: `${SITE.url}/blog/`,
    type: 'website',
  },
};

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
    {
      '@type': 'ListItem',
      position: 2,
      name: 'Блог',
      item: `${SITE.url}/blog/`,
    },
  ],
};

const BLOG_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'Blog',
  '@id': `${SITE.url}/blog/#blog`,
  name: 'Блог СК «Юрьевич»',
  description: 'Экспертные материалы по плитным фундаментам и домам из газобетона в СПб и Ленобласти.',
  url: `${SITE.url}/blog/`,
  inLanguage: 'ru-RU',
  publisher: { '@id': `${SITE.url}/#organization` },
};

export default function BlogIndexPage() {
  // Сортируем: сначала свежие
  const sorted = [...ARTICLES].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  // Группируем по категориям для секций
  const byCategory = sorted.reduce<Record<string, typeof sorted>>((acc, a) => {
    (acc[a.category] ||= []).push(a);
    return acc;
  }, {});

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BLOG_SCHEMA) }}
      />

      <section className="container-x pt-12 md:pt-16 pb-6">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-brand-ink transition">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Блог</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight">
          Блог СК «Юрьевич»
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-[65ch] leading-relaxed">
          Экспертные материалы о плитных фундаментах, домах из газобетона и грунтовых
          условиях Санкт-Петербурга и Ленинградской области. Только практика — пишем то,
          что сами делаем на 239 объектах.
        </p>
      </section>

      <section className="section">
        <div className="container-x">
          {sorted.length === 0 ? (
            <div className="text-center py-20 bg-brand-sand rounded-3xl">
              <p className="text-brand-mute text-lg">
                Первые статьи появятся совсем скоро.
              </p>
              <Link
                href="/#calc"
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-brand-ink text-white px-7 py-4 font-bold hover:bg-brand-red-dark transition"
              >
                Получить расчёт фундамента →
              </Link>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {sorted.map((a, i) => (
                <BlogCard key={a.slug} article={a} featured={i === 0} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
