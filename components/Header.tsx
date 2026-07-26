'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

/**
 * Шапка в системе «инженерный чертёж»: тонкая тёмная строка-«штамп» сверху,
 * белая рабочая полоса с логотипом-репером, моноширинные служебные подписи.
 * Скруглений и теней нет — только волосяные линии, как на чертеже.
 */

const NAV = [
  { href: '/#razrez', label: 'Разрез плиты' },
  { href: '/#uslugi', label: 'Виды и цены' },
  { href: '/#portfolio', label: 'Объекты' },
  { href: '/kalkulyator/', label: 'Калькулятор' },
  { href: '/#process', label: 'Как работаем' },
  { href: '/blog/', label: 'Блог' },
  { href: '/#contacts', label: 'Контакты' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-hair bg-white/95 backdrop-blur">
      {/* Служебная строка */}
      <div className="hidden bg-bp-950 text-white md:block">
        <div className="container-x flex items-center justify-between py-2">
          <span className="mono text-[11px] tracking-wider text-bp-text">
            ДОГОВОР С ФИКС-ЦЕНОЙ · ГАРАНТИЯ {SITE.warrantyYears} ЛЕТ · ВЫЕЗД ИНЖЕНЕРА БЕСПЛАТНО
          </span>
          <a href={`tel:${SITE.phoneRaw}`} className="mono text-[11px] tracking-wider text-signal ulink">
            {SITE.phone}
          </a>
        </div>
      </div>

      {/* Рабочая полоса */}
      <div className="container-x flex items-center justify-between gap-4 py-3">
        <a href="/" className="flex items-center gap-3" aria-label="СК Юрьевич — на главную">
          <span className="relative flex h-10 w-10 items-center justify-center bg-graphite text-base font-extrabold text-white">
            Ю
            <span aria-hidden className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-signal" />
            <span aria-hidden className="absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-signal" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight text-graphite md:text-base">
              СК «Юрьевич»
            </span>
            <span className="mono block whitespace-nowrap text-[9px] tracking-wider text-brand-mute md:text-[10px]">
              <span className="sm:hidden">ФУНДАМЕНТЫ · СПб + ЛО</span>
              <span className="hidden sm:inline">ФУНДАМЕНТЫ · ДОМА ПОД КЛЮЧ</span>
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-5 lg:flex">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="ulink text-[13px] font-semibold text-brand-mute transition-colors hover:text-graphite"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="mono hidden text-sm text-graphite ulink md:inline-flex"
          >
            {SITE.phone}
          </a>
          <a href="/#calc" className="btn-signal hidden !px-4 !py-2.5 text-sm sm:inline-flex">
            Рассчитать
          </a>
          <button
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="-mr-2 p-2 lg:hidden"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      {open && (
        <div className="border-t border-hair bg-white lg:hidden">
          <div className="container-x flex flex-col py-2">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-hair py-3.5 text-[15px] font-semibold text-graphite last:border-b-0"
              >
                {n.label}
                <span aria-hidden className="mono text-xs text-hair">
                  →
                </span>
              </a>
            ))}
            <a
              href={`tel:${SITE.phoneRaw}`}
              onClick={() => setOpen(false)}
              className="btn-signal mono mt-3 justify-center"
            >
              {SITE.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
