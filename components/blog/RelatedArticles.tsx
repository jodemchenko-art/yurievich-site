import Link from 'next/link';
import { CATEGORY_LABELS, type Article } from '@/lib/articles/_types';

export default function RelatedArticles({ articles }: { articles: Article[] }) {
  if (!articles.length) return null;

  return (
    <section className="container-x mt-20 md:mt-24">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-8">
        Читайте также
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {articles.map((a) => (
          <Link
            key={a.slug}
            href={`/blog/${a.slug}/`}
            className="group block bg-white rounded-2xl border border-brand-line overflow-hidden hover:border-brand-ink hover:shadow-lg transition"
          >
            {a.cover_image && (
              <div className="aspect-[16/9] overflow-hidden bg-brand-sand">
                <img
                  src={a.cover_image}
                  alt={a.cover_alt}
                  width={600}
                  height={338}
                  className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
                  loading="lazy"
                />
              </div>
            )}
            <div className="p-5">
              <div className="text-xs text-brand-mute uppercase tracking-wider font-semibold">
                {CATEGORY_LABELS[a.category] || a.category}
              </div>
              <h3 className="mt-2 font-bold leading-snug text-brand-ink line-clamp-3">
                {a.title}
              </h3>
              <div className="mt-3 text-sm text-brand-mute">
                {a.reading_time} мин чтения
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
