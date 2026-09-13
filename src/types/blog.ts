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
  gpu?: string;
  ports?: string;
  driver?: string;
  frequency?: string;
  anc?: string;
  codecs?: string;
  mics?: string;
  waterproof?: string;
  fov?: string;
  tracking?: string;
  audio?: string;
  sensors?: string;
  video?: string;
  lens?: string;
  flightTime?: string;
  transmission?: string;
  gimbal?: string;
  controls?: string;
  thermals?: string;
  ecosystem?: string;
  dimensions?: string;
  [key: string]: string | undefined;
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

export interface ComparedGadget {
  id: string;
  name: string;
  badge?: string; // e.g. "Overall Winner", "Best Value", "Runner Up", "Editor's Choice"
  price?: string;
  verdictScore: number; // e.g. 9.4
  verdictSummary?: string;
  specs: GadgetSpecs;
  pros: string[];
  cons: string[];
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
  isComparison?: boolean; // True if this review compares multiple products
  comparisonCount?: number; // Number of compared products (1, 2, 3, etc.)
  comparedProducts?: ComparedGadget[]; // Detailed specs and verdicts for each compared product
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
