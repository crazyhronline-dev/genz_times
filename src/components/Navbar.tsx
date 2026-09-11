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
  PlusCircle, 
  ShieldCheck,
  ChevronDown,
  Lock
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
              href="/contact"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                pathname === '/contact' ? 'text-tech-cyan bg-tech-cyan/10' : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Contact
            </Link>
          </nav>

          {/* Action CTAs: Search & Publish Studio */}
          <div className="hidden sm:flex items-center gap-3">
            <Link
              href="/blog"
              className="p-2.5 rounded-xl text-slate-400 hover:text-tech-cyan hover:bg-white/5 transition border border-transparent hover:border-tech-cyan/30"
              title="Search Reviews"
            >
              <Search className="w-5 h-5" />
            </Link>

            <Link
              href="/admin"
              className={`px-3 py-2 rounded-xl text-xs font-mono transition-colors flex items-center gap-1.5 border ${
                pathname.startsWith('/admin')
                  ? 'text-tech-cyan bg-tech-cyan/10 border-tech-cyan/40'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-slate-800'
              }`}
              title="Admin Portal"
            >
              <Lock className="w-3.5 h-3.5 text-tech-cyan" />
              <span>Admin</span>
            </Link>

            <Link
              href="/publish"
              className="relative group inline-flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium text-sm text-tech-950 font-semibold bg-gradient-to-r from-tech-cyan via-teal-300 to-tech-emerald shadow-glow hover:shadow-glow-emerald transition duration-300 transform active:scale-95"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Publish Article</span>
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/publish"
              className="p-2 rounded-lg bg-tech-cyan text-tech-950 font-bold text-xs flex items-center gap-1"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post</span>
            </Link>
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
              href="/contact"
              onClick={() => setIsOpen(false)}
              className="block px-3 py-2 rounded-lg text-base font-medium text-slate-200 hover:bg-white/5"
            >
              Contact & Pitch Reviews
            </Link>
            <Link
              href="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-medium text-tech-cyan hover:bg-tech-cyan/10 font-mono"
            >
              <Lock className="w-4 h-4" />
              <span>Admin Portal / Login</span>
            </Link>
          </div>

          <div className="pt-2 border-t border-slate-800">
            <Link
              href="/publish"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Open Publishing Studio</span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
