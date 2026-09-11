'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';
import PublishStudioPage from '../publish/page';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  TrendingUp, 
  Star, 
  Eye, 
  ExternalLink, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  SlidersHorizontal 
} from 'lucide-react';
import { BlogPost } from '@/types/blog';
import { CATEGORIES } from '@/lib/categories';

export default function AdminDashboardPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/posts')
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setPosts(data.posts);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const totalViews = posts.reduce((acc, p) => acc + (p.views || 0), 0);
  const avgScore = posts.length > 0
    ? (posts.reduce((acc, p) => acc + (p.verdictScore || 0), 0) / posts.length).toFixed(1)
    : '9.2';

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
        
        {/* Top Header Banner */}
        <div className="p-8 rounded-3xl bg-tech-900 border border-slate-800 shadow-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/15 text-tech-cyan border border-tech-cyan/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>GenZ Time Administration Command</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">
              Hardware Editor & CMS Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-mono">
              Authenticated Session • Super Admin (GenZ Editorial Team)
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-1.5 border border-slate-700"
            >
              <span>View Public Site</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="/publish"
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow font-mono flex items-center gap-1.5 hover:opacity-90 transition"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Create Review</span>
            </Link>
          </div>
        </div>

        {/* Metric Cards Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Published Reviews</span>
              <FileText className="w-4 h-4 text-tech-cyan" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {posts.length}
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">Live on localhost</span>
          </div>

          <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Total Reader Views</span>
              <Eye className="w-4 h-4 text-tech-emerald" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-tech-emerald">
              {totalViews.toLocaleString()}
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">Indexed traffic</span>
          </div>

          <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Average Lab Score</span>
              <Star className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-white">
              {avgScore} <span className="text-xs text-slate-500 font-normal">/ 10</span>
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">Hardware benchmarked</span>
          </div>

          <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
              <span>Product Sectors</span>
              <Cpu className="w-4 h-4 text-tech-violet" />
            </div>
            <div className="text-2xl sm:text-3xl font-black font-mono text-purple-400">
              {CATEGORIES.length}
            </div>
            <span className="text-[10px] font-mono text-slate-500 mt-1 block">Gadget categories</span>
          </div>
        </div>

        {/* Embedded Publishing Studio & Management */}
        <div className="pt-6 border-t border-slate-800">
          <PublishStudioPage />
        </div>

      </div>
    </AdminGuard>
  );
}
