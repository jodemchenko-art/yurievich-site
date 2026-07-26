'use client';

import { useEffect } from 'react';

/**
 * ДВИЖОК АНИМАЦИЙ СТРАНИЦЫ — один на всю главную, ~1,5 КБ.
 *
 * Почему не библиотека: GSAP/Framer это 30-90 КБ JS на первый экран. У части клиентов
 * в Ленобласти мобильный интернет, и эти килобайты стоят реальных заявок. Здесь всё
 * держится на трёх вещах, которые браузер умеет сам:
 *
 *   1) data-reveal      — появление при входе в кадр (IntersectionObserver, один на страницу);
 *   2) data-track       — элемент получает CSS-переменную --p = 0..1 (насколько он прошёл
 *                         через экран). Дальше любой скролл-эффект делается чистым CSS;
 *   3) data-demo        — одноразовое событие «элемент впервые увиден»: им мы показываем
 *                         человеку, что карточку объекта можно тянуть (сам он не догадается).
 *
 * Всё выключается при prefers-reduced-motion и деградирует в «просто показать»
 * на старых браузерах без IntersectionObserver.
 */
export default function Motion() {
  useEffect(() => {
    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const revealEls = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const trackEls = Array.from(document.querySelectorAll<HTMLElement>('[data-track]'));
    const demoEls = Array.from(document.querySelectorAll<HTMLElement>('[data-demo]'));

    // Нет анимаций — сразу показываем всё и выходим.
    if (reduced || !('IntersectionObserver' in window)) {
      revealEls.forEach((el) => el.classList.add('is-in'));
      trackEls.forEach((el) => el.style.setProperty('--p', '1'));
      return;
    }

    // ── 1. Появление ───────────────────────────────────────────────────
    const revealIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-in');
          revealIO.unobserve(entry.target);
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );
    revealEls.forEach((el) => revealIO.observe(el));

    // ── 2. Прогресс прокрутки в переменную --p ─────────────────────────
    // Считаем только для элементов, которые сейчас в кадре: список активных
    // ведёт отдельный observer, поэтому на скролле мы не трогаем всю страницу.
    const active = new Set<HTMLElement>();
    const trackIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const el = entry.target as HTMLElement;
          if (entry.isIntersecting) active.add(el);
          else {
            active.delete(el);
            // Зафиксировали крайнее значение, чтобы блок не «отматывался» назад рывком.
            const r = el.getBoundingClientRect();
            el.style.setProperty('--p', r.top > 0 ? '0' : '1');
          }
        });
      },
      { rootMargin: '10% 0px 10% 0px', threshold: 0 }
    );
    trackEls.forEach((el) => {
      el.style.setProperty('--p', '0');
      trackIO.observe(el);
    });

    let ticking = false;
    const measure = () => {
      ticking = false;
      const vh = window.innerHeight || 1;
      active.forEach((el) => {
        const r = el.getBoundingClientRect();
        let p: number;

        if (el.dataset.track === 'through') {
          // Режим «протяжка»: 0 — элемент только показался снизу, 1 — полностью ушёл вверх.
          // Нужен для линий-прогрессов, которые должны заполняться, пока читают блок.
          p = (vh - r.top) / (r.height + vh);
        } else {
          // Режим «вход» (по умолчанию): 1 достигается, когда верх элемента дошёл
          // до верхней пятой части экрана. Анимация успевает закончиться, ПОКА на неё
          // смотрят, а не когда блок уже уезжает.
          p = (vh - r.top) / (vh * 0.8);
        }

        el.style.setProperty('--p', Math.min(1, Math.max(0, p)).toFixed(4));
      });
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(measure);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    measure();

    // ── 3. Одноразовая подсказка «это можно потянуть» ──────────────────
    const demoIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.dispatchEvent(new CustomEvent('firstview', { bubbles: false }));
          demoIO.unobserve(entry.target);
        });
      },
      { threshold: 0.55 }
    );
    demoEls.forEach((el) => demoIO.observe(el));

    return () => {
      revealIO.disconnect();
      trackIO.disconnect();
      demoIO.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return null;
}
