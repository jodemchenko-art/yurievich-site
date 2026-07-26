import { SITE } from '@/lib/site';
import CountUp from './CountUp';

/**
 * Полоса-пруф сразу под первым экраном.
 *
 * Здесь только то, что человек может проверить сам: счёт объектов и рейтинг
 * с Авито, партнёрство с ЛСР, реквизиты ИП (пробиваются в ЕГРИП за минуту).
 * Никаких «15 лет на рынке» и «более 1000 клиентов» — цифры без пруфа
 * работают против нас: их пишут все, и им давно никто не верит.
 */
export default function ProofStrip() {
  return (
    <section data-plane="paper" className="border-y border-rule bg-paper2 text-graphite">
      <div className="container-x">
        <div className="grid grid-cols-2 gap-px bg-rule/35 lg:grid-cols-4">
          <Cell
            value={<CountUp to={SITE.projectsCount} />}
            label="завершённых объектов"
            note="фундаменты и дома, СПб + ЛО"
          />
          <Cell
            value={
              <>
                <CountUp to={5} decimals={1} />
                <span className="text-sand"> ★</span>
              </>
            }
            label={`${SITE.reviewsCount} отзывов на Авито`}
            note="ни одного ниже пятёрки"
          />
          <Cell value="ЛСР" label="партнёр по газобетону" note="блок с завода, с паспортом" mono />
          <Cell
            value={`${SITE.warrantyYears} лет`}
            label="гарантия на конструктив"
            note="гарантийный талон при сдаче"
          />
        </div>

        <p className="mono py-4 text-[11px] leading-relaxed text-inkmute sm:text-xs">
          ИП Демченко · ОГРНИП {SITE.ogrnip} · ИНН {SITE.inn} —{' '}
          <a
            href="https://egrul.nalog.ru/"
            target="_blank"
            rel="noopener nofollow"
            className="ulink text-signal"
          >
            проверить в ЕГРИП до подписания договора →
          </a>
        </p>
      </div>
    </section>
  );
}

function Cell({
  value,
  label,
  note,
  mono = false,
}: {
  value: React.ReactNode;
  label: string;
  note: string;
  mono?: boolean;
}) {
  return (
    <div className="bg-paper2 px-1 py-6 sm:px-4 md:py-8" data-reveal>
      <div
        className={`${mono ? 'mono text-3xl md:text-4xl' : 'metric text-4xl md:text-5xl'} text-graphite`}
      >
        {value}
      </div>
      <div className="mt-2 text-sm font-semibold leading-tight text-graphite md:text-base">
        {label}
      </div>
      <div className="mono mt-1.5 text-[10px] leading-tight text-inkmute sm:text-[11px]">{note}</div>
    </div>
  );
}
