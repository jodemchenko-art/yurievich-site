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
};

module.exports = nextConfig;
