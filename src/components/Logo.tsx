import React from 'react';
import Link from 'next/link';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  className?: string;
  linkToHome?: boolean;
}

export default function Logo({
  size = 'md',
  showTagline = false,
  className = '',
  linkToHome = true,
}: LogoProps) {
  const sizeMap = {
    sm: { icon: 38, text: 'text-xl', badge: 'text-[10px] px-1.5 py-0.5', sub: 'text-[8px]' },
    md: { icon: 48, text: 'text-2xl', badge: 'text-xs px-2 py-0.5', sub: 'text-[9px]' },
    lg: { icon: 60, text: 'text-3xl', badge: 'text-sm px-2.5 py-1', sub: 'text-[10px]' },
    xl: { icon: 74, text: 'text-5xl', badge: 'text-base px-3 py-1', sub: 'text-xs' },
  };

  const { icon, text, badge, sub } = sizeMap[size];

  const logoContent = (
    <div className={`inline-flex items-center gap-3 select-none group ${className}`}>
      {/* Visual Tech Emblem */}
      <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
        <svg
          width={icon}
          height={icon}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="transition-all duration-300 filter drop-shadow-[0_0_12px_rgba(0,245,255,0.4)]"
        >
          <defs>
            <linearGradient id="gzRimGradNext" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F5FF" />
              <stop offset="50%" stopColor="#8B5CF6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="gzGStrokeNext" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F5FF" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
            <linearGradient id="gzZStrokeNext" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#C084FC" />
              <stop offset="50%" stopColor="#F472B6" />
              <stop offset="100%" stopColor="#EC4899" />
            </linearGradient>
            <linearGradient id="gzDiscBgNext" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0F172A" />
              <stop offset="100%" stopColor="#040711" />
            </linearGradient>
          </defs>

          {/* Obsidian Chrono Disc */}
          <circle cx="50" cy="50" r="46" fill="url(#gzDiscBgNext)" stroke="#1E293B" strokeWidth="1.5" />
          
          {/* Outer Chrono Precision Arcs */}
          <path d="M 23 18 A 44 44 0 0 1 77 18" stroke="url(#gzRimGradNext)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M 23 82 A 44 44 0 0 0 77 82" stroke="url(#gzRimGradNext)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          
          {/* Cardinal Ticks */}
          <line x1="50" y1="8" x2="50" y2="13" stroke="#00F5FF" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="50" y1="87" x2="50" y2="92" stroke="#EC4899" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="8" y1="50" x2="13" y2="50" stroke="#00F5FF" strokeWidth="2.2" strokeLinecap="round" />
          <line x1="87" y1="50" x2="92" y2="50" stroke="#EC4899" strokeWidth="2.2" strokeLinecap="round" />

          {/* Aerodynamic 'G' */}
          <path d="M 45 31 L 31 31 C 23.5 31 18 36.5 18 44 L 18 56 C 18 63.5 23.5 69 31 69 L 45 69 L 45 52 L 34 52" 
                stroke="url(#gzGStrokeNext)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* High-Velocity 'Z' */}
          <path d="M 55 31 L 82 31 L 56 69 L 83 69" 
                stroke="url(#gzZStrokeNext)" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />

          {/* Quantum Node */}
          <circle cx="69" cy="50" r="2.5" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Brand Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline gap-1.5">
          <span className={`font-extrabold tracking-tight text-white ${text} font-sans drop-shadow-[0_0_20px_rgba(0,245,255,0.4)]`}>
            Gen<span className="text-cyan-400 drop-shadow-[0_0_14px_rgba(0,245,255,0.8)]">Z</span>
          </span>
          <span className={`font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent font-sans ${text}`}>
            Time
          </span>
        </div>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00F5FF]" />
          <span className={`tracking-widest uppercase text-slate-400 font-mono font-bold ${sub}`}>
            TECH &amp; GADGETS
          </span>
        </div>
      </div>
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" className="inline-block focus:outline-none">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
}
