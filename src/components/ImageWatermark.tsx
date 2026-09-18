import React from 'react';

interface ImageWatermarkProps {
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  label?: string;
  className?: string;
}

export default function ImageWatermark({
  size = 'md',
  position = 'bottom-right',
  label = 'LAB VERIFIED',
  className = '',
}: ImageWatermarkProps) {
  // Position mapping
  const positionClasses = {
    'bottom-right': 'bottom-3 right-3 sm:bottom-5 sm:right-5',
    'bottom-left': 'bottom-3 left-3 sm:bottom-5 sm:left-5',
    'top-right': 'top-3 right-3 sm:top-5 sm:right-5',
    'top-left': 'top-3 left-3 sm:top-5 sm:left-5',
  }[position];

  // Size scaling
  const sizeConfig = {
    sm: {
      emblem: 20,
      container: 'px-2 py-1 gap-1.5 rounded-lg',
      title: 'text-[11px]',
      sub: 'text-[7px]',
    },
    md: {
      emblem: 28,
      container: 'px-3 py-1.5 sm:px-3.5 sm:py-2 gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl',
      title: 'text-xs sm:text-sm',
      sub: 'text-[8px] sm:text-[9px]',
    },
    lg: {
      emblem: 36,
      container: 'px-4 py-2 gap-3 rounded-2xl',
      title: 'text-sm sm:text-base',
      sub: 'text-[9px] sm:text-[10px]',
    },
  }[size];

  return (
    <div
      className={`absolute ${positionClasses} pointer-events-none select-none z-20 transition-all duration-300 ${className}`}
      aria-hidden="true"
    >
      <div
        className={`flex items-center ${sizeConfig.container} bg-tech-950/85 backdrop-blur-md border border-tech-cyan/40 shadow-glow shadow-tech-cyan/20`}
      >
        {/* Official Obsidian Chrono Emblem */}
        <div className="relative flex-shrink-0">
          <svg
            width={sizeConfig.emblem}
            height={sizeConfig.emblem}
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_0_8px_rgba(0,245,255,0.5)]"
          >
            <defs>
              <linearGradient id={`gzWatermarkRim_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F5FF" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id={`gzWatermarkG_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00F5FF" />
                <stop offset="100%" stopColor="#38BDF8" />
              </linearGradient>
              <linearGradient id={`gzWatermarkZ_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C084FC" />
                <stop offset="50%" stopColor="#F472B6" />
                <stop offset="100%" stopColor="#EC4899" />
              </linearGradient>
              <linearGradient id={`gzWatermarkBg_${size}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0F172A" />
                <stop offset="100%" stopColor="#040711" />
              </linearGradient>
            </defs>

            {/* Disc */}
            <circle cx="50" cy="50" r="46" fill={`url(#gzWatermarkBg_${size})`} stroke="#1E293B" strokeWidth="1.5" />
            
            {/* Precision Arcs */}
            <path d="M 23 18 A 44 44 0 0 1 77 18" stroke={`url(#gzWatermarkRim_${size})`} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M 23 82 A 44 44 0 0 0 77 82" stroke={`url(#gzWatermarkRim_${size})`} strokeWidth="3" strokeLinecap="round" fill="none" />
            
            {/* Cardinal Ticks */}
            <line x1="50" y1="8" x2="50" y2="13" stroke="#00F5FF" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="50" y1="87" x2="50" y2="92" stroke="#EC4899" strokeWidth="2.5" strokeLinecap="round" />

            {/* Aerodynamic G */}
            <path
              d="M 45 31 L 31 31 C 23.5 31 18 36.5 18 44 L 18 56 C 18 63.5 23.5 69 31 69 L 45 69 L 45 52 L 34 52" 
              stroke={`url(#gzWatermarkG_${size})`}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* High-Velocity Z */}
            <path
              d="M 55 31 L 82 31 L 56 69 L 83 69" 
              stroke={`url(#gzWatermarkZ_${size})`}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />

            {/* Quantum Node */}
            <circle cx="69" cy="50" r="3" fill="#FFFFFF" />
          </svg>
        </div>

        {/* Brand Typography */}
        <div className="flex flex-col leading-none">
          <div className="flex items-baseline gap-0.5">
            <span className={`font-extrabold tracking-tight text-white ${sizeConfig.title} font-sans drop-shadow-[0_0_10px_rgba(255,255,255,0.4)]`}>
              Gen<span className="text-cyan-400 drop-shadow-[0_0_8px_#00F5FF]">Z</span>
            </span>
            <span className={`font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-500 bg-clip-text text-transparent font-sans ${sizeConfig.title} ml-0.5`}>
              Time
            </span>
          </div>
          <span className={`tracking-widest uppercase text-tech-cyan font-mono font-bold ${sizeConfig.sub} mt-0.5`}>
            {label}
          </span>
        </div>
      </div>
    </div>
  );
}
