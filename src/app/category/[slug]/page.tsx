import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import { getPostsByCategory } from '@/lib/posts-db';
import PostCard from '@/components/PostCard';
import { ChevronRight, Cpu, Sparkles, ArrowLeft } from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';

interface Props {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    return {
      title: 'Category Not Found | GenZ Time',
    };
  }

  return {
    title: `${category.name} Reviews, Hardware Benchmarks & Guides | GenZ Time`,
    description: `Read the latest ${category.name} in-depth reviews, laboratory benchmarks, and buyer guides on GenZ Time.`,
    alternates: {
      canonical: `${SITE_CONFIG.url}/category/${category.slug}`,
    },
    openGraph: {
      title: `${category.name} Gadgets & Reviews | GenZ Time`,
      description: category.description,
      url: `${SITE_CONFIG.url}/category/${category.slug}`,
    },
  };
}

export async function generateStaticParams() {
  return CATEGORIES.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const category = getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(category.slug);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-400">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/blog" className="hover:text-white transition">Reviews</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-tech-cyan">{category.name}</span>
      </nav>

      {/* Category Header */}
      <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-tech-900 via-tech-950 to-tech-900 border border-slate-800 relative overflow-hidden shadow-glow">
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4 bg-tech-cyan/15 text-tech-cyan border border-tech-cyan/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>Product Category</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight mb-3">
            {category.name}
          </h1>

          <p className="text-base text-slate-300 leading-relaxed mb-6">
            {category.description}
          </p>

          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="bg-tech-950 px-3 py-1.5 rounded-lg border border-slate-800 text-white font-bold">
              {posts.length} {posts.length === 1 ? 'Tested Device' : 'Tested Devices'}
            </span>
            <span>Independent Lab Methodology</span>
          </div>
        </div>
      </div>

      {/* Category Articles Grid */}
      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 rounded-3xl bg-tech-900/40 border border-slate-800 p-8">
          <Sparkles className="w-12 h-12 text-tech-cyan mx-auto mb-4 opacity-50" />
          <h3 className="text-xl font-bold text-white mb-2">No Reviews In This Category Yet</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Our hardware testing lab is currently benchmarking upcoming {category.name.toLowerCase()} devices. Check back soon or publish the first review!
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              href="/blog"
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to All Reviews</span>
            </Link>
            <Link
              href="/publish"
              className="px-5 py-2.5 rounded-xl bg-tech-cyan text-tech-950 font-bold text-xs font-mono transition shadow-glow"
            >
              Publish New Review
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
