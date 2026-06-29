import Link from 'next/link';
import { SITE } from '@/lib/site';

// Транзакционный SEO-CTA: ловит коммерческие интенты «заказать фундамент/плиту»,
// «цена фундамента в <месте>», «сколько стоит». Ставится на главную и гео-страницы.
export default function OrderCta({ place, priceFrom }: { place: string; priceFrom?: number }) {
  const price = priceFrom ? priceFrom.toLocaleString('ru-RU') : '7 500';
  return (
    <section className="container-x pb-16">
      <div className="rounded-2xl bg-brand-ink text-white p-7 md:p-10">
        <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">
          Заказать плитный фундамент в {place}
        </h2>
        <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">
          Цена фундамента в {place} — <strong className="text-white">от {price} ₽/м²</strong>,
          под&nbsp;ключ, по&nbsp;договору с&nbsp;фиксированной ценой. Чтобы узнать, сколько стоит
          фундамент (монолитная плита) под ваш дом, оставьте заявку — бесплатный расчёт и&nbsp;выезд
          инженера за&nbsp;30&nbsp;минут.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/#calc"
            className="rounded-xl bg-amber-400 text-brand-ink px-7 py-4 font-bold no-underline hover:opacity-90 transition"
          >
            Заказать расчёт фундамента →
          </Link>
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="rounded-xl border border-white/40 px-7 py-4 font-bold no-underline hover:bg-white/10 transition"
          >
            ☎ {SITE.phone}
          </a>
        </div>
      </div>
    </section>
  );
}
