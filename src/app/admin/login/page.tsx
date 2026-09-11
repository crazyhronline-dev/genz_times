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

  // Check if already logged in
  useEffect(() => {
    fetch('/api/auth/check')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated) {
          router.push(redirectUrl);
        }
      })
      .catch(() => {});
  }, [redirectUrl, router]);

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
        setSuccess(true);
        setTimeout(() => {
          router.push(redirectUrl);
        }, 800);
      } else {
        setError(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error while authenticating');
    } finally {
      setLoading(false);
    }
  };

  const handleOneClickLogin = () => {
    setUsername(ADMIN_CREDENTIALS.username);
    setPassword(ADMIN_CREDENTIALS.password);
    handleLogin(ADMIN_CREDENTIALS.username, ADMIN_CREDENTIALS.password);
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
          <span>Admin Authentication Portal</span>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Restricted access for publishing gadget reviews & lab benchmarks
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
              Welcome back, {ADMIN_CREDENTIALS.displayName}. Redirecting to Admin Studio...
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Username Input */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan font-mono"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Admin Passkey / Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password..."
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
              className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{loading ? 'Authenticating...' : 'Sign In as Admin'}</span>
            </button>

            {/* Instant Demo Login Button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={handleOneClickLogin}
                className="w-full py-2.5 px-3 rounded-xl bg-tech-cyan/10 hover:bg-tech-cyan/20 border border-tech-cyan/30 text-tech-cyan text-xs font-mono font-semibold transition flex items-center justify-center gap-2"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>⚡ 1-Click Instant Admin Access (Demo)</span>
              </button>
            </div>

            {/* Credentials reminder box */}
            <div className="p-3.5 rounded-2xl bg-tech-950/80 border border-slate-800 text-[11px] font-mono space-y-1 text-slate-400">
              <span className="text-slate-300 font-bold block mb-1">Default Admin Credentials:</span>
              <div className="flex justify-between">
                <span>Username:</span>
                <span className="text-tech-cyan font-bold">admin</span>
              </div>
              <div className="flex justify-between">
                <span>Password:</span>
                <span className="text-tech-emerald font-bold">genztime2026</span>
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
