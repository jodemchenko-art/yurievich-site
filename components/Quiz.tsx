'use client';

import { useState } from 'react';

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
      <div className="bg-white rounded-3xl p-8 md:p-12 text-center shadow-xl border border-brand-line">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl md:text-3xl font-extrabold">Заявка принята!</h3>
        <p className="mt-3 text-brand-mute max-w-md mx-auto">
          Юрий перезвонит вам в ближайший час. Подробную смету пришлём в течение 1 рабочего дня.
        </p>
      </div>
    );
  }

  const onContacts = step === STEPS.length;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-brand-line">
      {/* Progress */}
      <div className="px-6 md:px-8 pt-6">
        <div className="flex items-center justify-between mb-2 text-xs md:text-sm">
          <span className="font-semibold text-brand-mute">
            Шаг {Math.min(step + 1, totalSteps)} из {totalSteps}
          </span>
          <span className="text-brand-mute">{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-brand-sand rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-red rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="p-6 md:p-10">
        {!onContacts ? (
          <>
            <h3 className="text-xl md:text-3xl font-extrabold leading-tight">
              {STEPS[step].title}
            </h3>
            {STEPS[step].sub && (
              <p className="mt-2 text-sm md:text-base text-brand-mute">{STEPS[step].sub}</p>
            )}

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {STEPS[step].options.map((opt) => {
                const isActive = answers[step] === opt;
                return (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => pick(opt)}
                    className={`text-left rounded-xl border-2 px-5 py-4 font-semibold transition ${
                      isActive
                        ? 'border-brand-red bg-brand-red/5 text-brand-ink'
                        : 'border-brand-line bg-white hover:border-brand-red/40 hover:bg-brand-sand/50'
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
                className="mt-6 text-sm text-brand-mute hover:text-brand-ink underline"
              >
                ← Назад
              </button>
            )}
          </>
        ) : (
          <form onSubmit={submit}>
            <h3 className="text-xl md:text-3xl font-extrabold leading-tight">
              Куда прислать расчёт?
            </h3>
            <p className="mt-2 text-sm md:text-base text-brand-mute">
              Юрий сам перезвонит в ближайший час. Смета — в течение 1 рабочего дня.
            </p>

            <div className="mt-6 grid gap-4">
              <label className="block">
                <span className="text-sm font-semibold text-brand-ink">Как к вам обращаться?</span>
                <input
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Иван"
                  className="mt-1 w-full rounded-xl border-2 border-brand-line px-4 py-3 text-base focus:border-brand-red focus:outline-none transition"
                />
              </label>

              <label className="block">
                <span className="text-sm font-semibold text-brand-ink">Телефон</span>
                <input
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+7 ___ ___-__-__"
                  className="mt-1 w-full rounded-xl border-2 border-brand-line px-4 py-3 text-base focus:border-brand-red focus:outline-none transition"
                />
              </label>

              <div>
                <span className="text-sm font-semibold text-brand-ink">Как удобнее связаться?</span>
                <div className="mt-2 grid grid-cols-3 gap-2">
                  {(['whatsapp', 'telegram', 'call'] as const).map((t) => (
                    <button
                      type="button"
                      key={t}
                      onClick={() => setContactType(t)}
                      className={`rounded-xl border-2 px-3 py-3 text-sm font-semibold transition ${
                        contactType === t
                          ? 'border-brand-red bg-brand-red/5'
                          : 'border-brand-line hover:border-brand-red/40'
                      }`}
                    >
                      {t === 'whatsapp' && '💬 WhatsApp'}
                      {t === 'telegram' && '✈️ Telegram'}
                      {t === 'call' && '📞 Звонком'}
                    </button>
                  ))}
                </div>
              </div>

              <label className="flex items-start gap-2 text-xs text-brand-mute mt-2">
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
                className="sm:w-1/3 rounded-xl border-2 border-brand-line py-4 font-semibold hover:bg-brand-sand transition"
              >
                ← Назад
              </button>
              <button
                type="submit"
                disabled={loading || !name.trim() || !phone.trim() || !consent}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Отправляем…' : 'Получить расчёт →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
