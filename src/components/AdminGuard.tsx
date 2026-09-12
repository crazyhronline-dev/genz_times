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
  AlertCircle,
  Eye,
  EyeOff
} from 'lucide-react';
import { ADMIN_CREDENTIALS, AUTH_STORAGE_KEY } from '@/lib/auth';
import { UserSession } from '@/types/user';

interface Props {
  children: React.ReactNode;
  onAuthSuccess?: (user: UserSession) => void;
}

export default function AdminGuard({ children, onAuthSuccess }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check session on mount
    fetch('/api/auth/check')
      .then((r) => r.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          localStorage.setItem('genz_current_user', JSON.stringify(data.user));
          if (onAuthSuccess) {
            onAuthSuccess(data.user);
          }
        }
        setIsAuthenticated(Boolean(data.authenticated));
      })
      .catch(() => {
        setIsAuthenticated(false);
      });
  }, [onAuthSuccess]);

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
        if (data.user) {
          localStorage.setItem('genz_current_user', JSON.stringify(data.user));
          if (onAuthSuccess) {
            onAuthSuccess(data.user);
          }
        }
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
            <span>Editorial Staff Login</span>
          </div>

          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Sign In to Command Center
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1.5 leading-relaxed">
              Please log in with your assigned credentials to access your designated workspace (Super Admin, Senior Editor, or Staff Writer).
            </p>
          </div>

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
                Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-tech-cyan"
                  placeholder="admin, alex_reviewer, or maya_writer"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                Password / Key
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-tech-cyan"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition font-mono flex items-center justify-center gap-2"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{loading ? 'Verifying Credentials...' : 'Sign In to Workspace'}</span>
            </button>
          </form>

          {/* Role-Based Demo Switchers */}
          <div className="pt-3 border-t border-slate-800 space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
              ⚡ Quick Test Credentials (Select Role):
            </span>

            <div className="grid grid-cols-3 gap-2 text-left">
              <button
                type="button"
                onClick={() => {
                  setUsername('admin');
                  setPassword('genztime2026');
                  handleLogin('admin', 'genztime2026');
                }}
                className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-mono transition text-center"
              >
                <span className="font-bold block">👑 Admin</span>
                <span className="text-[9px] text-slate-400 block">All 8 modules</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUsername('alex_reviewer');
                  setPassword('reviewer2026');
                  handleLogin('alex_reviewer', 'reviewer2026');
                }}
                className="p-2 rounded-xl bg-tech-cyan/10 hover:bg-tech-cyan/20 border border-tech-cyan/30 text-tech-cyan text-[10px] font-mono transition text-center"
              >
                <span className="font-bold block">✒️ Editor</span>
                <span className="text-[9px] text-slate-400 block">Reviews & Inbox</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setUsername('maya_writer');
                  setPassword('writer2026');
                  handleLogin('maya_writer', 'writer2026');
                }}
                className="p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-mono transition text-center"
              >
                <span className="font-bold block">📝 Writer</span>
                <span className="text-[9px] text-slate-400 block">Publish Studio</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
