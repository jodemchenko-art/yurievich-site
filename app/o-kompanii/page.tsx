import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { photosBy } from '@/lib/gallery';
import { buildGraph, buildBreadcrumb, buildFaqPage } from '@/lib/schema';
import { ogDefaults } from '@/lib/seo-snippets';

/**
 * /o-kompanii/ — кто мы. Факты только из проверенных активов (lib/site.ts):
 * год, объекты, реквизиты, роли братьев без «старший/младший». Фото — реальные,
 * с площадок (Юрий на объектах).
 */

const TITLE = 'О компании: семейная бригада, фундаменты и дома с 2018 года';
const DESC = 'СК Юрьевич — семейная строительная компания в Санкт-Петербурге: три брата Демченко, монолитные плиты и дома из газобетона в СПб и Ленобласти с 2018 года. 239 объектов, договор, гарантия 5 лет.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/o-kompanii/' },
  openGraph: ogDefaults('/o-kompanii/', `${TITLE} · ${SITE.name}`, DESC, 'website'),
};

const TEAM = [
  { role: 'Руководитель проекта', name: 'Юрий Демченко', duty: 'Ведёт клиента от первого звонка до сдачи: замер, смета, договор, приёмка. Подписывает договор и гарантийный талон.' },
  { role: 'Производитель работ', name: 'Валерий Демченко', duty: 'На объекте каждый день: бригада, технология армирования и заливки, график. Отвечает за качество на площадке.' },
  { role: 'Технадзор и снабжение', name: 'Евгений Демченко', duty: 'Материалы и техника: бетон М300, арматура А500С, газобетон ЛСР. Закупки по чекам с завода, проверяет паспорта на каждую партию.' },
];

const FAQ = [
  { q: 'Вы компания или бригада?', a: 'Индивидуальный предприниматель с собственной бригадой и техникой. Работают сами братья Демченко — без субподряда и посредников. Реквизиты открыты: ИНН ' + SITE.inn + ', ОГРНИП ' + SITE.ogrnip + '.' },
  { q: 'Где вы находитесь и куда выезжаете?', a: 'База в посёлке Песочный, юридический адрес — ' + SITE.fullAddress + '. Работаем по Санкт-Петербургу и всей Ленобласти: Всеволожский, Гатчинский, Выборгский, Тосненский, Кировский, Приозерский, Ломоносовский районы, Курортный район. Выезд на замер бесплатный.' },
  { q: 'Сколько объектов вы построили?', a: String(SITE.projectsCount) + ' объектов с ' + SITE.foundedYear + ' года — в основном монолитные плиты под дома из газобетона, а также ленточные и свайные фундаменты и дома под ключ. Фото с площадок — на странице объектов.' },
  { q: 'Чем вы отличаетесь от других?', a: 'Тем, что отвечаем лично: договор подписывает Юрий, на объекте каждый день Валерий, материалы принимает Евгений. Цена фиксируется в договоре, оплата по принятым этапам, гарантия 5 лет. Отзывов на сайте нет — смотрите на Авито и в Картах.' },
];

const GRAPH = buildGraph(
  [
    {
      '@type': 'AboutPage',
      '@id': `${SITE.url}/o-kompanii/#about`,
      name: TITLE,
      about: { '@id': `${SITE.url}/#organization` },
    },
  ],
  [
    buildBreadcrumb('/o-kompanii/', [
      { name: 'Главная', url: SITE.url },
      { name: 'О компании', url: `${SITE.url}/o-kompanii/` },
    ]),
    buildFaqPage('/o-kompanii/', FAQ)!,
  ]
);

export default function AboutPage() {
  const photos = photosBy('team');
  const portrait = photos.find((p) => p.stage === 'Портрет');
  const onSite = photos.filter((p) => p.stage !== 'Портрет');
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(GRAPH) }} />

      <section className="container-x pt-10 md:pt-14 pb-8">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">О компании</li>
          </ol>
        </nav>
        <div className="grid gap-8 lg:grid-cols-[1fr_minmax(280px,380px)] items-start">
          <div>
            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight">
              СК «Юрьевич»: три брата, {SITE.projectsCount} объектов, один ответственный
            </h1>
            <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
              Семейная строительная компания из Санкт-Петербурга. С {SITE.foundedYear} года заливаем монолитные
              плиты и строим дома из газобетона в СПб и Ленобласти. Работаем сами: договор подписывает Юрий,
              на объекте каждый день Валерий, материалы принимает Евгений. Без субподряда, без менеджеров-посредников.
            </p>
            <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                [String(SITE.projectsCount), 'объектов с ' + SITE.foundedYear],
                [SITE.rating + ' из 5', SITE.reviewsCount + ' отзывов на Авито'],
                [SITE.warrantyYears + ' лет', 'гарантия в договоре'],
                ['ЛСР', 'партнёр по газобетону'],
              ].map(([v, l]) => (
                <div key={l} className="bg-white rounded-xl border border-brand-line p-4">
                  <div className="text-xl font-extrabold text-brand-ink">{v}</div>
                  <div className="text-xs text-brand-mute mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
          {portrait && (
            <figure className="overflow-hidden rounded-2xl border border-brand-line bg-white">
              <img src={portrait.src} alt={portrait.alt} className="w-full aspect-[4/5] object-cover" />
              <figcaption className="px-4 py-3 text-sm text-brand-mute">{portrait.alt}</figcaption>
            </figure>
          )}
        </div>
      </section>

      <section className="container-x pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Кто за что отвечает</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {TEAM.map((t) => (
            <div key={t.name} className="rounded-2xl border border-brand-line bg-white p-6">
              <div className="text-xs uppercase tracking-wider text-brand-mute">{t.role}</div>
              <div className="mt-1 text-xl font-extrabold text-brand-ink">{t.name}</div>
              <p className="mt-3 text-sm text-brand-mute leading-relaxed">{t.duty}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-12">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Юрий на объектах</h2>
        <p className="text-brand-mute mb-6 max-w-3xl">Руководитель проекта принимает каждый армокаркас лично — до того, как приедет бетон. Кадры с площадок, без постановки.</p>
        <div className="grid gap-3 grid-cols-2 md:grid-cols-3">
          {onSite.map((p) => (
            <figure key={p.src} className="overflow-hidden rounded-xl border border-brand-line bg-white">
              <img src={p.thumb} alt={p.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
              <figcaption className="px-3 py-2 text-xs text-brand-mute">{p.alt}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Как мы работаем</h2>
        <p>
          Сначала — бесплатный выезд инженера и ручное бурение в углах пятна застройки: без этого мы не считаем
          фундамент. Потом смета построчно в течение рабочего дня и договор с фиксированной ценой. Предоплаты
          за работу нет: аванс идёт только на материалы по чекам с завода, дальше — оплата по принятым этапам
          с актом на каждый. При сдаче — гарантийный талон на {SITE.warrantyYears} лет и паспорта на бетон и арматуру.
        </p>
        <h2>Как мы дошли до домов от фундаментов</h2>
        <p>
          Компания начиналась с монолитных плит, и первые годы мы делали только их. Это дало то, чего обычно
          не хватает строителям домов: мы знаем, что происходит под домом, и не относимся к фундаменту как
          к «нулевому циклу, который надо быстрее проскочить». Через наши руки прошли торфяники Лесколово,
          карбонатные глины Гатчины, морена с валунами под Выборгом — и почти каждый сложный случай заканчивался
          одним выводом: проблемы дома растут снизу.
        </p>
        <p>
          Когда заказчики стали просить построить и коробку, мы согласились не сразу: не хотелось становиться
          компанией, которая обещает всё и не отвечает ни за что. Решили так — строим только из газобетона,
          только своей бригадой и только там, куда можем приехать в тот же день. Поэтому у нас нет ни СИП-панелей,
          ни каркасников, ни объектов за 150 километров.
        </p>

        <h2>Как мы считаем и почему не занижаем</h2>
        <p>
          Смета всегда построчная: объёмы, материалы с марками, работы. Мы не даём «цену от», которая потом растёт
          допсоглашениями, и не выигрываем сравнение за счёт того, что не вписали гидроизоляцию. Если наше
          предложение дороже соседнего — в нём видно, за счёт чего, и от конкретной позиции можно отказаться осознанно.
        </p>
        <p>
          Оплата идёт по принятым этапам, предоплаты за работу нет: аванс только на материалы по чекам с завода.
          Это неудобно для подрядчика и спокойно для заказчика — мы выбрали второе.
        </p>

        <h2>Материалы и техника</h2>
        <p>
          Бетон — только заводской, М300 W6 F150, с паспортом качества на каждый миксер. Арматура А500С. Газобетон —
          ЛСР, напрямую с завода, мы официальный партнёр. Своя опалубка, виброплиты, буровой инструмент; экскаватор
          и бетононасос — проверенные подрядчики, с которыми работаем годами. Льём круглый год: зимнее бетонирование
          с противоморозными добавками и прогревом отлажено на десятках объектов.
        </p>
        <h2>Почему семейная компания, а не бригада по объявлению</h2>
        <p>
          В стройке частного дома главный риск — исчезновение подрядчика. Бригада, собранная под объект,
          растворяется вместе с авансом, и предъявить претензию некому. Семейная компания устроена иначе:
          у нас одна репутация на троих братьев, один аккаунт на Авито с {SITE.reviewsCount} отзывами,
          одни реквизиты в договоре и один посёлок, где нас знают.
        </p>
        <p>
          Практическая разница видна в мелочах. Прораб на объекте — совладелец, а не наёмный сотрудник,
          которому всё равно, как ляжет арматура. Снабжением занимается брат, а не «менеджер по закупкам»,
          которому производитель платит бонус за нужный бренд. Договор подписывает тот же человек, который
          приезжал на замер и будет сдавать объект.
        </p>

        <h2>География</h2>
        <p>
          База в посёлке Песочный. Основные районы — Всеволожский, Курортный, Ломоносовский, Гатчинский, Тосненский,
          Кировский, Приозерский, Выборгский и сам Санкт-Петербург. Цены по районам — на странице <Link href="/fundament/">фундаментов по районам</Link>.
        </p>
        <h2>Реквизиты</h2>
        <p>
          Индивидуальный предприниматель Демченко. ИНН {SITE.inn}, ОГРНИП {SITE.ogrnip}. Юридический адрес: {SITE.fullAddress}.
          Телефон {SITE.phone}, почта {SITE.email}. Карточки: <a href={SITE.yandexMapsProfile} target="_blank" rel="noopener nofollow">Яндекс Карты</a>, <a href={SITE.gis2Profile} target="_blank" rel="noopener nofollow">2ГИС</a>.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Один договор вместо пяти бригад</h2>
        <p>
          Классическая схема самостройщика: одна бригада льёт фундамент, вторая кладёт стены, третья кроет
          кровлю, четвёртая делает инженерию. На бумаге это дешевле. На практике каждая следующая бригада
          находит ошибки предыдущей и отказывается брать ответственность за результат: кровельщики говорят,
          что стены неровные, штукатуры — что кровля течёт, а виноватых нет.
        </p>
        <p>
          Мы делаем весь цикл сами и поэтому не можем сослаться на предшественника. Если плита выведена
          с отклонением, это наша проблема при кладке. Если армопояс сделан неверно, это наша проблема
          при монтаже мауэрлата. Ответственность не передаётся по цепочке, а остаётся в одном договоре
          от разметки до ключей.
        </p>
        <p>
          Отсюда и принцип комплектаций. Мы не уговариваем брать «под ключ»: можно остановиться на тёплом
          контуре и делать отделку самому. Но конструктив — фундамент, стены, перекрытия, кровлю — лучше
          делать одной командой, потому что именно на стыках этих работ возникают проблемы, которые потом
          не исправить.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Как с нами связаться и что будет дальше</h2>
        <p>
          Проще всего написать в Telegram или позвонить — трубку берёт Юрий, а не колл-центр. В первом разговоре уточняем участок, размеры дома и что уже есть: проект, геология, подъезд. Этого хватает, чтобы назвать порядок цифр и договориться о выезде.
        </p>
        <p>
          Дальше приезжаем на участок: бурим четыре точки, смотрим подъезд и пятно застройки, обсуждаем сроки. На следующий рабочий день присылаем смету по позициям и состав работ документом. Если всё устраивает — подписываем договор и выходим на объект. Никаких «менеджеров по сопровождению» в этой цепочке нет.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Частые вопросы о компании</h2>
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
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Поговорить с Юрием</h2>
          <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">Один звонок — и вы знаете порядок цифр по своему участку. Без колл-центра и скриптов.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${SITE.phoneRaw}`} className="rounded-xl bg-amber-400 text-brand-ink px-7 py-4 font-bold no-underline hover:opacity-90 transition">Позвонить</a>
            <a href={SITE.telegram} target="_blank" rel="noopener" className="rounded-xl border border-white/40 px-7 py-4 font-bold no-underline hover:bg-white/10 transition">Написать в Telegram</a>
          </div>
        </div>
      </section>
    </>
  );
}
