'use client';

import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, Shield } from 'lucide-react';

export default function NewsletterBox() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSubscribed(true);
  };

  return (
    <div className="relative rounded-3xl bg-gradient-to-br from-tech-900 via-tech-950 to-tech-900 border border-tech-cyan/30 p-8 sm:p-12 overflow-hidden shadow-glow my-16">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-tech-cyan/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-tech-emerald/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-2xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider mb-4 bg-tech-cyan/10 border border-tech-cyan/30 text-tech-cyan">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GenZ Time Intelligence Dispatch</span>
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight mb-3">
          Never Miss a Breakthrough Tech Gadget
        </h2>

        <p className="text-sm sm:text-base text-slate-300 mb-8 leading-relaxed">
          Join 45,000+ engineers, creators, and early adopters receiving our Sunday gadget teardowns, lab benchmark leaks, and exclusive hardware buyer guides.
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-tech-emerald/15 border border-tech-emerald/40 text-tech-emerald font-medium">
            <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
            <span>Welcome to GenZ Time Dispatch! Verification email is on its way.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <div className="relative flex-1">
              <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="w-full pl-11 pr-4 py-3.5 rounded-xl bg-tech-950/80 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-tech-cyan focus:ring-1 focus:ring-tech-cyan"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3.5 rounded-xl font-bold text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald text-sm hover:opacity-90 transition shadow-glow whitespace-nowrap active:scale-95"
            >
              Subscribe Free
            </button>
          </form>
        )}

        <div className="flex items-center justify-center gap-4 text-xs text-slate-500 mt-5 font-mono">
          <span className="flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-tech-cyan" /> 0% Spam Guarantee
          </span>
          <span>•</span>
          <span>Unsubscribe Anytime</span>
        </div>
      </div>
    </div>
  );
}
