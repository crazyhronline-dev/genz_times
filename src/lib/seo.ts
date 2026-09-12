import { BlogPost } from "@/types/blog";

export const SITE_CONFIG = {
  name: "GenZ Time",
  title: "GenZ Time | Real Gadget Reviews, Lab Benchmarks & Next-Gen Tech",
  description: "We test every device with our own hands before publishing. GenZ Time delivers honest smartphone reviews, laptop benchmarks, AI gadget deep-dives, and next-gen hardware tests built for Gen Z creators and tech enthusiasts who want real data.",
  url: "https://genztime.com",
  ogImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80",
  twitterHandle: "@GenZTimeTech",
  author: "GenZ Editorial Team",
};

export function generateArticleSchema(post: BlogPost) {
  return {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: post.seo?.metaTitle || post.title,
    description: post.seo?.metaDescription || post.excerpt,
    image: [post.featuredImage],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      "@type": "Person",
      name: post.author.name,
      jobTitle: post.author.role,
      url: `${SITE_CONFIG.url}/about`,
    },
    publisher: {
      "@type": "Organization",
      name: SITE_CONFIG.name,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_CONFIG.url}/logo.png`,
      },
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_CONFIG.url}/blog/${post.slug}`,
    },
    keywords: post.tags.join(", "),
    review: {
      "@type": "Review",
      reviewRating: {
        "@type": "Rating",
        ratingValue: post.verdictScore,
        bestRating: 10,
        worstRating: 1,
      },
      author: {
        "@type": "Person",
        name: post.author.name,
      },
      positiveNotes: {
        "@type": "ItemList",
        itemListElement: post.pros.map((pro, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: pro,
        })),
      },
      negativeNotes: {
        "@type": "ItemList",
        itemListElement: post.cons.map((con, index) => ({
          "@type": "ListItem",
          position: index + 1,
          name: con,
        })),
      },
    },
  };
}

export function generateBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
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
      label: "Clear section headings (H2/H3 tags)",
      passed: /##\s+|###\s+/.test(content),
      tip: "Use ## and ### headings to organize specs, battery, and camera tests.",
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
