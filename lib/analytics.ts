import { SITE } from './site';

/**
 * Одна точка отправки целей в Яндекс.Метрику.
 *
 * Заявки уходят через `fetch` на /api/lead/, а не обычной отправкой формы,
 * поэтому автоцель «отправка формы» их не видит: в Метрике было 0 заявок
 * при живых обращениях в логах. Здесь мы явно говорим Метрике, что заявка
 * состоялась.
 *
 * Цель в кабинете: тип «JS-событие», идентификатор `lead`.
 */

declare global {
  interface Window {
    ym?: (id: string | number, action: string, ...rest: unknown[]) => void;
  }
}

export function reachGoal(goal: string, params?: Record<string, unknown>) {
  if (typeof window === 'undefined' || typeof window.ym !== 'function') return;
  try {
    window.ym(SITE.yandexMetrikaId, 'reachGoal', goal, params);
  } catch {
    /* аналитика не должна ронять отправку заявки */
  }
}

/** Заявка отправлена. `source` — какая именно форма (квиз, калькулятор, попап…). */
export function trackLead(source: string) {
  reachGoal('lead', { source });
}
