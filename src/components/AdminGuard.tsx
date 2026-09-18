'use client';

import React, { useState, useEffect } from 'react';
import Logo from './Logo';
import { 
  Lock, 
  Key, 
  KeyRound,
  ShieldCheck, 
  User, 
  Eye,
  EyeOff,
  AlertCircle
} from 'lucide-react';
import { AUTH_STORAGE_KEY } from '@/lib/auth';
import { UserSession } from '@/types/user';

interface Props {
  children: React.ReactNode;
  onAuthSuccess?: (user: UserSession) => void;
}

export default function AdminGuard({ children, onAuthSuccess }: Props) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [mode, setMode] = useState<'pin' | 'staff'>('pin');
  const [pin, setPin] = useState('');
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
          if (onAuthSuccess) {
            onAuthSuccess(data.user);
          }
        }
        setIsAuthenticated(true);
      } else {
        setError(data.error || 'Authentication failed. Access denied.');
      }
    } catch (e) {
      setError('Connection error while authenticating.');
    } finally {
      setLoading(false);
    }
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

          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Authorization Required</span>
          </div>

          <div>
            <h2 className="text-xl font-black text-white tracking-tight">
              Sign In to Command Center
            </h2>
            <p className="text-xs text-slate-400 font-mono mt-1.5 leading-relaxed">
              Enter your 6-digit security PIN or staff credentials to proceed.
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-tech-950 border border-slate-800 text-xs font-mono text-left">
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
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-center gap-2 text-left">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {mode === 'pin' ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!pin.trim()) {
                  setError('Please enter your 6-digit PIN');
                  return;
                }
                handleLogin({ pin: pin.trim() });
              }}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  6-Digit Admin PIN
                </label>
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
                    className="w-full pl-10 pr-10 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-600 text-center tracking-[0.4em] text-lg font-mono focus:outline-none focus:border-tech-cyan"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || pin.length < 6}
                className="w-full py-3 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition font-mono flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{loading ? 'Verifying PIN...' : 'Unlock Command Center'}</span>
              </button>
            </form>
          ) : (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!username.trim() || !password.trim()) {
                  setError('Please enter both username and password');
                  return;
                }
                handleLogin({ username: username.trim(), password: password.trim() });
              }}
              className="space-y-4 text-left"
            >
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Staff Username
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-600 text-xs font-mono focus:outline-none focus:border-tech-cyan"
                    placeholder="Enter staff username"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-slate-400 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-600 text-xs font-mono focus:outline-none focus:border-tech-cyan"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition font-mono flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>{loading ? 'Verifying Credentials...' : 'Sign In'}</span>
              </button>
            </form>
          )}

          <div className="pt-2">
            <span className="text-[10px] font-mono text-slate-500">
              Authorized Personnel Only • GenZ Time
            </span>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
