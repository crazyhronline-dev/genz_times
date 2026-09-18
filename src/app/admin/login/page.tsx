'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Logo from '@/components/Logo';
import { 
  Lock, 
  ShieldCheck, 
  KeyRound, 
  User, 
  Eye, 
  EyeOff, 
  AlertCircle, 
  CheckCircle2,
  Key
} from 'lucide-react';
import { AUTH_STORAGE_KEY } from '@/lib/auth';

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/admin';

  const [mode, setMode] = useState<'pin' | 'staff'>('pin');
  const [pin, setPin] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [existingUser, setExistingUser] = useState<{ username: string; name: string; role: string } | null>(null);

  // Check if session already exists
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

  const handleLogin = async (payload: { pin?: string; username?: string; password?: string }) => {
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
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
        }, 500);
      } else {
        setError(data.error || 'Authentication failed. Please verify credentials.');
      }
    } catch (err) {
      setError('Connection error while authenticating. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onPinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin.trim()) {
      setError('Please enter your 6-digit Admin Security PIN');
      return;
    }
    handleLogin({ pin: pin.trim() });
  };

  const onStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('Please enter both username and password');
      return;
    }
    handleLogin({ username: username.trim(), password: password.trim() });
  };

  return (
    <div className="w-full max-w-md space-y-8">
      {/* Header Branding */}
      <div className="text-center space-y-3">
        <div className="flex justify-center mb-2">
          <Logo size="lg" showTagline={false} linkToHome={false} />
        </div>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Command Portal</span>
        </div>
        <p className="text-xs text-slate-400 font-mono">
          Enter authorized 6-digit security PIN to unlock editorial dashboard
        </p>
      </div>

      {/* Login Card */}
      <div className="relative rounded-3xl bg-tech-900/90 border border-slate-700/80 p-6 sm:p-8 shadow-glow backdrop-blur-xl">
        {/* Ambient light */}
        <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 bg-tech-cyan/10 rounded-full blur-2xl pointer-events-none" />

        {success ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-tech-emerald/20 border border-tech-emerald/40 text-tech-emerald flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white">Access Authorized</h3>
            <p className="text-xs font-mono text-slate-400">
              Session authenticated. Launching editorial workspace...
            </p>
          </div>
        ) : (
          <div className="space-y-6">
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
                  className="px-3 py-1.5 rounded-xl bg-tech-cyan text-tech-950 font-bold text-xs shrink-0 shadow-glow hover:opacity-90 transition"
                >
                  Open Dashboard →
                </button>
              </div>
            )}

            {/* Mode Switcher Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-tech-950 border border-slate-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => {
                  setMode('pin');
                  setError('');
                }}
                className={`py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  mode === 'pin'
                    ? 'bg-tech-cyan text-tech-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Admin PIN</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setMode('staff');
                  setError('');
                }}
                className={`py-2 px-3 rounded-lg font-bold transition flex items-center justify-center gap-1.5 ${
                  mode === 'staff'
                    ? 'bg-tech-cyan text-tech-950 shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Staff Account</span>
              </button>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Mode 1: 6-Digit Admin PIN Login */}
            {mode === 'pin' ? (
              <form onSubmit={onPinSubmit} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                      Security PIN Code
                    </label>
                    <span className="text-[10px] font-mono text-slate-500">
                      6 Digits Required
                    </span>
                  </div>

                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-tech-cyan absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      autoFocus
                      required
                      maxLength={6}
                      value={pin}
                      onChange={(e) => {
                        const val = e.target.value.replace(/[^0-9]/g, '');
                        setPin(val);
                      }}
                      placeholder="••••••"
                      className="w-full pl-10 pr-10 py-3.5 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-600 text-center tracking-[0.4em] text-lg font-mono focus:outline-none focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                      aria-label={showPassword ? 'Hide PIN' : 'Show PIN'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || pin.length < 6}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 font-mono"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'Verifying PIN...' : 'Unlock Admin Dashboard'}</span>
                </button>
              </form>
            ) : (
              /* Mode 2: Staff Username & Password Login */
              <form onSubmit={onStaffSubmit} className="space-y-4">
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
                      placeholder="Enter assigned username"
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-tech-cyan font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Account Password
                  </label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter password"
                      className="w-full pl-10 pr-10 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-tech-cyan font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 px-4 rounded-xl font-bold text-sm text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50 font-mono"
                >
                  <Lock className="w-4 h-4" />
                  <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
                </button>
              </form>
            )}

            <div className="pt-2 text-center">
              <span className="text-[11px] font-mono text-slate-500">
                Authorized Editorial Access Only • GenZ Time
              </span>
            </div>
          </div>
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
