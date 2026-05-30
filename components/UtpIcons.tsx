const UTPS = [
  {
    icon: '📋',
    title: 'Фикс-цена в договоре',
    desc: 'Стоимость закрепляем в договоре. Не вырастет в процессе — это наша главная гарантия для вас.',
  },
  {
    icon: '🛡️',
    title: 'Гарантия 5 лет',
    desc: 'На весь конструктив, с актом приёмки и гарантийным талоном. Серьёзно отвечаем за свою работу.',
  },
  {
    icon: '👨‍👨‍👦',
    title: 'Работают хозяева',
    desc: '3 родных брата. Не передаём объекты прорабам и субподрядчикам — каждый дом строим сами.',
  },
  {
    icon: '🏗️',
    title: '239 объектов',
    desc: 'Реальные фото и видео в портфолио. Можем свозить на ближайший действующий объект.',
  },
];

export default function UtpIcons() {
  return (
    <section className="py-12 md:py-16 bg-brand-sand border-b border-brand-line">
      <div className="container-x">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {UTPS.map((u) => (
            <div
              key={u.title}
              className="bg-white rounded-2xl p-5 md:p-6 border border-brand-line/60 hover:border-brand-red/30 transition shadow-sm hover:shadow-md"
            >
              <div className="text-3xl md:text-4xl mb-3">{u.icon}</div>
              <h3 className="font-bold text-base md:text-lg text-brand-ink leading-tight">
                {u.title}
              </h3>
              <p className="text-xs md:text-sm text-brand-mute mt-2 leading-relaxed">
                {u.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
