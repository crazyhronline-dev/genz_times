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
  postType?: 'article' | 'review'; // 'article' for editorial news/guides, 'review' for hardware tests
  subtitle?: string; // For articles: Dek or summary hook
  keyTakeaways?: string[]; // For articles: Key Bullet points / Highlights
  sources?: { title: string; url: string }[]; // For articles: References and sources
  faqs?: { question: string; answer: string }[]; // For articles & explainers: FAQ pairs
  verdictScore?: number; // e.g. 9.3 out of 10 (optional for standard articles)
  verdictSummary?: string; // (optional for standard articles)
  pros?: string[]; // (optional for standard articles)
  cons?: string[]; // (optional for standard articles)
  specs?: GadgetSpecs; // (optional for standard articles)
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
