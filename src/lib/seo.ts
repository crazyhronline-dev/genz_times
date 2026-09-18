import { BlogPost, GadgetSpecs } from "@/types/blog";
import { getSpecFieldLabel } from "@/lib/category-specs";

export const SITE_CONFIG = {
  name: "GenZ Time",
  alternateName: ["Gen Z Time", "GenZ Tech", "GenZ Reviews"],
  title: "GenZ Time | Gen Z Tech Reviews, Hands-On Benchmarks & Next-Gen Gadgets",
  description: "The authoritative Gen Z tech publication. Real hands-on smartphone reviews, laptop benchmarks, AI gadget deep-dives, and gaming hardware guides tested by Sahil at GenZ Time.",
  url: "https://genztime.com",
  ogImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80",
  twitterHandle: "@GenZTimeTech",
  author: "Sahil",
  authorRole: "Founder & Lead Hardware Editor",
  authorBio: "Founder and lead hardware reviewer at GenZ Time, testing mobile silicon, smartphones, gaming gear, and spatial computing devices with rigorous hands-on lab benchmarks.",
};

/**
 * Extracts a clean gadget / product name from review headlines
 * (e.g. "Apple Vision Pro 2 In-Depth Review: The Spatial Computing Evolution" -> "Apple Vision Pro 2")
 */
export function cleanProductName(title: string): string {
  if (!title) return "Tech Gadget";
  const withoutPrefix = title.replace(/^(Hands-On|In-Depth|Exclusive|Full|Review:\s*|Benchmark:\s*|Shootout:\s*|Tested:\s*)\s*/i, "");
  const parts = withoutPrefix.split(/:\s+|—\s+|-\s+|\s+Review|\s+Benchmark|\s+Tested/i);
  return parts[0]?.trim() || title;
}

export const extractProductName = cleanProductName;

/**
 * Converts GadgetSpecs key-value pairs into Schema.org PropertyValue objects
 */
export function convertSpecsToProperties(specs?: GadgetSpecs, categorySlug?: string): Array<{
  "@type": "PropertyValue";
  name: string;
  value: string;
}> {
  if (!specs) return [];
  const properties: Array<{ "@type": "PropertyValue"; name: string; value: string }> = [];

  for (const [key, val] of Object.entries(specs)) {
    if (val && typeof val === 'string' && val.trim()) {
      properties.push({
        "@type": "PropertyValue",
        name: getSpecFieldLabel(key, categorySlug),
        value: val.trim(),
      });
    }
  }

  return properties;
}

/**
 * Generate rich connected Schema.org @graph for all post types:
 * - Editorial News & Articles (TechArticle / NewsArticle / Article)
 * - Single Product Hardware Reviews (Review with Product, Rating, Pros & Cons, Specs)
 * - Multi-Product Benchmark Comparisons (ItemList of Product Reviews with Lab Scores & Awards)
 * - FAQPage Schema (when FAQs are present)
 * - BreadcrumbList Schema
 */
export function generatePostGraphSchema(post: BlogPost): Record<string, any> {
  const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const wordCount = (post.content || '').split(/\s+/).filter(Boolean).length;
  const isReview = post.postType === 'review' || Boolean(post.verdictScore) || Boolean(post.isComparison);
  const articleType = isReview ? 'TechArticle' : 'Article';

  const graph: any[] = [];

  // 1. BreadcrumbList Schema
  graph.push({
    "@type": "BreadcrumbList",
    "@id": `${postUrl}#breadcrumb`,
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": SITE_CONFIG.url,
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": isReview ? "Hardware Reviews" : "Articles & News",
        "item": `${SITE_CONFIG.url}/blog`,
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.category,
        "item": `${SITE_CONFIG.url}/category/${post.categorySlug}`,
      },
      {
        "@type": "ListItem",
        "position": 4,
        "name": post.title,
        "item": postUrl,
      },
    ],
  });

  // 2. Main Article / TechArticle Schema
  const articleSchema: Record<string, any> = {
    "@type": articleType,
    "@id": `${postUrl}#article`,
    "isPartOf": {
      "@type": "WebSite",
      "@id": `${SITE_CONFIG.url}/#website`,
      "name": SITE_CONFIG.name,
      "url": SITE_CONFIG.url,
    },
    "headline": post.seo?.metaTitle || post.title,
    "description": post.seo?.metaDescription || post.excerpt,
    "image": {
      "@type": "ImageObject",
      "url": post.featuredImage,
      "caption": post.featuredImageAlt || `${post.title} - GenZ Time`,
      "description": post.featuredImageAlt || `${post.title} - GenZ Time`,
    },
    "datePublished": post.publishedAt,
    "dateModified": post.updatedAt || post.publishedAt,
    "inLanguage": "en-US",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": postUrl,
    },
    "wordCount": wordCount,
    "articleSection": post.category,
    "keywords": post.tags && post.tags.length > 0 ? post.tags.join(", ") : undefined,
    "author": {
      "@type": "Person",
      "name": post.author?.name || SITE_CONFIG.author,
      "jobTitle": post.author?.role || SITE_CONFIG.authorRole,
      "url": `${SITE_CONFIG.url}/about`,
      "image": post.author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
      "description": post.author?.bio || SITE_CONFIG.authorBio,
    },
    "publisher": {
      "@type": "NewsMediaOrganization",
      "name": SITE_CONFIG.name,
      "url": SITE_CONFIG.url,
      "logo": {
        "@type": "ImageObject",
        "url": `${SITE_CONFIG.url}/logo.png`,
        "width": 512,
        "height": 512,
      },
      "publishingPrinciples": `${SITE_CONFIG.url}/editorial-disclosure`,
    },
    "speakable": {
      "@type": "SpeakableSpecification",
      "cssSelector": ["h1", "article header p", ".verdict-summary"],
    },
  };

  // Add citations if sources are provided
  if (post.sources && post.sources.length > 0) {
    articleSchema.citation = post.sources.map((s) => s.url || s.title);
  }

  // Add abstract if subtitle or key takeaways exist
  if (post.keyTakeaways && post.keyTakeaways.length > 0) {
    articleSchema.abstract = post.keyTakeaways.join(". ");
  } else if (post.subtitle) {
    articleSchema.abstract = post.subtitle;
  }

  graph.push(articleSchema);

  // 3. Review & Benchmark Schemas
  if (post.isComparison && post.comparedProducts && post.comparedProducts.length > 0) {
    // --- CASE A: Multi-Product Benchmark Comparison Review ---
    post.comparedProducts.forEach((gadget, idx) => {
      const cleanPrice = gadget.price ? gadget.price.replace(/[^0-9.]/g, '') : '';
      const gadgetReview: Record<string, any> = {
        "@type": "Review",
        "@id": `${postUrl}#review-product-${idx + 1}`,
        "name": `${gadget.name} Lab Benchmark & Review`,
        "reviewBody": gadget.verdictSummary || post.verdictSummary || post.excerpt,
        "datePublished": post.publishedAt,
        "dateModified": post.updatedAt || post.publishedAt,
        "author": {
          "@type": "Person",
          "name": post.author?.name || SITE_CONFIG.author,
          "url": `${SITE_CONFIG.url}/about`,
        },
        "publisher": {
          "@type": "Organization",
          "name": SITE_CONFIG.name,
          "url": SITE_CONFIG.url,
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": gadget.verdictScore,
          "bestRating": 10,
          "worstRating": 1,
        },
        "itemReviewed": {
          "@type": "Product",
          "name": gadget.name,
          "image": {
            "@type": "ImageObject",
            "url": post.featuredImage,
            "caption": post.featuredImageAlt || `${gadget.name} - GenZ Time hardware review`,
          },
          "description": gadget.verdictSummary || `${gadget.name} tested and benchmarked by GenZ Time lab.`,
          "category": post.category,
          "additionalProperty": convertSpecsToProperties(gadget.specs, post.categorySlug),
          ...(cleanPrice ? {
            "offers": {
              "@type": "Offer",
              "price": cleanPrice,
              "priceCurrency": "USD",
              "availability": "https://schema.org/InStock",
              "url": postUrl,
            }
          } : {}),
        },
      };

      if (gadget.badge) {
        gadgetReview.award = gadget.badge;
      }

      if (gadget.pros && gadget.pros.length > 0) {
        gadgetReview.positiveNotes = {
          "@type": "ItemList",
          "itemListElement": gadget.pros.map((pro, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": pro,
          })),
        };
      }

      if (gadget.cons && gadget.cons.length > 0) {
        gadgetReview.negativeNotes = {
          "@type": "ItemList",
          "itemListElement": gadget.cons.map((con, i) => ({
            "@type": "ListItem",
            "position": i + 1,
            "name": con,
          })),
        };
      }

      graph.push(gadgetReview);
    });

    // Output comparison summary ranking ItemList
    graph.push({
      "@type": "ItemList",
      "@id": `${postUrl}#benchmark-ranking`,
      "name": `${post.title} — Compared Gadgets Benchmark Ranking`,
      "numberOfItems": post.comparedProducts.length,
      "itemListElement": post.comparedProducts.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "name": p.name,
        "description": `${p.badge ? `[${p.badge}] ` : ''}Lab Score: ${p.verdictScore}/10`,
        "url": `${postUrl}#product-${p.id || i + 1}`,
      })),
    });

  } else if (isReview && post.verdictScore) {
    // --- CASE B: Single Product Review & Lab Benchmark ---
    const prodName = cleanProductName(post.title);
    const cleanPrice = post.specs?.price ? post.specs.price.replace(/[^0-9.]/g, '') : '';

    const reviewSchema: Record<string, any> = {
      "@type": "Review",
      "@id": `${postUrl}#review`,
      "name": `${prodName} Lab Review & Benchmarks`,
      "reviewBody": post.verdictSummary || post.excerpt,
      "datePublished": post.publishedAt,
      "dateModified": post.updatedAt || post.publishedAt,
      "author": {
        "@type": "Person",
        "name": post.author?.name || SITE_CONFIG.author,
        "url": `${SITE_CONFIG.url}/about`,
      },
      "publisher": {
        "@type": "Organization",
        "name": SITE_CONFIG.name,
        "url": SITE_CONFIG.url,
      },
      "reviewRating": {
        "@type": "Rating",
        "ratingValue": post.verdictScore,
        "bestRating": 10,
        "worstRating": 1,
      },
      "itemReviewed": {
        "@type": "Product",
        "name": prodName,
        "image": {
          "@type": "ImageObject",
          "url": post.featuredImage,
          "caption": post.featuredImageAlt || `${prodName} - GenZ Time hardware review`,
        },
        "description": post.excerpt,
        "category": post.category,
        "additionalProperty": convertSpecsToProperties(post.specs, post.categorySlug),
        ...(cleanPrice ? {
          "offers": {
            "@type": "Offer",
            "price": cleanPrice,
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock",
            "url": postUrl,
          }
        } : {}),
      },
    };

    if (post.pros && post.pros.length > 0) {
      reviewSchema.positiveNotes = {
        "@type": "ItemList",
        "itemListElement": post.pros.map((pro, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": pro,
        })),
      };
    }

    if (post.cons && post.cons.length > 0) {
      reviewSchema.negativeNotes = {
        "@type": "ItemList",
        "itemListElement": post.cons.map((con, idx) => ({
          "@type": "ListItem",
          "position": idx + 1,
          "name": con,
        })),
      };
    }

    graph.push(reviewSchema);
  }

  // 4. FAQPage Schema (if FAQs are published in article/review)
  if (post.faqs && post.faqs.length > 0) {
    graph.push({
      "@type": "FAQPage",
      "@id": `${postUrl}#faq`,
      "mainEntity": post.faqs.map((faq) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer,
        },
      })),
    });
  }

  return {
    "@context": "https://schema.org",
    "@graph": graph,
  };
}

/**
 * Backwards-compatible generateArticleSchema returning full @graph structure
 */
export function generateArticleSchema(post: BlogPost): Record<string, any> {
  return generatePostGraphSchema(post);
}

/**
 * Direct Breadcrumb schema generator
 */
export function generateBreadcrumbSchema(items: { name: string; url: string }[]): Record<string, any> {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url,
    })),
  };
}

/**
 * CollectionPage and ItemList schema for archive and category pages
 */
export function generateCollectionSchema(params: {
  title: string;
  description: string;
  url: string;
  items: Array<{ name: string; url: string; image?: string; score?: number }>;
}): Record<string, any> {
  const { title, description, url, items } = params;
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${url}#collection`,
        "name": title,
        "description": description,
        "url": url,
        "publisher": {
          "@type": "Organization",
          "name": SITE_CONFIG.name,
          "url": SITE_CONFIG.url,
        },
      },
      {
        "@type": "ItemList",
        "@id": `${url}#itemlist`,
        "name": title,
        "numberOfItems": items.length,
        "itemListElement": items.map((item, index) => ({
          "@type": "ListItem",
          "position": index + 1,
          "name": item.name,
          "url": item.url,
          ...(item.image ? { "image": item.image } : {}),
          ...(item.score ? { "description": `Lab Score: ${item.score}/10` } : {}),
        })),
      },
    ],
  };
}


export function calculateSeoScore(params: {
  title: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  content: string;
  slug: string;
  featuredImage: string;
}): { score: number; checklist: { label: string; passed: boolean; tip: string }[] } {
  const { title, metaTitle, metaDescription, focusKeyword, content, slug, featuredImage } = params;
  const kw = focusKeyword.toLowerCase().trim();

  const checks = [
    {
      label: "Focus keyword in article title",
      passed: Boolean(kw && title.toLowerCase().includes(kw)),
      tip: `Include "${kw || "your keyword"}" in the main headline.`,
    },
    {
      label: "Focus keyword in SEO Meta Title",
      passed: Boolean(kw && metaTitle.toLowerCase().includes(kw)),
      tip: `Include "${kw || "your keyword"}" near the start of the meta title.`,
    },
    {
      label: "Focus keyword in SEO Meta Description",
      passed: Boolean(kw && metaDescription.toLowerCase().includes(kw)),
      tip: `Include "${kw || "your keyword"}" naturally in the meta description snippet.`,
    },
    {
      label: "Optimal Meta Title length (40-65 chars)",
      passed: metaTitle.length >= 40 && metaTitle.length <= 65,
      tip: `Currently ${metaTitle.length} chars. Aim for 40-65 characters to prevent Google truncation.`,
    },
    {
      label: "Optimal Meta Description length (120-160 chars)",
      passed: metaDescription.length >= 120 && metaDescription.length <= 165,
      tip: `Currently ${metaDescription.length} chars. Aim for 120-160 characters for complete search snippets.`,
    },
    {
      label: "Keyword in URL slug",
      passed: Boolean(kw && slug.toLowerCase().includes(kw.replace(/\s+/g, "-"))),
      tip: `Include the keyword in the permalink slug.`,
    },
    {
      label: "Substantial article depth (300+ words)",
      passed: (content || "").split(/\s+/).filter(Boolean).length >= 300,
      tip: `Current word count: ${(content || "").split(/\s+/).filter(Boolean).length}. Comprehensive gadget reviews rank higher.`,
    },
    {
      label: "Strict heading hierarchy (H1 -> H2 -> H3)",
      passed: Boolean(title && /##\s+[^\n]+/m.test(content) && !/^#\s+[^\n]+/m.test(content)),
      tip: /^#\s+[^\n]+/m.test(content)
        ? "Avoid single '#' (H1) in body text. Article title is already the page H1. Convert body headings to ## (H2) to prevent duplicate H1 penalties."
        : !/##\s+[^\n]+/m.test(content)
        ? "Include at least one ## (H2) section heading. Follow strict hierarchy: H1 (Title) -> H2 (Major Sections) -> H3 (Subsections)."
        : "Excellent structure! Follows strict Google-recommended H1 -> H2 -> H3 hierarchy.",
    },
    {
      label: "High-resolution featured image",
      passed: Boolean(featuredImage && featuredImage.startsWith("http")),
      tip: "Include a sharp hero image for Google Discover and social preview cards.",
    },
  ];

  const passedCount = checks.filter((c) => c.passed).length;
  const score = Math.round((passedCount / checks.length) * 100);

  return { score, checklist: checks };
}
