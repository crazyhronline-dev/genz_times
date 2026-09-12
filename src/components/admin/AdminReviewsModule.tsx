'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Star, 
  Award, 
  Sparkles, 
  TrendingUp, 
  Check, 
  Edit3, 
  ExternalLink, 
  Sliders, 
  CheckCircle2, 
  Cpu, 
  Flame,
  ShieldCheck
} from 'lucide-react';
import { BlogPost } from '@/types/blog';

interface AdminReviewsModuleProps {
  posts: BlogPost[];
  onEditPost: (postId: string) => void;
  onRefresh: () => void;
}

export default function AdminReviewsModule({
  posts,
  onEditPost,
  onRefresh,
}: AdminReviewsModuleProps) {
  const [editingScoreId, setEditingScoreId] = useState<string | null>(null);
  const [tempScore, setTempScore] = useState<number>(9.0);
  const [savingScore, setSavingScore] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const avgScore = posts.length > 0
    ? (posts.reduce((acc, p) => acc + (p.verdictScore || 0), 0) / posts.length).toFixed(1)
    : '9.2';

  const highestScorePost = posts.reduce((prev, curr) => 
    ((curr.verdictScore || 0) > (prev.verdictScore || 0) ? curr : prev), posts[0] || {}
  );

  const handleStartEditScore = (post: BlogPost) => {
    setEditingScoreId(post.id);
    setTempScore(post.verdictScore || 9.0);
  };

  const handleSaveScore = async (post: BlogPost) => {
    setSavingScore(true);
    try {
      const updated = { ...post, verdictScore: Number(tempScore) };
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        showNotice(`Updated verdict score to ${tempScore}★ for "${post.title.slice(0, 25)}..."`);
        setEditingScoreId(null);
        onRefresh();
      }
    } catch (e) {
      alert('Error updating score');
    } finally {
      setSavingScore(false);
    }
  };

  const handleToggleTrending = async (post: BlogPost) => {
    try {
      const updated = { ...post, isTrending: !post.isTrending };
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        showNotice(`Updated marquee status`);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-tech-900/50 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 mb-1">
            <Award className="w-4 h-4" />
            <span>Hardware Benchmarks & Review Laboratory</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Lab Verdicts & Ratings Matrix
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Audit hardware scores, EEAT telemetry, and marquee tickers live.
          </p>
        </div>
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-400/10 text-amber-400 border border-amber-400/30">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 block">Lab Average</span>
            <span className="text-2xl font-black font-mono text-white">{avgScore} / 10</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 block">Highest Ranked</span>
            <span className="text-sm font-bold text-slate-200 truncate block max-w-[180px]">
              {highestScorePost?.title || 'None'}
            </span>
            <span className="text-xs font-mono text-tech-cyan">
              {highestScorePost?.verdictScore?.toFixed(1) || '0.0'}★
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/60 border border-slate-800 flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-tech-emerald/10 text-tech-emerald border border-tech-emerald/30">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-mono text-slate-400 block">Trending in Ticker</span>
            <span className="text-2xl font-black font-mono text-tech-emerald">
              {posts.filter((p) => p.isTrending).length} devices
            </span>
          </div>
        </div>
      </div>

      {/* Reviews Table */}
      <div className="rounded-3xl bg-tech-900/30 border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-tech-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4">Hardware Device</th>
                <th className="py-3.5 px-3">Category</th>
                <th className="py-3.5 px-3">Verdict Score</th>
                <th className="py-3.5 px-3">E-E-A-T</th>
                <th className="py-3.5 px-3">Originality</th>
                <th className="py-3.5 px-3">Specs Built</th>
                <th className="py-3.5 px-3 text-center">Ticker</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {posts.map((post) => {
                const specsCount = Object.keys(post.specs || {}).filter(
                  (k) => Boolean((post.specs as Record<string, string>)[k])
                ).length;

                return (
                  <tr key={post.id} className="hover:bg-tech-900/40 transition group">
                    {/* Device Title */}
                    <td className="py-3.5 px-4 min-w-[240px]">
                      <div className="font-bold text-slate-200 group-hover:text-amber-300 transition">
                        {post.title}
                      </div>
                      <div className="text-[11px] font-mono text-slate-500 mt-0.5">
                        {post.pros?.length || 0} Pros • {post.cons?.length || 0} Cons
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-white/5 border border-slate-800 text-slate-300">
                        {post.category}
                      </span>
                    </td>

                    {/* Verdict Score (Inline Quick Edit) */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      {editingScoreId === post.id ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="number"
                            min="1.0"
                            max="10.0"
                            step="0.1"
                            value={tempScore}
                            onChange={(e) => setTempScore(parseFloat(e.target.value))}
                            className="w-16 px-2 py-1 bg-tech-950 border border-amber-400 rounded text-xs font-mono font-bold text-amber-300 focus:outline-none"
                          />
                          <button
                            onClick={() => handleSaveScore(post)}
                            disabled={savingScore}
                            className="p-1 rounded bg-amber-400 text-tech-950 font-bold hover:bg-amber-300"
                            title="Save"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingScoreId(null)}
                            className="text-[10px] text-slate-400 hover:text-white"
                          >
                            ✕
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg font-mono font-bold text-xs bg-amber-400/10 border border-amber-400/30 text-amber-300">
                            {post.verdictScore?.toFixed(1) || '9.0'}★
                          </span>
                          <button
                            onClick={() => handleStartEditScore(post)}
                            className="text-[10px] text-slate-500 hover:text-amber-300 font-mono underline"
                          >
                            Edit
                          </button>
                        </div>
                      )}
                    </td>

                    {/* EEAT Score */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <div className="flex items-center gap-1.5 font-mono text-xs text-tech-cyan">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{post.eeatScore || 94}%</span>
                      </div>
                    </td>

                    {/* Originality */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="font-mono text-xs text-tech-emerald">
                        {post.originalityScore || 98}%
                      </span>
                    </td>

                    {/* Specs Complete */}
                    <td className="py-3.5 px-3 whitespace-nowrap font-mono text-xs text-slate-400">
                      {specsCount} / 10 specs
                    </td>

                    {/* Ticker Toggle */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleTrending(post)}
                        className={`p-1.5 rounded-lg border transition ${
                          post.isTrending
                            ? 'bg-tech-emerald/15 border-tech-emerald/40 text-tech-emerald'
                            : 'bg-white/5 border-slate-800 text-slate-600 hover:text-slate-400'
                        }`}
                        title={post.isTrending ? 'Active in Marquee' : 'Inactive in Marquee'}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onEditPost(post.id)}
                          className="px-2.5 py-1 rounded-lg bg-tech-cyan/10 hover:bg-tech-cyan/20 text-tech-cyan text-xs font-mono transition border border-tech-cyan/30"
                        >
                          Studio
                        </button>

                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1 rounded-lg text-slate-500 hover:text-white transition"
                          title="View live review"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
