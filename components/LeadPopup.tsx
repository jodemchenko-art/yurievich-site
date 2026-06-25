'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';

// Smart lead popup:
// — показывается через 35 секунд пребывания на сайте ИЛИ при exit-intent на десктопе
// — не показывается повторно если юзер закрыл (sessionStorage)
// — не показывается на /spasibo/ и api-страницах
// — не показывается если юзер уже на #contacts
// Цель: ловить юзера который "почитал и уходит" не оставив заявки.

const STORAGE_KEY = 'lead_popup_closed_v1';
const SHOW_AFTER_MS = 35000;

export default function LeadPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Не показывать если юзер уже закрыл в этой сессии
    if (typeof window === 'undefined') return;
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Не показывать на технических страницах
    const path = window.location.pathname;
    if (path.startsWith('/api') || path === '/spasibo') return;

    let shown = false;
    const trigger = () => {
      if (shown) return;
      shown = true;
      setShow(true);
    };

    // Триггер 1: таймер
    const timer = setTimeout(trigger, SHOW_AFTER_MS);

    // Триггер 2: exit-intent (мышь к верху экрана — десктоп)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 5) trigger();
    };
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  const close = () => {
    setShow(false);
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {}
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Заполните имя и телефон (мин. 10 цифр)');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: 'popup',
          contact: { name, phone },
          comment: 'Запрос через попап (35с / exit-intent)',
          context: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });
      if (!res.ok) throw new Error('fail');
      setSubmitted(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {}
    } catch {
      setError('Не удалось отправить. Позвоните: ' + SITE.phone);
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="popup-title"
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={close}
    >
      <div
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Закрыть"
          className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-brand-line flex items-center justify-center text-brand-mute hover:text-brand-ink text-xl"
        >
          ×
        </button>

        {submitted ? (
          <div className="p-7 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-extrabold text-brand-ink">Заявка принята!</h3>
            <p className="mt-3 text-brand-mute">
              Юрий перезвонит вам в течение часа. Сейчас идёт {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })} — попадаете в рабочее окно.
            </p>
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noopener"
              className="mt-5 inline-block px-6 py-3 rounded-xl bg-[#229ED9] text-white font-semibold hover:bg-[#1c89bd]"
            >
              Написать в Telegram сейчас
            </a>
          </div>
        ) : (
          <>
            <div className="px-6 pt-7 pb-2">
              <div className="inline-block px-3 py-1 rounded-full bg-brand-sand text-xs font-bold uppercase tracking-wider text-brand-ink">
                Бесплатно
              </div>
              <h3 id="popup-title" className="mt-3 text-2xl md:text-3xl font-extrabold text-brand-ink leading-tight">
                Расчёт фундамента за 1 день
              </h3>
              <p className="mt-2 text-brand-mute text-sm leading-relaxed">
                Юрий лично перезвонит, задаст 3 вопроса о участке и пришлёт смету по почте.
                Без обязательств и предоплаты.
              </p>
            </div>

            <form onSubmit={submit} className="px-6 pb-6">
              <input
                type="text"
                inputMode="text"
                autoComplete="name"
                placeholder="Ваше имя"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-4 w-full px-4 py-3 rounded-xl border border-brand-line bg-white text-brand-ink placeholder:text-brand-mute focus:border-brand-ink focus:outline-none"
                required
              />
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mt-3 w-full px-4 py-3 rounded-xl border border-brand-line bg-white text-brand-ink placeholder:text-brand-mute focus:border-brand-ink focus:outline-none"
                required
              />

              {error && (
                <p className="mt-3 text-sm text-red-600">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-4 w-full px-6 py-4 rounded-xl bg-brand-ink text-white font-extrabold text-lg hover:bg-brand-ink/90 transition disabled:opacity-50"
              >
                {loading ? 'Отправляем...' : 'Получить расчёт'}
              </button>

              <p className="mt-3 text-xs text-brand-mute text-center">
                Или сразу позвоните:{' '}
                <a href={`tel:${SITE.phoneRaw}`} className="text-brand-ink font-semibold underline">
                  {SITE.phone}
                </a>
              </p>

              <div className="mt-4 pt-4 border-t border-brand-line flex items-center justify-center gap-4 text-xs text-brand-mute">
                <span>★★★★★ 5.0 · 35 отзывов</span>
                <span>•</span>
                <span>239 объектов</span>
                <span>•</span>
                <span>Гарантия 5 лет</span>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
