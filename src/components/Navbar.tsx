'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Logo from './Logo';
import { 
  Search, 
  Menu, 
  X, 
  Sparkles, 
  Cpu, 
  Smartphone, 
  Laptop, 
  Headphones, 
  ShieldCheck,
  ChevronDown,
  Tag
} from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: 'Reviews Hub', href: '/blog' },
    { name: 'Categories', href: '/#categories', isDropdown: true },
    { name: 'Testing Lab', href: '/about#methodology' },
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const categories = [
    { name: 'Smartphones', href: '/category/smartphones', icon: Smartphone },
    { name: 'Laptops & PCs', href: '/category/laptops-computing', icon: Laptop },
    { name: 'Audio & ANC', href: '/category/audio-earbuds', icon: Headphones },
    { name: 'VR & Spatial', href: '/category/vr-wearables', icon: Cpu },
    { name: 'AI Hardware', href: '/category/ai-gadgets', icon: Sparkles },
    { name: 'Drones & Cine', href: '/category/drones-cameras', icon: ShieldCheck },
  ];

  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-xl bg-tech-950/80 border-b border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Logo size="md" showTagline={false} />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/blog"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/blog' ? 'text-tech-cyan bg-tech-cyan/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Reviews & Articles
            </Link>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setCategoriesOpen(true)}
              onMouseLeave={() => setCategoriesOpen(false)}
            >
              <button
                onClick={() => setCategoriesOpen(!categoriesOpen)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                  pathname.startsWith('/category') ? 'text-tech-cyan bg-tech-cyan/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Categories</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${categoriesOpen ? 'rotate-180 text-tech-cyan' : ''}`} />
              </button>

              {categoriesOpen && (
                <div className="absolute top-full left-0 w-64 pt-2 shadow-2xl">
                  <div className="rounded-xl bg-tech-900 border border-slate-700/60 p-2 backdrop-blur-xl shadow-glow">
                    {categories.map((cat) => {
                      const Icon = cat.icon;
                      return (
                        <Link
                          key={cat.name}
                          href={cat.href}
                          onClick={() => setCategoriesOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-300 hover:text-white hover:bg-white/5 transition group"
                        >
                          <Icon className="w-4 h-4 text-tech-cyan group-hover:scale-110 transition" />
                          <span>{cat.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/about' ? 'text-tech-cyan bg-tech-cyan/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              About & Lab
            </Link>

            <Link
              href="/editorial-disclosure"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/editorial-disclosure' ? 'text-tech-cyan bg-tech-cyan/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Editorial Standards
            </Link>

            <Link
              href="/deals"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                pathname === '/deals' ? 'text-amber-400 bg-amber-400/10' : 'text-slate-300 hover:text-amber-300 hover:bg-white/5'
              }`}
            >
              <Tag className="w-3.5 h-3.5 text-amber-400" />
              <span>Deals</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
                PROMO
              </span>
            </Link>

            <Link
              href="/contact"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/contact' ? 'text-tech-cyan bg-tech-cyan/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Action CTAs: Search */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/blog"
              className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-tech-cyan hover:bg-white/5 transition border border-slate-800/80 hover:border-tech-cyan/40 flex items-center gap-2 text-xs font-mono"
              title="Search Reviews & Articles"
            >
              <Search className="w-4 h-4 text-tech-cyan" />
              <span>Search Reviews</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none"
              aria-label="Toggle navigation"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {isOpen && (
        <div className="lg:hidden border-b border-slate-800 bg-tech-900/95 backdrop-blur-2xl px-4 pt-3 pb-6 space-y-3">
          <div className="space-y-1">
            <Link
              href="/"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
            >
              Home
            </Link>
            <Link
              href="/blog"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
            >
              All Reviews & Articles
            </Link>
            <div className="px-3 py-2">
              <span className="text-xs font-semibold text-tech-cyan uppercase tracking-wider block mb-2">
                Categories
              </span>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={cat.href}
                    onClick={() => setIsOpen(false)}
                    className="text-xs text-slate-300 hover:text-tech-cyan py-1 px-2 rounded bg-white/5"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href="/about"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
            >
              About GenZ Time
            </Link>
            <Link
              href="/editorial-disclosure"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
            >
              Editorial & Testing Ethics
            </Link>
            <Link
              href="/deals"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-between px-3 py-2 rounded-lg text-base font-medium text-amber-300 hover:bg-amber-400/10"
            >
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-amber-400" />
                <span>Deals & Coupons</span>
              </div>
              <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-amber-400/20 text-amber-300">
                PROMO
              </span>
            </Link>
            <Link
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
            >
              Contact & Pitch Reviews
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
