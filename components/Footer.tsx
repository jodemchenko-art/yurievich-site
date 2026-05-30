import { SITE } from '@/lib/site';

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white/80 mt-16">
      <div className="container-x py-12 md:py-16 grid gap-10 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-10 w-10 rounded-lg bg-brand-red flex items-center justify-center text-white font-extrabold">
              Ю
            </div>
            <div className="font-extrabold text-white">СК «Юрьевич»</div>
          </div>
          <p className="text-sm leading-relaxed">
            Семейная строительная компания. Фундаменты и дома под ключ в СПб и Ленобласти.
            239 завершённых объектов, рейтинг 5.0 ★ на Авито.
          </p>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Услуги</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#uslugi" className="hover:text-white transition">Монолитная плита</a></li>
            <li><a href="#uslugi" className="hover:text-white transition">Ленточный фундамент</a></li>
            <li><a href="#uslugi" className="hover:text-white transition">Дом из газобетона</a></li>
            <li><a href="#uslugi" className="hover:text-white transition">Подъём фундаментов</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Компания</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="#brothers" className="hover:text-white transition">О братьях</a></li>
            <li><a href="#portfolio" className="hover:text-white transition">Объекты (239)</a></li>
            <li><a href="#otzyvy" className="hover:text-white transition">Отзывы (35)</a></li>
            <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
            <li><a href="/privacy" className="hover:text-white transition">Политика данных</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Контакты</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a href={`tel:${SITE.phoneRaw}`} className="text-white font-bold text-lg hover:text-brand-red transition">
                {SITE.phone}
              </a>
            </li>
            <li>База: {SITE.baseLocation}</li>
            <li className="flex gap-3 pt-2">
              <a href={SITE.whatsapp} target="_blank" rel="noopener" className="hover:text-white transition">WhatsApp</a>
              <span>·</span>
              <a href={SITE.telegram} target="_blank" rel="noopener" className="hover:text-white transition">Telegram</a>
              <span>·</span>
              <a href={SITE.telegramChannel} target="_blank" rel="noopener" className="hover:text-white transition">Канал стройки</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-6 text-xs text-white/50 flex flex-col md:flex-row justify-between gap-2">
          <span>© СК «Юрьевич», {new Date().getFullYear()}. Все права защищены.</span>
          <span>Семейная стройка в СПб и Ленобласти.</span>
        </div>
      </div>
    </footer>
  );
}
