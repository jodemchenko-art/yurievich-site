import type { Article } from './_types';
import { armirovaniePlityPodDvuhetazhnyyGazobeton } from './armirovanie-plity-pod-dvuhetazhnyy-gazobeton';
import { gazobetonD400IliD500Lenoblast } from './gazobeton-d400-ili-d500-lenoblast';
import { gidroizolyaciyaPodPlitnymFundamentomNuzhnaLi } from './gidroizolyaciya-pod-plitnym-fundamentom-nuzhna-li';
import { gruntovyeVodyBlizkoKakoyFundamentVybrat } from './gruntovye-vody-blizko-kakoy-fundament-vybrat';
import { kakZalitPlitnyyFundamentZimoy } from './kak-zalit-plitnyy-fundament-zimoy';
import { kogdaLuchsheZalivatPlitnyyFundamentLeningradskayaOblast } from './kogda-luchshe-zalivat-plitnyy-fundament-leningradskaya-oblast';
import { monolitnayaPlita8x10CenaLenoblast } from './monolitnaya-plita-8x10-cena-lenoblast';
import { monolitnayaPlitaIliUshpPodGazobeton } from './monolitnaya-plita-ili-ushp-pod-gazobeton';
import { mzlfIliPlitaPodGazobeton } from './mzlf-ili-plita-pod-gazobeton';
import { plita10x12PodGazobetonCena300mm } from './plita-10x12-pod-gazobeton-cena-300mm';
import { plitaIliLentaPodGazobeton } from './plita-ili-lenta-pod-gazobeton';
import { plitaPoplylaChtoDelat } from './plita-poplyla-chto-delat';
import { plitnyyFundament10x10CenaPodKlyuchSpb } from './plitnyy-fundament-10x10-cena-pod-klyuch-spb';
import { plitnyyFundamentCenaZaM2Spb } from './plitnyy-fundament-cena-za-m2-spb';
import { plitnyyFundamentGatchinaCena } from './plitnyy-fundament-gatchina-cena';
import { plitnyyFundamentKurortnyyRayonSpb } from './plitnyy-fundament-kurortnyy-rayon-spb';
import { plitnyyFundamentNaTorfeLeskolovoNaziya } from './plitnyy-fundament-na-torfe-leskolovo-naziya';
import { plitnyyFundamentPodGazobetonTolschinaArmirovanie } from './plitnyy-fundament-pod-gazobeton-tolschina-armirovanie';
import { plitnyyFundamentPriozerskiyRayon } from './plitnyy-fundament-priozerskiy-rayon';
import { plitnyyFundamentTosnoCena } from './plitnyy-fundament-tosno-cena';
import { plitnyyFundamentVsevolozhskCena } from './plitnyy-fundament-vsevolozhsk-cena';
import { promerzaetFundamentChtoDelat } from './promerzaet-fundament-chto-delat';
import { puchinistyyGruntKakoyFundament } from './puchinistyy-grunt-kakoy-fundament';
import { svaiIliPlitaPodGazobetonLeningradskayaOblast } from './svai-ili-plita-pod-gazobeton-leningradskaya-oblast';
import { treschinyVFundamentePrichinyChtoDelat } from './treschiny-v-fundamente-prichiny-chto-delat';

// Реестр статей блога. Авто-сгенерирован import-articles.js
// Свежие статьи добавляются сюда автоматически.

export const ARTICLES: Article[] = [
  armirovaniePlityPodDvuhetazhnyyGazobeton,
  gazobetonD400IliD500Lenoblast,
  gidroizolyaciyaPodPlitnymFundamentomNuzhnaLi,
  gruntovyeVodyBlizkoKakoyFundamentVybrat,
  kakZalitPlitnyyFundamentZimoy,
  kogdaLuchsheZalivatPlitnyyFundamentLeningradskayaOblast,
  monolitnayaPlita8x10CenaLenoblast,
  monolitnayaPlitaIliUshpPodGazobeton,
  mzlfIliPlitaPodGazobeton,
  plita10x12PodGazobetonCena300mm,
  plitaIliLentaPodGazobeton,
  plitaPoplylaChtoDelat,
  plitnyyFundament10x10CenaPodKlyuchSpb,
  plitnyyFundamentCenaZaM2Spb,
  plitnyyFundamentGatchinaCena,
  plitnyyFundamentKurortnyyRayonSpb,
  plitnyyFundamentNaTorfeLeskolovoNaziya,
  plitnyyFundamentPodGazobetonTolschinaArmirovanie,
  plitnyyFundamentPriozerskiyRayon,
  plitnyyFundamentTosnoCena,
  plitnyyFundamentVsevolozhskCena,
  promerzaetFundamentChtoDelat,
  puchinistyyGruntKakoyFundament,
  svaiIliPlitaPodGazobetonLeningradskayaOblast,
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
