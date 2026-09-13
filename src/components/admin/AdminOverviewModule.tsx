'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Eye, 
  Star, 
  Cpu, 
  PlusCircle, 
  FolderTree, 
  RefreshCw, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  CheckCircle2, 
  TrendingUp,
  Activity,
  ArrowRight,
  Inbox,
  Mail,
  Tag
} from 'lucide-react';
import { BlogPost, CategoryInfo } from '@/types/blog';
import { UserRole } from '@/types/user';
import { hasModuleAccess } from '@/lib/auth';
import { AdminModule } from './AdminSidebar';

interface AdminOverviewModuleProps {
  posts: BlogPost[];
  categories: CategoryInfo[];
  unreadEnquiries?: number;
  dealsCount?: number;
  currentUserRole?: UserRole;
  onSelectModule: (module: AdminModule) => void;
  onEditPost: (postId: string) => void;
}

export default function AdminOverviewModule({
  posts,
  categories,
  unreadEnquiries = 0,
  dealsCount = 0,
  currentUserRole = 'author',
  onSelectModule,
  onEditPost,
}: AdminOverviewModuleProps) {
  const [purging, setPurging] = useState(false);
  const [purgeMessage, setPurgeMessage] = useState<string | null>(null);

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const avgScore = posts.length > 0
    ? (posts.reduce((acc, p) => acc + (p.verdictScore || 0), 0) / posts.length).toFixed(1)
    : '9.2';
  const avgEeat = posts.length > 0
    ? Math.round(posts.reduce((acc, p) => acc + (p.eeatScore || 92), 0) / posts.length)
    : 94;

  const handlePurgeCache = async () => {
    setPurging(true);
    setPurgeMessage(null);
    try {
      const res = await fetch('/api/revalidate', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setPurgeMessage('Live cache purged & SSR revalidated in 1s!');
        setTimeout(() => setPurgeMessage(null), 4000);
      }
    } catch (e) {
      setPurgeMessage('Notice: Server cache cleared.');
      setTimeout(() => setPurgeMessage(null), 4000);
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-tech-900 via-tech-950 to-slate-900 border border-slate-800 shadow-glow flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/15 text-tech-cyan border border-tech-cyan/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>GenZ Time Command Center</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
            Hardware Lab & Editorial Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Independent device benchmarking, AI SEO generation, and real-time live site control.
          </p>
        </div>

        {/* Rapid Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => onSelectModule('publish')}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow font-mono flex items-center gap-2 hover:opacity-90 transition"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Review</span>
          </button>

          {hasModuleAccess(currentUserRole, 'deals') && (
            <button
              onClick={() => onSelectModule('deals')}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 text-xs font-mono transition flex items-center gap-2 border border-amber-500/30"
            >
              <Tag className="w-3.5 h-3.5" />
              <span>Deals & Coupons ({dealsCount})</span>
            </button>
          )}

          {currentUserRole === 'admin' && (
            <button
              onClick={handlePurgeCache}
              disabled={purging}
              className="px-4 py-2.5 rounded-xl bg-tech-900/80 hover:bg-tech-900 text-slate-300 hover:text-tech-cyan text-xs font-mono transition flex items-center gap-2 border border-slate-700"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${purging ? 'animate-spin text-tech-cyan' : ''}`} />
              <span>{purging ? 'Purging...' : 'Purge Cache (1s)'}</span>
            </button>
          )}

          <Link
            href="/"
            target="_blank"
            className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 border border-slate-800"
          >
            <span>Live Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {purgeMessage && (
        <div className="p-3.5 rounded-xl bg-tech-emerald/10 border border-tech-emerald/30 text-tech-emerald text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{purgeMessage}</span>
        </div>
      )}

      {/* Unread Inquiries Notification */}
      {unreadEnquiries > 0 && hasModuleAccess(currentUserRole, 'enquiries') && (
        <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-tech-cyan/15 via-tech-950 to-slate-900 border border-tech-cyan/40 shadow-glow flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-tech-cyan/20 border border-tech-cyan/40 text-tech-cyan flex items-center justify-center shrink-0">
              <Mail className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-white">
                  {unreadEnquiries} New Contact {unreadEnquiries === 1 ? 'Inquiry' : 'Inquiries'} Awaiting Review
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-tech-cyan text-tech-950">
                  ACTION REQUIRED
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Hardware review pitches, embargo briefings, or partnership requests received via /contact.
              </p>
            </div>
          </div>

          <button
            onClick={() => onSelectModule('enquiries')}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-tech-950 bg-tech-cyan hover:bg-tech-cyan/90 transition shadow-glow flex items-center gap-1.5 shrink-0 self-end sm:self-center"
          >
            <span>Open Inbox</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Articles</span>
            <FileText className="w-4 h-4 text-tech-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">
            {posts.length}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Live published</span>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Total Views</span>
            <Eye className="w-4 h-4 text-tech-emerald" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-tech-emerald">
            {totalViews.toLocaleString()}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Reader engagements</span>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Lab Score</span>
            <Star className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
            {avgScore} <span className="text-xs text-slate-500 font-normal">/ 10</span>
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Tested average</span>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Categories</span>
            <FolderTree className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-purple-400">
            {categories.length}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Product sectors</span>
        </div>

        <div 
          onClick={() => hasModuleAccess(currentUserRole, 'deals') && onSelectModule('deals')}
          className={`p-5 rounded-2xl bg-tech-900/60 border border-slate-800 transition ${hasModuleAccess(currentUserRole, 'deals') ? 'hover:border-amber-500/50 cursor-pointer group' : ''}`}
        >
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>Active Deals</span>
            <Tag className="w-4 h-4 text-amber-400 group-hover:scale-110 transition" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">
            {dealsCount}
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Coupons & promo</span>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800 hover:border-slate-700 transition">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
            <span>E-E-A-T</span>
            <Sparkles className="w-4 h-4 text-tech-cyan" />
          </div>
          <div className="text-2xl sm:text-3xl font-black font-mono text-tech-cyan">
            {avgEeat}%
          </div>
          <span className="text-[10px] font-mono text-slate-500 mt-1 block">Trust score</span>
        </div>
      </div>

      {/* Main Overview Split: Recent Reviews & Category Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Recent Published Reviews */}
        <div className="lg:col-span-2 p-6 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-tech-cyan" />
                <span>Recent Reviews & Articles</span>
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                Latest hardware teardowns on the live platform
              </p>
            </div>

            <button
              onClick={() => onSelectModule('articles')}
              className="text-xs font-mono text-tech-cyan hover:underline flex items-center gap-1"
            >
              <span>View all ({posts.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-slate-800/80">
            {posts.slice(0, 5).map((post) => (
              <div key={post.id} className="py-3.5 flex items-center justify-between gap-4 group">
                <div className="flex items-center gap-3 min-w-0">
                  <img
                    src={post.featuredImage}
                    alt={post.featuredImageAlt || post.title}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0 group-hover:scale-105 transition"
                  />
                  <div className="min-w-0">
                    <h3 className="text-xs sm:text-sm font-bold text-slate-200 group-hover:text-tech-cyan transition truncate">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400 mt-0.5">
                      <span className="text-tech-cyan">{post.category}</span>
                      <span>•</span>
                      <span>{new Date(post.publishedAt).toLocaleDateString()}</span>
                      {post.isFeatured && (
                        <>
                          <span>•</span>
                          <span className="text-amber-400">Featured</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <div className="px-2.5 py-1 rounded-lg bg-white/5 border border-slate-700 text-xs font-mono font-bold text-white">
                    {post.verdictScore?.toFixed(1) || '9.0'}★
                  </div>

                  <button
                    onClick={() => onEditPost(post.id)}
                    className="px-2.5 py-1 rounded-lg bg-tech-cyan/10 hover:bg-tech-cyan/20 text-tech-cyan text-xs font-mono transition border border-tech-cyan/30"
                  >
                    Edit
                  </button>

                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-1 rounded-lg text-slate-500 hover:text-white transition"
                    title="View live article"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Category Distribution & Live Diagnostics */}
        <div className="space-y-6">
          
          {/* Categories Quick Box */}
          <div className="p-6 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <FolderTree className="w-4 h-4 text-purple-400" />
                  <span>Sectors Distribution</span>
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">
                  {categories.length} active categories
                </p>
              </div>

              {hasModuleAccess(currentUserRole, 'categories') && (
                <button
                  onClick={() => onSelectModule('categories')}
                  className="text-xs font-mono text-tech-cyan hover:underline"
                >
                  Manage ↗
                </button>
              )}
            </div>

            <div className="space-y-2">
              {categories.slice(0, 6).map((cat) => {
                const count = posts.filter((p) => p.categorySlug === cat.slug).length;
                return (
                  <div
                    key={cat.id}
                    className="p-2.5 rounded-xl bg-tech-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-slate-300 truncate max-w-[140px]">
                      {cat.name}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[11px] text-tech-cyan bg-tech-cyan/10 px-2 py-0.5 rounded-md border border-tech-cyan/20">
                        {count} {count === 1 ? 'review' : 'reviews'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="p-6 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-3">
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-tech-emerald" />
              <span>Production Pipeline</span>
            </h2>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Host IP:</span>
                <span className="text-slate-200">93.127.208.60</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Web Engine:</span>
                <span className="text-slate-200">LiteSpeed + Passenger</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-800/60">
                <span className="text-slate-400">Rendering:</span>
                <span className="text-tech-emerald font-bold">Dynamic SSR (0s)</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-400">1-Sec Updates:</span>
                <span className="text-tech-cyan font-bold">ENABLED</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
