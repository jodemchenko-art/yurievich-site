import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { REGIONS, getRegionBySlug } from '@/lib/regions';
import { LOCALITIES, getLocalityBySlug } from '@/lib/localities';
import { SITE } from '@/lib/site';
import { buildGraph, buildBreadcrumb, buildFaqPage, ID } from '@/lib/schema';

type Params = { region: string; locality: string };

export function generateStaticParams() {
  return LOCALITIES.map((l) => ({ region: l.regionSlug, locality: l.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const region = getRegionBySlug(params.region);
  const locality = getLocalityBySlug(params.region, params.locality);
  if (!region || !locality) return {};

  const title = `Фундамент в ${locality.prepositional} (${region.name}) — плита под газобетон, цена`;
  const description = `Плитный фундамент под ключ в ${locality.prepositional}. Цена от ${locality.priceFrom.toLocaleString('ru-RU')} ₽/м². Грунты ${locality.name}, реальные кейсы СК «Юрьевич». Бесплатный выезд инженера.`;

  return {
    title,
    description,
    keywords: [
      `фундамент ${locality.name}`,
      `плита ${locality.name}`,
      `плитный фундамент ${locality.name}`,
      `монолитная плита ${locality.name}`,
      `строительство в ${locality.prepositional}`,
      `цена плиты ${locality.name}`,
      `фундамент ${region.shortName} ${locality.name}`,
    ],
    alternates: { canonical: `/fundament/${region.slug}/${locality.slug}/` },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: `${SITE.url}/fundament/${region.slug}/${locality.slug}/`,
      title,
      description,
      siteName: SITE.name,
    },
  };
}

export default function LocalityPage({ params }: { params: Params }) {
  const region = getRegionBySlug(params.region);
  const locality = getLocalityBySlug(params.region, params.locality);
  if (!region || !locality) notFound();

  const canonicalUrl = `${SITE.url}/fundament/${region.slug}/${locality.slug}/`;
  const breadcrumbPath = `/fundament/${region.slug}/${locality.slug}/`;

  const pageGraph = buildGraph(
    [
      {
        '@type': 'Service',
        '@id': `${canonicalUrl}#service`,
        name: `Плитный фундамент в ${locality.prepositional}`,
        description: locality.groundNote.slice(0, 240),
        provider: { '@id': ID.org },
        areaServed: {
          '@type': 'Place',
          name: locality.name,
          containedInPlace: {
            '@type': 'AdministrativeArea',
            name: region.name,
          },
        },
        serviceType: 'Монолитный плитный фундамент',
        offers: {
          '@type': 'Offer',
          priceCurrency: 'RUB',
          price: locality.priceFrom,
          priceSpecification: {
            '@type': 'UnitPriceSpecification',
            price: locality.priceFrom,
            priceCurrency: 'RUB',
            unitText: '₽/м²',
          },
        },
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${canonicalUrl}#localbusiness`,
        name: `СК «Юрьевич» — фундаменты в ${locality.prepositional}`,
        description: `Монолитные плитные фундаменты под ключ в ${locality.prepositional} (${region.name}, ЛО). ${locality.groundNote.slice(0, 160)}`,
        url: canonicalUrl,
        telephone: SITE.phone,
        priceRange: '₽₽',
        branchOf: { '@id': ID.org },
        parentOrganization: { '@id': ID.org },
        areaServed: {
          '@type': 'Place',
          name: locality.name,
          containedInPlace: { '@type': 'AdministrativeArea', name: region.name },
        },
        sameAs: ['https://yandex.ru/maps/org/69393767573'],
      },
      {
        '@type': 'Place',
        '@id': `${canonicalUrl}#place`,
        name: locality.name,
        description: locality.groundNote,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: region.name,
          containedInPlace: { '@type': 'AdministrativeArea', name: 'Ленинградская область' },
        },
      },
    ],
    [
      buildBreadcrumb(breadcrumbPath, [
        { name: 'Главная', url: SITE.url },
        { name: 'Фундаменты по районам', url: `${SITE.url}/fundament/` },
        { name: region.name, url: `${SITE.url}/fundament/${region.slug}/` },
        { name: locality.name, url: canonicalUrl },
      ]),
      buildFaqPage(breadcrumbPath, locality.faq)!,
    ]
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph) }}
      />

      <section className="section bg-brand-sand">
        <div className="container-x">
          <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
            <ol className="flex flex-wrap items-center gap-2">
              <li><Link href="/" className="hover:text-brand-ink">Главная</Link></li>
              <li aria-hidden>›</li>
              <li><Link href="/fundament/" className="hover:text-brand-ink">Фундаменты по районам</Link></li>
              <li aria-hidden>›</li>
              <li><Link href={`/fundament/${region.slug}/`} className="hover:text-brand-ink">{region.name}</Link></li>
              <li aria-hidden>›</li>
              <li className="text-brand-ink font-semibold">{locality.name}</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold text-brand-ink leading-tight max-w-4xl">
            Плитный фундамент в {locality.prepositional} ({region.shortName})
          </h1>
          <p className="mt-4 text-lg text-brand-mute max-w-3xl leading-relaxed">
            Монолитные плиты под газобетонный дом в {locality.prepositional}. Цена под ключ от {locality.priceFrom.toLocaleString('ru-RU')} до {locality.priceTo.toLocaleString('ru-RU')} ₽/м² — зависит от размера, толщины и грунта. Бесплатный выезд инженера, договор с фикс-ценой, гарантия 5 лет.
          </p>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl">
            <div className="bg-white rounded-xl border border-brand-line p-5">
              <div className="text-2xl font-extrabold text-brand-ink">от {locality.priceFrom.toLocaleString('ru-RU')} ₽/м²</div>
              <div className="text-sm text-brand-mute mt-1">Под ключ с материалами</div>
            </div>
            <div className="bg-white rounded-xl border border-brand-line p-5">
              <div className="text-2xl font-extrabold text-brand-ink">{locality.driveTime}</div>
              <div className="text-sm text-brand-mute mt-1">Дорога до участка</div>
            </div>
            <div className="bg-white rounded-xl border border-brand-line p-5">
              <div className="text-2xl font-extrabold text-brand-ink">{SITE.projectsCount}+ объектов</div>
              <div className="text-sm text-brand-mute mt-1">Сданных в СПб и ЛО</div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-ink">Грунты {locality.prepositional}</h2>
            <p className="mt-4 text-brand-mute leading-relaxed">{locality.groundNote}</p>
            <p className="mt-4 text-brand-mute leading-relaxed">
              Перед заливкой делаем ручное бурение в 4 точках по углам пятна застройки на глубину 4-6 м, фиксируем УГВ через 30 минут. На основании отчёта подбираем толщину плиты и тип подушки. Геология за 15-25 тыс ₽ экономит 300-800 тыс на правильно подобранном фундаменте.
            </p>
            <Link
              href={`/fundament/${region.slug}/`}
              className="inline-block mt-6 text-brand-ink font-semibold hover:underline"
            >
              ← Все грунты {region.shortName}
            </Link>
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-brand-ink">Реальные объекты в {locality.prepositional}</h2>
            <ul className="mt-4 space-y-3">
              {locality.examples.map((ex, i) => (
                <li key={i} className="flex gap-3 text-brand-mute leading-relaxed">
                  <span className="text-brand-ink font-bold mt-0.5">{i + 1}.</span>
                  <span>{ex}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-brand-mute">
              Адреса не публикуем без разрешения заказчиков. По запросу покажем фото-отчёты и видео процесса.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-brand-sand">
        <div className="container-x max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-ink">Вопросы по фундаменту в {locality.prepositional}</h2>
          <div className="mt-8 space-y-6">
            {locality.faq.map((item, i) => (
              <details key={i} className="bg-white rounded-xl border border-brand-line p-5 md:p-6 group">
                <summary className="cursor-pointer font-extrabold text-lg text-brand-ink list-none flex justify-between items-start gap-4">
                  <span>{item.q}</span>
                  <span className="text-brand-mute text-2xl leading-none group-open:rotate-45 transition">+</span>
                </summary>
                <p className="mt-4 text-brand-mute leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="bg-brand-ink text-white rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold">Бесплатный расчёт фундамента в {locality.prepositional}</h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Позвоните или оставьте заявку — инженер приедет на участок, сделает замеры, подберёт грунт и пришлёт смету за 1-2 дня. Без обязательств и предоплаты.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-ink font-semibold hover:bg-white/90 transition"
              >
                📞 {SITE.phone}
              </a>
              <Link
                href="/#contacts"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition"
              >
                Оставить заявку
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
