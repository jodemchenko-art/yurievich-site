import type { Metadata } from 'next';
import Link from 'next/link';
import { REGIONS } from '@/lib/regions';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Плитный фундамент по районам СПб и Ленобласти — цены и расчёт',
  description:
    'СК «Юрьевич» строит плитные фундаменты во всех районах СПб и ЛО. Калькулятор стоимости + информация о грунтах вашего района. Реальные сметы 2026.',
  alternates: { canonical: '/fundament/' },
};

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Фундаменты по районам', item: `${SITE.url}/fundament/` },
  ],
};

export default function FundamentIndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }} />

      <section className="container-x pt-10 md:pt-14 pb-6">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Фундаменты по районам</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-3xl">
          Плитный фундамент по районам СПб и Ленобласти
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-2xl leading-relaxed">
          Выберите свой район — мы знаем местные грунты и реальные цены. У каждого района своя
          специфика: где-то торфяники с выторфовкой, где-то идеальные пески, где-то пучинистые
          суглинки.
        </p>
      </section>

      <section className="container-x pb-20">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r) => (
            <Link
              key={r.slug}
              href={`/fundament/${r.slug}/`}
              className="group block bg-white rounded-2xl border border-brand-line p-6 md:p-7 hover:border-brand-ink hover:shadow-xl transition"
            >
              <div className="text-xs font-semibold uppercase tracking-wider text-brand-mute mb-2">
                📍 {r.drivingTime}
              </div>
              <h2 className="text-xl md:text-2xl font-extrabold leading-tight text-brand-ink group-hover:underline">
                {r.name}
              </h2>
              <p className="mt-3 text-sm text-brand-mute leading-relaxed line-clamp-3">
                {r.groundDescription}
              </p>
              <div className="mt-5 flex items-baseline justify-between">
                <div>
                  <div className="text-xs text-brand-mute">от</div>
                  <div className="text-2xl font-extrabold text-brand-ink">
                    {r.priceFrom.toLocaleString('ru-RU')} <span className="text-sm text-brand-mute">₽/м²</span>
                  </div>
                </div>
                <span className="text-brand-ink font-bold">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
