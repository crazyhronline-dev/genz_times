import React from 'react';
import Link from 'next/link';
import Logo from './Logo';
import { 
  ShieldCheck, 
  Cpu, 
  Sparkles, 
  Twitter, 
  Linkedin, 
  Youtube, 
  Github, 
  Rss,
  CheckCircle2
} from 'lucide-react';
import { CATEGORIES } from '@/lib/categories';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800/80 bg-tech-950 text-slate-400">
      {/* Upper Hardware Ethics Banner */}
      <div className="border-b border-slate-800/60 bg-tech-900/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-tech-cyan/10 border border-tech-cyan/20 text-tech-cyan">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">GenZ Time Independent Lab Standards</h4>
                <p className="text-xs text-slate-400">
                  100% autonomous hardware benchmarking. We never accept compensation for review verdicts or ratings.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-xs text-slate-400">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-tech-emerald" /> Unbiased Benchmarks</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-tech-emerald" /> Hands-on Teardowns</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-tech-emerald" /> Rigorous Battery Tests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          
          {/* Col 1 & 2: Brand & Mission */}
          <div className="lg:col-span-2 space-y-4">
            <Logo size="md" showTagline={true} />
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm pt-2">
              GenZ Time is a premier digital publication exploring the frontier of consumer technology, silicon engineering, spatial hardware, and smart devices. Tested by tech enthusiasts, for enthusiasts.
            </p>
            <div className="pt-2 flex items-center space-x-3 text-slate-400">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-tech-cyan/10 hover:text-tech-cyan transition">
                <Twitter className="w-4 h-4" />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-red-500/10 hover:text-red-400 transition">
                <Youtube className="w-4 h-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/10 hover:text-blue-400 transition">
                <Linkedin className="w-4 h-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-slate-500/10 hover:text-white transition">
                <Github className="w-4 h-4" />
              </a>
              <Link href="/sitemap.xml" className="p-2 rounded-lg bg-white/5 hover:bg-amber-500/10 hover:text-amber-400 transition" title="Dynamic XML Sitemap">
                <Rss className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Col 3: Gadget Categories */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-tech-cyan mb-4 font-semibold">
              Gadget Categories
            </h3>
            <ul className="space-y-2.5 text-sm">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <li key={cat.id}>
                  <Link href={`/category/${cat.slug}`} className="hover:text-white transition">
                    {cat.name}
                  </Link>
                </li>
              ))}
              <li>
                <Link href="/blog" className="text-tech-cyan hover:underline text-xs font-mono">
                  + View All Categories →
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Editorial & Labs */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-tech-cyan mb-4 font-semibold">
              Editorial & Labs
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition">
                  About GenZ Time
                </Link>
              </li>
              <li>
                <Link href="/about#methodology" className="hover:text-white transition">
                  Testing Methodology
                </Link>
              </li>
              <li>
                <Link href="/editorial-disclosure" className="hover:text-white transition">
                  Editorial Disclosure & Ethics
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Pitch a Review Unit
                </Link>
              </li>
              <li>
                <Link href="/publish" className="text-tech-emerald hover:underline font-mono text-xs">
                  ⚡ Writer & Admin Studio
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Legal & SEO Meta */}
          <div>
            <h3 className="text-xs font-mono uppercase tracking-widest text-tech-cyan mb-4 font-semibold">
              Compliance & Legal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/privacy" className="hover:text-white transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/sitemap.xml" className="hover:text-white transition">
                  XML Sitemap
                </Link>
              </li>
              <li>
                <Link href="/robots.txt" className="hover:text-white transition">
                  Search Crawlers (Robots.txt)
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Credits & Copyright */}
        <div className="pt-10 mt-10 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} GenZ Time. All rights reserved. Specialized in consumer hardware & tech gadgets.</p>
          <p className="font-mono text-slate-400">
            Powered By - CrazyHR Technologies Pvt. Ltd.
          </p>
        </div>
      </div>
    </footer>
  );
}
