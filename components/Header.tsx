'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

/**
 * Шапка в системе «инженерный чертёж»: тонкая тёмная строка-«штамп» сверху,
 * белая рабочая полоса с логотипом-репером, моноширинные служебные подписи.
 * Скруглений и теней нет — только волосяные линии, как на чертеже.
 */

const NAV = [
  { href: '/fundament/plita/', label: 'Плита' },
  { href: '/fundament/lenta/', label: 'Лента' },
  { href: '/fundament/svai/', label: 'Сваи' },
  { href: '/ceny/', label: 'Цены' },
  { href: '/obekty/', label: 'Объекты' },
  { href: '/doma/', label: 'Дома' },
  { href: '/o-kompanii/', label: 'О нас' },
  { href: '/blog/', label: 'Блог' },
  { href: '/kontakty/', label: 'Контакты' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-rule bg-paper0/95 backdrop-blur">
      {/* Служебная строка */}
      <div className="hidden bg-bp-950 text-chalk md:block">
        <div className="container-x flex items-center justify-between py-2">
          <span className="mono text-[11px] tracking-wider text-chalkdim">
            ДОГОВОР С ФИКС-ЦЕНОЙ · ГАРАНТИЯ {SITE.warrantyYears} ЛЕТ · ВЫЕЗД ИНЖЕНЕРА БЕСПЛАТНО
          </span>
          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener"
            className="mono text-[11px] tracking-wider text-sand ulink"
          >
            НАПИСАТЬ В TELEGRAM
          </a>
        </div>
      </div>

      {/* Рабочая полоса */}
      <div className="container-x flex items-center justify-between gap-4 py-3">
        <a href="/" className="flex items-center gap-3" aria-label="СК Юрьевич — на главную">
          <span className="relative flex h-10 w-10 items-center justify-center bg-graphite text-base font-extrabold text-white">
            Ю
            <span aria-hidden className="absolute -bottom-px -right-px h-2.5 w-2.5 border-b border-r border-sand" />
            <span aria-hidden className="absolute -left-px -top-px h-2.5 w-2.5 border-l border-t border-sand" />
          </span>
          <span className="leading-tight">
            <span className="block text-[15px] font-extrabold tracking-tight text-graphite md:text-base">
              СК «Юрьевич»
            </span>
            <span className="mono block whitespace-nowrap text-[9px] tracking-wider text-inkmute md:text-[10px]">
              <span className="sm:hidden">ФУНДАМЕНТЫ · СПб + ЛО</span>
              <span className="hidden sm:inline">ФУНДАМЕНТЫ · ДОМА ПОД КЛЮЧ</span>
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-5">
          {NAV.map((n) => (
            <a
              key={n.href}
              href={n.href}
              className="ulink text-[13px] font-semibold text-inkmute transition-colors hover:text-graphite"
            >
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.phoneRaw}`}
            aria-label="Позвонить"
            className="hidden h-9 w-9 items-center justify-center border border-rule text-graphite transition-colors hover:border-graphite md:inline-flex"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6.5 3h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 014.5 5.2 2 2 0 016.5 3z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
            </svg>
          </a>
          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener"
            className="mono hidden text-sm text-graphite ulink md:inline-flex"
          >
            Telegram
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
        <div className="border-t border-rule bg-paper0 lg:hidden">
          <div className="container-x flex flex-col py-2">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-hair py-3.5 text-[15px] font-semibold text-graphite last:border-b-0"
              >
                {n.label}
                <span aria-hidden className="mono text-xs text-sand">
                  →
                </span>
              </a>
            ))}
            <a
              href={`tel:${SITE.phoneRaw}`}
              onClick={() => setOpen(false)}
              className="btn-signal mono mt-3 justify-center"
            >
              Позвонить
            </a>
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noopener"
              onClick={() => setOpen(false)}
              className="btn-line mono mt-2 justify-center"
            >
              Написать в Telegram
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
