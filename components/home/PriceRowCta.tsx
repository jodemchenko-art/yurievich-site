'use client';

/**
 * Строка таблицы цен кликабельна: человек тыкает в свой размер дома — и попадает
 * в расчёт, где первые два шага уже отвечены за него.
 *
 * Зачем: между «я посмотрел цену» и «я оставил телефон» обычно теряется больше
 * всего людей. Клик по своему размеру — это микро-обязательство: человек уже
 * сделал выбор и дальше идёт не с нуля, а с двух заполненных шагов из пяти.
 * Плюс он видит, что сайт запомнил именно его случай.
 */
export default function PriceRowCta({
  size,
  area,
  children,
}: {
  size: string;
  area: number;
  children: React.ReactNode;
}) {
  const go = () => {
    window.dispatchEvent(
      new CustomEvent('yur:prefill', { detail: { size, area } })
    );
    const el = document.getElementById('calc');
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <button
      type="button"
      onClick={go}
      aria-label={`Рассчитать плиту под дом ${size.replace('x', '×')} м, ${area} м²`}
      className="group flex w-full items-baseline gap-2 text-left"
    >
      <span className="min-w-0">
        {children}
      </span>
      <span
        aria-hidden
        className="mono flex-shrink-0 text-[11px] text-hair transition-all group-hover:translate-x-0.5 group-hover:text-signal-dark"
      >
        →
      </span>
    </button>
  );
}
