import React from 'react';
import { Metadata } from 'next';
import { ShieldCheck, CheckCircle2, AlertTriangle, FileText, Lock } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'How We Review Gadgets — Our Testing Standards & Editorial Independence',
  description: 'Transparency is everything. Read exactly how GenZ Time tests devices, who funds our work, how we handle review units, and why no tech brand has ever changed one of our scores. Our editorial integrity is non-negotiable.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/editorial-disclosure`,
  },
  openGraph: {
    title: 'How We Review Gadgets — Our Testing Standards & Editorial Independence',
    description: 'Transparency is everything. Read exactly how GenZ Time tests devices and why no tech brand has ever changed one of our scores.',
  },
};

export default function EditorialDisclosurePage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Ethics & Integrity</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
          Editorial Disclosure & Review Ethics
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          At GenZ Time, our readers&apos; trust is our highest priority. We believe in absolute transparency regarding how we test hardware, source review samples, and fund our operations.
        </p>
      </div>

      <div className="space-y-8 text-slate-300 leading-relaxed text-sm sm:text-base border-t border-slate-800 pt-8">
        
        {/* 1. Independent Verdict Guarantee */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-tech-cyan" />
            <span>1. Complete Editorial Independence</span>
          </h2>
          <p>
            No manufacturer, PR agency, advertiser, or corporate entity exerts any editorial control over our content, scores, benchmark interpretations, or product recommendations. Our verdicts are determined exclusively by the results of our standardized testing protocols.
          </p>
        </section>

        {/* 2. Review Units & Samples */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-tech-emerald" />
            <span>2. Hardware Sourcing & Review Samples</span>
          </h2>
          <p>
            Hardware manufacturers periodically loan us production units for evaluation under temporary embargoes. Unless explicitly stated otherwise:
          </p>
          <ul className="list-disc pl-6 space-y-1.5 text-slate-400">
            <li>Loaned units are returned to the manufacturer upon completion of testing.</li>
            <li>We do not accept gifts, financial compensation, or pre-approved review drafts in exchange for coverage.</li>
            <li>When review units are unavailable prior to launch, GenZ Time purchases retail units with our own editorial funds.</li>
          </ul>
        </section>

        {/* 3. Affiliate Links & Monetization */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-tech-violet" />
            <span>3. Affiliate Links & Financial Transparency</span>
          </h2>
          <p>
            Some articles may contain affiliate links (e.g. Amazon, Best Buy, or official brand storefronts). If you make a purchase through these links, GenZ Time may earn a modest commission at zero additional cost to you.
          </p>
          <p className="text-xs text-slate-400 font-mono bg-tech-900/60 p-4 rounded-xl border border-slate-800">
            Crucially: Our testing staff has zero knowledge of which products have active affiliate agreements. A product with no affiliate program will be recommended over a higher-commission product if it performs better in our benchmark testing.
          </p>
        </section>

        {/* 4. Corrections Policy */}
        <section className="space-y-3">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-amber-400" />
            <span>4. Corrections & Benchmark Re-testing</span>
          </h2>
          <p>
            If a firmware update substantially alters a device&apos;s battery life, camera algorithms, or thermal performance, we conduct re-testing and transparently update the original review article with timestamped revision notes.
          </p>
        </section>

      </div>

    </div>
  );
}
