export interface PromoDeal {
  id: string;
  title: string;
  store: string; // e.g. "Samsung", "NordVPN", "Amazon", "Apple", "Sony"
  description: string;
  imageUrl: string;
  category: string; // e.g. "smartphones", "laptops", "audio", "gaming", "vpn", "accessories"
  discountText: string; // e.g. "50% OFF", "$150 OFF", "Flat ₹10,000 OFF", "FREE TRIAL"
  promoCode?: string; // Optional promo code (e.g. "GENZ50")
  referralUrl?: string; // Optional referral/affiliate URL
  hideCode: boolean; // If true, hides 50% of the code until user clicks "Get This Promo Code"
  isFeatured?: boolean;
  isActive: boolean;
  expiresAt?: string; // e.g. "2026-10-31" or "Limited Time"
  createdAt: string;
  updatedAt?: string;
  clicks?: number; // Total referral link clicks
  copiedCount?: number; // Total times code was copied
}
