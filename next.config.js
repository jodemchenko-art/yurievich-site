/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: true,

  // Меньше HTTP-заголовков = быстрее (для слабых соединений из RU)
  poweredByHeader: false,
  generateEtags: true,

  // Оптимизация изображений
  images: {
    formats: ['image/avif', 'image/webp'],
    // Год кеша на оптимизированные картинки (минимум TTL)
    minimumCacheTTL: 31536000,
    // Размеры под мобайл / десктоп
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Compress: gzip + brotli (Vercel применяет автоматически но включаем явно)
  compress: true,

  // Долгий кеш на статике /_next/static/ (Vercel это уже делает, но дублирование не вредит)
  async headers() {
    return [
      {
        source: '/_next/static/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/images/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      // Все SSG-страницы — CDN-кеш 1 час с stale-while-revalidate сутки
      // Это критично для RU-юзеров: даже если первый запрос медленный,
      // последующие приходят с edge мгновенно.
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=0, s-maxage=3600, stale-while-revalidate=86400' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // HSTS: браузер сам ходит по https, без лишнего http→https редиректа.
          // Минус один хоп на первом заходе + плюсик к оценке безопасности сайта.
          { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
        ],
      },
    ];
  },

  // === 301-редиректы: слитые дубли-статьи → канонические (SEO-чистка 07.07.2026) ===
  // Старые адреса и их накопленный вес переходят на сильную статью.
  async redirects() {
    return [
      // 11.09.2026: малоценные и дублирующие страницы слиты в типовые посадочные, /ceny/, /doma/ (аудит AUDIT-I-PLAN-TOP-11-09-2026)
      { source: '/blog/fundament-pod-banyu-iz-gazobetona-spb', destination: '/fundament/pod-banyu/', permanent: true },
      { source: '/blog/fundament-plita-pod-garazh-spb', destination: '/fundament/pod-garazh/', permanent: true },
      { source: '/blog/uteplyonnaya-shvedskaya-plita-ushp-spb', destination: '/fundament/ushp/', permanent: true },
      { source: '/blog/plita-s-rebrami-pod-gazobeton-lenoblast', destination: '/fundament/plita-s-rebrami/', permanent: true },
      { source: '/blog/svayno-rostverkovyy-fundament-pod-klyuch-cena-leningradskaya-oblast', destination: '/fundament/svai/', permanent: true },
      { source: '/blog/dom-iz-gazobetona-lsr-pod-klyuch-cena-za-m2', destination: '/doma/ceny/', permanent: true },
      { source: '/blog/korobka-iz-gazobetona-pod-kryshu-spb-cena', destination: '/doma/', permanent: true },
      { source: '/blog/plita-na-svayah-leskolovo', destination: '/fundament/vsevolozhsk/leskolovo/', permanent: true },
      { source: '/blog/plita-pod-gazobeton-100m2-cena-pod-klyuch', destination: '/ceny/', permanent: true },
      { source: '/blog/plitnyy-fundament-dlya-gazobetona-lenoblast-otzyvy', destination: '/otzyvy/', permanent: true },
      { source: '/blog/plitnyy-fundament-pod-gazobeton-lenoblast-cena-2026', destination: '/ceny/', permanent: true },
      { source: '/blog/plitnyy-fundament-pod-brus-9x9-cena-lenoblast', destination: '/ceny/', permanent: true },
      { source: '/blog/monolitnaya-plita-8x10-cena-lenoblast', destination: '/ceny/', permanent: true },
      { source: '/blog/plita-6x8-cena-pod-klyuch-spb', destination: '/ceny/', permanent: true },
      { source: '/blog/monolitnaya-plita-250-mm-cena-za-m2', destination: '/ceny/', permanent: true },
      { source: '/blog/plita-300-mm-pod-dvuhetazhnyy-dom-cena', destination: '/ceny/', permanent: true },
      { source: '/blog/plita-10x10-350mm-dvoynoe-armirovanie-cena', destination: '/ceny/', permanent: true },
      { source: '/blog/skolko-stoit-fundament-pod-dom-pod-klyuch-leningradskaya-oblast', destination: '/ceny/', permanent: true },
      { source: '/blog/zakazat-zalivku-fundamenta-pod-klyuch-spb-nedorogo', destination: '/fundament/plita/', permanent: true },
      { source: '/blog/fundament-pod-dvuhetazhnyy-dom-iz-gazobetona-cena', destination: '/ceny/', permanent: true },
      { source: '/blog/plitnyy-fundament-pod-gazobeton-375-mm-cena', destination: '/ceny/', permanent: true },
      { source: '/blog/plita-pod-dom-s-mansardoy-iz-gazobetona-cena', destination: '/ceny/', permanent: true },
      { source: '/blog/fundament-pod-karkasnyy-dom-spb', destination: '/fundament/plita/', permanent: true },
      { source: '/blog/tolschina-plity-pod-dom-gazobeton-8x10', destination: '/blog/plitnyy-fundament-pod-gazobeton-tolschina-armirovanie/', permanent: true },
      { source: '/blog/dom-pod-klyuch-ili-korobka-pod-krysu-gazobeton-spb', destination: '/doma/', permanent: true },
      { source: '/blog/plitnyy-fundament-vsevolozhsk-na-torfe', destination: '/fundament/vsevolozhsk/', permanent: true },
      { source: '/slovar/plitnyy-fundament', destination: '/fundament/plita/', permanent: true },
      { source: '/slovar/lentochnyy-fundament', destination: '/fundament/lenta/', permanent: true },
      { source: '/slovar/tolshchina-plity', destination: '/fundament/plita/', permanent: true },
      { source: '/slovar/beton-m200', destination: '/slovar/beton-m300/', permanent: true },
      { source: '/slovar/beton-m400', destination: '/slovar/beton-m300/', permanent: true },
      { source: '/slovar/gazobeton-d400', destination: '/slovar/gazobeton-d500/', permanent: true },
      { source: '/slovar/gazobeton-d600', destination: '/slovar/gazobeton-d500/', permanent: true },
      { source: '/slovar/sp-63-13330-2018', destination: '/slovar/armirovanie-dvoynoy-setkoy/', permanent: true },
      { source: '/slovar/gost-7473', destination: '/slovar/beton-m300/', permanent: true },
      { source: '/slovar/gost-34028', destination: '/slovar/armatura-a500s/', permanent: true },
      { source: '/slovar/tolshchina-steny-gazobetona', destination: '/blog/gazobeton-375-ili-400-mm-stena-bez-utepleniya-spb/', permanent: true },
      { source: '/blog/uchastok-bolotistyi-fundament-chto-delat', destination: '/blog/uchastok-bolotistyy-pod-fundament-chto-delat/', permanent: true },
      { source: '/blog/chto-delat-esli-fundament-dal-usadku-gazobeton', destination: '/blog/fundament-dal-usadku-chto-delat-gazobeton/', permanent: true },
      { source: '/blog/monolitnaya-plita-250-mm-cena', destination: '/ceny/', permanent: true },
      { source: '/blog/monolitnaya-plita-8h10-tsena-lenoblast', destination: '/ceny/', permanent: true },
      { source: '/blog/dom-iz-gazobetona-lsr-pod-klyuch-tsena-za-kvadratny-metr', destination: '/doma/ceny/', permanent: true },
      // ↓ раньше вели на статью-каннибал про Гатчину, теперь сразу на посадочную района (без цепочки 301→301)
      { source: '/blog/plita-pod-gazobeton-gatchina-cena', destination: '/fundament/gatchina/', permanent: true },
      { source: '/blog/monolitnaya-plita-skolko-stoit-zalit-v-gatchine', destination: '/fundament/gatchina/', permanent: true },
      { source: '/blog/plata-ili-lenta-pod-dom-iz-gazobetona', destination: '/fundament/lenta/', permanent: true },
      { source: '/blog/plita-na-svayah-leskolovo-otzyvy', destination: '/fundament/vsevolozhsk/leskolovo/', permanent: true },

      // 08.07: near-дубли автопилота -> канон (SEO-чистка)
      { source: '/blog/plitnyi-fundament-gazobeton-dom-tolshchina', destination: '/blog/plitnyy-fundament-pod-gazobeton-tolschina-armirovanie/', permanent: true },
      { source: '/blog/armirovanie-plitnogo-fundamenta-gazobeton', destination: '/blog/armirovanie-plity-pod-dvuhetazhnyy-gazobeton/', permanent: true },
      { source: '/blog/cena-vytorfovki-uchastka-10-sotok-leskolovo', destination: '/blog/vytorfovka-uchastka-leskolovo-cena/', permanent: true },
      { source: '/blog/skolko-stoit-zalit-monolitnuyu-plitu-8h10-spb', destination: '/ceny/', permanent: true },
      { source: '/blog/dom-iz-gazobetona-lsr-pod-klyuch-spb-lenoblast', destination: '/doma/ceny/', permanent: true },
      { source: '/blog/skolko-stoit-zalit-plitu-pod-gazobetonnyi-dom-100-m2', destination: '/ceny/', permanent: true },
      { source: '/blog/cena-fundamenta-pod-gazobeton-100-m2', destination: '/ceny/', permanent: true },

      // A4: города-дубли локалити → страница своего района (убрана каннибализация «фундамент {город}»)
      { source: '/fundament/vsevolozhsk/vsevolozhsk-gorod', destination: '/fundament/vsevolozhsk/', permanent: true },
      { source: '/fundament/gatchina/gatchina-gorod', destination: '/fundament/gatchina/', permanent: true },
      { source: '/fundament/tosno/tosno-gorod', destination: '/fundament/tosno/', permanent: true },
      { source: '/fundament/vyborg/vyborg-gorod', destination: '/fundament/vyborg/', permanent: true },
      { source: '/fundament/priozersk/priozersk-gorod', destination: '/fundament/priozersk/', permanent: true },

      // === 2026-07-26, SEO-аудит. Склейка каннибалов ===
      // Проблема: под один и тот же коммерческий запрос у нас било по 2-4 страницы —
      // блог-статья, посадочная района и хаб. Поисковик в такой ситуации не выбирает
      // «лучшую», он занижает все. Оставляем одну страницу на запрос.

      // Гео-запросы «фундамент {район} цена» — это работа посадочных /fundament/[район]/,
      // а не блога. Статьи-двойники снимаем и склеиваем с посадочными.
      { source: '/blog/plitnyy-fundament-gatchina-cena', destination: '/fundament/gatchina/', permanent: true },
      { source: '/blog/plitnyy-fundament-vsevolozhsk-cena', destination: '/fundament/vsevolozhsk/', permanent: true },
      { source: '/blog/plitnyy-fundament-tosno-cena', destination: '/fundament/tosno/', permanent: true },
      { source: '/blog/plitnyy-fundament-vyborgskiy-rayon', destination: '/fundament/vyborg/', permanent: true },
      { source: '/blog/plitnyy-fundament-priozerskiy-rayon', destination: '/fundament/priozersk/', permanent: true },
      { source: '/blog/plitnyy-fundament-kirovskiy-rayon-lo', destination: '/fundament/kirov/', permanent: true },
      { source: '/blog/plitnyy-fundament-kurortnyy-rayon-spb', destination: '/fundament/kurortnyy/', permanent: true },
      { source: '/blog/plitnyy-fundament-lomonosovskiy-rayon-cena', destination: '/fundament/lomonosov/', permanent: true },

      // «плитный фундамент цена СПб» и его синонимы — это денежная страница /fundament/
      // (там теперь таблица цен по размерам). Четыре статьи под тот же запрос — сняты.
      { source: '/blog/plitnyi-fundament-pod-gazobeton-cena', destination: '/ceny/', permanent: true },
      { source: '/blog/plitnyy-fundament-cena-za-m2-spb', destination: '/ceny/', permanent: true },
      { source: '/blog/monolitnaya-plita-tsena-rabota-spb', destination: '/ceny/', permanent: true },
      { source: '/blog/monolitnyy-plitnyy-fundament-spb-pod-klyuch', destination: '/fundament/plita/', permanent: true },

      // 12×12 — было три статьи на один запрос. Оставили ту, что Яндекс уже держит в поиске.
      { source: '/blog/monolitnaya-plita-12x12-cena-spb', destination: '/ceny/', permanent: true },
      { source: '/blog/plita-12x12-pod-gazobeton-cena-pod-klyuch', destination: '/ceny/', permanent: true },

      // Две почти одинаковые статьи про отзывы — оставили одну.
      { source: '/blog/plitnyi-fundament-gazobeton-dom-leningradskaya-oblast-otzyvy', destination: '/otzyvy/', permanent: true },
      // 11.09.2026: малоценные и дублирующие статьи → типовые страницы, цены, дома, отзывы
      { source: '/blog/smeta-na-monolitnuyu-plitu-fundamenta-obrazec-spb', destination: '/ceny/', permanent: true },
      { source: '/blog/cena-plity-fundamenta-12h12-spb', destination: '/ceny/', permanent: true },
      { source: '/blog/plita-250-ili-300-mm-pod-gazobeton-2-etazha', destination: '/blog/plitnyy-fundament-pod-gazobeton-tolschina-armirovanie/', permanent: true },
      { source: '/blog/plita-ili-lenta-pod-gazobeton', destination: '/fundament/lenta/', permanent: true },
      { source: '/blog/plita-6x6-pod-gazobeton-cena', destination: '/ceny/', permanent: true },
      { source: '/blog/plita-9x9-cena-pod-klyuch-spb', destination: '/ceny/', permanent: true },
      { source: '/blog/plitnyy-fundament-9x12-pod-gazobeton-cena', destination: '/ceny/', permanent: true },
      { source: '/blog/plita-10x12-pod-gazobeton-cena-300mm', destination: '/ceny/', permanent: true },
      // словарь: дубли терминов и нормативы → страницы услуг и живые термины
    ];
  },
};

module.exports = nextConfig;
