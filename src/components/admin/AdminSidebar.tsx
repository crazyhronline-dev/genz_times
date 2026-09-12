'use client';

import React from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  FolderTree, 
  Star, 
  Server, 
  ExternalLink, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Sparkles,
  ChevronRight
} from 'lucide-react';

export type AdminModule = 'overview' | 'articles' | 'publish' | 'categories' | 'reviews' | 'system';

interface AdminSidebarProps {
  activeModule: AdminModule;
  onSelectModule: (module: AdminModule) => void;
  postCount: number;
  categoryCount: number;
  avgScore: string;
  mobileOpen: boolean;
  onToggleMobile: () => void;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeModule,
  onSelectModule,
  postCount,
  categoryCount,
  avgScore,
  mobileOpen,
  onToggleMobile,
  onLogout,
}: AdminSidebarProps) {
  const navItems = [
    {
      id: 'overview' as AdminModule,
      label: 'Command Center',
      description: 'Analytics & telemetry',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'articles' as AdminModule,
      label: 'All Articles',
      description: 'Browse, edit & delete posts',
      icon: FileText,
      badge: `${postCount}`,
    },
    {
      id: 'publish' as AdminModule,
      label: 'Publish Studio',
      description: 'Write reviews & AI SEO',
      icon: PlusCircle,
      badge: 'Studio',
      badgeColor: 'bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/40',
    },
    {
      id: 'categories' as AdminModule,
      label: 'Category Manager',
      description: 'Add, edit & delete sectors',
      icon: FolderTree,
      badge: `${categoryCount}`,
    },
    {
      id: 'reviews' as AdminModule,
      label: 'Reviews & Lab Scores',
      description: 'Benchmarks & verdict ratings',
      icon: Star,
      badge: `${avgScore}★`,
      badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-400/40',
    },
    {
      id: 'system' as AdminModule,
      label: 'System & Live Cache',
      description: 'LiteSpeed & SSR purge',
      icon: Server,
      badge: '93.127...',
      badgeColor: 'bg-tech-emerald/20 text-tech-emerald border border-tech-emerald/40',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={onToggleMobile}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-tech-950/95 backdrop-blur-xl border-r border-slate-800 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Top Branding */}
        <div>
          <div className="p-5 border-b border-slate-800/80 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-tech-cyan to-tech-emerald flex items-center justify-center font-black text-tech-950 font-mono text-sm shadow-glow group-hover:scale-105 transition">
                GZ
              </div>
              <div>
                <span className="font-mono text-sm font-black tracking-tight text-white block">
                  GenZ Time
                </span>
                <span className="text-[10px] font-mono text-tech-cyan tracking-wider uppercase block">
                  Admin Command
                </span>
              </div>
            </Link>

            {/* Close button on mobile */}
            <button
              onClick={onToggleMobile}
              className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white lg:hidden"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Live Node Status Pill */}
          <div className="px-5 py-3 border-b border-slate-800/50 bg-tech-900/30">
            <div className="flex items-center justify-between text-[11px] font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tech-emerald opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-tech-emerald"></span>
                </span>
                <span>Node.js / LiteSpeed</span>
              </div>
              <span className="text-tech-cyan font-bold">ONLINE</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1">
            <div className="px-3 pt-2 pb-1 text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold">
              Management Modules
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeModule === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectModule(item.id);
                    if (mobileOpen) onToggleMobile();
                  }}
                  className={`w-full text-left px-3 py-2.5 rounded-xl transition-all duration-200 flex items-center justify-between group ${
                    isActive
                      ? 'bg-tech-cyan/15 text-white border border-tech-cyan/40 shadow-glow'
                      : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-tech-cyan text-tech-950 font-bold'
                          : 'bg-tech-900/80 text-slate-400 group-hover:text-tech-cyan group-hover:bg-tech-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className={`text-xs font-bold block ${isActive ? 'text-tech-cyan' : 'text-slate-200'}`}>
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {item.description}
                      </span>
                    </div>
                  </div>

                  {item.badge && (
                    <span
                      className={`text-[10px] font-mono font-semibold px-2 py-0.5 rounded-md ${
                        item.badgeColor || 'bg-white/10 text-slate-300'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User & Footer Actions */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          <Link
            href="/"
            target="_blank"
            className="w-full px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white text-xs font-mono transition flex items-center justify-between border border-slate-800"
          >
            <span className="flex items-center gap-2">
              <ExternalLink className="w-3.5 h-3.5 text-tech-cyan" />
              <span>View Public Site</span>
            </span>
            <span className="text-[10px] text-slate-500">Live ↗</span>
          </Link>

          <button
            onClick={onLogout}
            className="w-full px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 text-xs font-mono transition flex items-center justify-between border border-rose-500/20"
          >
            <span className="flex items-center gap-2">
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out Session</span>
            </span>
            <span className="text-[10px] text-rose-500">End</span>
          </button>

          <div className="px-3 pt-2 text-[10px] font-mono text-slate-500 flex items-center justify-between">
            <span>GenZ Time CMS v2.4</span>
            <span className="text-tech-emerald">SSR Dynamic</span>
          </div>
        </div>
      </aside>
    </>
  );
}
