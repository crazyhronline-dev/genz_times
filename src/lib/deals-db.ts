import fs from 'fs/promises';
import path from 'path';
import { PromoDeal } from '@/types/deal';

const DEALS_FILE = path.join(process.cwd(), 'data', 'deals.json');

export const DEFAULT_DEALS: PromoDeal[] = [
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
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
    createdAt: new Date().toISOString(),
    clicks: 74,
    copiedCount: 48,
  },
];

export async function getAllDeals(): Promise<PromoDeal[]> {
  try {
    const data = await fs.readFile(DEALS_FILE, 'utf-8');
    const deals: PromoDeal[] = JSON.parse(data);
    return deals && deals.length > 0 ? deals : DEFAULT_DEALS;
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
