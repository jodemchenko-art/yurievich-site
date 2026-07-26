import Quiz from '@/components/Quiz';
import { SITE } from '@/lib/site';

/**
 * ГЛАВНАЯ ТОЧКА ЗАЯВКИ (#calc).
 *
 * Стоит сразу после цены — в момент, когда у человека в голове уже есть порядок
 * цифр и возникает единственный практический вопрос: «а на мой дом сколько?».
 * Слева расписано, что произойдёт после отправки: страх «оставлю номер — начнут
 * названивать» гасится не уговорами, а понятной последовательностью действий.
 */

const AFTER = [
  {
    n: '01',
    t: 'Юрий перезвонит сам',
    d: 'Уточнит участок, грунт и размеры дома. Один звонок, не колл-центр.',
  },
  {
    n: '02',
    t: 'Бесплатный выезд на участок',
    d: 'Смотрим пятно застройки и подъезд для техники. Ни к чему вас не обязывает.',
  },
  {
    n: '03',
    t: 'Смета в течение 1 рабочего дня',
    d: 'Расписанная по позициям, а не «работа + материалы» одной строкой.',
  },
  {
    n: '04',
    t: 'Решение — за вами',
    d: 'Смета остаётся у вас, даже если строить будете не с нами.',
  },
];

export default function LeadBlock() {
  return (
    <section id="calc" className="relative overflow-hidden bg-bp-950 text-white">
      <div aria-hidden className="absolute inset-0 grid-paper-dark" />
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(90% 70% at 85% 10%, rgba(232,163,61,0.14) 0%, rgba(7,17,25,0) 55%)',
        }}
      />

      <div className="container-x relative py-16 md:py-24">
        <div className="grid gap-10 lg:grid-cols-[1fr_minmax(0,540px)] lg:gap-16">
          {/* Левая колонка — что будет дальше */}
          <div>
            <div className="datum datum-dark pt-6" data-reveal>
              <div className="eyebrow text-signal">
                <span className="text-bp-text">05</span>
                <span className="mx-2 opacity-40">/</span>
                Расчёт стоимости
              </div>
              <h2 className="display-2 mt-4 text-white">
                Посчитаем ваш фундамент
                <br className="hidden sm:block" /> за&nbsp;5&nbsp;вопросов
              </h2>
              <p className="lede mt-4 max-w-lg text-bp-text">
                Ответы нужны, чтобы прикинуть нагрузку и подобрать тип фундамента. Точную сумму
                считаем после замера — и фиксируем её в договоре.
              </p>
            </div>

            <ol className="mt-10 border-t border-bp-line">
              {AFTER.map((s, i) => (
                <li
                  key={s.n}
                  className="flex gap-4 border-b border-bp-line py-4"
                  data-reveal
                  style={{ ['--d' as any]: `${i * 80}ms` }}
                >
                  <span className="mono flex-shrink-0 text-xs text-signal">{s.n}</span>
                  <span>
                    <span className="block text-[15px] font-bold leading-snug text-white">
                      {s.t}
                    </span>
                    <span className="mt-1 block text-sm leading-relaxed text-bp-text">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>

            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="mono text-sm text-white ulink"
              >
                {SITE.phone}
              </a>
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener"
                className="mono text-sm text-signal ulink"
              >
                Telegram Юрия →
              </a>
              <a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener"
                className="mono text-sm text-signal ulink"
              >
                WhatsApp →
              </a>
            </div>
          </div>

          {/* Правая колонка — квиз */}
          <div data-reveal style={{ ['--d' as any]: '120ms' }}>
            <Quiz />
          </div>
        </div>
      </div>
    </section>
  );
}
