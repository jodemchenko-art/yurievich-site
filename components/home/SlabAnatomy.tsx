'use client';

import { useState } from 'react';
import SectionHead from './SectionHead';

/**
 * РАЗРЕЗ ПЛИТЫ — смысловой центр страницы.
 *
 * Клиент боится не «дорого», а «мне зальют не то, а я не пойму». Поэтому вместо
 * блока «наши преимущества» мы показываем то, что он покупает, слой за слоем,
 * и объясняем, зачем каждый слой нужен. Заявку тут не просим намеренно:
 * человек в режиме «разбираюсь» не готов оставлять телефон, а прерванное
 * обучение = уход со страницы.
 *
 * Рисунок — чистый SVG (около 6 КБ), без 3D и библиотек: на мобильном интернете
 * в Ленобласти это важнее, чем эффектность.
 */

/**
 * Цвета чертежа держим в одном месте: это «материалы» разреза, и когда меняется
 * палитра сайта, они должны меняться вместе с ней, а не жить своей жизнью
 * в тридцати атрибутах fill.
 */
const C = {
  sheet: '#FBFAF7',      // поле чертежа
  soil: '#DED7C9',       // грунт
  soilHatch: '#A79C88',
  soilLine: '#7A7265',
  sand: '#E2DCD0',       // песчано-щебёночная подушка
  sandDots: '#C4B7A4',
  membrane: '#2F2B25',   // геотекстиль + гидроизоляция
  membraneLine: '#1A1714',
  ins: '#EDE6D6',        // утепление
  insHatch: '#C4B7A4',
  insLine: '#9A8F7C',
  concrete: '#DDDFDC',   // бетон — серый, а не бежевый
  concreteDots: '#C7C9C6',
  concreteLine: '#6E7472',
  rebar: '#3A3E3C',      // арматура
  form: '#C4B7A4',       // опалубка — песок
  pipe: '#CFD6D9',       // выпуски коммуникаций
  pipeLine: '#545A5E',
  pipeCap: '#2F2B25',
  accent: '#1E44AE',     // подсветка активного слоя — единственный синий
  ink: '#191713',        // размерные линии и подписи
  mute: '#5A554D',
};

type Layer = {
  n: string;
  title: string;
  spec: string;
  why: string;
};

const LAYERS: Layer[] = [
  {
    n: '01',
    title: 'Выемка грунта, уплотнение основания',
    spec: 'снимаем растительный слой',
    why: 'Плита не держится «на траве»: слабое основание — главная причина неравномерной осадки и трещин по стенам.',
  },
  {
    n: '02',
    title: 'Песчано-щебёночная подушка',
    spec: 'уплотнение слоями',
    why: 'Выравнивает основание и распределяет нагрузку от дома. Толщину подушки подбираем по грунту участка.',
  },
  {
    n: '03',
    title: 'Геотекстиль и гидроизоляция',
    spec: 'разделение слоёв + отсечка влаги',
    why: 'Не даёт подушке смешаться с грунтом и отсекает капиллярную влагу от бетона. На высоком УГВ добавляем дренаж.',
  },
  {
    n: '04',
    title: 'Утепление — по проекту',
    spec: 'нужно не всем',
    why: 'Утепление под плитой и утеплённая отмостка нужны не на каждом участке. Решаем по проекту дома и грунту, а не «чтобы дороже».',
  },
  {
    n: '05',
    title: 'Армокаркас А500С',
    spec: 'сетки + защитный слой бетона',
    why: 'Бетон работает на сжатие, арматура — на растяжение. Схему армирования считаем под вес конкретного дома.',
  },
  {
    n: '06',
    title: 'Бетон М300 W6 F150',
    spec: 'плита 250–350 мм',
    why: 'Только заводской, с паспортом качества на каждую машину. W6 — водонепроницаемость, F150 — морозостойкость. Проектную прочность набирает 28 дней.',
  },
  {
    n: '07',
    title: 'Выпуски коммуникаций',
    spec: 'канализация, ввод воды',
    why: 'Закладываем до заливки. Забыли на этом этапе — потом только штробить готовую плиту, а это уже минус к её работе.',
  },
];

export default function SlabAnatomy() {
  const [active, setActive] = useState<number | null>(null);
  const current = active === null ? null : LAYERS[active];

  return (
    <section id="razrez" data-plane="paper" className="relative overflow-hidden bg-paper">
      <div aria-hidden className="absolute inset-0 grid-paper-lg" />

      <div className="container-x relative py-16 md:py-24">
        <SectionHead
          index="01"
          label="Разрез · что под домом"
          title={
            <>
              Вы платите не&nbsp;за&nbsp;«куб бетона».
              <br className="hidden sm:block" /> Вот из&nbsp;чего состоит плита
            </>
          }
          lede="Наведите или нажмите на слой — расскажем, зачем он нужен и что бывает, когда на нём экономят. Это тот же разрез, который мы рисуем заказчику на бумаге при замере."
        />

        <div className="mt-10 grid gap-8 lg:mt-14 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12">
          {/* ── Чертёж ─────────────────────────────────────────────── */}
          {/* data-track: пока блок проходит через экран, движок кладёт в --p
              прогресс 0..1, и плита СОБИРАЕТСЯ слой за слоем по мере прокрутки.
              Человек не читает про технологию — он видит, как её выполняют. */}
          <div className="plate ticks p-3 sm:p-5" data-reveal data-track>
            <svg
              viewBox="0 0 720 470"
              className="h-auto w-full"
              role="img"
              aria-label="Разрез монолитной плитного фундамента: основание, песчано-щебёночная подушка, гидроизоляция, утепление, армокаркас, бетон, выпуски коммуникаций"
            >
              <defs>
                <pattern id="pt-soil" width="14" height="14" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="14" stroke={C.soilHatch} strokeWidth="1.2" />
                </pattern>
                <pattern id="pt-sand" width="12" height="12" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="1.3" fill={C.sandDots} />
                  <circle cx="9" cy="8" r="1.1" fill={C.sandDots} />
                </pattern>
                <pattern id="pt-ins" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
                  <line x1="0" y1="0" x2="0" y2="10" stroke={C.insHatch} strokeWidth="1.1" />
                </pattern>
                <pattern id="pt-concrete" width="16" height="16" patternUnits="userSpaceOnUse">
                  <circle cx="4" cy="5" r="1.5" fill={C.concreteDots} />
                  <circle cx="12" cy="11" r="2" fill={C.concreteDots} />
                  <circle cx="9" cy="3" r="1.1" fill={C.concreteDots} />
                </pattern>
              </defs>

              {/* небо / воздух */}
              <rect x="0" y="0" width="720" height="470" fill={C.sheet} />

              {/* грунт по бокам котлована */}
              <Group dim={active !== null && active !== 0} start={0.05}>
                <path d="M0 296 H78 V440 H0 Z" fill={C.soil} />
                <path d="M0 296 H78 V440 H0 Z" fill="url(#pt-soil)" />
                <path d="M642 296 H720 V440 H642 Z" fill={C.soil} />
                <path d="M642 296 H720 V440 H642 Z" fill="url(#pt-soil)" />
                <path d="M78 440 H642 V400 H78 Z" fill={C.soil} />
                <path d="M78 440 H642 V400 H78 Z" fill="url(#pt-soil)" />
                <path
                  d="M0 296 H78 V400 H642 V296 H720"
                  fill="none"
                  stroke={C.soilLine}
                  strokeWidth="1.4"
                />
                {active === 0 && <rect x="78" y="400" width="564" height="40" fill="none" stroke={C.accent} strokeWidth="2.5" />}
              </Group>

              {/* песчано-щебёночная подушка */}
              <Group dim={active !== null && active !== 1} start={0.14}>
                <rect x="78" y="344" width="564" height="56" fill={C.sand} />
                <rect x="78" y="344" width="564" height="56" fill="url(#pt-sand)" />
                <rect x="78" y="344" width="564" height="56" fill="none" stroke={C.soilLine} strokeWidth="1.2" />
                {active === 1 && <rect x="78" y="344" width="564" height="56" fill="none" stroke={C.accent} strokeWidth="2.5" />}
              </Group>

              {/* геотекстиль + гидроизоляция */}
              <Group dim={active !== null && active !== 2} start={0.22}>
                <rect x="78" y="330" width="564" height="14" fill={C.membrane} />
                <rect x="78" y="330" width="564" height="14" fill="none" stroke={C.membraneLine} strokeWidth="1" />
                {active === 2 && <rect x="76" y="328" width="568" height="18" fill="none" stroke={C.accent} strokeWidth="2.5" />}
              </Group>

              {/* утепление по проекту */}
              <Group dim={active !== null && active !== 3} start={0.29}>
                <rect x="78" y="298" width="564" height="32" fill={C.ins} />
                <rect x="78" y="298" width="564" height="32" fill="url(#pt-ins)" />
                <rect x="78" y="298" width="564" height="32" fill="none" stroke={C.insLine} strokeWidth="1.2" />
                {active === 3 && <rect x="78" y="298" width="564" height="32" fill="none" stroke={C.accent} strokeWidth="2.5" />}
              </Group>

              {/* бетонная плита */}
              <Group dim={active !== null && active !== 5} start={0.36}>
                <rect x="78" y="170" width="564" height="128" fill={C.concrete} />
                <rect x="78" y="170" width="564" height="128" fill="url(#pt-concrete)" />
                <rect x="78" y="170" width="564" height="128" fill="none" stroke={C.concreteLine} strokeWidth="1.6" />
                {active === 5 && <rect x="78" y="170" width="564" height="128" fill="none" stroke={C.accent} strokeWidth="3" />}
              </Group>

              {/* армокаркас — две сетки в теле плиты */}
              <Group dim={active !== null && active !== 4} start={0.43}>
                <line x1="92" y1="204" x2="628" y2="204" stroke={C.rebar} strokeWidth="2" />
                <line x1="92" y1="264" x2="628" y2="264" stroke={C.rebar} strokeWidth="2" />
                {Array.from({ length: 18 }).map((_, i) => (
                  <g key={i}>
                    <circle cx={100 + i * 30} cy="204" r="4.4" fill={C.sheet} stroke={C.rebar} strokeWidth="1.6" />
                    <circle cx={100 + i * 30} cy="264" r="4.4" fill={C.sheet} stroke={C.rebar} strokeWidth="1.6" />
                    <line
                      x1={100 + i * 30}
                      y1="204"
                      x2={100 + i * 30}
                      y2="264"
                      stroke={C.rebar}
                      strokeWidth="0.8"
                      opacity="0.45"
                    />
                  </g>
                ))}
                {active === 4 && (
                  <rect x="86" y="190" width="548" height="88" fill="none" stroke={C.accent} strokeWidth="2.5" strokeDasharray="8 6" />
                )}
              </Group>

              {/* опалубка */}
              <g>
                <rect x="64" y="164" width="14" height="140" fill={C.form} stroke={C.soilLine} strokeWidth="1.2" />
                <rect x="642" y="164" width="14" height="140" fill={C.form} stroke={C.soilLine} strokeWidth="1.2" />
              </g>

              {/* выпуски коммуникаций */}
              <Group dim={active !== null && active !== 6} start={0.5}>
                <rect x="520" y="120" width="26" height="276" fill={C.pipe} stroke={C.pipeLine} strokeWidth="1.6" />
                <rect x="514" y="112" width="38" height="12" fill={C.pipeCap} />
                {active === 6 && <rect x="514" y="112" width="38" height="288" fill="none" stroke={C.accent} strokeWidth="2.5" />}
              </Group>

              {/* размерная линия толщины плиты */}
              <g stroke={C.ink} strokeWidth="1.2" fill="none">
                <line x1="678" y1="170" x2="678" y2="298" />
                <line x1="670" y1="170" x2="686" y2="170" />
                <line x1="670" y1="298" x2="686" y2="298" />
              </g>
              <text
                x="672"
                y="152"
                textAnchor="end"
                fontSize="20"
                fill={C.ink}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
              >
                250–350 мм
              </text>

              {/* подпись уровня земли */}
              <text
                x="8"
                y="288"
                fontSize="17"
                fill={C.mute}
                style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
              >
                УРОВЕНЬ ЗЕМЛИ
              </text>
            </svg>

            {/* Пояснение под чертежом — меняется вместе с выбранным слоем */}
            <div className="datum mt-4 min-h-[104px] pt-4 sm:min-h-[92px]">
              {current ? (
                <>
                  <div className="eyebrow text-inkmute">
                    Слой {current.n} · {current.spec}
                  </div>
                  <div className="mt-2 text-base font-bold leading-snug text-graphite">
                    {current.title}
                  </div>
                  <p className="mt-1.5 text-sm leading-relaxed text-inkmute">{current.why}</p>
                </>
              ) : (
                <p className="text-sm leading-relaxed text-inkmute">
                  <span className="mono text-sand">↓</span> Выберите слой в списке —
                  здесь появится, зачем он нужен и чем оборачивается экономия на нём.
                  Такой же разрез мы рисуем от руки на замере.
                </p>
              )}
            </div>
          </div>

          {/* ── Список слоёв ───────────────────────────────────────── */}
          <div data-reveal style={{ ['--d' as any]: '100ms' }}>
            <ol className="border-t border-hair">
              {LAYERS.map((l, i) => {
                const on = active === i;
                return (
                  <li key={l.n}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onFocus={() => setActive(i)}
                      onClick={() => setActive(on ? null : i)}
                      aria-pressed={on}
                      className={`flex w-full items-baseline gap-4 border-b border-hair px-2 py-3.5 text-left transition-colors ${
                        on ? 'bg-paper0 shadow-[inset_2px_0_0_0_#1E44AE]' : 'hover:bg-paper0/70'
                      }`}
                    >
                      <span
                        className={`mono text-xs ${on ? 'text-signal' : 'text-inkmute'}`}
                      >
                        {l.n}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span
                          className={`block text-[15px] font-bold leading-snug ${
                            on ? 'text-graphite' : 'text-graphite/85'
                          }`}
                        >
                          {l.title}
                        </span>
                        <span className="mono mt-1 block text-[11px] text-inkmute">{l.spec}</span>
                      </span>
                      <span
                        aria-hidden
                        className={`mono text-xs transition-transform ${
                          on ? 'translate-x-0 text-signal' : '-translate-x-1 text-sand'
                        }`}
                      >
                        →
                      </span>
                    </button>
                  </li>
                );
              })}
            </ol>

            <p className="mt-6 text-sm leading-relaxed text-inkmute">
              Толщину плиты, шаг арматуры и подушку считаем под конкретный дом и грунт.
              Если на вашем участке хватит более простого решения — скажем прямо:
              лишний бетон не делает фундамент лучше, он делает его дороже.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Слой чертежа.
 *
 * Внешняя группа отвечает за СБОРКУ по скроллу (класс .bp-layer читает --p из движка
 * и свой момент старта --s), внутренняя — за приглушение неактивных слоёв при выборе.
 * Две группы, а не одна, потому что прозрачности вложенных <g> перемножаются:
 * иначе подсветка слоя ломала бы анимацию сборки.
 */
function Group({
  dim,
  start,
  children,
}: {
  dim: boolean;
  start: number;
  children: React.ReactNode;
}) {
  return (
    <g className="bp-layer" style={{ ['--s' as any]: String(start) }}>
      <g style={{ opacity: dim ? 0.28 : 1, transition: 'opacity 0.25s ease' }}>{children}</g>
    </g>
  );
}
