import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/blog';
import { Clock, Calendar, Star, ChevronRight, Sparkles } from 'lucide-react';
import ImageWatermark from '@/components/ImageWatermark';

interface Props {
  post: BlogPost;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: Props) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <article
      className={`group relative rounded-2xl bg-tech-900/80 border border-slate-800/90 overflow-hidden hover:border-tech-cyan/50 transition-all duration-300 flex flex-col hover:shadow-glow ${
        featured ? 'md:grid md:grid-cols-12 md:gap-6' : ''
      }`}
    >
      {/* Thumbnail Container */}
      <div className={`relative overflow-hidden aspect-[16/9] bg-tech-950 ${featured ? 'md:col-span-7 md:aspect-auto md:h-full' : ''}`}>
        <img
          src={post.featuredImage}
          alt={post.featuredImageAlt || `${post.title} - GenZ Time`}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {/* Subtle overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-transparent to-transparent opacity-60" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3 z-10">
          <Link
            href={`/category/${post.categorySlug}`}
            className="px-2.5 py-1 rounded-md text-[11px] font-mono font-bold uppercase tracking-wider bg-tech-950/80 backdrop-blur-md text-tech-cyan border border-tech-cyan/30 hover:bg-tech-cyan hover:text-tech-950 transition"
          >
            {post.category}
          </Link>
        </div>

        {/* Rating Score Badge or Comparison Badge */}
        {post.isComparison && post.comparedProducts && post.comparedProducts.length > 1 ? (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-purple-950/85 backdrop-blur-md text-purple-300 border border-purple-400/40 shadow-md">
            <span>⚔️ {post.comparedProducts.length}-Way VS</span>
          </div>
        ) : post.verdictScore ? (
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold bg-tech-950/80 backdrop-blur-md text-white border border-slate-700 shadow-md">
            <Star className="w-3.5 h-3.5 text-tech-cyan fill-tech-cyan" />
            <span>{post.verdictScore.toFixed(1)}</span>
          </div>
        ) : null}

        {/* Official Brand Watermark */}
        <ImageWatermark size="sm" position="bottom-right" label="LAB TESTED" />
      </div>

      {/* Content Container */}
      <div className={`p-5 sm:p-6 flex-1 flex flex-col justify-between ${featured ? 'md:col-span-5 md:py-8' : ''}`}>
        <div>
          {/* Metadata Byline */}
          <div className="flex items-center gap-3 text-xs font-mono text-slate-400 mb-2.5">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
          </div>

          {/* Title */}
          <h3 className={`font-bold text-white group-hover:text-tech-cyan transition line-clamp-2 ${
            featured ? 'text-xl sm:text-2xl lg:text-3xl' : 'text-lg sm:text-xl'
          }`}>
            <Link href={`/blog/${post.slug}`}>
              {post.title}
            </Link>
          </h3>

          {/* Excerpt */}
          <p className="text-sm text-slate-400 mt-2.5 line-clamp-2 leading-relaxed">
            {post.excerpt}
          </p>
        </div>

        {/* Footer: Author & Read Link */}
        <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-7 h-7 rounded-full object-cover border border-tech-cyan/30"
            />
            <span className="text-xs font-medium text-slate-300">
              {post.author.name}
            </span>
          </div>

          <Link
            href={`/blog/${post.slug}`}
            className="flex items-center gap-1 text-xs font-mono font-semibold text-tech-cyan hover:text-white transition group-hover:translate-x-1 duration-200"
          >
            <span>Read Specs</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </article>
  );
}
