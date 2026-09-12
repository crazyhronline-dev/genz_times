'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { 
  Lock, 
  ShieldCheck, 
  Key, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  Sparkles, 
  CheckCircle2 
} from 'lucide-react';
import { AUTH_STORAGE_KEY, ADMIN_CREDENTIALS } from '@/lib/auth';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [existingUser, setExistingUser] = useState<{ username: string; name: string; role: string } | null>(null);

  // Check if session exists to display switcher banner
  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.user) {
          setExistingUser(data.user);
        }
      })
      .catch(() => {});
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
        if (data.user) {
          localStorage.setItem('genz_current_user', JSON.stringify(data.user));
        }
        setSuccess(true);
        setTimeout(() => {
          router.push(redirectUrl);
        }, 600);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error while authenticating');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickRoleLogin = (u: string, p: string) => {
    setUsername(u);
    setPassword(p);
    handleLogin(u, p);
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header Branding */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <Logo size="lg" showTagline={false} linkToHome={false} />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Editorial Team Login</span>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Sign in to access your designated editorial role & permissions
        </p>
      </div>

      {/* Login Card */}
      <div className="relative rounded-3xl bg-tech-900/90 border border-slate-700/80 p-8 shadow-glow backdrop-blur-xl">
        {/* Ambient light */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-tech-cyan/10 rounded-full blur-2xl pointer-events-none" />

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-tech-emerald/20 border border-tech-emerald/40 text-tech-emerald flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Access Granted</h3>
            <p className="text-xs font-mono text-slate-400">
              Session authorized. Loading your custom editorial workspace...
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {existingUser && (
              <div className="p-3.5 rounded-2xl bg-tech-cyan/10 border border-tech-cyan/30 flex items-center justify-between text-xs font-mono">
                <div className="min-w-0 pr-2">
                  <span className="text-slate-400 block text-[10px] uppercase">Active Session:</span>
                  <span className="font-bold text-white block truncate">{existingUser.name}</span>
                  <span className="text-tech-cyan text-[10px] font-bold block uppercase">Role: {existingUser.role}</span>
                </div>
                <button
                  type="button"
                  onClick={() => router.push(redirectUrl)}
                  className="px-3 py-1.5 rounded-xl bg-tech-cyan text-tech-950 font-bold text-xs shrink-0 shadow-glow hover:opacity-90"
                >
                  Open Dashboard →
                </button>
              </div>
            )}

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Staff Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin, alex_reviewer, or maya_writer"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Staff Passkey / Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter staff password..."
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 font-mono"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In to Workspace'}</span>
            </button>

            {/* Instant Demo Role Login Switchers */}
            <div className="pt-3 border-t border-slate-800 space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 block font-bold">
                ⚡ 1-Click Role Login Test:
              </span>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickRoleLogin('admin', 'genztime2026')}
                  className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-400 text-[10px] font-mono transition text-center"
                >
                  <span className="font-bold block">👑 Admin</span>
                  <span className="text-[9px] text-slate-400 block">8 Modules</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickRoleLogin('alex_reviewer', 'reviewer2026')}
                  className="p-2 rounded-xl bg-tech-cyan/10 hover:bg-tech-cyan/20 border border-tech-cyan/30 text-tech-cyan text-[10px] font-mono transition text-center"
                >
                  <span className="font-bold block">✒️ Editor</span>
                  <span className="text-[9px] text-slate-400 block">5 Modules</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleQuickRoleLogin('maya_writer', 'writer2026')}
                  className="p-2 rounded-xl bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/30 text-amber-300 text-[10px] font-mono transition text-center"
                >
                  <span className="font-bold block">📝 Writer</span>
                  <span className="text-[9px] text-slate-400 block">3 Modules</span>
                </button>
              </div>
            </div>

            {/* Role Permissions Legend */}
            <div className="p-3 rounded-2xl bg-tech-950/80 border border-slate-800 text-[10px] font-mono space-y-1 text-slate-400">
              <span className="text-slate-300 font-bold block mb-0.5">Role Access Permissions:</span>
              <div className="flex justify-between">
                <span className="text-rose-400 font-semibold">Admin:</span>
                <span>All 8 modules (Team, System, Categories)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-tech-cyan font-semibold">Editor:</span>
                <span>5 modules (Articles, Reviews, Enquiries)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400 font-semibold">Writer:</span>
                <span>3 modules (Articles, Publish Studio)</span>
              </div>
            </div>

          </form>
        )}
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <Suspense fallback={
        <div className="text-center text-slate-400 font-mono text-xs">
          Loading portal...
        </div>
      }>
        <AdminLoginForm />
      </Suspense>
    </div>
  );
}
