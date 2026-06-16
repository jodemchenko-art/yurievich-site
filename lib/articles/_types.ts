export type ArticleFaq = {
  q: string;
  a: string;
};

export type ArticleCategory =
  | 'plitnyi-fundament'
  | 'gazobeton'
  | 'vybor-fundamenta'
  | 'gruntovye-usloviya'
  | 'tekhnologii'
  | 'sezonnost'
  | 'gid-zakazchika';

export const CATEGORY_LABELS: Record<ArticleCategory, string> = {
  'plitnyi-fundament': 'Плитный фундамент',
  'gazobeton': 'Дом из газобетона',
  'vybor-fundamenta': 'Выбор фундамента',
  'gruntovye-usloviya': 'Грунтовые условия',
  'tekhnologii': 'Технологии работ',
  'sezonnost': 'Сезон работ',
  'gid-zakazchika': 'Гид заказчика',
};

export type Article = {
  slug: string;
  title: string;          // H1 на странице
  meta_title: string;     // <title>
  meta_description: string;
  publishedAt: string;    // ISO date 'YYYY-MM-DD'
  updatedAt?: string;
  category: ArticleCategory;
  region?: string;        // если гео-посадка, например 'Всеволожский район'
  reading_time: number;   // минут
  word_count: number;
  keywords: string[];
  faq: ArticleFaq[];
  html: string;           // тело статьи
  cover_image: string;    // путь к обложке
  cover_alt: string;
  related_slugs?: string[];
};
