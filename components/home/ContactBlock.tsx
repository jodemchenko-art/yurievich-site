'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

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
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contacts" className="relative overflow-hidden bg-bp-950 text-white">
      <div aria-hidden className="absolute inset-0 grid-paper-dark" />

      <div className="container-x relative py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Контакты */}
          <div>
            <div className="datum datum-dark pt-6" data-reveal>
              <div className="eyebrow text-signal">
                <span className="text-bp-text">11</span>
                <span className="mx-2 opacity-40">/</span>
                Контакты
              </div>
              <h2 className="display-2 mt-4 text-white">Позвоните или&nbsp;напишите напрямую</h2>
              <p className="lede mt-4 max-w-lg text-bp-text">
                Отвечает Юрий — тот же человек, который приедет на замер и подпишет договор.
                Не менеджер и не колл-центр.
              </p>
            </div>

            <div className="mt-8 border-t border-bp-line">
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="group flex items-center justify-between gap-4 border-b border-bp-line py-5"
              >
                <span>
                  <span className="eyebrow block text-bp-text">Телефон</span>
                  <span className="mono mt-2 block text-xl text-white md:text-2xl">
                    {SITE.phone}
                  </span>
                </span>
                <span className="arw mono text-signal transition-transform group-hover:translate-x-1">
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
                  className="group flex items-center justify-between gap-4 border-b border-bp-line py-4"
                >
                  <span>
                    <span className="eyebrow block text-bp-text">{c.label}</span>
                    <span className="mt-1.5 block text-base font-bold text-white">{c.value}</span>
                  </span>
                  <span className="arw mono text-signal transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
              ))}

              <div className="border-b border-bp-line py-4">
                <span className="eyebrow block text-bp-text">База и география</span>
                <span className="mt-1.5 block text-base font-bold text-white">
                  пос. Песочный, Санкт-Петербург
                </span>
                <span className="mono mt-1 block text-[11px] text-bp-text">
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
                  <div className="mono text-xs tracking-widest text-signal-dark">ЗАЯВКА ПРИНЯТА</div>
                  <h3 className="display-3 mt-3 text-graphite">Спасибо, записали</h3>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-brand-mute">
                    Юрий перезвонит в ближайшее рабочее время. Если нужно срочно — звоните по
                    номеру слева, это его личный телефон.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <div className="eyebrow text-signal-dark">Быстрая заявка</div>
                  <h3 className="display-3 mt-3 text-graphite">Бесплатный замер и смета</h3>
                  <p className="mt-2 text-sm leading-relaxed text-brand-mute">
                    Оставьте контакты — перезвоним, уточним участок и согласуем выезд.
                    Смета придёт в течение одного рабочего дня после замера.
                  </p>

                  <div className="mt-6 space-y-4">
                    <label className="block">
                      <span className="eyebrow text-brand-mute">Как к вам обращаться</span>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Иван"
                        className="mt-2 w-full border border-hair bg-white px-4 py-3 text-base text-graphite transition-colors focus:border-signal focus:outline-none"
                      />
                    </label>

                    <label className="block">
                      <span className="eyebrow text-brand-mute">Телефон</span>
                      <input
                        required
                        type="tel"
                        inputMode="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+7 ___ ___-__-__"
                        className="mono mt-2 w-full border border-hair bg-white px-4 py-3 text-base text-graphite transition-colors focus:border-signal focus:outline-none"
                      />
                    </label>

                    <label className="block">
                      <span className="eyebrow text-brand-mute">
                        Участок и дом <span className="opacity-60">— необязательно</span>
                      </span>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        placeholder="Например: Гатчинский р-н, суглинок, дом 10×10 из газобетона"
                        className="mt-2 w-full resize-none border border-hair bg-white px-4 py-3 text-base text-graphite transition-colors focus:border-signal focus:outline-none"
                      />
                    </label>
                  </div>

                  <label className="mt-4 flex items-start gap-2.5 text-xs leading-relaxed text-brand-mute">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5 h-4 w-4 flex-shrink-0 accent-[#E8A33D]"
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

                  <p className="mono mt-3 text-center text-[10px] leading-relaxed text-brand-mute">
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
