import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';

/**
 * Блок блога сделан списком-указателем, а не плиткой карточек с обложками.
 * Причины две: страница внизу не должна ещё раз тянуть шесть картинок
 * (это лишние сотни килобайт на мобильном интернете), а перекрёстные ссылки
 * на статьи нужны для внутренней перелинковки — их ценность в тексте ссылки,
 * а не в обложке.
 */

// ⚠️ Только живые слаги. Две статьи из прежнего списка были склеены
// SEO-аудитом 26.07 — ссылки на них молча пропадали, и перелинковка
// с главной просела с шести материалов до четырёх.
const FEATURED_SLUGS = [
  'plitnyy-fundament-10x10-cena-pod-klyuch-spb',
  'plita-ili-lenta-pod-gazobeton',
  'svai-ili-plita-pod-gazobeton-leningradskaya-oblast',
  'plitnyy-fundament-pod-gazobeton-tolschina-armirovanie',
  'cena-plity-fundamenta-12h12-spb',
  'dom-iz-gazobetona-lsr-pod-klyuch-cena-za-m2',
];

export default function BlogIndexBlock() {
  const featured = FEATURED_SLUGS.map((slug) => ARTICLES.find((a) => a.slug === slug)).filter(
    Boolean
  ) as typeof ARTICLES;

  if (featured.length === 0) return null;

  return (
    <section id="home-blog" data-plane="paper" className="bg-paper">
      <div className="container-x py-14 md:py-20">
        <div className="datum grid gap-8 pt-6 md:grid-cols-[280px_1fr] md:gap-12">
          <div data-reveal>
            <div className="eyebrow text-inkmute">
              <span className="text-inkmute">10</span>
              <span className="mx-2 opacity-40">/</span>
              Справочник
            </div>
            <h2 className="display-3 mt-3 text-graphite">Разбираем стройку без воды</h2>
            <p className="mt-3 text-sm leading-relaxed text-inkmute">
              Цены, технологии, грунты Ленобласти и ошибки подрядчиков — то, что обычно узнают
              уже после заливки.
            </p>
            <Link href="/blog/" className="mono mt-4 inline-block text-xs text-signal ulink">
              все {ARTICLES.length} материалов →
            </Link>
          </div>

          <ul className="border-t border-hair">
            {featured.map((a, i) => (
              <li key={a.slug} data-reveal style={{ ['--d' as any]: `${i * 50}ms` }}>
                <Link
                  href={`/blog/${a.slug}/`}
                  className="group flex items-baseline gap-4 border-b border-hair py-3.5 transition-colors hover:bg-paper0"
                >
                  <span className="mono text-[11px] text-inkmute">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="flex-1 text-[15px] font-semibold leading-snug text-graphite">
                    {a.title}
                  </span>
                  <span className="mono hidden flex-shrink-0 text-[11px] text-inkmute sm:block">
                    {a.reading_time} мин
                  </span>
                  <span
                    aria-hidden
                    className="mono flex-shrink-0 text-xs text-sand transition-all group-hover:translate-x-1 group-hover:text-signal"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
