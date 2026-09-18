import React from 'react';
import { Metadata } from 'next';
import { getAllPosts } from '@/lib/posts-db';
import { generateCollectionSchema, SITE_CONFIG } from '@/lib/seo';
import BlogListClient from './BlogListClient';
import { Cpu, Shield } from 'lucide-react';

export const metadata: Metadata = {
  title: {
    absolute: "Gen Z Tech Reviews & Hardware Benchmark Archive | GenZ Time",
  },
  description: "Browse comprehensive Gen Z gadget reviews, lab-tested smartphone benchmarks, laptop comparisons, and AI hardware deep-dives tested hands-on by Sahil at GenZ Time.",
  keywords: [
    "GenZ tech reviews",
    "Gen Z gadget benchmarks",
    "smartphone reviews 2026",
    "best tech for Gen Z",
    "laptop benchmark archive",
    "honest tech reviews",
    "Sahil gadget reviews"
  ],
  openGraph: {
    title: "Gen Z Tech Reviews & Hardware Benchmark Archive | GenZ Time",
    description: "Browse comprehensive Gen Z gadget reviews, lab-tested smartphone benchmarks, laptop comparisons, and AI hardware deep-dives tested hands-on by Sahil at GenZ Time.",
  },
  alternates: {
    canonical: 'https://genztime.com/blog',
  },
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function BlogPage() {
  const posts = await getAllPosts();
  const collectionSchema = generateCollectionSchema({
    title: "Tech Gadget Reviews & Benchmark Field Tests Archive",
    description: "Comprehensive, unbiased analysis of today's most influential consumer hardware tested by GenZ Time lab.",
    url: `${SITE_CONFIG.url}/blog`,
    items: posts.map((p) => ({
      name: p.title,
      url: `${SITE_CONFIG.url}/blog/${p.slug}`,
      image: p.featuredImage,
      score: p.verdictScore,
    })),
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Search Engine Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionSchema) }}
      />

      {/* Header Banner */}
      <div className="max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider mb-3 bg-tech-cyan/10 border border-tech-cyan/30 text-tech-cyan">
          <Cpu className="w-3.5 h-3.5" />
          <span>Independent Gadget Testing Archive</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-4">
          Tech Gadget Reviews & Field Tests
        </h1>
        <p className="text-base text-slate-300 leading-relaxed">
          Comprehensive, unbiased analysis of today&apos;s most influential consumer hardware. Filter by product sector, search specifications, or sort by our official GenZ Time Lab Score.
        </p>
      </div>

      {/* Interactive Client Search & Filter Grid */}
      <BlogListClient initialPosts={posts} />
    </div>
  );
}
