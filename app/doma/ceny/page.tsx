import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { byTag } from '@/lib/gallery';
import { KOMPLEKTACII, TERRACE_RATE, calcHouse, fmtMln, MATERIALS, NOT_INCLUDED } from '@/lib/doma';
import { buildGraph, buildBreadcrumb, buildFaqPage } from '@/lib/schema';
import { ogDefaults } from '@/lib/seo-snippets';

const TITLE = 'Цены на дом из газобетона в СПб: комплектации и ставки за м²';
const DESC = 'Цены на дом из газобетона в СПб и Ленобласти: холодный контур 35 000, тёплый 42 000, White Box 60 000, под ключ 70 000 ₽/м². Состав комплектаций, примеры расчёта, оплата этапами.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/doma/ceny/' },
  openGraph: ogDefaults('/doma/ceny/', `${TITLE} · ${SITE.name}`, DESC, 'website', '/images/doma/dom-02.jpg'),
};

const EXAMPLES: Array<{ name: string; f1: number; f2: number; terr: number; big?: boolean }> = [
  { name: 'Одноэтажный 80 м²', f1: 80, f2: 0, terr: 8 },
  { name: 'Одноэтажный 100 м² с террасой', f1: 100, f2: 0, terr: 12 },
  { name: 'Одноэтажный 130 м²', f1: 130, f2: 0, terr: 15 },
  { name: 'Двухэтажный 80 + 80 м²', f1: 80, f2: 80, terr: 6, big: true },
  { name: 'Двухэтажный 100 + 100 м²', f1: 100, f2: 100, terr: 10, big: true },
];

const FAQ = [
  { q: 'Почему второй этаж дешевле первого?', a: 'Под первым этажом — плита, земляные работы и подготовка основания. Под вторым их нет, поэтому ставка на второй этаж на 10 000 ₽/м² ниже во всех комплектациях.' },
  { q: 'Что за порог 150 м² и по какой площади он считается?', a: 'Порог считается по жилой площади из проекта (сумма помещений обоих этажей, без террасы и крыльца). Если она больше 150 м², White Box и «под ключ» идут на 5 000 ₽/м² дешевле. Сама сумма умножается на площадь застройки без террасы и крыльца — это другое число, оно больше жилой на толщину стен.' },
  { q: 'Что не входит в «под ключ»?', a: 'Мебель, бытовая техника, участок (забор, дорожки, ландшафт), наружные сети за пределами дома, если они не оговорены в КП. Всё остальное — от плиты до сантехники — входит. Полный состав работ и марок материалов выдаём документом до договора.' },
  { q: 'Можно ли изменить комплектацию по ходу стройки?', a: 'Да, до начала соответствующего этапа: например, взять холодный контур, а весной перейти на тёплый. Пересчитывается только новый слой работ, остальное — по договору.' },
];

export default function DomaCenyPage() {
  const photos = byTag('doma').slice(0, 6);
  const graph = buildGraph(
    [],
    [
      buildBreadcrumb('/doma/ceny/', [
        { name: 'Главная', url: SITE.url },
        { name: 'Дома из газобетона', url: `${SITE.url}/doma/` },
        { name: 'Цены', url: `${SITE.url}/doma/ceny/` },
      ]),
      buildFaqPage('/doma/ceny/', FAQ)!,
    ]
  );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }} />
      <section className="container-x pt-10 md:pt-14 pb-8">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li><Link href="/doma/" className="hover:text-brand-ink transition">Дома из газобетона</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Цены</li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl">Цены на дом из газобетона в Санкт-Петербурге и Ленобласти</h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
          Четыре комплектации, одна формула: площадь застройки первого этажа × ставка + площадь второго этажа × (ставка − 10 000) + терраса и крыльцо × {TERRACE_RATE.toLocaleString('ru-RU')}.
          Доставка материалов уже в ставке. Цены 2026 года, фиксируются в договоре.
        </p>
      </section>

      <section className="container-x pb-12">
        <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-brand-sand">
                <th className="px-4 py-3">Комплектация</th>
                <th className="px-4 py-3">1-й этаж, ₽/м²</th>
                <th className="px-4 py-3">2-й этаж, ₽/м²</th>
                <th className="px-4 py-3">Жилая свыше 150 м²</th>
                <th className="px-4 py-3">Срок</th>
              </tr>
            </thead>
            <tbody>
              {KOMPLEKTACII.map((k) => (
                <tr key={k.slug} className="border-t border-brand-line">
                  <td className="px-4 py-3 font-bold text-brand-ink">{k.name}{k.popular ? <span className="ml-2 rounded-full bg-brand-sand px-2 py-0.5 text-xs font-semibold">берут чаще всего</span> : null}</td>
                  <td className="px-4 py-3 font-extrabold">{k.rate1.toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-3">{k.rate2.toLocaleString('ru-RU')}</td>
                  <td className="px-4 py-3">{k.rate1Big === k.rate1 ? 'без изменений' : `${k.rate1Big.toLocaleString('ru-RU')} / ${k.rate2Big.toLocaleString('ru-RU')}`}</td>
                  <td className="px-4 py-3">{k.months} мес.</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-brand-mute">Терраса и крыльцо — {TERRACE_RATE.toLocaleString('ru-RU')} ₽/м² отдельной строкой во всех комплектациях. Оплата этапами 25/25/25/25 по принятым работам.</p>
      </section>

      <section className="container-x pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Примеры расчёта</h2>
        <div className="overflow-x-auto rounded-2xl border border-brand-line bg-white">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="bg-brand-sand">
                <th className="px-4 py-3">Дом</th>
                {KOMPLEKTACII.map((k) => <th key={k.slug} className="px-4 py-3">{k.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {EXAMPLES.map((e) => (
                <tr key={e.name} className="border-t border-brand-line">
                  <td className="px-4 py-3 font-bold text-brand-ink">{e.name}<div className="text-xs font-normal text-brand-mute">терраса/крыльцо {e.terr} м²{e.big ? ' · жилая свыше 150 м²' : ''}</div></td>
                  {KOMPLEKTACII.map((k) => <td key={k.slug} className="px-4 py-3 whitespace-nowrap font-semibold">{fmtMln(calcHouse(k, e.f1, e.f2, e.terr, !!e.big))}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Как считается цена */}
      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Как считается цена дома: две площади, которые нельзя путать</h2>
        <p>
          В строительстве ходят два числа, и на их подмене теряются сотни тысяч рублей. <strong>Площадь застройки</strong> —
          это габарит дома по наружным стенам, то, что реально строится и на что умножается ставка. <strong>Жилая площадь</strong> —
          сумма помещений внутри стен из ТЭП проекта, она всегда меньше на толщину стен и перегородок. Дом с жилой площадью
          147 м² может иметь площадь застройки 180 м² — разница в 33 м², то есть больше двух миллионов рублей по ставке «под ключ».
        </p>
        <p>
          У нас правило простое и одинаковое для всех: <strong>ставка умножается на площадь застройки</strong> без террасы и крыльца,
          а <strong>порог 150 м², после которого цена за метр снижается, считается по жилой площади</strong>. Терраса и крыльцо
          идут отдельной строкой по {TERRACE_RATE.toLocaleString('ru-RU')} ₽/м² — они дешевле, потому что там нет ни утепления,
          ни отделки, ни инженерии.
        </p>
        <p>
          Второй этаж дешевле первого на 10 000 ₽/м² во всех комплектациях. Причина не в маркетинге: под первым этажом лежит
          монолитная плита, земляные работы и подготовка основания — под вторым их нет. Формула целиком:{' '}
          <code>этаж 1 × ставка + этаж 2 × (ставка − 10 000) + (терраса + крыльцо) × {TERRACE_RATE.toLocaleString('ru-RU')}</code>.
        </p>
        <p>
          Доставка материалов уже заложена в ставку — отдельной строкой «логистика» в смете не появится. Цена фиксируется
          в договоре и не меняется без вашей подписи: если вы сами решаете добавить окно или перенести стену, оформляем
          допсоглашение только на эту разницу.
        </p>

        <h2>Оплата: 25 / 25 / 25 / 25 по факту принятых работ</h2>
        <p>
          Предоплаты за работу нет. Первый платёж идёт на материалы по чекам с завода — вы видите, за что платите.
          Дальше четыре равные части по принятым этапам: фундамент, коробка с кровлей, тёплый контур, отделка.
          Каждый этап закрывается актом, и пока акт не подписан, следующий платёж не наступает.
        </p>
        <p>
          Комплектацию можно поднять по ходу стройки — до начала соответствующего этапа. Частый сценарий:
          заказчик берёт тёплый контур осенью, зимует, а весной доводит до White Box. Пересчитывается только новый слой работ,
          остальное остаётся по договору. С ипотекой не работаем, расчёт наличными или переводом.
        </p>

        <h2>Что входит в каждую ступень</h2>
        {KOMPLEKTACII.map((k) => (
          <div key={k.slug}>
            <h3>{k.name} — {k.rate1.toLocaleString('ru-RU')} ₽/м², {k.months} мес.</h3>
            <p>{k.short}</p>
            <ul>{k.includes.map((x) => <li key={x}>{x}</li>)}</ul>
            <p><em>Не входит:</em> {k.excludes.join(', ').toLowerCase()}.</p>
          </div>
        ))}
      </section>

      {/* Полный состав по разделам */}
      <section className="container-x pb-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Состав работ и марки материалов</h2>
        <p className="text-brand-mute mb-8 max-w-3xl leading-relaxed">
          Это тот же документ, который выдаём заказчику до договора. Марки указаны конкретные, а не «материалы премиум-класса»:
          по ним можно поехать в магазин и проверить цену. Если какой-то позиции на рынке не стало, меняем на равную
          по характеристикам и согласовываем с вами письменно.
        </p>
        <div className="space-y-6">
          {MATERIALS.map((m) => (
            <article key={m.title} className="rounded-2xl border border-brand-line bg-white p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-3">
                <h3 className="text-xl font-extrabold text-brand-ink">{m.title}</h3>
                <span className="text-xs font-semibold uppercase tracking-wider text-brand-mute">{m.inComplectations}</span>
              </div>
              <p className="mt-3 text-sm text-brand-mute leading-relaxed">{m.intro}</p>
              <p className="mt-3 text-sm text-brand-mute leading-relaxed"><strong className="text-brand-ink">Работы:</strong> {m.works}</p>
              <table className="mt-4 w-full text-sm">
                <tbody>
                  {m.materials.map(([k, v]) => (
                    <tr key={k} className="border-t border-brand-line align-top">
                      <td className="py-2 pr-4 font-semibold text-brand-ink whitespace-nowrap">{k}</td>
                      <td className="py-2 text-brand-mute">{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </article>
          ))}
        </div>
      </section>

      {/* Что не входит */}
      <section className="container-x pb-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Чего нет ни в одной комплектации</h2>
        <p className="text-brand-mute mb-5 max-w-3xl leading-relaxed">
          Список короткий, но его лучше прочитать до договора. Всё перечисленное можно сделать — просто это отдельные
          работы и отдельные деньги, и мы не прячем их внутри ставки за квадратный метр.
        </p>
        <ul className="grid gap-2 sm:grid-cols-2">
          {NOT_INCLUDED.map((x) => (
            <li key={x} className="flex gap-2 rounded-xl border border-brand-line bg-brand-sand p-4 text-sm text-brand-mute">
              <span className="font-bold text-brand-ink">–</span>
              <span>{x}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>На чём можно сэкономить, а на чём нельзя</h2>
        <p>
          <strong>Можно.</strong> Отделка — самый гибкий слой: взять тёплый контур и делать её постепенно
          своими силами. Площадь: минус 20 м² при грамотной планировке почти не чувствуются в жизни,
          но дают около полутора миллионов на «под ключ». Сложность формы: прямоугольный дом с двускатной
          кровлей дешевле дома с эркерами и пятью углами при той же площади. Терраса: её можно сделать
          через год, оставив закладные.
        </p>
        <p>
          <strong>Нельзя.</strong> Фундамент — переделать его невозможно, а неравномерная осадка рвёт
          газобетон по швам. Утепление контура и качество монтажа окон: экономия здесь возвращается
          счетами за отопление каждый месяц двадцать лет. Кровельный пирог: «потом утеплим изнутри»
          означает демонтаж готовой отделки. Инженерия в стяжке: дешёвая труба в бетоне — это лотерея,
          которую вскрывают перфоратором.
        </p>
        <p>
          Разумный порядок приоритетов такой: сначала конструктив и контур, потом инженерия, потом отделка.
          Именно поэтому тёплый контур берут чаще остальных комплектаций — он закрывает первые два пункта
          и оставляет свободу по третьему.
        </p>

        <h2>Почему мы не называем цену «от 25 000 ₽ за метр»</h2>
        <p>
          На рынке легко встретить ставку вдвое ниже нашей. Разница объясняется просто: в неё не входит либо фундамент,
          либо кровельный пирог с утеплением, либо инженерия, либо всё сразу — а иногда входит, но материалами,
          названия которых не пишут. Мы считаем, что честнее показать полный состав и одну сумму, чем заманить
          низкой цифрой и добирать допсоглашениями.
        </p>
        <p>
          Проверить любое предложение можно шестью вопросами: какой класс бетона в плите и есть ли паспорт;
          входит ли утепление кровли и какой толщины; какой оконный профиль и стеклопакет; что именно значит «инженерия»;
          фиксируется ли цена в договоре; и как оформляются скрытые работы. Если на все шесть отвечают конкретикой —
          с подрядчиком можно работать, даже если это не мы.
        </p>
      </section>

      {photos.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Дома, которые мы строим</h2>
          <p className="text-brand-mute mb-6 max-w-3xl">Кладка, перекрытия, кровля — этапы, за которые вы платите.</p>
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
        <h2>Что происходит, если материалы подорожали</h2>
        <p>
          Вопрос, который задают все и на который у большинства подрядчиков нет внятного ответа. У нас так:
          цена в договоре зафиксирована на весь срок работ по подписанному этапу. Материалы на этап
          закупаются в начале этапа — именно поэтому первый платёж идёт на материалы по чекам с завода,
          а не «на работы». Подорожание внутри этапа — наш риск, а не ваш.
        </p>
        <p>
          Если стройка растянута по годам и следующий этап начинается через сезон, он считается заново
          по актуальным ценам — но уже выполненное и оплаченное не пересматривается никогда. Новый этап
          оформляется отдельным договором со своей фиксацией.
        </p>
        <p>
          Чего мы не делаем: не вписываем в договор пункт «цена может быть изменена в связи с рыночными
          условиями». Такая формулировка означает, что цены в договоре нет вообще.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Сравнение комплектаций в деньгах: что даёт каждый следующий шаг</h2>
        <p>
          Переход от холодного контура к тёплому стоит 7 000 ₽/м² — за эти деньги дом получает окна, входную дверь, утепление и пароизоляцию. На доме 100 м² это 700 тысяч рублей, и это самая выгодная покупка из всех: без неё коробка не может зимовать без потерь, а внутри нельзя работать в холода.
        </p>
        <p>
          Шаг от тёплого контура к White Box — 18 000 ₽/м², то есть 1,8 млн на том же доме. Здесь появляются фасад, вся инженерия, котельная, тёплые полы, стяжки и штукатурка. Это самый большой и самый «технический» слой: именно он превращает коробку в дом, где можно жить.
        </p>
        <p>
          Последний шаг до «под ключ» — 10 000 ₽/м², или миллион: чистовая отделка, двери, сантехника, свет. Его чаще всего и берут на себя заказчики, потому что здесь выбор материалов индивидуален, а работы понятны и контролируемы без специальных знаний.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Три вопроса, которые стоит задать нам перед договором</h2>
        <p>
          «Что будет, если я захочу поменять планировку в процессе?» До начала соответствующего этапа — оформим допсоглашение на разницу. Перенос перегородки до штукатурки стоит недорого, после инженерии и стяжки — заметно дороже, потому что под перегородкой уже проложены трассы. Мы всегда говорим цену изменения до того, как его делать.
        </p>
        <p>
          «Кто отвечает, если подрядчик по инженерии сделал плохо?» У нас нет отдельного подрядчика по инженерии: всё в одном договоре и одной ответственности. Если вы хотите привлечь своих отделочников или электриков — это нормально, но тогда мы разделяем зоны ответственности письменно и фиксируем состояние объекта на момент передачи.
        </p>
        <p>
          «Можно ли посмотреть дом, который вы уже построили?» Да, возим на действующие объекты — в работе всегда есть несколько. Дом на этапе коробки или отделки показывает о качестве больше, чем готовый: видно кладку, узлы, армопояс, разводку до закрытия.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Вопросы о ценах на дом</h2>
        <div className="space-y-3">
          {FAQ.map((f) => (
            <details key={f.q} className="group rounded-2xl bg-white border border-brand-line p-5 md:p-6 open:border-brand-ink transition">
              <summary className="cursor-pointer list-none flex items-start justify-between gap-4 font-bold text-lg leading-snug text-brand-ink"><span>{f.q}</span><span className="flex-shrink-0 text-brand-mute group-open:rotate-180 transition-transform mt-1">▾</span></summary>
              <p className="mt-4 text-brand-mute leading-relaxed">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="container-x pb-16">
        <div className="rounded-2xl bg-brand-ink text-white p-7 md:p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Посчитаем ваш дом по проекту</h2>
          <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">Пришлите план или размеры — вернём расчёт четырёх комплектаций и состав работ документом.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={SITE.telegram} target="_blank" rel="noopener" className="rounded-xl bg-amber-400 text-brand-ink px-7 py-4 font-bold no-underline hover:opacity-90 transition">Написать в Telegram →</a>
            <Link href="/doma/etapy/" className="rounded-xl border border-white/40 px-7 py-4 font-bold no-underline hover:bg-white/10 transition">Этапы стройки</Link>
          </div>
        </div>
      </section>
    </>
  );
}
