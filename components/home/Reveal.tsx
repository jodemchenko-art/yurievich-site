'use client';

import { useEffect } from 'react';

/**
 * Один наблюдатель на всю страницу вместо обёртки-компонента на каждый блок.
 * Любой элемент с атрибутом data-reveal получает класс .is-in, когда попадает
 * в кадр (стили — в globals.css). Задержка задаётся инлайн-переменной --d.
 *
 * Почему так, а не библиотека анимаций: ~700 байт JS вместо 30+ КБ,
 * а на медленных РФ-сетях каждый килобайт первого экрана стоит заявок.
 */
export default function Reveal() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    if (!els.length) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (reduced || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -6% 0px', threshold: 0.06 }
    );

    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);

  return null;
}
