'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

// In-article CTA: появляется в середине статьи + после.
// Цель: конверсия читателей в звонки/заявки (читатели блога = горячий трафик).

export default function InArticleCta({
  variant = 'block',
  source = 'article',
}: {
  variant?: 'block' | 'inline';
  source?: string;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    if (!name.trim() || phone.replace(/\D/g, '').length < 10) {
      setError('Заполните имя и телефон');
      return;
    }
    setError(null);
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          phone,
          source: `${source}:in-article-cta`,
          context: typeof window !== 'undefined' ? window.location.pathname : '',
        }),
      });
      if (!res.ok) throw new Error('fail');
      setSubmitted(true);
    } catch {
      setError('Не удалось отправить. Позвоните: ' + SITE.phone);
    }
  };

  if (variant === 'inline') {
    return (
      <div className="my-10 rounded-2xl bg-brand-sand p-5 md:p-6 not-prose">
        <div className="font-bold text-lg text-brand-ink mb-2">
          Хотите чтобы мы посчитали ваш фундамент?
        </div>
        <p className="text-sm text-brand-mute mb-4">
          Бесплатный выезд инженера в любую точку СПб и ЛО. Шурф на участке + смета по факту грунта.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="rounded-xl bg-brand-ink text-white px-5 py-3 font-bold no-underline hover:opacity-90"
          >
            📞 {SITE.phone}
          </a>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border-2 border-brand-ink text-brand-ink px-5 py-3 font-bold hover:bg-brand-ink hover:text-white transition"
          >
            Перезвоните мне
          </button>
        </div>
        {open && (
          <CallbackForm
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            submit={submit}
            submitted={submitted}
            error={error}
            onClose={() => setOpen(false)}
          />
        )}
      </div>
    );
  }

  return (
    <section className="container-x my-12 max-w-4xl">
      <div className="rounded-2xl bg-brand-ink text-white p-6 md:p-8 lg:p-10">
        <h3 className="text-2xl md:text-3xl font-extrabold leading-tight mb-3">
          Бесплатно посчитаем ваш фундамент по факту грунта на участке
        </h3>
        <p className="text-white/80 mb-6 max-w-2xl">
          Шурф 1,5×1,5×2 м + смета с разбивкой по позициям. Без давления и «срочных решений». Выезд инженера в течение 1-3 дней.
        </p>
        <div className="flex gap-3 flex-wrap">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="rounded-xl bg-white text-brand-ink px-6 py-3 font-bold no-underline hover:bg-brand-sand transition"
          >
            📞 {SITE.phone}
          </a>
          <button
            onClick={() => setOpen(true)}
            className="rounded-xl border-2 border-white text-white px-6 py-3 font-bold hover:bg-white hover:text-brand-ink transition"
          >
            Запросить выезд
          </button>
        </div>
        {open && (
          <CallbackForm
            name={name}
            setName={setName}
            phone={phone}
            setPhone={setPhone}
            submit={submit}
            submitted={submitted}
            error={error}
            onClose={() => setOpen(false)}
            theme="dark"
          />
        )}
      </div>
    </section>
  );
}

function CallbackForm({
  name,
  setName,
  phone,
  setPhone,
  submit,
  submitted,
  error,
  onClose,
  theme = 'light',
}: {
  name: string;
  setName: (s: string) => void;
  phone: string;
  setPhone: (s: string) => void;
  submit: () => void;
  submitted: boolean;
  error: string | null;
  onClose: () => void;
  theme?: 'light' | 'dark';
}) {
  if (submitted) {
    return (
      <div className="mt-6 p-4 rounded-xl bg-green-50 border border-green-300 text-green-900">
        ✓ Заявка принята! Инженер позвонит в течение часа в рабочие часы.
      </div>
    );
  }
  return (
    <div className="mt-6 grid gap-3 max-w-md">
      <input
        type="text"
        placeholder="Ваше имя"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className={`rounded-xl px-4 py-3 ${theme === 'dark' ? 'bg-white/10 text-white placeholder:text-white/50 border border-white/20' : 'bg-white border border-brand-line text-brand-ink'}`}
      />
      <input
        type="tel"
        placeholder="+7 (___) ___-__-__"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className={`rounded-xl px-4 py-3 ${theme === 'dark' ? 'bg-white/10 text-white placeholder:text-white/50 border border-white/20' : 'bg-white border border-brand-line text-brand-ink'}`}
      />
      {error && <p className="text-sm text-red-300">{error}</p>}
      <div className="flex gap-2">
        <button
          onClick={submit}
          className={`flex-1 rounded-xl px-5 py-3 font-bold ${theme === 'dark' ? 'bg-white text-brand-ink hover:bg-brand-sand' : 'bg-brand-ink text-white hover:opacity-90'} transition`}
        >
          Отправить
        </button>
        <button
          onClick={onClose}
          className={`rounded-xl px-4 py-3 ${theme === 'dark' ? 'border border-white/30 text-white' : 'border border-brand-line text-brand-mute'}`}
        >
          Отмена
        </button>
      </div>
    </div>
  );
}
