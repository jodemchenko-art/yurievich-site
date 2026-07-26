import { SITE } from '@/lib/site';
import SectionHead from './SectionHead';

/**
 * ОТЗЫВЫ — но без единой цитаты на нашей стороне.
 *
 * Правило, введённое аудитом 26.07 и здесь сохранённое: на сайте не может быть
 * отзывов, которые мы способны отредактировать. Поэтому вместо карточек с
 * фотографиями «довольных клиентов» — ссылки на площадки, где текст правим не мы.
 * Это выглядит скромнее выдуманных пятизвёздочных цитат и работает лучше:
 * проверяемое доверие сильнее декларируемого.
 */

const PROOFS = [
  {
    href: 'https://yandex.ru/maps/org/69393767573',
    label: 'Яндекс.Карты',
    value: 'Карточка компании',
    note: 'Отзывы, фото и маршрут на карте',
  },
  {
    href: SITE.vk,
    label: 'ВКонтакте',
    value: 'Сообщество «Ленбетон78»',
    note: 'Фото объектов прямо с площадок',
  },
  {
    href: SITE.telegramChannel,
    label: 'Telegram',
    value: 'Канал стройки',
    note: 'Как идут работы, день за днём',
  },
  {
    href: SITE.avitoProfile,
    label: 'Авито',
    value: `${SITE.rating} ★ · ${SITE.reviewsCount} отзывов`,
    note: 'Профиль компании с отзывами заказчиков',
  },
];

export default function ProofBlock() {
  // Показываем только то, что реально открывается. Пустая ссылка = карточки нет.
  const proofs = PROOFS.filter((p) => Boolean(p.href));

  return (
    <section id="otzyvy" className="relative bg-white">
      <div className="container-x py-16 md:py-24">
        <SectionHead
          index="08"
          label="Где нас проверить"
          title={<>Отзывов на&nbsp;сайте нет. И&nbsp;это осознанно</>}
          lede={
            <>
              Любой отзыв на собственном сайте можно написать самому — поэтому мы их здесь не
              публикуем. Смотрите там, где мы ничего не редактируем. Наш основной канал заявок —
              Авито: {SITE.rating} ★ и {SITE.reviewsCount} отзывов, ни одного ниже пятёрки.
            </>
          }
        />

        <div className="mt-10 grid gap-px border border-hair bg-hair md:mt-14 md:grid-cols-2 lg:grid-cols-4">
          {proofs.map((p, i) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener nofollow"
              className="group flex flex-col justify-between bg-white p-6 transition-colors hover:bg-paper"
              data-reveal
              style={{ ['--d' as any]: `${i * 80}ms` }}
            >
              <div>
                <div className="eyebrow text-brand-mute">{p.label}</div>
                <div className="mt-3 text-lg font-extrabold leading-snug text-graphite">
                  {p.value}
                </div>
                <p className="mt-2 text-sm leading-relaxed text-brand-mute">{p.note}</p>
              </div>
              <span className="mono mt-6 text-xs text-signal-dark">
                открыть <span className="arw inline-block transition-transform group-hover:translate-x-1">→</span>
              </span>
            </a>
          ))}
        </div>

        <div className="mt-8 grid gap-6 border-t border-hair pt-6 md:grid-cols-2">
          <p className="text-sm leading-relaxed text-brand-mute" data-reveal>
            <span className="text-graphite">Можем свозить на действующий объект.</span> Это самая
            честная проверка: вы своими глазами видите армирование, опалубку и то, как ведут себя
            на площадке люди, которым вы собираетесь отдать деньги.
          </p>
          <p className="mono text-[11px] leading-relaxed text-brand-mute" data-reveal>
            ИП Демченко · ОГРНИП {SITE.ogrnip} · ИНН {SITE.inn}. Реквизиты можно пробить на сайте
            ФНС до подписания договора — и увидеть, что за фамилией стоит действующее ИП, а не
            «бригада с объявления».
          </p>
        </div>
      </div>
    </section>
  );
}
