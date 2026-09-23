import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE, PRICES } from '@/lib/site';
import { FOUNDATION_TYPES } from '@/lib/foundation-types';
import { REGIONS } from '@/lib/regions';
import { buildGraph, buildBreadcrumb, buildFaqPage } from '@/lib/schema';
import { inPrep, ogDefaults } from '@/lib/seo-snippets';
import { byTag } from '@/lib/gallery';
import {
  PRICE_TABLE_COLUMNS,
  SIZE_AREA,
  calcPlita,
  fmtRub,
  type SizeKey,
} from '@/lib/pricing';

/**
 * /ceny/ — единая страница цен. По замеру выдачи 11.09.2026 запросы «фундамент под
 * ключ цена», «фундамент для дома цена спб» забирают страницы /price и /czenyi
 * конкурентов; у нас такой страницы не было. Цифры — из lib/pricing (та же модель,
 * что и калькулятор), по домам — из утверждённой матрицы комплектаций.
 */

const TITLE = 'Цены на фундамент под ключ в СПб и Ленобласти 2026';
const DESC = 'Цены на фундамент под ключ в СПб и Ленобласти 2026: монолитная плита от 5 500 ₽/м² с материалами по размерам и грунтам, лента и сваи — по проекту. Что входит в цену и от чего она зависит.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/ceny/' },
  openGraph: ogDefaults('/ceny/', `${TITLE} · ${SITE.name}`, DESC, 'website'),
};

// На странице цен плита показана коротко: 4 размера × газобетон 1/2 этажа на суглинке.
const CENY_SIZES: SizeKey[] = ['6x6', '8x10', '10x10', '12x12'];
const CENY_COLUMNS = PRICE_TABLE_COLUMNS.filter((c) => c.key === 'gazo-1' || c.key === 'gazo-2');

const FAQ = [
  {
    q: 'Сколько стоит фундамент под ключ в СПб и Ленобласти?',
    a: 'Монолитная плита — от 5 500 ₽/м² с материалами: плита 10×10 под одноэтажный дом из газобетона на суглинке от 594 000 ₽, под двухэтажный от 700 000 ₽. Лента и сваи считаются по проекту после замера. Цена фиксируется в договоре.',
  },
  {
    q: 'Почему нельзя назвать точную цену по телефону?',
    a: 'Потому что три величины известны только после замера: грунт (песок или торф — разница в полтора раза), уровень воды и подъезд для миксера. Мы называем порядок цифр по таблице сразу, а точную смету — в течение рабочего дня после бесплатного выезда.',
  },
  {
    q: 'Что входит в цену за м²?',
    a: 'Выезд инженера и расчёт, земляные работы, подушка с уплотнением, опалубка, арматура А500С, заводской бетон М300 W6 F150 с паспортом, заливка и уход, акт и гарантийный талон на 5 лет. Отдельно: выторфовка, дренаж, утепление, бетононасос.',
  },
  {
    q: 'Есть ли предоплата?',
    a: 'За работу — нет. Аванс идёт только на материалы по чекам с завода, дальше платите по принятым этапам. Цена в договоре не меняется без вашей подписи.',
  },
  {
    q: 'Сколько стоит дом из газобетона под ключ?',
    a: 'Холодный контур — 35 000 ₽/м² застройки, тёплый контур — 42 000, White Box — 60 000, под ключ — 70 000 ₽/м² за первый этаж. Второй этаж дешевле на 10 000 ₽/м², терраса и крыльцо — 15 000 ₽/м². Подробная матрица — на странице цен по домам.',
  },
];

const GRAPH = buildGraph(
  [
    {
      '@type': 'OfferCatalog',
      '@id': `${SITE.url}/ceny/#catalog`,
      name: 'Цены на фундаменты и дома из газобетона — СК Юрьевич',
      itemListElement: CENY_SIZES.map((size) => {
        const col = PRICE_TABLE_COLUMNS.find((c) => c.key === 'gazo-1')!;
        const r = calcPlita({ size, material: col.material, ground: 'suglinok', storeys: col.storeys });
        return {
          '@type': 'Offer',
          name: `Монолитная плита ${size.replace('x', '×')} м под одноэтажный дом из газобетона`,
          priceCurrency: 'RUB',
          price: r.total,
          availability: 'https://schema.org/InStock',
        };
      }),
    },
  ],
  [
    buildBreadcrumb('/ceny/', [
      { name: 'Главная', url: SITE.url },
      { name: 'Цены', url: `${SITE.url}/ceny/` },
    ]),
    buildFaqPage('/ceny/', FAQ)!,
  ]
);

export default function PricesPage() {
  const photos = byTag('plita').slice(0, 6);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(GRAPH) }} />

      <section className="container-x pt-10 md:pt-14 pb-8">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Цены</li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl">
          Цены на фундамент под ключ в Санкт-Петербурге и Ленобласти
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
          Порядок цифр — до звонка. Ниже ориентир по монолитной плите, условия по ленте и сваям и ставки
          по домам из газобетона. Все суммы включают работу и материалы; точная смета — в течение рабочего
          дня после бесплатного замера, цена фиксируется в договоре.
        </p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {FOUNDATION_TYPES.filter((t) => ['plita', 'lenta', 'svai', 'ushp'].includes(t.slug)).map((t) => (
            <Link key={t.slug} href={`/fundament/${t.slug}/`} className="block bg-white rounded-xl border border-brand-line p-5 hover:border-brand-ink hover:shadow-md transition">
              <div className="text-xs uppercase tracking-wider text-brand-mute">{t.name}</div>
              <div className="mt-1 text-xl font-extrabold text-brand-ink">{t.priceLabel}</div>
              <div className="mt-1 text-xs text-brand-mute leading-snug">{t.priceNote}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Плита: короткий ориентир. Полная матрица по грунтам и цена за м² живут на
          /fundament/plita/. 23.09.2026 Topvisor показал: по всему кластеру «монолитная плита
          цена» Яндекс выбирал эту страницу вместо посадочной, и кластер просел с 22–30 на 71–75.
          Одна цена плиты — одна страница; здесь остаётся сводка по всем типам. */}
      <section className="container-x pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Плитный фундамент: ориентир по размерам</h2>
        <p className="text-brand-mute mb-6 max-w-3xl">
          Дом из газобетона на суглинке — самом частом грунте Ленобласти. Ставка за м² по материалу стен,
          полная таблица по грунтам и калькулятор — на странице{' '}
          <Link href="/fundament/plita/#ceny" className="font-semibold text-brand-ink hover:underline">монолитная плита под ключ: цена за м²</Link>.
        </p>
        <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="bg-brand-sand">
                <th className="px-4 py-3">Размер плиты</th>
                {CENY_COLUMNS.map((c) => (
                  <th key={c.key} className="px-4 py-3">
                    <div className="font-extrabold">{c.label}</div>
                    <div className="text-xs font-normal text-brand-mute">{c.sub}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CENY_SIZES.map((size) => (
                <tr key={size} className="border-t border-brand-line">
                  <td className="px-4 py-3 font-bold whitespace-nowrap">
                    {size.replace('x', '×')} м <span className="font-normal text-brand-mute">· {SIZE_AREA[size]} м²</span>
                  </td>
                  {CENY_COLUMNS.map((c) => {
                    const r = calcPlita({ size, material: c.material, ground: 'suglinok', storeys: c.storeys });
                    return <td key={c.key} className="px-4 py-3 font-extrabold text-brand-ink whitespace-nowrap">от {fmtRub(r.total)} ₽</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-brand-mute">
          Плиты до 40 м² (баня, гараж) считаются по объёму — ставка за метр у них выше из-за минимального выезда техники.
          Второй этаж из газобетона добавляет к плите около 18 %: растут толщина и диаметр арматуры. Каркасный дом
          обходится дешевле — плита 250 мм и ставка 5 200 ₽/м², кирпич и монолитные перекрытия требуют плиту 350 мм
          и ставку 6 200 ₽/м². Разброс между грунтами, от песка до торфа, доходит до полутора раз, поэтому ставку
          за квадратный метр по грунтам смотрите на странице плиты.
        </p>
      </section>

      {/* Лента, сваи, УШП */}
      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Ленточный, свайный фундамент и УШП: как считаем</h2>
        <p>
          Для этих типов честная цена «от м²» не существует: лента считается по погонным метрам и сечению,
          сваи — по количеству и длине под вес дома, УШП — по плану первого этажа с тёплым полом. Поэтому
          мы не пишем выдуманное «от 3 000 ₽», а считаем после замера и бурения — бесплатно, в течение рабочего дня.
        </p>
        <ul>
          <li><strong>Лента</strong> на плотном сухом грунте под одноэтажный дом обычно дешевле плиты того же размера — меньше бетона. <Link href="/fundament/lenta/">Подробнее о ленте</Link>.</li>
          <li><strong>Винтовые сваи</strong> под каркасный дом или баню — самый недорогой и быстрый вариант; буронабивные с ростверком под газобетон — сопоставимы с плитой. <Link href="/fundament/svai/">Подробнее о сваях</Link>.</li>
          <li><strong>УШП</strong> дороже обычной плиты за счёт ЭППС и тёплого пола, но заменяет три этапа: фундамент, утепление и отопление пола. <Link href="/fundament/ushp/">Подробнее об УШП</Link>.</li>
        </ul>

        <h2>Что входит в цену фундамента и что считается отдельно</h2>
        <p>
          В ставку входит всё, без чего плиту нельзя сдать: выезд и расчёт, земляные работы, подушка с уплотнением,
          геотекстиль и гидроизоляция, опалубка, арматура А500С, заводской бетон М300 W6 F150 с паспортом, заливка,
          уход и зимний прогрев, акт и гарантийный талон на {SITE.warrantyYears} лет.
        </p>
        <p>
          Отдельными строками — только то, что зависит от участка и не у всех бывает: выторфовка и замена грунта,
          дренаж и ливнёвка, утепление ЭППС, бетононасос при сложном подъезде, лабораторная геология. Всё это мы
          называем до договора, а не после вскрытия котлована.
        </p>

        <h2>Из чего складывается смета: 9 строк, которые видит заказчик</h2>
        <p>
          Мы не даём смету одной цифрой «фундамент — столько-то». В документе девять позиций, и по каждой видно
          объём и цену: земляные работы и вывоз грунта; песчаная подушка с уплотнением; геотекстиль и гидроизоляция;
          опалубка и её демонтаж; арматура с диаметром и шагом; бетон в кубах с классом и маркой; заливка
          с виброуплотнением; уход за бетоном и зимний прогрев; доставка.
        </p>
        <p>
          Такая смета нужна не для красоты. По ней можно сравнить нас с другим подрядчиком строчка в строчку,
          а не «по общей сумме». И если вы решите что-то изменить — например, увеличить толщину плиты
          с 300 до 350 мм — пересчитывается одна позиция, и вы видите точную разницу, а не «будет дороже тысяч на сто».
        </p>

        <h2>Почему нельзя назвать цену по телефону</h2>
        <p>
          Самый частый вопрос: «просто скажите, сколько стоит плита 10 на 10». Честный ответ — от 550 тысяч
          до полутора миллионов, и такой разброс не про наценку, а про грунт. На сухих песках Выборгского района
          это плита 250 мм с подушкой 200 мм. На торфянике в Лесколово — та же плита, но с выторфовкой двух метров,
          вывозом грунта и заменой его песком с уплотнением: работы втрое больше.
        </p>
        <p>
          Поэтому мы приезжаем, бурим четыре точки по углам пятна застройки на 4–6 метров, смотрим, что под верхним
          слоем и где стоит вода. Это занимает полдня и стоит ноль рублей. Только после этого появляется смета,
          под которой мы готовы подписаться. Если подрядчик называет точную цену по телефону, не видя участка, —
          он либо заложил максимальный запас, и вы переплачиваете, либо не заложил ничего, и разницу принесёт
          допсоглашение в середине работ.
        </p>

        <h2>Как сравнивать предложения между собой</h2>
        <p>
          Разброс цен на одну и ту же плиту в Петербурге доходит до двух раз и почти всегда объясняется составом
          работ, а не жадностью. Проверьте в чужой смете шесть вещей: класс бетона и наличие паспорта на каждую
          машину; диаметр и шаг арматуры; толщину плиты; входит ли подушка и какой толщины; есть ли гидроизоляция
          и геотекстиль; заложен ли уход за бетоном и зимний прогрев.
        </p>
        <p>
          Типичная экономия «дешёвого» предложения выглядит так: бетон класса ниже проектного, арматура Ø10 вместо
          Ø12, подушка 100 мм вместо 300, отсутствие гидроизоляции, работа без ухода за бетоном. В сумме это минус
          25–30 % к цене и минус десятилетия к сроку службы: трещины появляются на второй-третий сезон, когда
          бригады уже не найти.
        </p>

        <h2>Оплата: только за принятые этапы</h2>
        <p>
          Предоплаты за работу нет. Аванс идёт на материалы по чекам с завода — вы видите, за что платите.
          Дальше оплата по этапам: подушка, армокаркас, заливка. Каждый этап закрывается актом, и пока акт
          не подписан, следующий платёж не наступает. Цена в договоре фиксированная и не меняется без вашей подписи.
        </p>

        <h2>Сколько стоят отдельные работы</h2>
        <p>
          Иногда нужен не фундамент целиком, а часть работ: выторфовка перед чужой бригадой, подушка,
          дренаж по периметру готовой плиты. Мы такое делаем, и цена считается по объёму. Выторфовка
          и замена грунта — по кубам вынутого и завезённого с учётом вывоза. Дренаж по периметру плиты
          дома 10×10 — обычно 60–120 тысяч рублей в зависимости от глубины и наличия колодцев.
          Песчаная подушка с уплотнением — по объёму песка и площади трамбовки.
        </p>
        <p>
          Отдельно считается геология. Ручное бурение в четырёх точках мы делаем бесплатно в рамках замера:
          этого достаточно, чтобы подобрать фундамент под частный дом. Лабораторные изыскания с отчётом
          нужны редко — под тяжёлый дом, на явно проблемном участке или если этого требует проектировщик.
          Стоят они 15–25 тысяч рублей и заказываются в профильной организации, мы только помогаем
          с постановкой задачи.
        </p>

        <h2>Сроки: сколько ждать от заявки до готовой плиты</h2>
        <p>
          Выезд инженера — в течение 1–3 дней после заявки, в Курортном районе часто в день обращения.
          Смета по позициям — на следующий рабочий день после замера. Договор подписываем за день,
          дальше выход на участок зависит от загрузки: в сезон это 1–3 недели, зимой обычно быстрее.
        </p>
        <p>
          Сами работы по плите 100 м² — 10–14 рабочих дней: подготовка и подушка, опалубка и армирование,
          заливка, уход. Плюс 28 суток на набор прочности бетоном до начала кладки стен. Этот месяц
          не сокращается ничем, и подрядчик, который предлагает класть стены через неделю, экономит
          на прочности вашего дома.
        </p>

        <h2>Цены по районам</h2>
        <p>
          База в посёлке Песочный. В радиусе 30 км от КАД действует базовая ставка; дальше растёт стоимость
          доставки бетона — это отражено в ставках районов:{' '}
          {REGIONS.map((r, i) => (
            <span key={r.slug}>
              <Link href={`/fundament/${r.slug}/`}>{inPrep(r.prepositional)}</Link> от {r.priceFrom.toLocaleString('ru-RU')} ₽/м²{i < REGIONS.length - 1 ? ', ' : '.'}
            </span>
          ))}
        </p>
      </section>

      {/* Дома */}
      <section className="container-x pb-12">
        <div className="rounded-2xl border border-brand-line bg-white p-6 md:p-8">
          <h2 className="text-2xl md:text-3xl font-extrabold">Дом из газобетона: ставки по комплектациям</h2>
          <p className="mt-3 text-brand-mute max-w-3xl">За м² площади застройки, первый этаж. Второй этаж — минус 10 000 ₽/м², терраса и крыльцо — 15 000 ₽/м².</p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ['Холодный контур', PRICES.holodnyy.from, '2 месяца'],
              ['Тёплый контур', PRICES.teplyy.from, '3 месяца'],
              ['White Box', PRICES.whitebox.from, '5 месяцев'],
              ['Под ключ', PRICES.dom.from, '6 месяцев'],
            ].map(([n, p, s]) => (
              <div key={String(n)} className="rounded-xl border border-brand-line bg-brand-sand p-5">
                <div className="text-xs uppercase tracking-wider text-brand-mute">{n}</div>
                <div className="mt-1 text-xl font-extrabold text-brand-ink">{Number(p).toLocaleString('ru-RU')} ₽/м²</div>
                <div className="text-xs text-brand-mute">срок {s}</div>
              </div>
            ))}
          </div>
          <p className="mt-5"><Link href="/doma/ceny/" className="font-bold text-brand-ink hover:underline">Полная матрица комплектаций и что входит в каждую →</Link></p>
        </div>
      </section>

      {photos.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Что вы получаете за эти деньги</h2>
          <p className="text-brand-mute mb-6 max-w-3xl">Наши плиты на объектах в Ленобласти: армокаркас перед заливкой и результат.</p>
          <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
            {photos.map((ph) => (
              <figure key={ph.src}>
                <img src={ph.thumb} alt={ph.alt} className="aspect-[4/3] w-full rounded-2xl object-cover border border-brand-line" loading="lazy" />
                <figcaption className="mt-1 text-xs text-brand-mute">{ph.alt}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Чем наша смета отличается от «коммерческого предложения» на одну страницу</h2>
        <p>
          Типичное КП в нише — лист с логотипом, площадью и итоговой суммой. Проверить в нём нечего:
          не видно ни класса бетона, ни диаметра арматуры, ни толщины подушки. Такое КП удобно подрядчику —
          оно не связывает его обязательствами по составу работ, и любую позицию потом можно объявить
          «не входившей в стоимость».
        </p>
        <p>
          Наша смета занимает две-три страницы и содержит объёмы по каждой позиции. Это неудобно
          при первом разговоре — цифр много, — зато после подписания у вас есть документ, по которому
          можно принимать работу. Если на объект привезли бетон другого класса или арматуру меньшего
          диаметра, это видно не по ощущениям, а по строке в приложении к договору.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Считаем бесплатно и не навязываем</h2>
        <p>
          Выезд инженера, бурение, замер и смета — бесплатно и ни к чему не обязывают. Мы не берём предоплату за расчёт и не звоним после него по десять раз: если предложение не подошло, вы просто им не пользуетесь. Смета остаётся у вас — с ней можно идти к другому подрядчику и сравнивать построчно.
        </p>
        <p>
          Единственное, о чём просим, — показать участок, а не только координаты. Полчаса на месте дают больше, чем часовой разговор по телефону: видно подъезд для миксера, перепад высот, соседние постройки и то, куда девать вынутый грунт.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Вопросы о цене</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white border border-brand-line p-5 md:p-6 open:border-brand-ink transition">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-lg leading-snug text-brand-ink">
                <span>{f.q}</span><span className="flex-shrink-0 text-brand-mute group-open:rotate-180 transition-transform mt-1">▾</span>
              </summary>
              <p className="mt-4 text-brand-mute leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-x pb-20">
        <div className="rounded-2xl bg-brand-ink text-white p-7 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Точная смета — за один рабочий день</h2>
          <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">Бесплатный выезд инженера, бурение, смета построчно. Цена фиксируется в договоре, оплата по принятым этапам.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/#calc" className="rounded-xl bg-amber-400 text-brand-ink px-7 py-4 font-bold no-underline hover:opacity-90 transition">Получить расчёт →</Link>
            <a href={`tel:${SITE.phoneRaw}`} className="rounded-xl border border-white/40 px-7 py-4 font-bold no-underline hover:bg-white/10 transition">Позвонить</a>
          </div>
        </div>
      </section>
    </>
  );
}
