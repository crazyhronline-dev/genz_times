import { Metadata } from 'next';
import { getActiveDeals } from '@/lib/deals-db';
import DealsClient from './DealsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Best Tech Deals, Promo Codes & Hardware Coupons 2026',
  description: 'Hand-tested promo codes, discount vouchers, and hardware coupons for smartphones, laptops, audio, gaming gear, and software. Unmask verified discount codes and save.',
  alternates: {
    canonical: 'https://genztime.com/deals',
  },
  openGraph: {
    title: 'Best Tech Deals, Promo Codes & Hardware Coupons 2026 | GenZ Time',
    description: 'Hand-tested promo codes, discount vouchers, and hardware coupons. Save on top smartphones, laptops, headphones, and software with instant revealed vouchers.',
    url: 'https://genztime.com/deals',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Tech Deals & Verified Promo Codes | GenZ Time',
    description: 'Hand-tested promo codes and hardware discounts tested by GenZ Time lab.',
  }
};

export default async function DealsPage() {
  const deals = await getActiveDeals();

  return <DealsClient initialDeals={deals} />;
}
