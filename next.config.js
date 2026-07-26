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
      { source: '/blog/uchastok-bolotistyi-fundament-chto-delat', destination: '/blog/uchastok-bolotistyy-pod-fundament-chto-delat/', permanent: true },
      { source: '/blog/chto-delat-esli-fundament-dal-usadku-gazobeton', destination: '/blog/fundament-dal-usadku-chto-delat-gazobeton/', permanent: true },
      { source: '/blog/monolitnaya-plita-250-mm-cena', destination: '/blog/monolitnaya-plita-250-mm-cena-za-m2/', permanent: true },
      { source: '/blog/monolitnaya-plita-8h10-tsena-lenoblast', destination: '/blog/monolitnaya-plita-8x10-cena-lenoblast/', permanent: true },
      { source: '/blog/dom-iz-gazobetona-lsr-pod-klyuch-tsena-za-kvadratny-metr', destination: '/blog/dom-iz-gazobetona-lsr-pod-klyuch-cena-za-m2/', permanent: true },
      // ↓ раньше вели на статью-каннибал про Гатчину, теперь сразу на посадочную района (без цепочки 301→301)
      { source: '/blog/plita-pod-gazobeton-gatchina-cena', destination: '/fundament/gatchina/', permanent: true },
      { source: '/blog/monolitnaya-plita-skolko-stoit-zalit-v-gatchine', destination: '/fundament/gatchina/', permanent: true },
      { source: '/blog/plata-ili-lenta-pod-dom-iz-gazobetona', destination: '/blog/plita-ili-lenta-pod-gazobeton/', permanent: true },
      { source: '/blog/plita-na-svayah-leskolovo-otzyvy', destination: '/blog/plita-na-svayah-leskolovo/', permanent: true },

      // 08.07: near-дубли автопилота -> канон (SEO-чистка)
      { source: '/blog/plitnyi-fundament-gazobeton-dom-tolshchina', destination: '/blog/plitnyy-fundament-pod-gazobeton-tolschina-armirovanie/', permanent: true },
      { source: '/blog/armirovanie-plitnogo-fundamenta-gazobeton', destination: '/blog/armirovanie-plity-pod-dvuhetazhnyy-gazobeton/', permanent: true },
      { source: '/blog/cena-vytorfovki-uchastka-10-sotok-leskolovo', destination: '/blog/vytorfovka-uchastka-leskolovo-cena/', permanent: true },
      { source: '/blog/skolko-stoit-zalit-monolitnuyu-plitu-8h10-spb', destination: '/blog/monolitnaya-plita-8x10-cena-lenoblast/', permanent: true },
      { source: '/blog/dom-iz-gazobetona-lsr-pod-klyuch-spb-lenoblast', destination: '/blog/dom-iz-gazobetona-lsr-pod-klyuch-cena-za-m2/', permanent: true },
      { source: '/blog/skolko-stoit-zalit-plitu-pod-gazobetonnyi-dom-100-m2', destination: '/blog/plita-pod-gazobeton-100m2-cena-pod-klyuch/', permanent: true },
      { source: '/blog/cena-fundamenta-pod-gazobeton-100-m2', destination: '/blog/plita-pod-gazobeton-100m2-cena-pod-klyuch/', permanent: true },

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
      { source: '/blog/plitnyi-fundament-pod-gazobeton-cena', destination: '/fundament/', permanent: true },
      { source: '/blog/plitnyy-fundament-cena-za-m2-spb', destination: '/fundament/', permanent: true },
      { source: '/blog/monolitnaya-plita-tsena-rabota-spb', destination: '/fundament/', permanent: true },
      { source: '/blog/monolitnyy-plitnyy-fundament-spb-pod-klyuch', destination: '/fundament/', permanent: true },

      // 12×12 — было три статьи на один запрос. Оставили ту, что Яндекс уже держит в поиске.
      { source: '/blog/monolitnaya-plita-12x12-cena-spb', destination: '/blog/cena-plity-fundamenta-12h12-spb/', permanent: true },
      { source: '/blog/plita-12x12-pod-gazobeton-cena-pod-klyuch', destination: '/blog/cena-plity-fundamenta-12h12-spb/', permanent: true },

      // Две почти одинаковые статьи про отзывы — оставили одну.
      { source: '/blog/plitnyi-fundament-gazobeton-dom-leningradskaya-oblast-otzyvy', destination: '/blog/plitnyy-fundament-dlya-gazobetona-lenoblast-otzyvy/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
