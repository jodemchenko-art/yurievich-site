import type { Metadata } from 'next';
import Link from 'next/link';
import { GLOSSARY, CATEGORY_LABELS, GlossaryTerm } from '@/lib/glossary';
import { SITE } from '@/lib/site';
import { buildBreadcrumb, buildGraph } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Словарь стройтерминов — СК «Юрьевич»',
  description: `Расшифровка ${GLOSSARY.length} ключевых терминов из стройки фундаментов в СПб и Ленобласти: бетон М300, арматура А500С, выторфовка, ЭППС и другие. Простые объяснения с примерами.`,
  alternates: { canonical: '/slovar/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE.url}/slovar/`,
    title: 'Словарь стройтерминов — СК «Юрьевич»',
    description: `${GLOSSARY.length} терминов из стройки фундаментов с практикой 239 объектов СПб и ЛО.`,
    siteName: SITE.name,
  },
};

export default function SlovarIndexPage() {
  // группировка по категориям
  const byCategory: Record<string, GlossaryTerm[]> = {};
  for (const term of GLOSSARY) {
    if (!byCategory[term.category]) byCategory[term.category] = [];
    byCategory[term.category].push(term);
  }

  const pageGraph = buildGraph([
    buildBreadcrumb('/slovar/', [
      { name: 'Главная', url: SITE.url },
      { name: 'Словарь стройтерминов', url: `${SITE.url}/slovar/` },
    ]),
    {
      '@type': 'DefinedTermSet',
      '@id': `${SITE.url}/slovar/#defined-term-set`,
      name: 'Словарь стройтерминов СК «Юрьевич»',
      description: `${GLOSSARY.length} терминов из практики фундаментных работ в СПб и Ленобласти`,
      hasDefinedTerm: GLOSSARY.map((t) => ({
        '@type': 'DefinedTerm',
        '@id': `${SITE.url}/slovar/${t.slug}/#term`,
        name: t.term,
        description: t.shortDef,
        url: `${SITE.url}/slovar/${t.slug}/`,
      })),
    },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph) }}
      />

      <section className="container-x pt-10 md:pt-14 pb-6">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Словарь стройтерминов</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-3xl">
          Словарь стройтерминов: {GLOSSARY.length} понятий из практики СК «Юрьевич»
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
          Что значит «А500С», «выторфовка», «класс водонепроницаемости W6» и почему это важно для вашего фундамента. Простые объяснения с реальными цифрами от строителей с 239 объектами в Ленобласти.
        </p>
      </section>

      <section className="container-x pb-20">
        <div className="grid gap-8">
          {Object.entries(byCategory).map(([catKey, terms]) => (
            <div key={catKey}>
              <h2 className="text-xl md:text-2xl font-extrabold mb-4">
                {CATEGORY_LABELS[catKey as keyof typeof CATEGORY_LABELS]}
                <span className="text-base text-brand-mute font-normal ml-3">({terms.length})</span>
              </h2>
              <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                {terms.map((t) => (
                  <Link
                    key={t.slug}
                    href={`/slovar/${t.slug}/`}
                    className="group block bg-white rounded-xl border border-brand-line p-4 hover:border-brand-ink hover:shadow-lg transition"
                  >
                    <div className="font-bold text-brand-ink group-hover:underline">{t.term}</div>
                    <p className="mt-2 text-sm text-brand-mute leading-snug line-clamp-2">{t.shortDef}</p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
