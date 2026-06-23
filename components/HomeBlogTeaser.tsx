import Link from 'next/link';
import { ARTICLES } from '@/lib/articles';

const FEATURED_SLUGS = [
  'plitnyy-fundament-cena-za-m2-spb',
  'plitnyy-fundament-10x10-cena-pod-klyuch-spb',
  'plita-ili-lenta-pod-gazobeton',
  'svai-ili-plita-pod-gazobeton-leningradskaya-oblast',
  'monolitnyy-plitnyy-fundament-spb-pod-klyuch',
  'plitnyy-fundament-pod-gazobeton-tolschina-armirovanie',
];

export default function HomeBlogTeaser() {
  const featured = FEATURED_SLUGS
    .map((slug) => ARTICLES.find((a) => a.slug === slug))
    .filter(Boolean)
    .slice(0, 6) as typeof ARTICLES;

  if (featured.length === 0) return null;

  return (
    <section id="home-blog" className="section bg-brand-sand">
      <div className="container-x">
        <div className="max-w-2xl mb-10 md:mb-12">
          <p className="text-brand-mute font-semibold uppercase tracking-wider text-sm">
            Полезное по фундаментам
          </p>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold text-brand-ink leading-tight">
            Разбираем стройку без воды
          </h2>
          <p className="mt-4 text-brand-mute leading-relaxed">
            Цены, технологии, грунты Ленобласти, ошибки подрядчиков. Реальные кейсы из 239 наших объектов.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {featured.map((article) => (
            <Link
              key={article.slug}
              href={`/blog/${article.slug}/`}
              className="group block bg-white rounded-2xl border border-brand-line overflow-hidden hover:border-brand-ink hover:shadow-xl transition"
            >
              {article.cover_image && (
                <div className="aspect-[16/9] overflow-hidden bg-brand-sand">
                  <img
                    src={article.cover_image}
                    alt={article.cover_alt}
                    width={600}
                    height={338}
                    className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                    loading="lazy"
                  />
                </div>
              )}
              <div className="p-5 md:p-6">
                <h3 className="text-lg md:text-xl font-extrabold leading-snug text-brand-ink line-clamp-3">
                  {article.title}
                </h3>
                <p className="mt-2 text-sm text-brand-mute leading-relaxed line-clamp-2">
                  {article.meta_description}
                </p>
                <div className="mt-3 flex items-center justify-between text-xs text-brand-mute">
                  <span>{article.reading_time} мин чтения</span>
                  <span className="text-brand-ink font-semibold group-hover:underline">
                    Читать →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/blog/"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-ink text-white font-semibold hover:bg-brand-ink/90 transition"
          >
            Все статьи блога
            <span aria-hidden="true">→</span>
          </Link>
          <p className="mt-3 text-sm text-brand-mute">
            {ARTICLES.length} материалов о фундаментах и газобетоне
          </p>
        </div>
      </div>
    </section>
  );
}
