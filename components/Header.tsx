'use client';

import { useState } from 'react';
import { SITE } from '@/lib/site';

const NAV = [
  { href: '/#uslugi', label: 'Услуги' },
  { href: '/#calc', label: 'Расчёт' },
  { href: '/#portfolio', label: 'Объекты' },
  { href: '/#otzyvy', label: 'Отзывы' },
  { href: '/blog/', label: 'Блог' },
  { href: '/#brothers', label: 'О братьях' },
  { href: '/#contacts', label: 'Контакты' },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-brand-line">
      {/* Top trust bar */}
      <div className="hidden md:block bg-brand-ink text-white">
        <div className="container-x flex items-center justify-between text-xs py-2">
          <div className="flex items-center gap-4">
            <span>🛡 Договор · Гарантия {SITE.warrantyYears} лет · Бесплатный замер</span>
          </div>
          <a href={`tel:${SITE.phoneRaw}`} className="font-semibold hover:text-brand-red transition">
            {SITE.phone}
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="container-x flex items-center justify-between py-3 md:py-4">
        <a href="/" className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-lg bg-brand-red flex items-center justify-center text-white font-extrabold text-lg">
            Ю
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-base md:text-lg">СК «Юрьевич»</div>
            <div className="text-[10px] md:text-xs text-brand-mute">Фундаменты · Дома под ключ</div>
          </div>
        </a>

        <nav className="hidden lg:flex items-center gap-6">
          {NAV.map((n) => (
            <a key={n.href} href={n.href} className="text-sm font-medium text-brand-mute hover:text-brand-ink transition">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`tel:${SITE.phoneRaw}`}
            className="hidden md:inline-flex font-bold text-brand-ink hover:text-brand-red transition"
          >
            {SITE.phone}
          </a>
          <a href="/#calc" className="hidden sm:inline-flex btn-primary !py-2 !px-4 !text-sm">
            Бесплатный расчёт
          </a>
          <button
            aria-label="Меню"
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 -mr-2"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="lg:hidden border-t border-brand-line bg-white">
          <div className="container-x py-3 flex flex-col gap-1">
            {NAV.map((n) => (
              <a
                key={n.href}
                href={n.href}
                onClick={() => setOpen(false)}
                className="py-3 text-base font-medium text-brand-ink border-b border-brand-line last:border-b-0"
              >
                {n.label}
              </a>
            ))}
            <a href={`tel:${SITE.phoneRaw}`} className="mt-3 btn-primary !py-3">
              📞 {SITE.phone}
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
