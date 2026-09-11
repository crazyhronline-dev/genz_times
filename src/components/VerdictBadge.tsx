import React from 'react';
import { Award, Star, CheckCircle, Sparkles } from 'lucide-react';

interface Props {
  score: number; // e.g. 9.5
  summary?: string;
  gadgetName?: string;
}

export default function VerdictBadge({ score, summary, gadgetName }: Props) {
  const getVerdictLabel = (val: number) => {
    if (val >= 9.2) return { text: "Editor's Choice", color: 'from-tech-cyan to-tech-emerald', border: 'border-tech-cyan/40', bg: 'bg-tech-cyan/10' };
    if (val >= 8.5) return { text: 'Highly Recommended', color: 'from-tech-emerald to-teal-500', border: 'border-tech-emerald/40', bg: 'bg-tech-emerald/10' };
    if (val >= 7.5) return { text: 'Recommended', color: 'from-blue-400 to-indigo-500', border: 'border-blue-400/40', bg: 'bg-blue-400/10' };
    return { text: 'Niche / Mixed Verdict', color: 'from-amber-400 to-orange-500', border: 'border-amber-400/40', bg: 'bg-amber-400/10' };
  };

  const verdict = getVerdictLabel(score);

  return (
    <div className="my-8 rounded-2xl bg-tech-900 border border-slate-700/80 p-6 md:p-8 relative overflow-hidden shadow-glow">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-tech-cyan/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        {/* Left: Summary & Badge */}
        <div className="flex-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-semibold uppercase tracking-wider mb-3 bg-white/5 border border-white/10 text-white">
            <Award className="w-3.5 h-3.5 text-tech-cyan" />
            <span>GenZ Time Lab Verdict</span>
          </div>

          <h3 className="text-xl md:text-2xl font-black text-white mb-2">
            {verdict.text}
          </h3>

          {summary && (
            <p className="text-sm md:text-base text-slate-300 leading-relaxed max-w-2xl">
              {summary}
            </p>
          )}

          {gadgetName && (
            <p className="text-xs text-slate-400 mt-3 font-mono">
              Tested independently by GenZ Time Editorial Lab
            </p>
          )}
        </div>

        {/* Right: Big Score Card */}
        <div className="flex flex-col items-center justify-center p-5 rounded-2xl bg-tech-950 border border-slate-800 shadow-inner flex-shrink-0 min-w-[150px] text-center">
          <div className="text-4xl md:text-5xl font-black font-mono tracking-tighter bg-gradient-to-r from-tech-cyan via-teal-300 to-tech-emerald bg-clip-text text-transparent">
            {score.toFixed(1)}
          </div>
          <div className="text-xs font-mono text-slate-400 uppercase tracking-widest mt-1">
            Out of 10.0
          </div>
          <div className="flex items-center gap-0.5 mt-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3.5 h-3.5 ${
                  i < Math.round(score / 2)
                    ? 'text-tech-cyan fill-tech-cyan'
                    : 'text-slate-700'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
