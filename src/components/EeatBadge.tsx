'use client';

import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Award, 
  ChevronDown, 
  CheckCircle2, 
  Sparkles, 
  Microscope, 
  Gauge, 
  Scale, 
  ThumbsUp, 
  FileCheck 
} from 'lucide-react';
import { EeatAuditResult } from '@/lib/eeat';

interface Props {
  audit: EeatAuditResult;
  deviceTitle?: string;
}

export default function EeatBadge({ audit, deviceTitle }: Props) {
  const [expanded, setExpanded] = useState(false);

  const getGradeColor = (score: number) => {
    if (score >= 90) return 'text-tech-cyan border-tech-cyan/40 bg-tech-cyan/10';
    if (score >= 78) return 'text-tech-emerald border-tech-emerald/40 bg-tech-emerald/10';
    return 'text-amber-400 border-amber-400/40 bg-amber-400/10';
  };

  return (
    <div className="my-8 rounded-3xl bg-tech-900/90 border border-slate-800 p-6 shadow-xl backdrop-blur-md">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-tech-cyan/10 border border-tech-cyan/30 text-tech-cyan flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-tech-cyan">
                Google E-E-A-T Quality Audit
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-tech-emerald/15 text-tech-emerald border border-tech-emerald/30">
                Verified Authentic
              </span>
            </div>
            <h4 className="text-base font-bold text-white">
              Experience • Expertise • Authoritativeness • Trustworthiness
            </h4>
          </div>
        </div>

        {/* Big E-E-A-T Score Pill */}
        <div className="flex items-center gap-3 self-start sm:self-center">
          <div className="text-right font-mono">
            <div className="text-2xl font-black text-white flex items-center gap-1 justify-end">
              <span className="text-tech-cyan">{audit.overallScore}</span>
              <span className="text-xs text-slate-500 font-normal">/100</span>
            </div>
            <span className="text-[10px] text-tech-emerald font-semibold block -mt-1">
              {audit.grade.split(' ')[0]} Rating
            </span>
          </div>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition border border-slate-700"
            title="Toggle E-E-A-T Verification Details"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4 Pillars Progress Meters */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 mt-4 border-t border-slate-800/80">
        <div className="p-3 rounded-xl bg-tech-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Microscope className="w-3 h-3 text-tech-cyan" /> Experience</span>
            <span className="font-bold text-white">{audit.experienceScore}/25</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-tech-cyan rounded-full" style={{ width: `${(audit.experienceScore / 25) * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Hands-on testing</span>
        </div>

        <div className="p-3 rounded-xl bg-tech-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Gauge className="w-3 h-3 text-tech-emerald" /> Expertise</span>
            <span className="font-bold text-white">{audit.expertiseScore}/25</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-tech-emerald rounded-full" style={{ width: `${(audit.expertiseScore / 25) * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Lab benchmarks</span>
        </div>

        <div className="p-3 rounded-xl bg-tech-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1"><Scale className="w-3 h-3 text-tech-violet" /> Authority</span>
            <span className="font-bold text-white">{audit.authorityScore}/25</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-tech-violet rounded-full" style={{ width: `${(audit.authorityScore / 25) * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Rival comparisons</span>
        </div>

        <div className="p-3 rounded-xl bg-tech-950/70 border border-slate-800">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1">
            <span className="flex items-center gap-1"><ThumbsUp className="w-3 h-3 text-amber-400" /> Trust</span>
            <span className="font-bold text-white">{audit.trustScore}/25</span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div className="h-full bg-amber-400 rounded-full" style={{ width: `${(audit.trustScore / 25) * 100}%` }} />
          </div>
          <span className="text-[10px] text-slate-500 font-mono mt-1 block">Pros & Cons balance</span>
        </div>
      </div>

      {/* Expanded Audit Report */}
      {expanded && (
        <div className="pt-6 mt-6 border-t border-slate-800 space-y-4 text-xs font-mono">
          <div className="space-y-2">
            <h5 className="font-bold text-white uppercase tracking-wider text-xs">
              Audit Breakdown & Evidence:
            </h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {audit.metrics.map((m, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-tech-950/60 border border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-200">{m.label}</span>
                    <span className={m.passed ? 'text-tech-emerald' : 'text-amber-400'}>
                      {m.score}/25 pts
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans leading-relaxed">
                    {m.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {audit.keyStrengths.length > 0 && (
            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-1">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                ✓ Verified Hardware Trust Factors:
              </span>
              <ul className="space-y-1 text-slate-300 font-sans text-xs pl-2">
                {audit.keyStrengths.map((str, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
