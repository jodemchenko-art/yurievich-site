import { SITE } from '@/lib/site';

/**
 * Плавающие кнопки связи (десктоп): звонок, Telegram, MAX.
 * Номера цифрами не пишем — они «вшиты» в значки.
 */
export default function FloatingChat() {
  return (
    <div className="fixed bottom-5 right-5 z-30 hidden flex-col gap-2 md:flex">
      <a
        href={`tel:${SITE.phoneRaw}`}
        aria-label="Позвонить"
        className="flex h-12 w-12 items-center justify-center bg-graphite transition hover:-translate-y-0.5"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="M6.5 3h3l1.5 4-2 1.5a12 12 0 006.5 6.5l1.5-2 4 1.5v3a2 2 0 01-2.2 2A17 17 0 014.5 5.2 2 2 0 016.5 3z"
            stroke="white"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </svg>
      </a>
      <a
        href={SITE.telegram}
        target="_blank"
        rel="noopener"
        aria-label="Написать в Telegram"
        className="flex h-12 w-12 items-center justify-center bg-[#1F87BC] transition hover:-translate-y-0.5"
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
          <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
        </svg>
      </a>
      {SITE.max && (
        <a
          href={SITE.max}
          target="_blank"
          rel="noopener"
          aria-label="Написать в MAX"
          className="flex h-12 w-12 items-center justify-center bg-[#5B2FE5] text-[13px] font-extrabold tracking-tight text-white transition hover:-translate-y-0.5"
        >
          MAX
        </a>
      )}
    </div>
  );
}
