'use client';

import { useEffect, useState } from 'react';
import { SITE } from '@/lib/site';

/**
 * Мобильная нижняя панель: звонок / WhatsApp / Telegram / расчёт.
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
        style={{ gridTemplateColumns: wide ? '1fr 1fr 1fr 2.6fr' : '1fr 1fr 1fr 1fr' }}
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
          href={SITE.whatsapp}
          target="_blank"
          rel="noopener"
          aria-label="Написать в WhatsApp"
          tabIndex={shown ? 0 : -1}
          className="flex flex-col items-center justify-center gap-1 bg-[#1FA855] py-2.5 text-white"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <span className="mono text-[9px] leading-none">WA</span>
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
