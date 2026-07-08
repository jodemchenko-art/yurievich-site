// schema.ts — единый @graph JSON-LD для всех страниц (#51 SEO_YANDEX_100).
//
// Идея: вместо N отдельных <script> на странице — ОДИН <script> с массивом
// сущностей через @id-ссылки. Это даёт Яндексу/Google связную «карту бизнеса»
// и улучшает понимание сущностей (entity-based ranking).
//
// Использование:
//   import { buildSiteEntities, buildArticleGraph, buildRegionGraph } from '@/lib/schema';
//   const graph = { '@context': 'https://schema.org', '@graph': [
//     ...buildSiteEntities(),
//     ...buildArticleGraph(article, canonicalUrl),
//   ]};
//   <script type="application/ld+json" dangerouslySetInnerHTML={{__html: JSON.stringify(graph)}}/>

import { SITE, SERVICES_LIST } from './site';
import type { Article } from './articles/_types';
import type { Region } from './regions';
import { buildRegionFaq } from './regions';
import { REVIEWS } from './reviews';

// === @id constants — стабильные ID для всех сущностей ===
export const ID = {
  org: `${SITE.url}/#organization`,
  website: `${SITE.url}/#website`,
  yuri: `${SITE.url}/#yuri-demchenko`,
  valery: `${SITE.url}/#valery-foreman`,
  evgeny: `${SITE.url}/#evgeny-supervisor`,
  service: (slug: string) => `${SITE.url}/#service-${slug}`,
  article: (slug: string) => `${SITE.url}/blog/${slug}/#article`,
  regionService: (slug: string) => `${SITE.url}/fundament/${slug}/#service`,
  faqPage: (path: string) => `${SITE.url}${path}#faq`,
  breadcrumb: (path: string) => `${SITE.url}${path}#breadcrumb`,
};

// === Базовые сущности сайта (Org, Persons, WebSite, Services) ===
// Эти сущности должны быть на КАЖДОЙ странице — это «о ком сайт».
export function buildSiteEntities() {
  return [
    // Организация — корневая сущность
    {
      '@type': 'GeneralContractor',
      '@id': ID.org,
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
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'RU',
        addressRegion: 'Санкт-Петербург',
        addressLocality: 'Санкт-Петербург',
        streetAddress: SITE.baseLocation,
        postalCode: (SITE as any).postalCode || undefined,
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
      sameAs: [
        SITE.telegram,
        SITE.telegramChannel,
        SITE.whatsapp,
        (SITE as any).vk,
        'https://yandex.ru/maps/org/69393767573',
      ].filter(Boolean),
      hasMap: 'https://yandex.ru/maps/org/69393767573',
      knowsAbout: [
        'Монолитный плитный фундамент',
        'Дом из газобетона под ключ',
        'Строительство домов',
        'Фундаментные работы',
        'Газобетон ЛСР',
        'Зимнее бетонирование',
      ],
      founder: { '@id': ID.yuri },
      employee: [{ '@id': ID.yuri }, { '@id': ID.valery }, { '@id': ID.evgeny }],
      makesOffer: SERVICES_LIST.map((s) => ({ '@id': ID.service(s.id) })),
      review: REVIEWS.map((r) => ({
        '@type': 'Review',
        '@id': `${SITE.url}/#review-${r.id}`,
        author: {
          '@type': 'Person',
          name: r.author,
          ...(r.authorCity ? { address: { '@type': 'PostalAddress', addressLocality: r.authorCity } } : {}),
        },
        datePublished: r.date,
        reviewRating: {
          '@type': 'Rating',
          ratingValue: r.rating,
          bestRating: 5,
          worstRating: 1,
        },
        reviewBody: r.body,
        ...(r.project ? { itemReviewed: { '@id': ID.org } } : { itemReviewed: { '@id': ID.org } }),
        publisher: { '@type': 'Organization', name: r.source },
      })),
    },

    // Person — Юрий
    {
      '@type': 'Person',
      '@id': ID.yuri,
      name: 'Юрий Демченко',
      jobTitle: 'Руководитель проекта',
      description:
        'Руководитель проекта в СК «Юрьевич». 239 завершённых объектов: плитные фундаменты и дома из газобетона в Санкт-Петербурге и Ленинградской области. Личный контроль каждой стройки.',
      worksFor: { '@id': ID.org },
      knowsAbout: [
        'Монолитный плитный фундамент',
        'Дом из газобетона ЛСР под ключ',
        'Грунты Ленинградской области',
        'Зимнее бетонирование',
        'Проектирование плитных фундаментов по СП 22.13330',
      ],
      url: SITE.url,
      telephone: SITE.phone,
      sameAs: [SITE.telegram, SITE.whatsapp].filter(Boolean),
    },

    // Person — Валерий
    {
      '@type': 'Person',
      '@id': ID.valery,
      name: 'Валерий Демченко',
      jobTitle: 'Прораб · производитель работ',
      description:
        'Прораб бригады СК «Юрьевич». Личный контроль заливки, армирования, гидроизоляции на объектах СПб и Ленобласти.',
      worksFor: { '@id': ID.org },
    },

    // Person — Евгений
    {
      '@type': 'Person',
      '@id': ID.evgeny,
      name: 'Евгений Демченко',
      jobTitle: 'Технический надзор · снабжение',
      description:
        'Технадзор и закупка материалов в СК «Юрьевич». Контроль качества бетона М300 W6 F150, арматуры А500С, газобетона ЛСР с заводскими паспортами.',
      worksFor: { '@id': ID.org },
    },

    // WebSite
    {
      '@type': 'WebSite',
      '@id': ID.website,
      url: SITE.url,
      name: SITE.name,
      description: SITE.shortDesc,
      publisher: { '@id': ID.org },
      inLanguage: 'ru-RU',
    },

    // Services
    ...SERVICES_LIST.map((s) => ({
      '@type': 'Service',
      '@id': ID.service(s.id),
      name: s.name,
      description: s.description,
      provider: { '@id': ID.org },
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
    })),
  ] as const;
}

// === Breadcrumb-сущность ===
export function buildBreadcrumb(path: string, items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    '@id': ID.breadcrumb(path),
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
}

// === FAQPage-сущность ===
export function buildFaqPage(path: string, faq: { q: string; a: string }[]) {
  if (!faq || faq.length === 0) return null;
  return {
    '@type': 'FAQPage',
    '@id': ID.faqPage(path),
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

// === Article-сущности для blog-страницы ===
export function buildArticleGraph(article: Article, canonicalUrl: string, breadcrumbPath: string) {
  const items: any[] = [
    {
      '@type': 'Article',
      '@id': ID.article(article.slug),
      headline: article.title,
      description: article.meta_description,
      datePublished: article.publishedAt,
      dateModified: article.updatedAt || article.publishedAt,
      author: { '@id': ID.yuri },
      publisher: { '@id': ID.org },
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
      image: article.cover_image
        ? `${SITE.url}${article.cover_image.startsWith('http') ? '' : ''}${article.cover_image}`
        : undefined,
      inLanguage: 'ru-RU',
      keywords: article.keywords?.join(', '),
      isPartOf: { '@id': ID.website },
    },
    buildBreadcrumb(breadcrumbPath, [
      { name: 'Главная', url: SITE.url },
      { name: 'Блог', url: `${SITE.url}/blog/` },
      { name: article.title, url: canonicalUrl },
    ]),
  ];
  const faq = buildFaqPage(breadcrumbPath, article.faq);
  if (faq) items.push(faq);
  return items;
}

// === Region-сущности для /fundament/[region] страницы ===
export function buildRegionGraph(region: Region, canonicalUrl: string, breadcrumbPath: string) {
  const faqItems = region.faq && region.faq.length > 0 ? region.faq : buildRegionFaq(region);
  return [
    {
      '@type': 'Service',
      '@id': ID.regionService(region.slug),
      name: `Плитный фундамент под ключ в ${region.prepositional}`,
      description: region.groundDescription.slice(0, 240),
      provider: { '@id': ID.org },
      areaServed: {
        '@type': 'AdministrativeArea',
        '@id': `${canonicalUrl}#area`,
        name: region.name,
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Ленинградская область',
        },
      },
      serviceType: 'Монолитный плитный фундамент',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'RUB',
        price: region.priceFrom,
        priceSpecification: {
          '@type': 'UnitPriceSpecification',
          price: region.priceFrom,
          priceCurrency: 'RUB',
          unitText: '₽/м²',
        },
      },
    },
    // LocalBusiness филиал (branchOf) для гео-выдачи Яндекса
    // Связывает район с головной организацией → Яндекс понимает «филиал в районе»
    {
      '@type': 'LocalBusiness',
      '@id': `${canonicalUrl}#localbusiness`,
      name: `СК «Юрьевич» — фундаменты в ${region.prepositional}`,
      description: `Строительство монолитных плитных фундаментов под ключ в ${region.prepositional}. ${region.groundDescription.slice(0, 180)}`,
      url: canonicalUrl,
      telephone: SITE.phone,
      priceRange: '₽₽',
      branchOf: { '@id': ID.org },
      parentOrganization: { '@id': ID.org },
      areaServed: {
        '@type': 'AdministrativeArea',
        name: region.name,
      },
      sameAs: ['https://yandex.ru/maps/org/69393767573'],
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: SITE.rating,
        reviewCount: SITE.reviewsCount,
        bestRating: '5',
        worstRating: '1',
      },
    },
    // Place entity для entity-based SEO (район как географическая локация)
    {
      '@type': 'Place',
      '@id': `${canonicalUrl}#place`,
      name: region.name,
      description: region.groundDescription.slice(0, 300),
      containedInPlace: { '@type': 'AdministrativeArea', name: 'Ленинградская область' },
    },
    buildBreadcrumb(breadcrumbPath, [
      { name: 'Главная', url: SITE.url },
      { name: 'Фундаменты по районам', url: `${SITE.url}/fundament/` },
      { name: `Плитный фундамент в ${region.prepositional}`, url: canonicalUrl },
    ]),
    buildFaqPage(breadcrumbPath, faqItems)!,
  ];
}

// === Хелпер: собрать готовый @graph объект ===
export function buildGraph(...entitiesGroups: any[][]) {
  return {
    '@context': 'https://schema.org',
    '@graph': entitiesGroups.flat().filter(Boolean),
  };
}
