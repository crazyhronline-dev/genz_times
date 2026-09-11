'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { 
  Lock, 
  Key, 
  ShieldCheck, 
  User, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import { ADMIN_CREDENTIALS, AUTH_STORAGE_KEY } from '@/lib/auth';

interface Props {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check session on mount
    fetch('/api/auth/check')
      .then((r) => r.json())
      .then((data) => {
        setIsAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, []);

  const handleLogin = async (u = username, p = password) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: u, password: p }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem(AUTH_STORAGE_KEY, 'true');
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (e) {
      setError('Connection failed. Please check network.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoAccess = () => {
    setUsername(ADMIN_CREDENTIALS.username);
    setPassword(ADMIN_CREDENTIALS.password);
    handleLogin(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);
  };

  if (isAuthenticated === null) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-tech-cyan border-t-transparent animate-spin" />
          <span className="text-xs font-mono text-slate-400">Verifying Admin Access...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto px-4 py-16">
        <div className="rounded-3xl bg-tech-900 border border-slate-700/80 p-8 shadow-glow text-center space-y-6">
          <div className="flex justify-center">
            <Logo size="md" showTagline={false} linkToHome={false} />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
            <Lock className="w-3.5 h-3.5" />
            <span>Admin Authorization Required</span>
          </div>

          <p className="text-xs text-slate-400 font-mono">
            This area is restricted to GenZ Time editorial staff for publishing and hardware management.
          </p>

          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLogin();
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-tech-cyan"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Admin Password / Key
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-tech-cyan"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition font-mono flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? 'Verifying...' : 'Unlock Admin Studio'}</span>
            </button>
          </form>

          <div className="pt-3 border-t border-slate-800 space-y-3">
            <button
              type="button"
              onClick={handleQuickDemoAccess}
              className="w-full py-2.5 px-3 rounded-xl bg-tech-cyan/10 hover:bg-tech-cyan/20 border border-tech-cyan/30 text-tech-cyan text-xs font-mono font-semibold transition flex items-center justify-center gap-2"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>⚡ 1-Click Instant Unlock (Admin Demo)</span>
            </button>

            <div className="p-3 rounded-xl bg-tech-950/90 border border-slate-800 text-[11px] font-mono text-slate-400 text-left space-y-1">
              <span className="text-slate-300 font-bold block mb-1">Access Credentials:</span>
              <div className="flex justify-between">
                <span>User:</span>
                <span className="text-tech-cyan">admin</span>
              </div>
              <div className="flex justify-between">
                <span>Pass:</span>
                <span className="text-tech-emerald">genztime2026</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
