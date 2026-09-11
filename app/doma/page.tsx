import type { Metadata } from 'next';
import Link from 'next/link';
import HousesGrid from '@/components/home/HousesGrid';
import { SITE } from '@/lib/site';
import { KOMPLEKTACII, calcHouse, fmtMln } from '@/lib/doma';
import { byTag } from '@/lib/gallery';
import { buildGraph, buildBreadcrumb, buildFaqPage, ID } from '@/lib/schema';
import { ogDefaults } from '@/lib/seo-snippets';

/**
 * /doma/ — посадочная второго направления. До 11.09.2026 «дом под ключ» жил на сайте
 * только в двух статьях блога, хотя спрос «дом под ключ» в СПб+ЛО в 27 раз больше,
 * чем «фундамент под ключ» (Wordstat 11.09.2026).
 */

const TITLE = 'Строительство домов из газобетона под ключ в СПб и Ленобласти';
const DESC = 'Дома из газобетона ЛСР под ключ в СПб и Ленобласти: четыре комплектации от холодного контура 35 000 ₽/м² до дома под ключ 70 000 ₽/м². Договор с фиксированной ценой, оплата этапами, гарантия 5 лет.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/doma/' },
  openGraph: ogDefaults('/doma/', `${TITLE} · ${SITE.name}`, DESC, 'website', '/images/doma/dom-01.jpg'),
};

const FAQ = [
  {
    q: 'Сколько стоит дом из газобетона под ключ в СПб и Ленобласти?',
    a: '70 000 ₽/м² площади застройки первого этажа и 60 000 ₽/м² второго — с плитой, стенами, кровлей, окнами, инженерией и чистовой отделкой. Одноэтажный дом 100 м² под ключ — 7 млн ₽, тёплый контур того же дома — 4,2 млн ₽. При жилой площади больше 150 м² ставка «под ключ» ниже на 5 000 ₽/м². Терраса и крыльцо — 15 000 ₽/м² отдельно.',
  },
  {
    q: 'Что такое тёплый контур и почему его берут чаще всего?',
    a: 'Плита, стены, кровля, окна, входная дверь, утепление и пароизоляция — за 42 000 ₽/м² и 3 месяца. Дом закрыт от зимы, внутри можно работать в холода и вести отделку в своём темпе. Это самая частая комплектация: большая часть денег идёт в конструктив, который нельзя переделать, а отделку заказчик планирует сам.',
  },
  {
    q: 'Какой фундамент под дом из газобетона вы делаете?',
    a: 'Монолитную плиту 300 мм: песчаная подушка, геотекстиль, гидроизоляция, два слоя арматуры А500С Ø12, заводской бетон. Это наша основная специализация — 239 объектов. Плита входит во все четыре комплектации.',
  },
  {
    q: 'Из какого газобетона строите?',
    a: 'ЛСР — мы партнёр завода. Блок идёт напрямую с завода с паспортом качества, кладка на клей с армированием рядов, армопояс под перекрытием и мауэрлатом.',
  },
  {
    q: 'Как проходит оплата и есть ли ипотека?',
    a: 'Договор с фиксированной ценой, оплата этапами 25/25/25/25 по факту принятых работ. С ипотекой не работаем — только собственные средства заказчика. Можно строить по годам: холодный контур осенью, тёплый весной — с пересчётом только следующего этапа.',
  },
  {
    q: 'Сколько времени занимает стройка?',
    a: 'Холодный контур — 2 месяца, тёплый — 3, White Box — 5, под ключ — 6 месяцев. Плита набирает прочность 28 суток — это входит в срок. Зимой не останавливаемся.',
  },
];

export default function DomaPage() {
  const photos = byTag('doma').slice(0, 8);
  const graph = buildGraph(
    [
      {
        '@type': 'Service',
        '@id': `${SITE.url}/doma/#service`,
        name: 'Строительство домов из газобетона под ключ',
        serviceType: 'Строительство домов из газобетона',
        provider: { '@id': ID.org },
        areaServed: SITE.areaServed,
        url: `${SITE.url}/doma/`,
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Комплектации дома из газобетона',
          itemListElement: KOMPLEKTACII.map((k) => ({
            '@type': 'Offer',
            name: `${k.name} — дом из газобетона`,
            priceCurrency: 'RUB',
            price: k.rate1,
            priceSpecification: { '@type': 'UnitPriceSpecification', price: k.rate1, priceCurrency: 'RUB', unitText: '₽/м²' },
            availability: 'https://schema.org/InStock',
          })),
        },
      },
    ],
    [
      buildBreadcrumb('/doma/', [
        { name: 'Главная', url: SITE.url },
        { name: 'Дома из газобетона', url: `${SITE.url}/doma/` },
      ]),
      buildFaqPage('/doma/', FAQ)!,
    ]
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      <section className="container-x pt-10 md:pt-14 pb-8">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Дома из газобетона</li>
          </ol>
        </nav>
        <div className="text-xs font-bold uppercase tracking-wider text-brand-mute">Партнёр ЛСР Газобетон · плита + стены + кровля + отделка одной бригадой</div>
        <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl">
          Строительство домов из газобетона под ключ в Санкт-Петербурге и Ленобласти
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
          Мы начинали с фундаментов и до сих пор считаем, что дом начинается с плиты. Поэтому дом из газобетона у нас — это та же
          бригада, что заливала {SITE.projectsCount} плит: монолитная плита 300 мм, стены из блока ЛСР с завода, кровля, инженерия и отделка
          по одному договору с фиксированной ценой. Четыре комплектации — от холодного контура до ключей — чтобы вы платили только за то, что нужно сейчас.
        </p>
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {KOMPLEKTACII.map((k) => (
            <Link key={k.slug} href="/doma/ceny/" className={`block rounded-xl border p-5 hover:border-brand-ink transition ${k.popular ? 'bg-brand-ink text-white border-brand-ink' : 'bg-white border-brand-line'}`}>
              <div className={`text-xs uppercase tracking-wider ${k.popular ? 'text-white/70' : 'text-brand-mute'}`}>{k.name}{k.popular ? ' · берут чаще всего' : ''}</div>
              <div className="mt-1 text-2xl font-extrabold">{k.rate1.toLocaleString('ru-RU')} ₽/м²</div>
              <div className={`text-sm mt-1 ${k.popular ? 'text-white/80' : 'text-brand-mute'}`}>{k.months} мес. · 2-й этаж {k.rate2.toLocaleString('ru-RU')} ₽/м²</div>
            </Link>
          ))}
        </div>
        <p className="mt-3 text-xs text-brand-mute">Ставка за м² площади застройки первого этажа, без террасы и крыльца (они — 15 000 ₽/м²). При жилой площади больше 150 м² White Box и «под ключ» дешевле на 5 000 ₽/м². Доставка материалов в ставке.</p>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Что входит в каждую комплектацию</h2>
        <p>Каждая следующая комплектация — это предыдущая плюс новый слой работ. Перейти на уровень выше можно и по ходу стройки — до начала этапа, с пересчётом только этой части. Можно растянуть по годам: коробка осенью, тёплый контур весной.</p>
        <div className="not-prose grid gap-4 md:grid-cols-2">
          {KOMPLEKTACII.map((k) => (
            <article key={k.slug} className="rounded-2xl border border-brand-line bg-white p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h3 className="text-xl font-extrabold text-brand-ink">{k.name}</h3>
                <div className="font-extrabold whitespace-nowrap">{k.rate1.toLocaleString('ru-RU')} ₽/м²</div>
              </div>
              <p className="mt-2 text-sm text-brand-mute leading-relaxed">{k.short} Срок — {k.months} мес.</p>
              <ul className="mt-3 space-y-1 text-sm text-brand-mute">
                {k.includes.map((x) => <li key={x} className="flex gap-2"><span className="font-bold text-brand-ink">+</span>{x}</li>)}
              </ul>
              <div className="mt-3 text-xs text-brand-mute">Нет: {k.excludes.join(', ').toLowerCase()}.</div>
            </article>
          ))}
        </div>

        <h2>Сколько это стоит на примере</h2>
        <p>Одноэтажный дом 100 м² застройки с террасой 12 м²:</p>
        <ul>
          {KOMPLEKTACII.map((k) => (
            <li key={k.slug}><strong>{k.name}</strong> — {fmtMln(calcHouse(k, 100, 0, 12))} ({k.months} мес.)</li>
          ))}
        </ul>
        <p>Двухэтажный дом 80 + 80 м² с крыльцом 6 м²: тёплый контур — {fmtMln(calcHouse(KOMPLEKTACII[1], 80, 80, 6))}, под ключ — {fmtMln(calcHouse(KOMPLEKTACII[3], 80, 80, 6))}. Второй этаж дешевле: под ним нет плиты и земляных работ. Подробная матрица и что из материалов входит — на странице <Link href="/doma/ceny/">цен на дома</Link>.</p>

        <h2>Из чего строим</h2>
        <p><strong>Фундамент</strong> — монолитная плита 300 мм: песчаная подушка с уплотнением, геотекстиль, гидроизоляция, два слоя арматуры А500С Ø12 сетками 200×200, заводской бетон с паспортом, закладные под канализацию и воду до заливки. <strong>Стены</strong> — газобетон ЛСР с завода, кладка на клей, армирование рядов, монолитные перемычки и армопояс. <strong>Кровля</strong> — стропильная система, кровельный пирог, подшив свесов, водосток. <strong>Тёплый контур</strong> — окна ПВХ, входная дверь, утепление и пароизоляция. Дальше — инженерия, фасад, стяжки и отделка по составу White Box и «под ключ».</p>

        <h2>Как проходит стройка</h2>
        <p>Замер и проект → плита → стены → кровля → окна и утепление → фасад и инженерия → отделка. Каждый этап принимается по акту и оплачивается после приёмки — 25/25/25/25. Подробно по неделям: <Link href="/doma/etapy/">этапы строительства</Link>.</p>
      </section>

      <HousesGrid />

      {photos.length > 0 && (
        <section className="container-x py-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Со стройки</h2>
          <p className="text-brand-mute mb-6 max-w-3xl">Кладка, перекрытия, кровля, зимние работы — кадры с площадок без постановки.</p>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {photos.map((p) => (
              <img key={p.src} src={p.thumb} alt={p.alt} className="aspect-[4/3] w-full rounded-2xl object-cover border border-brand-line" loading="lazy" />
            ))}
          </div>
          <p className="mt-4 text-sm"><Link href="/obekty/#doma" className="font-semibold text-brand-ink hover:underline">Все объекты →</Link></p>
        </section>
      )}

      <section className="container-x pb-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Вопросы о домах</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white border border-brand-line p-5 md:p-6 open:border-brand-ink transition">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-lg leading-snug text-brand-ink">
                <span>{f.q}</span>
                <span className="flex-shrink-0 text-brand-mute group-open:rotate-180 transition-transform mt-1">▾</span>
              </summary>
              <p className="mt-4 text-brand-mute leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="rounded-2xl bg-brand-ink text-white p-7 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Расчёт дома по вашему проекту — бесплатно</h2>
          <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">Пришлите план или размеры — посчитаем четыре комплектации и покажем, где границы между ними. Проекта нет — подберём из базы готовых.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={SITE.telegram} target="_blank" rel="noopener" className="rounded-xl bg-amber-400 text-brand-ink px-7 py-4 font-bold no-underline hover:opacity-90 transition">Написать в Telegram →</a>
            <a href={`tel:${SITE.phoneRaw}`} className="rounded-xl border border-white/40 px-7 py-4 font-bold no-underline hover:bg-white/10 transition">Позвонить</a>
          </div>
        </div>
      </section>
    </>
  );
}
