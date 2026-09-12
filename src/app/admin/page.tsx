'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminGuard from '@/components/AdminGuard';
import AdminSidebar, { AdminModule } from '@/components/admin/AdminSidebar';
import AdminOverviewModule from '@/components/admin/AdminOverviewModule';
import AdminArticlesModule from '@/components/admin/AdminArticlesModule';
import AdminCategoriesModule from '@/components/admin/AdminCategoriesModule';
import AdminReviewsModule from '@/components/admin/AdminReviewsModule';
import AdminSystemModule from '@/components/admin/AdminSystemModule';
import PublishStudio from '@/components/admin/PublishStudio';
import { BlogPost, CategoryInfo } from '@/types/blog';
import { CATEGORIES } from '@/lib/categories';
import { 
  Menu, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  PlusCircle, 
  Star,
  Activity
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Active module navigation
  const [activeModule, setActiveModule] = useState<AdminModule>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);
  const [loading, setLoading] = useState(true);

  // Editing state passed to Publish Studio
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Fetch all posts and categories
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, catRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/categories'),
      ]);

      const postsData = await postsRes.json();
      const catData = await catRes.json();

      if (postsData.success && Array.isArray(postsData.posts)) {
        setPosts(postsData.posts);
      }

      if (catData.success && Array.isArray(catData.categories) && catData.categories.length > 0) {
        setCategories(catData.categories);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle Edit Post from any module
  const handleEditPost = (postId: string) => {
    setEditingPostId(postId);
    setActiveModule('publish');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Create New Post
  const handleNewPost = () => {
    setEditingPostId(null);
    setActiveModule('publish');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    } finally {
      router.push('/admin/login');
    }
  };

  const avgScore = posts.length > 0
    ? (posts.reduce((acc, p) => acc + (p.verdictScore || 0), 0) / posts.length).toFixed(1)
    : '9.2';

  const MODULE_TITLES: Record<AdminModule, string> = {
    overview: 'Command Center',
    articles: 'All Articles & Posts',
    publish: editingPostId ? 'Edit Article Review' : 'Publishing Studio',
    categories: 'Category Manager',
    reviews: 'Reviews & Lab Matrix',
    system: 'System Diagnostics & Cache',
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-tech-950 text-slate-100 flex">
        {/* Sidebar Navigation */}
        <AdminSidebar
          activeModule={activeModule}
          onSelectModule={(m) => {
            if (m === 'publish' && activeModule !== 'publish') {
              setEditingPostId(null);
            }
            setActiveModule(m);
          }}
          postCount={posts.length}
          categoryCount={categories.length}
          avgScore={avgScore}
          mobileOpen={mobileSidebarOpen}
          onToggleMobile={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          onLogout={handleLogout}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:pl-72 flex flex-col min-w-0">
          
          {/* Top Sticky Header */}
          <header className="sticky top-0 z-30 bg-tech-950/80 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="p-2 rounded-xl bg-white/5 border border-slate-800 text-slate-400 hover:text-white lg:hidden"
                aria-label="Open sidebar"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-500 uppercase tracking-wider hidden sm:inline">
                    Admin /
                  </span>
                  <span className="text-sm sm:text-base font-black text-white">
                    {MODULE_TITLES[activeModule]}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              {activeModule !== 'publish' && (
                <button
                  onClick={handleNewPost}
                  className="px-3.5 py-1.5 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow font-mono flex items-center gap-1.5 hover:opacity-90 transition"
                >
                  <PlusCircle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Write Review</span>
                </button>
              )}

              <Link
                href="/"
                target="_blank"
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition flex items-center gap-1 border border-slate-800"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </header>

          {/* Module Content Container */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {activeModule === 'overview' && (
              <AdminOverviewModule
                posts={posts}
                categories={categories}
                onSelectModule={setActiveModule}
                onEditPost={handleEditPost}
              />
            )}

            {activeModule === 'articles' && (
              <AdminArticlesModule
                posts={posts}
                categories={categories}
                onEditPost={handleEditPost}
                onNewPost={handleNewPost}
                onRefresh={fetchData}
              />
            )}

            {activeModule === 'publish' && (
              <div className="space-y-4">
                {editingPostId && (
                  <div className="p-3.5 rounded-2xl bg-tech-cyan/10 border border-tech-cyan/30 text-xs font-mono text-tech-cyan flex items-center justify-between">
                    <span>Editing Article ID: {editingPostId}</span>
                    <button
                      onClick={() => setEditingPostId(null)}
                      className="px-2.5 py-1 rounded-lg bg-tech-cyan/20 hover:bg-tech-cyan/30 text-white transition"
                    >
                      Clear / Switch to New Post
                    </button>
                  </div>
                )}
                <PublishStudio
                  initialEditingId={editingPostId}
                  onPostSaved={fetchData}
                  hideTopNav={true}
                />
              </div>
            )}

            {activeModule === 'categories' && (
              <AdminCategoriesModule
                categories={categories}
                posts={posts}
                onRefresh={fetchData}
              />
            )}

            {activeModule === 'reviews' && (
              <AdminReviewsModule
                posts={posts}
                onEditPost={handleEditPost}
                onRefresh={fetchData}
              />
            )}

            {activeModule === 'system' && (
              <AdminSystemModule />
            )}
          </main>

        </div>
      </div>
    </AdminGuard>
  );
}
