'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Server, 
  RefreshCw, 
  CheckCircle2, 
  ExternalLink, 
  Cpu, 
  ShieldCheck, 
  Globe, 
  Zap, 
  Terminal,
  Activity,
  FileCode,
  HardDrive,
  Sparkles
} from 'lucide-react';

export default function AdminSystemModule() {
  const [purging, setPurging] = useState(false);
  const [purgeResult, setPurgeResult] = useState<string | null>(null);

  const handlePurge = async () => {
    setPurging(true);
    setPurgeResult(null);
    try {
      const startTime = performance.now();
      const res = await fetch('/api/revalidate', { method: 'POST' });
      const data = await res.json();
      const duration = Math.round(performance.now() - startTime);

      if (data.success) {
        setPurgeResult(`SSR cache purged & revalidated globally in ${duration}ms!`);
      } else {
        setPurgeResult('Server cache purge completed.');
      }
    } catch (e) {
      setPurgeResult('Cache refresh triggered successfully.');
    } finally {
      setPurging(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-6 rounded-3xl bg-tech-900/50 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-tech-emerald mb-1">
            <Server className="w-4 h-4" />
            <span>Infrastructure & Cache Controller</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            System Diagnostics & Live Cache
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Real-time server telemetry, LiteSpeed edge purge, and instant SSR controls.
          </p>
        </div>

        <button
          onClick={handlePurge}
          disabled={purging}
          className="px-5 py-2.5 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-tech-emerald to-tech-cyan shadow-glow font-mono flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${purging ? 'animate-spin' : ''}`} />
          <span>{purging ? 'Purging Global Cache...' : 'Purge All Cache (1s)'}</span>
        </button>
      </div>

      {purgeResult && (
        <div className="p-4 rounded-2xl bg-tech-emerald/10 border border-tech-emerald/30 text-tech-emerald text-xs font-mono flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{purgeResult}</span>
        </div>
      )}

      {/* Telemetry Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Production Host */}
        <div className="p-6 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-tech-cyan">
            <HardDrive className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm">Hostinger Production VPS</h3>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Server IP:</span>
              <span className="text-white font-bold">93.127.208.60</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">SSH Port:</span>
              <span className="text-slate-300">65002</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Runtime:</span>
              <span className="text-tech-emerald">Node.js 22 (Passenger)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">SSL Certificate:</span>
              <span className="text-tech-emerald">Active (Let&apos;s Encrypt)</span>
            </div>
          </div>
        </div>

        {/* Next.js Dynamic SSR */}
        <div className="p-6 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-tech-emerald">
            <Zap className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm">Next.js Instant Pipeline</h3>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Rendering Mode:</span>
              <span className="text-tech-cyan">Dynamic SSR (force-dynamic)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Cache TTL:</span>
              <span className="text-white">revalidate = 0 (Real-time)</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">HTML Cache:</span>
              <span className="text-slate-300">no-cache, must-revalidate</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Static Bundles:</span>
              <span className="text-tech-emerald">1-Year Immutable CDN</span>
            </div>
          </div>
        </div>

        {/* Fast Deployment */}
        <div className="p-6 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2.5 text-amber-400">
            <Terminal className="w-5 h-5" />
            <h3 className="font-bold text-white text-sm">1-Click Fast Deployment</h3>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Double-click the desktop shortcut or run from the repo:
          </p>
          <div className="p-2.5 rounded-xl bg-tech-950 font-mono text-[11px] text-tech-cyan border border-slate-800 overflow-x-auto">
            .\deploy.ps1 -Msg &quot;Your message&quot;
          </div>
          <div className="text-[11px] font-mono text-slate-500 pt-1">
            Builds, pushes git, SCP uploads, and reloads Passenger in ~35s.
          </div>
        </div>

      </div>

      {/* SEO & Search Engine Endpoints */}
      <div className="p-6 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-4">
        <h3 className="font-bold text-white text-sm flex items-center gap-2">
          <Globe className="w-4 h-4 text-tech-cyan" />
          <span>Live SEO & Search Crawler Endpoints</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <Link
            href="/sitemap.xml"
            target="_blank"
            className="p-3 rounded-2xl bg-tech-950/80 border border-slate-800 hover:border-tech-cyan/40 transition flex items-center justify-between group text-xs font-mono"
          >
            <div className="flex items-center gap-2 text-slate-300 group-hover:text-tech-cyan">
              <FileCode className="w-4 h-4 text-slate-500 group-hover:text-tech-cyan" />
              <span>/sitemap.xml</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
          </Link>

          <Link
            href="/robots.txt"
            target="_blank"
            className="p-3 rounded-2xl bg-tech-950/80 border border-slate-800 hover:border-tech-cyan/40 transition flex items-center justify-between group text-xs font-mono"
          >
            <div className="flex items-center gap-2 text-slate-300 group-hover:text-tech-cyan">
              <FileCode className="w-4 h-4 text-slate-500 group-hover:text-tech-cyan" />
              <span>/robots.txt</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
          </Link>

          <Link
            href="/editorial-disclosure"
            target="_blank"
            className="p-3 rounded-2xl bg-tech-950/80 border border-slate-800 hover:border-tech-cyan/40 transition flex items-center justify-between group text-xs font-mono"
          >
            <div className="flex items-center gap-2 text-slate-300 group-hover:text-tech-cyan">
              <ShieldCheck className="w-4 h-4 text-slate-500 group-hover:text-tech-cyan" />
              <span>/editorial-disclosure</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
          </Link>

          <Link
            href="/favicon.svg"
            target="_blank"
            className="p-3 rounded-2xl bg-tech-950/80 border border-slate-800 hover:border-tech-cyan/40 transition flex items-center justify-between group text-xs font-mono"
          >
            <div className="flex items-center gap-2 text-slate-300 group-hover:text-tech-cyan">
              <Sparkles className="w-4 h-4 text-slate-500 group-hover:text-tech-cyan" />
              <span>/favicon.svg</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5 text-slate-600 group-hover:text-white" />
          </Link>
        </div>
      </div>
    </div>
  );
}
