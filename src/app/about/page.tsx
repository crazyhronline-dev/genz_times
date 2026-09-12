import React from 'react';
import { Metadata } from 'next';
import Logo from '@/components/Logo';
import { 
  ShieldCheck, 
  Microscope, 
  Cpu, 
  Award, 
  CheckCircle2, 
  Layers, 
  Users, 
  Gauge, 
  BatteryCharging,
  Eye
} from 'lucide-react';
import { SITE_CONFIG } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Us — Who We Are, How We Test & Why You Can Trust Us',
  description: 'GenZ Time is an independent tech review publication built for the next generation. We buy or borrow devices, test them for weeks, and publish results no brand can influence. Meet the team and our testing standards.',
  alternates: {
    canonical: `${SITE_CONFIG.url}/about`,
  },
  openGraph: {
    title: 'About GenZ Time — Who We Are, How We Test & Why You Can Trust Us',
    description: 'GenZ Time is an independent tech review publication built for the next generation. We buy or borrow devices, test them for weeks, and publish results no brand can influence.',
  },
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      
      {/* Hero Section */}
      <section className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
          <Cpu className="w-3.5 h-3.5" />
          <span>Independent Hardware Journalism</span>
        </div>

        <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight">
          Where Cutting-Edge Tech Meets Relentless Testing
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
          Founded by the <strong>GenZ Editorial Team</strong>, <strong>GenZ Time</strong> was created with a single mission: to cut through the PR noise and provide consumers, prosumers, and engineers with uncompromising, lab-tested hardware evaluations.
        </p>
      </section>

      {/* Brand Visual Showcase Card */}
      <div className="p-8 sm:p-12 rounded-3xl bg-tech-900/80 border border-slate-800 shadow-glow flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-3 max-w-lg">
          <Logo size="lg" showTagline={true} linkToHome={false} />
          <p className="text-sm text-slate-300 pt-2 leading-relaxed">
            The GenZ Time chrono insignia embodies our core identity: modern silicon architecture, photon optics, and precision hardware benchmarking.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-center font-mono">
          <div className="p-4 rounded-2xl bg-tech-950 border border-slate-800">
            <span className="text-2xl sm:text-3xl font-black text-tech-cyan">180+</span>
            <span className="block text-[11px] text-slate-400 uppercase mt-1">Devices Tested</span>
          </div>
          <div className="p-4 rounded-2xl bg-tech-950 border border-slate-800">
            <span className="text-2xl sm:text-3xl font-black text-tech-emerald">100%</span>
            <span className="block text-[11px] text-slate-400 uppercase mt-1">Independent</span>
          </div>
          <div className="p-4 rounded-2xl bg-tech-950 border border-slate-800">
            <span className="text-2xl sm:text-3xl font-black text-tech-violet">45K+</span>
            <span className="block text-[11px] text-slate-400 uppercase mt-1">Subscribers</span>
          </div>
          <div className="p-4 rounded-2xl bg-tech-950 border border-slate-800">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">14-Day</span>
            <span className="block text-[11px] text-slate-400 uppercase mt-1">Testing Minimum</span>
          </div>
        </div>
      </div>

      {/* Testing Methodology Section */}
      <section id="methodology" className="space-y-8 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-tech-cyan font-bold block mb-2">
            Standardized Testing Protocols
          </span>
          <h2 className="text-3xl font-black text-white">
            How We Test Gadgets at GenZ Time Labs
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Every gadget that enters our facility is subjected to an exhaustive suite of calibrated tests.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-tech-900/60 border border-slate-800/90 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
                <Gauge className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Silicon Benchmarking & Thermals</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              We run repeated 30-minute stress loops (Geekbench 6, 3DMark Wild Life Extreme, Cinebench 2024) while monitoring surface temperatures with calibrated FLIR thermal cameras to reveal hidden thermal throttling.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-tech-900/60 border border-slate-800/90 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-tech-emerald/10 text-tech-emerald border border-tech-emerald/30">
                <BatteryCharging className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Standardized Battery Depletion</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Displays are calibrated to exactly 200 nits before continuous web browsing, 4K video playback, and intensive 3D gaming loops are executed until complete auto-shutdown.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-tech-900/60 border border-slate-800/90 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-tech-violet/10 text-purple-400 border border-tech-violet/30">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Display Colorimetry</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Using Konica Minolta and X-Rite spectrophotometers, we verify manufacturer peak nit claims, Delta-E color accuracy, DCI-P3 / sRGB coverage, and PWM flicker frequency for eye strain analysis.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-tech-900/60 border border-slate-800/90 space-y-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/30">
                <Microscope className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-white">Real-World Daily Carry</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Beyond synthetic numbers, our editors live with every device as their daily driver for at least 14 days to identify ergonomic fatigue, software bugs, and edge cases.
            </p>
          </div>
        </div>
      </section>

      {/* The Editorial Team */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-tech-cyan font-bold block mb-2">
            The Analysts
          </span>
          <h2 className="text-3xl font-black text-white">
            Meet the GenZ Time Team
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          <div className="p-6 rounded-2xl bg-tech-900/70 border border-slate-800 flex items-start gap-4">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
              alt="GenZ Editorial Team"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-tech-cyan/40 flex-shrink-0"
            />
            <div>
              <h3 className="text-lg font-bold text-white">GenZ Editorial Team</h3>
              <p className="text-xs font-mono text-tech-cyan mb-2">Founding Editors & Hardware Analysts</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Computer hardware architects and veteran tech reviewers specializing in mobile silicon, spatial computing optics, and performance benchmarking.
              </p>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-tech-900/70 border border-slate-800 flex items-start gap-4">
            <img
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80"
              alt="Marcus Vance"
              className="w-16 h-16 rounded-2xl object-cover border-2 border-tech-emerald/40 flex-shrink-0"
            />
            <div>
              <h3 className="text-lg font-bold text-white">Marcus Vance</h3>
              <p className="text-xs font-mono text-tech-emerald mb-2">Lead Acoustic & Audio Engineer</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Former studio acoustic engineer testing true wireless earbuds, ANC decibel attenuation, and high-res wireless audio codecs.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
