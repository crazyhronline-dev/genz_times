'use client';

import React, { useState, useMemo, useRef } from 'react';
import { PromoDeal } from '@/types/deal';
import { 
  Tag, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Check, 
  Copy, 
  Store, 
  Clock, 
  Sparkles, 
  Eye, 
  EyeOff, 
  Upload, 
  Image as ImageIcon,
  Flame,
  ShieldCheck,
  Percent,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import PromoCard from '@/components/PromoCard';
import { generateAutoDealSeo } from '@/lib/deals-seo';

interface AdminDealsModuleProps {
  deals: PromoDeal[];
  onRefresh: () => void;
}

const CATEGORY_OPTIONS = [
  { id: 'smartphones', label: 'Smartphones & Foldables' },
  { id: 'laptops', label: 'Laptops & Computing' },
  { id: 'audio', label: 'Audio & Earbuds' },
  { id: 'gaming', label: 'Gaming Consoles & Gear' },
  { id: 'vpn', label: 'Web Hosting, Cloud & VPN' },
  { id: 'wearables', label: 'VR & Smart Wearables' },
  { id: 'accessories', label: 'Peripherals & Accessories' },
];

export default function AdminDealsModule({ deals, onRefresh }: AdminDealsModuleProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'featured'>('all');
  const [notice, setNotice] = useState<string | null>(null);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<PromoDeal | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [store, setStore] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80');
  const [category, setCategory] = useState('smartphones');
  const [discountText, setDiscountText] = useState('50% OFF');
  const [promoCode, setPromoCode] = useState('');
  const [referralUrl, setReferralUrl] = useState('');
  const [hideCode, setHideCode] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [expiresAt, setExpiresAt] = useState('');

  // SEO & Ranking fields
  const [tags, setTags] = useState('');
  const [seoKeywords, setSeoKeywords] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [terms, setTerms] = useState('');

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  // Telemetry metrics
  const totalDeals = deals.length;
  const activeCount = deals.filter((d) => d.isActive).length;
  const totalClicks = deals.reduce((acc, d) => acc + (d.clicks || 0), 0);
  const totalCopies = deals.reduce((acc, d) => acc + (d.copiedCount || 0), 0);

  // Filtered deals
  const filteredDeals = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return deals.filter((deal) => {
      const matchSearch =
        !q ||
        deal.title.toLowerCase().includes(q) ||
        deal.store.toLowerCase().includes(q) ||
        (deal.promoCode && deal.promoCode.toLowerCase().includes(q));

      const matchCat = selectedCategory === 'all' || deal.category === selectedCategory;
      const matchStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && deal.isActive) ||
        (statusFilter === 'featured' && deal.isFeatured);

      return matchSearch && matchCat && matchStatus;
    });
  }, [deals, searchQuery, selectedCategory, statusFilter]);

  const handleStartCreate = () => {
    setEditingDeal(null);
    setTitle('');
    setStore('');
    setDescription('');
    setImageUrl('https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=800&q=80');
    setCategory('smartphones');
    setDiscountText('50% OFF');
    setPromoCode('');
    setReferralUrl('');
    setHideCode(true);
    setIsFeatured(false);
    setIsActive(true);
    setExpiresAt('');
    setTags('');
    setSeoKeywords('');
    setMetaTitle('');
    setMetaDescription('');
    setTerms('');
    setIsModalOpen(true);
  };

  const handleStartEdit = (deal: PromoDeal) => {
    setEditingDeal(deal);
    setTitle(deal.title);
    setStore(deal.store);
    setDescription(deal.description);
    setImageUrl(deal.imageUrl);
    setCategory(deal.category);
    setDiscountText(deal.discountText);
    setPromoCode(deal.promoCode || '');
    setReferralUrl(deal.referralUrl || '');
    setHideCode(Boolean(deal.hideCode));
    setIsFeatured(Boolean(deal.isFeatured));
    setIsActive(Boolean(deal.isActive));
    setExpiresAt(deal.expiresAt || '');
    setTags((deal.tags || []).join(', '));
    setSeoKeywords((deal.seoKeywords || []).join(', '));
    setMetaTitle(deal.metaTitle || '');
    setMetaDescription(deal.metaDescription || '');
    setTerms(deal.terms || '');
    setIsModalOpen(true);
  };

  const handleAutoGenerateSeo = () => {
    if (!title.trim() && !store.trim()) {
      alert('Please enter at least a Deal Title and Store / Brand name first.');
      return;
    }
    const res = generateAutoDealSeo({
      title,
      store,
      discountText,
      category,
      description,
      promoCode,
    });
    setTags(res.tags.join(', '));
    setSeoKeywords(res.seoKeywords.join(', '));
    setMetaTitle(res.metaTitle);
    setMetaDescription(res.metaDescription);
    showNotice(`✨ Generated ${res.seoKeywords.length} ranking keywords & ${res.tags.length} SEO tags!`);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('watermark', 'true');
      form.append('watermarkPosition', 'bottom-right');

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: form,
      });
      const data = await res.json();
      if (data.success && data.url) {
        setImageUrl(data.url);
        showNotice('Deal thumbnail uploaded & branded successfully!');
      } else {
        alert(data.error || 'Upload failed');
      }
    } catch (err) {
      console.error(err);
      alert('Error uploading image');
    } finally {
      setUploading(false);
    }
  };

  const handleSaveDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !store.trim() || !discountText.trim()) {
      alert('Title, Store, and Discount Text are required.');
      return;
    }

    setSaving(true);
    try {
      const payload: Partial<PromoDeal> & { title: string; store: string; discountText: string } = {
        id: editingDeal?.id,
        title: title.trim(),
        store: store.trim(),
        description: description.trim(),
        imageUrl: imageUrl.trim(),
        category,
        discountText: discountText.trim(),
        promoCode: promoCode.trim() || undefined,
        referralUrl: referralUrl.trim() || undefined,
        hideCode,
        isFeatured,
        isActive,
        expiresAt: expiresAt.trim() || undefined,
        tags: tags ? tags.split(',').map((s) => s.trim().replace(/^#/, '')).filter(Boolean) : undefined,
        seoKeywords: seoKeywords ? seoKeywords.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
        metaTitle: metaTitle.trim() || undefined,
        metaDescription: metaDescription.trim() || undefined,
        terms: terms.trim() || undefined,
      };

      const url = editingDeal ? `/api/deals/${editingDeal.id}` : '/api/deals';
      const method = editingDeal ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.success) {
        showNotice(editingDeal ? 'Deal updated successfully!' : 'New deal published live!');
        setIsModalOpen(false);
        onRefresh();
      } else {
        alert(data.error || 'Failed to save deal');
      }
    } catch (err) {
      console.error(err);
      alert('Error saving deal');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteDeal = async (id: string, dealTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete: "${dealTitle}"?`)) return;

    try {
      const res = await fetch(`/api/deals/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotice('Deal deleted successfully.');
        onRefresh();
      } else {
        alert(data.error || 'Failed to delete deal');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting deal');
    }
  };

  const handleToggleStatus = async (deal: PromoDeal, field: 'isActive' | 'isFeatured') => {
    try {
      const payload = { ...deal, [field]: !deal[field] };
      const res = await fetch(`/api/deals/${deal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.success) {
        showNotice(`${field === 'isActive' ? 'Active status' : 'Featured status'} updated!`);
        onRefresh();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Construct dummy deal object for live preview inside modal
  const previewDeal: PromoDeal = {
    id: editingDeal?.id || 'preview-deal',
    title: title || 'Samsung Galaxy S25 Ultra $150 Instant Credit',
    store: store || 'Samsung',
    description: description || 'Special student and trade-in rebate applied at checkout with free storage upgrade.',
    imageUrl,
    category,
    discountText: discountText || '50% OFF',
    promoCode: promoCode || 'GENZ50',
    referralUrl: referralUrl || 'https://samsung.com',
    hideCode,
    isFeatured,
    isActive,
    expiresAt: expiresAt || undefined,
    tags: tags ? tags.split(',').map((s) => s.trim().replace(/^#/, '')).filter(Boolean) : ['samsung-promo', 'verified-coupon'],
    seoKeywords: seoKeywords ? seoKeywords.split(',').map((s) => s.trim()).filter(Boolean) : undefined,
    metaTitle: metaTitle || undefined,
    metaDescription: metaDescription || undefined,
    terms: terms || undefined,
    createdAt: new Date().toISOString(),
  };

  return (
    <div className="space-y-8">
      {/* Toast Notice */}
      {notice && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-2xl bg-tech-cyan text-tech-950 font-bold font-mono text-xs shadow-2xl flex items-center gap-2 animate-bounce">
          <Check className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Module Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-tech-900 via-tech-950 to-tech-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-glow">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-emerald-400 font-bold mb-1">
            <Tag className="w-4 h-4" />
            <span>Commercial Deals Engine</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Deals, Promo Codes & Coupons Manager
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            Publish verified discount coupons, manage affiliate referral links, and configure 50% promo code masking.
          </p>
        </div>

        <button
          type="button"
          onClick={handleStartCreate}
          className="px-5 py-3 rounded-2xl font-bold font-mono text-xs text-tech-950 bg-gradient-to-r from-emerald-400 to-tech-cyan shadow-glow flex items-center gap-2 hover:opacity-95 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Post New Deal / Coupon</span>
        </button>
      </div>

      {/* Telemetry Metric Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-tech-900/40 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">Total Deals Posted</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-white">{totalDeals}</div>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/40 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">Active on Site</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-emerald-400">{activeCount}</div>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/40 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">Promo Code Copies</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-amber-300">{totalCopies}</div>
        </div>

        <div className="p-5 rounded-2xl bg-tech-900/40 border border-slate-800">
          <span className="text-[11px] font-mono text-slate-400 block mb-1">Referral Store Clicks</span>
          <div className="text-2xl sm:text-3xl font-black font-mono text-tech-cyan">{totalClicks}</div>
        </div>
      </div>

      {/* Search & Filter Toolbar */}
      <div className="p-4 rounded-2xl bg-tech-900/30 border border-slate-800/80 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals, stores, codes..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-tech-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan font-mono"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 rounded-xl bg-tech-950 border border-slate-800 text-xs text-slate-300 font-mono focus:outline-none focus:border-tech-cyan"
          >
            <option value="all">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </select>

          {/* Status Tabs */}
          <div className="flex items-center gap-1 bg-tech-950 p-1 rounded-xl border border-slate-800 text-xs font-mono">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1 rounded-lg transition ${
                statusFilter === 'all' ? 'bg-white/10 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('active')}
              className={`px-3 py-1 rounded-lg transition ${
                statusFilter === 'active' ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('featured')}
              className={`px-3 py-1 rounded-lg transition ${
                statusFilter === 'featured' ? 'bg-amber-400/20 text-amber-300 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              Featured
            </button>
          </div>
        </div>
      </div>

      {/* Deals Management Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDeals.map((deal) => {
          return (
            <div
              key={deal.id}
              className="p-5 rounded-3xl bg-tech-900/40 border border-slate-800 hover:border-slate-700 transition flex flex-col justify-between space-y-4 shadow-lg"
            >
              {/* Card Header with Thumbnail */}
              <div>
                <div className="relative aspect-[16/9] rounded-2xl overflow-hidden bg-tech-950 mb-3 border border-slate-800">
                  <img
                    src={deal.imageUrl}
                    alt={deal.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-tech-950/90 text-white border border-slate-700">
                      {deal.store}
                    </span>
                  </div>
                  <div className="absolute top-2.5 right-2.5">
                    <span className="px-2.5 py-0.5 rounded-lg text-[11px] font-mono font-bold bg-emerald-500 text-tech-950">
                      {deal.discountText}
                    </span>
                  </div>
                </div>

                <h3 className="font-bold text-white text-base leading-snug mb-1 line-clamp-2">
                  {deal.title}
                </h3>
                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mb-3">
                  {deal.description}
                </p>

                {/* Promo Code & Masking Pill */}
                <div className="p-3 rounded-xl bg-tech-950 border border-slate-800 text-xs font-mono flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400">Code:</span>
                    {deal.promoCode ? (
                      <span className="text-white font-bold bg-white/5 px-2 py-0.5 rounded border border-slate-800">
                        {deal.promoCode}
                      </span>
                    ) : (
                      <span className="text-slate-500 italic">No code (Direct)</span>
                    )}
                  </div>

                  <span className={`px-2 py-0.5 rounded text-[10px] ${
                    deal.hideCode
                      ? 'bg-amber-400/10 text-amber-300 border border-amber-400/30'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {deal.hideCode ? '50% Masked' : 'Always Visible'}
                  </span>
                </div>
              </div>

              {/* Card Footer: Metrics & Actions */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                <div className="text-slate-400 text-[11px]">
                  <span>{deal.copiedCount || 0} copies</span> • <span>{deal.clicks || 0} clicks</span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleToggleStatus(deal, 'isActive')}
                    className={`px-2 py-1 rounded-lg text-[10px] border transition ${
                      deal.isActive
                        ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300 font-bold'
                        : 'bg-slate-800/80 border-slate-700 text-slate-500'
                    }`}
                    title="Toggle active on public site"
                  >
                    {deal.isActive ? 'Active' : 'Draft'}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleStartEdit(deal)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition"
                    title="Edit deal"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteDeal(deal.id, deal.title)}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition"
                    title="Delete deal"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredDeals.length === 0 && (
        <div className="text-center py-16 rounded-3xl bg-tech-900/30 border border-slate-800">
          <Tag className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No Promo Codes Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-5">
            No deals matched your current search filters. Create your first coupon to get started.
          </p>
          <button
            type="button"
            onClick={handleStartCreate}
            className="px-4 py-2 rounded-xl text-xs font-mono font-bold text-tech-950 bg-tech-cyan"
          >
            + Create Deal
          </button>
        </div>
      )}

      {/* Create / Edit Deal Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-tech-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-xl font-bold text-white">
                  {editingDeal ? 'Edit Promo Deal / Coupon' : 'Post New Promo Code & Coupon'}
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  Configure store details, discount tags, referral link, and 50% code hiding.
                </span>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white font-mono text-lg"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDeal} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Deal Title *</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. Save $150 on Samsung Galaxy S25 Ultra"
                      className="w-full px-3.5 py-2.5 bg-tech-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Store / Brand *</label>
                      <input
                        type="text"
                        required
                        value={store}
                        onChange={(e) => setStore(e.target.value)}
                        placeholder="e.g. Samsung, Amazon, NordVPN"
                        className="w-full px-3 py-2 bg-tech-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Discount Badge *</label>
                      <input
                        type="text"
                        required
                        value={discountText}
                        onChange={(e) => setDiscountText(e.target.value)}
                        placeholder="e.g. 50% OFF, $150 OFF"
                        className="w-full px-3 py-2 bg-tech-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Category</label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full px-3 py-2 bg-tech-900 border border-slate-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-tech-cyan"
                      >
                        {CATEGORY_OPTIONS.map((c) => (
                          <option key={c.id} value={c.id}>{c.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono text-slate-400">Expiry Date</label>
                        <span className="text-[10px] font-mono text-slate-500">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={expiresAt}
                        onChange={(e) => setExpiresAt(e.target.value)}
                        placeholder="Optional (leave empty for ongoing)"
                        className="w-full px-3 py-2 bg-tech-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan font-mono"
                      />
                    </div>
                  </div>

                  {/* Promo Code & Referral Link */}
                  <div className="p-4 rounded-2xl bg-tech-900/40 border border-slate-800 space-y-3">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono text-slate-400">Promo Code</label>
                        <span className="text-[10px] font-mono text-slate-500">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="e.g. GZS25ULTRA"
                        className="w-full px-3 py-2 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan font-mono uppercase tracking-wider font-bold"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono text-slate-400">Referral / Store Link</label>
                        <span className="text-[10px] font-mono text-slate-500">Optional</span>
                      </div>
                      <input
                        type="url"
                        value={referralUrl}
                        onChange={(e) => setReferralUrl(e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan font-mono"
                      />
                    </div>

                    {/* HIDE PROMO CODE TOGGLE (USER CORE REQUIREMENT!) */}
                    <div className="pt-2 border-t border-slate-800/80">
                      <label className="flex items-start gap-3 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={hideCode}
                          onChange={(e) => setHideCode(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded accent-tech-cyan cursor-pointer"
                        />
                        <div className="text-xs">
                          <span className="font-bold text-white group-hover:text-tech-cyan transition flex items-center gap-1.5">
                            {hideCode ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5 text-slate-400" />}
                            <span>Hide 50% of the Promo Code on the card</span>
                          </span>
                          <p className="text-[11px] text-slate-400 mt-0.5 leading-relaxed">
                            When enabled, the code is 50% masked (e.g. <span className="font-mono text-slate-300">GENZ****</span>). Clicking <strong>&quot;Get This Promo Code&quot;</strong> reveals the full code, copies it to the clipboard, and automatically opens your referral link in a new tab!
                          </p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* Thumbnail Image URL or Upload */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Deal Image / Banner</label>
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://..."
                        className="flex-1 px-3 py-2 bg-tech-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-tech-cyan font-mono"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading}
                        className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono flex items-center gap-1.5 transition shrink-0"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>{uploading ? 'Uploading...' : 'Upload'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Details, eligibility terms, or caveats for this deal..."
                      className="w-full px-3 py-2 bg-tech-900 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan leading-relaxed"
                    />
                  </div>

                  {/* SEO & Search Engine Ranking Engine */}
                  <div className="p-4 rounded-2xl bg-gradient-to-b from-amber-500/10 via-tech-900/40 to-tech-950 border border-amber-500/30 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-bold font-mono text-amber-300 uppercase tracking-wider">
                          Google Search & SEO Ranking Suite
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleAutoGenerateSeo}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-amber-400 to-orange-400 hover:from-amber-300 hover:to-orange-300 text-tech-950 text-[11px] font-mono font-bold flex items-center gap-1.5 transition shadow-glow"
                        title="Auto-generate high ranking keywords and tags based on Title & Store"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>⚡ Auto-Generate SEO</span>
                      </button>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Optimizes every deal with Schema.org Offer structured data, high-intent ranking keywords, and Google SERP snippets for #1 search placement.
                    </p>

                    {/* Meta Title */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <label className="text-slate-400">Google SERP Title</label>
                        <span className={metaTitle.length > 65 ? 'text-amber-400' : 'text-slate-500'}>
                          {metaTitle.length} / 60 chars
                        </span>
                      </div>
                      <input
                        type="text"
                        value={metaTitle}
                        onChange={(e) => setMetaTitle(e.target.value)}
                        placeholder="e.g. Samsung Galaxy S25 Ultra Promo Code ($150 OFF) 2026 | GenZ Time"
                        className="w-full px-3 py-1.5 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    {/* Meta Description */}
                    <div>
                      <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                        <label className="text-slate-400">Google Snippet Description</label>
                        <span className={metaDescription.length > 165 ? 'text-amber-400' : 'text-slate-500'}>
                          {metaDescription.length} / 160 chars
                        </span>
                      </div>
                      <textarea
                        rows={2}
                        value={metaDescription}
                        onChange={(e) => setMetaDescription(e.target.value)}
                        placeholder="Verified discount code tested by GenZ Time lab..."
                        className="w-full px-3 py-1.5 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 text-[11px] leading-relaxed"
                      />
                    </div>

                    {/* Target Ranking Keywords */}
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Target Google Ranking Keywords (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={seoKeywords}
                        onChange={(e) => setSeoKeywords(e.target.value)}
                        placeholder="samsung promo code 2026, galaxy s25 discount, verified coupon code"
                        className="w-full px-3 py-1.5 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                      />
                    </div>

                    {/* Tags for Search Indexing */}
                    <div>
                      <label className="block text-[11px] font-mono text-slate-400 mb-1">
                        Display Tags (comma-separated, without #)
                      </label>
                      <input
                        type="text"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="samsung-promo, galaxy-s25, verified-coupon"
                        className="w-full px-3 py-1.5 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 font-mono text-[11px]"
                      />
                    </div>

                    {/* Live Google Search Preview Box */}
                    <div className="p-3 rounded-xl bg-tech-950/90 border border-slate-800 space-y-1">
                      <span className="text-[10px] font-mono uppercase text-slate-500 block">
                        Google Search Results Preview (SERP)
                      </span>
                      <div className="text-[11px] text-slate-400 font-mono truncate">
                        https://genztime.com &rsaquo; deals &rsaquo; #{store.toLowerCase().replace(/[^a-z0-9]/g, '') || 'deal'}
                      </div>
                      <div className="text-sm font-bold text-sky-400 hover:underline cursor-pointer truncate">
                        {metaTitle || title || 'Promo Code & Discount Voucher 2026 | GenZ Time'}
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {metaDescription || description || 'Verified tech discount and promo code tested by GenZ Time lab team. 100% working.'}
                      </div>
                    </div>
                  </div>

                  {/* Active & Featured Switches */}
                  <div className="flex items-center gap-6 pt-2">
                    <label className="flex items-center gap-2 text-xs font-mono text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isActive}
                        onChange={(e) => setIsActive(e.target.checked)}
                        className="w-4 h-4 rounded accent-emerald-400 cursor-pointer"
                      />
                      <span>Active on Public Site</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs font-mono text-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isFeatured}
                        onChange={(e) => setIsFeatured(e.target.checked)}
                        className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
                      />
                      <span>Feature at Top</span>
                    </label>
                  </div>
                </div>

                {/* Right Column: Live Card Preview */}
                <div className="space-y-3">
                  <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold block">
                    Live Visitor Card Preview
                  </span>
                  <div className="p-4 rounded-3xl bg-tech-900/30 border border-slate-800">
                    <PromoCard deal={previewDeal} />
                  </div>
                  <p className="text-[11px] font-mono text-slate-500 text-center">
                    This is the exact interactive card rendered on <span className="text-tech-cyan">/deals</span>.
                  </p>
                </div>
              </div>

              {/* Modal Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl font-bold font-mono text-xs text-tech-950 bg-gradient-to-r from-emerald-400 to-tech-cyan shadow-glow flex items-center gap-2 hover:opacity-95 transition disabled:opacity-50"
                >
                  <Check className="w-4 h-4" />
                  <span>{saving ? 'Saving...' : editingDeal ? 'Update Deal' : 'Publish Deal'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
