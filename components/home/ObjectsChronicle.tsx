'use client';

import { useState } from 'react';
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
    <section id="portfolio" className="relative overflow-hidden bg-bp-900 text-white">
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
            className="btn-line btn-line-dark mono w-full justify-center border-white/25 text-xs text-white sm:w-auto"
          >
            Канал стройки
            <span className="arw" aria-hidden>→</span>
          </a>
        </SectionHead>

        <div className="mt-10 grid gap-6 md:mt-14 md:grid-cols-2 lg:gap-8">
          {OBJECTS.map((o, i) => (
            <ObjectCard key={o.loc} {...o} index={i} />
          ))}

          {/* Шестая ячейка — выход на площадки, где объектов больше */}
          <div
            className="plate-dark flex flex-col justify-between p-6 md:p-8"
            data-reveal
            style={{ ['--d' as any]: '120ms' }}
          >
            <div>
              <div className="eyebrow text-signal">Архив работ</div>
              <p className="display-3 mt-3 text-white">
                Всего {SITE.projectsCount} завершённых объектов
              </p>
              <p className="mt-3 text-sm leading-relaxed text-bp-text">
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
                className="btn-line btn-line-dark mono justify-center border-white/25 text-xs text-white"
              >
                ВКонтакте
                <span className="arw" aria-hidden>→</span>
              </a>
              <a
                href={SITE.telegramChannel}
                target="_blank"
                rel="noopener"
                className="btn-line btn-line-dark mono justify-center border-white/25 text-xs text-white"
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
}: {
  loc: string;
  district: string;
  area: string;
  armo: string;
  plita: string;
  index: number;
}) {
  const [pos, setPos] = useState(52);

  return (
    <figure
      className="plate-dark ticks p-2"
      data-reveal
      style={{ ['--d' as any]: `${(index % 2) * 90}ms` }}
    >
      <div className="relative aspect-[4/3] select-none overflow-hidden bg-bp-950 sm:aspect-[3/2]">
        <img
          src={armo}
          alt={`Армокаркас плиты ${area}, объект в ${loc}`}
          loading="lazy"
          decoding="async"
          width={600}
          height={800}
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div
          className="absolute inset-0"
          style={{ clipPath: `inset(0 0 0 ${pos}%)` }}
        >
          <img
            src={plita}
            alt={`Залитая монолитная плита ${area}, объект в ${loc}`}
            loading="lazy"
            decoding="async"
            width={600}
            height={800}
            className="absolute inset-0 h-full w-full object-cover"
          />
        </div>

        {/* Линия раздела + рукоятка */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 w-px bg-signal"
          style={{ left: `${pos}%` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center border border-signal bg-bp-950/80 backdrop-blur-sm"
          style={{ left: `${pos}%` }}
        >
          <span className="mono text-[11px] text-signal">↔</span>
        </div>

        {/* Подписи стадий */}
        <span className="mono pointer-events-none absolute left-2 top-2 bg-bp-950/80 px-2 py-1 text-[10px] tracking-wider text-white">
          АРМОКАРКАС
        </span>
        <span className="mono pointer-events-none absolute right-2 top-2 bg-signal px-2 py-1 text-[10px] tracking-wider text-graphite">
          ПЛИТА ЗАЛИТА
        </span>

        <input
          type="range"
          min={0}
          max={100}
          step={1}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Объект в ${loc}: сдвиньте, чтобы сравнить армокаркас и залитую плиту`}
          className="stage-range absolute inset-0 h-full w-full opacity-0"
        />
      </div>

      <figcaption className="flex items-end justify-between gap-3 px-1 pb-1 pt-3">
        <div>
          <div className="text-base font-extrabold leading-tight text-white">{loc}</div>
          <div className="mono mt-1 text-[10px] leading-tight text-bp-text sm:text-[11px]">
            {district}
          </div>
        </div>
        <div className="mono flex-shrink-0 text-sm text-signal">{area}</div>
      </figcaption>
    </figure>
  );
}
