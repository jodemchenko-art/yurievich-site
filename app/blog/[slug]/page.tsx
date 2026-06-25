import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  ARTICLES,
  getArticleBySlug,
  getRelatedArticles,
} from '@/lib/articles';
import { CATEGORY_LABELS } from '@/lib/articles/_types';
import { SITE } from '@/lib/site';
import { buildArticleGraph, buildGraph } from '@/lib/schema';
import { enhanceTitle, enhanceDescription } from '@/lib/seo-snippets';
import { getHowToForArticle, buildHowToSchema } from '@/lib/howto';
import ArticleHeader from '@/components/blog/ArticleHeader';
import ArticleBody from '@/components/blog/ArticleBody';
import ArticleCta from '@/components/blog/ArticleCta';
import InArticleCta from '@/components/blog/InArticleCta';
import LeadMagnetBanner from '@/components/LeadMagnetBanner';
import ArticleFaq from '@/components/blog/ArticleFaq';
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

  // CTR-оптимизация: ★5, выезд бесплатно, телефон в description
  const variant = article.category === 'plitnyi-fundament' || article.category === 'gazobeton'
    ? 'commercial'
    : 'informational';
  const enhTitle = enhanceTitle(article.meta_title, variant);
  const enhDesc = enhanceDescription(article.meta_description, variant);

  return {
    title: enhTitle,
    description: enhDesc,
    keywords: article.keywords,
    alternates: { canonical },
    openGraph: {
      type: 'article',
      locale: 'ru_RU',
      url: `${SITE.url}${canonical}`,
      title: enhTitle,
      description: enhDesc,
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

  // Единый @graph: Article + FAQPage + BreadcrumbList + (опц) HowTo
  const howto = getHowToForArticle(article.slug);
  const baseEntities = buildArticleGraph(article, canonicalUrl, `/blog/${article.slug}/`);
  const pageGraph = buildGraph(
    baseEntities,
    howto ? [buildHowToSchema(howto)] : []
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pageGraph) }}
      />

      <ArticleHeader article={article} />
      <ArticleBody html={article.html} />
      <InArticleCta source={`blog:${article.slug}`} variant="block" />
      <ArticleFaq items={article.faq} />
      <div className="container-x"><LeadMagnetBanner source={`blog:${article.slug}`} /></div>
      <ArticleCta />
      <RelatedArticles articles={related} />
    </>
  );
}
