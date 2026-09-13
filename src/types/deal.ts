export interface PromoDeal {
  id: string;
  title: string;
  store: string; // e.g. "Samsung", "NordVPN", "Amazon", "Apple", "Sony"
  description: string;
  imageUrl: string;
  imageAlt?: string;
  category: string; // e.g. "smartphones", "laptops", "audio", "gaming", "vpn", "accessories"
  discountText: string; // e.g. "50% OFF", "$150 OFF", "Flat ₹10,000 OFF", "FREE TRIAL"
  promoCode?: string; // Optional promo code (e.g. "GENZ50")
  referralUrl?: string; // Optional referral/affiliate URL
  hideCode: boolean; // If true, hides 50% of the code until user clicks "Get This Promo Code"
  isFeatured?: boolean;
  isActive: boolean;
  expiresAt?: string; // e.g. "2026-10-31" or "Limited Time"
  tags?: string[]; // e.g. ["samsung-promo", "galaxy-s25", "verified-coupon"]
  seoKeywords?: string[]; // Target search engine ranking keywords e.g. ["samsung promo code 2026", "galaxy s25 coupon"]
  metaTitle?: string; // Custom Google SERP title
  metaDescription?: string; // Custom Google snippet
  verifiedAt?: string; // Date tested by GenZ Time lab
  terms?: string; // Short terms and conditions / eligibility
  createdAt: string;
  updatedAt?: string;
  clicks?: number; // Total referral link clicks
  copiedCount?: number; // Total times code was copied
}
