import { SITE } from '@/lib/site';

/**
 * Блок «Отзывы».
 *
 * ⚠️ ПРАВИЛО (не нарушать): здесь НЕТ придуманных цитат клиентов.
 * Раньше в этом файле лежали 5 захардкоженных «отзывов», которых никто не писал,
 * а рядом стояла фраза «все реальные, можно проверить» — без единой ссылки на пруф.
 * Для поисковика это недостоверная информация, для клиента — повод не поверить и уйти.
 *
 * Показываем только то, что человек может открыть и проверить сам:
 * рейтинг на площадках, живой канал стройки, сообщество с фото объектов.
 * Когда Юрий пришлёт ссылку на профиль Авито — она подставится в SITE.avitoProfile
 * и появится кнопка «Читать отзывы на Авито».
 */

const PROOFS = [
  {
    href: SITE.avitoProfile,
    label: 'Авито',
    value: `${SITE.rating} ★ · ${SITE.reviewsCount} отзывов`,
    note: 'Профиль компании с отзывами заказчиков',
  },
  {
    href: 'https://yandex.ru/maps/org/69393767573',
    label: 'Яндекс.Карты',
    value: 'Карточка компании',
    note: 'Отзывы и фото на карте',
  },
  {
    href: SITE.vk,
    label: 'ВКонтакте',
    value: 'Сообщество «Ленбетон78»',
    note: 'Фото объектов с площадок',
  },
  {
    href: SITE.telegramChannel,
    label: 'Telegram',
    value: 'Канал стройки',
    note: 'Как идут работы, день за днём',
  },
];

export default function Reviews() {
  const proofs = PROOFS.filter((p) => Boolean(p.href));

  return (
    <section id="otzyvy" className="section bg-brand-sand">
      <div className="container-x">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-brand-red font-bold text-sm uppercase tracking-wide">Отзывы</span>
          <h2 className="section-title mt-2">
            {SITE.rating} ★ из 5,0 · {SITE.reviewsCount} отзывов на Авито
          </h2>
          <p className="section-sub">
            Мы не публикуем отзывы у себя на сайте — их слишком легко написать самому.
            Смотрите там, где мы не можем ничего отредактировать: на площадках и в живых
            каналах, где видно каждый объект.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-4 sm:grid-cols-2">
          {proofs.map((p) => (
            <a
              key={p.label}
              href={p.href}
              target="_blank"
              rel="noopener nofollow"
              className="block bg-white rounded-2xl p-6 border border-brand-line shadow-sm hover:shadow-lg hover:border-brand-red transition"
            >
              <div className="text-sm font-bold uppercase tracking-wide text-brand-mute">
                {p.label}
              </div>
              <div className="mt-2 text-lg font-extrabold text-brand-ink">{p.value}</div>
              <div className="mt-1 text-sm text-brand-mute">{p.note}</div>
            </a>
          ))}
        </div>

        <p className="text-center text-sm text-brand-mute mt-8 max-w-2xl mx-auto">
          ИП Демченко, ОГРНИП {SITE.ogrnip}, ИНН {SITE.inn} — реквизиты можно пробить
          на сайте ФНС до подписания договора.
        </p>
      </div>
    </section>
  );
}
