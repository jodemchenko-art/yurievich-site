import type { Article } from './_types';
import { plitaIliLentaPodGazobeton } from './plita-ili-lenta-pod-gazobeton';
import { plitnyyFundamentNaTorfeLeskolovoNaziya } from './plitnyy-fundament-na-torfe-leskolovo-naziya';
import { plitnyyFundamentPodGazobetonTolschinaArmirovanie } from './plitnyy-fundament-pod-gazobeton-tolschina-armirovanie';
import { plitnyyFundamentVsevolozhskCena } from './plitnyy-fundament-vsevolozhsk-cena';
import { treschinyVFundamentePrichinyChtoDelat } from './treschiny-v-fundamente-prichiny-chto-delat';

// Реестр статей блога. Авто-сгенерирован import-articles.js
// Свежие статьи добавляются сюда автоматически.

export const ARTICLES: Article[] = [
  plitaIliLentaPodGazobeton,
  plitnyyFundamentNaTorfeLeskolovoNaziya,
  plitnyyFundamentPodGazobetonTolschinaArmirovanie,
  plitnyyFundamentVsevolozhskCena,
  treschinyVFundamentePrichinyChtoDelat,
];

export function getArticleBySlug(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function getRelatedArticles(slug: string, limit = 3): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  if (current.related_slugs && current.related_slugs.length > 0) {
    const named = current.related_slugs
      .map((s) => getArticleBySlug(s))
      .filter(Boolean) as Article[];
    if (named.length >= limit) return named.slice(0, limit);
  }
  const sameCategory = ARTICLES.filter((a) => a.slug !== slug && a.category === current.category);
  const others = ARTICLES.filter((a) => a.slug !== slug && a.category !== current.category);
  return [...sameCategory, ...others].slice(0, limit);
}

export function getArticlesByCategory(category: string): Article[] {
  return ARTICLES.filter((a) => a.category === category);
}

export function getAllSlugs(): string[] {
  return ARTICLES.map((a) => a.slug);
}

export * from './_types';
