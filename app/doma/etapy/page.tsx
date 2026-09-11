import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { HOUSE_STAGES } from '@/lib/doma';
import { byTag } from '@/lib/gallery';
import { buildGraph, buildBreadcrumb } from '@/lib/schema';
import { ogDefaults } from '@/lib/seo-snippets';

const TITLE = 'Этапы строительства дома из газобетона: от плиты до ключей';
const DESC = 'Строительство дома из газобетона в СПб и Ленобласти по этапам: замер и проект, плита, стены из блока ЛСР, кровля, окна и утепление, инженерия, отделка. Сроки и приёмка по актам.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/doma/etapy/' },
  openGraph: ogDefaults('/doma/etapy/', `${TITLE} · ${SITE.name}`, DESC, 'website', '/images/doma/dom-03.jpg'),
};

export default function DomaEtapyPage() {
  const photos = byTag('doma').slice(8, 16);
  const graph = buildGraph(
    [
      {
        '@type': 'HowTo',
        '@id': `${SITE.url}/doma/etapy/#howto`,
        name: 'Этапы строительства дома из газобетона',
        step: HOUSE_STAGES.map((s, i) => ({ '@type': 'HowToStep', position: i + 1, name: s.title, text: s.text })),
      },
    ],
    [
      buildBreadcrumb('/doma/etapy/', [
        { name: 'Главная', url: SITE.url },
        { name: 'Дома из газобетона', url: `${SITE.url}/doma/` },
        { name: 'Этапы', url: `${SITE.url}/doma/etapy/` },
      ]),
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
            <li className="text-brand-ink">Этапы</li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl">Этапы строительства дома из газобетона: от плиты до ключей</h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
          Семь этапов, у каждого — свой акт приёмки и своя оплата. Вы видите стройку по фотоотчётам каждый день и платите только за то, что принято.
          Ниже — что происходит на площадке и сколько это занимает при обычной погоде; зимой сроки те же, добавляется прогрев бетона.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl">
        <ol className="space-y-4">
          {HOUSE_STAGES.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-brand-line bg-white p-6 md:flex md:gap-6">
              <div className="md:w-40 flex-shrink-0">
                <div className="text-xs font-bold text-brand-mute">ЭТАП {String(i + 1).padStart(2, '0')}</div>
                <div className="mt-1 text-sm font-semibold text-brand-ink">{s.weeks}</div>
              </div>
              <div>
                <h2 className="text-xl font-extrabold text-brand-ink leading-snug">{s.title}</h2>
                <p className="mt-2 text-brand-mute leading-relaxed">{s.text}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="mt-6 text-sm text-brand-mute">Где заканчивается каждая комплектация: холодный контур — после этапа 4, тёплый — после 5, White Box — после 6, под ключ — после 7. <Link href="/doma/ceny/" className="font-semibold text-brand-ink hover:underline">Цены комплектаций →</Link></p>
      </section>

      {photos.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Этапы на наших объектах</h2>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
            {photos.map((p) => (
              <figure key={p.src}>
                <img src={p.thumb} alt={p.alt} className="aspect-[4/3] w-full rounded-2xl object-cover border border-brand-line" loading="lazy" />
                <figcaption className="mt-1 text-xs text-brand-mute">{p.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="container-x pb-16">
        <div className="rounded-2xl bg-brand-ink text-white p-7 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Начнём с замера участка</h2>
          <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">Выезд инженера бесплатно. Бурение, привязка дома, расчёт комплектаций — и договор с фиксированной ценой.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={SITE.telegram} target="_blank" rel="noopener" className="rounded-xl bg-amber-400 text-brand-ink px-7 py-4 font-bold no-underline hover:opacity-90 transition">Написать в Telegram →</a>
            <a href={`tel:${SITE.phoneRaw}`} className="rounded-xl border border-white/40 px-7 py-4 font-bold no-underline hover:bg-white/10 transition">Позвонить</a>
          </div>
        </div>
      </section>
    </>
  );
}
