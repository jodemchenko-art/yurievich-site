'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

export default function Contacts() {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

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
    <section id="contacts" className="section bg-brand-sand">
      <div className="container-x">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Left: contact info */}
          <div>
            <span className="text-brand-red font-bold text-sm uppercase tracking-wide">Контакты</span>
            <h2 className="section-title mt-2">Свяжитесь напрямую</h2>
            <p className="section-sub max-w-lg">
              Юрий отвечает лично — по телефону, в WhatsApp и Telegram.
              Все вопросы по проекту, смете и срокам — напрямую с хозяином.
            </p>

            <div className="mt-8 space-y-5">
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="flex items-center gap-4 group"
              >
                <div className="h-14 w-14 rounded-2xl bg-brand-red flex items-center justify-center text-white text-xl">
                  📞
                </div>
                <div>
                  <div className="text-xs text-brand-mute uppercase tracking-wider">Звонок</div>
                  <div className="text-xl md:text-2xl font-extrabold group-hover:text-brand-red transition">
                    {SITE.phone}
                  </div>
                </div>
              </a>

              <a href={SITE.whatsapp} target="_blank" rel="noopener" className="flex items-center gap-4 group">
                <div className="h-14 w-14 rounded-2xl bg-[#25D366] flex items-center justify-center text-white text-xl">
                  💬
                </div>
                <div>
                  <div className="text-xs text-brand-mute uppercase tracking-wider">WhatsApp</div>
                  <div className="text-lg font-bold group-hover:text-brand-red transition">
                    Написать сейчас →
                  </div>
                </div>
              </a>

              <a href={SITE.telegram} target="_blank" rel="noopener" className="flex items-center gap-4 group">
                <div className="h-14 w-14 rounded-2xl bg-[#229ED9] flex items-center justify-center text-white text-xl">
                  ✈️
                </div>
                <div>
                  <div className="text-xs text-brand-mute uppercase tracking-wider">Telegram</div>
                  <div className="text-lg font-bold group-hover:text-brand-red transition">
                    @YuraDem01 →
                  </div>
                </div>
              </a>

              <a href={SITE.vk} target="_blank" rel="noopener" className="flex items-center gap-4 group">
                <div className="h-14 w-14 rounded-2xl bg-[#0077FF] flex items-center justify-center text-white text-xl font-extrabold">
                  VK
                </div>
                <div>
                  <div className="text-xs text-brand-mute uppercase tracking-wider">ВКонтакте</div>
                  <div className="text-lg font-bold group-hover:text-brand-red transition">
                    Сообщество компании →
                  </div>
                </div>
              </a>

              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-brand-ink flex items-center justify-center text-white text-xl">
                  📍
                </div>
                <div>
                  <div className="text-xs text-brand-mute uppercase tracking-wider">База</div>
                  <div className="text-lg font-bold">пос. Песочный, СПб</div>
                  <div className="text-sm text-brand-mute">Работаем по всей Ленобласти</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: form */}
          <div>
            <div className="bg-white rounded-3xl p-6 md:p-10 shadow-xl border border-brand-line">
              {submitted ? (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-2xl font-extrabold">Заявка отправлена</h3>
                  <p className="mt-3 text-brand-mute">
                    Юрий перезвонит в ближайший час. Если срочно — звоните по номеру выше.
                  </p>
                </div>
              ) : (
                <form onSubmit={submit}>
                  <h3 className="text-2xl md:text-3xl font-extrabold">Бесплатный замер и смета</h3>
                  <p className="mt-2 text-brand-mute">
                    Оставьте контакты — перезвоним в течение часа, обсудим проект и согласуем выезд.
                  </p>

                  <div className="mt-6 space-y-4">
                    <label className="block">
                      <span className="text-sm font-semibold text-brand-ink">Как к вам обращаться?</span>
                      <input
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Иван"
                        className="mt-1 w-full rounded-xl border-2 border-brand-line px-4 py-3 text-base focus:border-brand-red focus:outline-none transition"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-brand-ink">Телефон</span>
                      <input
                        required
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+7 ___ ___-__-__"
                        className="mt-1 w-full rounded-xl border-2 border-brand-line px-4 py-3 text-base focus:border-brand-red focus:outline-none transition"
                      />
                    </label>
                    <label className="block">
                      <span className="text-sm font-semibold text-brand-ink">
                        Комментарий <span className="text-brand-mute font-normal">(необязательно)</span>
                      </span>
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={3}
                        placeholder="Например: участок в Гатчинском р-не, нужна плита под дом 10х10"
                        className="mt-1 w-full rounded-xl border-2 border-brand-line px-4 py-3 text-base focus:border-brand-red focus:outline-none transition resize-none"
                      />
                    </label>
                  </div>

                  <label className="flex items-start gap-2 text-xs text-brand-mute mt-4">
                    <input
                      type="checkbox"
                      checked={consent}
                      onChange={(e) => setConsent(e.target.checked)}
                      className="mt-0.5"
                    />
                    <span>
                      Согласен на обработку персональных данных согласно{' '}
                      <a href="/privacy" className="underline">политике обработки данных</a>.
                    </span>
                  </label>

                  <button
                    type="submit"
                    disabled={loading || !name.trim() || !phone.trim() || !consent}
                    className="mt-4 w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Отправляем…' : 'Получить смету бесплатно'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
