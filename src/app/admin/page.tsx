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
import AdminEnquiriesModule from '@/components/admin/AdminEnquiriesModule';
import AdminTeamModule from '@/components/admin/AdminTeamModule';
import AdminDealsModule from '@/components/admin/AdminDealsModule';
import PublishStudio from '@/components/admin/PublishStudio';
import { BlogPost, CategoryInfo } from '@/types/blog';
import { ContactEnquiry } from '@/types/enquiry';
import { PromoDeal } from '@/types/deal';
import { UserSession } from '@/types/user';
import { hasModuleAccess, ROLE_CONFIG } from '@/lib/auth';
import { CATEGORIES } from '@/lib/categories';
import { 
  Menu, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  RefreshCw, 
  PlusCircle, 
  Star,
  Activity,
  UserCheck
} from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();

  // Active module navigation
  const [activeModule, setActiveModule] = useState<AdminModule>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Data state
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<CategoryInfo[]>(CATEGORIES);
  const [enquiries, setEnquiries] = useState<ContactEnquiry[]>([]);
  const [deals, setDeals] = useState<PromoDeal[]>([]);
  const [unreadEnquiryCount, setUnreadEnquiryCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        const s = localStorage.getItem('genz_current_user');
        return s ? JSON.parse(s) : null;
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);
  const [switchingRole, setSwitchingRole] = useState(false);

  // Editing state passed to Publish Studio
  const [editingPostId, setEditingPostId] = useState<string | null>(null);

  // Fetch all posts, categories, enquiries, deals, and user session
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [postsRes, catRes, enqRes, authRes, dealsRes] = await Promise.all([
        fetch('/api/posts'),
        fetch('/api/categories'),
        fetch('/api/enquiries'),
        fetch('/api/auth/check'),
        fetch('/api/deals'),
      ]);

      const postsData = await postsRes.json();
      const catData = await catRes.json();
      const enqData = await enqRes.json();
      const authData = await authRes.json();
      const dealsData = await dealsRes.json().catch(() => ({}));

      if (postsData.success && Array.isArray(postsData.posts)) {
        setPosts(postsData.posts);
      }

      if (catData.success && Array.isArray(catData.categories) && catData.categories.length > 0) {
        setCategories(catData.categories);
      }

      if (enqData.success && Array.isArray(enqData.enquiries)) {
        setEnquiries(enqData.enquiries);
        setUnreadEnquiryCount(enqData.unreadCount ?? 0);
      }

      if (dealsData.success && Array.isArray(dealsData.deals)) {
        setDeals(dealsData.deals);
      }

      if (authData.authenticated && authData.user) {
        setCurrentUser(authData.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('genz_current_user', JSON.stringify(authData.user));
        }
        // Safety guard: if current active module is restricted for this user, redirect to overview
        if (!hasModuleAccess(authData.user.role, activeModule)) {
          setActiveModule('overview');
        }
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  }, [activeModule]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Instant Role Switcher
  const handleRoleSwitch = async (username: string, pass: string) => {
    setSwitchingRole(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pass }),
      });
      const data = await res.json();
      if (data.success && data.user) {
        setCurrentUser(data.user);
        if (typeof window !== 'undefined') {
          localStorage.setItem('genz_current_user', JSON.stringify(data.user));
        }
        if (!hasModuleAccess(data.user.role, activeModule)) {
          setActiveModule('overview');
        }
      }
    } catch (e) {
      console.error('Error switching role:', e);
    } finally {
      setSwitchingRole(false);
    }
  };

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

  // Handle Logout: land directly on /admin and show login gate
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem('genz_current_user');
      localStorage.removeItem('genz_time_admin_auth');
    }
    setCurrentUser(null);
    window.location.href = '/admin';
  };

  const avgScore = posts.length > 0
    ? (posts.reduce((acc, p) => acc + (p.verdictScore || 0), 0) / posts.length).toFixed(1)
    : '9.2';

  const MODULE_TITLES: Record<AdminModule, string> = {
    overview: 'Command Center',
    articles: 'All Articles & Posts',
    publish: editingPostId ? 'Edit Article Review' : 'Publishing Studio',
    categories: 'Category Manager',
    deals: 'Deals & Discount Coupons',
    reviews: 'Reviews & Lab Matrix',
    enquiries: 'Contact Inquiries & Inbox',
    team: 'Editorial Team & Access Roles',
    system: 'System Diagnostics & Cache',
  };

  const activeRole = currentUser?.role || 'author';

  const handleSelectModule = (m: AdminModule) => {
    if (!hasModuleAccess(activeRole, m)) {
      setActiveModule('overview');
      return;
    }
    if (m === 'publish' && activeModule !== 'publish') {
      setEditingPostId(null);
    }
    setActiveModule(m);
  };

  return (
    <AdminGuard onAuthSuccess={(user) => {
      setCurrentUser(user);
      if (!hasModuleAccess(user.role, activeModule)) {
        setActiveModule('overview');
      }
    }}>
      <div className="min-h-screen bg-tech-950 text-slate-100 flex">
        {/* Sidebar Navigation */}
        <AdminSidebar
          activeModule={activeModule}
          onSelectModule={handleSelectModule}
          postCount={posts.length}
          categoryCount={categories.length}
          avgScore={avgScore}
          unreadEnquiryCount={unreadEnquiryCount}
          dealsCount={deals.length}
          currentUser={currentUser}
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

          {/* Role-Based Access Live Simulator & Session Switcher */}
          <div className="bg-tech-950 border-b border-slate-800/80 px-4 sm:px-8 py-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2 min-w-0">
              <div className="flex items-center gap-1.5 shrink-0 text-slate-400">
                <UserCheck className="w-3.5 h-3.5 text-tech-cyan" />
                <span>Active Workspace:</span>
              </div>
              <span className="font-bold text-white truncate">{currentUser?.name || 'Staff User'}</span>
              <span className="text-slate-500 hidden sm:inline truncate">(@{currentUser?.username || 'user'})</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${ROLE_CONFIG[currentUser?.role || 'author']?.badgeColor}`}>
                {ROLE_CONFIG[currentUser?.role || 'author']?.label}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0 overflow-x-auto pb-0.5">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider font-bold mr-1">Switch Role:</span>
              <button
                onClick={() => handleRoleSwitch('admin', 'genztime2026')}
                disabled={switchingRole}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition whitespace-nowrap ${
                  currentUser?.role === 'admin'
                    ? 'bg-rose-500 text-white shadow-glow'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-slate-800'
                }`}
                title="Super Admin has access to all 8 modules including Team & System"
              >
                👑 Super Admin (8)
              </button>
              <button
                onClick={() => handleRoleSwitch('alex_reviewer', 'reviewer2026')}
                disabled={switchingRole}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition whitespace-nowrap ${
                  currentUser?.role === 'editor'
                    ? 'bg-tech-cyan text-tech-950 shadow-glow'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-slate-800'
                }`}
                title="Senior Editor has access to 5 modules (Overview, Articles, Publish, Reviews, Enquiries)"
              >
                ✒️ Senior Editor (5)
              </button>
              <button
                onClick={() => handleRoleSwitch('maya_writer', 'writer2026')}
                disabled={switchingRole}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition whitespace-nowrap ${
                  currentUser?.role === 'author'
                    ? 'bg-amber-400 text-slate-950 shadow-glow'
                    : 'bg-white/5 text-slate-400 hover:text-white border border-slate-800'
                }`}
                title="Staff Writer has access to 3 modules (Overview, Articles, Publish Studio)"
              >
                📝 Staff Writer (3)
              </button>
            </div>
          </div>

          {/* Module Content Container */}
          <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto">
            {activeModule === 'overview' && (
              <AdminOverviewModule
                posts={posts}
                categories={categories}
                unreadEnquiries={unreadEnquiryCount}
                dealsCount={deals.length}
                currentUserRole={activeRole}
                onSelectModule={handleSelectModule}
                onEditPost={handleEditPost}
              />
            )}

            {activeModule === 'articles' && (
              <AdminArticlesModule
                posts={posts}
                categories={categories}
                currentUserRole={activeRole}
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
              hasModuleAccess(activeRole, 'categories') ? (
                <AdminCategoriesModule
                  categories={categories}
                  posts={posts}
                  onRefresh={fetchData}
                />
              ) : (
                <div className="p-8 rounded-3xl bg-tech-900/40 border border-rose-500/30 text-center space-y-3 font-mono">
                  <span className="text-rose-400 font-bold text-sm block">🔒 Access Denied: Category Manager</span>
                  <p className="text-xs text-slate-400">Your role ({ROLE_CONFIG[activeRole]?.label}) is restricted from managing sectors.</p>
                  <button onClick={() => setActiveModule('overview')} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-tech-cyan text-xs">Return to Command Center</button>
                </div>
              )
            )}

            {activeModule === 'deals' && (
              hasModuleAccess(activeRole, 'deals') ? (
                <AdminDealsModule
                  deals={deals}
                  onRefresh={fetchData}
                />
              ) : (
                <div className="p-8 rounded-3xl bg-tech-900/40 border border-rose-500/30 text-center space-y-3 font-mono">
                  <span className="text-rose-400 font-bold text-sm block">🔒 Access Denied: Deals & Coupons</span>
                  <p className="text-xs text-slate-400">Your role ({ROLE_CONFIG[activeRole]?.label}) is restricted from managing promo deals and coupons.</p>
                  <button onClick={() => setActiveModule('overview')} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-tech-cyan text-xs">Return to Command Center</button>
                </div>
              )
            )}

            {activeModule === 'reviews' && (
              hasModuleAccess(activeRole, 'reviews') ? (
                <AdminReviewsModule
                  posts={posts}
                  onEditPost={handleEditPost}
                  onRefresh={fetchData}
                />
              ) : (
                <div className="p-8 rounded-3xl bg-tech-900/40 border border-rose-500/30 text-center space-y-3 font-mono">
                  <span className="text-rose-400 font-bold text-sm block">🔒 Access Denied: Reviews Matrix</span>
                  <p className="text-xs text-slate-400">Your role ({ROLE_CONFIG[activeRole]?.label}) does not have lab score reviewer clearance.</p>
                  <button onClick={() => setActiveModule('overview')} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-tech-cyan text-xs">Return to Command Center</button>
                </div>
              )
            )}

            {activeModule === 'enquiries' && (
              hasModuleAccess(activeRole, 'enquiries') ? (
                <AdminEnquiriesModule
                  enquiries={enquiries}
                  onRefresh={fetchData}
                />
              ) : (
                <div className="p-8 rounded-3xl bg-tech-900/40 border border-rose-500/30 text-center space-y-3 font-mono">
                  <span className="text-rose-400 font-bold text-sm block">🔒 Access Denied: Enquiries Inbox</span>
                  <p className="text-xs text-slate-400">Your role ({ROLE_CONFIG[activeRole]?.label}) cannot view contact form submissions.</p>
                  <button onClick={() => setActiveModule('overview')} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-tech-cyan text-xs">Return to Command Center</button>
                </div>
              )
            )}

            {activeModule === 'team' && (
              hasModuleAccess(activeRole, 'team') ? (
                <AdminTeamModule
                  currentUserRole={activeRole}
                  onRefresh={fetchData}
                />
              ) : (
                <div className="p-8 rounded-3xl bg-tech-900/40 border border-rose-500/30 text-center space-y-3 font-mono">
                  <span className="text-rose-400 font-bold text-sm block">🔒 Access Denied: Editorial Team</span>
                  <p className="text-xs text-slate-400">Only Super Admin accounts can manage team credentials and access permissions.</p>
                  <button onClick={() => setActiveModule('overview')} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-tech-cyan text-xs">Return to Command Center</button>
                </div>
              )
            )}

            {activeModule === 'system' && (
              hasModuleAccess(activeRole, 'system') ? (
                <AdminSystemModule />
              ) : (
                <div className="p-8 rounded-3xl bg-tech-900/40 border border-rose-500/30 text-center space-y-3 font-mono">
                  <span className="text-rose-400 font-bold text-sm block">🔒 Access Denied: System Diagnostics</span>
                  <p className="text-xs text-slate-400">Server diagnostics and cache control require Super Admin access.</p>
                  <button onClick={() => setActiveModule('overview')} className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-tech-cyan text-xs">Return to Command Center</button>
                </div>
              )
            )}
          </main>

        </div>
      </div>
    </AdminGuard>
  );
}
