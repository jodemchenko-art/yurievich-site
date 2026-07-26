'use client';

import { useEffect, useState } from 'react';
import { calcPlita, fmtRub, type Ground, type SizeKey, type Storeys } from '@/lib/pricing';
import { SITE } from '@/lib/site';

type Answer = string;
type Answers = Record<number, Answer>;

const STEPS = [
  {
    title: 'Какой тип фундамента вас интересует?',
    sub: 'Не уверены? Выберите «Подскажете» — инженер посоветует на замере.',
    options: ['Монолитная плита', 'Ленточный', 'Ростверк / свайно-ростверковый', 'Не знаю — подскажете'],
  },
  {
    title: 'Размеры дома?',
    sub: 'Площадь по внешним стенам. Если ещё не выбрали — укажите примерно.',
    options: ['до 80 м²', '80 – 120 м²', '120 – 180 м²', '180+ м²'],
  },
  {
    title: 'Сколько этажей?',
    sub: 'От этажности зависит нагрузка и сечение армокаркаса.',
    options: ['1 этаж', '1,5 этажа (мансарда)', '2 этажа', '2 этажа + цоколь'],
  },
  {
    title: 'Какой грунт на участке?',
    sub: 'Если не делали геологию — выбирайте «Не знаю», мы определим на замере.',
    options: ['Песок / супесь', 'Глина / суглинок', 'Торф / болото', 'Не знаю — определите'],
  },
  {
    title: 'Когда планируете начать?',
    sub: 'Это поможет нам спланировать график и материалы.',
    options: ['В этом месяце', 'В ближайшие 2-3 месяца', 'Сезон 2027', 'Просто узнаю цену'],
  },
];

/**
 * Ориентировочная вилка по ответам квиза.
 *
 * Показываем её ДО того, как просим телефон. Логика простая: человек и так может
 * посмотреть таблицу цен выше — прятать порядок суммы в обмен на контакт нечестно
 * и в крупной покупке работает против нас. Зато видимая вилка снимает главный
 * стоп-фактор («оставлю номер только чтобы узнать цену») и оставляет квизу
 * настоящую ценность: точный расчёт по конкретному участку.
 *
 * Считаем ТОЛЬКО плиту и той же функцией, что таблица и калькулятор.
 * Лента и сваи считаются иначе — там честнее промолчать, чем выдумать число.
 */
function estimate(answers: Answers): { from: number; to: number; note: string } | null {
  if (answers[0] && !answers[0].includes('плита')) return null;

  const RANGE: Record<string, [SizeKey, SizeKey]> = {
    'до 80 м²': ['6x6', '8x10'],
    '80 – 120 м²': ['8x10', '10x12'],
    '120 – 180 м²': ['10x12', '12x12'],
  };
  const pair = RANGE[answers[1] as string];
  if (!pair) return null;

  const storeys: Storeys =
    answers[2] === '1 этаж' ? 1 : answers[2] === '1,5 этажа (мансарда)' ? 1.5 : 2;

  const GROUND: Record<string, Ground> = {
    'Песок / супесь': 'pesok',
    'Глина / суглинок': 'suglinok',
    'Торф / болото': 'torf',
  };
  const groundKey = GROUND[answers[3] as string];
  const ground: Ground = groundKey || 'suglinok';

  const a = calcPlita({ size: pair[0], material: 'gazobeton', ground, storeys });
  const b = calcPlita({ size: pair[1], material: 'gazobeton', ground, storeys });

  return {
    from: a.total,
    to: b.total,
    note: groundKey
      ? 'по вашим ответам'
      : 'грунт взяли типичный для ЛО — суглинок, на замере уточним',
  };
}

export default function Quiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactType, setContactType] = useState<'whatsapp' | 'telegram' | 'call'>('whatsapp');
  const [consent, setConsent] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const totalSteps = STEPS.length + 1; // +1 for contacts

  /**
   * Префилл из таблицы цен.
   *
   * Человек кликнул «10×10 м» в таблице — значит, тип (плита) и площадь он уже
   * фактически выбрал. Заставлять его отвечать это ещё раз — терять людей на
   * ровном месте, поэтому проставляем два первых ответа и открываем третий шаг.
   */
  useEffect(() => {
    const onPrefill = (e: Event) => {
      const area = (e as CustomEvent).detail?.area as number | undefined;
      if (!area) return;
      const bucket =
        area <= 80 ? 'до 80 м²' : area <= 120 ? '80 – 120 м²' : area <= 180 ? '120 – 180 м²' : '180+ м²';
      setAnswers((prev) => ({ ...prev, 0: 'Монолитная плита', 1: bucket }));
      setStep(2);
      setSubmitted(false);
    };
    window.addEventListener('yur:prefill', onPrefill as EventListener);
    return () => window.removeEventListener('yur:prefill', onPrefill as EventListener);
  }, []);
  const progress = ((step + (submitted ? 1 : 0)) / totalSteps) * 100;

  const pick = (value: string) => {
    setAnswers((prev) => ({ ...prev, [step]: value }));
    if (step < STEPS.length - 1) {
      setTimeout(() => setStep((s) => s + 1), 200);
    } else {
      setTimeout(() => setStep(STEPS.length), 200);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !consent) return;
    setLoading(true);
    try {
      const payload = {
        source: 'quiz',
        answers: STEPS.map((s, i) => ({ q: s.title, a: answers[i] || '—' })),
        contact: { name, phone, contactType },
        page: typeof window !== 'undefined' ? window.location.pathname : '/',
      };
      await fetch('/api/lead/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => null);
      setSubmitted(true);
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      /**
       * Экран после отправки — не «спасибо», а расписание.
       *
       * На чеке в полмиллиона недозвон дороже самой заявки: человек должен
       * знать, чей номер у него сейчас высветится и когда. Поэтому здесь три
       * пункта «что дальше» и живые контакты, а галочка рисуется штрихом —
       * это подтверждение действия, а не украшение.
       */
      <div className="border border-rule bg-paper0 p-8 text-graphite md:p-10">
        <div className="flex items-center gap-3">
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden>
            <rect x="0.5" y="0.5" width="33" height="33" stroke="#1E44AE" />
            <path
              d="M8 17.5 L14.5 24 L26 11"
              stroke="#1E44AE"
              strokeWidth="2.4"
              fill="none"
              className="anno-line"
              style={{ ['--d' as any]: '80ms' }}
            />
          </svg>
          <div>
            <div className="mono text-[11px] tracking-widest text-inkmute">ЗАЯВКА ПРИНЯТА</div>
            <h3 className="display-3 mt-1 text-graphite">Спасибо, записали</h3>
          </div>
        </div>

        <ol className="mt-6 border-t border-hair">
          {[
            ['01', 'Юрий перезвонит сам', `Обычно в течение часа в рабочее время. Номер: ${SITE.phone}`],
            ['02', 'Бесплатный выезд на участок', 'Согласуем удобное время, замерим пятно застройки.'],
            ['03', 'Смета в течение 1 рабочего дня', 'По позициям. Остаётся у вас в любом случае.'],
          ].map(([n, t, d]) => (
            <li key={n} className="flex gap-3 border-b border-hair py-3">
              <span className="mono flex-shrink-0 text-[11px] text-sand">{n}</span>
              <span>
                <span className="block text-sm font-bold leading-snug text-graphite">{t}</span>
                <span className="mt-0.5 block text-xs leading-relaxed text-inkmute">{d}</span>
              </span>
            </li>
          ))}
        </ol>

        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href={`tel:${SITE.phoneRaw}`} className="mono text-sm text-graphite ulink">
            {SITE.phone}
          </a>
          <a
            href={SITE.telegram}
            target="_blank"
            rel="noopener"
            className="mono text-sm text-signal ulink"
          >
            Написать в Telegram →
          </a>
        </div>
      </div>
    );
  }

  const onContacts = step === STEPS.length;

  return (
    <div className="border border-rule bg-paper0 text-graphite">
      {/* Progress */}
      <div className="px-6 md:px-8 pt-6">
        <div className="flex items-center justify-between mb-2 text-xs md:text-sm">
          <span className="font-semibold text-inkmute">
            Шаг {Math.min(step + 1, totalSteps)} из {totalSteps}
          </span>
          <span className="text-inkmute">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-paper2 overflow-hidden">
          <div
            className="h-full bg-signal transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-6 md:p-10">
        {!onContacts ? (
          <>
            <h3 className="display-3 text-graphite">
              {STEPS[step].title}
            </h3>
            {STEPS[step].sub && (
              <p className="mt-2 text-sm md:text-base text-inkmute">{STEPS[step].sub}</p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {STEPS[step].options.map((opt) => {
                const isActive = answers[step] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => pick(opt)}
                    data-picked={isActive ? '1' : '0'}
                    className={`pick text-left border px-5 py-4 font-semibold transition ${
                      isActive
                        ? 'border-signal text-graphite'
                        : 'border-rule bg-paper0 hover:border-signal/60 hover:bg-paper'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>

            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="mt-6 text-sm text-inkmute hover:text-brand-ink underline"
              >
                ← Назад
              </button>
            )}
          </>
        ) : (
          <form onSubmit={submit}>
            <h3 className="display-3 text-graphite">
              Куда прислать расчёт?
            </h3>
            <p className="mt-2 text-sm md:text-base text-inkmute">
              Юрий перезвонит сам, не колл-центр. Смета — в течение 1 рабочего дня после замера.
            </p>

            {/* Вилка по ответам — до того, как человек оставил телефон */}
            {(() => {
              const est = estimate(answers);
              if (!est) return null;
              return (
                <div className="mt-5 border border-rule bg-paper p-4">
                  <div className="eyebrow text-signal-dark">Ориентир {est.note}</div>
                  <div className="mono mt-2 text-lg leading-tight text-graphite md:text-xl">
                    {fmtRub(est.from)} – {fmtRub(est.to)} ₽
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-inkmute">
                    Это не смета, а порядок цифр по таблице цен. Точную сумму считаем после
                    бесплатного замера и фиксируем в договоре — она не меняется без вашей подписи.
                  </p>
                </div>
              );
            })()}

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="eyebrow text-inkmute">Как к вам обращаться?</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван"
                  className="mt-2 w-full border border-rule bg-paper0 px-4 py-3 text-base transition-colors focus:border-signal focus:outline-none"
                />
              </label>

              <label className="block">
                <span className="eyebrow text-inkmute">Телефон</span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 ___ ___-__-__"
                  className="mt-2 w-full border border-rule bg-paper0 px-4 py-3 text-base transition-colors focus:border-signal focus:outline-none"
                />
              </label>

              <div>
                <span className="eyebrow text-inkmute">Как удобнее связаться?</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(['whatsapp', 'telegram', 'call'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setContactType(t)}
                      className={`border px-3 py-3 text-sm font-semibold transition ${
                        contactType === t
                          ? 'border-signal bg-signal/10'
                          : 'border-rule hover:border-signal/60'
                      }`}
                    >
                      {t === 'whatsapp' && 'WhatsApp'}
                      {t === 'telegram' && 'Telegram'}
                      {t === 'call' && 'Звонком'}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs text-inkmute mt-2">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1"
                />
                <span>
                  Согласен на обработку персональных данных согласно{' '}
                  <a href="/privacy" className="underline">политике</a>.
                </span>
              </label>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="sm:w-1/3 border border-rule py-4 font-semibold transition hover:bg-paper"
              >
                ← Назад
              </button>
              <button
                type="submit"
                disabled={loading || !name.trim() || !phone.trim() || !consent}
                className="btn-signal relative flex-1 justify-center overflow-hidden disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading ? 'Отправляем…' : 'Получить расчёт'}
                {!loading && (
                  <span className="arw" aria-hidden>
                    →
                  </span>
                )}
                {loading && (
                  <span
                    aria-hidden
                    className="send-bar absolute bottom-0 left-0 h-0.5 w-full origin-left bg-white/70"
                  />
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
