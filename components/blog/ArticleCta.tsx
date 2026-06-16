import Link from 'next/link';
import { SITE } from '@/lib/site';

export default function ArticleCta() {
  return (
    <section className="container-x mt-16 md:mt-20">
      <div className="bg-brand-ink text-white rounded-3xl p-8 md:p-14 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 pointer-events-none" />
        <div className="relative max-w-3xl">
          <span className="text-sm uppercase tracking-widest text-white/60 font-semibold">
            СК «Юрьевич» · 239 объектов сдано
          </span>
          <h2 className="mt-3 text-3xl md:text-4xl font-extrabold leading-tight">
            Посчитайте свой фундамент за 1 минуту
          </h2>
          <p className="mt-4 text-white/80 leading-relaxed text-base md:text-lg max-w-[58ch]">
            5 простых вопросов — пришлём детальную смету в Telegram или WhatsApp.
            Цифры реальные, по позициям, без скрытых платежей. Договор с фикс-ценой,
            оплата по принятым этапам, гарантия 5 лет.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <Link
              href="/#calc"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white text-brand-ink px-7 py-4 font-bold text-base md:text-lg hover:bg-brand-sand transition shadow-xl"
            >
              Получить расчёт →
            </Link>
            <a
              href={`tel:${SITE.phoneRaw}`}
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white/30 px-7 py-4 font-bold text-base md:text-lg hover:bg-white/10 transition"
            >
              📞 {SITE.phone}
            </a>
          </div>

          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-white/70">
            <span>★ 5.0 · 35 отзывов</span>
            <span>Партнёр ЛСР Газобетон</span>
            <span>Гарантия {SITE.warrantyYears} лет</span>
          </div>
        </div>
      </div>
    </section>
  );
}
