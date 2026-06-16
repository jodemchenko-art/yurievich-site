import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ARTICLES,
  getArticleBySlug,
  getRelatedArticles,
} from '@/lib/articles';
import { CATEGORY_LABELS } from '@/lib/articles/_types';
import { SITE } from '@/lib/site';
import ArticleHeader from '@/components/blog/ArticleHeader';
import ArticleBody from '@/components/blog/ArticleBody';
import ArticleCta from '@/components/blog/ArticleCta';
import RelatedArticles from '@/components/blog/RelatedArticles';

type Params = { slug: string };

export function generateStaticParams() {
  return ARTICLES.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata(
  { params }: { params: Params }
): Promise<Metadata> {
  const article = getArticleBySlug(params.slug);
  if (!article) return {};

  const canonical = `/blog/${article.slug}/`;

  return {
    title: article.meta_title,
    description: article.meta_description,
    keywords: article.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      url: `${SITE.url}${canonical}`,
      title: article.meta_title,
      description: article.meta_description,
      siteName: SITE.name,
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      authors: [SITE.fullName],
      images: article.cover_image
        ? [
            {
              url: article.cover_image.startsWith('http')
                ? article.cover_image
                : `${SITE.url}${article.cover_image}`,
              width: 1200,
              height: 630,
              alt: article.cover_alt,
            },
          ]
        : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta_title,
      description: article.meta_description,
      images: article.cover_image ? [article.cover_image] : undefined,
    },
  };
}

export default function ArticlePage({ params }: { params: Params }) {
  const article = getArticleBySlug(params.slug);
  if (!article) notFound();

  const related = getRelatedArticles(article.slug, 3);
  const canonicalUrl = `${SITE.url}/blog/${article.slug}/`;

  // Schema.org Article + FAQPage + BreadcrumbList
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${canonicalUrl}#article`,
    mainEntityOfPage: { '@type': 'WebPage', '@id': canonicalUrl },
    headline: article.title,
    name: article.title,
    description: article.meta_description,
    image: article.cover_image
      ? [
          article.cover_image.startsWith('http')
            ? article.cover_image
            : `${SITE.url}${article.cover_image}`,
        ]
      : undefined,
    author: {
      '@type': 'Organization',
      '@id': `${SITE.url}/#organization`,
      name: SITE.fullName,
      url: SITE.url,
    },
    publisher: { '@id': `${SITE.url}/#organization` },
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt,
    inLanguage: 'ru-RU',
    articleSection: CATEGORY_LABELS[article.category] || article.category,
    keywords: article.keywords.join(', '),
    wordCount: article.word_count,
    isPartOf: { '@type': 'Blog', '@id': `${SITE.url}/blog/#blog` },
  };

  const faqSchema =
    article.faq && article.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: article.faq.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: { '@type': 'Answer', text: f.a },
          })),
        }
      : null;

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Главная',
        item: SITE.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Блог',
        item: `${SITE.url}/blog/`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <ArticleHeader article={article} />
      <ArticleBody html={article.html} />
      <ArticleCta />
      <RelatedArticles articles={related} />
    </>
  );
}
