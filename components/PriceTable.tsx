import Link from 'next/link';
import {
  PRICE_TABLE_COLUMNS,
  PRICE_TABLE_GROUND,
  PRICE_TABLE_ROWS,
  GROUND_LABEL,
  SIZE_AREA,
  calcPlita,
  fmtRub,
} from '@/lib/pricing';

/**
 * Таблица «размер плиты × тип дома → сумма».
 *
 * Зачем: у всех конкурентов, которые держат топ по «фундамент плита цена СПб»,
 * такая матрица на посадочной есть, а у нас была только строчка «от 5 500 ₽/м²».
 * Человек ищет «плита 10х10 цена» — и должен увидеть на странице ровно свою цифру,
 * иначе он уходит к тому, кто её показал.
 *
 * Суммы считает `lib/pricing.ts` — тот же код, что и калькулятор,
 * поэтому таблица и калькулятор не могут разойтись.
 */
export default function PriceTable() {
  const ground = GROUND_LABEL[PRICE_TABLE_GROUND];

  return (
    <section id="ceny" className="container-x py-10 md:py-14">
      <h2 className="text-2xl md:text-3xl font-extrabold text-brand-ink">
        Сколько стоит монолитная плита: цены по размерам
      </h2>
      <p className="mt-3 text-brand-mute max-w-3xl leading-relaxed">
        Ориентировочная стоимость плиты под ключ с материалами: бетон М300 W6 F150, арматура
        А500С, подушка ПГС с геотекстилем, опалубка, работа и заливка. Расчёт для грунта
        «{ground.name.toLowerCase()}» — это самый частый грунт в Ленобласти.
        На песке будет дешевле, на торфе дороже из-за выторфовки.
      </p>

      <div className="mt-7 -mx-4 px-4 overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <caption className="sr-only">
            Цены на монолитный плитный фундамент под ключ в СПб и Ленинградской области по
            размерам плиты и типу дома
          </caption>
          <thead>
            <tr className="bg-brand-ink text-white">
              <th scope="col" className="text-left font-bold px-4 py-3 rounded-tl-xl">
                Размер плиты
              </th>
              {PRICE_TABLE_COLUMNS.map((c, i) => (
                <th
                  key={c.key}
                  scope="col"
                  className={`text-left font-bold px-4 py-3 ${
                    i === PRICE_TABLE_COLUMNS.length - 1 ? 'rounded-tr-xl' : ''
                  }`}
                >
                  {c.label}
                  <span className="block text-[11px] font-normal text-white/70 mt-0.5">{c.sub}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {PRICE_TABLE_ROWS.map((size, rowIdx) => (
              <tr
                key={size}
                className={rowIdx % 2 === 1 ? 'bg-brand-sand/60' : 'bg-white'}
              >
                <th scope="row" className="text-left px-4 py-3 border-b border-brand-line font-bold text-brand-ink whitespace-nowrap">
                  {size.replace('x', '×')} м
                  <span className="block text-xs font-normal text-brand-mute">
                    {SIZE_AREA[size]} м²
                  </span>
                </th>
                {PRICE_TABLE_COLUMNS.map((c) => {
                  const r = calcPlita({
                    size,
                    material: c.material,
                    ground: PRICE_TABLE_GROUND,
                    storeys: c.storeys,
                  });
                  return (
                    <td key={c.key} className="px-4 py-3 border-b border-brand-line whitespace-nowrap">
                      <span className="font-extrabold text-brand-ink">{fmtRub(r.total)} ₽</span>
                      <span className="block text-xs text-brand-mute">{fmtRub(r.pricePerM2)} ₽/м²</span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 rounded-2xl border border-brand-line bg-white p-5 md:p-6 max-w-3xl">
        <p className="text-sm text-brand-mute leading-relaxed">
          <strong className="text-brand-ink">Это ориентир, а не смета.</strong> Финальную сумму
          можно назвать только после выезда инженера: она зависит от реального грунта на участке,
          уровня грунтовых вод, перепада высот, подъезда для миксера и удалённости от бетонного
          завода. Мы не берём деньги за выезд и не «уточняем» цену вверх после подписания —
          в договоре стоит фиксированная сумма.
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link
            href="/kalkulyator/"
            className="inline-flex items-center rounded-xl bg-brand-ink text-white px-5 py-3 font-semibold hover:opacity-90 transition"
          >
            Посчитать свой размер и грунт
          </Link>
          <Link
            href="/blog/smeta-na-monolitnuyu-plitu-fundamenta-obrazec-spb/"
            className="inline-flex items-center rounded-xl border border-brand-ink text-brand-ink px-5 py-3 font-semibold hover:bg-brand-sand transition"
          >
            Посмотреть образец сметы
          </Link>
        </div>
      </div>
    </section>
  );
}
