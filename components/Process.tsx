const STEPS = [
  {
    n: '01',
    title: 'Заявка и бесплатный выезд',
    desc: 'Инженер выезжает на ваш участок в СПб или ЛО, делает замер, обсуждает задачу. Это бесплатно.',
    time: '1-3 дня',
  },
  {
    n: '02',
    title: 'Подробная смета за 1 день',
    desc: 'Каждая позиция расписана по реальным ценам с завода. Никаких «работа + материалы» одной строкой.',
    time: '1 день',
  },
  {
    n: '03',
    title: 'Договор с фикс-ценой',
    desc: 'Стоимость закрепляется в договоре. Не растёт по ходу работ. Поэтапная оплата только за принятые работы.',
    time: '1 день',
  },
  {
    n: '04',
    title: 'Стройка с фотоотчётом',
    desc: 'Каждый этап документируем. Вы видите процесс в реальном времени — в нашем Telegram-чате с заказчиком.',
    time: '10-90 дней',
  },
  {
    n: '05',
    title: 'Сдача с актом и гарантией',
    desc: 'Акт приёмки, гарантийный талон на 5 лет, паспорта на материалы. Всё в руки.',
    time: '1 день',
  },
];

export default function Process() {
  return (
    <section id="process" className="section">
      <div className="container-x">
        <div className="max-w-2xl">
          <span className="text-brand-red font-bold text-sm uppercase tracking-wide">Процесс</span>
          <h2 className="section-title mt-2">
            Прозрачный путь от заявки <span className="text-brand-red">до ключей</span>
          </h2>
          <p className="section-sub">
            Каждый шаг чёткий. Вы всегда знаете, где сейчас стройка и сколько до конца.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-5">
          {STEPS.map((s) => (
            <div
              key={s.n}
              className="relative flex flex-col rounded-2xl border-2 border-brand-line bg-white p-6 hover:border-brand-red transition"
            >
              <div className="text-4xl font-extrabold text-brand-red/20 leading-none">{s.n}</div>
              <h3 className="mt-4 font-bold text-base leading-tight">{s.title}</h3>
              <p className="mt-3 text-sm text-brand-mute leading-relaxed flex-1">{s.desc}</p>
              <div className="mt-4 inline-flex self-start text-xs font-bold bg-brand-sand text-brand-ink px-2.5 py-1 rounded">
                ⏱ {s.time}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
