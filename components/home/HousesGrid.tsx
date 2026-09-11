'use client';

import { useCallback, useEffect, useState } from 'react';
import { SITE } from '@/lib/site';
import SectionHead from './SectionHead';
import { HOUSE_OBJECTS } from '@/lib/objects';

/**
 * ДОМА, КОТОРЫЕ МЫ СТРОИМ.
 *
 * Двенадцать наших площадок: газобетонные коробки, кровля, монолитные
 * перекрытия. До этого блока на сайте не было ни одного дома — только плиты,
 * и человек, который ищет «дом под ключ», не видел доказательства, что мы
 * доводим стройку выше фундамента.
 *
 * 🔴 Честность кадра. Сами дома, ракурсы, стадия работ и сезон — настоящие,
 * с телефонов бригад. Обработкой убран только строительный мусор, поддоны,
 * колея и техника вокруг: участок прибран, дом не тронут ни на окно. Поэтому
 * подпись раздела — «строим», а не «построили»: на кадрах стройка, и подпись
 * обязана совпадать с картинкой. Сюда нельзя подкладывать сгенерированные
 * «красивые коттеджи» — в блоке доверия подделка читается мгновенно.
 * Исходники и конвейер: 01-stroyka/nashi-doma-foto/.
 */

const DOMA = HOUSE_OBJECTS;

export default function HousesGrid() {
  // null — лайтбокс закрыт; иначе индекс открытого кадра
  const [open, setOpen] = useState<number | null>(null);

  const move = useCallback((step: number) => {
    setOpen((i) => (i === null ? i : (i + step + DOMA.length) % DOMA.length));
  }, []);

  /**
   * Клавиатура и блокировка прокрутки живут здесь, а не в разметке: без Esc
   * лайтбокс на десктопе воспринимается как ловушка, а без overflow:hidden
   * страница уезжает под открытым кадром на телефоне.
   */
  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(null);
      else if (e.key === 'ArrowLeft') move(-1);
      else if (e.key === 'ArrowRight') move(1);
    };
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, move]);

  return (
    <section id="doma" data-plane="paper" className="relative overflow-hidden bg-paper0">
      <div aria-hidden className="absolute inset-0 grid-paper" />

      <div className="container-x relative py-16 md:py-24">
        <SectionHead
          index="04"
          label="Наши дома · газобетон"
          align="between"
          title={<>Дома, которые мы строим<br className="hidden sm:block" /> прямо сейчас</>}
          lede="Двенадцать наших площадок в Петербурге и области: газобетонные коробки, кровля, монолитные перекрытия. Кадры сняты бригадами в рабочие дни — где-то зима и бетононасос, где-то кровельщик на коньке. Мы убрали с фотографий только строительный мусор и технику; дома, стадия работ и погода настоящие."
        >
          <a
            href={SITE.telegramChannel}
            target="_blank"
            rel="noopener"
            className="btn-line btn-line-light mono w-full justify-center border-rule text-xs sm:w-auto"
          >
            Стройка каждый день
            <span className="arw" aria-hidden>→</span>
          </a>
        </SectionHead>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:mt-14 lg:grid-cols-3 lg:gap-6">
          {DOMA.map((d, i) => (
            <figure
              key={d.file}
              className="plate ticks p-2"
              data-reveal
              style={{ ['--d' as any]: `${(i % 3) * 70}ms` }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`${d.title} — открыть кадр во весь экран`}
                className="stage-frame group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-paper2"
              >
                <img
                  src={`/images/doma/t/${d.file}.jpg`}
                  alt={`${d.title} — дом из газобетона, объект СК «Юрьевич» в Ленинградской области`}
                  loading="lazy"
                  decoding="async"
                  width={760}
                  height={570}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                />

                <span className="mono pointer-events-none absolute left-2 top-2 bg-bp-950/80 px-2 py-1 text-[10px] tracking-wider text-chalk">
                  {d.stage}
                </span>
                <span className="mono pointer-events-none absolute bottom-2 right-2 bg-paper0/85 px-2 py-1 text-[10px] tracking-wider text-inkmute opacity-0 transition-opacity group-hover:opacity-100">
                  ВО ВЕСЬ ЭКРАН ⤢
                </span>
              </button>

              <figcaption className="px-1 pb-1 pt-3">
                <div className="text-base font-extrabold leading-tight text-graphite">{d.title}</div>
                <div className="mono mt-1 text-[10px] leading-snug text-inkmute sm:text-[11px]">
                  {d.note}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <p className="mono mt-8 max-w-3xl text-[11px] leading-relaxed text-inkmute">
          Дом ставим на свой же фундамент: сначала плита, потом коробка, кровля и контур —
          одна бригада и один договор на весь цикл. Хотите посмотреть живьём — свозим на
          действующий объект в любой рабочий день.
        </p>
      </div>

      {open !== null && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={DOMA[open].title}
          onClick={() => setOpen(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-bp-950/95 p-3 md:p-8"
        >
          <button
            type="button"
            onClick={() => setOpen(null)}
            aria-label="Закрыть"
            className="mono absolute right-3 top-3 border border-chalkdim/45 px-3 py-2 text-[11px] tracking-wider text-chalk md:right-6 md:top-6"
          >
            ЗАКРЫТЬ ✕
          </button>

          {/* Клик по самому кадру не должен закрывать окно — только по фону */}
          <figure
            onClick={(e) => e.stopPropagation()}
            className="max-h-full w-full max-w-5xl"
          >
            <img
              src={`/images/doma/${DOMA[open].file}.jpg`}
              alt={DOMA[open].title}
              className="max-h-[76vh] w-full object-contain"
            />
            <figcaption className="mt-3 flex items-end justify-between gap-4">
              <div>
                <div className="text-base font-extrabold leading-tight text-chalk">
                  {DOMA[open].title}
                </div>
                <div className="mono mt-1 text-[11px] leading-snug text-chalkdim">
                  {DOMA[open].stage} · {DOMA[open].note}
                </div>
              </div>
              <div className="mono flex flex-shrink-0 items-center text-[11px] text-sand">
                <button
                  type="button"
                  onClick={() => move(-1)}
                  aria-label="Предыдущий кадр"
                  className="border border-chalkdim/45 px-3 py-2 text-chalk"
                >
                  ←
                </button>
                <span className="mx-3">
                  {String(open + 1).padStart(2, '0')} / {DOMA.length}
                </span>
                <button
                  type="button"
                  onClick={() => move(1)}
                  aria-label="Следующий кадр"
                  className="border border-chalkdim/45 px-3 py-2 text-chalk"
                >
                  →
                </button>
              </div>
            </figcaption>
          </figure>
        </div>
      )}
    </section>
  );
}
