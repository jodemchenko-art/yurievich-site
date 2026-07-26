import { SITE } from '@/lib/site';
import SectionHead from './SectionHead';

/**
 * КОМАНДА.
 *
 * Блок сделан как штамп чертежа — таблица «кто разработал / кто проверил /
 * кто утвердил». Форма выбрана не ради красоты: штамп отвечает ровно на тот
 * вопрос, который мучает заказчика, — кто персонально отвечает за результат.
 *
 * ⚠️ Портретов здесь нет намеренно. На сайте лежали три студийных портрета
 * с одинаковым фоном — это не братья Демченко. Ставить чужие лица в блок,
 * который отвечает за доверие, нельзя: одна такая деталь обесценивает всё
 * остальное. Как только Юрий пришлёт настоящие фото — добавляем сюда.
 */

const ROLES = [
  {
    role: 'Руководитель проекта',
    name: 'Юрий Демченко',
    duty: 'Ведёт клиента от первого звонка до сдачи: замер, смета, договор, финальная приёмка.',
    sign: 'Подписывает договор и гарантийный талон',
  },
  {
    role: 'Производитель работ',
    name: 'Валерий Демченко',
    duty: 'На объекте каждый день: бригада, технология армирования и заливки, соблюдение графика.',
    sign: 'Отвечает за качество работ на площадке',
  },
  {
    role: 'Технадзор и снабжение',
    name: 'Евгений Демченко',
    duty: 'Материалы и техника: бетон М300, арматура А500С, газобетон ЛСР. Закупки по чекам с завода.',
    sign: 'Проверяет паспорта на каждую партию',
  },
];

export default function TeamBlock() {
  return (
    <section id="brothers" className="relative overflow-hidden bg-bp-900 text-white">
      <div aria-hidden className="absolute inset-0 grid-paper-dark" />

      <div className="container-x relative py-16 md:py-24">
        <SectionHead
          index="07"
          label="Кто отвечает"
          dark
          title={<>Работают хозяева, а&nbsp;не&nbsp;наёмная бригада</>}
          lede="Три родных брата. Мы не нанимаем прорабов и не передаём объекты субподрядчикам — поэтому у каждой ошибки на площадке есть конкретная фамилия."
        />

        {/* Штамп: три позиции ответственности */}
        <div className="mt-10 grid gap-px border border-bp-line bg-bp-line md:mt-14 md:grid-cols-3">
          {ROLES.map((r, i) => (
            <article
              key={r.name}
              className="bg-bp-900 p-6 md:p-8"
              data-reveal
              style={{ ['--d' as any]: `${i * 90}ms` }}
            >
              <div className="eyebrow text-signal">{r.role}</div>
              <h3 className="display-3 mt-3 text-white">{r.name}</h3>
              <p className="mt-4 text-sm leading-relaxed text-bp-text">{r.duty}</p>
              <div className="mono mt-6 border-t border-bp-line pt-3 text-[11px] leading-relaxed text-white/70">
                {r.sign}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-end">
          <p className="max-w-2xl text-sm leading-relaxed text-bp-text" data-reveal>
            Фотографий команды здесь пока нет: снимать постановочные портреты «под сайт» мы не
            стали, а чужие лица из фотобанка ставить не будем. Как мы выглядим и как работаем —
            видно в канале стройки: там объекты, техника и люди в кадре каждый рабочий день.
          </p>

          <div className="flex flex-wrap gap-3" data-reveal style={{ ['--d' as any]: '90ms' }}>
            <a
              href={SITE.telegramChannel}
              target="_blank"
              rel="noopener"
              className="btn-line btn-line-dark mono border-white/25 text-xs text-white"
            >
              Канал стройки
              <span className="arw" aria-hidden>→</span>
            </a>
            <a
              href={SITE.telegram}
              target="_blank"
              rel="noopener"
              className="btn-line btn-line-dark mono border-white/25 text-xs text-white"
            >
              Написать Юрию
              <span className="arw" aria-hidden>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
