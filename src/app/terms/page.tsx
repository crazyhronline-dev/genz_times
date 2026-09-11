import React from 'react';
import { Metadata } from 'next';
import { FileText, CheckCircle } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'Terms of Use — What You Can & Can\'t Do With GenZ Time Content',
  description: 'Our terms are written in plain English, not legal jargon. Understand your rights when reading our reviews, sharing our benchmark data, or embedding our content. Short version: credit us, don\'t steal our work.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/terms`,
  },
  openGraph: {
    title: 'Terms of Use — What You Can & Can\'t Do With GenZ Time Content',
    description: 'Our terms are written in plain English, not legal jargon. Understand your rights when reading, sharing, or embedding GenZ Time content.',
  },
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
          <FileText className="w-3.5 h-3.5" />
          <span>Legal Agreement</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          Terms of Service
        </h1>
        <p className="text-xs font-mono text-slate-400">
          Effective Date: August 1, 2026 • Last Reviewed: September 2026
        </p>
      </div>

      <div className="space-y-6 text-slate-300 text-sm sm:text-base leading-relaxed border-t border-slate-800 pt-6">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Content & Benchmark Copyright</h2>
          <p>
            All written reviews, photographs, thermal diagrams, and benchmark charts created by GenZ Time are the intellectual property of GenZ Time. External publications and tech creators may quote short excerpts or benchmark graphs provided proper canonical attribution and a direct hyperlink to the original article is included.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Product Purchase Disclaimers</h2>
          <p>
            While our hardware testing lab strives for supreme accuracy across all measurements, manufacturer silicon revisions, firmware updates, and ambient operating conditions can introduce variations. We advise readers to consider multiple perspectives before making high-value electronics purchases.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. User Submissions & Community Conduct</h2>
          <p>
            Comments, tech questions, and feedback submitted on GenZ Time must remain civil, respectful, and free of malicious links or automated spam.
          </p>
        </section>
      </div>
    </div>
  );
}
