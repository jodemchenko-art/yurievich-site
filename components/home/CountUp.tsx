'use client';

import { useEffect, useRef } from 'react';

/**
 * Счётчик цифр «от нуля».
 *
 * Важно: в HTML сразу отрисовано КОНЕЧНОЕ значение — так его видит поисковик
 * и человек с выключенным JS. Анимация меняет textContent напрямую (без setState),
 * поэтому нет ни ререндеров, ни расхождения гидратации.
 */
export default function CountUp({
  to,
  decimals = 0,
  duration = 1100,
  className,
}: {
  to: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || done.current) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced || !('IntersectionObserver' in window)) return;

    const fmt = (v: number) =>
      decimals > 0
        ? v.toFixed(decimals).replace('.', ',')
        : Math.round(v).toLocaleString('ru-RU').replace(/,/g, ' ');

    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry?.isIntersecting || done.current) return;
        done.current = true;
        io.disconnect();

        const start = performance.now();
        const tick = (now: number) => {
          const p = Math.min(1, (now - start) / duration);
          // easeOutExpo — быстрый разгон, мягкая остановка
          const eased = p === 1 ? 1 : 1 - Math.pow(2, -10 * p);
          el.textContent = fmt(to * eased);
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = fmt(to);
        };
        el.textContent = fmt(0);
        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [to, decimals, duration]);

  const initial =
    decimals > 0
      ? to.toFixed(decimals).replace('.', ',')
      : to.toLocaleString('ru-RU').replace(/,/g, ' ');

  return (
    <span ref={ref} className={className}>
      {initial}
    </span>
  );
}
