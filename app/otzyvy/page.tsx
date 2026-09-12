import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { byTag } from '@/lib/gallery';
import { buildGraph, buildBreadcrumb, buildFaqPage } from '@/lib/schema';
import { ogDefaults } from '@/lib/seo-snippets';

/**
 * /otzyvy/ — где нас проверить. Правило аудита 26.07.2026 сохранено: на сайте нет
 * отзывов, которые мы могли бы отредактировать, и нет рейтинга «о самих себе» в
 * разметке. Есть ссылки на площадки, где текст правим не мы.
 */

const TITLE = 'Отзывы о компании: Авито 5.0, Яндекс Карты, 2ГИС';
const DESC = 'Отзывы о СК Юрьевич (фундаменты и дома из газобетона, СПб и Ленобласть): 5.0 и 35 отзывов на Авито, карточки на Яндекс Картах и 2ГИС, канал стройки в Telegram. Только проверяемые площадки.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: '/otzyvy/' },
  openGraph: ogDefaults('/otzyvy/', `${TITLE} · ${SITE.name}`, DESC, 'website'),
};

const PLATFORMS: Array<{ name: string; value: string; note: string; href: string; cta: string }> = [
  {
    name: 'Авито',
    value: `${SITE.rating} из 5 · ${SITE.reviewsCount} отзывов`,
    note: 'Основной канал заявок с 2018 года. Каждый отзыв привязан к сделке — Авито не даёт написать отзыв без заказа. По ссылке наше объявление, рейтинг и отзывы открываются в карточке продавца.',
    href: SITE.avitoProfile,
    cta: 'Открыть объявление и отзывы',
  },
  {
    name: 'Яндекс Карты',
    value: 'Карточка компании',
    note: 'Отзывы, фото объектов, маршрут до базы в Песочном. Отзыв можно оставить только с аккаунта Яндекса — мы его не редактируем.',
    href: SITE.yandexMapsProfile,
    cta: 'Открыть карточку',
  },
  {
    name: '2ГИС',
    value: 'Карточка компании',
    note: 'Справочник с проверкой организации: адрес, телефон, отзывы.',
    href: SITE.gis2Profile,
    cta: 'Открыть карточку',
  },
  {
    name: 'Telegram — канал стройки',
    value: 'Фото и видео день за днём',
    note: 'Как идут работы на текущих объектах: с датами, погодой и комментариями заказчиков в реальном времени.',
    href: SITE.telegramChannel,
    cta: 'Открыть канал',
  },
];

const FAQ = [
  {
    q: 'Почему на сайте нет отзывов?',
    a: 'Любой отзыв на собственном сайте можно написать самому — и клиент это понимает. Мы даём ссылки на площадки, где текст правим не мы: Авито, Яндекс Карты, 2ГИС. Там же видно дату и профиль автора.',
  },
  {
    q: 'Можно ли поговорить с прошлыми заказчиками?',
    a: 'Да. По запросу дадим контакты двух-трёх заказчиков из вашего района, которые согласились отвечать на звонки. Или свозим на действующий объект — поговорите с людьми, у которых стройка идёт прямо сейчас.',
  },
  {
    q: 'Как оставить отзыв, если мы уже работали?',
    a: 'Проще всего — в карточке на Яндекс Картах или на Авито в сделке. После сдачи объекта мы присылаем ссылку в Telegram. Спасибо: для семейной компании это главный источник новых заказов.',
  },
];

const GRAPH = buildGraph(
  [],
  [
    buildBreadcrumb('/otzyvy/', [
      { name: 'Главная', url: SITE.url },
      { name: 'Отзывы', url: `${SITE.url}/otzyvy/` },
    ]),
    buildFaqPage('/otzyvy/', FAQ)!,
  ]
);

export default function ReviewsPage() {
  const photos = byTag('plita').slice(0, 6);
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(GRAPH) }} />

      <section className="container-x pt-10 md:pt-14 pb-8">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Отзывы</li>
          </ol>
        </nav>
        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-4xl">
          Отзывы о СК «Юрьевич»: где нас проверить
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
          На сайте отзывов нет, и это осознанно: здесь мы могли бы написать что угодно. Смотрите на площадках,
          где отзыв нельзя отредактировать и где виден автор и дата. Основной канал — Авито: {SITE.rating} из 5,
          {' '}{SITE.reviewsCount} отзывов, ни одного ниже пятёрки.
        </p>
      </section>

      <section className="container-x pb-12">
        <div className="grid gap-4 md:grid-cols-2">
          {PLATFORMS.map((p) => (
            <div key={p.name} className="rounded-2xl border border-brand-line bg-white p-6 flex flex-col justify-between">
              <div>
                <div className="text-xs uppercase tracking-wider text-brand-mute">{p.name}</div>
                <div className="mt-2 text-2xl font-extrabold text-brand-ink">{p.value}</div>
                <p className="mt-3 text-sm text-brand-mute leading-relaxed">{p.note}</p>
              </div>
              {p.href ? (
                <a href={p.href} target="_blank" rel="noopener nofollow" className="mt-5 inline-block font-bold text-brand-ink hover:underline">{p.cta} →</a>
              ) : (
                <div className="mt-5 text-sm font-semibold text-brand-ink">{p.cta}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Как читать отзывы о строителях, чтобы они что-то значили</h2>
        <p>
          Отзывы в стройке — самый подделываемый актив. Смотреть стоит не на количество звёзд, а на три вещи.
          Привязан ли отзыв к сделке: на Авито его может оставить только тот, кто реально писал и заказывал —
          это не гарантия честности, но серьёзный фильтр. Есть ли конкретика: «всё отлично, рекомендую» не стоит
          ничего, а «плита 10×10 в Лесколово, торф выбирали два метра, уложились в срок» — стоит. И как компания
          отвечает на критику: отсутствие единого негативного отзыва за годы работы само по себе подозрительно.
        </p>
        <p>
          Второй слой проверки — то, что нельзя написать: реквизиты, по которым компанию видно в реестре ФНС;
          карточки на картах с фото и адресом; канал, где стройка выкладывается день за днём, а не глянцевыми
          подборками. Всё это открыто и собрано ссылками выше.
        </p>

        <h2>Что мы делаем, если работа не понравилась</h2>
        <p>
          За {SITE.projectsCount} объектов у нас были и переделки. Правило простое: если недочёт наш — устраняем
          за свой счёт и в свой срок, без обсуждения, кто виноват. Гарантия 5 лет на конструктив прописана
          в договоре и подкреплена гарантийным талоном, который выдаём при сдаче вместе с актом и паспортами
          на бетон и арматуру.
        </p>
        <p>
          Приёмка идёт поэтапно, а не в конце: подушка, армокаркас, заливка — каждый этап вы или ваш технадзор
          принимаете до того, как он закроется следующим. Это лучшая защита от ситуации «через год пошли трещины,
          а доказать нечего»: всё, что скрыто под бетоном, сфотографировано и подписано.
        </p>

        <h2>Почему отзывов на Картах меньше, чем объектов</h2>
        <p>
          Честно: {SITE.projectsCount} объектов и небольшое число отзывов на Яндекс Картах — это не противоречие,
          а наша недоработка. Основной поток заказчиков приходил с Авито, где отзыв оставляется в два клика после
          сделки, а карточку на Картах мы начали вести всерьёз недавно. Сейчас просим оставить отзыв каждого,
          кто сдал объект, и отвечаем на все. Отзывы мы не покупаем и не пишем сами — это скучнее, зато всё
          написанное можно проверить, не поверив нам на слово.
        </p>

        <h2>Съездить на объект — лучше любого отзыва</h2>
        <p>
          Самый честный формат проверки подрядчика мы предлагаем сами: приехать на действующую площадку.
          Там видно то, чего не покажет ни одна фотография — как хранятся материалы, как выглядит опалубка,
          убирают ли за собой, что говорят рабочие, когда их никто не готовил к визиту.
        </p>
        <p>
          Обычно возим до заключения договора, на объект, который ближе к вашему участку. Если идёт
          интересный этап — вязка каркаса или заливка, — стоит подгадать именно к нему: за час на площадке
          о подрядчике становится понятно больше, чем за неделю чтения отзывов. Договориться можно
          в Telegram или по телефону.
        </p>

        <h2>Что вместо отзывов — проверяемые факты</h2>
        <ul>
          <li><strong>{SITE.projectsCount} объектов с {SITE.foundedYear} года</strong> — плиты и дома, фото с площадок на странице <Link href="/obekty/">объектов</Link>.</li>
          <li><strong>Реквизиты на сайте:</strong> ИП, ИНН {SITE.inn}, ОГРНИП {SITE.ogrnip} — проверяются в сервисе ФНС «Прозрачный бизнес».</li>
          <li><strong>Договор с фиксированной ценой и гарантийный талон на {SITE.warrantyYears} лет</strong> — образец показываем до подписания.</li>
          <li><strong>Паспорта качества</strong> на каждый миксер бетона и партию арматуры — на объекте, в день поставки.</li>
          <li><strong>Экскурсия на действующий объект</strong> — по договорённости, в любой день работ.</li>
        </ul>
      </section>

      {photos.length > 0 && (
        <section className="container-x pb-12">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-2">Наши работы, а не стоковые картинки</h2>
          <p className="text-brand-mute mb-6 max-w-3xl">Каждый кадр снят на нашей площадке телефоном бригады или Юрия.</p>
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
        <h2>Документы, которые получает каждый заказчик</h2>
        <p>
          Договор с фиксированной ценой и приложениями — сметой по позициям, составом работ и графиком.
          Акты на каждый принятый этап: подушка, армокаркас, заливка, а по домам — коробка, кровля, контур,
          отделка. Паспорта качества на бетон с каждой машины и сертификаты на арматуру и газобетон.
          Исполнительные схемы по свайным работам. Гарантийный талон на 5 лет при сдаче.
        </p>
        <p>
          Этот набор — и есть настоящий отзыв. Отзыв можно написать, документы — нет: паспорт на бетон
          выдаёт завод, а не мы, и по номеру партии его можно проверить. Фотоотчёт скрытых работ
          с датами тоже остаётся у вас навсегда.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl prose-yur">
        <h2>Почему мы не показываем отзывы виджетом</h2>
        <p>
          На многих сайтах стоит виджет с каруселью отзывов и средним баллом. Технически такой виджет можно настроить на любой набор текстов, включая написанные самим владельцем. Поэтому мы отправляем вас напрямую на площадки: там отзыв привязан к аккаунту автора и дате, а мы не можем ни удалить его, ни отредактировать.
        </p>
        <p>
          Это стоит нам конверсии — прямые ссылки уводят с сайта. Зато то, что вы прочитаете, будет правдой, а не нашей версией правды.
        </p>
      </section>

      <section className="container-x pb-12 max-w-4xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Вопросы про доверие</h2>
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
          <h2 className="text-2xl md:text-3xl font-extrabold leading-tight">Проверьте нас сами</h2>
          <p className="mt-4 text-white/85 max-w-2xl leading-relaxed">Позвоните, задайте любой вопрос по технологии — отвечает Юрий, а не менеджер. Или посмотрите, как идёт стройка сегодня, в канале.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a href={`tel:${SITE.phoneRaw}`} className="rounded-xl bg-amber-400 text-brand-ink px-7 py-4 font-bold no-underline hover:opacity-90 transition">Позвонить</a>
            <Link href="/o-kompanii/" className="rounded-xl border border-white/40 px-7 py-4 font-bold no-underline hover:bg-white/10 transition">Кто мы →</Link>
          </div>
        </div>
      </section>
    </>
  );
}
