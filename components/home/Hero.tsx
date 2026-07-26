import { SITE } from '@/lib/site';

/**
 * ПЕРВЫЙ ЭКРАН.
 *
 * Решение, от которого пляшет весь редизайн: главное фото — НЕ сток и не
 * нейросеть, а реальный объект компании (Ропша, плита 120 м², фото из
 * сообщества «Ленбетон78»), поверх которого нарисованы инженерные выноски.
 * Человек, который боится ошибиться с фундаментом, за секунду видит две вещи:
 * «это их настоящая работа» и «эти люди понимают, что там внутри».
 *
 * Видео-фон убран намеренно: он был сгенерирован нейросетью и весил 0,65 МБ —
 * то есть платил байтами РФ-клиента за то, что не является доказательством.
 */

const SPECS = [
  { k: 'Бетон', v: 'М300 W6 F150' },
  { k: 'Арматура', v: 'А500С' },
  { k: 'Плита', v: '250–350 мм' },
  { k: 'Гарантия', v: '5 лет' },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-bp-950 text-white">
      <div aria-hidden className="absolute inset-0 grid-paper-dark" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(120% 90% at 12% 0%, rgba(27,58,92,0.55) 0%, rgba(7,17,25,0) 60%)',
        }}
      />

      <div className="container-x relative py-10 sm:py-14 lg:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_minmax(360px,480px)] lg:gap-14">
          {/* ── Текстовая колонка ─────────────────────────────────────── */}
          <div>
            <div className="eyebrow flex flex-wrap items-center gap-x-2 gap-y-1 text-signal">
              <span className="inline-block h-px w-6 bg-signal align-middle" />
              Санкт-Петербург · Ленинградская область
              <span className="text-bp-text opacity-60">— монолитные фундаменты</span>
            </div>

            <h1 className="display-1 mt-5 text-white">
              Фундамент под&nbsp;ключ
              <br />
              <span className="text-signal">в&nbsp;СПб и&nbsp;Ленобласти</span>
            </h1>

            <p className="lede mt-6 max-w-xl text-bp-text">
              Монолитная плита, ленточный и&nbsp;свайный фундамент. Считаем по&nbsp;грунту вашего
              участка, фиксируем цену в&nbsp;договоре и&nbsp;показываем каждый этап&nbsp;— от&nbsp;песчаной
              подушки до&nbsp;паспорта на&nbsp;бетон.
            </p>

            {/* Спецификация — вместо привычных «иконок с галочками» */}
            <dl className="mt-8 grid max-w-xl grid-cols-2 gap-px border border-bp-line bg-bp-line sm:grid-cols-4">
              {SPECS.map((s) => (
                <div key={s.k} className="bg-bp-950 px-3 py-3">
                  <dt className="eyebrow text-bp-text opacity-70">{s.k}</dt>
                  <dd className="mono mt-1.5 text-[13px] leading-tight text-white sm:text-sm">
                    {s.v}
                  </dd>
                </div>
              ))}
            </dl>

            {/* Точка заявки №1 */}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a href="#calc" className="btn-signal w-full justify-center sm:w-auto">
                Рассчитать стоимость
                <span className="arw" aria-hidden>
                  →
                </span>
              </a>
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="btn-line btn-line-dark mono w-full justify-center border-white/25 text-white sm:w-auto"
              >
                {SITE.phone}
              </a>
            </div>

            <p className="mono mt-4 text-[11px] leading-relaxed text-bp-text opacity-80 sm:text-xs">
              Выезд инженера и&nbsp;смета — бесплатно. Смета в&nbsp;течение 1&nbsp;рабочего дня после замера.
            </p>
          </div>

          {/* ── Фото объекта с выносками ──────────────────────────────── */}
          <figure className="plate-dark ticks p-2 lg:mt-0" data-reveal style={{ ['--d' as any]: '120ms' }}>
            <div className="relative aspect-[3/4] overflow-hidden bg-bp-900">
              <img
                src="/images/objects/ropsha-120-armo.jpg"
                alt="Армокаркас монолитной плиты 120 м² на объекте в Ропше, Ломоносовский район Ленобласти"
                width={600}
                height={800}
                fetchPriority="high"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />

              {/* Выноски. Тот же viewBox и тот же способ кадрирования (slice),
                  что и у фото — поэтому подписи держатся за свои детали
                  на любом размере экрана. */}
              <svg
                viewBox="0 0 600 800"
                preserveAspectRatio="xMidYMid slice"
                className="pointer-events-none absolute inset-0 h-full w-full"
                aria-hidden
              >
                <g stroke="#E8A33D" strokeWidth="1.6" fill="none">
                  {/* 1 — выпуски канализации */}
                  <g className="anno-line" style={{ ['--d' as any]: '300ms' }}>
                    <path d="M88 344 L88 250 L196 250" />
                    <circle cx="88" cy="344" r="5" />
                  </g>
                  {/* 2 — армирование */}
                  <g className="anno-line" style={{ ['--d' as any]: '520ms' }}>
                    <path d="M330 470 L330 396 L268 396" />
                    <circle cx="330" cy="470" r="5" />
                  </g>
                  {/* 3 — опалубка */}
                  <g className="anno-line" style={{ ['--d' as any]: '740ms' }}>
                    <path d="M512 566 L544 616" />
                    <circle cx="512" cy="566" r="5" />
                  </g>
                  {/* размерная линия по плите */}
                  <g className="anno-line" style={{ ['--d' as any]: '900ms' }}>
                    <path d="M60 706 L540 706" />
                    <path d="M60 694 L60 718" />
                    <path d="M540 694 L540 718" />
                  </g>
                </g>

                <g className="anno-label" style={{ ['--d' as any]: '300ms' }}>
                  <rect x="196" y="232" width="290" height="34" fill="#071119" opacity="0.82" />
                  <text
                    x="208"
                    y="255"
                    fill="#FFFFFF"
                    fontSize="19"
                    letterSpacing="1.4"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
                  >
                    ВЫПУСКИ КАНАЛИЗАЦИИ
                  </text>
                </g>

                <g className="anno-label" style={{ ['--d' as any]: '520ms' }}>
                  <rect x="18" y="378" width="250" height="34" fill="#071119" opacity="0.82" />
                  <text
                    x="30"
                    y="401"
                    fill="#FFFFFF"
                    fontSize="19"
                    letterSpacing="1.4"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
                  >
                    АРМИРОВАНИЕ А500С
                  </text>
                </g>

                <g className="anno-label" style={{ ['--d' as any]: '740ms' }}>
                  <rect x="326" y="620" width="252" height="34" fill="#071119" opacity="0.82" />
                  <text
                    x="338"
                    y="643"
                    fill="#FFFFFF"
                    fontSize="19"
                    letterSpacing="1.4"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
                  >
                    ОПАЛУБКА · УКОСИНЫ
                  </text>
                </g>

                <g className="anno-label" style={{ ['--d' as any]: '900ms' }}>
                  <rect x="212" y="722" width="176" height="34" fill="#E8A33D" />
                  <text
                    x="224"
                    y="745"
                    fill="#141A1F"
                    fontSize="19"
                    letterSpacing="1.4"
                    style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 500 }}
                  >
                    ПЛИТА 120 м²
                  </text>
                </g>
              </svg>
            </div>

            <figcaption className="mono flex flex-wrap items-center justify-between gap-x-3 gap-y-1 px-1 pt-3 text-[10px] leading-tight text-bp-text sm:text-[11px]">
              <span>ОБЪЕКТ · РОПША, ЛОМОНОСОВСКИЙ Р-Н</span>
              <a
                href={SITE.vk}
                target="_blank"
                rel="noopener"
                className="ulink text-signal"
              >
                фото объекта · ВК →
              </a>
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
