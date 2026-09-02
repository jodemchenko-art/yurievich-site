'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';

/**
 * Мобильная нижняя панель: звонок / Telegram / MAX / расчёт.
 *
 * 02.09.2026: WhatsApp убран. Номера на экране не печатаем — они «вшиты»
 * в значки: значок трубки звонит на рабочий номер, значки мессенджеров
 * открывают чат.
 *
 * Поведение важнее оформления:
 *  • на первом экране панели НЕТ — она отъедает 56 px у оффера, а человек,
 *    который ещё ничего не прочитал, всё равно не звонит;
 *  • появляется, когда hero уехал вверх;
 *  • ОДИН раз за сессию, после того как человек посмотрел таблицу цен,
 *    сегмент «Расчёт» разворачивается в широкую кнопку на 3 секунды —
 *    ровно на пике намерения «а сколько на мой дом»;
 *  • прячется, когда на экране форма заявки: дублировать кнопку над формой
 *    незачем.
 *
 * Иконки — SVG, не эмодзи: эмодзи по-разному рисуются на Android и iOS
 * и первым же взглядом выдают «сайт на конструкторе».
 */
export default function StickyPhoneBar() {
  const [shown, setShown] = useState(false);
  const [wide, setWide] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setShown(window.scrollY > window.innerHeight * 0.8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Разворот сегмента «Расчёт» — один раз за сессию, после блока цен
    const KEY = 'yur_bar_hint_v1';
    let io: IntersectionObserver | null = null;
    const prices = document.getElementById('ceny');
    let alreadyHinted = false;
    try {
      alreadyHinted = sessionStorage.getItem(KEY) === '1';
    } catch {}

    if (prices && !alreadyHinted && 'IntersectionObserver' in window) {
      io = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          // ждём, пока цены УЙДУТ вверх — значит, человек их прочитал
          if (e && !e.isIntersecting && e.boundingClientRect.top < 0) {
            io?.disconnect();
            try {
              sessionStorage.setItem(KEY, '1');
            } catch {}
            setWide(true);
            setTimeout(() => setWide(false), 3000);
          }
        },
        { threshold: 0 }
      );
      io.observe(prices);
    }

    // Прячем панель, когда в кадре форма заявки
    let formIo: IntersectionObserver | null = null;
    const form = document.getElementById('contacts');
    if (form && 'IntersectionObserver' in window) {
      formIo = new IntersectionObserver(
        (entries) => {
          const e = entries[0];
          if (e) setShown((prev) => (e.isIntersecting ? false : prev));
        },
        { threshold: 0.12 }
      );
      formIo.observe(form);
    }

    return () => {
      window.removeEventListener('scroll', onScroll);
      io?.disconnect();
      formIo?.disconnect();
    };
  }, []);

  return (
    <div
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-rule bg-paper0/95 backdrop-blur transition-transform duration-300 md:hidden ${
        shown ? 'translate-y-0' : 'translate-y-full'
      }`}
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-hidden={!shown}
    >
      <div
        className="grid gap-px bg-rule/40 transition-[grid-template-columns] duration-300"
        style={{
          gridTemplateColumns: SITE.max
            ? wide
              ? '1fr 1fr 1fr 2.6fr'
              : '1fr 1fr 1fr 1fr'
            : wide
              ? '1fr 1fr 2.6fr'
              : '1fr 1fr 1fr',
        }}
      >
        <a
          href={`tel:${SITE.phoneRaw}`}
          aria-label="Позвонить"
          tabIndex={shown ? 0 : -1}
          className="flex flex-col items-center justify-center gap-1 bg-graphite py-2.5 text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
            <path
              d="M6.5 3h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 014.5 5.2 2 2 0 016.5 3z"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mono text-[9px] leading-none">ЗВОНОК</span>
        </a>

        <a
          href={SITE.telegram}
          target="_blank"
          rel="noopener"
          aria-label="Написать в Telegram"
          tabIndex={shown ? 0 : -1}
          className="flex flex-col items-center justify-center gap-1 bg-[#1F87BC] py-2.5 text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
          </svg>
          <span className="mono text-[9px] leading-none">TG</span>
        </a>

        {SITE.max && (
          <a
            href={SITE.max}
            target="_blank"
            rel="noopener"
            aria-label="Написать в MAX"
            tabIndex={shown ? 0 : -1}
            className="flex flex-col items-center justify-center gap-1 bg-[#5B2FE5] py-2.5 text-white"
          >
            <span className="text-[13px] font-extrabold leading-none tracking-tight">MAX</span>
            <span className="mono text-[9px] leading-none">НАПИСАТЬ</span>
          </a>
        )}

        <a
          href="#calc"
          aria-label="Рассчитать стоимость"
          tabIndex={shown ? 0 : -1}
          className="flex items-center justify-center gap-2 bg-signal py-2.5 text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden className="flex-shrink-0">
            <path
              d="M3 18h18M4 18L12 5l8 13M8.5 13h7"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mono whitespace-nowrap text-[9px] leading-none">
            {wide ? 'ПОСЧИТАТЬ МОЙ РАЗМЕР' : 'РАСЧЁТ'}
          </span>
        </a>
      </div>
    </div>
  );
}
