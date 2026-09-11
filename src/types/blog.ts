export interface GadgetSpecs {
  display?: string;
  processor?: string;
  ram?: string;
  storage?: string;
  battery?: string;
  camera?: string;
  os?: string;
  price?: string;
  connectivity?: string;
  weight?: string;
}

export interface SeoMeta {
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  canonicalUrl?: string;
  ogImage?: string;
}

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: string;
  categorySlug: string;
  tags: string[];
  author: Author;
  publishedAt: string;
  updatedAt?: string;
  readingTime: string;
  verdictScore: number; // e.g. 9.3 out of 10
  verdictSummary: string;
  pros: string[];
  cons: string[];
  specs: GadgetSpecs;
  seo: SeoMeta;
  isFeatured?: boolean;
  isTrending?: boolean;
  views?: number;
  eeatScore?: number; // 0 to 100
  originalityScore?: number; // 0 to 100
}

export interface CategoryInfo {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  featuredColor: string;
}
