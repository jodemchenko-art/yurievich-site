import Quiz from './Quiz';

export default function QuizSection() {
  return (
    <section id="calc" className="section bg-brand-sand">
      <div className="container-x">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div>
            <span className="text-brand-red font-bold text-sm uppercase tracking-wide">Расчёт</span>
            <h2 className="section-title mt-2">
              Узнайте стоимость{' '}
              <span className="text-brand-red">вашего фундамента</span>{' '}
              за 1 минуту
            </h2>
            <p className="section-sub max-w-xl">
              5 простых вопросов — пришлём детальную смету в Telegram или WhatsApp.
              Цифры реальные, с разбивкой по позициям и без скрытых платежей.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                ['🎯', 'Цифры с разбивкой по позициям', 'Каждая строка сметы — реальная цена с завода'],
                ['📞', 'Юрий перезвонит в течение часа', 'Старший брат сам обсудит вопросы по проекту'],
                ['🚫', 'Без спама и навязчивых звонков', 'Один звонок, после — только по делу'],
              ].map(([icon, title, desc]) => (
                <li key={title} className="flex gap-4">
                  <div className="flex-shrink-0 text-3xl">{icon}</div>
                  <div>
                    <div className="font-bold text-brand-ink">{title}</div>
                    <div className="text-sm text-brand-mute mt-1">{desc}</div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Quiz />
          </div>
        </div>
      </div>
    </section>
  );
}
