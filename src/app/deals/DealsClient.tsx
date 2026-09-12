'use client';

import React, { useState, useMemo } from 'react';
import { PromoDeal } from '@/types/deal';
import PromoCard from '@/components/PromoCard';
import { 
  Tag, 
  Search, 
  Sparkles, 
  Flame, 
  SlidersHorizontal, 
  ShieldCheck, 
  CheckCircle2, 
  ExternalLink,
  Percent,
  X,
  Clock
} from 'lucide-react';

interface DealsClientProps {
  initialDeals: PromoDeal[];
}

const CATEGORIES = [
  { id: 'all', label: 'All Deals' },
  { id: 'smartphones', label: 'Smartphones' },
  { id: 'laptops', label: 'Laptops & PCs' },
  { id: 'audio', label: 'Audio & Earbuds' },
  { id: 'gaming', label: 'Gaming & Handhelds' },
  { id: 'vpn', label: 'Hosting, Cloud & VPN' },
  { id: 'wearables', label: 'Wearables & VR' },
  { id: 'accessories', label: 'Accessories' },
];

export default function DealsClient({ initialDeals }: DealsClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filterCodeOnly, setFilterCodeOnly] = useState(false);
  const [sortBy, setSortBy] = useState<'featured' | 'newest' | 'popular'>('featured');

  const filteredDeals = useMemo(() => {
    return initialDeals
      .filter((deal) => {
        if (!deal.isActive) return false;

        // Search match across title, store, desc, code, discount, tags, and SEO keywords
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().replace(/^#/, '');
          const matchTitle = deal.title.toLowerCase().includes(q);
          const matchStore = deal.store.toLowerCase().includes(q);
          const matchDesc = deal.description?.toLowerCase().includes(q);
          const matchCode = deal.promoCode?.toLowerCase().includes(q);
          const matchDiscount = deal.discountText.toLowerCase().includes(q);
          const matchTags = (deal.tags || []).some(t => t.toLowerCase().includes(q) || q.includes(t.toLowerCase()));
          const matchSeo = (deal.seoKeywords || []).some(k => k.toLowerCase().includes(q) || q.includes(k.toLowerCase()));
          
          if (!matchTitle && !matchStore && !matchDesc && !matchCode && !matchDiscount && !matchTags && !matchSeo) {
            return false;
          }
        }

        // Category match
        if (selectedCategory !== 'all') {
          if (deal.category.toLowerCase() !== selectedCategory.toLowerCase()) {
            return false;
          }
        }

        // Code only filter
        if (filterCodeOnly && !deal.promoCode) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'featured') {
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'popular') {
          return ((b.clicks || 0) + (b.copiedCount || 0)) - ((a.clicks || 0) + (a.copiedCount || 0));
        }
        // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [initialDeals, searchQuery, selectedCategory, filterCodeOnly, sortBy]);

  const allPopularTags = useMemo(() => {
    const set = new Set<string>();
    initialDeals.forEach((d) => {
      (d.tags || []).forEach((t) => set.add(t));
    });
    return Array.from(set).slice(0, 10);
  }, [initialDeals]);

  return (
    <div className="min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono font-bold mb-6 animate-fadeIn">
          <Flame className="w-4 h-4 text-amber-400" />
          <span>EXCLUSIVE TECH COUPONS & DISCOUNTS</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          Hand-Tested <span className="bg-gradient-to-r from-amber-300 via-orange-400 to-rose-400 bg-clip-text text-transparent">Promo Codes</span> & Hardware Deals
        </h1>

        <p className="mt-4 sm:mt-6 text-sm sm:text-base lg:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Every promo code and discount here is manually tested by our lab team. Reveal exclusive voucher codes, grab instant discounts, and save on premium consumer tech.
        </p>

        {/* Live Lab Guarantee Strip */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-tech-cyan" />
            <span>100% Verified Codes</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-tech-emerald" />
            <span>Updated Daily</span>
          </div>
          <div className="flex items-center gap-2">
            <Percent className="w-4 h-4 text-amber-400" />
            <span>Zero Markup</span>
          </div>
        </div>
      </section>

      {/* Main Filter & Showcase Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Search and Sort Toolbar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-tech-900/60 border border-slate-800 backdrop-blur-xl shadow-xl space-y-4 mb-8">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by store (e.g. Samsung, Apple, NordVPN), product or discount..."
                className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-tech-950/80 border border-slate-700/80 text-white text-sm placeholder-slate-500 focus:outline-none focus:border-amber-400/80 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Filter Controls */}
            <div className="flex flex-wrap items-center gap-3 shrink-0 text-xs font-mono">
              {/* Code Only Toggle */}
              <button
                onClick={() => setFilterCodeOnly(!filterCodeOnly)}
                className={`px-3.5 py-2.5 rounded-xl border transition flex items-center gap-2 ${
                  filterCodeOnly
                    ? 'bg-amber-400/20 border-amber-400/60 text-amber-300 font-bold shadow-glow'
                    : 'bg-tech-950/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Promo Codes Only</span>
              </button>

              {/* Sort By Dropdown */}
              <div className="flex items-center gap-2 bg-tech-950/60 border border-slate-800 rounded-xl px-3 py-1.5">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-500">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  aria-label="Sort Deals"
                  className="bg-transparent text-slate-200 focus:outline-none cursor-pointer"
                >
                  <option value="featured" className="bg-tech-900 text-white">Featured</option>
                  <option value="popular" className="bg-tech-900 text-white">Most Popular</option>
                  <option value="newest" className="bg-tech-900 text-white">Newest First</option>
                </select>
              </div>
            </div>

          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const isActive = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-medium transition whitespace-nowrap ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-400 to-orange-400 text-tech-950 font-bold shadow-glow'
                      : 'bg-tech-950/60 text-slate-400 hover:text-white border border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Popular Ranking Tags Bar */}
          {allPopularTags.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap pt-2 border-t border-slate-800/60 text-xs font-mono">
              <span className="text-[11px] text-slate-500 uppercase tracking-wider font-bold mr-1 flex items-center gap-1">
                <Tag className="w-3 h-3 text-amber-400" />
                Popular Tags:
              </span>
              {allPopularTags.map((tag) => {
                const isSelected = searchQuery.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={tag}
                    onClick={() => setSearchQuery(isSelected ? '' : tag)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] transition flex items-center gap-1 ${
                      isSelected
                        ? 'bg-amber-400/25 text-amber-300 border border-amber-400/50 font-bold'
                        : 'bg-tech-950/60 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>#{tag}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Results Info Bar */}
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6 px-1">
          <div className="flex items-center gap-2">
            <span>Showing <strong className="text-white font-bold">{filteredDeals.length}</strong> available {filteredDeals.length === 1 ? 'deal' : 'deals'}</span>
            {selectedCategory !== 'all' && (
              <span className="px-2 py-0.5 rounded bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/20">
                Sector: {selectedCategory}
              </span>
            )}
            {filterCodeOnly && (
              <span className="px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                Code verified
              </span>
            )}
          </div>

          {(searchQuery || selectedCategory !== 'all' || filterCodeOnly) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilterCodeOnly(false);
              }}
              className="text-amber-400 hover:underline flex items-center gap-1"
            >
              <span>Reset filters</span>
            </button>
          )}
        </div>

        {/* Deals Cards Grid */}
        {filteredDeals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredDeals.map((deal) => (
              <PromoCard 
                key={deal.id} 
                deal={deal} 
                onSelectTag={(tag) => setSearchQuery(tag)}
              />
            ))}
          </div>
        ) : (
          <div className="p-12 sm:p-16 rounded-3xl bg-tech-900/30 border border-slate-800 text-center space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center mx-auto">
              <Tag className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-white">No Deals Match Your Filter</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              We couldn&apos;t find any active coupons matching &quot;{searchQuery || selectedCategory}&quot;. Try resetting your filters to view all verified hardware promotions.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilterCodeOnly(false);
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-400 text-tech-950 font-bold text-xs font-mono transition shadow-glow hover:opacity-95"
            >
              Show All Available Deals
            </button>
          </div>
        )}

        {/* E-E-A-T Editorial Disclosure & Affiliate FAQ */}
        <div className="mt-16 p-6 sm:p-8 rounded-3xl bg-tech-900/30 border border-slate-800 space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-tech-cyan/10 border border-tech-cyan/20 text-tech-cyan">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">How GenZ Time Curates Deals & Promo Codes</h2>
              <p className="text-xs text-slate-400 font-mono">Independent verification and transparent editorial policy</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-400 leading-relaxed">
            <div className="space-y-2 p-4 rounded-2xl bg-tech-950/60 border border-slate-800/80">
              <span className="font-bold text-slate-200 block text-sm">1. Manually Tested Codes</span>
              <p>
                Our staff tests every promo code directly at checkout prior to publishing to confirm it provides the advertised discount without hidden catches.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-tech-950/60 border border-slate-800/80">
              <span className="font-bold text-slate-200 block text-sm">2. Transparent Referral Links</span>
              <p>
                When you click &ldquo;Get This Promo Code&rdquo;, we may earn an affiliate commission from the retailer at no extra cost to you. This directly funds our lab testing equipment.
              </p>
            </div>

            <div className="space-y-2 p-4 rounded-2xl bg-tech-950/60 border border-slate-800/80">
              <span className="font-bold text-slate-200 block text-sm">3. Zero Sponsored Verdicts</span>
              <p>
                No retailer can purchase positive hardware benchmark scores or editorial reviews. Our deals directory is curated strictly to save our readers money.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
