import { SITE } from '@/lib/site';
import { REGIONS } from '@/lib/regions';

export default function Footer() {
  return (
    <footer className="bg-brand-ink text-white/80 mt-16">
      <div className="container-x py-10 border-b border-white/10">
        <h4 className="text-white font-bold mb-4 text-sm uppercase tracking-wider">Фундаменты по районам СПб и Ленобласти</h4>
        <div className="grid gap-2 sm:grid-cols-3 lg:grid-cols-5 text-sm">
          {REGIONS.map((r) => (
            <a
              key={r.slug}
              href={`/fundament/${r.slug}/`}
              className="hover:text-white transition"
            >
              {r.name}
            </a>
          ))}
          <a href="/fundament/" className="hover:text-white transition font-bold">
            Все районы →
          </a>
        </div>
      </div>

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
            <li><a href="/fundament/plita/" className="hover:text-white transition">Монолитная плита</a></li>
            <li><a href="/fundament/lenta/" className="hover:text-white transition">Ленточный фундамент</a></li>
            <li><a href="/fundament/svai/" className="hover:text-white transition">Свайный фундамент</a></li>
            <li><a href="/fundament/ushp/" className="hover:text-white transition">УШП</a></li>
            <li><a href="/ceny/" className="hover:text-white transition">Цены</a></li>
            <li><a href="/doma/" className="hover:text-white transition">Дом из газобетона</a></li>
            <li><a href="/fundament/pod-banyu/" className="hover:text-white transition">Фундамент под баню</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Компания</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/o-kompanii/" className="hover:text-white transition">О компании</a></li>
            <li><a href="/obekty/" className="hover:text-white transition">Объекты (239)</a></li>
            <li><a href="/otzyvy/" className="hover:text-white transition">Отзывы (35)</a></li>
            <li><a href="#faq" className="hover:text-white transition">FAQ</a></li>
            <li><a href="/privacy" className="hover:text-white transition">Политика данных</a></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold mb-4">Контакты</h4>
          <ul className="space-y-3 text-sm">
            <li>
              <a
                href={`tel:${SITE.phoneRaw}`}
                className="text-white font-bold text-lg hover:opacity-80 transition"
              >
                Позвонить →
              </a>
            </li>
            <li>
              <a
                href={SITE.telegram}
                target="_blank"
                rel="noopener"
                className="text-white font-bold text-lg hover:opacity-80 transition"
              >
                Написать в Telegram →
              </a>
            </li>
            {SITE.max && (
              <li>
                <a
                  href={SITE.max}
                  target="_blank"
                  rel="noopener"
                  className="text-white font-bold text-lg hover:opacity-80 transition"
                >
                  Написать в MAX →
                </a>
              </li>
            )}
            <li>База: {SITE.baseLocation}</li>
            <li>
              <a href={`mailto:${SITE.email}`} className="hover:text-white transition">
                {SITE.email}
              </a>
            </li>
            <li className="flex flex-wrap gap-3 pt-2">
              <a href={SITE.telegramChannel} target="_blank" rel="noopener" className="hover:text-white transition">Канал стройки</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x py-6 text-xs text-white/50 flex flex-col md:flex-row justify-between gap-2">
          {/* Реквизиты открыто: клиент может пробить ИП до звонка, поисковик видит
              реальное юрлицо за сайтом. У большинства конкурентов этого нет. */}
          <span>
            © {new Date().getFullYear()} ИП Демченко · ОГРНИП {SITE.ogrnip} · ИНН {SITE.inn}
          </span>
          <span>Семейная стройка в СПб и Ленобласти.</span>
        </div>
      </div>
    </footer>
  );
}
