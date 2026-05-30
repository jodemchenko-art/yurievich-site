export default function LsrBanner() {
  return (
    <section className="py-16 md:py-20 bg-white border-y border-brand-line">
      <div className="container-x">
        <div className="grid lg:grid-cols-5 gap-10 items-center">
          {/* LSR Logo block */}
          <div className="lg:col-span-2">
            <div className="aspect-[3/1] max-w-md rounded-2xl bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center p-8 shadow-lg">
              <div className="text-center text-white">
                <div className="text-4xl md:text-5xl font-extrabold tracking-tight">ЛСР</div>
                <div className="text-xs md:text-sm uppercase tracking-[0.3em] mt-1 opacity-80">
                  Газобетон
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            <span className="inline-flex items-center gap-2 bg-brand-sand text-brand-ink font-semibold px-3 py-1 rounded-full text-xs uppercase tracking-wider">
              <span className="text-brand-red">●</span> Официальный партнёр
            </span>
            <h2 className="mt-4 text-2xl md:text-4xl font-extrabold leading-tight">
              Дома строим напрямую с завода ЛСР Газобетон
            </h2>
            <p className="mt-4 text-brand-mute text-base md:text-lg leading-relaxed">
              Без накрутки посредников. Каждая партия газобетона — с паспортом качества,
              геометрия блоков точная, теплопроводность стабильная. Цена для вас — заводская.
            </p>

            <div className="mt-6 grid grid-cols-3 gap-4">
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-brand-red">D400</div>
                <div className="text-xs text-brand-mute">плотность</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-brand-red">B2,5</div>
                <div className="text-xs text-brand-mute">класс прочности</div>
              </div>
              <div>
                <div className="text-xl md:text-2xl font-extrabold text-brand-red">±1 мм</div>
                <div className="text-xs text-brand-mute">геометрия блока</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
