'use client';

import { useEffect, useRef, useState } from 'react';
import { SITE } from '@/lib/site';
import SectionHead from './SectionHead';

/**
 * ОБЪЕКТЫ.
 *
 * Все фото здесь — настоящие, с площадок компании (сообщество «Ленбетон78»).
 * Ни одного сгенерированного кадра: в блоке, который отвечает за доверие,
 * красивая нейросетевая картинка работает ровно наоборот — человек чувствует
 * подделку и уходит.
 *
 * Взаимодействие вместо галереи: у каждого объекта есть два кадра одной точки —
 * армокаркас и залитая плита. Ползунок превращает «посмотрите наши работы»
 * в проверку: одна и та же площадка, до и после, ничего не подменено.
 */

const OBJECTS = [
  {
    loc: 'Ропша',
    district: 'Ломоносовский р-н, ЛО',
    area: '120 м²',
    armo: '/images/objects/ropsha-120-armo.jpg',
    plita: '/images/objects/ropsha-120-plita.jpg',
  },
  {
    loc: 'СНТ «Красный Октябрь»',
    district: 'Ленинградская область',
    area: '150 м²',
    armo: '/images/objects/krasny-oktyabr-150-armo.jpg',
    plita: '/images/objects/krasny-oktyabr-150-plita.jpg',
  },
  {
    loc: 'дер. Торики',
    district: 'Ленинградская область',
    area: '144 м²',
    armo: '/images/objects/toriki-144-armo.jpg',
    plita: '/images/objects/toriki-144-plita.jpg',
  },
  {
    loc: 'Низино',
    district: 'Ломоносовский р-н, ЛО',
    area: '100 м²',
    armo: '/images/objects/nizino-100-armo.jpg',
    plita: '/images/objects/nizino-100-plita.jpg',
  },
  {
    loc: 'Пеники',
    district: 'Ломоносовский р-н, ЛО',
    area: '104 м²',
    armo: '/images/objects/peniki-104-armo.jpg',
    plita: '/images/objects/peniki-104-plita.jpg',
  },
];

export default function ObjectsChronicle() {
  return (
    <section id="portfolio" data-plane="graphite" className="on-dark relative overflow-hidden bg-bp-900 text-chalk">
      <div aria-hidden className="absolute inset-0 grid-paper-dark" />

      <div className="container-x relative py-16 md:py-24">
        <SectionHead
          index="03"
          label="Объекты · СПб и Ленобласть"
          dark
          align="between"
          title={<>Одна площадка, два кадра.<br className="hidden sm:block" /> Потяните ползунок</>}
          lede="Это не подборка красивых картинок из интернета, а наши объекты: слева — армокаркас перед заливкой, справа — та же плита после. Фото выкладываем в сообществе и в канале стройки в день работ."
        >
          <a
            href={SITE.telegramChannel}
            target="_blank"
            rel="noopener"
            className="btn-line btn-line-dark mono w-full justify-center border-chalkdim/45 text-xs text-chalk sm:w-auto"
          >
            Канал стройки
            <span className="arw" aria-hidden>→</span>
          </a>
        </SectionHead>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 lg:gap-8">
          {OBJECTS.map((o, i) => (
            <ObjectCard key={o.loc} {...o} index={i} demo={i === 0} />
          ))}

          {/* Шестая ячейка — выход на площадки, где объектов больше */}
          <div
            className="plate-dark flex flex-col justify-between p-6 md:p-8"
            data-reveal
            style={{ ['--d' as any]: '120ms' }}
          >
            <div>
              <div className="eyebrow text-sand">Архив работ</div>
              <p className="display-3 mt-3 text-chalk">
                Всего {SITE.projectsCount} завершённых объектов
              </p>
              <p className="mt-3 text-sm leading-relaxed text-chalkdim">
                Здесь показаны пять — с двумя стадиями каждый. Остальные лежат там, где мы их
                выкладывали по ходу работ: с датами, погодой и комментариями заказчиков.
                А ещё можем свозить вас на действующий объект — посмотреть технологию живьём.
              </p>
            </div>

            <div className="mt-6 grid gap-2 sm:grid-cols-2">
              <a
                href={SITE.vk}
                target="_blank"
                rel="noopener"
                className="btn-line btn-line-dark mono justify-center border-chalkdim/45 text-xs text-chalk"
              >
                ВКонтакте
                <span className="arw" aria-hidden>→</span>
              </a>
              <a
                href={SITE.telegramChannel}
                target="_blank"
                rel="noopener"
                className="btn-line btn-line-dark mono justify-center border-chalkdim/45 text-xs text-chalk"
              >
                Telegram
                <span className="arw" aria-hidden>→</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ObjectCard({
  loc,
  district,
  area,
  armo,
  plita,
  index,
  demo = false,
}: {
  loc: string;
  district: string;
  area: string;
  armo: string;
  plita: string;
  index: number;
  demo?: boolean;
}) {
  const [touched, setTouched] = useState(false);
  const frameRef = useRef<HTMLDivElement>(null);
  const posRef = useRef(52);
  const rafRef = useRef(0);
  const draggingRef = useRef(false);

  /**
   * Почему тут НЕ input[type=range].
   *
   * Раньше поверх фото лежал прозрачный ползунок. В Chrome нажатие мимо бегунка
   * перебрасывает значение скачком и НЕ начинает перетаскивание — то есть шторка
   * дёргалась, но не тянулась. Здесь обычные pointer-события с захватом указателя:
   * работает и мышью, и пальцем, и с любой точки кадра.
   *
   * Позиция пишется прямо в CSS-переменную --x, минуя состояние React: на
   * перетаскивании это разница между «плавно едет» и «ползёт рывками», потому что
   * ререндер карточки с двумя фото на каждый кадр слабый телефон не вытягивает.
   */
  const apply = (v: number) => {
    const el = frameRef.current;
    if (!el) return;
    posRef.current = v;
    el.style.setProperty('--x', `${v}%`);
    el.setAttribute('aria-valuenow', String(Math.round(v)));
  };

  const fromClientX = (clientX: number) => {
    const el = frameRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const v = ((clientX - r.left) / r.width) * 100;
    const clamped = Math.min(100, Math.max(0, v));
    cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => apply(clamped));
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    // Тянуть можно откуда угодно, а не только за рукоятку
    draggingRef.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture?.(e.pointerId);
    if (!touched) setTouched(true);
    fromClientX(e.clientX);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    fromClientX(e.clientX);
  };

  const stop = (e: React.PointerEvent<HTMLDivElement>) => {
    draggingRef.current = false;
    (e.currentTarget as HTMLElement).releasePointerCapture?.(e.pointerId);
  };

  // Клавиатура: стрелки двигают шторку, Home/End — в края
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    const step = e.shiftKey ? 10 : 3;
    let v = posRef.current;
    if (e.key === 'ArrowLeft') v -= step;
    else if (e.key === 'ArrowRight') v += step;
    else if (e.key === 'Home') v = 0;
    else if (e.key === 'End') v = 100;
    else return;
    e.preventDefault();
    if (!touched) setTouched(true);
    apply(Math.min(100, Math.max(0, v)));
  };

  /**
   * Само-демонстрация первой карточки: когда она впервые попадает в кадр,
   * шторка один раз сама уезжает и возвращается. Без этого люди не догадываются,
   * что кадр интерактивный, и весь смысл блока проходит мимо.
   * Событие firstview присылает движок анимаций (components/home/Motion.tsx).
   */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    apply(52);
    if (!demo) return;

    let raf = 0;
    const run = () => {
      if (draggingRef.current) return; // человек уже сам взялся — не мешаем
      const from = 52;
      const to = 16;
      const dur = 2200;
      let t0 = 0;
      const step = (now: number) => {
        if (draggingRef.current) return;
        if (!t0) t0 = now;
        const t = Math.min(1, (now - t0) / dur);
        const wave = Math.sin(t * Math.PI);
        const eased = wave * wave * (3 - 2 * wave);
        apply(from + (to - from) * eased);
        if (t < 1) raf = requestAnimationFrame(step);
        else apply(from);
      };
      raf = requestAnimationFrame(step);
    };

    el.addEventListener('firstview', run as EventListener, { once: true });
    return () => {
      el.removeEventListener('firstview', run as EventListener);
      cancelAnimationFrame(raf);
    };
  }, [demo]);

  useEffect(() => () => cancelAnimationFrame(rafRef.current), []);

  return (
    <figure
      className="plate-dark ticks p-2"
      data-reveal
      style={{ ['--d' as any]: `${(index % 2) * 90}ms` }}
    >
      <div
        ref={frameRef}
        {...(demo ? { 'data-demo': '' } : {})}
        role="slider"
        tabIndex={0}
        aria-label={`Объект в ${loc}: потяните, чтобы сравнить армокаркас и залитую плиту`}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={52}
        aria-orientation="horizontal"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={stop}
        onPointerCancel={stop}
        onKeyDown={onKeyDown}
        className="stage-frame relative aspect-[4/3] cursor-ew-resize select-none overflow-hidden bg-bp-950 sm:aspect-[3/2]"
        style={{ ['--x' as any]: '52%' }}
      >
        <img
          src={armo}
          alt={`Армокаркас плиты ${area}, объект в ${loc}`}
          loading="lazy"
          decoding="async"
          draggable={false}
          width={600}
          height={800}
          className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0" style={{ clipPath: 'inset(0 0 0 var(--x))' }}>
          <img
            src={plita}
            alt={`Залитая монолитная плита ${area}, объект в ${loc}`}
            loading="lazy"
            decoding="async"
            draggable={false}
            width={600}
            height={800}
            className="pointer-events-none absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Линия раздела + рукоятка */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-signal-bright"
          style={{ left: 'var(--x)' }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-signal-bright bg-bp-950/85 backdrop-blur-sm"
          style={{ left: 'var(--x)' }}
        >
          <span className="mono text-[12px] text-signal-bright">↔</span>
        </div>

        {/* Подписи стадий */}
        <span className="mono pointer-events-none absolute left-2 top-2 bg-bp-950/75 px-2 py-1 text-[10px] tracking-wider text-chalk">
          АРМОКАРКАС
        </span>
        <span className="mono pointer-events-none absolute right-2 top-2 bg-sand px-2 py-1 text-[10px] tracking-wider text-graphite">
          ПЛИТА ЗАЛИТА
        </span>

        {!touched && (
          <span className="mono pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 bg-bp-950/85 px-2.5 py-1 text-[10px] tracking-wider text-sand">
            ← ПОТЯНИТЕ →
          </span>
        )}
      </div>

      <figcaption className="flex items-end justify-between gap-3 px-1 pb-1 pt-3">
        <div>
          <div className="text-base font-extrabold leading-tight text-chalk">{loc}</div>
          <div className="mono mt-1 text-[10px] leading-tight text-chalkdim sm:text-[11px]">
            {district}
          </div>
        </div>
        <div className="mono flex-shrink-0 text-sm text-sand">{area}</div>
      </figcaption>
    </figure>
  );
}
