import Link from 'next/link';
import { CATEGORY_LABELS, type Article } from '@/lib/articles/_types';

export default function BlogCard({ article, featured }: { article: Article; featured?: boolean }) {
  return (
    <Link
      href={`/blog/${article.slug}/`}
      className={`group block bg-white rounded-2xl border border-brand-line overflow-hidden hover:border-brand-ink hover:shadow-xl transition ${
        featured ? 'md:col-span-2' : ''
      }`}
    >
      {article.cover_image && (
        <div className={`overflow-hidden bg-brand-sand ${featured ? 'aspect-[2/1]' : 'aspect-[16/9]'}`}>
          <img
            src={article.cover_image}
            alt={article.cover_alt}
            width={featured ? 1200 : 600}
            height={featured ? 600 : 338}
            className="w-full h-full object-cover group-hover:scale-[1.03] transition duration-500"
            loading="lazy"
          />
        </div>
      )}
      <div className="p-6 md:p-8">
        <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-wider">
          <span className="text-brand-ink">
            {CATEGORY_LABELS[article.category] || article.category}
          </span>
          {article.region && (
            <span className="text-brand-mute">📍 {article.region}</span>
          )}
        </div>
        <h3
          className={`mt-3 font-extrabold leading-snug text-brand-ink ${
            featured ? 'text-2xl md:text-3xl' : 'text-lg md:text-xl'
          }`}
        >
          {article.title}
        </h3>
        <p className="mt-3 text-brand-mute leading-relaxed line-clamp-3">
          {article.meta_description}
        </p>
        <div className="mt-4 flex items-center justify-between text-sm">
          <time dateTime={article.publishedAt} className="text-brand-mute">
            {new Date(article.publishedAt).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </time>
          <span className="text-brand-mute">{article.reading_time} мин</span>
        </div>
      </div>
    </Link>
  );
}
