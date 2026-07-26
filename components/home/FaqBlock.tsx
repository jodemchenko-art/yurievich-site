import { HOME_FAQ } from '@/lib/faq';
import SectionHead from './SectionHead';

/**
 * FAQ.
 *
 * Два жёстких требования, которые тут выполнены:
 * 1) выводим ВЕСЬ массив HOME_FAQ — он же уходит в FAQPage-разметку на странице.
 *    Разошлись видимый текст и микроразметка — сниппет в выдаче теряется;
 * 2) никакого JS: обычные <details>. Это работает без гидратации, доступно
 *    с клавиатуры и индексируется поисковиком как обычный текст.
 */
export default function FaqBlock() {
  return (
    <section id="faq" className="relative overflow-hidden bg-paper">
      <div aria-hidden className="absolute inset-0 grid-paper" />

      <div className="container-x relative py-16 md:py-24">
        <SectionHead
          index="09"
          label="Вопросы, которые задают на замере"
          title={<>Отвечаем до&nbsp;того, как вы&nbsp;позвоните</>}
          lede="Здесь собраны реальные вопросы заказчиков — про цену, грунт, бетон, зимнюю заливку и порядок оплаты. Без «индивидуального подхода» и обтекаемых формулировок."
        />

        <div className="mt-10 max-w-4xl border-t border-hair md:mt-14">
          {HOME_FAQ.map((f, i) => (
            <details
              key={f.q}
              className="faq-item group border-b border-hair"
              data-reveal
              style={{ ['--d' as any]: `${Math.min(i, 6) * 45}ms` }}
            >
              <summary className="flex items-start gap-4 py-4 md:py-5">
                <span className="mono mt-1 flex-shrink-0 text-[11px] text-signal-dark">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="flex-1 text-[15px] font-bold leading-snug text-graphite md:text-base">
                  {f.q}
                </span>
                <span
                  aria-hidden
                  className="faq-sign mono mt-0.5 flex-shrink-0 text-lg leading-none text-brand-mute"
                >
                  +
                </span>
              </summary>
              {/* Плавное раскрытие без JS: grid-template-rows 0fr -> 1fr.
                  Резкий скачок высоты на длинном ответе читается как «сайт дёргается». */}
              <div className="faq-body">
                <div className="overflow-hidden">
                  <p className="pb-5 pl-9 pr-8 text-sm leading-relaxed text-brand-mute md:pl-10 md:text-[15px]">
                    {f.a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
