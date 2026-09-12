import { PromoDeal } from '@/types/deal';
import { SITE_CONFIG } from './seo';

/**
 * Automatically generates high-ranking SEO search keywords, ranking tags,
 * and optimized Google meta title/description from deal data.
 */
export function generateAutoDealSeo(deal: {
  title: string;
  store: string;
  discountText: string;
  category: string;
  description?: string;
  promoCode?: string;
}): {
  tags: string[];
  seoKeywords: string[];
  metaTitle: string;
  metaDescription: string;
} {
  const storeClean = (deal.store || 'Store').trim();
  const discountClean = (deal.discountText || 'Discount').trim();
  const titleClean = (deal.title || 'Tech Deal').trim();
  const catClean = (deal.category || 'tech').toLowerCase().trim();
  const codeClean = (deal.promoCode || '').trim();

  // High-ranking search intent keywords targeting top Google rankings
  const keywordsSet = new Set<string>();

  // 1. Primary Store Promo Keywords (highest search volume)
  keywordsSet.add(`${storeClean} promo code 2026`);
  keywordsSet.add(`${storeClean} coupon code`);
  keywordsSet.add(`${storeClean} discount code`);
  keywordsSet.add(`${storeClean} voucher code`);
  keywordsSet.add(`${storeClean} promo`);
  keywordsSet.add(`${storeClean} ${discountClean}`);

  // 2. Specific Product / Title Keywords
  // Extract key 2-3 word product title chunk
  const titleWords = titleClean.split(/\s+/).slice(0, 5).join(' ');
  keywordsSet.add(`${titleWords} coupon`);
  keywordsSet.add(`${titleWords} promo code`);
  keywordsSet.add(`${titleWords} discount`);

  // 3. Category & Tech Deals Intent Keywords
  keywordsSet.add(`best ${catClean} deals 2026`);
  keywordsSet.add(`verified ${catClean} coupons`);
  keywordsSet.add(`tech gadgets promo codes`);
  keywordsSet.add(`instant checkout discount`);

  // 4. Specific Promo Code Searches
  if (codeClean) {
    keywordsSet.add(`${codeClean} promo code`);
    keywordsSet.add(`${codeClean} coupon`);
    keywordsSet.add(`${storeClean} code ${codeClean}`);
  }

  // Tags generation (for UI badges, search indexing & SEO URL tag grouping)
  const tagsSet = new Set<string>();
  const storeTag = storeClean.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (storeTag) tagsSet.add(`${storeTag}-promo`);
  tagsSet.add(`${catClean}-deals`);
  
  const discountTag = discountClean.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (discountTag) tagsSet.add(discountTag);

  tagsSet.add('verified-coupon');
  if (codeClean) tagsSet.add('promo-code');
  tagsSet.add('tech-deals-2026');

  // Google Meta Title (Target <= 60 characters for SERP display)
  let metaTitle = `${titleClean} (${discountClean}) Promo Code | GenZ Time`;
  if (metaTitle.length > 68) {
    metaTitle = `${storeClean} ${discountClean} Promo Code 2026 | GenZ Time`;
  }

  // Google Meta Description (Target 140 - 160 characters for high CTR snippet)
  const metaDescription = `Verified ${discountClean} at ${storeClean}. Use active promo code for ${titleClean}. Tested daily by GenZ Time lab. 100% working discount code.`;

  return {
    tags: Array.from(tagsSet),
    seoKeywords: Array.from(keywordsSet),
    metaTitle,
    metaDescription,
  };
}

/**
 * Generate Schema.org ItemList with individual Offer schemas for all active deals.
 * Provides Google Rich Snippets with pricing, discount, retailer, and validity.
 */
export function generateDealsCatalogSchema(deals: PromoDeal[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Verified Promo Codes, Discount Vouchers & Hardware Deals 2026",
    "description": "Curated collection of 100% tested promo codes, hardware coupons, and manufacturer trade-in discounts verified daily by GenZ Time lab.",
    "url": `${SITE_CONFIG.url}/deals`,
    "numberOfItems": deals.length,
    "itemListElement": deals.map((deal, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "Offer",
        "@id": `${SITE_CONFIG.url}/deals#${deal.id}`,
        "name": deal.metaTitle || deal.title,
        "description": deal.metaDescription || deal.description,
        "category": deal.category,
        "priceCurrency": "USD",
        "price": deal.discountText,
        "priceValidUntil": deal.expiresAt || "2026-12-31",
        "availability": "https://schema.org/InStock",
        "url": deal.referralUrl || `${SITE_CONFIG.url}/deals#${deal.id}`,
        "seller": {
          "@type": "Organization",
          "name": deal.store,
          "url": deal.referralUrl || `${SITE_CONFIG.url}/deals`,
        },
        "itemOffered": {
          "@type": "Product",
          "name": deal.title,
          "image": deal.imageUrl,
          "category": deal.category,
          "description": deal.description,
        },
        "eligibleTransactionVolume": {
          "@type": "PriceSpecification",
          "description": `Discount: ${deal.discountText}${deal.promoCode ? ` (Code: ${deal.promoCode})` : ''}`,
        },
        "keywords": (deal.seoKeywords || []).join(', '),
      },
    })),
  };
}

/**
 * Generate Schema.org FAQPage for /deals to trigger Google Rich FAQ Snippets on SERP.
 */
export function generateDealsFaqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "How do I use and redeem promo codes on GenZ Time?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Click 'Get This Promo Code' on any verified deal card. The full promo code will automatically reveal and copy to your clipboard. If a retailer referral link is available, the store checkout will open in a new tab where you can paste the code to claim your discount."
        }
      },
      {
        "@type": "Question",
        "name": "Are the discount coupons and promo codes on GenZ Time tested and verified?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes. Every promo code, coupon, and hardware discount published on GenZ Time is manually tested at checkout by our lab team before going live. We remove expired codes and update discounts daily."
        }
      },
      {
        "@type": "Question",
        "name": "Why are some promo codes 50% hidden before clicking?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Concealing part of exclusive voucher codes ensures that our partner retailers provide exclusive rates and prevents automated scraping bots from abusing limited-redemption discounts."
        }
      },
      {
        "@type": "Question",
        "name": "Do these tech promo codes and referral discounts cost readers anything extra?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No. All promo codes provide direct discounts to you. When you use our verified referral links, we may earn an affiliate commission from the retailer at zero extra cost to you, which directly funds our independent hardware testing equipment."
        }
      }
    ]
  };
}

/**
 * Generate BreadcrumbList schema for /deals.
 */
export function generateDealsBreadcrumbSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
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
        "name": "Deals & Promo Codes",
        "item": `${SITE_CONFIG.url}/deals`,
      }
    ]
  };
}
