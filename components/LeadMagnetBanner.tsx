'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

// Лид-магнит: «Чек-лист как не попасть на дешёвый фундамент» (8 стр PDF)
// в обмен на телефон. Реалистичный заход для «прохладных» юзеров
// которые ещё не готовы оставить заявку, но готовы скачать полезное.
//
// После отправки:
//   1. Сохраняем телефон в /api/lead с source=lead-magnet:checklist
//   2. Открываем PDF в новой вкладке
//
// Размещаем в блоге (после каждой статьи) и на главной (между Reviews и Process).

export default function LeadMagnetBanner({
  source = 'checklist',
}: {
  source?: string;
}) {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const PDF_URL = '/lead-magnets/cheklist-fundament-2026.pdf';

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (phone.replace(/\D/g, '').length < 10) {
      setError('Введите телефон (мин. 10 цифр)');
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source: `lead-magnet:${source}`,
          contact: { name: name || 'Скачал чек-лист', phone },
          comment: 'Скачал PDF: Чек-лист как не попасть на дешёвый фундамент',
        }),
      }).catch(() => null);
      setSubmitted(true);
      // Открыть PDF
      setTimeout(() => {
        window.open(PDF_URL, '_blank');
      }, 300);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="my-12 rounded-2xl bg-gradient-to-br from-brand-ink to-brand-ink/85 text-white p-6 md:p-10 not-prose">
        <div className="flex items-start gap-4">
          <div className="text-5xl">✅</div>
          <div>
            <h3 className="text-2xl md:text-3xl font-extrabold">Скачивание началось</h3>
            <p className="mt-2 text-white/80">
              Чек-лист открылся в новой вкладке. Если не открылся —{' '}
              <a href={PDF_URL} target="_blank" rel="noopener" className="underline font-semibold">
                нажмите сюда
              </a>
              .
            </p>
            <p className="mt-3 text-white/70 text-sm">
              Юрий перезвонит в течение часа — расскажет где у вас участок, какой грунт и что подходит. Без обязательств.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="my-12 rounded-2xl bg-gradient-to-br from-brand-ink to-brand-ink/85 text-white p-6 md:p-10 not-prose overflow-hidden relative">
      <div className="absolute -right-10 -top-10 text-[200px] opacity-5">📋</div>

      <div className="relative grid md:grid-cols-2 gap-6 md:gap-10 items-center">
        <div>
          <div className="inline-block px-3 py-1 rounded-full bg-white/15 text-xs font-bold uppercase tracking-wider">
            📥 БЕСПЛАТНО · 8 стр PDF
          </div>
          <h3 className="mt-4 text-2xl md:text-3xl font-extrabold leading-tight">
            Чек-лист: как не попасть<br className="hidden md:block" />
            на дешёвый фундамент
          </h3>
          <p className="mt-3 text-white/80 leading-relaxed">
            7 признаков подрядчика-«экономиста», 4 вопроса в тупик, реальные цены 2026, чек-лист сметы из 14 пунктов.
          </p>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-white/70">
            <span>· 12 минут чтения</span>
            <span>· Экономит 300-800к ₽</span>
            <span>· Из 239 объектов</span>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-3">
          <input
            type="text"
            inputMode="text"
            autoComplete="name"
            placeholder="Имя (необязательно)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-white/50 focus:bg-white/25 focus:outline-none focus:border-white/50"
          />
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="+7 (___) ___-__-__"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-white/15 border border-white/20 text-white placeholder:text-white/50 focus:bg-white/25 focus:outline-none focus:border-white/50"
            required
          />
          {error && <p className="text-sm text-red-300">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 rounded-xl bg-white text-brand-ink font-extrabold text-lg hover:bg-white/90 transition disabled:opacity-50"
          >
            {loading ? 'Готовим...' : '📥 Скачать чек-лист'}
          </button>
          <p className="text-xs text-white/50 text-center">
            Юрий перезвонит за час. Без спама.
            Или сразу:{' '}
            <a href={`tel:${SITE.phoneRaw}`} className="text-white underline">
              {SITE.phone}
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
