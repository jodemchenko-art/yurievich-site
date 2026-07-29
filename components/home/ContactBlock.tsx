'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';
import { trackLead } from '@/lib/analytics';

/**
 * ТРЕТЬЯ И ПОСЛЕДНЯЯ ТОЧКА ЗАЯВКИ.
 *
 * Здесь сознательно короткая форма (имя + телефон + комментарий) — для тех,
 * кто дочитал до низа и уже принял решение; проходить квиз им незачем.
 * Рядом — прямые каналы: часть людей на крупной покупке не оставляет форму
 * в принципе, им нужно написать живому человеку. Отнять у них эту возможность
 * ради «чистоты воронки» — потерять заявку.
 *
 * Тело запроса и адрес API не менялись (source: 'contacts'), чтобы заявки
 * продолжали падать в тот же Telegram.
 */
export default function ContactBlock() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [consent, setConsent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !consent) return;
    setLoading(true);
    try {
      await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'contacts',
          contact: { name, phone },
          comment,
        }),
      }).catch(() => null);
      trackLead('contacts-block');
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacts" data-plane="graphite" className="on-dark relative overflow-hidden bg-bp-950 text-chalk">
      <div aria-hidden className="absolute inset-0 grid-paper-dark" />

      <div className="container-x relative py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Контакты */}
          <div>
            <div className="datum datum-dark pt-6" data-reveal>
              <div className="eyebrow text-sand">
                <span className="text-chalkdim">11</span>
                <span className="mx-2 opacity-40">/</span>
                Контакты
              </div>
              <h2 className="display-2 mask mt-4 text-chalk">Позвоните или&nbsp;напишите напрямую</h2>
              <p className="lede mt-4 max-w-lg text-chalkdim">
                Отвечает Юрий — тот же человек, который приедет на замер и подпишет договор.
                Не менеджер и не колл-центр.
              </p>
            </div>

            <div className="mt-8 border-t border-ruled">
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="group flex items-center justify-between gap-4 border-b border-ruled py-5"
              >
                <span>
                  <span className="eyebrow block text-chalkdim">Телефон</span>
                  <span className="mono mt-2 block text-xl text-chalk md:text-2xl">
                    {SITE.phone}
                  </span>
                </span>
                <span className="arw mono text-sand transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>

              {[
                { label: 'WhatsApp', value: 'Написать сообщение', href: SITE.whatsapp },
                { label: 'Telegram', value: '@YuraDem01', href: SITE.telegram },
                { label: 'ВКонтакте', value: 'Сообщество «Ленбетон78»', href: SITE.vk },
              ].map((c) => (
                <a
                  key={c.label}
                  href={c.href}
                  target="_blank"
                  rel="noopener"
                  className="group flex items-center justify-between gap-4 border-b border-ruled py-4"
                >
                  <span>
                    <span className="eyebrow block text-chalkdim">{c.label}</span>
                    <span className="mt-1.5 block text-base font-bold text-chalk">{c.value}</span>
                  </span>
                  <span className="arw mono text-sand transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              ))}

              <div className="border-b border-ruled py-4">
                <span className="eyebrow block text-chalkdim">База и география</span>
                <span className="mt-1.5 block text-base font-bold text-chalk">
                  пос. Песочный, Санкт-Петербург
                </span>
                <span className="mono mt-1 block text-[11px] text-chalkdim">
                  Работаем по СПб и всей Ленинградской области
                </span>
              </div>
            </div>
          </div>

          {/* Короткая форма */}
          <div data-reveal style={{ ['--d' as any]: '100ms' }}>
            <div className="plate ticks p-6 text-graphite md:p-8">
              {submitted ? (
                <div className="py-10 text-center">
                  <div className="mono text-xs tracking-widest text-inkmute">ЗАЯВКА ПРИНЯТА</div>
                  <h3 className="display-3 mt-3 text-graphite">Спасибо, записали</h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-inkmute">
                    Юрий перезвонит в ближайшее рабочее время. Если нужно срочно — звоните по
                    номеру слева, это его личный телефон.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="eyebrow text-inkmute">Быстрая заявка</div>
                  <h3 className="display-3 mt-3 text-graphite">Бесплатный замер и смета</h3>
                  <p className="mt-2 text-sm leading-relaxed text-inkmute">
                    Оставьте контакты — перезвоним, уточним участок и согласуем выезд.
                    Смета придёт в течение одного рабочего дня после замера.
                  </p>

                  <div className="mt-6 space-y-4">
                    <label className="block">
                      <span className="eyebrow text-inkmute">Как к вам обращаться</span>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Иван"
                        className="mt-2 w-full border border-rule bg-paper0 px-4 py-3 text-base text-graphite transition-colors focus:border-signal focus:outline-none"
                      />
                    </label>

                    <label className="block">
                      <span className="eyebrow text-inkmute">Телефон</span>
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+7 ___ ___-__-__"
                        className="mono mt-2 w-full border border-rule bg-paper0 px-4 py-3 text-base text-graphite transition-colors focus:border-signal focus:outline-none"
                      />
                    </label>

                    <label className="block">
                      <span className="eyebrow text-inkmute">
                        Участок и дом <span className="opacity-60">— необязательно</span>
                      </span>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        placeholder="Например: Гатчинский р-н, суглинок, дом 10×10 из газобетона"
                        className="mt-2 w-full resize-none border border-rule bg-paper0 px-4 py-3 text-base text-graphite transition-colors focus:border-signal focus:outline-none"
                      />
                    </label>
                  </div>

                  <label className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-inkmute">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#1E44AE]"
                    />
                    <span>
                      Согласен на обработку персональных данных согласно{' '}
                      <a href="/privacy" className="ulink text-graphite">
                        политике обработки данных
                      </a>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading || !name.trim() || !phone.trim() || !consent}
                    className="btn-signal mt-6 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {loading ? 'Отправляем…' : 'Получить смету бесплатно'}
                    {!loading && (
                      <span className="arw" aria-hidden>
                        →
                      </span>
                    )}
                  </button>

                  <p className="mono mt-3 text-center text-[10px] leading-relaxed text-inkmute">
                    Заявка ни к чему не обязывает. Смета остаётся у вас в любом случае.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
