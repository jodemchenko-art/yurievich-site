import Link from 'next/link';
import { CATEGORY_LABELS, type Article } from '@/lib/articles/_types';

export default function ArticleHeader({ article }: { article: Article }) {
  const dateRu = new Date(article.publishedAt).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="container-x pt-10 md:pt-14">
      {/* Breadcrumbs */}
      <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
        <ol className="flex items-center gap-2 flex-wrap">
          <li>
            <Link href="/" className="hover:text-brand-ink transition">
              Главная
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li>
            <Link href="/blog" className="hover:text-brand-ink transition">
              Блог
            </Link>
          </li>
          <li aria-hidden="true">›</li>
          <li className="text-brand-ink line-clamp-1 max-w-[60ch]">{article.title}</li>
        </ol>
      </nav>

      {/* Category + meta line */}
      <div className="flex flex-wrap items-center gap-3 text-sm mb-5">
        <span className="inline-flex items-center rounded-full bg-brand-sand px-3 py-1 font-semibold text-brand-ink">
          {CATEGORY_LABELS[article.category] || article.category}
        </span>
        {article.region && (
          <span className="text-brand-mute">📍 {article.region}</span>
        )}
        <span className="text-brand-mute">• {article.reading_time} мин чтения</span>
        <time
          dateTime={article.publishedAt}
          className="text-brand-mute"
        >
          {dateRu}
        </time>
      </div>

      {/* H1 */}
      <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-brand-ink max-w-[24ch]">
        {article.title}
      </h1>

      {/* Excerpt = meta description (читателю важно понять о чём статья сразу) */}
      <p className="mt-5 text-lg text-brand-mute max-w-[65ch] leading-relaxed">
        {article.meta_description}
      </p>

      {/* Hero image */}
      {article.cover_image && (
        <div className="mt-8 md:mt-10 -mx-4 sm:mx-0">
          <img
            src={article.cover_image}
            alt={article.cover_alt}
            width={1200}
            height={630}
            className="w-full h-auto rounded-none sm:rounded-2xl object-cover aspect-[16/9]"
            loading="eager"
          />
        </div>
      )}
    </header>
  );
}
