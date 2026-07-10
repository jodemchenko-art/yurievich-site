import { SITE } from '@/lib/site';

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-brand-ink text-white min-h-[88vh] flex items-center">
      {/* Photo background (виден до/вместо видео, с медленным Ken Burns) */}
      <div
        aria-hidden
        className="hero-kenburns absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/stock/p37733181.jpg')" }}
      />

      {/* Video slot — drop hero.mp4 into public/video/ to activate */}
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        poster="/images/stock/p37733181.jpg"
        className="hero-video absolute inset-0 h-full w-full object-cover"
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Heavy dark overlay — make text always readable */}
      <div
        aria-hidden
        className="absolute inset-0 bg-black/70"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-black/30 pointer-events-none"
      />

      <div className="container-x relative z-10 py-16 sm:py-20 md:py-28 lg:py-32 w-full">
        <div className="max-w-3xl">
          {/* Trust pill */}
          <div className="inline-flex items-center gap-2 rounded-full bg-white/[0.1] backdrop-blur px-3 py-1.5 md:px-4 md:py-2 text-[11px] sm:text-xs md:text-sm font-medium mb-6 md:mb-8 ring-1 ring-white/15">
            <span className="flex h-1.5 w-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
            <span className="text-white/95 whitespace-nowrap">★ {SITE.rating} · {SITE.reviewsCount} отзывов · {SITE.projectsCount} объектов · Партнёр ЛСР</span>
          </div>

          {/* Headline — single tone, single weight, tighter sizing */}
          <h1 className="text-[34px] leading-[1.08] sm:text-5xl sm:leading-[1.05] md:text-6xl lg:text-[68px] lg:leading-[1.02] font-extrabold tracking-[-0.01em] text-white">
            Фундамент под&nbsp;ключ в&nbsp;СПб и&nbsp;Ленобласти
          </h1>

          {/* Sub-headline — commercial keyword spread: плита / лента / сваи */}
          <p className="mt-4 md:mt-5 text-base sm:text-lg md:text-xl text-white/90 font-medium max-w-2xl">
            Монолитная плита, ленточный и&nbsp;свайный фундамент — по&nbsp;фиксированной цене в&nbsp;договоре, с&nbsp;гарантией 5&nbsp;лет.
          </p>

          {/* Slogan */}
          <p className="mt-3 text-base sm:text-lg text-white/85 italic font-light max-w-2xl">
            «Строим как себе. И&nbsp;объясняем — как для&nbsp;себя».
          </p>

          {/* Primary UTP — pay-by-stage */}
          <div className="mt-6 md:mt-8 flex items-start gap-3 rounded-xl bg-amber-400/15 ring-1 ring-amber-300/40 px-4 py-3.5 md:px-5 md:py-4 backdrop-blur-sm max-w-2xl">
            <span className="text-amber-300 text-lg md:text-xl mt-0.5 flex-shrink-0">✋</span>
            <div className="min-w-0">
              <div className="font-bold text-amber-100 text-xs sm:text-sm md:text-base uppercase tracking-wider leading-tight">
                Платите только за&nbsp;принятые этапы
              </div>
              <div className="text-white/85 text-xs sm:text-sm md:text-base mt-1 leading-relaxed">
                Без предоплаты на&nbsp;работу. Аванс — только на&nbsp;материалы, по&nbsp;чекам с&nbsp;завода.
              </div>
            </div>
          </div>

          {/* Trust badges row */}
          <div className="mt-6 md:mt-8 flex flex-wrap gap-x-5 gap-y-2.5 text-xs sm:text-sm md:text-base text-white/85">
            <span className="flex items-center gap-1.5"><CheckIcon /> Договор + фикс-цена</span>
            <span className="flex items-center gap-1.5"><CheckIcon /> Гарантия {SITE.warrantyYears} лет</span>
            <span className="flex items-center gap-1.5"><CheckIcon /> Бесплатный замер</span>
            <span className="flex items-center gap-1.5"><CheckIcon /> Зимняя заливка</span>
          </div>

          {/* CTAs */}
          <div className="mt-8 md:mt-10 flex flex-col sm:flex-row gap-3 sm:gap-4">
            <a href="#calc" className="btn-primary !text-base md:!text-lg !py-4 md:!py-5 group">
              Рассчитать стоимость за&nbsp;1 день
              <span className="transition group-hover:translate-x-1">→</span>
            </a>
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 bg-white/[0.06] backdrop-blur px-6 py-4 md:py-5 text-base md:text-lg font-bold text-white hover:bg-white hover:text-brand-ink transition"
            >
              📞 {SITE.phone}
            </a>
          </div>
        </div>

        {/* Bottom stats row */}
        <div className="mt-12 md:mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 pt-6 md:pt-8 border-t border-white/15">
          <Stat value={SITE.projectsCount.toString()} label="завершённых объектов" />
          <Stat value={`${SITE.rating} ★`} label={`${SITE.reviewsCount} отзывов на Авито`} />
          <Stat value={`${SITE.warrantyYears} лет`} label="гарантия конструктива" />
          <Stat value="1 день" label="срок подготовки сметы" />
        </div>
      </div>
    </section>
  );
}

function CheckIcon() {
  return (
    <span className="flex h-4 w-4 md:h-5 md:w-5 items-center justify-center rounded-full bg-white/15 text-white flex-shrink-0">
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
        <path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">{value}</div>
      <div className="text-[11px] sm:text-xs md:text-sm text-white/70 mt-1">{label}</div>
    </div>
  );
}
