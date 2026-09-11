import React from 'react';
import { CheckCircle2, XCircle, ThumbsUp, ThumbsDown } from 'lucide-react';

interface Props {
  pros: string[];
  cons: string[];
}

export default function ProsConsBox({ pros = [], cons = [] }: Props) {
  if (pros.length === 0 && cons.length === 0) return null;

  return (
    <div className="my-8 grid grid-cols-1 md:grid-cols-2 gap-5">
      {/* Pros / The Good */}
      <div className="rounded-2xl bg-emerald-950/20 border border-emerald-500/30 p-5 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-emerald-500/20">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <ThumbsUp className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-emerald-400 font-mono">
            The Good / Advantages
          </h4>
        </div>
        <ul className="space-y-3">
          {pros.map((pro, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>{pro}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Cons / The Bad */}
      <div className="rounded-2xl bg-rose-950/20 border border-rose-500/30 p-5 backdrop-blur-sm shadow-lg">
        <div className="flex items-center gap-2.5 pb-3 mb-4 border-b border-rose-500/20">
          <div className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400">
            <ThumbsDown className="w-4 h-4" />
          </div>
          <h4 className="text-sm font-bold uppercase tracking-wider text-rose-400 font-mono">
            The Bad / Drawbacks
          </h4>
        </div>
        <ul className="space-y-3">
          {cons.map((con, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-200">
              <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
              <span>{con}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
