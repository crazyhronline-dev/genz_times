'use client';

import React, { useState, useMemo } from 'react';
import { BlogPost } from '@/types/blog';
import { CATEGORIES } from '@/lib/categories';
import PostCard from '@/components/PostCard';
import { Search, Filter, SlidersHorizontal, Sparkles } from 'lucide-react';

interface Props {
  initialPosts: BlogPost[];
}

export default function BlogListClient({ initialPosts }: Props) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'popular'>('newest');

  const filteredPosts = useMemo(() => {
    return initialPosts.filter((post) => {
      // Category filter
      const matchesCategory =
        selectedCategory === 'all' || post.categorySlug === selectedCategory;

      // Search query filter (matches title, excerpt, tags, specs)
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        post.title.toLowerCase().includes(q) ||
        post.excerpt.toLowerCase().includes(q) ||
        post.category.toLowerCase().includes(q) ||
        post.tags.some((t) => t.toLowerCase().includes(q)) ||
        Boolean(post.specs?.processor && post.specs.processor.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'rating') {
        return (b.verdictScore || 0) - (a.verdictScore || 0);
      }
      if (sortBy === 'popular') {
        return (b.views || 0) - (a.views || 0);
      }
      // default: newest
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });
  }, [initialPosts, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="space-y-8">
      {/* Search & Filter Toolbar */}
      <div className="p-6 rounded-3xl bg-tech-900/80 border border-slate-800 shadow-xl backdrop-blur-md">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-stretch md:items-center">
          
          {/* Live Search Input */}
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search gadgets, specs, chips, or keywords (e.g. Snapdragon, M4, ANC)..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-tech-950/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white px-2 py-1 bg-white/5 rounded"
              >
                Clear
              </button>
            )}
          </div>

          {/* Sort Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs font-mono text-slate-400">
              <SlidersHorizontal className="w-4 h-4 text-tech-cyan" />
              <span>Sort:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-tech-950 border border-slate-700 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-tech-cyan"
            >
              <option value="newest">Latest Reviews</option>
              <option value="rating">Highest Lab Score</option>
              <option value="popular">Most Popular</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-4 mt-4 border-t border-slate-800/80 no-scrollbar">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition ${
              selectedCategory === 'all'
                ? 'bg-tech-cyan text-tech-950 font-bold shadow-glow'
                : 'bg-tech-950/70 text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            All Gadgets ({initialPosts.length})
          </button>
          {CATEGORIES.map((cat) => {
            const count = initialPosts.filter((p) => p.categorySlug === cat.slug).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.slug)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-mono whitespace-nowrap transition ${
                  selectedCategory === cat.slug
                    ? 'bg-tech-cyan text-tech-950 font-bold shadow-glow'
                    : 'bg-tech-950/70 text-slate-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {cat.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-400">
        <span>
          Showing <strong className="text-tech-cyan">{filteredPosts.length}</strong> gadget {filteredPosts.length === 1 ? 'article' : 'articles'}
        </span>
        {searchQuery && (
          <span>Filtering by query &quot;{searchQuery}&quot;</span>
        )}
      </div>

      {/* Post Grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 rounded-3xl bg-tech-900/40 border border-slate-800 p-8">
          <Sparkles className="w-10 h-10 text-tech-cyan mx-auto mb-3 opacity-60" />
          <h3 className="text-lg font-bold text-white mb-2">No Gadgets Matched Your Search</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
            Try adjusting your search terms or clearing the active category filters.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
            }}
            className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono transition"
          >
            Reset All Filters
          </button>
        </div>
      )}
    </div>
  );
}
