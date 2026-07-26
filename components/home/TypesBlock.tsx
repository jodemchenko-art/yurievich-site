import Link from 'next/link';
import { PRICES } from '@/lib/site';
import SectionHead from './SectionHead';

/**
 * Виды фундаментов + два «домовых» продукта.
 *
 * Тексты сохранены из старого блока намеренно: они писались под реальную
 * частотность Вордстата (плита / лента / сваи / цена / заказать) и уже отработаны
 * SEO-аудитом 26.07. Менялась подача, а не семантика — редизайн не должен
 * стоить сайту позиций.
 *
 * Жёсткая цифра цены стоит только там, где есть прайс (плита, дом под ключ).
 * По ленте и сваям — честное «расчёт после замера» вместо выдуманного «от».
 */

type FType = {
  id: string;
  title: string;
  intent: string;
  price: string;
  body: string;
  specs: Array<[string, string]>;
};

const TYPES: FType[] = [
  {
    id: 'plita',
    title: 'Монолитная плита',
    intent: 'Основная специализация',
    price: `от ${PRICES.plita.from.toLocaleString('ru-RU')} ${PRICES.plita.unit}`,
    body:
      'Монолитный плитный фундамент под ключ — универсальное решение для дома из газобетона на ' +
      'пучинистых грунтах и при высоком уровне грунтовых вод, типичных для СПб и Ленобласти. ' +
      'Плита работает как единая жёсткая платформа и переносит сезонные подвижки грунта без трещин в стенах.',
    specs: [
      ['Бетон', 'М300 W6 F150'],
      ['Арматура', 'А500С'],
      ['Толщина', '250–350 мм'],
      ['Срок', '10–14 дней'],
    ],
  },
  {
    id: 'lenta',
    title: 'Ленточный фундамент',
    intent: 'Плотный грунт, лёгкий дом',
    price: 'Расчёт после замера',
    body:
      'Ленточный фундамент под ключ заливаем на плотных непучинистых грунтах под газобетон, кирпич ' +
      'и каркасные дома. Монолитная армированная лента под несущими стенами обходится дешевле плиты, ' +
      'когда геология участка это позволяет.',
    specs: [
      ['Тип', 'заглублённая / МЗЛФ'],
      ['Бетон', 'заводской, с паспортом'],
      ['Арматура', 'А500С'],
      ['Цена', 'зависит от объёма бетона'],
    ],
  },
  {
    id: 'svai',
    title: 'Свайный фундамент',
    intent: 'Торф, склон, сложный участок',
    price: 'Расчёт после замера',
    body:
      'Свайный фундамент (буронабивные и винтовые сваи) выбирают на торфе, заболоченных и неровных ' +
      'участках, где плита или лента потребовали бы дорогой выторфовки. Сваи с ростверком переносят ' +
      'нагрузку дома на плотные слои грунта.',
    specs: [
      ['Тип', 'буронабивные / винтовые'],
      ['Вариант', 'свайно-ростверковый'],
      ['Геология', 'входит в расчёт'],
      ['Гарантия', '5 лет'],
    ],
  },
];

const HOUSES = [
  {
    title: 'Коробка из газобетона ЛСР',
    price: 'Расчёт по проекту',
    desc:
      'Несущие стены и перегородки из газобетона ЛСР под крышу, без отделки. Вариант, когда ' +
      'отделку планируете делать сами или поэтапно.',
  },
  {
    title: 'Дом из газобетона под ключ',
    price: `от ${PRICES.dom.from.toLocaleString('ru-RU')} ${PRICES.dom.unit}`,
    desc:
      'Полный цикл: фундамент → коробка → кровля → инженерия → черновая отделка. ' +
      'Один договор и один ответственный за результат, без субподряда.',
  },
];

export default function TypesBlock() {
  return (
    <section id="uslugi" data-plane="paper" className="relative bg-paper0">
      <div className="container-x py-16 md:py-24">
        <SectionHead
          index="02"
          label="Виды фундаментов и цены"
          title={<>Плита, лента или&nbsp;сваи — решает грунт, а&nbsp;не&nbsp;прайс</>}
          lede="СК «Юрьевич» заливает фундаменты под ключ в Санкт-Петербурге и Ленинградской области. Тип подбираем по грунту участка: это решает и цену, и то, что будет с домом через несколько зим."
        />

        <div className="mt-10 grid gap-px border border-rule bg-rule/40 md:mt-14 md:grid-cols-3">
          {TYPES.map((t, i) => (
            <article
              key={t.id}
              className="flex flex-col bg-paper0 p-6 md:p-7"
              data-reveal
              style={{ ['--d' as any]: `${i * 90}ms` }}
            >
              <div className="eyebrow text-inkmute">{t.intent}</div>
              <h3 className="display-3 mt-3 text-graphite">{t.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-inkmute">{t.body}</p>

              <dl className="mt-5 border-t border-hair">
                {t.specs.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-3 border-b border-hair py-2">
                    <dt className="mono text-[11px] uppercase tracking-wider text-inkmute">{k}</dt>
                    <dd className="mono text-[12px] text-graphite">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="text-base font-extrabold text-graphite">{t.price}</div>
                <a
                  href="#calc"
                  className="mono text-xs text-signal ulink whitespace-nowrap"
                >
                  рассчитать →
                </a>
              </div>
            </article>
          ))}
        </div>

        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-inkmute">
          Не знаете, какой фундамент выбрать? Это нормально. Посмотрим геологию участка, посчитаем
          стоимость плиты, ленты и свай и честно скажем, где можно сэкономить без риска для дома.
          Работаем по районам ЛО:{' '}
          <Link href="/fundament/vsevolozhsk/" className="ulink text-graphite">Всеволожский</Link>,{' '}
          <Link href="/fundament/gatchina/" className="ulink text-graphite">Гатчинский</Link>,{' '}
          <Link href="/fundament/vyborg/" className="ulink text-graphite">Выборгский</Link> и{' '}
          <Link href="/fundament/" className="ulink text-graphite">другие районы</Link>.
        </p>

        {/* Дома из газобетона — второй продукт, без «продающего» давления */}
        <div className="mt-12 grid gap-px border border-rule bg-rule/40 md:grid-cols-2">
          {HOUSES.map((h, i) => (
            <div
              key={h.title}
              className="bg-paper2 p-6 md:p-7"
              data-reveal
              style={{ ['--d' as any]: `${i * 90}ms` }}
            >
              <div className="eyebrow text-inkmute">Дома из газобетона · партнёр ЛСР</div>
              <h3 className="mt-3 text-lg font-extrabold leading-snug text-graphite md:text-xl">
                {h.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-inkmute">{h.desc}</p>
              <div className="mono mt-4 text-sm text-graphite">{h.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
