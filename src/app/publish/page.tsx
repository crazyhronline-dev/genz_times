'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import AdminGuard from '@/components/AdminGuard';
import { calculateSeoScore } from '@/lib/seo';
import { checkPlagiarism, removePlagiarismAndHumanize } from '@/lib/plagiarism';
import { evaluateEeat } from '@/lib/eeat';
import { generateHighLevelSeo } from '@/lib/auto-seo';
import { BlogPost, GadgetSpecs } from '@/types/blog';
import { 
  Sparkles, 
  Send, 
  Image as ImageIcon, 
  Tag, 
  Cpu, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Sliders, 
  Plus, 
  Trash2, 
  Eye, 
  ExternalLink, 
  Edit3, 
  Check, 
  Globe, 
  Smartphone, 
  Monitor,
  Star,
  Wand2,
  ShieldCheck,
  ShieldAlert,
  Zap,
  FileSearch,
  CheckCheck,
  RefreshCw,
  BarChart2
} from 'lucide-react';

const PRESET_IMAGES = [
  { name: 'Smartphone', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1400&q=80' },
  { name: 'VR Headset', url: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1400&q=80' },
  { name: 'Laptop / PC', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80' },
  { name: 'Audio / ANC', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1400&q=80' },
  { name: 'Drone Cine', url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1400&q=80' },
  { name: 'AI Wearable', url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1400&q=80' },
];

export default function PublishStudioPage() {
  const router = useRouter();

  // Active tab: 'create' | 'manage'
  const [activeTab, setActiveTab] = useState<'create' | 'manage'>('create');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [categorySlug, setCategorySlug] = useState('smartphones');
  const [excerpt, setExcerpt] = useState('');
  const [featuredImage, setFeaturedImage] = useState(PRESET_IMAGES[0].url);
  const [tagsInput, setTagsInput] = useState('Flagship, AI Gadgets, Benchmarks');
  const [authorName, setAuthorName] = useState('GenZ Editorial Team');
  const [authorRole, setAuthorRole] = useState('Editor-in-Chief & Lead Hardware Analyst');

  // Specs state
  const [specs, setSpecs] = useState<GadgetSpecs>({
    display: '',
    processor: '',
    ram: '',
    storage: '',
    battery: '',
    camera: '',
    os: '',
    price: '',
    weight: '',
  });

  // Pros & Cons
  const [pros, setPros] = useState<string[]>(['Breakthrough hardware efficiency', 'Class-leading build quality']);
  const [cons, setCons] = useState<string[]>(['Premium flagship pricing']);
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');

  // Verdict & Score
  const [verdictScore, setVerdictScore] = useState(9.2);
  const [verdictSummary, setVerdictSummary] = useState('An exceptional piece of consumer technology that pushes the envelope in its category.');

  // Content
  const [content, setContent] = useState(`## Unboxing & First Impressions\n\nWhen we first unboxed the device in our testing lab, the industrial craftsmanship stood out immediately.\n\n### Display & Visual Architecture\n\nThe panel reaches peak luminance with vibrant color gamut accuracy across DCI-P3 standards.\n\n### Silicon Performance & Benchmarks\n\nIn our synthetic compute and thermal stress benchmarks, the processor sustained peak clocks without noticeable throttling.\n\n### Battery & Daily Efficiency\n\nReal-world battery tests comfortably lasted through our standardized 14-hour mixed-use battery protocol.`);

  // SEO Fields
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // Manage Posts state
  const [existingPosts, setExistingPosts] = useState<BlogPost[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');

  // Auto-generate slug and meta title when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom) {
      const generated = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
    if (!metaTitle || metaTitle.startsWith(title)) {
      setMetaTitle(val ? `${val} | GenZ Time Review` : '');
    }
  };

  // Auto-fill meta description when excerpt changes
  const handleExcerptChange = (val: string) => {
    setExcerpt(val);
    if (!metaDescription || metaDescription.startsWith(excerpt)) {
      setMetaDescription(val);
    }
  };

  const [toastNotification, setToastNotification] = useState('');

  // Calculate Real-Time SEO score
  const seoAnalysis = useMemo(() => {
    return calculateSeoScore({
      title,
      metaTitle,
      metaDescription,
      focusKeyword,
      content,
      slug,
      featuredImage,
    });
  }, [title, metaTitle, metaDescription, focusKeyword, content, slug, featuredImage]);

  // Calculate Real-Time Plagiarism & Originality
  const plagiarismResult = useMemo(() => {
    return checkPlagiarism(content);
  }, [content]);

  // Calculate Real-Time Google E-E-A-T Quality Audit
  const eeatAudit = useMemo(() => {
    return evaluateEeat({
      title,
      content,
      authorName,
      authorBio: 'Gadget architect and tech journalist testing cutting-edge consumer hardware and spatial devices for over 8 years.',
      specs,
      pros,
      cons,
      verdictScore,
    });
  }, [title, content, authorName, specs, pros, cons, verdictScore]);

  // Auto-Generate High-Level Genuine SEO Package
  const handleAutoSeo = () => {
    const currentCat = CATEGORIES.find((c) => c.slug === categorySlug);
    const pkg = generateHighLevelSeo({
      title: title || 'Tech Gadget Review',
      category: currentCat ? currentCat.name : 'Tech Gadgets',
      content,
      specs,
      authorName,
    });

    setFocusKeyword(pkg.focusKeyword);
    setTagsInput(pkg.tags.join(', '));
    setMetaTitle(pkg.metaTitle);
    setMetaDescription(pkg.metaDescription);
    if (!isSlugCustom) {
      setSlug(pkg.slug);
    }

    setToastNotification('⚡ High-Level SEO, Genuine Keywords & Meta Tags Auto-Generated!');
    setTimeout(() => setToastNotification(''), 4000);
  };

  // Remove Plagiarism & Humanize Content
  const handleRemovePlagiarism = () => {
    if (plagiarismResult.matches.length === 0) {
      setToastNotification('✓ Content is already 100% original and verified authentic!');
      setTimeout(() => setToastNotification(''), 3000);
      return;
    }
    const { rewrittenContent, changesCount } = removePlagiarismAndHumanize(content, plagiarismResult.matches);
    setContent(rewrittenContent);
    setToastNotification(`🪄 Humanized ${changesCount} passages! Replaced generic PR boilerplate with authentic hardware lab insights.`);
    setTimeout(() => setToastNotification(''), 4000);
  };

  // Fetch posts for manage tab
  const fetchPosts = async () => {
    setLoadingPosts(true);
    try {
      const res = await fetch('/api/posts');
      const data = await res.json();
      if (data.success) {
        setExistingPosts(data.posts);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingPosts(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const addPro = () => {
    if (newPro.trim()) {
      setPros([...pros, newPro.trim()]);
      setNewPro('');
    }
  };

  const removePro = (index: number) => {
    setPros(pros.filter((_, i) => i !== index));
  };

  const addCon = () => {
    if (newCon.trim()) {
      setCons([...cons, newCon.trim()]);
      setNewCon('');
    }
  };

  const removeCon = (index: number) => {
    setCons(cons.filter((_, i) => i !== index));
  };

  // Edit existing post
  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSlug(post.slug);
    setIsSlugCustom(true);
    setCategorySlug(post.categorySlug);
    setExcerpt(post.excerpt);
    setFeaturedImage(post.featuredImage);
    setTagsInput(post.tags.join(', '));
    setAuthorName(post.author.name);
    setAuthorRole(post.author.role);
    setSpecs(post.specs || {});
    setPros(post.pros || []);
    setCons(post.cons || []);
    setVerdictScore(post.verdictScore || 9.0);
    setVerdictSummary(post.verdictSummary || '');
    setContent(post.content);
    setFocusKeyword(post.seo?.focusKeyword || '');
    setMetaTitle(post.seo?.metaTitle || post.title);
    setMetaDescription(post.seo?.metaDescription || post.excerpt);
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete post
  const handleDelete = async (id: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to permanently delete "${postTitle}"?`)) return;
    try {
      const res = await fetch(`/api/posts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setExistingPosts(existingPosts.filter((p) => p.id !== id));
      }
    } catch (e) {
      alert('Error deleting post');
    }
  };

  // Reset form
  const handleResetForm = () => {
    setEditingId(null);
    setTitle('');
    setSlug('');
    setIsSlugCustom(false);
    setExcerpt('');
    setFeaturedImage(PRESET_IMAGES[0].url);
    setTagsInput('Flagship, AI Gadgets, Benchmarks');
    setSpecs({
      display: '',
      processor: '',
      ram: '',
      storage: '',
      battery: '',
      camera: '',
      os: '',
      price: '',
      weight: '',
    });
    setPros(['Breakthrough hardware efficiency']);
    setCons(['Premium flagship pricing']);
    setVerdictScore(9.2);
    setVerdictSummary('An exceptional piece of consumer technology.');
    setFocusKeyword('');
    setMetaTitle('');
    setMetaDescription('');
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in at least the Title and Article Content.');
      return;
    }

    setSubmitting(true);
    setSuccessMessage('');

    const categoryObj = CATEGORIES.find((c) => c.slug === categorySlug);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    const payload: Partial<BlogPost> & { title: string; content: string } = {
      id: editingId || undefined,
      title,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: excerpt || content.slice(0, 160) + '...',
      content,
      featuredImage,
      category: categoryObj ? categoryObj.name : 'Smartphones',
      categorySlug,
      tags,
      author: {
        name: authorName || 'GenZ Editorial Team',
        role: authorRole || 'Editor-in-Chief & Lead Hardware Analyst',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Gadget architect and tech journalist testing cutting-edge consumer hardware and spatial devices for over 8 years.',
      },
      verdictScore: Number(verdictScore),
      verdictSummary,
      pros,
      cons,
      specs,
      seo: {
        metaTitle: metaTitle || `${title} | GenZ Time`,
        metaDescription: metaDescription || excerpt,
        focusKeyword,
        canonicalUrl: `https://genztime.com/blog/${slug}`,
        ogImage: featuredImage,
      },
      eeatScore: eeatAudit.overallScore,
      originalityScore: plagiarismResult.originalityScore,
    };

    try {
      const url = editingId ? `/api/posts/${editingId}` : '/api/posts';
      const method = editingId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        setSuccessMessage(editingId ? 'Article updated successfully!' : 'Article published live to GenZ Time!');
        fetchPosts();
        setTimeout(() => {
          router.push(`/blog/${data.post.slug}`);
        }, 1200);
      } else {
        alert(data.error || 'Failed to publish post');
      }
    } catch (e) {
      console.error(e);
      alert('Network or server error while publishing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider mb-2 bg-tech-cyan/15 text-tech-cyan border border-tech-cyan/30">
            <Cpu className="w-3.5 h-3.5" />
            <span>GenZ Time CMS Studio</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">
            Publish & Manage Hardware Reviews
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Publish tech gadgets with rich specs, pros/cons, and real-time Google SEO optimization.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-tech-900 p-1.5 rounded-xl border border-slate-800 self-start sm:self-center">
          <button
            onClick={() => setActiveTab('create')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition ${
              activeTab === 'create'
                ? 'bg-tech-cyan text-tech-950 shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {editingId ? 'Editing Article' : 'New Article'}
          </button>
          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 py-2 rounded-lg text-xs font-mono font-semibold transition ${
              activeTab === 'manage'
                ? 'bg-tech-cyan text-tech-950 shadow-glow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Manage Published ({existingPosts.length})
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="p-4 rounded-2xl bg-tech-emerald/20 border border-tech-emerald/40 text-tech-emerald font-bold flex items-center gap-3">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{successMessage} Redirecting to live post...</span>
        </div>
      )}

      {toastNotification && (
        <div className="p-4 rounded-2xl bg-tech-cyan/15 border border-tech-cyan/40 text-tech-cyan text-xs font-mono font-semibold flex items-center justify-between gap-3 shadow-glow animate-pulse">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{toastNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastNotification('')}
            className="text-slate-400 hover:text-white px-2 py-0.5 rounded bg-white/5"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* TAB 1: CREATE / EDIT POST */}
      {activeTab === 'create' && (
        <div className="space-y-6">
          {/* Smart Editorial & SEO Toolbar */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-tech-950 via-tech-900 to-tech-950 border border-tech-cyan/30 shadow-glow flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-tech-cyan/15 text-tech-cyan border border-tech-cyan/30 flex-shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <span>Smart SEO & Authenticity Engine</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-tech-emerald/15 text-tech-emerald border border-tech-emerald/30">
                    AI & Lab Verified
                  </span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  Auto-generate genuine keywords, meta tags, and eliminate PR boilerplate duplicates.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <button
                type="button"
                onClick={handleAutoSeo}
                className="flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-mono font-bold bg-tech-cyan/15 hover:bg-tech-cyan/25 border border-tech-cyan/40 text-tech-cyan transition flex items-center justify-center gap-1.5 active:scale-95 shadow-sm"
                title="Automatically derive target keyword, 6+ LSI tags, optimal Meta Title & Description from article text"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Auto-Generate SEO & Keywords</span>
              </button>

              <button
                type="button"
                onClick={handleRemovePlagiarism}
                disabled={plagiarismResult.flaggedCount === 0}
                className={`flex-1 md:flex-initial px-4 py-2.5 rounded-xl text-xs font-mono font-bold transition flex items-center justify-center gap-1.5 active:scale-95 border ${
                  plagiarismResult.flaggedCount > 0
                    ? 'bg-tech-emerald/15 hover:bg-tech-emerald/25 border-tech-emerald/40 text-tech-emerald'
                    : 'bg-white/5 border-slate-800 text-slate-500 cursor-not-allowed'
                }`}
                title={plagiarismResult.flaggedCount > 0 ? 'Rewrite and humanize flagged PR boilerplates' : 'Content is already 100% original'}
              >
                <CheckCheck className="w-3.5 h-3.5" />
                <span>
                  {plagiarismResult.flaggedCount > 0
                    ? `Humanize Text (${plagiarismResult.flaggedCount} Flags)`
                    : '100% Original Content'}
                </span>
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Form Body: 8 Cols */}
            <div className="lg:col-span-8 space-y-6">
            
            {/* Primary Details Card */}
            <div className="p-6 rounded-3xl bg-tech-900/70 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-tech-cyan" />
                <span>Article Title & URL Permalink</span>
              </h2>

              {/* Title */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Gadget Review Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. Sony WH-1000XM6 Review: Next-Gen ANC & Audiophile Acoustic Engineering"
                  className="w-full px-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white placeholder-slate-500 text-base focus:outline-none focus:border-tech-cyan"
                />
              </div>

              {/* Slug */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-400">
                    URL Slug (Permalink)
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsSlugCustom(!isSlugCustom)}
                    className="text-[11px] font-mono text-tech-cyan hover:underline"
                  >
                    {isSlugCustom ? 'Auto-generate from Title' : 'Edit Manually'}
                  </button>
                </div>
                <div className="flex items-center rounded-xl bg-tech-950 border border-slate-700 overflow-hidden px-3">
                  <span className="text-xs font-mono text-slate-500 select-none">/blog/</span>
                  <input
                    type="text"
                    value={slug}
                    readOnly={!isSlugCustom}
                    onChange={(e) => setSlug(e.target.value)}
                    className="w-full py-2.5 px-1 bg-transparent text-slate-200 text-xs font-mono focus:outline-none"
                  />
                </div>
              </div>

              {/* Category & Excerpt */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Gadget Category Selection *
                  </label>
                  <select
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-tech-cyan"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                    Keywords / Tags (Comma Separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="e.g. Flagship, ANC, Battery Life, 4K"
                    className="w-full px-4 py-3 rounded-xl bg-tech-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-tech-cyan"
                  />
                </div>
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Summary Excerpt (Lead Paragraph)
                </label>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => handleExcerptChange(e.target.value)}
                  placeholder="Concise 1-2 sentence executive summary of the hardware review..."
                  className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-sm focus:outline-none focus:border-tech-cyan resize-none"
                />
              </div>
            </div>

            {/* Featured Image Selector */}
            <div className="p-6 rounded-3xl bg-tech-900/70 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-tech-cyan" />
                <span>Featured Hero Image</span>
              </h2>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={featuredImage}
                  onChange={(e) => setFeaturedImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-tech-cyan"
                />
              </div>

              {/* Presets */}
              <div>
                <span className="text-[11px] font-mono text-slate-400 block mb-2">
                  Or select high-resolution tech preset:
                </span>
                <div className="flex flex-wrap gap-2">
                  {PRESET_IMAGES.map((preset) => (
                    <button
                      key={preset.name}
                      type="button"
                      onClick={() => setFeaturedImage(preset.url)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono border transition ${
                        featuredImage === preset.url
                          ? 'bg-tech-cyan/20 border-tech-cyan text-tech-cyan'
                          : 'bg-tech-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Preview */}
              {featuredImage && (
                <div className="relative rounded-2xl overflow-hidden aspect-[16/7] border border-slate-800 bg-tech-950">
                  <img
                    src={featuredImage}
                    alt="Featured Image Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as any).src = PRESET_IMAGES[0].url;
                    }}
                  />
                  <span className="absolute bottom-2 right-2 text-[10px] font-mono bg-tech-950/80 px-2 py-0.5 rounded text-white">
                    Live Preview
                  </span>
                </div>
              )}
            </div>

            {/* Hardware Specifications Builder */}
            <div className="p-6 rounded-3xl bg-tech-900/70 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-tech-cyan" />
                <span>Gadget Specifications Sheet</span>
              </h2>
              <p className="text-xs text-slate-400">
                These specs will be cleanly displayed in the interactive lab card on the article page.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Display</label>
                  <input
                    type="text"
                    value={specs.display || ''}
                    onChange={(e) => setSpecs({ ...specs, display: e.target.value })}
                    placeholder="e.g. 6.8-inch AMOLED 144Hz"
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Processor</label>
                  <input
                    type="text"
                    value={specs.processor || ''}
                    onChange={(e) => setSpecs({ ...specs, processor: e.target.value })}
                    placeholder="e.g. Snapdragon 8 Elite / M4"
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">RAM / Memory</label>
                  <input
                    type="text"
                    value={specs.ram || ''}
                    onChange={(e) => setSpecs({ ...specs, ram: e.target.value })}
                    placeholder="e.g. 16GB LPDDR5X"
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Storage</label>
                  <input
                    type="text"
                    value={specs.storage || ''}
                    onChange={(e) => setSpecs({ ...specs, storage: e.target.value })}
                    placeholder="e.g. 512GB UFS 4.1"
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Battery / Charging</label>
                  <input
                    type="text"
                    value={specs.battery || ''}
                    onChange={(e) => setSpecs({ ...specs, battery: e.target.value })}
                    placeholder="e.g. 5,000mAh, 65W fast charge"
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Camera System</label>
                  <input
                    type="text"
                    value={specs.camera || ''}
                    onChange={(e) => setSpecs({ ...specs, camera: e.target.value })}
                    placeholder="e.g. 200MP Main + 50MP Periscope"
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">OS / Platform</label>
                  <input
                    type="text"
                    value={specs.os || ''}
                    onChange={(e) => setSpecs({ ...specs, os: e.target.value })}
                    placeholder="e.g. Android 15 / visionOS 3.0"
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Retail Price</label>
                  <input
                    type="text"
                    value={specs.price || ''}
                    onChange={(e) => setSpecs({ ...specs, price: e.target.value })}
                    placeholder="e.g. $1,199 USD"
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">Weight</label>
                  <input
                    type="text"
                    value={specs.weight || ''}
                    onChange={(e) => setSpecs({ ...specs, weight: e.target.value })}
                    placeholder="e.g. 219g / 440g"
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>
              </div>
            </div>

            {/* Pros & Cons Builder */}
            <div className="p-6 rounded-3xl bg-tech-900/70 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-tech-cyan" />
                <span>Pros & Cons Comparison</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Pros List */}
                <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/20 space-y-2">
                  <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block font-mono">
                    The Good ({pros.length})
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newPro}
                      onChange={(e) => setNewPro(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addPro();
                        }
                      }}
                      placeholder="Add an advantage..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-tech-950 border border-emerald-500/30 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addPro}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500 text-tech-950 text-xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ul className="space-y-1.5 pt-2">
                    {pros.map((p, idx) => (
                      <li key={idx} className="flex items-center justify-between text-xs text-slate-200 bg-tech-950/60 px-2.5 py-1.5 rounded-lg">
                        <span className="truncate pr-2">• {p}</span>
                        <button type="button" onClick={() => removePro(idx)} className="text-slate-500 hover:text-rose-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons List */}
                <div className="p-4 rounded-2xl bg-rose-950/20 border border-rose-500/20 space-y-2">
                  <span className="text-xs font-bold text-rose-400 uppercase tracking-wider block font-mono">
                    The Bad ({cons.length})
                  </span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCon}
                      onChange={(e) => setNewCon(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addCon();
                        }
                      }}
                      placeholder="Add a drawback..."
                      className="flex-1 px-3 py-1.5 rounded-lg bg-tech-950 border border-rose-500/30 text-xs text-white placeholder-slate-500 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={addCon}
                      className="px-3 py-1.5 rounded-lg bg-rose-500 text-tech-950 text-xs font-bold"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <ul className="space-y-1.5 pt-2">
                    {cons.map((c, idx) => (
                      <li key={idx} className="flex items-center justify-between text-xs text-slate-200 bg-tech-950/60 px-2.5 py-1.5 rounded-lg">
                        <span className="truncate pr-2">• {c}</span>
                        <button type="button" onClick={() => removeCon(idx)} className="text-slate-500 hover:text-rose-400">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Verdict Score & Summary */}
            <div className="p-6 rounded-3xl bg-tech-900/70 border border-slate-800 space-y-4">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Star className="w-4 h-4 text-tech-cyan" />
                <span>GenZ Time Score & Verdict Summary</span>
              </h2>

              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="flex items-center gap-4 w-full sm:w-auto">
                  <input
                    type="range"
                    min="1.0"
                    max="10.0"
                    step="0.1"
                    value={verdictScore}
                    onChange={(e) => setVerdictScore(parseFloat(e.target.value))}
                    className="flex-1 sm:w-48 accent-tech-cyan"
                  />
                  <span className="text-2xl font-black font-mono text-tech-cyan bg-tech-950 px-3 py-1 rounded-xl border border-tech-cyan/30">
                    {verdictScore.toFixed(1)}
                  </span>
                </div>
                <div className="flex-1 w-full">
                  <input
                    type="text"
                    value={verdictSummary}
                    onChange={(e) => setVerdictSummary(e.target.value)}
                    placeholder="Short 1-sentence bottom-line verdict..."
                    className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>
              </div>
            </div>

            {/* Main Article Content Editor */}
            <div className="p-6 rounded-3xl bg-tech-900/70 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Edit3 className="w-4 h-4 text-tech-cyan" />
                  <span>Article Body Content *</span>
                </h2>
                <span className="text-xs font-mono text-slate-400">
                  Markdown Supported (## H2, ### H3, - bullets, **bold**)
                </span>
              </div>
              <textarea
                rows={12}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-4 py-3.5 rounded-xl bg-tech-950 border border-slate-700 text-white font-mono text-sm leading-relaxed focus:outline-none focus:border-tech-cyan resize-y"
              />
            </div>

          </div>

          {/* Sidebar SEO & Live Previews: 4 Cols */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Action Bar */}
            <div className="p-6 rounded-3xl bg-tech-900 border border-slate-800 shadow-xl space-y-3 sticky top-24">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                Publishing Controls
              </h3>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm text-tech-950 bg-gradient-to-r from-tech-cyan to-tech-emerald shadow-glow hover:opacity-90 transition transform active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Publishing Post...' : editingId ? 'Update Article' : 'Publish Article Live'}</span>
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={handleResetForm}
                  className="w-full py-2.5 px-4 rounded-xl text-xs font-mono text-slate-400 hover:text-white bg-white/5 transition"
                >
                  Cancel Edit & Start New
                </button>
              )}

              {/* Live SEO Score Gauge */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-semibold uppercase text-slate-300">
                    SEO Ranking Health
                  </span>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                      seoAnalysis.score >= 80
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : seoAnalysis.score >= 50
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}
                  >
                    {seoAnalysis.score}%
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full h-2 rounded-full bg-tech-950 overflow-hidden mb-3">
                  <div
                    className={`h-full transition-all duration-500 ${
                      seoAnalysis.score >= 80
                        ? 'bg-tech-emerald'
                        : seoAnalysis.score >= 50
                        ? 'bg-tech-amber'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${seoAnalysis.score}%` }}
                  />
                </div>

                {/* SEO Checklist */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {seoAnalysis.checklist.map((chk, i) => (
                    <div key={i} className="flex items-start gap-2 text-[11px]">
                      {chk.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-tech-emerald flex-shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-3.5 h-3.5 text-slate-500 flex-shrink-0 mt-0.5" />
                      )}
                      <span className={chk.passed ? 'text-slate-300' : 'text-slate-500'}>
                        {chk.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-Time Google E-E-A-T Quality Card */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-tech-cyan" />
                    <span className="text-xs font-mono font-bold uppercase text-white">
                      Google E-E-A-T Quality
                    </span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      eeatAudit.overallScore >= 80
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : eeatAudit.overallScore >= 60
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border-rose-500/30'
                    }`}
                  >
                    {eeatAudit.overallScore}/100
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
                  <div className="p-2 rounded-lg bg-tech-950 border border-slate-800">
                    <span className="text-slate-400 block">Experience</span>
                    <span className="font-bold text-tech-cyan text-xs">{eeatAudit.experienceScore}/25</span>
                  </div>
                  <div className="p-2 rounded-lg bg-tech-950 border border-slate-800">
                    <span className="text-slate-400 block">Expertise</span>
                    <span className="font-bold text-tech-emerald text-xs">{eeatAudit.expertiseScore}/25</span>
                  </div>
                  <div className="p-2 rounded-lg bg-tech-950 border border-slate-800">
                    <span className="text-slate-400 block">Authority</span>
                    <span className="font-bold text-tech-violet text-xs">{eeatAudit.authorityScore}/25</span>
                  </div>
                  <div className="p-2 rounded-lg bg-tech-950 border border-slate-800">
                    <span className="text-slate-400 block">Trust</span>
                    <span className="font-bold text-amber-400 text-xs">{eeatAudit.trustScore}/25</span>
                  </div>
                </div>

                {eeatAudit.actionableImprovements.length > 0 && (
                  <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] text-amber-300 font-sans leading-snug">
                    <span className="font-bold font-mono text-[10px] uppercase block mb-0.5">E-E-A-T Tip:</span>
                    {eeatAudit.actionableImprovements[0]}
                  </div>
                )}
              </div>

              {/* Real-Time Plagiarism & Originality Card */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FileSearch className="w-4 h-4 text-tech-emerald" />
                    <span className="text-xs font-mono font-bold uppercase text-white">
                      Plagiarism & Originality
                    </span>
                  </div>
                  <span
                    className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                      plagiarismResult.originalityScore >= 85
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                    }`}
                  >
                    {plagiarismResult.originalityScore}% Unique
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-tech-950 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      plagiarismResult.originalityScore >= 85 ? 'bg-tech-emerald' : 'bg-amber-500'
                    }`}
                    style={{ width: `${plagiarismResult.originalityScore}%` }}
                  />
                </div>

                {plagiarismResult.flaggedCount > 0 ? (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-amber-400">
                      <span>{plagiarismResult.flaggedCount} boilerplate phrasing flagged</span>
                      <button
                        type="button"
                        onClick={handleRemovePlagiarism}
                        className="text-tech-cyan hover:underline flex items-center gap-1"
                      >
                        <Wand2 className="w-3 h-3" />
                        <span>Fix All</span>
                      </button>
                    </div>

                    <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 text-[10px]">
                      {plagiarismResult.matches.map((m) => (
                        <div key={m.id} className="p-2 rounded-lg bg-tech-950 border border-rose-500/20 text-slate-300">
                          <span className="px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[9px] mr-1">
                            {m.matchedCategory}
                          </span>
                          <p className="line-clamp-2 mt-1 text-slate-400 italic">
                            &quot;{m.originalSentence}&quot;
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-[11px] text-tech-emerald font-mono p-2 rounded-lg bg-tech-emerald/10 border border-tech-emerald/20">
                    <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>0 duplicate or boilerplate phrases detected!</span>
                  </div>
                )}
              </div>

              {/* SEO Meta Fields */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-tech-cyan uppercase font-mono">
                  Search Engine Meta Tags
                </h4>

                <div>
                  <label className="block text-[11px] font-mono text-slate-400 mb-1">
                    Focus Target Keyword
                  </label>
                  <input
                    type="text"
                    value={focusKeyword}
                    onChange={(e) => setFocusKeyword(e.target.value)}
                    placeholder="e.g. Sony WH-1000XM6 review"
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Meta Title</span>
                    <span className={metaTitle.length >= 40 && metaTitle.length <= 65 ? 'text-tech-emerald' : 'text-slate-500'}>
                      {metaTitle.length}/65 chars
                    </span>
                  </div>
                  <input
                    type="text"
                    value={metaTitle}
                    onChange={(e) => setMetaTitle(e.target.value)}
                    placeholder="Google Search Title Tag..."
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                    <span>Meta Description</span>
                    <span className={metaDescription.length >= 120 && metaDescription.length <= 165 ? 'text-tech-emerald' : 'text-slate-500'}>
                      {metaDescription.length}/160 chars
                    </span>
                  </div>
                  <textarea
                    rows={3}
                    value={metaDescription}
                    onChange={(e) => setMetaDescription(e.target.value)}
                    placeholder="Search snippet description shown on Google results..."
                    className="w-full px-3 py-2 rounded-lg bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan resize-none"
                  />
                </div>
              </div>

              {/* Real-Time Google SERP Snippet Preview */}
              <div className="pt-4 border-t border-slate-800">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-slate-400 uppercase">
                    Google SERP Preview
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('desktop')}
                      className={`p-1 rounded ${previewDevice === 'desktop' ? 'bg-white/10 text-tech-cyan' : 'text-slate-500'}`}
                    >
                      <Monitor className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewDevice('mobile')}
                      className={`p-1 rounded ${previewDevice === 'mobile' ? 'bg-white/10 text-tech-cyan' : 'text-slate-500'}`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Simulated Google Search Result */}
                <div className="p-3 rounded-xl bg-white text-slate-900 text-left font-sans shadow-md border border-slate-300">
                  <div className="flex items-center gap-1.5 text-[11px] text-[#202124] mb-0.5 truncate">
                    <span className="w-3.5 h-3.5 rounded-full bg-tech-950 flex items-center justify-center text-[7px] text-tech-cyan font-mono font-bold">
                      G
                    </span>
                    <span className="truncate">genztime.com &gt; blog &gt; {slug || 'your-slug'}</span>
                  </div>
                  <h5 className="text-[#1a0dab] hover:underline text-sm font-medium leading-snug line-clamp-1 cursor-pointer">
                    {metaTitle || title || 'GenZ Time Gadget Review Headline'}
                  </h5>
                  <div className="flex items-center gap-1 text-[11px] text-[#4d5156] my-0.5">
                    <span className="text-[#e37400]">★★★★★</span>
                    <span>Rating: {verdictScore.toFixed(1)}/10</span>
                  </div>
                  <p className="text-[12px] text-[#4d5156] line-clamp-2 leading-relaxed">
                    {metaDescription || excerpt || 'Detailed hardware analysis, benchmarks, camera shootout, and lab verdict on GenZ Time.'}
                  </p>
                </div>
              </div>

            </div>

          </div>

        </form>
        </div>
      )}

      {/* TAB 2: MANAGE EXISTING POSTS */}
      {activeTab === 'manage' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-white">All Published Gadget Articles</h2>
            <button
              onClick={handleResetForm}
              className="px-4 py-2 rounded-xl bg-tech-cyan text-tech-950 text-xs font-bold font-mono shadow-glow"
            >
              + Write New Post
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {existingPosts.map((post) => (
              <div
                key={post.id}
                className="p-5 rounded-2xl bg-tech-900/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:border-slate-700 transition"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={post.featuredImage}
                    alt={post.title}
                    className="w-16 h-16 rounded-xl object-cover border border-slate-700 flex-shrink-0"
                  />
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
                        {post.category}
                      </span>
                      <span className="text-xs font-mono text-tech-emerald font-bold">
                        ★ {post.verdictScore}/10
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{post.title}</h3>
                    <p className="text-xs font-mono text-slate-400">
                      /blog/{post.slug} • {post.readingTime}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  <Link
                    href={`/blog/${post.slug}`}
                    target="_blank"
                    className="p-2 rounded-lg bg-white/5 text-slate-300 hover:text-tech-cyan transition"
                    title="View Live Article"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleEdit(post)}
                    className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white text-xs font-mono transition"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    className="p-2 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 transition"
                    title="Delete Post"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      </div>
    </AdminGuard>
  );
}
