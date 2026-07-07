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
      { source: '/blog/plita-pod-gazobeton-gatchina-cena', destination: '/blog/plitnyy-fundament-gatchina-cena/', permanent: true },
      { source: '/blog/monolitnaya-plita-skolko-stoit-zalit-v-gatchine', destination: '/blog/plitnyy-fundament-gatchina-cena/', permanent: true },
      { source: '/blog/plata-ili-lenta-pod-dom-iz-gazobetona', destination: '/blog/plita-ili-lenta-pod-gazobeton/', permanent: true },
      { source: '/blog/plita-na-svayah-leskolovo-otzyvy', destination: '/blog/plita-na-svayah-leskolovo/', permanent: true },

      // A4: города-дубли локалити → страница своего района (убрана каннибализация «фундамент {город}»)
      { source: '/fundament/vsevolozhsk/vsevolozhsk-gorod', destination: '/fundament/vsevolozhsk/', permanent: true },
      { source: '/fundament/gatchina/gatchina-gorod', destination: '/fundament/gatchina/', permanent: true },
      { source: '/fundament/tosno/tosno-gorod', destination: '/fundament/tosno/', permanent: true },
      { source: '/fundament/vyborg/vyborg-gorod', destination: '/fundament/vyborg/', permanent: true },
      { source: '/fundament/priozersk/priozersk-gorod', destination: '/fundament/priozersk/', permanent: true },
    ];
  },
};

module.exports = nextConfig;
