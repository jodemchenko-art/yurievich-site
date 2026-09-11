import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { KOMPLEKTACII, TERRACE_RATE, calcHouse, fmtMln } from '@/lib/doma';
import { buildGraph, buildBreadcrumb, buildFaqPage } from '@/lib/schema';
import { ogDefaults } from '@/lib/seo-snippets';

const TITLE = 'Цены на дом из газобетона в СПб: комплектации и ставки за м²';
const DESC = 'Цены на дом из газобетона в СПб и Ленобласти: холодный контур 35 000, тёплый 42 000, White Box 60 000, под ключ 70 000 ₽/м². Состав комплектаций, примеры расчёта, оплата этапами.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/doma/ceny/' },
  openGraph: ogDefaults('/doma/ceny/', `${TITLE} · ${SITE.name}`, DESC, 'website', '/images/doma/dom-02.jpg'),
};

const EXAMPLES: Array<{ name: string; f1: number; f2: number; terr: number; big?: boolean }> = [
  { name: 'Одноэтажный 80 м²', f1: 80, f2: 0, terr: 8 },
  { name: 'Одноэтажный 100 м² с террасой', f1: 100, f2: 0, terr: 12 },
  { name: 'Одноэтажный 130 м²', f1: 130, f2: 0, terr: 15 },
  { name: 'Двухэтажный 80 + 80 м²', f1: 80, f2: 80, terr: 6, big: true },
  { name: 'Двухэтажный 100 + 100 м²', f1: 100, f2: 100, terr: 10, big: true },
];

const FAQ = [
  { q: 'Почему второй этаж дешевле первого?', a: 'Под первым этажом — плита, земляные работы и подготовка основания. Под вторым их нет, поэтому ставка на второй этаж на 10 000 ₽/м² ниже во всех комплектациях.' },
  { q: 'Что за порог 150 м² и по какой площади он считается?', a: 'Порог считается по жилой площади из проекта (сумма помещений обоих этажей, без террасы и крыльца). Если она больше 150 м², White Box и «под ключ» идут на 5 000 ₽/м² дешевле. Сама сумма умножается на площадь застройки без террасы и крыльца — это другое число, оно больше жилой на толщину стен.' },
  { q: 'Что не входит в «под ключ»?', a: 'Мебель, бытовая техника, участок (забор, дорожки, ландшафт), наружные сети за пределами дома, если они не оговорены в КП. Всё остальное — от плиты до сантехники — входит. Полный состав работ и марок материалов выдаём документом до договора.' },
  { q: 'Можно ли изменить комплектацию по ходу стройки?', a: 'Да, до начала соответствующего этапа: например, взять холодный контур, а весной перейти на тёплый. Пересчитывается только новый слой работ, остальное — по договору.' },
];

export default function DomaCenyPage() {
  const graph = buildGraph(
    [],
    [
      buildBreadcrumb('/doma/ceny/', [
        { name: 'Главная', url: SITE.url },
        { name: 'Дома из газобетона', url: `${SITE.url}/doma/` },
        { name: 'Цены', url: `${SITE.url}/doma/ceny/` },
      ]),
      buildFaqPage('/doma/ceny/', FAQ)!,
    ]
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <section className="container-x pt-10 md:pt-14 pb-8">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/doma/" className="hover:text-brand-ink transition">Дома из газобетона</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Цены</li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl">Цены на дом из газобетона в Санкт-Петербурге и Ленобласти</h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
          Четыре комплектации, одна формула: площадь застройки первого этажа × ставка + площадь второго этажа × (ставка − 10 000) + терраса и крыльцо × {TERRACE_RATE.toLocaleString('ru-RU')}.
          Доставка материалов уже в ставке. Цены 2026 года, фиксируются в договоре.
        </p>
      </section>

      <section className="container-x pb-12">
        <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-brand-sand">
                <th className="px-4 py-3">Комплектация</th>
                <th className="px-4 py-3">1-й этаж, ₽/м²</th>
                <th className="px-4 py-3">2-й этаж, ₽/м²</th>
                <th className="px-4 py-3">Жилая свыше 150 м²</th>
                <th className="px-4 py-3">Срок</th>
              </tr>
            </thead>
            <tbody>
              {KOMPLEKTACII.map((k) => (
                <tr key={k.slug} className="border-t border-brand-line">
                  <td className="px-4 py-3 font-bold text-brand-ink">{k.name}{k.popular ? <span className="ml-2 rounded-full bg-brand-sand px-2 py-0.5 text-xs font-semibold">берут чаще всего</span> : null}</td>
                  <td className="px-4 py-3 font-extrabold">{k.rate1.toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-3">{k.rate2.toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-3">{k.rate1Big === k.rate1 ? 'без изменений' : `${k.rate1Big.toLocaleString('ru-RU')} / ${k.rate2Big.toLocaleString('ru-RU')}`}</td>
                  <td className="px-4 py-3">{k.months} мес.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-brand-mute">Терраса и крыльцо — {TERRACE_RATE.toLocaleString('ru-RU')} ₽/м² отдельной строкой во всех комплектациях. Оплата этапами 25/25/25/25 по принятым работам.</p>
      </section>

      <section className="container-x pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Примеры расчёта</h2>
        <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-brand-sand">
                <th className="px-4 py-3">Дом</th>
                {KOMPLEKTACII.map((k) => <th key={k.slug} className="px-4 py-3">{k.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map((e) => (
                <tr key={e.name} className="border-t border-brand-line">
                  <td className="px-4 py-3 font-bold text-brand-ink">{e.name}<div className="text-xs font-normal text-brand-mute">терраса/крыльцо {e.terr} м²{e.big ? ' · жилая свыше 150 м²' : ''}</div></td>
                  {KOMPLEKTACII.map((k) => <td key={k.slug} className="px-4 py-3 whitespace-nowrap font-semibold">{fmtMln(calcHouse(k, e.f1, e.f2, e.terr, !!e.big))}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Что входит в каждую ступень</h2>
        {KOMPLEKTACII.map((k) => (
          <div key={k.slug}>
            <h3>{k.name} — {k.rate1.toLocaleString('ru-RU')} ₽/м², {k.months} мес.</h3>
            <p>{k.short}</p>
            <ul>{k.includes.map((x) => <li key={x}>{x}</li>)}</ul>
            <p><em>Не входит:</em> {k.excludes.join(', ').toLowerCase()}.</p>
          </div>
        ))}
        <h2>Материалы</h2>
        <p>Плита 300 мм из заводского бетона с паспортом, арматура А500С Ø12 в два слоя, геотекстиль и гидроизоляция основания. Газобетон ЛСР с завода, клей, армирование рядов, монолитные перемычки и армопояс. Кровля со стропильной системой, подшивом и водостоком. Полный перечень марок по каждому разделу — в документе «Состав работ и материалов», который выдаём до договора.</p>
      </section>

      <section className="container-x pb-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Вопросы о ценах на дом</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white border border-brand-line p-5 md:p-6 open:border-brand-ink transition">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-lg leading-snug text-brand-ink"><span>{f.q}</span><span className="flex-shrink-0 text-brand-mute group-open:rotate-180 transition-transform mt-1">▾</span></summary>
              <p className="mt-4 text-brand-mute leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="rounded-2xl bg-brand-ink text-white p-7 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Посчитаем ваш дом по проекту</h2>
          <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">Пришлите план или размеры — вернём расчёт четырёх комплектаций и состав работ документом.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={SITE.telegram} target="_blank" rel="noopener" className="rounded-xl bg-amber-400 text-brand-ink px-7 py-4 font-bold no-underline hover:opacity-90 transition">Написать в Telegram →</a>
            <Link href="/doma/etapy/" className="rounded-xl border border-white/40 px-7 py-4 font-bold no-underline hover:bg-white/10 transition">Этапы стройки</Link>
          </div>
        </div>
      </section>
    </>
  );
}
