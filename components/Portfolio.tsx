import { SITE } from '@/lib/site';

// Реальные объекты (фото и данные из сообщества ВК «Ленбетон78»)
const OBJECTS = [
  { type: 'Монолитная плита 120 м²', loc: 'Ропша, Ломоносовский р-н, ЛО', stage: 'Армокаркас', img: '/images/objects/ropsha-120-armo.jpg' },
  { type: 'Монолитная плита 120 м²', loc: 'Ропша, Ломоносовский р-н, ЛО', stage: 'Плита залита', img: '/images/objects/ropsha-120-plita.jpg' },
  { type: 'Монолитная плита 150 м²', loc: 'СНТ «Красный Октябрь», ЛО', stage: 'Армокаркас', img: '/images/objects/krasny-oktyabr-150-armo.jpg' },
  { type: 'Монолитная плита 150 м²', loc: 'СНТ «Красный Октябрь», ЛО', stage: 'Плита залита', img: '/images/objects/krasny-oktyabr-150-plita.jpg' },
  { type: 'Монолитная плита 144 м²', loc: 'дер. Торики, ЛО', stage: 'Армокаркас', img: '/images/objects/toriki-144-armo.jpg' },
  { type: 'Монолитная плита 144 м²', loc: 'дер. Торики, ЛО', stage: 'Плита залита', img: '/images/objects/toriki-144-plita.jpg' },
  { type: 'Монолитная плита 100 м²', loc: 'Низино, Ломоносовский р-н, ЛО', stage: 'Армокаркас', img: '/images/objects/nizino-100-armo.jpg' },
  { type: 'Монолитная плита 100 м²', loc: 'Низино, Ломоносовский р-н, ЛО', stage: 'Плита залита', img: '/images/objects/nizino-100-plita.jpg' },
  { type: 'Монолитная плита 104 м²', loc: 'Пеники, Ломоносовский р-н, ЛО', stage: 'Армокаркас', img: '/images/objects/peniki-104-armo.jpg' },
  { type: 'Монолитная плита 104 м²', loc: 'Пеники, Ломоносовский р-н, ЛО', stage: 'Плита залита', img: '/images/objects/peniki-104-plita.jpg' },
];

export default function Portfolio() {
  return (
    <section id="portfolio" className="section">
      <div className="container-x">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 md:mb-14">
          <div className="max-w-2xl">
            <span className="text-brand-red font-bold text-sm uppercase tracking-wide">Портфолио</span>
            <h2 className="section-title mt-2">Наши объекты в СПб и Ленобласти</h2>
            <p className="section-sub">
              {SITE.projectsCount} завершённых объектов с фото и видео процесса. Можем свозить на ближайший
              действующий объект — увидите технологию своими глазами.
            </p>
          </div>
          <a
            href={SITE.telegramChannel}
            target="_blank"
            rel="noopener"
            className="btn-secondary !py-3 !px-5 !text-sm whitespace-nowrap"
          >
            Все объекты в Telegram →
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {OBJECTS.map((o, i) => (
            <article
              key={i}
              className="group relative rounded-2xl overflow-hidden border border-brand-line hover:shadow-xl transition cursor-pointer"
            >
              {/* Photo */}
              <div className="relative h-60 bg-brand-ink overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center transition duration-700 group-hover:scale-105"
                  style={{ backgroundImage: `url('${o.img}')` }}
                />
                <span className="absolute top-3 left-3 bg-white/95 text-brand-ink text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded backdrop-blur">
                  {o.stage}
                </span>
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/70 to-transparent" />
              </div>

              <div className="p-4 bg-white">
                <h3 className="font-bold text-base leading-tight">{o.type}</h3>
                <p className="mt-1 text-xs text-brand-mute flex items-center gap-1">
                  <span>📍</span> {o.loc}
                </p>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <a href={SITE.telegramChannel} target="_blank" rel="noopener" className="btn-primary">
            Смотреть все {SITE.projectsCount} объектов →
          </a>
        </div>
      </div>
    </section>
  );
}
