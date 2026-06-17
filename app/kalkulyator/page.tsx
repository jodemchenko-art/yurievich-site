import type { Metadata } from 'next';
import Link from 'next/link';
import Calculator from '@/components/Calculator';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Калькулятор стоимости плитного фундамента в СПб · СК Юрьевич',
  description:
    'Рассчитайте цену монолитной плиты под ваш дом за 30 секунд: размер, этажность, грунт, материал стен. Реальные цены 2026 г. по позициям — без приманок.',
  alternates: { canonical: '/kalkulyator/' },
  openGraph: {
    title: 'Калькулятор плитного фундамента — расчёт цены 2026',
    description: 'Считаем плиту под ваш дом за 30 секунд по реальным ценам СПб и ЛО.',
    type: 'website',
  },
};

const BREADCRUMB_SCHEMA = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Главная', item: SITE.url },
    { '@type': 'ListItem', position: 2, name: 'Калькулятор', item: `${SITE.url}/kalkulyator/` },
  ],
};

export default function KalkulyatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(BREADCRUMB_SCHEMA) }}
      />

      <section className="container-x pt-10 md:pt-16 pb-6">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2">
            <li><Link href="/" className="hover:text-brand-ink transition">Главная</Link></li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Калькулятор</li>
          </ol>
        </nav>

        <h1 className="text-4xl md:text-6xl font-extrabold leading-tight tracking-tight max-w-3xl">
          Калькулятор стоимости плитного фундамента
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-2xl leading-relaxed">
          Реальные цены 2026 г. по СПб и Ленобласти — с разбивкой по позициям, без приманок.
          Считаем под ваш размер, этажность, грунт и материал стен.
        </p>
      </section>

      <section className="container-x pb-20">
        <Calculator />
      </section>

      <section className="container-x pb-20 max-w-3xl prose-yur">
        <h2>Как работает калькулятор</h2>
        <p>
          Цена плиты складывается из четырёх основных параметров: <strong>площади дома</strong> (м²),
          <strong> нагрузки</strong> (этажность × материал стен), <strong>геологии участка</strong>
          (грунт + подушка) и <strong>толщины плиты</strong>. Калькулятор использует реальные базовые цены
          СПб и Ленобласти на лето 2026 года.
        </p>
        <h3>Что включено в расчёт</h3>
        <ul>
          <li>Бетон М300 W6 F150 (заводской, с паспортом качества)</li>
          <li>Арматура А500С d12 двойного армирования с шагом 200×200 мм</li>
          <li>Работа бригады (разметка, армокаркас, опалубка, заливка, виброуплотнение)</li>
          <li>Опалубка съёмная</li>
          <li>Подушка ПГС с послойным уплотнением Куп ≥ 0.95</li>
          <li>Доставка миксеров и материалов до 60 км от КАД</li>
        </ul>
        <h3>Чего нет в калькуляторе (считаем индивидуально)</h3>
        <ul>
          <li>Геология участка (если нужно бурение скважин — отдельно)</li>
          <li>Гидроизоляция плиты (рекомендуется при близком УГВ)</li>
          <li>Утеплённая отмостка ЭППС (часто нужна при глине/суглинке)</li>
          <li>Дренаж пристенный (если близко грунтовые воды)</li>
          <li>Свайно-плитное основание (на торфе мощностью &gt;2 м)</li>
        </ul>
        <p>
          После заявки <strong>Юрий перезвонит</strong>, уточнит детали участка и пришлёт
          <strong> точную смету по позициям</strong> с указанием количества материалов и сроков.
          Бесплатно, без обязательств.
        </p>
      </section>
    </>
  );
}
