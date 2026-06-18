import type { Metadata } from 'next';
import Link from 'next/link';
import { VACANCIES, buildJobPostingSchema } from '@/lib/vacancies';
import { SITE } from '@/lib/site';
import { buildBreadcrumb, buildGraph } from '@/lib/schema';

export const metadata: Metadata = {
  title: 'Вакансии СК «Юрьевич» — работа в стройке СПб и Ленобласти',
  description:
    'Открытые вакансии в СК «Юрьевич»: бетонщик-арматурщик, прораб, разнорабочий. Семейная стройкомпания, 239 объектов с 2018 года. Постоянная работа в СПб и ЛО, оплата вовремя, без субподряда. ул. Пионерстроя 23Б.',
  alternates: { canonical: '/vakansii/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: `${SITE.url}/vakansii/`,
    title: 'Вакансии СК «Юрьевич» — фундаменты, СПб и Ленобласть',
    description:
      'Открытые вакансии: бетонщик, прораб, разнорабочий. Семейная стройкомпания. Оплата вовремя, без задержек.',
    siteName: SITE.name,
  },
};

export default function VakansiiPage() {
  const today = '2026-06-18';
  const pageGraph = buildGraph(
    VACANCIES.map((v) => buildJobPostingSchema(v, today)),
    [
      buildBreadcrumb('/vakansii/', [
        { name: 'Главная', url: SITE.url },
        { name: 'Вакансии', url: `${SITE.url}/vakansii/` },
      ]),
    ]
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph) }}
      />

      <section className="container-x pt-10 md:pt-14 pb-6">
        <nav aria-label="Хлебные крошки" className="text-sm text-brand-mute mb-6">
          <ol className="flex items-center gap-2">
            <li>
              <Link href="/" className="hover:text-brand-ink transition">
                Главная
              </Link>
            </li>
            <li aria-hidden="true">›</li>
            <li className="text-brand-ink">Вакансии</li>
          </ol>
        </nav>

        <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight max-w-3xl">
          Работа в СК «Юрьевич»: фундаменты и стройка в СПб и Ленобласти
        </h1>
        <p className="mt-5 text-lg text-brand-mute max-w-3xl leading-relaxed">
          Мы семейная компания: 3 брата Демченко, 239 завершённых объектов с 2018 года, бригада 6-8
          человек. Берём только тех, с кем хотим работать долго. Платим вовремя, без задержек —
          еженедельно или по этапам. Офис: ул. Пионерстроя 23Б (Красносельский район СПб).
        </p>

        <div className="mt-6 flex flex-wrap gap-3 text-sm">
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">
            Без субподряда
          </span>
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">
            Оплата без задержек
          </span>
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">
            Постоянная работа круглый год
          </span>
          <span className="rounded-full bg-brand-sand px-4 py-1.5 font-semibold">
            Транспорт до объекта — наш
          </span>
        </div>
      </section>

      <section className="container-x pb-20">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-8">Открытые вакансии</h2>
        <div className="grid gap-6 lg:grid-cols-3">
          {VACANCIES.map((v) => (
            <article
              key={v.slug}
              className="block bg-white rounded-2xl border border-brand-line p-6 md:p-7"
            >
              <h3 className="text-xl md:text-2xl font-extrabold leading-tight">{v.title}</h3>
              <div className="mt-3 text-2xl font-extrabold text-brand-ink">
                {v.salaryMin.toLocaleString('ru-RU')} – {v.salaryMax.toLocaleString('ru-RU')}{' '}
                <span className="text-sm text-brand-mute">₽/мес</span>
              </div>
              <p className="mt-4 text-brand-mute leading-relaxed">{v.description}</p>

              <details className="mt-5 group">
                <summary className="cursor-pointer font-bold text-brand-ink hover:underline">
                  Подробности и условия
                </summary>
                <div className="mt-4 space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold mb-2">Обязанности</h4>
                    <ul className="space-y-1.5 text-brand-mute">
                      {v.responsibilities.map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Требования</h4>
                    <ul className="space-y-1.5 text-brand-mute">
                      {v.requirements.map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-bold mb-2">Условия</h4>
                    <ul className="space-y-1.5 text-brand-mute">
                      {v.conditions.map((c, i) => (
                        <li key={i}>• {c}</li>
                      ))}
                    </ul>
                  </div>
                  {v.workSchedule && (
                    <div>
                      <h4 className="font-bold mb-2">График</h4>
                      <p className="text-brand-mute">{v.workSchedule}</p>
                    </div>
                  )}
                </div>
              </details>

              <a
                href={`tel:${SITE.phoneRaw}`}
                className="mt-6 inline-block rounded-xl bg-brand-ink text-white px-6 py-3 font-bold no-underline w-full text-center"
              >
                Откликнуться: {SITE.phone}
              </a>
            </article>
          ))}
        </div>
      </section>

      <section className="container-x pb-20 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-extrabold mb-6">Почему у нас не «как у всех»</h2>
        <ul className="space-y-4 text-brand-mute leading-relaxed">
          <li>
            <strong className="text-brand-ink">Семейная компания.</strong> 3 брата Демченко на 239
            объектах с 2018 года. Все решения принимаются здесь, без «согласований с офисом».
          </li>
          <li>
            <strong className="text-brand-ink">Оплата вовремя.</strong> Зарплата выдаётся в день
            обозначенный в договоре. За 8 лет ни одной задержки — это принципиально.
          </li>
          <li>
            <strong className="text-brand-ink">Только наши объекты.</strong> Мы не сдаём людей в
            субподряд. Бригада постоянная, объекты планируются на сезон вперёд.
          </li>
          <li>
            <strong className="text-brand-ink">Реальная экспертиза.</strong> Работаем по СП
            22.13330.2016, бетон М300 W6 F150 с завода ЛСР, арматура А500С. Не «как-нибудь».
          </li>
          <li>
            <strong className="text-brand-ink">Без вредных привычек.</strong> Алкоголь на объекте =
            увольнение в день обнаружения. Это держит здоровый коллектив.
          </li>
        </ul>
      </section>
    </>
  );
}
