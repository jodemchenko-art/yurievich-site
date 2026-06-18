import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { GLOSSARY, getTermBySlug, getAllTermSlugs, getRelatedTerms, CATEGORY_LABELS } from '@/lib/glossary';
import { getArticleBySlug } from '@/lib/articles';
import { SITE } from '@/lib/site';
import { buildBreadcrumb, buildGraph } from '@/lib/schema';

type Params = { term: string };

export function generateStaticParams() {
  return GLOSSARY.map((t) => ({ term: t.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const t = getTermBySlug(params.term);
  if (!t) return {};
  const title = `${t.term} — что это, для чего нужно | СК «Юрьевич»`;
  const description = `${t.shortDef} Простое объяснение с практикой 239 объектов в СПб и Ленобласти.`;
  return {
    title,
    description,
    keywords: [t.term, `${t.term} что это`, `${t.term} определение`, `${t.term} простыми словами`],
    alternates: { canonical: `/slovar/${t.slug}/` },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      url: `${SITE.url}/slovar/${t.slug}/`,
      title,
      description,
      siteName: SITE.name,
    },
  };
}

export default function TermPage({ params }: { params: Params }) {
  const t = getTermBySlug(params.term);
  if (!t) notFound();

  const related = getRelatedTerms(t.slug);
  const relatedArticles = (t.relatedArticles || [])
    .map((s) => getArticleBySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getArticleBySlug>>[];
  const canonicalUrl = `${SITE.url}/slovar/${t.slug}/`;

  const pageGraph = buildGraph([
    buildBreadcrumb(`/slovar/${t.slug}/`, [
      { name: 'Главная', url: SITE.url },
      { name: 'Словарь', url: `${SITE.url}/slovar/` },
      { name: t.term, url: canonicalUrl },
    ]),
    {
      '@type': 'DefinedTerm',
      '@id': `${canonicalUrl}#term`,
      name: t.term,
      description: t.shortDef,
      inDefinedTermSet: { '@id': `${SITE.url}/slovar/#defined-term-set` },
      url: canonicalUrl,
    },
    {
      '@type': 'Article',
      '@id': `${canonicalUrl}#article`,
      headline: `${t.term} — что это и для чего нужно`,
      description: t.shortDef,
      author: { '@id': `${SITE.url}/#yuri-demchenko` },
      publisher: { '@id': `${SITE.url}/#organization` },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      inLanguage: 'ru-RU',
    },
  ]);

  // Конвертируем longDef в HTML с параграфами
  const longHtml = t.longDef
    .split('\n\n')
    .map((p) => `<p>${p.replace(/\n/g, ' ').trim()}</p>`)
    .join('\n');

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph) }}
      />

      <section className="container-x pt-10 md:pt-14 pb-6">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/slovar/" className="hover:text-brand-ink transition">Словарь</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">{t.term}</li>
          </ol>
        </nav>

        <div className="text-xs font-semibold uppercase tracking-wider text-brand-mute mb-3">
          {CATEGORY_LABELS[t.category]}
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl">
          {t.term}
        </h1>

        <div className="mt-6 max-w-3xl bg-brand-sand/40 border-l-4 border-brand-ink p-5 rounded-r-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-brand-mute mb-2">Кратко</div>
          <p className="text-lg text-brand-ink leading-relaxed font-medium">{t.shortDef}</p>
        </div>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Подробно</h2>
        <div dangerouslySetInnerHTML={{ __html: longHtml }} />
      </section>

      {related.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Связанные термины</h2>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/slovar/${r.slug}/`}
                className="group block bg-white rounded-xl border border-brand-line p-4 hover:border-brand-ink hover:shadow-lg transition"
              >
                <div className="font-bold text-brand-ink group-hover:underline">{r.term}</div>
                <p className="mt-2 text-sm text-brand-mute leading-snug line-clamp-2">{r.shortDef}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {relatedArticles.length > 0 && (
        <section className="container-x pb-16">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Статьи блога по теме</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {relatedArticles.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}/`}
                className="group block bg-white rounded-2xl border border-brand-line p-5 hover:border-brand-ink hover:shadow-lg transition"
              >
                <div className="font-bold text-brand-ink group-hover:underline">{a.title}</div>
                <div className="mt-2 text-sm text-brand-mute">{a.reading_time} мин чтения</div>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container-x pb-20 max-w-3xl">
        <div className="rounded-2xl bg-brand-sand p-6 md:p-8">
          <h2 className="text-xl md:text-2xl font-extrabold mb-3">Хотите рассчитать ваш фундамент?</h2>
          <p className="text-brand-mute mb-5">Калькулятор учитывает грунт, материал стен и размер. Расчёт без регистрации, бесплатно.</p>
          <Link
            href="/kalkulyator/"
            className="inline-block rounded-xl bg-brand-ink text-white px-7 py-3 font-bold no-underline hover:opacity-90"
          >
            Открыть калькулятор →
          </Link>
        </div>
      </section>
    </>
  );
}
