import type { ArticleFaq as ArticleFaqType } from '@/lib/articles/_types';

export default function ArticleFaq({
  items,
  title = 'Частые вопросы',
}: {
  items: ArticleFaqType[];
  title?: string;
}) {
  if (!items || items.length === 0) return null;
  return (
    <section className="container-x mt-16 max-w-4xl">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-8">{title}</h2>
      <div className="space-y-3">
        {items.map((f, i) => (
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
  );
}
