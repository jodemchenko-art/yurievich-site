'use client';

import { useState } from 'react';

const FAQ = [
  {
    q: 'Сколько стоит фундамент?',
    a: 'Точную стоимость считаем бесплатно за 1 день. На цену влияет тип фундамента, размер дома, грунт и доставка. После замера присылаем подробную смету с разбивкой по позициям и фиксируем её в договоре.',
  },
  {
    q: 'Можно ли строить зимой?',
    a: 'Да, льём круглый год. У нас отлажена технология зимнего бетонирования: противоморозные добавки, прогрев бетона, утепление опалубки. Качество не страдает, скорость может быть чуть ниже.',
  },
  {
    q: 'Какую гарантию даёте?',
    a: '5 лет на конструктив. Всё прописано в гарантийном талоне, который выдаём при сдаче вместе с актом приёмки и паспортами на материалы.',
  },
  {
    q: 'Бывают ли допработы во время стройки?',
    a: 'По нашей инициативе — нет. Цена в договоре фиксирована. Если изменения по вашей инициативе (поменяли проект, добавили этаж) — оформляем доп. соглашением с вашим согласием. Без вашей подписи цена не растёт.',
  },
  {
    q: 'Какой бетон используете?',
    a: 'Только заводской, с паспортом качества. Для плиты — М300 W6 F150, арматура А500С. На месте показываем паспорт каждой машины. Никакого «своего замеса в бетономешалке».',
  },
  {
    q: 'Можете показать прошлые работы?',
    a: 'Да, в Telegram-канале @Yurastroitdoma — фото и видео с 239 объектов. Также можем свозить вас на ближайший действующий объект и показать технологию своими глазами.',
  },
  {
    q: 'Сколько времени занимает фундамент?',
    a: 'Плита 100 м² — 10-14 рабочих дней. Ленточный — 7-10. Дом из газобетона под ключ — 3-6 месяцев. Точные сроки прописываем в договоре с пенями за просрочку с нашей стороны.',
  },
  {
    q: 'Как оплата?',
    a: 'Поэтапно: аванс на материалы под подписанный договор → оплата по принятым этапам (фундамент, коробка, кровля). Полный расчёт — только после акта приёмки.',
  },
];

export default function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="section">
      <div className="container-x">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-brand-red font-bold text-sm uppercase tracking-wide">Вопросы</span>
            <h2 className="section-title mt-2">Частые вопросы</h2>
            <p className="section-sub">
              Если ваш вопрос не здесь — напишите в WhatsApp или Telegram, Юрий ответит лично.
            </p>
          </div>

          <div className="space-y-3">
            {FAQ.map((item, i) => (
              <article
                key={i}
                className={`rounded-2xl border-2 transition ${
                  open === i ? 'border-brand-red bg-white shadow-lg' : 'border-brand-line bg-white hover:border-brand-mute'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpen(open === i ? null : i)}
                  className="w-full flex items-center justify-between gap-4 text-left px-5 py-4 md:px-6 md:py-5"
                  aria-expanded={open === i}
                >
                  <span className="font-bold text-base md:text-lg leading-snug">{item.q}</span>
                  <span
                    className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center transition ${
                      open === i ? 'bg-brand-red text-white rotate-45' : 'bg-brand-sand text-brand-ink'
                    }`}
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M12 4v16M4 12h16" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </span>
                </button>
                {open === i && (
                  <div className="px-5 pb-5 md:px-6 md:pb-6 text-brand-mute leading-relaxed">
                    {item.a}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
