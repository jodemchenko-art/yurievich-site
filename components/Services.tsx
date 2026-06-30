import { PRICES } from '@/lib/site';

const FEATURED = {
  id: 'plita',
  title: 'Монолитная плита под ключ',
  subtitle: 'Основная специализация',
  desc: 'Наша главная технология. Универсальное решение для домов на сложных грунтах СПб и ЛО. Бетон М300, арматура А500С, плита 300 мм по нагрузкам, заводской паспорт качества.',
  price: `от ${PRICES.plita.from.toLocaleString('ru-RU')} ${PRICES.plita.unit}`,
  bullets: [
    'Зимнее бетонирование по технологии (заливаем круглый год)',
    'Срок 10-14 дней под ключ',
    'Заводской бетон с паспортом · арматура А500С',
    'Геология и расчёт нагрузок включены',
    'Поэтапная оплата по факту приёмки',
  ],
  image: '/images/stock/p37733181.jpg',
};

const OTHERS = [
  {
    id: 'gazobloк-korobka',
    title: 'Газоблок — коробка',
    desc: 'Стены и перегородки из газобетона ЛСР под крышу. Без отделки. Идеально, если внутреннюю отделку планируете делать сами или поэтапно.',
    price: 'Расчёт по проекту',
    bullets: ['Газобетон ЛСР напрямую с завода', 'Несущие стены + перегородки', 'Перекрытие и кровля'],
    image: '/images/stock/p7598365.jpg',
  },
  {
    id: 'dom',
    title: 'Дом из газобетона под ключ',
    desc: 'Полный цикл: фундамент → коробка → кровля → инженерия → черновая отделка. Заезжаете и доделываете под себя.',
    price: `от ${PRICES.dom.from.toLocaleString('ru-RU')} ${PRICES.dom.unit}`,
    badge: 'Партнёр ЛСР',
    bullets: ['Газобетон ЛСР с паспортом', 'Срок 3-6 месяцев', 'Один договор, один ответственный'],
    image: '/images/stock/p30580640.jpg',
  },
];

export default function Services() {
  return (
    <section id="uslugi" className="section">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="text-brand-accent font-bold text-sm uppercase tracking-[0.2em]" style={{ color: '#1B3A5C' }}>
            Что мы делаем
          </span>
          <h2 className="section-title mt-2">Фокус — на монолитной&nbsp;плите</h2>
          <p className="section-sub">
            Главное направление — монолитный плитный фундамент. Льём также ленточные и свайные
            фундаменты под заказ — тип подбираем по грунту участка. По дому под ключ работаем
            с газобетоном ЛСР. Никаких субподрядчиков — всё делаем своей бригадой.
          </p>
        </div>

        {/* Featured: Plita */}
        <article className="mt-10 md:mt-14 group relative overflow-hidden rounded-3xl border border-brand-line bg-white shadow-sm hover:shadow-xl transition">
          <div className="grid lg:grid-cols-5 min-h-[360px]">
            {/* Photo side */}
            <div className="relative lg:col-span-3 min-h-[260px] lg:min-h-[420px] bg-brand-ink overflow-hidden">
              <div
                className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url('${FEATURED.image}')` }}
              />
              <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/70 to-transparent" />
              <span className="absolute top-4 left-4 bg-amber-400 text-brand-ink text-[10px] sm:text-xs font-bold uppercase tracking-[0.15em] px-3 py-1.5 rounded">
                ⭐ {FEATURED.subtitle}
              </span>
            </div>

            {/* Content side */}
            <div className="lg:col-span-2 p-6 sm:p-8 lg:p-10 flex flex-col">
              <h3 className="text-2xl sm:text-3xl lg:text-[32px] font-extrabold leading-tight tracking-tight">
                {FEATURED.title}
              </h3>
              <p className="mt-3 text-sm sm:text-base text-brand-mute leading-relaxed">
                {FEATURED.desc}
              </p>

              <ul className="mt-5 space-y-2 flex-1">
                {FEATURED.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5 text-sm">
                    <span className="text-emerald-600 mt-0.5 flex-shrink-0">✓</span>
                    <span className="text-brand-ink/90">{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 pt-5 border-t border-brand-line flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <div className="text-xs text-brand-mute uppercase tracking-wider">Стоимость</div>
                  <div className="text-2xl font-extrabold text-brand-ink mt-0.5">{FEATURED.price}</div>
                </div>
                <a href="#calc" className="btn-primary !py-3 !px-5 !text-sm whitespace-nowrap">
                  Рассчитать плиту →
                </a>
              </div>
            </div>
          </div>
        </article>

        {/* Other 2 — gazobeton */}
        <div className="mt-6 md:mt-8 grid md:grid-cols-2 gap-5 md:gap-6">
          {OTHERS.map((s) => (
            <article
              key={s.id}
              className="group relative flex flex-col rounded-2xl border border-brand-line bg-white overflow-hidden hover:shadow-xl hover:-translate-y-1 transition"
            >
              {/* Photo */}
              <div className="relative h-52 bg-brand-ink overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${s.image}')` }}
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/50 to-transparent" />
                {(s as any).badge && (
                  <span className="absolute top-3 left-3 bg-brand-ink text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded">
                    {(s as any).badge}
                  </span>
                )}
              </div>

              <div className="flex flex-col flex-1 p-5 sm:p-6">
                <h3 className="font-bold text-lg leading-tight">{s.title}</h3>
                <p className="mt-2 text-sm text-brand-mute leading-relaxed flex-1">{s.desc}</p>

                <ul className="mt-4 space-y-1.5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-brand-ink">
                      <span className="text-emerald-600 mt-0.5">✓</span>
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-5 pt-4 border-t border-brand-line flex items-center justify-between">
                  <div className="text-brand-ink font-extrabold text-base">{s.price}</div>
                  <a
                    href="#calc"
                    className="inline-flex items-center gap-1 text-sm font-bold text-brand-ink hover:text-brand-accent transition"
                  >
                    Рассчитать <span>→</span>
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
