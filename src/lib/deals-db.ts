import fs from 'fs/promises';
import path from 'path';
import { PromoDeal } from '@/types/deal';
import { generateAutoDealSeo } from './deals-seo';

const DEALS_FILE = path.join(process.cwd(), 'data', 'deals.json');

export const DEFAULT_DEALS: PromoDeal[] = [
  {
    id: 'deal-hostinger-45',
    title: 'Hostinger Web & Cloud Hosting 45% OFF Exclusive Promo Code',
    store: 'Hostinger',
    description: 'Claim 45% instant discount on Hostinger Premium, Business, and Cloud web hosting plans with free domain, SSL, unlimited bandwidth, and NVMe LiteSpeed servers. Tested & verified working promo code.',
    imageUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
    category: 'vpn',
    discountText: '45% OFF',
    promoCode: 'SAHCRAZYHOWP',
    referralUrl: 'https://www.hostinger.com/in?REFERRALCODE=SAHCRAZYHOWP',
    hideCode: true,
    isFeatured: true,
    isActive: true,
    expiresAt: '2026-12-31',
    tags: ['hostinger-promo', 'hostinger-coupon', 'web-hosting-deals', 'cloud-hosting', '45off', 'sahcrazyhowp', 'verified-coupon', 'tech-deals-2026'],
    seoKeywords: [
      'hostinger promo code 2026',
      'hostinger coupon code 45 off',
      'hostinger discount code SAHCRAZYHOWP',
      'hostinger referral code 2026',
      'hostinger web hosting promo code',
      'best web hosting discount code',
      'hostinger cloud hosting coupon',
      'verified hostinger voucher code',
      'hostinger checkout discount',
      'hostinger india promo code',
    ],
    metaTitle: 'Hostinger Promo Code (45% OFF) 2026 — Verified Coupon | GenZ Time',
    metaDescription: 'Get 45% OFF Hostinger web hosting & cloud plans with verified promo code SAHCRAZYHOWP. Free domain, SSL & LiteSpeed server. Tested daily by GenZ Time lab.',
    terms: 'Valid on annual and multi-year hosting packages. Includes free domain registration, SSL certificate, and 24/7 technical support.',
    verifiedAt: '2026-09-13T00:00:00.000Z',
    createdAt: '2026-09-13T00:00:00.000Z',
    clicks: 184,
    copiedCount: 138,
  },
  {
    id: 'deal-1',
    title: 'Samsung Galaxy S25 Ultra $150 Instant Trade-In Credit',
    store: 'Samsung',
    description: 'Get an exclusive $150 instant checkout discount on unlocked Galaxy S25 Ultra with 512GB free storage upgrade.',
    imageUrl: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80',
    category: 'smartphones',
    discountText: '$150 OFF',
    promoCode: 'GZS25ULTRA',
    referralUrl: 'https://www.samsung.com',
    hideCode: true,
    isFeatured: true,
    isActive: true,
    expiresAt: '2026-10-31',
    tags: ['samsung-promo', 'galaxy-s25-ultra', 'smartphones-deals', 'verified-coupon', 'trade-in-discount'],
    seoKeywords: [
      'samsung promo code 2026',
      'galaxy s25 ultra discount',
      'samsung coupon code',
      'samsung trade in voucher',
      'best smartphone deals 2026',
      'samsung checkout discount'
    ],
    metaTitle: 'Samsung Galaxy S25 Ultra Promo Code ($150 OFF) 2026 | GenZ Time',
    metaDescription: 'Verified $150 OFF promo code for Samsung Galaxy S25 Ultra at Samsung Store. Tested daily by GenZ Time lab. Instant checkout savings.',
    verifiedAt: '2026-09-12T19:00:00.000Z',
    createdAt: '2026-09-12T19:00:00.000Z',
    clicks: 142,
    copiedCount: 89,
  },
  {
    id: 'deal-2',
    title: 'NordVPN 2-Year Plan + 3 Extra Months Free',
    store: 'NordVPN',
    description: 'Protect your digital privacy and unlock geo-restricted tech benchmarks with 72% off NordVPN Complete + 1TB encrypted cloud storage.',
    imageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    category: 'vpn',
    discountText: '72% OFF',
    promoCode: 'GENZTIME72',
    referralUrl: 'https://nordvpn.com',
    hideCode: true,
    isFeatured: true,
    isActive: true,
    expiresAt: '2026-11-15',
    tags: ['nordvpn-promo', 'vpn-deals', '72off', 'verified-coupon', 'cloud-security'],
    seoKeywords: [
      'nordvpn promo code 2026',
      'nordvpn coupon code',
      'nordvpn 72 off discount',
      'best vpn deals 2026',
      'nordvpn free extra months'
    ],
    metaTitle: 'NordVPN Promo Code (72% OFF + 3 Months Free) 2026 | GenZ Time',
    metaDescription: 'Exclusive 72% OFF NordVPN coupon code plus 3 free months. Verified working voucher code for secure tech browsing tested by GenZ Time.',
    verifiedAt: '2026-09-12T19:00:00.000Z',
    createdAt: '2026-09-12T19:00:00.000Z',
    clicks: 310,
    copiedCount: 220,
  },
  {
    id: 'deal-3',
    title: 'Apple MacBook Pro M4 Pro $200 Creator Rebate',
    store: 'Apple / B&H',
    description: 'Save $200 on M4 Pro MacBook Pro 14" and 16" models with Liquid Retina XDR nano-texture display.',
    imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    category: 'laptops',
    discountText: '$200 OFF',
    promoCode: 'M4CREATOR200',
    referralUrl: 'https://apple.com',
    hideCode: true,
    isFeatured: false,
    isActive: true,
    expiresAt: '2026-10-15',
    tags: ['apple-promo', 'macbook-pro-m4', 'laptops-deals', 'verified-coupon', '200off'],
    seoKeywords: [
      'macbook pro m4 discount code',
      'apple promo code 2026',
      'apple macbook coupon',
      'bh photo apple discount',
      'best laptop deals 2026'
    ],
    metaTitle: 'MacBook Pro M4 Pro $200 OFF Promo Code 2026 | GenZ Time',
    metaDescription: 'Save $200 instantly on M4 Pro MacBook Pro models. Verified working Apple promo code tested by GenZ Time lab.',
    verifiedAt: '2026-09-12T19:00:00.000Z',
    createdAt: '2026-09-12T19:00:00.000Z',
    clicks: 98,
    copiedCount: 65,
  },
  {
    id: 'deal-4',
    title: 'Sony WH-1000XM5 Wireless Noise-Canceling Headphones',
    store: 'Amazon',
    description: 'Industry-leading noise cancelation with two processors and 8 microphones. Instant checkout coupon applied.',
    imageUrl: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=800&q=80',
    category: 'audio',
    discountText: '25% OFF',
    promoCode: 'SONYANC25',
    referralUrl: 'https://amazon.com',
    hideCode: false,
    isFeatured: true,
    isActive: true,
    expiresAt: '2026-09-30',
    tags: ['sony-promo', 'amazon-coupon', 'audio-deals', 'wh1000xm5', 'verified-coupon'],
    seoKeywords: [
      'sony wh1000xm5 coupon code',
      'sony headphones promo code 2026',
      'amazon electronics discount',
      'best anc headphones deals'
    ],
    metaTitle: 'Sony WH-1000XM5 Coupon Code (25% OFF) 2026 | GenZ Time',
    metaDescription: 'Get 25% OFF Sony WH-1000XM5 wireless noise-canceling headphones. Verified discount code for Amazon checkout tested by GenZ Time.',
    verifiedAt: '2026-09-12T19:00:00.000Z',
    createdAt: '2026-09-12T19:00:00.000Z',
    clicks: 185,
    copiedCount: 112,
  },
  {
    id: 'deal-5',
    title: 'ASUS ROG Ally X Handheld Gaming Console Flash Deal',
    store: 'ASUS ROG',
    description: 'AMD Ryzen Z1 Extreme, 24GB LPDDR5X RAM, and 80Wh battery with $80 discount voucher.',
    imageUrl: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    category: 'gaming',
    discountText: '$80 OFF',
    promoCode: 'ROGALLY80',
    referralUrl: 'https://rog.asus.com',
    hideCode: true,
    isFeatured: false,
    isActive: true,
    expiresAt: '2026-10-20',
    tags: ['asus-promo', 'rog-ally-x', 'gaming-deals', 'handheld-discount', 'verified-coupon'],
    seoKeywords: [
      'rog ally x discount code',
      'asus promo code 2026',
      'rog gaming console voucher',
      'asus coupon code 2026'
    ],
    metaTitle: 'ASUS ROG Ally X Promo Code ($80 OFF) 2026 | GenZ Time',
    metaDescription: 'Save $80 on ASUS ROG Ally X gaming handheld console. Tested working promo code and instant checkout voucher from GenZ Time.',
    verifiedAt: '2026-09-12T19:00:00.000Z',
    createdAt: '2026-09-12T19:00:00.000Z',
    clicks: 74,
    copiedCount: 48,
  },
];

export async function getAllDeals(): Promise<PromoDeal[]> {
  try {
    const data = await fs.readFile(DEALS_FILE, 'utf-8');
    let deals: PromoDeal[] = JSON.parse(data);
    if (!deals || !Array.isArray(deals) || deals.length === 0) {
      deals = DEFAULT_DEALS;
    }

    // Ensure all deals have rich SEO keywords, tags, and meta information
    let needsRewrite = false;
    const enrichedDeals = deals.map((deal) => {
      if (!deal.tags || deal.tags.length === 0 || !deal.seoKeywords || deal.seoKeywords.length === 0) {
        needsRewrite = true;
        const autoSeo = generateAutoDealSeo(deal);
        return {
          ...deal,
          tags: deal.tags && deal.tags.length > 0 ? deal.tags : autoSeo.tags,
          seoKeywords: deal.seoKeywords && deal.seoKeywords.length > 0 ? deal.seoKeywords : autoSeo.seoKeywords,
          metaTitle: deal.metaTitle || autoSeo.metaTitle,
          metaDescription: deal.metaDescription || autoSeo.metaDescription,
          verifiedAt: deal.verifiedAt || deal.createdAt || new Date().toISOString(),
        };
      }
      return deal;
    });

    if (needsRewrite) {
      await fs.writeFile(DEALS_FILE, JSON.stringify(enrichedDeals, null, 2), 'utf-8');
    }

    return enrichedDeals;
  } catch (error) {
    // If file doesn't exist, seed it
    await fs.mkdir(path.dirname(DEALS_FILE), { recursive: true });
    await fs.writeFile(DEALS_FILE, JSON.stringify(DEFAULT_DEALS, null, 2), 'utf-8');
    return DEFAULT_DEALS;
  }
}

export async function getActiveDeals(): Promise<PromoDeal[]> {
  const deals = await getAllDeals();
  return deals.filter((d) => d.isActive);
}

export async function getDealById(id: string): Promise<PromoDeal | null> {
  const deals = await getAllDeals();
  return deals.find((d) => d.id === id) || null;
}

export async function saveDeal(dealData: Partial<PromoDeal> & { title: string; store: string; discountText: string }): Promise<PromoDeal> {
  const deals = await getAllDeals();
  const id = dealData.id || `deal-${Date.now()}`;
  const now = new Date().toISOString();

  // Automatic SEO keywords and tags generation
  const autoSeo = generateAutoDealSeo({
    title: dealData.title,
    store: dealData.store,
    discountText: dealData.discountText,
    category: dealData.category || 'smartphones',
    description: dealData.description,
    promoCode: dealData.promoCode,
  });

  const finalTags = (Array.isArray(dealData.tags) && dealData.tags.length > 0)
    ? Array.from(new Set([...dealData.tags.map(t => t.trim().toLowerCase().replace(/^#/, '')), ...autoSeo.tags]))
    : autoSeo.tags;

  const finalKeywords = (Array.isArray(dealData.seoKeywords) && dealData.seoKeywords.length > 0)
    ? Array.from(new Set([...dealData.seoKeywords.map(k => k.trim().toLowerCase()), ...autoSeo.seoKeywords]))
    : autoSeo.seoKeywords;

  const finalMetaTitle = dealData.metaTitle?.trim() || autoSeo.metaTitle;
  const finalMetaDescription = dealData.metaDescription?.trim() || autoSeo.metaDescription;

  const newDeal: PromoDeal = {
    id,
    title: dealData.title.trim(),
    store: dealData.store.trim(),
    description: dealData.description?.trim() || '',
    imageUrl: dealData.imageUrl?.trim() || 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    category: dealData.category || 'smartphones',
    discountText: dealData.discountText.trim(),
    promoCode: dealData.promoCode?.trim() || undefined,
    referralUrl: dealData.referralUrl?.trim() || undefined,
    hideCode: Boolean(dealData.hideCode),
    isFeatured: Boolean(dealData.isFeatured),
    isActive: dealData.isActive !== undefined ? Boolean(dealData.isActive) : true,
    expiresAt: dealData.expiresAt?.trim() || undefined,
    tags: finalTags,
    seoKeywords: finalKeywords,
    metaTitle: finalMetaTitle,
    metaDescription: finalMetaDescription,
    verifiedAt: dealData.verifiedAt || now,
    terms: dealData.terms?.trim() || undefined,
    createdAt: dealData.createdAt || now,
    updatedAt: now,
    clicks: dealData.clicks || 0,
    copiedCount: dealData.copiedCount || 0,
  };

  const existingIndex = deals.findIndex((d) => d.id === id);
  if (existingIndex >= 0) {
    deals[existingIndex] = { ...deals[existingIndex], ...newDeal, id };
  } else {
    deals.unshift(newDeal);
  }

  await fs.mkdir(path.dirname(DEALS_FILE), { recursive: true });
  await fs.writeFile(DEALS_FILE, JSON.stringify(deals, null, 2), 'utf-8');
  return newDeal;
}

export async function deleteDeal(id: string): Promise<boolean> {
  const deals = await getAllDeals();
  const filtered = deals.filter((d) => d.id !== id);
  if (filtered.length === deals.length) return false;
  await fs.writeFile(DEALS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}

export async function recordDealInteraction(id: string, type: 'click' | 'copy'): Promise<boolean> {
  const deals = await getAllDeals();
  const deal = deals.find((d) => d.id === id);
  if (!deal) return false;

  if (type === 'click') {
    deal.clicks = (deal.clicks || 0) + 1;
  } else if (type === 'copy') {
    deal.copiedCount = (deal.copiedCount || 0) + 1;
  }

  await fs.writeFile(DEALS_FILE, JSON.stringify(deals, null, 2), 'utf-8');
  return true;
}
