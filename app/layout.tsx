import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyPhoneBar from '@/components/StickyPhoneBar';
import FloatingChat from '@/components/FloatingChat';
import LeadPopup from '@/components/LeadPopup';
import { SITE } from '@/lib/site';
import { buildSiteEntities, buildGraph } from '@/lib/schema';

export const viewport: Viewport = {
  themeColor: '#1B3A5C',
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: {
    default: `${SITE.tagline} · ${SITE.name}`,
    template: `%s · ${SITE.name}`,
  },
  description: SITE.shortDesc,
  keywords: [...SITE.keywords],
  authors: [{ name: SITE.fullName }],
  creator: SITE.fullName,
  publisher: SITE.fullName,
  applicationName: SITE.name,
  generator: 'Next.js',
  category: 'Construction',
  classification: 'Construction company',

  alternates: {
    canonical: '/',
    languages: { 'ru-RU': '/' },
  },

  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: SITE.url,
    siteName: SITE.name,
    title: `${SITE.tagline} · ${SITE.name}`,
    description: SITE.shortDesc,
    images: [
      {
        url: SITE.defaultOgImage,
        width: 1200,
        height: 630,
        alt: `${SITE.name} — ${SITE.tagline}`,
      },
    ],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${SITE.tagline} · ${SITE.name}`,
    description: SITE.shortDesc,
    images: [SITE.defaultOgImage],
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },

  // Search engine verification — fill these in after registering in Webmaster
  verification: {
    google: SITE.googleVerification || undefined,
    yandex: SITE.yandexVerification || undefined,
  },

  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  manifest: '/manifest.json',

  other: {
    // Russian language explicit
    'content-language': 'ru-RU',
    // Geo tags (still respected by Yandex for local SEO)
    'geo.region': 'RU-SPE',
    'geo.placename': SITE.city,
    'geo.position': `${SITE.geo.lat};${SITE.geo.lng}`,
    ICBM: `${SITE.geo.lat}, ${SITE.geo.lng}`,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // === Единый @graph (#51 из SEO_YANDEX_100_AVTOPILOT) ===
  // Все базовые сущности сайта (Org+Persons+WebSite+Services) в одной @graph.
  // На страницах добавляются свои сущности через @id-ссылки.
  const siteGraph = buildGraph(buildSiteEntities() as any);

  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />

        {/* Preconnect к критичным внешним доменам — экономит 100-300мс на RTT */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="https://mc.yandex.ru" />
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Единый @graph со всеми базовыми сущностями (Org+Persons+WebSite+Services) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteGraph) }}
        />
      </head>
      <body>
        <Header />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer />
        <StickyPhoneBar />
        <FloatingChat />
        <LeadPopup />

        {/* === Yandex.Metrika === */}
        {SITE.yandexMetrikaId && (
          <>
            <Script id="yandex-metrika" strategy="afterInteractive">
              {`
                (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
                m[i].l=1*new Date();
                for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
                k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
                (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");
                ym(${SITE.yandexMetrikaId}, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true,
                  ecommerce:"dataLayer"
                });
              `}
            </Script>
            <noscript>
              <div>
                <img
                  src={`https://mc.yandex.ru/watch/${SITE.yandexMetrikaId}`}
                  style={{ position: 'absolute', left: '-9999px' }}
                  alt=""
                />
              </div>
            </noscript>
          </>
        )}

        {/* === Google Analytics 4 === */}
        {SITE.googleAnalyticsId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${SITE.googleAnalyticsId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-config" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${SITE.googleAnalyticsId}');
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  );
}
