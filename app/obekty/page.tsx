import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { SLAB_OBJECTS, HOUSE_OBJECTS } from '@/lib/objects';
import { GALLERY, byTag } from '@/lib/gallery';
import { buildGraph, buildBreadcrumb } from '@/lib/schema';
import { ogDefaults } from '@/lib/seo-snippets';

/**
 * /obekty/ — объекты компании: плиты «до/после», дома в работе, живые кадры этапов.
 * Все фото настоящие, адреса не публикуем. У 5 из 5 конкурентов в топе есть
 * портфолио — у нас его не было как страницы, только блок на главной.
 */

const TITLE = 'Объекты: фундаменты и дома в СПб и Ленобласти, фото работ';
const DESC = 'Наши объекты в СПб и Ленобласти: монолитные плиты до и после заливки, дома из газобетона в работе, армокаркасы и заливка бетоном. Только реальные фото с площадок, 239 объектов с 2018 года.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/obekty/' },
  openGraph: ogDefaults('/obekty/', `${TITLE} · ${SITE.name}`, DESC, 'website', '/images/objects/ropsha-120-plita.jpg'),
};

export default function ObektyPage() {
  const stages = GALLERY.filter((p) => p.tags.some((t) => ['armo', 'zalivka', 'zemlya'].includes(t)));
  const slabs = byTag('plita').filter((p) => !p.tags.includes('armo') && !p.tags.includes('zemlya') && !p.tags.includes('zalivka'));
  const winter = byTag('zima');
  const lenta = byTag('lenta');

  const graph = buildGraph(
    [
      {
        '@type': 'CollectionPage',
        '@id': `${SITE.url}/obekty/#page`,
        name: TITLE,
        url: `${SITE.url}/obekty/`,
        description: DESC,
      },
    ],
    [
      buildBreadcrumb('/obekty/', [
        { name: 'Главная', url: SITE.url },
        { name: 'Объекты', url: `${SITE.url}/obekty/` },
      ]),
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
            <li className="text-brand-ink">Объекты</li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl">
          Наши объекты: фундаменты и дома в Санкт-Петербурге и Ленобласти
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
          Здесь нет картинок из интернета. Каждый кадр снят на нашей площадке телефоном бригады или Юрия —
          с погодой, грязью и опалубкой. {SITE.projectsCount} объектов с {SITE.foundedYear} года: монолитные плиты, ленты и цоколи,
          дома из газобетона под кровлю и под ключ. Адреса заказчиков не публикуем, по запросу свозим на действующий объект.
        </p>
      </section>

      {/* До / после */}
      <section className="container-x pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Плиты: армокаркас и готовая плита</h2>
        <p className="text-brand-mute mb-6 max-w-3xl">Одна и та же точка съёмки: слева — каркас перед заливкой, справа — та же плита после. Так видно, что внутри бетона, а не только его поверхность.</p>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {SLAB_OBJECTS.map((o) => (
            <figure key={o.loc} className="overflow-hidden rounded-2xl border border-brand-line bg-white">
              <div className="grid grid-cols-2">
                <img src={o.armo} alt={`Армокаркас плиты ${o.area}, ${o.loc}`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
                <img src={o.plita} alt={`Монолитная плита ${o.area}, ${o.loc}`} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              </div>
              <figcaption className="px-4 py-3 text-sm">
                <span className="font-bold text-brand-ink">{o.loc}</span> · {o.district} · плита {o.area}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Готовые плиты */}
      {slabs.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Готовые плиты</h2>
          <p className="text-brand-mute mb-6 max-w-3xl">Заводской бетон М300 W6 F150, две сетки А500С, толщина 250–350 мм по нагрузке. Через 28 суток на такой плите начинают класть стены.</p>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {slabs.map((p) => (
              <figure key={p.src}>
                <a href={p.src} target="_blank" rel="noopener"><img src={p.thumb} alt={p.alt} className="aspect-[4/3] w-full rounded-2xl object-cover border border-brand-line" loading="lazy" /></a>
                <figcaption className="mt-1 text-xs text-brand-mute">{p.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Этапы */}
      {stages.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Этапы: земля, подушка, каркас, заливка</h2>
          <p className="text-brand-mute mb-6 max-w-3xl">То, что обычно не показывают: снятие плодородного слоя, подушка с геотекстилем, вязка каркаса, приёмка бетона и заливка насосом.</p>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {stages.map((p) => (
              <figure key={p.src}>
                <a href={p.src} target="_blank" rel="noopener"><img src={p.thumb} alt={p.alt} className="aspect-[4/3] w-full rounded-2xl object-cover border border-brand-line" loading="lazy" /></a>
                <figcaption className="mt-1 text-xs text-brand-mute">{p.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Ленты и цоколи */}
      {lenta.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Ленты и цоколи</h2>
          <p className="text-brand-mute mb-6 max-w-3xl">Монолитные ленты и рёбра под несущие стены, отсечная гидроизоляция под кладку. <Link href="/fundament/lenta/" className="font-semibold text-brand-ink">Когда лента выгоднее плиты →</Link></p>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {lenta.map((p) => (
              <figure key={p.src}>
                <a href={p.src} target="_blank" rel="noopener"><img src={p.thumb} alt={p.alt} className="aspect-[4/3] w-full rounded-2xl object-cover border border-brand-line" loading="lazy" /></a>
                <figcaption className="mt-1 text-xs text-brand-mute">{p.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* Дома */}
      <section className="container-x pb-12" id="doma">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Дома из газобетона, которые мы строим</h2>
        <p className="text-brand-mute mb-6 max-w-3xl">Коробки под кровлей, монолитные перекрытия, зимние стройки. Подпись «строим», а не «построили»: на кадрах идёт работа. <Link href="/doma/" className="font-semibold text-brand-ink">Комплектации и цены домов →</Link></p>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {HOUSE_OBJECTS.map((h) => (
            <figure key={h.file}>
              <a href={`/images/doma/${h.file}.jpg`} target="_blank" rel="noopener"><img src={`/images/doma/t/${h.file}.jpg`} alt={`${h.title} — ${h.note}`} className="aspect-[4/3] w-full rounded-2xl object-cover border border-brand-line" loading="lazy" /></a>
              <figcaption className="mt-1 text-xs text-brand-mute"><span className="font-semibold text-brand-ink">{h.stage}</span> · {h.title}</figcaption>
            </figure>
          ))}
          {byTag('doma').filter((p) => !p.tags.includes('zima')).slice(0, 12).map((p) => (
            <figure key={p.src}>
              <a href={p.src} target="_blank" rel="noopener"><img src={p.thumb} alt={p.alt} className="aspect-[4/3] w-full rounded-2xl object-cover border border-brand-line" loading="lazy" /></a>
              <figcaption className="mt-1 text-xs text-brand-mute">{p.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Зима */}
      {winter.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Зимняя стройка</h2>
          <p className="text-brand-mute mb-6 max-w-3xl">Противоморозные добавки, прогрев, термоматы — плиты и стены зимой не останавливаются. Часто зимой на участок заехать проще, чем в распутицу.</p>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {winter.map((p) => (
              <figure key={p.src}>
                <a href={p.src} target="_blank" rel="noopener"><img src={p.thumb} alt={p.alt} className="aspect-[4/3] w-full rounded-2xl object-cover border border-brand-line" loading="lazy" /></a>
                <figcaption className="mt-1 text-xs text-brand-mute">{p.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="container-x pb-16">
        <div className="rounded-2xl bg-brand-ink text-white p-7 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Остальные объекты — в канале стройки</h2>
          <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">
            Фото выкладываем в день работ, с датами и комментариями заказчиков. Хотите увидеть живьём — свозим на действующую площадку.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={SITE.telegramChannel} target="_blank" rel="noopener" className="rounded-xl bg-amber-400 text-brand-ink px-7 py-4 font-bold no-underline hover:opacity-90 transition">Канал стройки →</a>
            <Link href="/#calc" className="rounded-xl border border-white/40 px-7 py-4 font-bold no-underline hover:bg-white/10 transition">Рассчитать свой фундамент</Link>
          </div>
        </div>
      </section>
    </>
  );
}
