import Link from 'next/link';
import PriceRowCta from './PriceRowCta';
import SectionHead from './SectionHead';
import {
  PRICE_TABLE_COLUMNS,
  PRICE_TABLE_ROWS,
  PRICE_TABLE_GROUND,
  GROUND_LABEL,
  SIZE_AREA,
  calcPlita,
  fmtRub,
} from '@/lib/pricing';

/**
 * ЦЕНА.
 *
 * Психологически это самое напряжённое место страницы: человек уже понял, что мы
 * умеем, и боится услышать «рассчитывается индивидуально». Поэтому здесь —
 * открытая матрица размеров и, что важнее, честный список того, чего в цене НЕТ.
 * Названные вслух исключения снимают главный страх крупной покупки —
 * «на этапе договора всплывёт то, о чём мне не сказали».
 *
 * Цифры берутся из lib/pricing — из того же модуля, что и калькулятор,
 * поэтому таблица и калькулятор не могут разойтись.
 */

const INCLUDED = [
  'Выезд инженера, замер пятна застройки',
  'Расчёт толщины плиты и схемы армирования',
  'Земляные работы и песчано-щебёночная подушка',
  'Опалубка и её демонтаж',
  'Арматура А500С, вязка каркаса',
  'Заводской бетон М300 W6 F150 с паспортом',
  'Заливка, уход за бетоном, зимний прогрев',
  'Акт приёмки и гарантийный талон на 5 лет',
];

const EXTRA = [
  'Выторфовка и замена грунта на торфе и болоте',
  'Дренаж и ливнёвка при высоком уровне грунтовых вод',
  'Утепление плиты и УШП — если нужны по проекту',
  'Бетононасос, когда миксеру не подъехать к пятну',
  'Демонтаж старых конструкций на участке',
  'Лабораторные геологические изыскания с отчётом',
];

export default function PriceBlock() {
  const ground = GROUND_LABEL[PRICE_TABLE_GROUND];

  return (
    <section id="ceny" data-plane="cold" className="relative bg-cold">
      <div className="container-x py-16 md:py-24">
        <SectionHead
          index="04"
          label="Цена · монолитная плита"
          title={<>Порядок цифр — до&nbsp;звонка, а&nbsp;не&nbsp;после</>}
          lede={
            <>
              Таблица считается по той же формуле, что и наш калькулятор: грунт —{' '}
              <span className="text-graphite">{ground.name.toLowerCase()}</span> (самый частый
              в Ленобласти), цена включает работу и материалы. Это ориентир до выезда инженера,
              а не оферта: точная сумма появляется после замера и фиксируется в договоре.
            </>
          }
        />

        {/* Матрица размеров */}
        <div className="mt-10 md:mt-14" data-reveal>
          <div className="mono mb-2 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-inkcold">
            <span className="md:hidden">↔ таблицу можно листать вбок</span>
            <span>нажмите на свой размер — посчитаем именно его</span>
          </div>

          <div className="overflow-x-auto border border-rulec bg-paper0">
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="bg-cold2">
                  <th className="sticky left-0 z-10 border-b border-r border-rulec bg-cold2 px-4 py-3">
                    <span className="eyebrow text-inkcold">Размер дома</span>
                  </th>
                  {PRICE_TABLE_COLUMNS.map((c) => (
                    <th key={c.key} className="border-b border-rulec px-4 py-3 align-bottom">
                      <div className="text-sm font-extrabold leading-tight text-graphite">
                        {c.label}
                      </div>
                      <div className="mono mt-1 text-[10px] leading-tight text-inkcold">
                        {c.sub}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {PRICE_TABLE_ROWS.map((size) => (
                  <tr key={size} className="group/row transition-colors even:bg-cold2/50 hover:bg-signal/[0.08]">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 border-r border-rulec bg-paper0 px-4 py-3 text-left transition-colors even:bg-cold2 group-hover/row:bg-signal/[0.08]"
                    >
                      <PriceRowCta size={size} area={SIZE_AREA[size]}>
                        <span className="mono block text-sm text-graphite">
                          {size.replace('x', '×')} м
                        </span>
                        <span className="mono mt-0.5 block text-[10px] text-inkmute">
                          {SIZE_AREA[size]} м²
                        </span>
                      </PriceRowCta>
                    </th>
                    {PRICE_TABLE_COLUMNS.map((c) => {
                      const r = calcPlita({
                        size,
                        material: c.material,
                        storeys: c.storeys,
                        ground: PRICE_TABLE_GROUND,
                      });
                      return (
                        <td key={c.key} className="border-t border-hairc px-4 py-3">
                          <div className="mono text-[15px] leading-tight text-graphite">
                            {fmtRub(r.total)} ₽
                          </div>
                          <div className="mono mt-0.5 text-[10px] leading-tight text-inkcold">
                            {fmtRub(r.pricePerM2)} ₽/м²
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mono mt-3 text-[11px] leading-relaxed text-inkcold">
            {ground.note} · На песке выйдет дешевле, на торфе — дороже: разницу показываем
            открыто в{' '}
            <Link href="/kalkulyator/" className="ulink text-signal">
              калькуляторе
            </Link>
            .
          </p>
        </div>

        {/* Входит / не входит */}
        <div className="mt-12 grid gap-px border border-rulec bg-rulec/40 md:grid-cols-2">
          <div className="bg-paper0 p-6 md:p-8" data-reveal>
            <div className="eyebrow text-inkcold">Входит в цену</div>
            <ul className="mt-5 space-y-3">
              {INCLUDED.map((x) => (
                <li key={x} className="flex gap-3 text-sm leading-snug text-graphite">
                  <span aria-hidden className="mono mt-0.5 text-signal">
                    +
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-cold2 p-6 md:p-8" data-reveal style={{ ['--d' as any]: '90ms' }}>
            <div className="eyebrow text-inkcold">Считается отдельно — говорим до договора</div>
            <ul className="mt-5 space-y-3">
              {EXTRA.map((x) => (
                <li key={x} className="flex gap-3 text-sm leading-snug text-inkcold">
                  <span aria-hidden className="mono mt-0.5 text-inkcold">
                    −
                  </span>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <p className="mt-6 border-t border-rulec pt-4 text-sm leading-relaxed text-graphite">
              Если что-то из этого нужно на вашем участке — вы узнаете об этом на замере,
              до подписания договора, а не когда техника уже стоит на участке.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
