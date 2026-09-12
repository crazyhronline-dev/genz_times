import { Metadata } from 'next';
import { getActiveDeals } from '@/lib/deals-db';
import { 
  generateDealsCatalogSchema, 
  generateDealsFaqSchema, 
  generateDealsBreadcrumbSchema 
} from '@/lib/deals-seo';
import DealsClient from './DealsClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: 'Best Tech Deals, Verified Promo Codes & Hardware Coupons 2026',
  description: '100% verified promo codes, discount vouchers, and hardware coupons for smartphones, laptops, audio, gaming gear, and VPNs. Hand-tested daily by GenZ Time lab.',
  keywords: [
    'tech promo codes 2026',
    'verified hardware coupons',
    'smartphone discounts',
    'laptop promo codes',
    'best tech deals',
    'NordVPN promo code',
    'Samsung discount code',
    'Apple macbook coupon',
    'gadget deals 2026',
    'GenZ Time coupons',
  ],
  alternates: {
    canonical: 'https://genztime.com/deals',
  },
  openGraph: {
    title: 'Best Tech Deals, Verified Promo Codes & Hardware Coupons 2026 | GenZ Time',
    description: '100% verified promo codes and hardware coupons tested daily by GenZ Time lab. Unmask exclusive discount codes and save on top brands.',
    url: 'https://genztime.com/deals',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Best Tech Deals & Verified Promo Codes 2026 | GenZ Time',
    description: 'Hand-tested promo codes and hardware discounts tested daily by GenZ Time lab.',
  }
};

export default async function DealsPage() {
  const deals = await getActiveDeals();
  const catalogSchema = generateDealsCatalogSchema(deals);
  const faqSchema = generateDealsFaqSchema();
  const breadcrumbSchema = generateDealsBreadcrumbSchema();

  return (
    <>
      {/* Schema.org Structured Data for Google Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(catalogSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <DealsClient initialDeals={deals} />
    </>
  );
}
