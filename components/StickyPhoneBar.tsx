import { SITE } from '@/lib/site';

export default function StickyPhoneBar() {
  return (
    <div className="md:hidden fixed bottom-0 inset-x-0 z-30 bg-white border-t border-brand-line shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
      <div className="grid grid-cols-2 gap-2 p-2">
        <a
          href={`tel:${SITE.phoneRaw}`}
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-ink text-white font-bold py-3"
        >
          📞 Позвонить
        </a>
        <a
          href="#calc"
          className="flex items-center justify-center gap-2 rounded-xl bg-brand-red text-white font-bold py-3"
        >
          Расчёт за 1 день
        </a>
      </div>
    </div>
  );
}
