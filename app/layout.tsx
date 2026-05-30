import type { Metadata, Viewport } from 'next';
import Script from 'next/script';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StickyPhoneBar from '@/components/StickyPhoneBar';
import FloatingChat from '@/components/FloatingChat';
import { SITE, SERVICES_LIST } from '@/lib/site';

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
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },

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
  // === Schema.org structured data ===

  // 1) Organization / GeneralContractor (LocalBusiness subtype)
  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'GeneralContractor',
    '@id': `${SITE.url}/#organization`,
    name: SITE.legalName,
    alternateName: SITE.name,
    description: SITE.longDesc,
    url: SITE.url,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.url}/logo.png`,
    },
    image: [`${SITE.url}${SITE.defaultOgImage}`],
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: '₽₽',
    foundingDate: '2010', // placeholder, не подтверждён — можно убрать
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'RU',
      addressRegion: 'Ленинградская область',
      addressLocality: `Санкт-Петербург, ${SITE.baseLocation}`,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    areaServed: SITE.areaServed.map((a) => ({ '@type': 'AdministrativeArea', name: a })),
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '09:00',
        closes: '21:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '10:00',
        closes: '18:00',
      },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: SITE.rating,
      reviewCount: SITE.reviewsCount,
      bestRating: '5',
      worstRating: '1',
    },
    sameAs: [SITE.telegram, SITE.telegramChannel, SITE.whatsapp].filter(Boolean),
    knowsAbout: [
      'Монолитный плитный фундамент',
      'Дом из газобетона под ключ',
      'Строительство домов',
      'Фундаментные работы',
      'Газобетон ЛСР',
      'Зимнее бетонирование',
    ],
  };

  // 2) Services list
  const servicesJsonLd = SERVICES_LIST.map((s, i) => ({
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${SITE.url}/#service-${s.id}`,
    name: s.name,
    description: s.description,
    provider: { '@id': `${SITE.url}/#organization` },
    areaServed: SITE.areaServed,
    category: s.category,
    serviceType: s.shortName,
    ...(s.price.from
      ? {
          offers: {
            '@type': 'Offer',
            price: s.price.from,
            priceCurrency: 'RUB',
            priceSpecification: {
              '@type': 'UnitPriceSpecification',
              price: s.price.from,
              priceCurrency: 'RUB',
              unitText: s.price.unit,
            },
          },
        }
      : {}),
  }));

  // 3) WebSite (for sitelinks searchbox)
  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.url}/#website`,
    url: SITE.url,
    name: SITE.name,
    description: SITE.shortDesc,
    publisher: { '@id': `${SITE.url}/#organization` },
    inLanguage: 'ru-RU',
  };

  return (
    <html lang="ru">
      <head>
        <link rel="icon" href="/favicon.ico" />
        {/* Preconnect speeds up font loading (Core Web Vitals) */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {servicesJsonLd.map((s, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(s) }}
          />
        ))}
      </head>
      <body>
        <Header />
        <main className="pb-20 md:pb-0">{children}</main>
        <Footer />
        <StickyPhoneBar />
        <FloatingChat />

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
