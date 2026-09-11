import React from 'react';
import { Metadata } from 'next';
import { Shield, Lock } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Privacy Policy — How GenZ Time Handles Your Data',
  description: 'We keep it simple: GenZ Time does not sell your data, ever. Read our straightforward privacy policy to understand what we collect, why we collect it, and how you stay in full control.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/privacy`,
  },
  openGraph: {
    title: 'Privacy Policy — How GenZ Time Handles Your Data',
    description: 'We keep it simple: GenZ Time does not sell your data, ever. Read our straightforward privacy policy.',
  },
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
          <Lock className="w-3.5 h-3.5" />
          <span>User Privacy</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Privacy Policy
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Effective Date: August 1, 2026 • Last Reviewed: September 2026
        </p>
      </div>

      <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800 pt-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            When you browse GenZ Time, subscribe to our newsletter dispatch, or contact our testing laboratory, we may collect minimal technical identifiers such as your browser type, device operating system, and IP address for security and caching optimization.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Cookies & Analytics</h2>
          <p>
            We use privacy-friendly analytics to track aggregate pageviews, reading times, and gadget category popularity. We do not sell your personal browsing telemetry or cross-site tracking profiles to third-party data brokers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Newsletter Dispatches</h2>
          <p>
            If you subscribe to the GenZ Time Newsletter, your email address is used solely to deliver tech gadget analyses and hardware reviews. Every email includes a one-click unsubscribe link.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Contact Data Security</h2>
          <p>
            Inquiries sent through our review unit submission forms are held confidential and used exclusively for communications regarding hardware testing schedules and embargoes.
          </p>
        </section>
      </div>
    </div>
  );
}
