import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import { REGIONS, getRegionBySlug, getAllRegionSlugs, buildRegionFaq } from '@/lib/regions';
import { getArticleBySlug } from '@/lib/articles';
import { SITE } from '@/lib/site';
import { buildRegionGraph, buildGraph } from '@/lib/schema';
import { buildRegionSnippet } from '@/lib/seo-snippets';

type Params = { region: string };

export function generateStaticParams() {
  return REGIONS.map((r) => ({ region: r.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const region = getRegionBySlug(params.region);
  if (!region) return {};

  const { title, description } = buildRegionSnippet(region);

  return {
    title,
    description,
    keywords: [
      `плитный фундамент ${region.shortName}`,
      `плитный фундамент ${region.name}`,
      `монолитная плита ${region.shortName}`,
      `фундамент под ключ ${region.shortName}`,
      `цена плиты ${region.shortName}`,
      `калькулятор фундамента ${region.shortName}`,
    ],
    alternates: { canonical: `/fundament/${region.slug}/` },
    openGraph: {
      type: 'website',
      locale: 'ru_RU',
      url: `${SITE.url}/fundament/${region.slug}/`,
      title,
      description,
      siteName: SITE.name,
    },
  };
}

export default function RegionPage({ params }: { params: Params }) {
  const region = getRegionBySlug(params.region);
  if (!region) notFound();

  const canonicalUrl = `${SITE.url}/fundament/${region.slug}/`;
  const related = (region.relatedArticleSlugs || [])
    .map((s) => getArticleBySlug(s))
    .filter(Boolean) as NonNullable<ReturnType<typeof getArticleBySlug>>[];

  // FAQ под Нейро-цитирование Алисы (#27)
  const faq = region.faq && region.faq.length > 0 ? region.faq : buildRegionFaq(region);

  // Единый @graph: Service + FAQPage + BreadcrumbList (#51)
  const pageGraph = buildGraph(
    buildRegionGraph(region, canonicalUrl, `/fundament/${region.slug}/`)
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph) }} />

      <section className="container-x pt-10 md:pt-14 pb-6">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/fundament/" className="hover:text-brand-ink transition">Фундаменты по районам</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">{region.name}</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl">
          Плитный фундамент в {region.prepositional}: цена, грунты, расчёт онлайн
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
          СК «Юрьевич» строит монолитные плитные фундаменты в {region.prepositional}{region.localitiesText}. Цена от <strong className="text-brand-ink">{region.priceFrom.toLocaleString('ru-RU')} ₽/м²</strong> в зависимости от грунта и материала стен. Дорога от базы: {region.drivingTime}.
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">★ 5.0 · 35 отзывов</span>
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">239 сданных объектов</span>
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">Гарантия 5 лет</span>
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">Партнёр ЛСР</span>
        </div>
      </section>

      <section className="container-x pb-16">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Рассчитайте свой фундамент</h2>
        <Calculator
          defaultGround={region.defaultGround}
          regionLabel={region.shortName}
        />
        <p className="mt-4 text-sm text-brand-mute">
          Калькулятор уже учитывает <strong>типичные грунты {region.shortName}</strong>. Вы можете изменить параметры под свой участок.
        </p>
      </section>

      <section className="container-x pb-16 max-w-4xl prose-yur">
        <h2>Грунты {region.shortName}: что важно знать</h2>
        <p>{region.groundDescription}</p>

        <h2>Реальные сметы наших объектов в {region.prepositional}</h2>
        <p>Ниже — последние объекты СК «Юрьевич» в {region.prepositional}. Цены 2025-2026 г., с разбивкой по позициям предоставляем после замера участка.</p>
        <table>
          <thead>
            <tr>
              <th>Локация</th>
              <th>Проект</th>
              <th>Итого</th>
            </tr>
          </thead>
          <tbody>
            {region.examples.map((ex, i) => (
              <tr key={i}>
                <td>{ex.location}</td>
                <td>{ex.project}</td>
                <td><strong>{ex.price}</strong></td>
              </tr>
            ))}
          </tbody>
        </table>

        <h2>Почему именно СК «Юрьевич» в {region.prepositional}</h2>
        <ul>
          <li><strong>Локальный опыт.</strong> Наша бригада знает грунты {region.shortName} лично — мы вышли из этих 8 районов ЛО, а не «обслуживаем всё подряд».</li>
          <li><strong>Договор с фикс-ценой.</strong> Никаких «доплат после вскрытия котлована». Если что-то меняется по вашему желанию — допсоглашение с вашей подписью.</li>
          <li><strong>Оплата только по этапам.</strong> Аванс на материалы по чекам с завода ЛСР, основной расчёт — после приёмки этапов. На работы предоплат нет.</li>
          <li><strong>Бетон М300 W6 F150, арматура А500С.</strong> Заводской паспорт качества на каждую машину — показываем на объекте.</li>
          <li><strong>Бригада с прорабом</strong> (Валера) на объекте, плюс технадзор (Евгений) на снабжении. 239 объектов — это наша личная статистика.</li>
        </ul>

        <h2>Сроки и логистика</h2>
        <p>Дорога от нашей базы (пос. Песочный) до {region.shortName}: <strong>{region.drivingTime}</strong>. Замер участка — бесплатно, выезд инженера в течение 1-3 дней. Сама заливка плиты 100 м² занимает 10-14 рабочих дней. Зимняя заливка работает — у нас отлажена технология (противоморозные добавки, прогрев, утепление опалубки).</p>

        <p>
          <Link href="/#calc" className="inline-block mt-4 rounded-xl bg-brand-ink text-white px-7 py-4 font-bold no-underline">
            Получить детальный расчёт →
          </Link>
        </p>
      </section>

      <section className="container-x pb-16 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Частые вопросы по {region.prepositional}</h2>
        <div className="space-y-3">
          {faq.map((f, i) => (
            <details
              key={i}
              className="group rounded-2xl bg-white border border-brand-line p-5 md:p-6 open:border-brand-ink transition"
            >
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-lg leading-snug text-brand-ink">
                <span>{f.q}</span>
                <span className="flex-shrink-0 text-brand-mute group-open:rotate-180 transition-transform mt-1">▾</span>
              </summary>
              <p className="mt-4 text-brand-mute leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {related.length > 0 && (
        <section className="container-x pb-20">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Полезные статьи по теме</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {related.map((a) => (
              <Link
                key={a.slug}
                href={`/blog/${a.slug}/`}
                className="group block bg-white rounded-2xl border border-brand-line overflow-hidden hover:border-brand-ink hover:shadow-lg transition"
              >
                {a.cover_image && (
                  <div className="aspect-[16/9] bg-brand-sand overflow-hidden">
                    <img
                      src={a.cover_image}
                      alt={a.cover_alt}
                      className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                      loading="lazy"
                    />
                  </div>
                )}
                <div className="p-5">
                  <h3 className="font-bold leading-snug text-brand-ink line-clamp-3">{a.title}</h3>
                  <div className="mt-3 text-sm text-brand-mute">{a.reading_time} мин чтения</div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
