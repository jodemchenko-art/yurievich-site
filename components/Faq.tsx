'use client';

import { useState } from 'react';
import { HOME_FAQ } from '@/lib/faq';

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
            {HOME_FAQ.map((item, i) => (
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
