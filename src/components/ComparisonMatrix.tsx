'use client';

import React from 'react';
import { ComparedGadget } from '@/types/blog';
import { 
  Trophy, 
  Sparkles, 
  Cpu, 
  Check, 
  X, 
  Award, 
  Star, 
  Layers, 
  CheckCircle2, 
  AlertCircle,
  Zap,
  Scale
} from 'lucide-react';

interface ComparisonMatrixProps {
  products: ComparedGadget[];
  reviewTitle?: string;
}

const SPEC_ROWS: { key: keyof ComparedGadget['specs']; label: string; icon: string }[] = [
  { key: 'processor', label: 'Processor / SoC', icon: '⚡' },
  { key: 'display', label: 'Display & Refresh', icon: '📱' },
  { key: 'ram', label: 'Memory (RAM)', icon: '💾' },
  { key: 'storage', label: 'Storage', icon: '💽' },
  { key: 'battery', label: 'Battery & Charging', icon: '🔋' },
  { key: 'camera', label: 'Camera System', icon: '📷' },
  { key: 'os', label: 'Operating System', icon: '⚙️' },
  { key: 'weight', label: 'Weight & Chassis', icon: '⚖️' },
  { key: 'connectivity', label: 'Connectivity', icon: '📡' },
  { key: 'price', label: 'Retail Price', icon: '🏷️' },
];

export default function ComparisonMatrix({ products, reviewTitle }: ComparisonMatrixProps) {
  if (!products || products.length === 0) return null;

  // Find top scoring device as recommended pick
  const topProduct = [...products].sort((a, b) => (b.verdictScore || 0) - (a.verdictScore || 0))[0];

  const getBadgeStyle = (badge?: string) => {
    if (!badge) return 'bg-slate-800 text-slate-300 border-slate-700';
    const b = badge.toLowerCase();
    if (b.includes('winner') || b.includes('top') || b.includes('best overall')) {
      return 'bg-amber-400/15 text-amber-300 border-amber-400/40 shadow-glow';
    }
    if (b.includes('value') || b.includes('budget') || b.includes('price')) {
      return 'bg-tech-cyan/15 text-tech-cyan border-tech-cyan/40';
    }
    if (b.includes('runner') || b.includes('alternative')) {
      return 'bg-violet-400/15 text-violet-300 border-violet-400/40';
    }
    return 'bg-tech-emerald/15 text-tech-emerald border-tech-emerald/40';
  };

  return (
    <section className="my-12 space-y-8">
      {/* 1. Comparison Section Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-tech-950 via-tech-900 to-tech-950 border border-slate-800 shadow-glow relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-tech-cyan mb-2">
          <Scale className="w-4 h-4" />
          <span>Head-to-Head Comparison Matrix ({products.length} Devices)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mb-2">
          Comprehensive Shootout: {products.map((p) => p.name).join(' vs ')}
        </h2>
        <p className="text-sm text-slate-400 max-w-2xl leading-relaxed">
          Our hardware testing lab evaluated and benchmarked each device under identical thermal, performance, and battery load scenarios. Below is the side-by-side breakdown.
        </p>
      </div>

      {/* 2. Side-by-Side Verdict Summary Cards */}
      <div className={`grid grid-cols-1 md:grid-cols-${Math.min(products.length, 3)} gap-5`}>
        {products.map((product, idx) => {
          const isWinner = topProduct && topProduct.id === product.id;
          return (
            <div
              key={product.id || idx}
              className={`p-6 rounded-3xl bg-tech-900/50 border transition duration-300 flex flex-col justify-between relative shadow-lg ${
                isWinner
                  ? 'border-amber-400/50 shadow-amber-500/10 ring-1 ring-amber-400/30'
                  : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                {/* Badge / Distinction */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    Device #{idx + 1}
                  </span>
                  {product.badge ? (
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border flex items-center gap-1 ${getBadgeStyle(product.badge)}`}>
                      {isWinner ? <Trophy className="w-3 h-3 text-amber-400" /> : <Award className="w-3 h-3" />}
                      <span>{product.badge}</span>
                    </span>
                  ) : isWinner ? (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold border border-amber-400/40 bg-amber-400/10 text-amber-300 flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      <span>Highest Score</span>
                    </span>
                  ) : null}
                </div>

                {/* Device Title */}
                <h3 className="text-xl font-bold text-white mb-2 tracking-tight">
                  {product.name || `Device ${idx + 1}`}
                </h3>

                {/* Score & Meter */}
                <div className="my-4 p-4 rounded-2xl bg-tech-950 border border-slate-800 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-slate-400 block">Verdict Rating</span>
                    <span className="text-3xl font-black font-mono text-amber-300">
                      {(product.verdictScore || 0).toFixed(1)}
                      <span className="text-sm text-slate-500 font-normal"> / 10</span>
                    </span>
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400 font-bold">
                    <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                  </div>
                </div>

                {/* Verdict Summary */}
                {product.verdictSummary && (
                  <p className="text-xs text-slate-300 leading-relaxed italic line-clamp-3">
                    &quot;{product.verdictSummary}&quot;
                  </p>
                )}
              </div>

              {/* Price footer if provided */}
              {product.specs?.price && (
                <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-400">Tested Price:</span>
                  <span className="font-bold text-tech-cyan">{product.specs.price}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Detailed Specifications Shootout Table */}
      <div className="rounded-3xl bg-tech-900/40 border border-slate-800 overflow-hidden shadow-xl">
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-white uppercase tracking-wider">
            <Cpu className="w-4 h-4 text-tech-cyan" />
            <span>Specifications Shootout Matrix</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            Scroll horizontally on smaller screens →
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-tech-950 border-b border-slate-800 text-slate-400 font-mono">
                <th className="p-4 sm:p-5 w-44 min-w-[140px] uppercase tracking-wider text-[11px]">
                  Hardware Metric
                </th>
                {products.map((p, i) => (
                  <th key={p.id || i} className="p-4 sm:p-5 min-w-[200px]">
                    <div className="font-bold text-white text-sm">{p.name}</div>
                    <div className="text-[11px] text-amber-400/90 font-mono mt-0.5">
                      Score: {(p.verdictScore || 0).toFixed(1)} / 10
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {SPEC_ROWS.map((row) => {
                // Check if any product has this spec
                const hasAnyValue = products.some((p) => p.specs && p.specs[row.key]);
                if (!hasAnyValue) return null;

                return (
                  <tr key={row.key} className="hover:bg-tech-950/60 transition">
                    <td className="p-4 sm:p-5 font-bold text-slate-300 bg-tech-950/40 whitespace-nowrap">
                      <span className="mr-2">{row.icon}</span>
                      <span>{row.label}</span>
                    </td>
                    {products.map((p, i) => (
                      <td key={p.id || i} className="p-4 sm:p-5 text-slate-200">
                        {(p.specs && p.specs[row.key]) ? (
                          <span className="font-sans text-xs sm:text-[13px]">{p.specs[row.key]}</span>
                        ) : (
                          <span className="text-slate-600 font-mono italic">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 4. Side-by-Side Pros & Cons Comparison */}
      <div className="p-6 sm:p-8 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-6">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-4 h-4 text-tech-emerald" />
            <span>Pros & Cons Comparison Breakdown</span>
          </h3>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Key advantages and trade-offs observed during hands-on evaluation.
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-${Math.min(products.length, 3)} gap-6`}>
          {products.map((product, idx) => (
            <div key={product.id || idx} className="p-5 rounded-2xl bg-tech-950 border border-slate-800/80 space-y-5">
              <div className="border-b border-slate-800 pb-2">
                <span className="text-[10px] font-mono text-slate-500 uppercase">Device #{idx + 1}</span>
                <h4 className="text-base font-bold text-white">{product.name}</h4>
              </div>

              {/* Pros */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold text-tech-emerald flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5" />
                  <span>Strengths ({(product.pros || []).length})</span>
                </span>
                <ul className="space-y-1.5">
                  {(product.pros || []).map((pro, pIdx) => (
                    <li key={pIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-tech-emerald font-bold mt-0.5">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                  {(!product.pros || product.pros.length === 0) && (
                    <li className="text-xs text-slate-500 italic">No specific pros listed.</li>
                  )}
                </ul>
              </div>

              {/* Cons */}
              <div className="space-y-2 pt-2 border-t border-slate-800/60">
                <span className="text-xs font-mono font-bold text-rose-400 flex items-center gap-1.5">
                  <X className="w-3.5 h-3.5" />
                  <span>Drawbacks ({(product.cons || []).length})</span>
                </span>
                <ul className="space-y-1.5">
                  {(product.cons || []).map((con, cIdx) => (
                    <li key={cIdx} className="text-xs text-slate-300 flex items-start gap-2 leading-relaxed">
                      <span className="text-rose-400 font-bold mt-0.5">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                  {(!product.cons || product.cons.length === 0) && (
                    <li className="text-xs text-slate-500 italic">No major drawbacks recorded.</li>
                  )}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
