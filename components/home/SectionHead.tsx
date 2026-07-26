/**
 * Шапка секции в едином «чертёжном» ритме: номер листа + служебная подпись,
 * заголовок, лид. Датум-линия сверху задаёт горизонт всей странице —
 * именно повторяющийся горизонт создаёт ощущение документа, а не набора блоков.
 */
export default function SectionHead({
  index,
  label,
  title,
  lede,
  dark = false,
  align = 'left',
  children,
}: {
  index: string;
  label: string;
  title: React.ReactNode;
  lede?: React.ReactNode;
  dark?: boolean;
  align?: 'left' | 'between';
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`${dark ? 'datum datum-dark' : 'datum'} pt-6 md:pt-8 ${
        align === 'between' ? 'md:flex md:items-end md:justify-between md:gap-10' : ''
      }`}
      data-reveal
    >
      <div className={align === 'between' ? 'max-w-2xl' : 'max-w-3xl'}>
        <div className={`eyebrow ${dark ? 'text-signal' : 'text-signal-dark'}`}>
          <span className={dark ? 'text-bp-text' : 'text-brand-mute'}>{index}</span>
          <span className="mx-2 opacity-40">/</span>
          {label}
        </div>

        <h2 className={`display-2 mt-3 md:mt-4 ${dark ? 'text-white' : 'text-graphite'}`}>{title}</h2>

        {lede && (
          <p className={`lede mt-4 max-w-2xl ${dark ? 'text-bp-text' : 'text-brand-mute'}`}>{lede}</p>
        )}
      </div>

      {children && <div className="mt-6 md:mt-0 flex-shrink-0">{children}</div>}
    </div>
  );
}
