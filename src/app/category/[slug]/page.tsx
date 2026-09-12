import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES, getCategoryBySlug } from '@/lib/categories';
import { getCategoryBySlug as getCategoryBySlugDb, getAllCategories } from '@/lib/categories-db';
import { getCategoryIcon } from '@/lib/category-icons';
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
  const category = (await getCategoryBySlugDb(params.slug)) || getCategoryBySlug(params.slug);
  if (!category) {
    return {
      title: 'Category Not Found | GenZ Time',
    };
  }

  // Human-touch, E-E-A-T descriptions per category
  const categoryMeta: Record<string, { title: string; description: string }> = {
    smartphones: {
      title: `Best Smartphones Reviewed & Benchmarked in ${new Date().getFullYear()}`,
      description: `Our editors have personally used and stress-tested every phone listed here. From flagship foldables to budget killers — real camera shootouts, battery drain tests, and drop tests. No PR bias.`,
    },
    'laptops-computing': {
      title: `Laptop & PC Reviews with Real Benchmark Data`,
      description: `We run standardized CPU, GPU, and thermal benchmarks on every machine. Whether you're a creator, gamer, or student — find out which laptop actually delivers what it promises before you spend a rupee.`,
    },
    'audio-earbuds': {
      title: `Best Earbuds & Headphones Actually Worth Buying`,
      description: `We measure frequency response, ANC depth, and mic clarity in our own audio lab. Find the best wireless earbuds, noise-cancelling headphones, and open-ear alternatives for Gen Z lifestyles.`,
    },
    'vr-wearables': {
      title: `VR Headsets, Smartwatches & Wearables Reviewed`,
      description: `We've strapped on every major VR headset, spatial computer, and smartwatch so you don't have to. Honest takes on comfort, latency, and real-world usability from people who actually use this stuff daily.`,
    },
    'drones-cameras': {
      title: `Drones & Cameras Reviewed for Creators & Hobbyists`,
      description: `Our team shoots real footage and analyzes it frame by frame. From DJI Mini drones to mirrorless cinema cameras — we tell you what actually performs under real lighting, wind, and movement conditions.`,
    },
    'ai-gadgets': {
      title: `AI Gadgets & Future Tech — Honest Reviews for Gen Z`,
      description: `Wearable AI pins, ambient computing devices, autonomous agents, and experimental next-gen hardware. We test the future so you know whether the hype is real before it becomes mainstream.`,
    },
    'gaming-gear': {
      title: `Gaming Gear Benchmarks — Handhelds, GPUs & Peripherals`,
      description: `Frame rates don't lie. We run real gaming benchmarks on handheld consoles, gaming laptops, OLED monitors, mechanical keyboards, and GPUs. Every score is reproducible and documented.`,
    },
    'smart-home': {
      title: `Smart Home Gadgets That Actually Work — Tested by Editors`,
      description: `We've set up and lived with dozens of smart home devices — from Matter-compatible routers to robotic vacuums to smart lighting ecosystems. We tell you what simplifies your home and what's just expensive plastic.`,
    },
  };

  const meta = categoryMeta[category.slug] || {
    title: `${category.name} Reviews, Benchmarks & Buying Guides`,
    description: `We've personally tested every ${category.name} product listed here. ${category.description} No sponsored rankings — just real data.`,
  };

  return {
    title: meta.title,
    description: meta.description,
    keywords: [
      `${category.name} review 2026`,
      `best ${category.name} Gen Z`,
      `${category.name} benchmark`,
      `honest ${category.name} review`,
      `GenZ Time ${category.name}`,
    ],
    alternates: {
      canonical: `${SITE_CONFIG.url}/category/${category.slug}`,
    },
    openGraph: {
      title: meta.title,
      description: meta.description,
      url: `${SITE_CONFIG.url}/category/${category.slug}`,
    },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((cat) => ({
    slug: cat.slug,
  }));
}

export default async function CategoryPage({ params }: Props) {
  const category = (await getCategoryBySlugDb(params.slug)) || getCategoryBySlug(params.slug);
  if (!category) {
    notFound();
  }

  const posts = await getPostsByCategory(category.slug);
  const CategoryIcon = getCategoryIcon(category.iconName);

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
        <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none">
          <CategoryIcon className="w-72 h-72 text-white" />
        </div>
        <div className="max-w-2xl relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-4 bg-tech-cyan/15 text-tech-cyan border border-tech-cyan/30">
            <CategoryIcon className="w-3.5 h-3.5" />
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
