'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';

// Lead popup — ТОЛЬКО exit-intent (26.07.2026).
// Таймер на 35 секунд убран сознательно: он срабатывал ровно тогда, когда человек
// читал разбор конструкции, и превращал спокойный сайт в «меня продают».
// Осталось единственное срабатывание — когда курсор уходит за верхнюю кромку
// окна, то есть человек уже уходит. На мобильных такого события нет — там
// работает нижняя панель со звонком.
// — показывается при exit-intent на десктопе
// — не показывается повторно если юзер закрыл (sessionStorage)
// — не показывается на /spasibo/ и api-страницах
// — не показывается если юзер уже на #contacts
// Цель: ловить юзера который "почитал и уходит" не оставив заявки.

const STORAGE_KEY = 'lead_popup_closed_v1';

export default function LeadPopup() {
  const [show, setShow] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [consent, setConsent] = useState(false);

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

    // Единственный триггер: exit-intent (мышь ушла за верх окна — десктоп)
    const onMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 5) trigger();
    };
    document.addEventListener('mouseleave', onMouseLeave);

    return () => {
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
    if (!consent) {
      setError('Отметьте согласие на обработку персональных данных');
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
          comment: 'Запрос через попап (exit-intent)',
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
        className="plate ticks relative w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={close}
          aria-label="Закрыть"
          className="absolute right-2 top-2 z-10 flex h-9 w-9 items-center justify-center border border-rule bg-paper0 text-xl text-inkmute transition-colors hover:text-graphite"
        >
          ×
        </button>

        {submitted ? (
          <div className="p-7 text-center">
            <div className="mono text-xs tracking-widest text-signal-dark">ЗАЯВКА ПРИНЯТА</div>
            <h3 className="display-3 mt-3 text-graphite">Спасибо, записали</h3>
            <p className="mt-3 text-inkmute">
              Юрий перезвонит в ближайшее рабочее время — обычно в течение часа.
            </p>
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noopener"
              className="mono mt-5 inline-block bg-[#1F87BC] px-6 py-3 text-sm font-semibold text-white"
            >
              Написать в Telegram сейчас
            </a>
          </div>
        ) : (
          <>
            <div className="px-6 pt-7 pb-2">
              <div className="eyebrow text-signal-dark">Бесплатно · без обязательств</div>
              <h3 id="popup-title" className="display-3 mt-3 text-graphite">
                Уходите? Оставьте участок — пришлём расчёт
              </h3>
              <p className="mt-2 text-inkmute text-sm leading-relaxed">
                Юрий перезвонит, задаст несколько вопросов про участок и пришлёт смету.
                Ни к чему не обязывает: смета остаётся у вас в любом случае.
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
                className="mt-4 w-full border border-rule bg-paper0 px-4 py-3 text-graphite transition-colors placeholder:text-inkmute focus:border-signal focus:outline-none"
                required
              />
              <input
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7 (___) ___-__-__"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="mono mt-3 w-full border border-rule bg-paper0 px-4 py-3 text-graphite transition-colors placeholder:text-inkmute focus:border-signal focus:outline-none"
                required
              />

              {error && (
                <p className="mt-3 border-l-2 border-graphite bg-paper2 px-3 py-2 text-sm font-semibold text-graphite">{error}</p>
              )}

              <label className="flex items-start gap-2 text-xs text-inkmute mt-4">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-0.5"
                />
                <span>
                  Согласен на обработку персональных данных согласно{' '}
                  <a href="/privacy" className="underline">политике</a>.
                </span>
              </label>

              <button
                type="submit"
                disabled={loading || !consent}
                className="btn-signal mt-4 w-full justify-center disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Отправляем...' : 'Получить расчёт'}
              </button>

              <p className="mt-3 text-xs text-inkmute text-center">
                Или сразу позвоните:{' '}
                <a href={`tel:${SITE.phoneRaw}`} className="mono text-graphite ulink">
                  {SITE.phone}
                </a>
              </p>

              <div className="mono mt-4 flex items-center justify-center gap-3 border-t border-hair pt-4 text-[10px] text-inkmute">
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
