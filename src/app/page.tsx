import React from 'react';
import Link from 'next/link';
import { getAllPosts, getFeaturedPosts, getTrendingPosts } from '@/lib/posts-db';
import { getAllCategories } from '@/lib/categories-db';
import { getCategoryIcon } from '@/lib/category-icons';
import PostCard from '@/components/PostCard';
import NewsletterBox from '@/components/NewsletterBox';
import { 
  Flame, 
  Sparkles, 
  ArrowRight, 
  Cpu, 
  ShieldCheck, 
  Gauge, 
  Microscope, 
  Star
} from 'lucide-react';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function HomePage() {
  const [posts, featuredPosts, trendingPosts, categories] = await Promise.all([
    getAllPosts(),
    getFeaturedPosts(),
    getTrendingPosts(),
    getAllCategories(),
  ]);
  const heroPost = featuredPosts[0] || posts[0];
  const secondaryFeatured = featuredPosts.slice(1, 3);
  const latestPosts = posts.filter((p) => p.id !== heroPost.id).slice(0, 6);

  const trendingList = trendingPosts.length > 0 ? trendingPosts : posts.slice(0, 6);
  // Duplicate list to achieve continuous seamless loop
  const marqueeItems = [...trendingList, ...trendingList];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-16">
      
      {/* 1. Trending Hardware Marquee Ticker */}
      <div className="relative rounded-2xl bg-tech-900/70 border border-slate-800/80 px-4 py-2.5 flex items-center gap-4 overflow-hidden text-xs font-mono group">
        {/* Fixed "Trending Now" Cyber Badge */}
        <div className="flex items-center gap-1.5 text-tech-cyan flex-shrink-0 font-bold uppercase tracking-wider bg-tech-cyan/10 px-3 py-1.5 rounded-lg border border-tech-cyan/30 z-20 shadow-md backdrop-blur-md">
          <Flame className="w-3.5 h-3.5 animate-pulse text-amber-400" />
          <span>Trending Now</span>
        </div>

        {/* Left & Right Gradient Fade Masks */}
        <div className="pointer-events-none absolute left-[145px] sm:left-[160px] top-0 bottom-0 w-8 bg-gradient-to-r from-tech-900 via-tech-900/60 to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-tech-900 to-transparent z-10" />

        {/* Continuous Marquee Track */}
        <div className="overflow-hidden flex-1 relative flex items-center">
          <div className="animate-marquee flex items-center gap-8 whitespace-nowrap text-slate-400 py-0.5">
            {marqueeItems.map((t, index) => (
              <Link
                key={`${t.id}-${index}`}
                href={`/blog/${t.slug}`}
                className="hover:text-white transition-colors flex items-center gap-2 group/item flex-shrink-0"
              >
                <span className="text-tech-cyan/80 font-bold">#{((index % trendingList.length) + 1).toString().padStart(2, '0')}</span>
                <span className="group-hover/item:underline group-hover/item:text-tech-cyan transition-colors">{t.title}</span>
                <span className="text-tech-emerald font-bold bg-tech-emerald/10 border border-tech-emerald/30 px-1.5 py-0.5 rounded text-[11px]">
                  {t.verdictScore}/10
                </span>
                <span className="text-slate-600 select-none ml-2">•</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hero Gadget Spotlight */}
      {heroPost && (
        <section className="relative rounded-3xl bg-tech-900/90 border border-slate-700/80 overflow-hidden shadow-glow">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            
            {/* Left: Article Spotlight Info */}
            <div className="lg:col-span-6 p-8 sm:p-12 flex flex-col justify-between z-10">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <span className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/15 text-tech-cyan border border-tech-cyan/30">
                    {heroPost.category}
                  </span>
                  <span className="flex items-center gap-1 text-xs font-mono text-tech-emerald bg-tech-emerald/10 px-2.5 py-1 rounded-full border border-tech-emerald/30">
                    <Star className="w-3.5 h-3.5 fill-tech-emerald text-tech-emerald" />
                    <span>Rating {heroPost.verdictScore}/10</span>
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight mb-4">
                  <Link href={`/blog/${heroPost.slug}`} className="hover:text-tech-cyan transition duration-200">
                    {heroPost.title}
                  </Link>
                </h1>

                <p className="text-base text-slate-300 leading-relaxed line-clamp-3 mb-6">
                  {heroPost.excerpt}
                </p>

                {/* Quick Specs Pill Highlights */}
                {heroPost.specs && (
                  <div className="grid grid-cols-2 gap-2.5 mb-8 text-xs font-mono">
                    {heroPost.specs.processor && (
                      <div className="p-2 rounded-lg bg-tech-950/70 border border-slate-800 text-slate-300">
                        <span className="text-slate-500 block text-[10px] uppercase">Chip</span>
                        <span className="truncate block font-semibold text-white">{heroPost.specs.processor}</span>
                      </div>
                    )}
                    {heroPost.specs.display && (
                      <div className="p-2 rounded-lg bg-tech-950/70 border border-slate-800 text-slate-300">
                        <span className="text-slate-500 block text-[10px] uppercase">Screen</span>
                        <span className="truncate block font-semibold text-white">{heroPost.specs.display}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Author & Action Button */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <img
                    src={heroPost.author.avatar}
                    alt={heroPost.author.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-tech-cyan/40"
                  />
                  <div>
                    <p className="text-sm font-bold text-white">{heroPost.author.name}</p>
                    <p className="text-xs text-slate-400 font-mono">{heroPost.readingTime}</p>
                  </div>
                </div>

                <Link
                  href={`/blog/${heroPost.slug}`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition transform active:scale-95"
                >
                  <span>Read Full In-Depth Review</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right: Immersive Gadget Image */}
            <div className="lg:col-span-6 relative min-h-[340px] lg:min-h-full overflow-hidden bg-tech-950">
              <img
                src={heroPost.featuredImage}
                alt={heroPost.title}
                className="w-full h-full object-cover object-center lg:absolute inset-0 hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-tech-900 via-transparent to-transparent lg:bg-gradient-to-r lg:from-tech-900 lg:via-transparent lg:to-transparent" />
            </div>

          </div>
        </section>
      )}

      {/* 3. Gadget Category Exploration Bar */}
      <section id="categories" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-tech-cyan font-bold mb-1">
              <Cpu className="w-4 h-4" />
              <span>Hardware Sectors</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Explore by Tech Category
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs font-mono text-tech-cyan hover:underline flex items-center gap-1"
          >
            <span>All Articles</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = getCategoryIcon(cat.iconName);
            const count = posts.filter((p) => p.categorySlug === cat.slug).length;

            return (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
                className="group p-5 rounded-2xl bg-tech-900/60 border border-slate-800/80 hover:border-tech-cyan/40 hover:bg-tech-900 transition duration-300 flex flex-col justify-between shadow-lg"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${cat.featuredColor || 'from-cyan-500 to-blue-600'} text-white group-hover:scale-110 group-hover:shadow-glow transition-all shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500 bg-white/5 px-2 py-0.5 rounded">
                    {count} {count === 1 ? 'Review' : 'Reviews'}
                  </span>
                </div>
                <div>
                  <h3 className="font-bold text-white group-hover:text-tech-cyan transition text-base mb-1">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2">
                    {cat.description}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Latest Gadget Reviews Feed */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-tech-emerald font-bold mb-1">
              <Sparkles className="w-4 h-4" />
              <span>Fresh From The Test Bench</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              Latest Reviews & Hands-On
            </h2>
          </div>
          <Link
            href="/blog"
            className="text-xs font-mono text-tech-cyan hover:underline flex items-center gap-1"
          >
            <span>View Full Archive</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      {/* 5. Why Trust GenZ Time Hardware Testing */}
      <section className="rounded-3xl bg-tech-900/60 border border-slate-800/80 p-8 sm:p-12">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-tech-cyan font-bold block mb-2">
            The GenZ Time Protocol
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">
            Engineered For Pure Hardware Integrity
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Unlike aggregators, we spend weeks living with each device before rendering a final score.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-tech-950/80 border border-slate-800 flex flex-col items-center text-center">
            <div className="p-3 rounded-2xl bg-tech-cyan/10 border border-tech-cyan/30 text-tech-cyan mb-4">
              <Microscope className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Synthetic & Real-World Labs</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every CPU, GPU, display nit measurement, and camera sensor undergoes rigorous repeatable benchmarks.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-tech-950/80 border border-slate-800 flex flex-col items-center text-center">
            <div className="p-3 rounded-2xl bg-tech-emerald/10 border border-tech-emerald/30 text-tech-emerald mb-4">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Zero Sponsored Scores</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Tech brands have no editorial influence over our final verdicts, scores, pros/cons, or recommendations.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-tech-950/80 border border-slate-800 flex flex-col items-center text-center">
            <div className="p-3 rounded-2xl bg-tech-violet/10 border border-tech-violet/30 text-purple-400 mb-4">
              <Gauge className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Thermal & Battery Stress</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We test sustained thermal throttling, charging curves, and battery degradation under extreme loads.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Newsletter Subscription */}
      <NewsletterBox />

    </div>
  );
}
