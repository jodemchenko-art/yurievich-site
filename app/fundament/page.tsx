import type { Metadata } from 'next';
import Link from 'next/link';
import { REGIONS } from '@/lib/regions';
import { LOCALITIES, getLocalitiesByRegion } from '@/lib/localities';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Фундамент под ключ в СПб и ЛО на пучинистых грунтах — монолитный',
  description:
    'Монолитный плитный фундамент под ключ в СПб и Ленобласти на пучинистых грунтах — от 5 500 ₽/м². ' +
    'Знаем грунты каждого района, реальные цены. Бетон М300, гарантия 5 лет, договор с фикс-ценой. ' +
    'Выезд инженера бесплатно. ☎ +7 911 830-01-10',
  keywords: [
    'фундамент по районам Ленинградской области',
    'фундамент под ключ по районам СПб и ЛО',
    'цена фундамента по районам',
    'монолитная плита по районам ЛО',
    'плитный фундамент Ленинградская область районы',
    'фундамент Всеволожск Гатчина Выборг Тосно',
  ],
  alternates: { canonical: '/fundament/' },
};

// Коммерческий FAQ хаба — под сниппет и Нейро-цитирование (FAQPage)
const HUB_FAQ = [
  {
    q: 'Сколько стоит фундамент под ключ в СПб и Ленобласти?',
    a: 'Монолитная плита под ключ — от 5 500 ₽/м² с материалами (бетон М300, арматура А500С, подушка, опалубка, заливка). Плита 10×10 — от 550 000 ₽. Финальная цена зависит от района, грунта (на торфе дороже из-за выторфовки), толщины плиты (250–350 мм) и веса дома. Точная смета — после бесплатного выезда инженера.',
  },
  {
    q: 'От чего зависит цена фундамента?',
    a: 'От четырёх вещей: грунт участка (пески дешевле, торф и глина дороже из-за выторфовки и дренажа), размер и толщина плиты, вес дома (этажность, материал стен) и удалённость от базы (доставка бетона). Поэтому цену «в лоб» назвать нельзя — считаем по вашему участку после геологии.',
  },
  {
    q: 'За какой срок заливаете фундамент?',
    a: 'Плита 100 м² под ключ — 10–14 рабочих дней: подушка с уплотнением, опалубка, армирование в два пояса, заливка бетоном М300 с завода ЛСР, уход за бетоном. Выезд инженера на замер — за 1–3 дня после заявки, смета — за 1–2 дня после выезда.',
  },
  {
    q: 'Заливаете ли фундамент зимой?',
    a: 'Да, работаем круглый год. Зимой добавляем противоморозные добавки в бетон М300 W6 F150, прогреваем плиту и утепляем опалубку термоматами. Зимняя заливка на 10–15% дороже, но сроки часто короче — на заводе меньше очередь, а мёрзлый грунт не «расползается» при разработке.',
  },
  {
    q: 'Какая гарантия и как платить?',
    a: 'Гарантия 5 лет — пункт в договоре с фиксированной ценой. Оплата поэтапная, только по принятым этапам (подушка, армирование, заливка) — предоплаты за работу нет. На каждый этап подписываем акт — это юридическая защита заказчика.',
  },
  {
    q: 'В каких районах вы работаете?',
    a: 'Санкт-Петербург и вся Ленинградская область: Всеволожский, Гатчинский, Выборгский, Тосненский, Кировский, Приозерский, Ломоносовский районы и Курортный район СПб. База в посёлке Песочный. Выезжаем на замер бесплатно.',
  },
];

const HUB_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE.url },
        { '@type': 'ListItem', position: 2, name: 'Фундамент под ключ по районам', item: `${SITE.url}/fundament/` },
      ],
    },
    {
      '@type': 'FAQPage',
      '@id': `${SITE.url}/fundament/#faq`,
      mainEntity: HUB_FAQ.map((f) => ({
        '@type': 'Question',
        name: f.q,
        acceptedAnswer: { '@type': 'Answer', text: f.a },
      })),
    },
    {
      '@type': 'Service',
      '@id': `${SITE.url}/fundament/#service`,
      name: 'Фундамент под ключ в СПб и Ленобласти',
      serviceType: 'Монолитный плитный фундамент',
      provider: { '@id': `${SITE.url}/#organization` },
      areaServed: SITE.areaServed,
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: 5500,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: 5500,
          priceCurrency: 'RUB',
          unitText: '₽/м²',
        },
      },
    },
  ],
};

export default function FundamentIndexPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(HUB_SCHEMA) }} />

      <section className="container-x pt-10 md:pt-14 pb-6">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Фундамент под ключ по районам</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-3xl">
          Фундамент под ключ по районам СПб и Ленобласти
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-2xl leading-relaxed">
          Монолитный плитный фундамент под ключ <strong className="text-brand-ink">от 5 500 ₽/м²</strong> с материалами.
          Выберите свой район — мы знаем местные грунты и реальные цены. У каждого района своя специфика:
          где-то торфяники с выторфовкой, где-то идеальные пески, где-то пучинистые суглинки.
        </p>

        {/* Ценовой + доверие блок */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl">
          <div className="bg-white rounded-xl border border-brand-line p-5">
            <div className="text-2xl font-extrabold text-brand-ink">от 5 500 ₽/м²</div>
            <div className="text-sm text-brand-mute mt-1">Плита под ключ с материалами</div>
          </div>
          <div className="bg-white rounded-xl border border-brand-line p-5">
            <div className="text-2xl font-extrabold text-brand-ink">5 лет</div>
            <div className="text-sm text-brand-mute mt-1">Гарантия в договоре</div>
          </div>
          <div className="bg-white rounded-xl border border-brand-line p-5">
            <div className="text-2xl font-extrabold text-brand-ink">{SITE.projectsCount}+</div>
            <div className="text-sm text-brand-mute mt-1">Объектов в СПб и ЛО</div>
          </div>
          <div className="bg-white rounded-xl border border-brand-line p-5">
            <div className="text-2xl font-extrabold text-brand-ink">★ {SITE.rating}</div>
            <div className="text-sm text-brand-mute mt-1">{SITE.reviewsCount} отзывов, Авито</div>
          </div>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/kalkulyator/"
            className="inline-flex items-center rounded-xl bg-brand-ink text-white px-6 py-3 font-semibold hover:opacity-90 transition"
          >
            Рассчитать стоимость
          </Link>
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="inline-flex items-center gap-2 rounded-xl border border-brand-ink text-brand-ink px-6 py-3 font-semibold hover:bg-brand-sand transition"
          >
            📞 {SITE.phone}
          </a>
        </div>
      </section>

      <section className="container-x pb-10">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Выберите район работ</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {REGIONS.map((r) => {
            const locs = getLocalitiesByRegion(r.slug);
            return (
              <div
                key={r.slug}
                className="group block bg-white rounded-2xl border border-brand-line p-6 md:p-7 hover:border-brand-ink hover:shadow-xl transition"
              >
                <div className="text-xs font-semibold uppercase tracking-wider text-brand-mute mb-2">
                  📍 {r.drivingTime}
                </div>
                <Link href={`/fundament/${r.slug}/`}>
                  <h3 className="text-xl md:text-2xl font-extrabold leading-tight text-brand-ink group-hover:underline">
                    Фундамент в {r.prepositional}
                  </h3>
                </Link>
                <p className="mt-3 text-sm text-brand-mute leading-relaxed line-clamp-3">
                  {r.groundDescription}
                </p>
                {locs.length > 0 && (
                  <ul className="mt-4 flex flex-wrap gap-x-3 gap-y-1 text-sm">
                    {locs.map((l) => (
                      <li key={l.slug}>
                        <Link
                          href={`/fundament/${r.slug}/${l.slug}/`}
                          className="text-brand-ink underline decoration-brand-line underline-offset-4 hover:decoration-brand-ink transition"
                        >
                          {l.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
                <div className="mt-5 flex items-baseline justify-between">
                  <div>
                    <div className="text-xs text-brand-mute">от</div>
                    <div className="text-2xl font-extrabold text-brand-ink">
                      {r.priceFrom.toLocaleString('ru-RU')} <span className="text-sm text-brand-mute">₽/м²</span>
                    </div>
                  </div>
                  <Link href={`/fundament/${r.slug}/`} className="text-brand-ink font-bold" aria-label={`Фундамент в ${r.prepositional}`}>→</Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ — коммерческий, под сниппет */}
      <section className="section bg-brand-sand">
        <div className="container-x max-w-4xl">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-ink">
            Частые вопросы про фундамент под ключ
          </h2>
          <div className="mt-8 space-y-4">
            {HUB_FAQ.map((item, i) => (
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

      {/* Финальный CTA */}
      <section className="section">
        <div className="container-x">
          <div className="bg-brand-ink text-white rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold">Бесплатный расчёт фундамента под ключ</h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Оставьте заявку или позвоните — инженер приедет на участок, сделает замеры, определит грунт
              и пришлёт смету за 1–2 дня. Без обязательств и предоплаты.
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
