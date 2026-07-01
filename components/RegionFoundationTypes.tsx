import type { Region, RegionGround } from '@/lib/regions';

// Коммерческий блок для гео-страниц: ловит «ленточный фундамент {район}»,
// «свайный фундамент {район} цена», «плита {район}». Текст привязан к грунту
// конкретного района (region.defaultGround) — поэтому 9 страниц НЕ дублируют
// друг друга (защита от фильтра за шаблонные дорвеи).

const GROUND_ADJ: Record<RegionGround, string> = {
  pesok: 'песчаных',
  suglinok: 'суглинистых',
  glina: 'глинистых',
  torf: 'торфяных',
  boloto: 'заболоченных',
};

const WEAK = ['torf', 'boloto']; // грунты, где лента не рекомендуется, а свая — в приоритете

function buildBlocks(r: Region) {
  const g = r.defaultGround;
  const adj = GROUND_ADJ[g];
  const price = r.priceFrom.toLocaleString('ru-RU');
  const isWeak = WEAK.includes(g);
  const isSand = g === 'pesok';

  const plita = {
    title: `Плитный фундамент в ${r.prepositional}`,
    tag: 'Основная технология',
    price: `от ${price} ₽/м²`,
    body:
      `Монолитная плита — самый надёжный вариант под дом из газобетона в ${r.prepositional}. ` +
      `На ${adj} грунтах ${r.shortName} плита работает как единая платформа и не боится сезонного пучения и подвижек. ` +
      `Цена плитного фундамента под ключ в ${r.prepositional} — от ${price} ₽/м², точную стоимость считаем бесплатно после замера.`,
  };

  const lenta = {
    title: `Ленточный фундамент в ${r.prepositional}`,
    tag: isWeak ? 'На этих грунтах — с оговоркой' : 'Экономичный вариант',
    price: 'Расчёт по проекту',
    body: isWeak
      ? `На ${adj} грунтах ${r.shortName} ленточный фундамент мы обычно не рекомендуем — надёжнее плита с заменой грунта или свайный фундамент. ` +
        `Если участок с плотным основанием — считаем стоимость ленточного фундамента в ${r.prepositional} по проекту после геологии.`
      : isSand
        ? `На плотных песчаных грунтах ${r.shortName} ленточный фундамент — рабочий и более дешёвый вариант под лёгкий дом, баню или каркасник. ` +
          `Заливаем мелкозаглублённую и заглублённую ленту из бетона М300. Цену ленточного фундамента в ${r.prepositional} рассчитываем по проекту.`
        : `Ленточный фундамент в ${r.prepositional} применяем с заглублением ниже глубины промерзания — на ${adj} грунтах мелкозаглублённая лента рискованна. ` +
          `Подходит под лёгкие постройки. Стоимость ленточного фундамента считаем бесплатно после замера.`,
  };

  const svai = {
    title: `Свайный фундамент в ${r.prepositional}`,
    tag: isWeak ? 'Оптимально для этих грунтов' : 'Для каркасных и склонов',
    price: 'Расчёт по проекту',
    body: isWeak
      ? `На ${adj} грунтах ${r.shortName} свайный фундамент — оптимальное решение: буронабивные или винтовые сваи с ростверком переносят вес дома на плотные слои без дорогой выторфовки. ` +
        `Цену свайного фундамента в ${r.prepositional} рассчитываем под ваш дом бесплатно.`
      : `Свайный фундамент в ${r.prepositional} берём под каркасные дома, бани и участки со склоном. ` +
        `Сваи с ростверком — быстрый и недорогой вариант. Стоимость свайного фундамента зависит от количества свай, считаем по проекту.`,
  };

  return [plita, lenta, svai];
}

export default function RegionFoundationTypes({ region }: { region: Region }) {
  const blocks = buildBlocks(region);
  return (
    <section className="container-x pb-16 max-w-4xl">
      <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
        Какой фундамент выбрать в {region.prepositional}: плита, лента или сваи
      </h2>
      <p className="text-brand-mute mb-8 leading-relaxed">
        Тип фундамента в {region.prepositional} подбираем под грунт вашего участка — это решает и надёжность,
        и цену. Ниже — как выбирают плиту, ленту и сваи именно на {GROUND_ADJ[region.defaultGround]} грунтах {region.shortName}.
      </p>

      <div className="space-y-5">
        {blocks.map((b) => (
          <article key={b.title} className="rounded-2xl border border-brand-line bg-white p-6 md:p-7">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-brand-mute">{b.tag}</div>
                <h3 className="mt-1 text-xl font-extrabold text-brand-ink leading-snug">{b.title}</h3>
              </div>
              <div className="font-extrabold text-brand-ink text-sm whitespace-nowrap mt-1">{b.price}</div>
            </div>
            <p className="mt-3 text-sm md:text-base text-brand-mute leading-relaxed">{b.body}</p>
          </article>
        ))}
      </div>

      <a
        href="#calc"
        className="inline-block mt-7 rounded-xl bg-brand-ink text-white px-7 py-4 font-bold no-underline"
      >
        Заказать расчёт фундамента в {region.shortName} →
      </a>
    </section>
  );
}
