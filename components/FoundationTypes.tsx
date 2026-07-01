import Link from 'next/link';
import { PRICES } from '@/lib/site';

// Коммерческий SEO-блок под семантическое ядро Вордстата (СПб + ЛО):
// ловит «ленточный фундамент», «свайный фундамент», «монолитная плита»,
// «фундамент под ключ», «цена/стоимость фундамента», «заказать фундамент».
// Каждый тип — отдельный H3 + answer-first абзац (под Алису/Нейро и сниппеты).
// Цены: жёсткая цифра только у плиты (есть прайс). По ленте/сваям — честно
// «расчёт после замера», без выдуманных чисел.

type FType = {
  id: string;
  title: string;
  intent: string;        // когда выбирают
  price: string;
  body: string;
  bullets: string[];
};

const TYPES: FType[] = [
  {
    id: 'plita',
    title: 'Монолитная плита (плитный фундамент)',
    intent: 'Наша основная специализация',
    price: `от ${PRICES.plita.from.toLocaleString('ru-RU')} ${PRICES.plita.unit}`,
    body:
      'Монолитный плитный фундамент под ключ — универсальное решение для дома из газобетона на ' +
      'пучинистых грунтах и при высоком уровне грунтовых вод, типичных для СПб и Ленобласти. ' +
      'Плита работает как единая жёсткая платформа и переносит сезонные подвижки грунта без трещин в стенах. ' +
      'Цена монолитной плиты под ключ — от 5 500 ₽/м², точную стоимость считаем бесплатно после замера участка.',
    bullets: ['Бетон М300 W6 F150, арматура А500С', 'Плита 250–350 мм по нагрузкам', 'Срок 10–14 дней', 'Зимняя заливка'],
  },
  {
    id: 'lenta',
    title: 'Ленточный фундамент',
    intent: 'Для плотных грунтов и лёгких домов',
    price: 'Расчёт после замера',
    body:
      'Ленточный фундамент под ключ заливаем на плотных непучинистых грунтах под газобетон, кирпич и каркасные дома. ' +
      'Монолитная армированная лента под несущими стенами обходится дешевле плиты, когда геология участка это позволяет. ' +
      'Стоимость ленточного фундамента зависит от глубины заложения, ширины ленты и объёма бетона — ' +
      'считаем смету бесплатно после выезда инженера и оценки грунта.',
    bullets: ['Заглублённая и мелкозаглублённая лента', 'Заводской бетон с паспортом', 'Армирование А500С', 'Договор с фикс-ценой'],
  },
  {
    id: 'svai',
    title: 'Свайный фундамент',
    intent: 'Для торфа, склонов и каркасных домов',
    price: 'Расчёт после замера',
    body:
      'Свайный фундамент (буронабивные и винтовые сваи) выбирают на торфе, заболоченных и неровных участках, ' +
      'где плита или лента потребовали бы дорогой выторфовки. Сваи с ростверком переносят нагрузку дома на ' +
      'плотные слои грунта. Цена свайного фундамента зависит от количества и длины свай — ' +
      'рассчитываем под конкретный дом и грунт СПб или Ленобласти бесплатно.',
    bullets: ['Буронабивные и винтовые сваи', 'Свайно-ростверковый вариант', 'Геология участка включена', 'Гарантия 5 лет'],
  },
];

export default function FoundationTypes() {
  return (
    <section id="vidy-fundamentov" className="section">
      <div className="container-x">
        <div className="max-w-3xl">
          <span className="text-brand-accent font-bold text-sm uppercase tracking-[0.2em]" style={{ color: '#1B3A5C' }}>
            Виды фундаментов и цены
          </span>
          <h2 className="section-title mt-2">
            Какой фундамент под ключ вам нужен — плита, лента или сваи
          </h2>
          <p className="section-sub">
            СК «Юрьевич» заливает фундаменты под ключ в Санкт-Петербурге и Ленинградской области:
            монолитную плиту, ленточный и свайный фундамент. Тип подбираем по грунту вашего участка —
            это решает цену и надёжность. Чтобы узнать, сколько стоит фундамент под ваш дом, оставьте
            заявку на бесплатный расчёт.
          </p>
        </div>

        <div className="mt-10 grid gap-5 md:gap-6 md:grid-cols-3">
          {TYPES.map((t) => (
            <article
              key={t.id}
              className="flex flex-col rounded-2xl border border-brand-line bg-white p-6 md:p-7 hover:shadow-xl hover:-translate-y-1 transition"
            >
              <div className="text-xs font-bold uppercase tracking-wider text-brand-mute">{t.intent}</div>
              <h3 className="mt-2 text-xl font-extrabold leading-snug text-brand-ink">{t.title}</h3>
              <p className="mt-3 text-sm text-brand-mute leading-relaxed flex-1">{t.body}</p>

              <ul className="mt-4 space-y-1.5">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-xs text-brand-ink">
                    <span className="text-emerald-600 mt-0.5 flex-shrink-0">✓</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 pt-4 border-t border-brand-line flex items-center justify-between gap-3">
                <div className="font-extrabold text-brand-ink text-sm">{t.price}</div>
                <a href="#calc" className="inline-flex items-center gap-1 text-sm font-bold text-brand-ink hover:text-brand-accent transition whitespace-nowrap">
                  Рассчитать <span>→</span>
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-7 text-sm text-brand-mute max-w-3xl">
          Не знаете, какой фундамент выбрать? Это нормально. Привезём геологию участка, посчитаем
          стоимость плиты, ленты и свай и честно скажем, где можно сэкономить без риска для дома.
          Работаем по районам ЛО:{' '}
          <Link href="/fundament/vsevolozhsk/" className="underline hover:text-brand-ink">Всеволожский</Link>,{' '}
          <Link href="/fundament/gatchina/" className="underline hover:text-brand-ink">Гатчинский</Link>,{' '}
          <Link href="/fundament/vyborg/" className="underline hover:text-brand-ink">Выборгский</Link> и{' '}
          <Link href="/fundament/" className="underline hover:text-brand-ink">другие районы</Link>.
        </p>
      </div>
    </section>
  );
}
