const BROTHERS = [
  {
    name: 'Юрий',
    role: 'Руководитель проекта',
    desc: 'Ведёт клиента от первого звонка до сдачи. Договор, согласование сметы, координация работ, финальная приёмка объекта.',
    photo: '/images/brothers/yuri.jpg',
    shade: 'from-slate-700 to-slate-900',
  },
  {
    name: 'Валерий',
    role: 'Прораб · производитель работ',
    desc: 'На объекте каждый день. Контроль выполнения, бригада, технология заливки и армирования, соблюдение сроков.',
    photo: '/images/brothers/valery.jpg',
    shade: 'from-zinc-700 to-zinc-900',
  },
  {
    name: 'Евгений',
    role: 'Технадзор · снабжение',
    desc: 'Материалы и техника: бетон М300, арматура А500С, газобетон ЛСР. Закупки по чекам с завода, контроль по нормам.',
    photo: '/images/brothers/evgeniy.jpg',
    shade: 'from-neutral-700 to-neutral-900',
  },
];

export default function Brothers() {
  return (
    <section id="brothers" className="section bg-brand-ink text-white relative overflow-hidden">
      {/* Subtle texture */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(45deg, transparent, transparent 30px, rgba(255,255,255,0.6) 30px, rgba(255,255,255,0.6) 31px)',
        }}
      />

      <div className="container-x relative">
        <div className="max-w-2xl">
          <span className="text-brand-accent font-bold text-sm uppercase tracking-[0.2em]" style={{ color: '#7BA7D9' }}>
            О братьях
          </span>
          <h2 className="section-title mt-3 text-white">
            Работают сами хозяева — <span className="text-white/60">3 родных брата</span>
          </h2>
          <p className="section-sub text-white/70 leading-relaxed">
            Мы не нанимаем прорабов и не передаём объекты субподрядчикам.
            Каждый фундамент и каждый дом строит наша семья. Для нас имя — важнее быстрой прибыли.
          </p>
        </div>

        <div className="mt-12 md:mt-16 grid gap-6 md:grid-cols-3">
          {BROTHERS.map((b) => (
            <article
              key={b.name}
              className="rounded-3xl bg-white/[0.04] border border-white/10 p-6 md:p-8 hover:bg-white/[0.07] transition flex flex-col"
            >
              {/* Portrait photo */}
              <div
                className={`relative aspect-square w-full max-w-[280px] mx-auto rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br ${b.shade}`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${b.photo}')` }}
                />
              </div>

              <h3 className="mt-6 text-center text-2xl md:text-3xl font-extrabold text-white">{b.name}</h3>
              <div className="mt-1 text-center text-xs md:text-sm font-semibold uppercase tracking-[0.15em]" style={{ color: '#7BA7D9' }}>
                {b.role}
              </div>
              <p className="mt-4 text-center text-sm md:text-base text-white/70 leading-relaxed flex-1">
                {b.desc}
              </p>
            </article>
          ))}
        </div>

        {/* Closing quote */}
        <div className="mt-14 md:mt-16 max-w-3xl mx-auto text-center">
          <p className="text-xl md:text-2xl text-white/85 font-light leading-relaxed italic">
            «Мы строим не на продажу, а на репутацию. Каждый дом — это потом отзыв
            родственникам и соседям. Поэтому халтурить нельзя — это потеря рынка».
          </p>
          <div className="mt-4 text-sm text-white/50 tracking-wide">— Юрий, лицо компании</div>
        </div>
      </div>
    </section>
  );
}
