import SectionHead from './SectionHead';

/**
 * ПРОЦЕСС.
 *
 * Сделан как ведомость этапов, а не как «5 красивых шагов»: в каждой строке
 * видно, что делаем мы, что требуется от заказчика и чем этап закрывается.
 * Человек, который боится «отдам деньги и пропадут», получает главное —
 * предсказуемость: он заранее знает, где будет находиться в каждый момент.
 */

const STEPS = [
  {
    n: '01',
    title: 'Заявка и выезд инженера',
    us: 'Приезжаем на участок, смотрим грунт и подъезд для техники, замеряем пятно застройки.',
    you: 'Показать участок и проект дома, если он уже есть.',
    time: '1–3 дня',
    money: 'Бесплатно',
  },
  {
    n: '02',
    title: 'Смета по позициям',
    us: 'Считаем толщину плиты, армирование, объём бетона и работ. Каждая позиция — отдельной строкой.',
    you: 'Прочитать и задать вопросы по любой строке.',
    time: '1 рабочий день',
    money: 'Бесплатно',
  },
  {
    n: '03',
    title: 'Договор с фиксированной ценой',
    us: 'Фиксируем цену, сроки, этапы и порядок приёмки. Цена не меняется без вашей подписи.',
    you: 'Подписать договор и график работ.',
    time: '1 день',
    money: 'Аванс — только на материалы, по чекам с завода',
  },
  {
    n: '04',
    title: 'Работы с фотоотчётом',
    us: 'Земляные работы, подушка, гидроизоляция, армокаркас, заливка и уход за бетоном. Фото каждого этапа.',
    you: 'Смотреть отчёты, приезжать в любой момент без предупреждения.',
    time: 'плита 100 м² — 10–14 дней',
    money: 'Оплата по принятым этапам',
  },
  {
    n: '05',
    title: 'Сдача объекта',
    us: 'Акт приёмки, гарантийный талон на 5 лет, заводские паспорта на бетон и арматуру.',
    you: 'Принять работу и забрать документы.',
    time: '1 день',
    money: 'Полный расчёт после приёмки',
  },
];

export default function WorkflowBlock() {
  return (
    <section id="process" className="relative overflow-hidden bg-paper">
      <div aria-hidden className="absolute inset-0 grid-paper" />

      <div className="container-x relative py-16 md:py-24">
        <SectionHead
          index="06"
          label="Порядок работ"
          title={<>Что происходит от&nbsp;звонка до&nbsp;готовой плиты</>}
          lede="Пять этапов, в каждом видно вашу роль и нашу. Деньги двигаются только вслед за принятой работой — это и есть страховка заказчика на стройке."
        />

        <div className="mt-10 border-t border-hair md:mt-14">
          {STEPS.map((s, i) => (
            <article
              key={s.n}
              className="grid gap-x-8 gap-y-3 border-b border-hair py-6 md:grid-cols-12 md:py-7"
              data-reveal
              style={{ ['--d' as any]: `${i * 70}ms` }}
            >
              <div className="flex items-baseline gap-4 md:col-span-4">
                <span className="mono text-xs text-signal-dark">{s.n}</span>
                <h3 className="text-lg font-extrabold leading-tight text-graphite md:text-xl">
                  {s.title}
                </h3>
              </div>

              <div className="md:col-span-4">
                <div className="eyebrow text-brand-mute">Делаем мы</div>
                <p className="mt-2 text-sm leading-relaxed text-graphite">{s.us}</p>
              </div>

              <div className="md:col-span-2">
                <div className="eyebrow text-brand-mute">От вас</div>
                <p className="mt-2 text-sm leading-relaxed text-brand-mute">{s.you}</p>
              </div>

              <div className="md:col-span-2">
                <div className="eyebrow text-brand-mute">Срок · деньги</div>
                <p className="mono mt-2 text-[12px] leading-relaxed text-graphite">{s.time}</p>
                <p className="mono mt-1 text-[12px] leading-relaxed text-signal-dark">{s.money}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 grid gap-px border border-hair bg-hair md:grid-cols-3">
          {[
            {
              t: 'Без предоплаты за работу',
              d: 'Аванс идёт только на материалы и подтверждается чеками с завода.',
            },
            {
              t: 'Оплата за принятые этапы',
              d: 'Этап не принят — не оплачивается. Полный расчёт только после акта приёмки.',
            },
            {
              t: 'Цена в договоре не растёт',
              d: 'Доп. работы возможны только вашим решением и оформляются допсоглашением.',
            },
          ].map((x, i) => (
            <div key={x.t} className="bg-white p-6" data-reveal style={{ ['--d' as any]: `${i * 80}ms` }}>
              <div className="text-base font-extrabold leading-snug text-graphite">{x.t}</div>
              <p className="mt-2 text-sm leading-relaxed text-brand-mute">{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
