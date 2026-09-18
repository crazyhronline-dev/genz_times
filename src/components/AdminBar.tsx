'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, PlusCircle, LogOut, LayoutDashboard, ExternalLink } from 'lucide-react';
import { AUTH_STORAGE_KEY } from '@/lib/auth';

export default function AdminBar() {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check auth cookie/session via API
    fetch('/api/auth/check')
      .then((r) => r.json())
      .then((data) => {
        setIsAdmin(Boolean(data.authenticated));
      })
      .catch(() => setIsAdmin(false));
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setIsAdmin(false);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAdmin) return null;

  return (
    <div className="bg-tech-950 border-b border-tech-cyan/30 text-xs font-mono py-1.5 px-4 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        
        {/* Left: Admin Status */}
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-tech-emerald opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-tech-emerald"></span>
          </span>
          <span className="text-tech-cyan font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Active:</span>
          </span>
          <span className="text-white">Sahil (Founder & Admin)</span>
        </div>

        {/* Right: Quick Actions & Logout */}
        <div className="flex items-center gap-3">
          <Link
            href="/admin"
            className="text-slate-300 hover:text-tech-cyan transition flex items-center gap-1"
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            <span>Dashboard</span>
          </Link>

          <Link
            href="/publish"
            className="text-slate-300 hover:text-tech-cyan transition flex items-center gap-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>New Review</span>
          </Link>

          <button
            onClick={handleLogout}
            className="text-rose-400 hover:text-rose-300 transition flex items-center gap-1 pl-2 border-l border-slate-700"
            title="Log Out of Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}
