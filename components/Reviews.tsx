'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

const REVIEWS = [
  {
    name: 'Александр',
    loc: 'Всеволожский р-н, ЛО',
    object: 'Монолитная плита 130 м²',
    date: 'апрель 2025',
    text:
      'Заказывал плиту под дом из газобетона. Ребята приехали на замер бесплатно, через день прислали смету, разложенную по позициям — всё прозрачно. Цена в договоре, как и обещали, не менялась. Работали аккуратно, после стройки убрали участок. Рекомендую!',
  },
  {
    name: 'Дмитрий и Ольга',
    loc: 'Курортный р-н, СПб',
    object: 'Дом 168 м² из газобетона ЛСР',
    date: 'март 2025',
    text:
      'Строили дом под ключ. Юрий вёл нас от первого звонка до сдачи — всегда на связи. Газобетон именно ЛСР, как и обещали, с паспортами. Сроки сорвали на 4 дня из-за погоды, но честно предупредили заранее. Гарантия 5 лет в руки — спокойно.',
  },
  {
    name: 'Сергей',
    loc: 'Гатчинский р-н, ЛО',
    object: 'Ленточный фундамент 96 м.п.',
    date: 'февраль 2025',
    text:
      'Лили зимой при -12. Опыт у братьев есть — прогрев, добавки, всё по технологии. Бетон с завода с паспортом, мне его на месте показали. Без допов в процессе — это редкость в нашей нише. Спасибо!',
  },
  {
    name: 'Наталья',
    loc: 'Тосненский р-н, ЛО',
    object: 'Дом 220 м² + плита УШП',
    date: 'январь 2025',
    text:
      'Долго выбирала строителей, объехала пять компаний. У «Юрьевич» подкупило, что братья — это семья, а не бригада с улицы. Стройка шла полгода, не торопились, делали качественно. Все этапы под фотоотчётом. Дом получился — мечта.',
  },
  {
    name: 'Михаил',
    loc: 'Выборгский р-н, ЛО',
    object: 'Монолитная плита 90 м²',
    date: 'ноябрь 2024',
    text:
      'Заказывал плиту под небольшой дом 8х10. Реальные цены, без накруток. Понравилось, что Валерий каждый день был на объекте — контроль качества чувствовался. Сдали в срок. Через год буду заказывать у них же стены.',
  },
];

export default function Reviews() {
  const [idx, setIdx] = useState(0);
  const r = REVIEWS[idx];

  return (
    <section id="otzyvy" className="section bg-brand-sand">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-red font-bold text-sm uppercase tracking-wide">Отзывы</span>
          <h2 className="section-title mt-2">
            {SITE.rating} ★ из 5,0 · {SITE.reviewsCount} отзывов
          </h2>
          <p className="section-sub">
            Ни одного отзыва ниже пятёрки. Все — реальные, можно проверить на нашем Авито-профиле.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <article className="bg-white rounded-3xl p-8 md:p-12 shadow-xl border border-brand-line">
            <div className="flex items-center gap-1 text-2xl text-amber-500 mb-4">
              {'★★★★★'.split('').map((s, i) => <span key={i}>{s}</span>)}
            </div>
            <p className="text-base md:text-xl leading-relaxed text-brand-ink">
              «{r.text}»
            </p>
            <div className="mt-8 pt-6 border-t border-brand-line">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <div className="font-bold text-brand-ink">{r.name}</div>
                  <div className="text-sm text-brand-mute">{r.loc} · {r.date}</div>
                </div>
                <div className="text-sm bg-brand-sand px-3 py-2 rounded-lg font-medium">
                  {r.object}
                </div>
              </div>
            </div>
          </article>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-6">
            {REVIEWS.map((_, i) => (
              <button
                key={i}
                onClick={() => setIdx(i)}
                aria-label={`Отзыв ${i + 1}`}
                className={`h-2 rounded-full transition ${
                  i === idx ? 'w-8 bg-brand-red' : 'w-2 bg-brand-line hover:bg-brand-mute'
                }`}
              />
            ))}
          </div>

          {/* Nav */}
          <div className="flex justify-center gap-3 mt-6">
            <button
              onClick={() => setIdx((v) => (v === 0 ? REVIEWS.length - 1 : v - 1))}
              className="rounded-full border-2 border-brand-line bg-white px-4 py-2 text-sm font-semibold hover:border-brand-red transition"
            >
              ← Назад
            </button>
            <button
              onClick={() => setIdx((v) => (v + 1) % REVIEWS.length)}
              className="rounded-full border-2 border-brand-line bg-white px-4 py-2 text-sm font-semibold hover:border-brand-red transition"
            >
              Вперёд →
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
