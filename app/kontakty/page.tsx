import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE } from '@/lib/site';
import { REGIONS } from '@/lib/regions';
import { buildBreadcrumb, buildGraph, ID } from '@/lib/schema';

export const metadata: Metadata = {
  title: `СК Юрьевич: контакты, адрес СПб, 9 районов ЛО ★5`,
  description:
    `☎ ${SITE.phone} · Telegram @YuraDem01 · ${SITE.baseLocation}, СПб. ` +
    `Я.Карты: yandex.ru/maps/org/69393767573. 9 районов ЛО, 239 объектов, ★5 (35 отз).`,
  alternates: { canonical: '/kontakty/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE.url}/kontakty/`,
    title: `Контакты СК «Юрьевич» — СПб + 9 районов ЛО ★5`,
    description: `☎ ${SITE.phone}, ${SITE.baseLocation}, СПб. 239 объектов, ★5.`,
    siteName: SITE.name,
  },
};

const YANDEX_CARD_URL = 'https://yandex.ru/maps/org/69393767573';

export default function KontaktyPage() {
  const pageGraph = buildGraph([
    buildBreadcrumb('/kontakty/', [
      { name: 'Главная', url: SITE.url },
      { name: 'Контакты', url: `${SITE.url}/kontakty/` },
    ]),
    [
      {
        '@type': 'ContactPage',
        '@id': `${SITE.url}/kontakty/#contactpage`,
        name: `Контакты ${SITE.name}`,
        url: `${SITE.url}/kontakty/`,
        about: { '@id': ID.org },
        mainEntity: { '@id': ID.org },
      },
    ],
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph) }}
      />

      <section className="section bg-brand-sand">
        <div className="container-x">
          <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
            <ol className="flex items-center gap-2">
              <li><Link href="/" className="hover:text-brand-ink">Главная</Link></li>
              <li aria-hidden>›</li>
              <li className="text-brand-ink font-semibold">Контакты</li>
            </ol>
          </nav>

          <h1 className="text-3xl md:text-5xl font-extrabold text-brand-ink leading-tight">
            Связаться с СК «Юрьевич»
          </h1>
          <p className="mt-4 text-lg text-brand-mute max-w-2xl leading-relaxed">
            Звоните, пишите в мессенджеры или оставляйте заявку через сайт.
            Бесплатный выезд инженера на участок в СПб и Ленинградской области.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="container-x grid md:grid-cols-2 gap-8 lg:gap-12">
          <div>
            <h2 className="text-2xl font-extrabold text-brand-ink">Прямые контакты</h2>
            <ul className="mt-6 space-y-5">
              <li>
                <a
                  href={`tel:${SITE.phoneRaw}`}
                  className="flex items-center gap-4 p-5 bg-white rounded-xl border border-brand-line hover:border-brand-ink hover:shadow-md transition"
                >
                  <span className="text-3xl">📞</span>
                  <div>
                    <div className="text-2xl font-extrabold text-brand-ink">{SITE.phone}</div>
                    <div className="text-sm text-brand-mute">Звоним 9:00–21:00 (пн-сб), 10:00–18:00 (вс)</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={SITE.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-white rounded-xl border border-brand-line hover:border-brand-ink hover:shadow-md transition"
                >
                  <span className="text-3xl">💬</span>
                  <div>
                    <div className="text-lg font-extrabold text-brand-ink">Telegram личный</div>
                    <div className="text-sm text-brand-mute">{SITE.telegram.replace('https://t.me/', '@')}</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={SITE.whatsapp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-white rounded-xl border border-brand-line hover:border-brand-ink hover:shadow-md transition"
                >
                  <span className="text-3xl">📱</span>
                  <div>
                    <div className="text-lg font-extrabold text-brand-ink">WhatsApp</div>
                    <div className="text-sm text-brand-mute">Тот же номер: {SITE.phone}</div>
                  </div>
                </a>
              </li>
              <li>
                <a
                  href={SITE.telegramChannel}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-5 bg-white rounded-xl border border-brand-line hover:border-brand-ink hover:shadow-md transition"
                >
                  <span className="text-3xl">📢</span>
                  <div>
                    <div className="text-lg font-extrabold text-brand-ink">Telegram-канал</div>
                    <div className="text-sm text-brand-mute">Стройка изнутри, фото с объектов</div>
                  </div>
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-extrabold text-brand-ink">Адрес офиса</h2>
            <div className="mt-6 bg-white rounded-xl border border-brand-line p-6">
              <p className="text-lg font-semibold text-brand-ink">{SITE.fullAddress}</p>
              <p className="mt-2 text-brand-mute">{SITE.district}</p>
              <p className="mt-2 text-sm text-brand-mute">Индекс: {SITE.postalCode}</p>

              <div className="mt-6 aspect-[4/3] rounded-xl overflow-hidden border border-brand-line">
                <iframe
                  src={`https://yandex.ru/map-widget/v1/?ll=${SITE.geo.lng}%2C${SITE.geo.lat}&z=15&pt=${SITE.geo.lng},${SITE.geo.lat},pm2blm`}
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  loading="lazy"
                  title={`Адрес ${SITE.name} на Яндекс.Картах`}
                />
              </div>

              <a
                href={YANDEX_CARD_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-2 text-brand-ink font-semibold hover:underline"
              >
                Открыть нашу карточку на Я.Картах →
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-brand-sand">
        <div className="container-x">
          <h2 className="text-2xl md:text-3xl font-extrabold text-brand-ink">
            Работаем в 9 районах СПб и Ленобласти
          </h2>
          <p className="mt-3 text-brand-mute max-w-2xl">
            Выезд инженера бесплатный по всей зоне покрытия. По времени дороги — от 30 минут (Курортный) до 90 (Приозерский).
          </p>
          <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {REGIONS.map((r) => (
              <Link
                key={r.slug}
                href={`/fundament/${r.slug}/`}
                className="block p-4 bg-white rounded-xl border border-brand-line hover:border-brand-ink hover:shadow-md transition"
              >
                <div className="font-bold text-brand-ink">{r.shortName}</div>
                <div className="text-xs text-brand-mute mt-1">{r.drivingTime}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container-x">
          <div className="bg-brand-ink text-white rounded-2xl p-8 md:p-12 max-w-4xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-extrabold">Оставить заявку на бесплатный расчёт</h2>
            <p className="mt-4 text-white/80 max-w-2xl mx-auto">
              Инженер приедет на участок, сделает замеры, подберёт грунт и пришлёт смету за 1-2 дня. Без обязательств и предоплаты.
            </p>
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-brand-ink font-semibold hover:bg-white/90 transition"
              >
                📞 {SITE.phone}
              </a>
              <Link
                href="/#contacts"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/30 hover:bg-white/10 transition"
              >
                Форма заявки
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
