'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Search, 
  PlusCircle, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  Star, 
  TrendingUp, 
  Eye, 
  SlidersHorizontal,
  Check,
  AlertCircle
} from 'lucide-react';
import { BlogPost, CategoryInfo } from '@/types/blog';

interface AdminArticlesModuleProps {
  posts: BlogPost[];
  categories: CategoryInfo[];
  onEditPost: (postId: string) => void;
  onNewPost: () => void;
  onRefresh: () => void;
}

export default function AdminArticlesModule({
  posts,
  categories,
  onEditPost,
  onNewPost,
  onRefresh,
}: AdminArticlesModuleProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filter posts
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchSearch =
        searchTerm === '' ||
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.tags?.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchCategory =
        selectedCategory === 'all' || post.categorySlug === selectedCategory;
      return matchSearch && matchCategory;
    });
  }, [posts, searchTerm, selectedCategory]);

  const showNotice = (msg: string) => {
    setActionNotice(msg);
    setTimeout(() => setActionNotice(null), 3500);
  };

  // Toggle Featured status
  const handleToggleFeatured = async (post: BlogPost) => {
    const updated = { ...post, isFeatured: !post.isFeatured };
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        showNotice(`Updated "${post.title.slice(0, 30)}..." featured state`);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Toggle Trending status
  const handleToggleTrending = async (post: BlogPost) => {
    const updated = { ...post, isTrending: !post.isTrending };
    try {
      const res = await fetch(`/api/posts/${post.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (data.success) {
        showNotice(`Updated "${post.title.slice(0, 30)}..." trending marquee state`);
        onRefresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Delete post
  const handleDeletePost = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${title}"? This cannot be undone.`)) {
      return;
    }
    setDeletingId(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotice(`Deleted review successfully`);
        onRefresh();
      }
    } catch (e) {
      alert('Failed to delete post');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-tech-900/50 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-tech-cyan mb-1">
            <FileText className="w-4 h-4" />
            <span>Article & Review Repository</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Manage All Articles ({posts.length})
          </h2>
        </div>

        <button
          onClick={onNewPost}
          className="px-4 py-2.5 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow font-mono flex items-center gap-2 hover:opacity-90 transition shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Article</span>
        </button>
      </div>

      {actionNotice && (
        <div className="p-3.5 rounded-xl bg-tech-cyan/10 border border-tech-cyan/30 text-tech-cyan text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl bg-tech-900/30 border border-slate-800 flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by article title or tag..."
            className="w-full pl-10 pr-4 py-2 bg-tech-950/80 border border-slate-700/80 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan"
          />
        </div>

        {/* Category Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <SlidersHorizontal className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto px-3 py-2 bg-tech-950/80 border border-slate-700/80 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-tech-cyan font-mono"
          >
            <option value="all">All Categories ({posts.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Articles Table */}
      <div className="rounded-3xl bg-tech-900/30 border border-slate-800 overflow-hidden">
        {filteredPosts.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <AlertCircle className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 font-mono">No articles found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="text-xs text-tech-cyan hover:underline font-mono"
            >
              Reset filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-tech-950/80 border-b border-slate-800 text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">Article</th>
                  <th className="py-3.5 px-3">Sector</th>
                  <th className="py-3.5 px-3">Score</th>
                  <th className="py-3.5 px-3 text-center">Featured</th>
                  <th className="py-3.5 px-3 text-center">Trending</th>
                  <th className="py-3.5 px-3">Date</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredPosts.map((post) => (
                  <tr
                    key={post.id}
                    className="hover:bg-tech-900/40 transition group"
                  >
                    {/* Article Info */}
                    <td className="py-3.5 px-4 min-w-[280px] max-w-[360px]">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.featuredImage}
                          alt={post.title}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                        />
                        <div className="min-w-0">
                          <h3 className="font-bold text-slate-200 group-hover:text-tech-cyan transition truncate">
                            {post.title}
                          </h3>
                          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500 mt-0.5">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3 text-slate-600" />
                              <span>{post.views || 0}</span>
                            </span>
                            <span>•</span>
                            <span>{post.readingTime}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2.5 py-1 rounded-md text-[11px] font-mono font-medium bg-white/5 border border-slate-800 text-slate-300">
                        {post.category}
                      </span>
                    </td>

                    {/* Verdict Score */}
                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded font-mono font-bold text-xs bg-tech-cyan/10 border border-tech-cyan/30 text-tech-cyan">
                        {post.verdictScore?.toFixed(1) || '9.0'}★
                      </span>
                    </td>

                    {/* Featured Toggle */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleFeatured(post)}
                        title={post.isFeatured ? 'Click to unfeature' : 'Click to feature on home'}
                        className={`p-1.5 rounded-lg border transition ${
                          post.isFeatured
                            ? 'bg-amber-400/15 border-amber-400/40 text-amber-300'
                            : 'bg-white/5 border-slate-800 text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <Star className={`w-4 h-4 ${post.isFeatured ? 'fill-amber-400' : ''}`} />
                      </button>
                    </td>

                    {/* Trending Toggle */}
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => handleToggleTrending(post)}
                        title={post.isTrending ? 'Click to remove from marquee' : 'Click to add to trending marquee'}
                        className={`p-1.5 rounded-lg border transition ${
                          post.isTrending
                            ? 'bg-tech-emerald/15 border-tech-emerald/40 text-tech-emerald'
                            : 'bg-white/5 border-slate-800 text-slate-600 hover:text-slate-400'
                        }`}
                      >
                        <TrendingUp className="w-4 h-4" />
                      </button>
                    </td>

                    {/* Published Date */}
                    <td className="py-3.5 px-3 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(post.publishedAt).toLocaleDateString()}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                          title="View live review"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => onEditPost(post.id)}
                          className="p-1.5 rounded-lg bg-tech-cyan/10 hover:bg-tech-cyan/20 text-tech-cyan transition border border-tech-cyan/30"
                          title="Edit review"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleDeletePost(post.id, post.title)}
                          disabled={deletingId === post.id}
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition border border-rose-500/20 disabled:opacity-50"
                          title="Delete review"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
