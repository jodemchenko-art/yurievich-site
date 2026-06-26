import Link from 'next/link';
import { REGIONS } from '@/lib/regions';

// Внутренняя перелинковка: из каждой статьи блога ведём ссылки на
// коммерческие и гео-страницы (денежные). Передаёт вес проиндексированных
// статей на посадочные → ускоряет их рост в выдаче.
export default function CommercialLinks() {
  return (
    <section className="container-x mt-16 md:mt-20">
      <div className="rounded-2xl border border-brand-line bg-brand-sand/40 p-6 md:p-8">
        <h2 className="text-xl md:text-2xl font-extrabold mb-4 text-brand-ink">
          Закажите фундамент под ключ
        </h2>
        <div className="flex flex-wrap gap-3 mb-7">
          <Link
            href="/fundament/"
            className="inline-flex items-center rounded-xl bg-brand-ink text-white px-5 py-2.5 font-semibold hover:opacity-90 transition"
          >
            Плитный фундамент под ключ
          </Link>
          <Link
            href="/kalkulyator/"
            className="inline-flex items-center rounded-xl border border-brand-ink text-brand-ink px-5 py-2.5 font-semibold hover:bg-brand-sand transition"
          >
            Калькулятор стоимости
          </Link>
        </div>

        <h3 className="font-bold text-brand-ink mb-3">
          Монолитная плита по районам СПб и Ленобласти
        </h3>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {REGIONS.map((r) => (
            <li key={r.slug}>
              <Link
                href={`/fundament/${r.slug}/`}
                className="text-brand-ink underline decoration-brand-line underline-offset-4 hover:decoration-brand-ink transition"
              >
                Фундамент в {r.prepositional}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
