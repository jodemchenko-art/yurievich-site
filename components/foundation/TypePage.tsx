import type { Metadata } from 'next';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import { FOUNDATION_TYPES, getFoundationType } from '@/lib/foundation-types';
import { REGIONS } from '@/lib/regions';
import { getArticleBySlug } from '@/lib/articles';
import { SITE } from '@/lib/site';
import { buildGraph, buildBreadcrumb, buildFaqPage, ID } from '@/lib/schema';
import { inPrep, ogDefaults } from '@/lib/seo-snippets';
import {
  PRICE_TABLE_GROUNDS,
  PRICE_TABLE_ROWS,
  GROUND_LABEL,
  MATERIAL_LOAD,
  SIZE_AREA,
  calcPlita,
  fmtRub,
  type Material,
} from '@/lib/pricing';
import { SLAB_OBJECTS } from '@/lib/objects';
import { byTag } from '@/lib/gallery';

/**
 * Типовая посадочная /fundament/<slug>/ — плита, лента, сваи, УШП, плита с рёбрами,
 * под баню, под гараж. Один шаблон, данные — lib/foundation-types.ts.
 *
 * Структура повторяет то, что есть у 4 из 5 конкурентов в топе (замер 11.09.2026):
 * цена/условия на первом экране → когда подходит → из чего состоит → этапы →
 * что входит и не входит → FAQ → соседние типы → районы → статьи → заявка.
 */

export function typeMetadata(slug: string): Metadata {
  const t = getFoundationType(slug);
  if (!t) return {};
  const path = `/fundament/${t.slug}/`;
  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: path },
    openGraph: ogDefaults(path, `${t.title} · ${SITE.name}`, t.description, 'website', t.image?.src),
  };
}

export default function TypePage({ slug }: { slug: string }) {
  const t = getFoundationType(slug);
  if (!t) return null;

  const path = `/fundament/${t.slug}/`;
  const canonicalUrl = `${SITE.url}${path}`;
  const related = t.relatedTypes
    .map((s) => getFoundationType(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getFoundationType>>[];
  const articles = t.relatedArticles
    .map((s) => getArticleBySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getArticleBySlug>>[];

  const service: Record<string, unknown> = {
    '@type': 'Service',
    '@id': `${canonicalUrl}#service`,
    name: t.h1,
    serviceType: t.serviceType,
    description: t.description,
    provider: { '@id': ID.org },
    areaServed: SITE.areaServed,
    url: canonicalUrl,
  };
  if (t.priceFrom) {
    service.offers = {
      '@type': 'Offer',
      priceCurrency: 'RUB',
      price: t.priceFrom,
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: t.priceFrom,
        priceCurrency: 'RUB',
        unitText: '₽/м²',
      },
      availability: 'https://schema.org/InStock',
    };
  }

  const graph = buildGraph(
    [service],
    [
      buildBreadcrumb(path, [
        { name: 'Главная', url: SITE.url },
        { name: 'Фундаменты', url: `${SITE.url}/fundament/` },
        { name: t.name, url: canonicalUrl },
      ]),
      buildFaqPage(path, t.faq)!,
    ]
  );

  // Живые фото под тип работ: без них страница выглядит как текст без доказательств.
  const photos = (t.galleryTags || []).flatMap((tag) => byTag(tag)).filter((p, i, a) => a.findIndex((x) => x.src === p.src) === i).slice(0, 6);

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />

      {/* ── Первый экран ─────────────────────────────────────────────── */}
      <section className="container-x pt-10 md:pt-14 pb-10">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/fundament/" className="hover:text-brand-ink transition">Фундаменты</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">{t.name}</li>
          </ol>
        </nav>

        <div className="text-xs font-bold uppercase tracking-wider text-brand-mute">{t.eyebrow}</div>
        <h1 className="mt-3 text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl">{t.h1}</h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">{t.lede}</p>

        <div className="mt-8 grid gap-4 lg:grid-cols-[1fr_minmax(280px,360px)]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {t.facts.map((f) => (
              <div key={f.k} className="bg-white rounded-xl border border-brand-line p-4">
                <div className="text-xs uppercase tracking-wider text-brand-mute">{f.k}</div>
                <div className="mt-1 font-extrabold text-brand-ink leading-snug">{f.v}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl bg-brand-ink text-white p-6">
            <div className="text-xs uppercase tracking-wider text-white/70">Цена</div>
            <div className="mt-1 text-2xl font-extrabold">{t.priceLabel}</div>
            <p className="mt-2 text-sm text-white/80 leading-relaxed">{t.priceNote}.</p>
            <div className="mt-4 flex flex-col gap-2">
              <Link href={t.hasCalculator ? '#calc' : '/#calc'} className="rounded-xl bg-amber-400 text-brand-ink px-5 py-3 text-center font-bold no-underline hover:opacity-90 transition">
                Рассчитать бесплатно →
              </Link>
              <a href={`tel:${SITE.phoneRaw}`} className="rounded-xl border border-white/40 px-5 py-3 text-center font-bold no-underline hover:bg-white/10 transition">
                Позвонить
              </a>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">Договор с фиксированной ценой</span>
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">Гарантия {SITE.warrantyYears} лет</span>
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">{SITE.projectsCount} объектов с {SITE.foundedYear} года</span>
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">Авито {SITE.rating}, {SITE.reviewsCount} отзывов</span>
        </div>
      </section>

      {t.image && (
        <section className="container-x pb-12">
          <figure className="overflow-hidden rounded-2xl border border-brand-line bg-brand-sand">
            <img src={t.image.src} alt={t.image.alt} className="w-full max-h-[520px] object-cover" loading="lazy" />
            <figcaption className="px-5 py-3 text-sm text-brand-mute">{t.image.alt}</figcaption>
          </figure>
        </section>
      )}

      {/* ── Содержательные разделы ───────────────────────────────────── */}
      <section className="container-x pb-12 max-w-4xl prose-yur">
        {t.sections.map((s) => (
          <div key={s.h2}>
            <h2>{s.h2}</h2>
            {s.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
            {s.bullets && (
              <ul>
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </section>

      {/* ── Цена за м² и по размерам (только плита) ─────────────────── */}
      {/* Две таблицы, которых нет больше нигде на сайте: ставка за м² по материалу стен
          и грунту, и полная стоимость по размерам и грунтам (переехала с /ceny/ 23.09.2026,
          чтобы кластер «монолитная плита цена» ранжировался этой страницей, а не общим прайсом). */}
      {t.hasPriceTable && (
        <section className="container-x pb-12" id="ceny">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Цена монолитной плиты фундамента за м²</h2>
          <p className="text-brand-mute mb-6 max-w-3xl leading-relaxed">
            Ставка за квадратный метр плиты с работой и материалами, один этаж. Считается по той же формуле,
            что и калькулятор: материал стен задаёт толщину плиты, грунт — состав подушки и объём земляных
            работ. Второй этаж добавляет 18 %, полтора — 8 %. Это ориентир до выезда инженера, точная сумма
            фиксируется в договоре.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
            <table className="w-full min-w-[620px] text-left text-sm">
              <thead>
                <tr className="bg-brand-sand">
                  <th className="px-4 py-3">Стены дома</th>
                  {PRICE_TABLE_GROUNDS.map((g) => (
                    <th key={g} className="px-4 py-3">
                      <div className="font-extrabold">{GROUND_LABEL[g].name}</div>
                      <div className="text-xs font-normal text-brand-mute">{GROUND_LABEL[g].note}</div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(Object.keys(MATERIAL_LOAD) as Material[]).map((m) => (
                  <tr key={m} className="border-t border-brand-line">
                    <td className="px-4 py-3 font-bold whitespace-nowrap">
                      {MATERIAL_LOAD[m].name} <span className="text-brand-mute font-normal">· плита {MATERIAL_LOAD[m].thicknessMM} мм</span>
                    </td>
                    {PRICE_TABLE_GROUNDS.map((g) => {
                      const r = calcPlita({ size: '10x10', material: m, ground: g, storeys: 1 });
                      return (
                        <td key={g} className="px-4 py-3 whitespace-nowrap font-extrabold text-brand-ink">
                          {fmtRub(r.pricePerM2)} ₽/м²
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <h2 className="text-2xl md:text-3xl font-extrabold mt-12 mb-3">Цена монолитной плиты по размерам и грунтам</h2>
          <p className="text-brand-mute mb-6 max-w-3xl leading-relaxed">
            Полная стоимость плиты 300 мм под одноэтажный дом из газобетона. Для двухэтажного — множитель 1,18,
            для каркасного — плита 250 мм и ставка ниже; свой вариант считайте в калькуляторе ниже.
            Лента, сваи, УШП и дома из газобетона — на странице <Link href="/ceny/">цен</Link>.
          </p>
          <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="bg-brand-sand">
                  <th className="px-4 py-3">Размер плиты</th>
                  {PRICE_TABLE_GROUNDS.map((g) => (
                    <th key={g} className="px-4 py-3 font-extrabold">{GROUND_LABEL[g].name}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICE_TABLE_ROWS.map((size) => (
                  <tr key={size} className="border-t border-brand-line">
                    <td className="px-4 py-3 font-bold whitespace-nowrap">
                      {size.replace('x', '×')} м <span className="text-brand-mute font-normal">· {SIZE_AREA[size]} м²</span>
                    </td>
                    {PRICE_TABLE_GROUNDS.map((g) => {
                      const r = calcPlita({ size, material: 'gazobeton', ground: g, storeys: 1 });
                      return (
                        <td key={g} className="px-4 py-3 whitespace-nowrap">
                          <div className="font-extrabold text-brand-ink">{fmtRub(r.total)} ₽</div>
                          <div className="text-xs text-brand-mute">{fmtRub(r.pricePerM2)} ₽/м²</div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-brand-mute">
            Болото и торф глубже 2 м — расчёт только после бурения: там часто выгоднее свайно-плитная схема.
            Плиты до 40 м² (баня, гараж) считаются по объёму — ставка за м2 у них выше из-за минимального выезда техники.
          </p>
        </section>
      )}

      {t.hasCalculator && (
        <section className="container-x pb-12" id="calc">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Рассчитайте {t.slug === 'plita' ? 'свою плиту' : 'плиту под ваш размер'}</h2>
          <Calculator regionLabel={t.name} />
        </section>
      )}

      {/* ── Таблица размеров (баня, гараж) ───────────────────────────── */}
      {t.sizeTable && (
        <section className="container-x pb-12" id="ceny">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Цена по размерам</h2>
          <p className="text-brand-mute mb-6 max-w-3xl leading-relaxed">{t.sizeTable.note}</p>
          <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
            <table className="w-full min-w-[560px] text-left text-sm">
              <thead>
                <tr className="bg-brand-sand">
                  {t.sizeTable.head.map((h) => (
                    <th key={h} className="px-4 py-3 font-extrabold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {t.sizeTable.rows.map((r) => (
                  <tr key={r[0]} className="border-t border-brand-line">
                    {r.map((c, i) => (
                      <td key={i} className={i === 0 ? 'px-4 py-3 font-bold whitespace-nowrap' : 'px-4 py-3 whitespace-nowrap'}>{c}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-brand-mute">Ориентир до выезда инженера. Точная сумма — после замера и бурения, фиксируется в договоре.</p>
        </section>
      )}

      {/* ── Живые фото с площадок ────────────────────────────────────── */}
      {photos.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Как это выглядит у нас на площадке</h2>
          <p className="text-brand-mute mb-6 max-w-3xl">Фото с наших объектов в Ленобласти — без стока и обработки.</p>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {photos.map((ph) => (
              <figure key={ph.src}>
                <img src={ph.thumb} alt={ph.alt} className="aspect-[4/3] w-full rounded-2xl object-cover border border-brand-line" loading="lazy" />
                <figcaption className="mt-1 text-xs text-brand-mute">{ph.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ── Этапы ────────────────────────────────────────────────────── */}
      <section className="container-x pb-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Как проходит работа</h2>
        <ol className="grid gap-4 sm:grid-cols-2">
          {t.steps.map((s, i) => (
            <li key={s.title} className="rounded-2xl border border-brand-line bg-white p-5">
              <div className="text-xs font-bold text-brand-mute">ШАГ {String(i + 1).padStart(2, '0')}</div>
              <div className="mt-1 font-extrabold text-brand-ink text-lg leading-snug">{s.title}</div>
              <p className="mt-2 text-sm text-brand-mute leading-relaxed">{s.text}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Что входит / не входит ───────────────────────────────────── */}
      <section className="container-x pb-12 max-w-4xl">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-brand-line bg-white p-6">
            <h2 className="text-xl font-extrabold mb-4">Что входит в цену</h2>
            <ul className="space-y-2 text-sm text-brand-mute">
              {t.included.map((x) => (
                <li key={x} className="flex gap-2"><span className="text-brand-ink font-bold">+</span><span>{x}</span></li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-brand-line bg-brand-sand p-6">
            <h2 className="text-xl font-extrabold mb-4">Считается отдельно</h2>
            <ul className="space-y-2 text-sm text-brand-mute">
              {t.extra.map((x) => (
                <li key={x} className="flex gap-2"><span className="text-brand-ink font-bold">–</span><span>{x}</span></li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-brand-mute">Все дополнительные позиции называем до договора, а не после вскрытия котлована.</p>
          </div>
        </div>
      </section>

      {/* ── Объекты (для плиты) ──────────────────────────────────────── */}
      {t.slug === 'plita' && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Наши плиты — до и после заливки</h2>
          <p className="text-brand-mute mb-6">Один и тот же объект: армокаркас перед заливкой и готовая плита. Все — в Ленобласти, фото с площадок.</p>
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
          <p className="mt-4 text-sm"><Link href="/obekty/" className="font-semibold text-brand-ink hover:underline">Все объекты →</Link></p>
        </section>
      )}

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="container-x pb-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Частые вопросы</h2>
        <div className="space-y-3">
          {t.faq.map((f) => (
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

      {/* ── Заявка ───────────────────────────────────────────────────── */}
      <section className="container-x pb-12">
        <div className="rounded-2xl bg-brand-ink text-white p-7 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Заказать {t.name.toLowerCase()} в СПб и Ленобласти</h2>
          <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">
            Выезд инженера и смета — бесплатно, в течение 1–3 дней. Цена фиксируется в договоре,
            оплата по принятым этапам, гарантия {SITE.warrantyYears} лет.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href={t.hasCalculator ? '#calc' : '/#calc'} className="rounded-xl bg-amber-400 text-brand-ink px-7 py-4 font-bold no-underline hover:opacity-90 transition">
              Получить расчёт →
            </Link>
            <a href={SITE.telegram} target="_blank" rel="noopener" className="rounded-xl border border-white/40 px-7 py-4 font-bold no-underline hover:bg-white/10 transition">
              Написать в Telegram
            </a>
          </div>
        </div>
      </section>

      {/* ── Соседние типы и районы ───────────────────────────────────── */}
      <section className="container-x pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-4">Другие виды фундамента</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {related.map((r) => (
            <Link key={r.slug} href={`/fundament/${r.slug}/`} className="block bg-white rounded-xl border border-brand-line p-4 hover:border-brand-ink hover:shadow-md transition">
              <div className="font-bold text-brand-ink">{r.name}</div>
              <div className="text-sm text-brand-mute mt-1">{r.priceLabel}</div>
            </Link>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-extrabold mt-10 mb-4">{t.name} по районам</h2>
        <div className="flex flex-wrap gap-2">
          {REGIONS.map((r) => (
            <Link key={r.slug} href={`/fundament/${r.slug}/`} className="rounded-full border border-brand-line bg-white px-4 py-2 text-sm font-semibold text-brand-ink hover:border-brand-ink transition">
              {inPrep(r.prepositional)}
            </Link>
          ))}
        </div>
      </section>

      {articles.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Разбираем подробно</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {articles.map((a) => (
              <Link key={a.slug} href={`/blog/${a.slug}/`} className="block bg-white rounded-2xl border border-brand-line p-5 hover:border-brand-ink hover:shadow-lg transition">
                <div className="font-bold leading-snug text-brand-ink">{a.title}</div>
                <div className="mt-2 text-sm text-brand-mute">{a.reading_time} мин чтения</div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}

export const ALL_TYPE_SLUGS = FOUNDATION_TYPES.map((t) => t.slug);
