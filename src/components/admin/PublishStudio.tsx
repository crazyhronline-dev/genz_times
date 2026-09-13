'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CATEGORIES } from '@/lib/categories';
import { calculateSeoScore } from '@/lib/seo';
import { checkPlagiarism, removePlagiarismAndHumanize } from '@/lib/plagiarism';
import { evaluateEeat } from '@/lib/eeat';
import { generateHighLevelSeo } from '@/lib/auto-seo';
import { applyWatermark, WatermarkOptions } from '@/lib/watermark';
import { BlogPost, GadgetSpecs, ComparedGadget } from '@/types/blog';
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
  Zap,
  FileSearch,
  Upload,
  FileUp,
  FileText,
  HelpCircle,
  Link as LinkIcon,
  ListPlus,
  Quote,
  Heading2,
  Heading3,
  Bold,
  List,
  Layers,
  Award,
  Scale,
  Copy,
  Trophy
} from 'lucide-react';
import { getCategorySpecConfig } from '@/lib/category-specs';

const PRESET_IMAGES = [
  { name: 'Smartphone', url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&w=1400&q=80' },
  { name: 'VR Headset', url: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=1400&q=80' },
  { name: 'Laptop / PC', url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=1400&q=80' },
  { name: 'Audio / ANC', url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=1400&q=80' },
  { name: 'Drone Cine', url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1400&q=80' },
  { name: 'AI Wearable', url: 'https://images.unsplash.com/photo-1531746790731-6c087fecd65a?auto=format&fit=crop&w=1400&q=80' },
];

interface PublishStudioProps {
  initialEditingId?: string | null;
  onPostSaved?: () => void;
  hideTopNav?: boolean;
}

export default function PublishStudio({
  initialEditingId,
  onPostSaved,
  hideTopNav = false,
}: PublishStudioProps = {}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Active post type: 'article' (news/guide/explainer) vs 'review' (hardware lab benchmark)
  const [postType, setPostType] = useState<'article' | 'review'>('article');
  const [editingId, setEditingId] = useState<string | null>(initialEditingId || null);
  const [availableCategories, setAvailableCategories] = useState(CATEGORIES);

  useEffect(() => {
    fetch('/api/categories')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.categories?.length > 0) {
          setAvailableCategories(data.categories);
        }
      })
      .catch(console.error);
  }, []);

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugCustom, setIsSlugCustom] = useState(false);
  const [categorySlug, setCategorySlug] = useState('smartphones');
  const currentSpecConfig = getCategorySpecConfig(categorySlug);
  const [excerpt, setExcerpt] = useState('');
  const [tagsInput, setTagsInput] = useState('Tech, GenZ, NextGen');
  const [authorName, setAuthorName] = useState('GenZ Editorial Team');
  const [authorRole, setAuthorRole] = useState('Senior Tech Analyst & Hardware Reviewer');

  // Featured Image State
  const [imageMode, setImageMode] = useState<'upload' | 'url' | 'presets'>('upload');
  const [featuredImage, setFeaturedImage] = useState(PRESET_IMAGES[0].url);
  const [featuredImageAlt, setFeaturedImageAlt] = useState('');
  const [isAltManuallyEdited, setIsAltManuallyEdited] = useState(false);
  const [watermarking, setWatermarking] = useState(false);
  const [watermarkPosition, setWatermarkPosition] = useState<'bottom-right' | 'bottom-left' | 'top-right'>('bottom-right');
  const [watermarkNotice, setWatermarkNotice] = useState<string | null>(null);

  const generateAutoAlt = (currentTitle: string, currentCategory?: string, extraHint?: string) => {
    const cleanTitle = (currentTitle || '').replace(/^(Review:\s*|Benchmark:\s*|Shootout:\s*|Tested:\s*)/i, '').trim();
    if (cleanTitle) {
      if (extraHint) {
        return `${cleanTitle} - ${extraHint} | GenZ Time`;
      }
      return `${cleanTitle} hardware lab overview and specs testing - GenZ Time`;
    }
    if (extraHint) {
      return `${extraHint} hardware photography - GenZ Time`;
    }
    const catName = availableCategories.find((c) => c.slug === currentCategory)?.name || 'Tech Hardware';
    return `${catName} Lab Evaluation - GenZ Time`;
  };

  // Article-Specific State
  const [keyTakeaways, setKeyTakeaways] = useState<string[]>([
    'Breakthrough performance leaps over previous generation silicon',
    'Real-world power efficiency exceeds synthetic expectations',
  ]);
  const [newTakeaway, setNewTakeaway] = useState('');
  
  const [faqs, setFaqs] = useState<{ question: string; answer: string }[]>([]);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');

  const [sources, setSources] = useState<{ title: string; url: string }[]>([]);
  const [newSourceTitle, setNewSourceTitle] = useState('');
  const [newSourceUrl, setNewSourceUrl] = useState('');

  // Review-Specific State
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
  const [pros, setPros] = useState<string[]>(['Class-leading build quality', 'Breakthrough hardware efficiency']);
  const [cons, setCons] = useState<string[]>(['Premium flagship pricing']);
  const [newPro, setNewPro] = useState('');
  const [newCon, setNewCon] = useState('');
  const [verdictScore, setVerdictScore] = useState(9.2);
  const [verdictSummary, setVerdictSummary] = useState('An exceptional piece of technology delivering benchmark-topping capabilities.');

  // Multi-Product Comparison State (Hardware Reviews)
  const [isComparison, setIsComparison] = useState(false);
  const [comparedProducts, setComparedProducts] = useState<ComparedGadget[]>([
    {
      id: 'comp-1',
      name: 'Primary Gadget',
      badge: 'Overall Winner',
      verdictScore: 9.2,
      verdictSummary: 'An exceptional piece of technology delivering benchmark-topping capabilities.',
      specs: {
        processor: '',
        display: '',
        ram: '',
        storage: '',
        battery: '',
        camera: '',
        os: '',
        weight: '',
        price: '',
        connectivity: '',
      },
      pros: ['Class-leading build quality', 'Breakthrough hardware efficiency'],
      cons: ['Premium flagship pricing'],
    },
  ]);
  const [activeProductTab, setActiveProductTab] = useState(0);
  const [viewAllStacked, setViewAllStacked] = useState(false);
  const [newProInputs, setNewProInputs] = useState<Record<number, string>>({});
  const [newConInputs, setNewConInputs] = useState<Record<number, string>>({});

  const updateProduct = (index: number, updates: Partial<ComparedGadget>) => {
    setComparedProducts((prev) => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      copy[index] = { ...copy[index], ...updates };
      if (index === 0) {
        if (updates.specs) setSpecs(updates.specs);
        if (updates.pros) setPros(updates.pros);
        if (updates.cons) setCons(updates.cons);
        if (updates.verdictScore !== undefined) setVerdictScore(updates.verdictScore);
        if (updates.verdictSummary !== undefined) setVerdictSummary(updates.verdictSummary);
      }
      return copy;
    });
  };

  const updateProductSpec = (index: number, key: keyof GadgetSpecs, val: string) => {
    setComparedProducts((prev) => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      const newSpecs = { ...copy[index].specs, [key]: val };
      copy[index] = { ...copy[index], specs: newSpecs };
      if (index === 0) setSpecs(newSpecs);
      return copy;
    });
  };

  const addProductPro = (index: number) => {
    const text = (newProInputs[index] || '').trim();
    if (!text) return;
    setComparedProducts((prev) => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      const newPros = [...copy[index].pros, text];
      copy[index] = { ...copy[index], pros: newPros };
      if (index === 0) setPros(newPros);
      return copy;
    });
    setNewProInputs((prev) => ({ ...prev, [index]: '' }));
  };

  const removeProductPro = (index: number, proIdx: number) => {
    setComparedProducts((prev) => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      const newPros = copy[index].pros.filter((_, i) => i !== proIdx);
      copy[index] = { ...copy[index], pros: newPros };
      if (index === 0) setPros(newPros);
      return copy;
    });
  };

  const addProductCon = (index: number) => {
    const text = (newConInputs[index] || '').trim();
    if (!text) return;
    setComparedProducts((prev) => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      const newCons = [...copy[index].cons, text];
      copy[index] = { ...copy[index], cons: newCons };
      if (index === 0) setCons(newCons);
      return copy;
    });
    setNewConInputs((prev) => ({ ...prev, [index]: '' }));
  };

  const removeProductCon = (index: number, conIdx: number) => {
    setComparedProducts((prev) => {
      const copy = [...prev];
      if (!copy[index]) return prev;
      const newCons = copy[index].cons.filter((_, i) => i !== conIdx);
      copy[index] = { ...copy[index], cons: newCons };
      if (index === 0) setCons(newCons);
      return copy;
    });
  };

  const handleSelectCount = (count: number) => {
    if (count === 1) {
      setIsComparison(false);
      return;
    }
    setIsComparison(true);
    setComparedProducts((prev) => {
      const copy = [...prev];
      while (copy.length < count) {
        const nextIdx = copy.length + 1;
        copy.push({
          id: `comp-${Date.now()}-${nextIdx}`,
          name: `Compared Device #${nextIdx}`,
          badge: nextIdx === 2 ? 'Key Challenger' : nextIdx === 3 ? 'Alternative Value' : 'Contender',
          verdictScore: 8.8,
          verdictSummary: 'Solid performance with competitive trade-offs in its price tier.',
          specs: { ...(copy[0]?.specs || {}) },
          pros: ['Strong competitive value', 'Reliable performance'],
          cons: ['Minor thermal throttling under peak load'],
        });
      }
      return copy;
    });
    if (activeProductTab >= count) setActiveProductTab(0);
  };

  const handleAddComparedProduct = () => {
    setIsComparison(true);
    const nextIdx = comparedProducts.length + 1;
    const newProduct: ComparedGadget = {
      id: `comp-${Date.now()}-${nextIdx}`,
      name: `Compared Device #${nextIdx}`,
      badge: nextIdx === 2 ? 'Key Challenger' : nextIdx === 3 ? 'Alternative Value' : 'Contender',
      verdictScore: 8.9,
      verdictSummary: 'Competitive hardware package with notable class-leading features.',
      specs: { ...(comparedProducts[0]?.specs || {}) },
      pros: ['Impressive build and finish', 'Great ergonomics'],
      cons: ['Premium price point'],
    };
    setComparedProducts((prev) => [...prev, newProduct]);
    setActiveProductTab(comparedProducts.length);
    showToast(`Added Compared Device #${nextIdx}!`);
  };

  const handleRemoveComparedProduct = (index: number) => {
    if (comparedProducts.length <= 1) {
      setIsComparison(false);
      return;
    }
    const filtered = comparedProducts.filter((_, i) => i !== index);
    setComparedProducts(filtered);
    if (filtered.length <= 1) {
      setIsComparison(false);
    }
    if (activeProductTab >= filtered.length) {
      setActiveProductTab(Math.max(0, filtered.length - 1));
    }
    showToast(`Removed device #${index + 1}`);
  };

  const handleCopySpecsFromPrimary = (targetIndex: number) => {
    if (targetIndex === 0) return;
    const primarySpecs = comparedProducts[0]?.specs || {};
    updateProduct(targetIndex, { specs: { ...primarySpecs } });
    showToast(`Copied specifications from Device #1 to Device #${targetIndex + 1}!`);
  };

  // Body Content
  const [content, setContent] = useState(`## Executive Overview\n\nIn our continuous testing and editorial analysis, this development marks a pivotal shift in consumer tech architecture.\n\n### Architectural Innovations & Core Metrics\n\nUnder rigorous stress testing, key efficiencies were unlocked without compromising thermal boundaries.\n\n### Practical Implications for Everyday Users\n\nBeyond raw synthetic data, daily usability demonstrates refined ergonomics and sustained efficiency across modern creator workflows.\n\n### The Final Verdict & Outlook\n\nFor power users and tech enthusiasts considering this generation, the enhancements justify serious attention.`);

  // SEO Fields
  const [focusKeyword, setFocusKeyword] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');

  // UI status
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
  const [toastNotification, setToastNotification] = useState('');

  const showToast = (msg: string) => {
    setToastNotification(msg);
    setTimeout(() => setToastNotification(''), 4000);
  };

  // Watch for initialEditingId
  useEffect(() => {
    if (initialEditingId) {
      fetch(`/api/posts/${initialEditingId}`)
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.post) {
            handleLoadPost(data.post);
          }
        })
        .catch(console.error);
    }
  }, [initialEditingId]);

  const handleLoadPost = (post: BlogPost) => {
    setEditingId(post.id);
    setTitle(post.title);
    setSubtitle(post.subtitle || '');
    setSlug(post.slug);
    setIsSlugCustom(true);
    setCategorySlug(post.categorySlug);
    setExcerpt(post.excerpt);
    setFeaturedImage(post.featuredImage);
    setFeaturedImageAlt(post.featuredImageAlt || (post.title ? `${post.title} - GenZ Time` : ''));
    setIsAltManuallyEdited(Boolean(post.featuredImageAlt));
    setTagsInput((post.tags || []).join(', '));
    setAuthorName(post.author?.name || 'GenZ Editorial Team');
    setAuthorRole(post.author?.role || 'Senior Tech Analyst');
    setContent(post.content);

    // Determine type
    const determinedType = post.postType || (post.verdictScore && post.verdictScore > 0 ? 'review' : 'article');
    setPostType(determinedType);

    // Load Article specifics
    setKeyTakeaways(post.keyTakeaways || []);
    setFaqs(post.faqs || []);
    setSources(post.sources || []);

    // Load Review & Comparison specifics
    const hasComparison = Boolean(post.isComparison && post.comparedProducts && post.comparedProducts.length > 1);
    setIsComparison(hasComparison);
    if (post.comparedProducts && post.comparedProducts.length > 0) {
      setComparedProducts(post.comparedProducts);
      const first = post.comparedProducts[0];
      setSpecs(first.specs || {});
      setPros(first.pros || []);
      setCons(first.cons || []);
      setVerdictScore(first.verdictScore || 9.2);
      setVerdictSummary(first.verdictSummary || '');
    } else {
      setSpecs(post.specs || {});
      setPros(post.pros || []);
      setCons(post.cons || []);
      setVerdictScore(post.verdictScore || 9.2);
      setVerdictSummary(post.verdictSummary || '');
      setComparedProducts([
        {
          id: 'comp-1',
          name: post.title ? post.title.split(':')[0].trim() : 'Primary Gadget',
          badge: 'Overall Winner',
          verdictScore: post.verdictScore || 9.2,
          verdictSummary: post.verdictSummary || '',
          specs: post.specs || {},
          pros: post.pros || ['Class-leading build quality', 'Breakthrough hardware efficiency'],
          cons: post.cons || ['Premium flagship pricing'],
        },
      ]);
    }

    // Load SEO
    setFocusKeyword(post.seo?.focusKeyword || '');
    setMetaTitle(post.seo?.metaTitle || post.title);
    setMetaDescription(post.seo?.metaDescription || post.excerpt);
  };

  // Auto-generate slug and meta title when title changes
  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!isSlugCustom) {
      const generated = val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      setSlug(generated);
    }
    if (!metaTitle || metaTitle.startsWith(title)) {
      setMetaTitle(val ? `${val} | GenZ Time` : '');
    }
    if (!isAltManuallyEdited || !featuredImageAlt) {
      setFeaturedImageAlt(val ? generateAutoAlt(val, categorySlug) : '');
    }
  };

  // Auto-fill meta description when excerpt changes
  const handleExcerptChange = (val: string) => {
    setExcerpt(val);
    if (!metaDescription || metaDescription.startsWith(excerpt)) {
      setMetaDescription(val);
    }
  };

  // Handle Image File Upload with Auto-Watermarking
  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setWatermarking(true);
    setWatermarkNotice('Applying official GenZ Time logo watermark...');

    try {
      const cleanFileName = file.name
        .replace(/\.[^/.]+$/, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      const formattedFileName = cleanFileName
        .split(' ')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
        .join(' ');

      if (!isAltManuallyEdited || !featuredImageAlt) {
        setFeaturedImageAlt(generateAutoAlt(title, categorySlug, formattedFileName));
      }

      // 1. Client-side canvas watermarking with official GenZ Time emblem
      const { dataUrl, blob } = await applyWatermark(file, {
        position: watermarkPosition,
        tagline: 'genztime.com',
      });

      // 2. Upload to /api/upload
      const formData = new FormData();
      formData.append('file', blob, file.name);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (data.success && data.url) {
        setFeaturedImage(data.url);
        setWatermarkNotice('Logo watermark applied and saved to /uploads!');
        showToast('Image uploaded, auto-watermarked & alt text generated!');
      } else {
        // Fallback to dataUrl directly
        setFeaturedImage(dataUrl);
        setWatermarkNotice('Watermarked preview ready');
      }
    } catch (err) {
      console.error('Watermarking error:', err);
      alert('Failed to process image');
    } finally {
      setWatermarking(false);
      setTimeout(() => setWatermarkNotice(null), 5000);
    }
  };

  // Plagiarism & Originality Calculation
  const plagiarismResult = useMemo(() => {
    return checkPlagiarism(content);
  }, [content]);

  // EEAT Evaluation
  const eeatAudit = useMemo(() => {
    return evaluateEeat({
      title,
      content,
      authorName,
      specs,
      pros,
      cons,
      verdictScore,
    });
  }, [title, content, authorName, specs, pros, cons, verdictScore]);

  // Auto SEO Generator
  const handleAutoSeo = () => {
    const currentCat = availableCategories.find((c) => c.slug === categorySlug);
    const pkg = generateHighLevelSeo({
      title: title || 'Technology Insight',
      category: currentCat ? currentCat.name : 'Tech Gadgets',
      content,
      specs,
      authorName,
    });

    setFocusKeyword(pkg.focusKeyword);
    setTagsInput(pkg.tags.join(', '));
    setMetaTitle(pkg.metaTitle);
    setMetaDescription(pkg.metaDescription);
    if (!isAltManuallyEdited || !featuredImageAlt) {
      setFeaturedImageAlt(generateAutoAlt(title, categorySlug, pkg.focusKeyword));
    }
    showToast('Auto-generated genuine SEO meta & image alt package');
  };

  // Add Takeaway
  const handleAddTakeaway = () => {
    if (!newTakeaway.trim()) return;
    setKeyTakeaways([...keyTakeaways, newTakeaway.trim()]);
    setNewTakeaway('');
  };

  // Add FAQ
  const handleAddFaq = () => {
    if (!newFaqQ.trim() || !newFaqA.trim()) return;
    setFaqs([...faqs, { question: newFaqQ.trim(), answer: newFaqA.trim() }]);
    setNewFaqQ('');
    setNewFaqA('');
  };

  // Add Source
  const handleAddSource = () => {
    if (!newSourceTitle.trim() || !newSourceUrl.trim()) return;
    setSources([...sources, { title: newSourceTitle.trim(), url: newSourceUrl.trim() }]);
    setNewSourceTitle('');
    setNewSourceUrl('');
  };

  // Add Pro / Con
  const addPro = () => {
    if (!newPro.trim()) return;
    setPros([...pros, newPro.trim()]);
    setNewPro('');
  };

  const addCon = () => {
    if (!newCon.trim()) return;
    setCons([...cons, newCon.trim()]);
    setNewCon('');
  };

  // Markdown Helper Injection
  const insertMarkdown = (prefix: string, suffix: string = '') => {
    setContent((prev) => `${prev}\n\n${prefix}Text${suffix}\n`);
  };

  // Submit Handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Please fill in at least the Title and Body Content.');
      return;
    }

    setSubmitting(true);
    setSuccessMessage('');

    const categoryObj = availableCategories.find((c) => c.slug === categorySlug);
    const tags = tagsInput.split(',').map((t) => t.trim()).filter(Boolean);

    const payload: Partial<BlogPost> & { title: string; content: string } = {
      id: editingId || undefined,
      title,
      subtitle: postType === 'article' ? subtitle : undefined,
      slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      excerpt: excerpt || content.slice(0, 160) + '...',
      content,
      featuredImage,
      featuredImageAlt: featuredImageAlt.trim() || generateAutoAlt(title, categorySlug),
      category: categoryObj ? categoryObj.name : 'Smartphones',
      categorySlug,
      tags,
      postType,
      author: {
        name: authorName || 'GenZ Editorial Team',
        role: authorRole || 'Senior Tech Analyst',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
        bio: 'Tech journalist and hardware analyst at GenZ Time.',
      },
      publishedAt: new Date().toISOString(),
      readingTime: `${Math.ceil(content.split(/\s+/).length / 200)} min read`,
      seo: {
        metaTitle: metaTitle || title,
        metaDescription: metaDescription || excerpt || content.slice(0, 160),
        focusKeyword: focusKeyword || title.split(' ')[0],
      },
      eeatScore: eeatAudit?.overallScore || 94,
      originalityScore: plagiarismResult?.originalityScore || 98,
    };

    // Include review-only fields if postType is review
    if (postType === 'review') {
      const isMulti = isComparison && comparedProducts.length > 1;
      payload.isComparison = isMulti;
      payload.comparisonCount = isMulti ? comparedProducts.length : 1;
      payload.comparedProducts = isMulti ? comparedProducts : [comparedProducts[0] || {
        id: 'comp-1',
        name: title ? title.split(':')[0].trim() : 'Primary Gadget',
        badge: 'Overall Winner',
        verdictScore: Number(verdictScore),
        verdictSummary,
        specs,
        pros: pros.filter(Boolean),
        cons: cons.filter(Boolean),
      }];

      // Synchronize primary device to root fields for backwards compatibility
      const primary = comparedProducts[0];
      payload.verdictScore = primary ? Number(primary.verdictScore) : Number(verdictScore);
      payload.verdictSummary = primary ? primary.verdictSummary : verdictSummary;
      payload.specs = primary ? primary.specs : specs;
      payload.pros = primary ? primary.pros.filter(Boolean) : pros.filter(Boolean);
      payload.cons = primary ? primary.cons.filter(Boolean) : cons.filter(Boolean);
    } else {
      // Include article-only fields
      payload.keyTakeaways = keyTakeaways.filter(Boolean);
      payload.faqs = faqs;
      payload.sources = sources;
    }

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
        setSuccessMessage(editingId ? 'Post updated successfully!' : 'Post published live to GenZ Time!');
        if (onPostSaved) onPostSaved();
        setTimeout(() => {
          router.push(`/blog/${data.post.slug}`);
        }, 1200);
      } else {
        alert(data.error || 'Failed to publish post');
      }
    } catch (e) {
      console.error(e);
      alert('Error while publishing');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-tech-cyan/15 border border-tech-cyan/50 text-white shadow-2xl backdrop-blur-md text-xs font-mono flex items-center gap-2.5 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-tech-cyan" />
          <span>{toastNotification}</span>
        </div>
      )}

      {/* 1. Post Type Mode Switcher */}
      <div className="p-6 rounded-3xl bg-tech-900/60 border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-mono text-tech-cyan uppercase tracking-widest block mb-1">
              Publishing Mode
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              Choose Content Architecture
            </h2>
          </div>

          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-tech-950 border border-slate-800">
            <button
              type="button"
              onClick={() => setPostType('article')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 ${
                postType === 'article'
                  ? 'bg-tech-cyan text-tech-950 shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Standard Article / Guide</span>
            </button>

            <button
              type="button"
              onClick={() => setPostType('review')}
              className={`px-4 py-2.5 rounded-xl font-mono text-xs font-bold transition flex items-center gap-2 ${
                postType === 'review'
                  ? 'bg-gradient-to-r from-amber-400 to-tech-emerald text-tech-950 shadow-glow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Hardware Review & Benchmark</span>
            </button>
          </div>
        </div>

        <div className="p-3.5 rounded-2xl bg-tech-950/70 border border-slate-800/80 text-xs text-slate-400 leading-relaxed font-mono">
          {postType === 'article' ? (
            <span className="flex items-center gap-2 text-tech-cyan">
              <Check className="w-4 h-4 shrink-0" />
              <span>
                <strong>Article Mode Active:</strong> Tailored for news reports, buyer guides, explainers, and editorials. Review-specific clutter (hardware specs sheet, pros/cons, and 0-10 score sliders) are disabled. Executive highlights, dek subtitle, and citations are enabled.
              </span>
            </span>
          ) : (
            <span className="flex items-center gap-2 text-amber-300">
              <Star className="w-4 h-4 shrink-0 fill-amber-400" />
              <span>
                <strong>Review Mode Active:</strong> Tailored for device testing. Enables 10-point hardware specs sheet, pros/cons comparison, official verdict scores (0-10), and laboratory benchmarks.
              </span>
            </span>
          )}
        </div>
      </div>

      {/* Main Publishing Form */}
      <form onSubmit={handleSubmit} className="space-y-8">

        {/* 2. Core Metadata Section */}
        <div className="p-6 sm:p-8 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-6">
          <h3 className="text-base font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
            <Edit3 className="w-4 h-4 text-tech-cyan" />
            <span>Title, Context & Sector</span>
          </h3>

          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400">
                  {postType === 'article' ? 'Article Headline *' : 'Device / Review Title *'}
                </label>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-tech-cyan bg-tech-cyan/10 px-2 py-0.5 rounded border border-tech-cyan/20">
                  H1 • Main Document Headline
                </span>
              </div>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                placeholder={postType === 'article' ? 'e.g. Why Spatial Computing Is Transforming Mobile Workflow in 2026' : 'e.g. Apple Vision Pro 2: The Next Leap in Spatial Computing'}
                className="w-full px-4 py-3 rounded-2xl bg-tech-950 border border-slate-700 text-white text-base focus:outline-none focus:border-tech-cyan"
              />
            </div>

            {/* Subtitle / Dek for Articles */}
            {postType === 'article' && (
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Subtitle / Dek (Compelling Subhead Hook)
                </label>
                <input
                  type="text"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="e.g. As lightweight micro-OLED panels mature, wearable spatial interfaces are replacing traditional multi-monitor setups."
                  className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  URL Slug
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => {
                    setIsSlugCustom(true);
                    setSlug(e.target.value);
                  }}
                  placeholder="custom-url-slug"
                  className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-tech-cyan"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                  Category / Sector
                </label>
                <select
                  value={categorySlug}
                  onChange={(e) => setCategorySlug(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan font-mono"
                >
                  {availableCategories.map((cat) => (
                    <option key={cat.id} value={cat.slug}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Executive Excerpt (1-2 Sentences for Previews & Social Shares)
              </label>
              <textarea
                rows={2}
                value={excerpt}
                onChange={(e) => handleExcerptChange(e.target.value)}
                placeholder="A punchy, human summary that appears on the homepage card and Google meta snippet..."
                className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-tech-cyan"
              />
            </div>
          </div>
        </div>

        {/* 3. Featured Image with Direct Upload & Auto-Watermark */}
        <div className="p-6 sm:p-8 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-tech-cyan" />
                <span>Featured Hero Media & Watermark</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Upload from device with auto-watermarked GenZ Time logo or paste a URL.
              </p>
            </div>

            {/* Mode Switch */}
            <div className="flex items-center gap-1.5 p-1 rounded-xl bg-tech-950 border border-slate-800">
              <button
                type="button"
                onClick={() => setImageMode('upload')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                  imageMode === 'upload'
                    ? 'bg-tech-cyan text-tech-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload + Logo</span>
              </button>

              <button
                type="button"
                onClick={() => setImageMode('url')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                  imageMode === 'url'
                    ? 'bg-tech-cyan text-tech-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <LinkIcon className="w-3.5 h-3.5" />
                <span>Paste URL</span>
              </button>

              <button
                type="button"
                onClick={() => setImageMode('presets')}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                  imageMode === 'presets'
                    ? 'bg-tech-cyan text-tech-950 font-bold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Presets</span>
              </button>
            </div>
          </div>

          {/* Mode 1: File Upload */}
          {imageMode === 'upload' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-8 rounded-3xl border-2 border-dashed border-slate-700 hover:border-tech-cyan/60 bg-tech-950/60 hover:bg-tech-950 cursor-pointer transition text-center space-y-3 group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) handleFileUpload(f);
                  }}
                  className="hidden"
                />

                <div className="w-12 h-12 rounded-2xl bg-tech-cyan/10 border border-tech-cyan/30 text-tech-cyan flex items-center justify-center mx-auto group-hover:scale-110 transition">
                  {watermarking ? (
                    <Zap className="w-6 h-6 animate-spin text-tech-cyan" />
                  ) : (
                    <FileUp className="w-6 h-6" />
                  )}
                </div>

                <div>
                  <span className="text-sm font-bold text-white block">
                    {watermarking ? 'Processing & Applying Watermark...' : 'Click to Upload or Drag & Drop Image'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono block mt-1">
                    Supports PNG, JPG, WebP. Automatically watermarks GenZ Time official emblem!
                  </span>
                </div>
              </div>

              {/* Watermark Position Options */}
              <div className="flex items-center justify-between p-3 rounded-2xl bg-tech-950 border border-slate-800 text-xs font-mono">
                <span className="text-slate-400">Watermark Position:</span>
                <div className="flex gap-2">
                  {(['bottom-right', 'bottom-left', 'top-right'] as const).map((pos) => (
                    <button
                      type="button"
                      key={pos}
                      onClick={() => setWatermarkPosition(pos)}
                      className={`px-2.5 py-1 rounded-lg border transition capitalize ${
                        watermarkPosition === pos
                          ? 'bg-tech-cyan/15 border-tech-cyan text-tech-cyan font-bold'
                          : 'bg-white/5 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {pos.replace('-', ' ')}
                    </button>
                  ))}
                </div>
              </div>

              {watermarkNotice && (
                <div className="p-3 rounded-xl bg-tech-emerald/10 border border-tech-emerald/30 text-tech-emerald text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{watermarkNotice}</span>
                </div>
              )}
            </div>
          )}

          {/* Mode 2: Paste URL */}
          {imageMode === 'url' && (
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Image Web URL
              </label>
              <input
                type="url"
                value={featuredImage}
                onChange={(e) => setFeaturedImage(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-tech-cyan"
              />
            </div>
          )}

          {/* Mode 3: Presets */}
          {imageMode === 'presets' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
              {PRESET_IMAGES.map((preset) => (
                <button
                  type="button"
                  key={preset.name}
                  onClick={() => {
                    setFeaturedImage(preset.url);
                    if (!isAltManuallyEdited || !featuredImageAlt) {
                      setFeaturedImageAlt(generateAutoAlt(title, categorySlug, preset.name));
                    }
                  }}
                  className={`relative rounded-2xl overflow-hidden aspect-video border transition group ${
                    featuredImage === preset.url
                      ? 'border-tech-cyan ring-2 ring-tech-cyan/40 shadow-glow'
                      : 'border-slate-800 hover:border-slate-600'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition"
                  />
                  <span className="absolute inset-x-0 bottom-0 py-1 bg-tech-950/80 text-[10px] font-mono text-center text-white truncate px-1">
                    {preset.name}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Image Preview Box */}
          {featuredImage && (
            <div className="relative rounded-3xl overflow-hidden aspect-[16/9] max-h-[340px] border border-slate-800 shadow-xl bg-tech-950">
              <img
                src={featuredImage}
                alt={featuredImageAlt || (title ? `${title} - GenZ Time` : 'Active Featured Media')}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-tech-950/85 backdrop-blur-md border border-slate-800 text-[11px] font-mono text-slate-300">
                Active Featured Media
              </div>
            </div>
          )}

          {/* Auto Image Alt Text (SEO & Accessibility) */}
          <div className="pt-3 border-t border-slate-800/80 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-tech-cyan" />
                  <span>Image Alt Text (SEO & Google Images)</span>
                </label>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30">
                  {isAltManuallyEdited ? 'Custom' : 'Auto-Generated'}
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  const auto = generateAutoAlt(title, categorySlug);
                  setFeaturedImageAlt(auto);
                  setIsAltManuallyEdited(false);
                  showToast('Auto-generated fresh SEO alt text!');
                }}
                className="px-2.5 py-1 rounded-lg bg-tech-cyan/10 hover:bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/30 text-xs font-mono flex items-center gap-1.5 transition self-start sm:self-auto"
                title="Regenerate alt text from title and category"
              >
                <Sparkles className="w-3 h-3" />
                <span>Auto-Set Alt Text</span>
              </button>
            </div>

            <div className="relative">
              <input
                type="text"
                value={featuredImageAlt || (title ? generateAutoAlt(title, categorySlug) : '')}
                onChange={(e) => {
                  setFeaturedImageAlt(e.target.value);
                  setIsAltManuallyEdited(true);
                }}
                placeholder="e.g. Samsung Galaxy S25 Ultra hardware lab review and display test - GenZ Time"
                className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-tech-cyan"
              />
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Auto-synced with title & category for top Google Images ranking. Automatically sets the image <code className="text-tech-cyan">alt</code> attribute.
            </p>
          </div>
        </div>

        {/* 4. Article-Specific Modules (Only in Article Mode) */}
        {postType === 'article' && (
          <div className="space-y-8">
            {/* Key Takeaways Builder */}
            <div className="p-6 sm:p-8 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-tech-cyan" />
                    <span>Key Takeaways & Executive Highlights</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Fast summary bullet points for Gen Z readers.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                {keyTakeaways.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-2xl bg-tech-950 border border-slate-800 text-xs text-slate-200">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-tech-emerald shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setKeyTakeaways(keyTakeaways.filter((_, i) => i !== idx))}
                      className="text-slate-500 hover:text-rose-400 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTakeaway}
                  onChange={(e) => setNewTakeaway(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddTakeaway();
                    }
                  }}
                  placeholder="Add a new executive key takeaway..."
                  className="flex-1 px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
                />
                <button
                  type="button"
                  onClick={handleAddTakeaway}
                  className="px-4 py-2.5 rounded-xl font-bold text-xs bg-tech-cyan/15 text-tech-cyan border border-tech-cyan/30 hover:bg-tech-cyan/25 transition font-mono"
                >
                  + Add Takeaway
                </button>
              </div>
            </div>

            {/* FAQs Builder */}
            <div className="p-6 sm:p-8 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-purple-400" />
                  <span>Frequently Asked Questions (FAQ Section)</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Great for reader clarity and Google FAQ Rich Snippets.
                </p>
              </div>

              {faqs.length > 0 && (
                <div className="space-y-2">
                  {faqs.map((f, i) => (
                    <div key={i} className="p-3 rounded-2xl bg-tech-950 border border-slate-800 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-white">
                        <span>Q: {f.question}</span>
                        <button
                          type="button"
                          onClick={() => setFaqs(faqs.filter((_, idx) => idx !== i))}
                          className="text-slate-500 hover:text-rose-400"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-slate-400">A: {f.answer}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-2 p-3.5 rounded-2xl bg-tech-950/60 border border-slate-800">
                <input
                  type="text"
                  value={newFaqQ}
                  onChange={(e) => setNewFaqQ(e.target.value)}
                  placeholder="Question: e.g. Does this support USB-C display out?"
                  className="w-full px-3.5 py-2 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
                <textarea
                  rows={2}
                  value={newFaqA}
                  onChange={(e) => setNewFaqA(e.target.value)}
                  placeholder="Answer: e.g. Yes, it fully supports DisplayPort Alt Mode over USB 4.0."
                  className="w-full px-3.5 py-2 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-purple-500/15 text-purple-300 border border-purple-500/30 hover:bg-purple-500/25 transition"
                >
                  + Add FAQ Pair
                </button>
              </div>
            </div>

            {/* Citations & Sources */}
            <div className="p-6 sm:p-8 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-4">
              <div className="border-b border-slate-800 pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-tech-emerald" />
                  <span>Verified Sources & Reference Citations</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Establishes high journalistic E-E-A-T and trustworthiness.
                </p>
              </div>

              {sources.length > 0 && (
                <div className="space-y-1.5">
                  {sources.map((s, i) => (
                    <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-tech-950 border border-slate-800 text-xs font-mono">
                      <span className="text-tech-cyan">{s.title} ({s.url})</span>
                      <button
                        type="button"
                        onClick={() => setSources(sources.filter((_, idx) => idx !== i))}
                        className="text-slate-500 hover:text-rose-400"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  value={newSourceTitle}
                  onChange={(e) => setNewSourceTitle(e.target.value)}
                  placeholder="Source Title (e.g. AnandTech Silicon Architecture)"
                  className="flex-1 px-3.5 py-2 rounded-xl bg-tech-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-tech-emerald"
                />
                <input
                  type="url"
                  value={newSourceUrl}
                  onChange={(e) => setNewSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="flex-1 px-3.5 py-2 rounded-xl bg-tech-950 border border-slate-700 text-xs text-white focus:outline-none focus:border-tech-emerald font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddSource}
                  className="px-4 py-2 rounded-xl text-xs font-mono font-bold bg-tech-emerald/15 text-tech-emerald border border-tech-emerald/30 hover:bg-tech-emerald/25 transition shrink-0"
                >
                  + Add Source
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 5. Review-Specific Modules (Hardware Reviews & Multi-Device Comparison) */}
        {postType === 'review' && (
          <div className="space-y-8">
            {/* Review Scope & Multi-Product Comparison Prompt */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-tech-950 via-tech-900 to-tech-950 border border-slate-800 shadow-glow space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-tech-cyan">
                    <Scale className="w-4 h-4" />
                    <span>Hardware Review Scope & Comparison Selector</span>
                  </div>
                  <h3 className="text-lg font-bold text-white tracking-tight">
                    Is this review for a Single Product, or a Comparison between multiple gadgets?
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    Select 1, 2, or 3 products, or click the <span className="text-tech-cyan font-bold">+ icon</span> to add more devices with identical specifications and benchmark scorecards.
                  </p>
                </div>

                {isComparison && comparedProducts.length > 1 && (
                  <div className="flex items-center gap-2 bg-tech-950 px-3 py-1.5 rounded-xl border border-slate-800 shrink-0">
                    <span className="text-xs font-mono text-slate-400">View:</span>
                    <button
                      type="button"
                      onClick={() => setViewAllStacked(false)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                        !viewAllStacked ? 'bg-tech-cyan/20 text-tech-cyan font-bold border border-tech-cyan/40' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Tabs
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewAllStacked(true)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono transition ${
                        viewAllStacked ? 'bg-tech-cyan/20 text-tech-cyan font-bold border border-tech-cyan/40' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Stack All
                    </button>
                  </div>
                )}
              </div>

              {/* Scope Selection Buttons */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* 1 Product (Single Review) */}
                <button
                  type="button"
                  onClick={() => handleSelectCount(1)}
                  className={`p-4 rounded-2xl border text-left transition flex items-center justify-between group ${
                    !isComparison || comparedProducts.length <= 1
                      ? 'bg-tech-cyan/15 border-tech-cyan shadow-glow text-white'
                      : 'bg-tech-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-white mb-0.5">
                      <Smartphone className="w-4 h-4 text-tech-cyan" />
                      <span>1 Product</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 block">Single Device In-Depth</span>
                  </div>
                  {(!isComparison || comparedProducts.length <= 1) && (
                    <CheckCircle2 className="w-4 h-4 text-tech-cyan shrink-0" />
                  )}
                </button>

                {/* 2 Products (Head-to-Head) */}
                <button
                  type="button"
                  onClick={() => handleSelectCount(2)}
                  className={`p-4 rounded-2xl border text-left transition flex items-center justify-between group ${
                    isComparison && comparedProducts.length === 2
                      ? 'bg-purple-500/15 border-purple-400 shadow-glow text-white'
                      : 'bg-tech-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-white mb-0.5">
                      <Scale className="w-4 h-4 text-purple-400" />
                      <span>2 Products</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 block">Head-to-Head Battle</span>
                  </div>
                  {isComparison && comparedProducts.length === 2 && (
                    <CheckCircle2 className="w-4 h-4 text-purple-400 shrink-0" />
                  )}
                </button>

                {/* 3 Products (Triple Shootout) */}
                <button
                  type="button"
                  onClick={() => handleSelectCount(3)}
                  className={`p-4 rounded-2xl border text-left transition flex items-center justify-between group ${
                    isComparison && comparedProducts.length === 3
                      ? 'bg-tech-emerald/15 border-tech-emerald shadow-glow text-white'
                      : 'bg-tech-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-white mb-0.5">
                      <Layers className="w-4 h-4 text-tech-emerald" />
                      <span>3 Products</span>
                    </div>
                    <span className="text-[11px] font-mono text-slate-400 block">Triple Showdown</span>
                  </div>
                  {isComparison && comparedProducts.length === 3 && (
                    <CheckCircle2 className="w-4 h-4 text-tech-emerald shrink-0" />
                  )}
                </button>

                {/* + Add Product / Gadget Button */}
                <button
                  type="button"
                  onClick={handleAddComparedProduct}
                  className="p-4 rounded-2xl border border-tech-cyan/40 bg-gradient-to-r from-tech-cyan/20 to-purple-500/20 hover:from-tech-cyan/30 hover:to-purple-500/30 text-white text-left transition flex items-center justify-between group shadow-lg"
                >
                  <div>
                    <div className="flex items-center gap-2 font-bold text-sm text-white mb-0.5">
                      <Plus className="w-4 h-4 text-tech-cyan group-hover:rotate-90 transition-transform" />
                      <span>+ Add Product</span>
                    </div>
                    <span className="text-[11px] font-mono text-tech-cyan block">
                      Add Device #{comparedProducts.length + 1}
                    </span>
                  </div>
                  <span className="w-6 h-6 rounded-full bg-tech-cyan/20 flex items-center justify-center text-tech-cyan text-xs font-bold">
                    +
                  </span>
                </button>
              </div>

              {/* Active Comparison Tabs (when in multi-device mode and tabs view) */}
              {isComparison && comparedProducts.length > 1 && !viewAllStacked && (
                <div className="pt-3 border-t border-slate-800/80">
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
                    {comparedProducts.map((prod, pIdx) => {
                      const isActive = activeProductTab === pIdx;
                      return (
                        <div
                          key={prod.id || pIdx}
                          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl border transition shrink-0 ${
                            isActive
                              ? 'bg-tech-cyan/15 border-tech-cyan text-white shadow-glow'
                              : 'bg-tech-950 border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
                          }`}
                        >
                          <button
                            type="button"
                            onClick={() => setActiveProductTab(pIdx)}
                            className="flex items-center gap-2 text-left"
                          >
                            <span className="w-5 h-5 rounded-md bg-white/10 flex items-center justify-center font-mono text-[10px] font-bold">
                              #{pIdx + 1}
                            </span>
                            <span className="font-bold text-xs max-w-[140px] truncate">
                              {prod.name || `Device #${pIdx + 1}`}
                            </span>
                            <span className="text-[10px] font-mono text-amber-400 bg-amber-400/10 px-1.5 py-0.5 rounded">
                              {(prod.verdictScore || 0).toFixed(1)}★
                            </span>
                          </button>

                          {comparedProducts.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveComparedProduct(pIdx)}
                              className="text-slate-500 hover:text-rose-400 p-0.5 rounded transition"
                              title="Remove this device from comparison"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                      );
                    })}

                    <button
                      type="button"
                      onClick={handleAddComparedProduct}
                      className="px-3 py-2 rounded-xl border border-dashed border-slate-700 hover:border-tech-cyan text-slate-400 hover:text-white flex items-center gap-1.5 text-xs font-mono transition shrink-0"
                    >
                      <Plus className="w-3.5 h-3.5 text-tech-cyan" />
                      <span>Add Device</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Compared Products Editor Cards */}
            {comparedProducts.map((product, pIdx) => {
              // In tabs view, only show the active tab (unless viewAllStacked is true or single product)
              if (isComparison && comparedProducts.length > 1 && !viewAllStacked && activeProductTab !== pIdx) {
                return null;
              }

              return (
                <div
                  key={product.id || pIdx}
                  className="p-6 sm:p-8 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-6 shadow-xl relative"
                >
                  {/* Device Header Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-gradient-to-br from-tech-cyan to-purple-500 text-tech-950 font-black font-mono flex items-center justify-center text-sm shadow-md">
                        #{pIdx + 1}
                      </span>
                      <div>
                        <h4 className="text-lg font-bold text-white">
                          {isComparison && comparedProducts.length > 1
                            ? `Device #${pIdx + 1}: ${product.name || 'Untitled Hardware'}`
                            : 'Hardware Specifications & Lab Verdict'}
                        </h4>
                        <span className="text-xs font-mono text-slate-400">
                          {isComparison ? 'Independent 10-Point Technical Sheet & Scorecard' : 'Standardized metrics for hardware evaluation and benchmark tables.'}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {pIdx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleCopySpecsFromPrimary(pIdx)}
                          className="px-3 py-1.5 rounded-xl bg-tech-950 border border-slate-700 hover:border-tech-cyan text-slate-300 hover:text-white text-xs font-mono flex items-center gap-1.5 transition"
                          title="Copy specs from Device #1 as a baseline"
                        >
                          <Copy className="w-3.5 h-3.5 text-tech-cyan" />
                          <span>Copy Specs from #1</span>
                        </button>
                      )}

                      {isComparison && comparedProducts.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveComparedProduct(pIdx)}
                          className="px-3 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/30 hover:bg-rose-500/20 text-rose-400 text-xs font-mono flex items-center gap-1.5 transition"
                          title="Delete this compared device"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Remove Device</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Device Name & Award Badge Inputs */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">
                        Device Name *
                      </label>
                      <input
                        type="text"
                        value={product.name || ''}
                        onChange={(e) => updateProduct(pIdx, { name: e.target.value })}
                        placeholder={pIdx === 0 ? (title ? title.split(':')[0].trim() : 'e.g. Samsung Galaxy S25 Ultra') : 'e.g. Apple iPhone 16 Pro Max'}
                        className="w-full px-3.5 py-2.5 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan font-bold"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-mono text-slate-400">
                          Comparison Award / Badge
                        </label>
                        <span className="text-[10px] font-mono text-slate-500">Optional</span>
                      </div>
                      <input
                        type="text"
                        value={product.badge || ''}
                        onChange={(e) => updateProduct(pIdx, { badge: e.target.value })}
                        placeholder="e.g. Overall Winner, Best Value, Top Camera, Runner-Up"
                        className="w-full px-3.5 py-2.5 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                      />
                      {/* Badge Suggestion Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
                        {['Overall Winner', 'Best Value', 'Top Camera', 'Runner-Up', 'Flagship Choice'].map((chip) => (
                          <button
                            type="button"
                            key={chip}
                            onClick={() => updateProduct(pIdx, { badge: chip })}
                            className="px-2 py-0.5 rounded-md bg-tech-950 border border-slate-800 text-[10px] font-mono text-slate-400 hover:text-white hover:border-slate-700 transition"
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Category-Adaptive Technical Specifications Sheet */}
                  <div className="space-y-3 pt-3 border-t border-slate-800/80">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-tech-cyan/15 border border-tech-cyan/30 flex items-center justify-center text-tech-cyan">
                          <Cpu className="w-3.5 h-3.5" />
                        </div>
                        <div>
                          <span className="text-xs font-mono uppercase tracking-wider text-white font-bold block">
                            {currentSpecConfig.title}
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            {currentSpecConfig.description}
                          </span>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30 self-start sm:self-auto flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-tech-cyan" />
                        <span>Adaptive for {currentSpecConfig.categoryName}</span>
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs font-mono pt-1">
                      {currentSpecConfig.fields.map((field) => (
                        <div key={field.key}>
                          <label className="block text-slate-300 font-medium mb-1">
                            {field.label}
                          </label>
                          <input
                            type="text"
                            value={(product.specs as any)?.[field.key] || ''}
                            onChange={(e) => updateProductSpec(pIdx, field.key as any, e.target.value)}
                            placeholder={field.placeholder}
                            className="w-full px-3 py-2 bg-tech-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan transition"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pros & Cons Builder for this Device */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-tech-emerald">
                      <Sliders className="w-3.5 h-3.5" />
                      <span>{product.name || `Device #${pIdx + 1}`} Pros & Cons Breakdown</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Pros */}
                      <div className="space-y-3">
                        <span className="text-xs font-mono font-bold text-tech-emerald block">
                          ✓ Strengths ({(product.pros || []).length})
                        </span>
                        <div className="space-y-2">
                          {(product.pros || []).map((p, proIdx) => (
                            <div key={proIdx} className="flex items-center justify-between p-2.5 rounded-xl bg-tech-950 border border-tech-emerald/20 text-xs text-slate-200">
                              <span>{p}</span>
                              <button
                                type="button"
                                onClick={() => removeProductPro(pIdx, proIdx)}
                                className="text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newProInputs[pIdx] || ''}
                            onChange={(e) => setNewProInputs({ ...newProInputs, [pIdx]: e.target.value })}
                            placeholder="Add a pro point..."
                            className="flex-1 px-3 py-2 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-tech-emerald"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addProductPro(pIdx);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => addProductPro(pIdx)}
                            className="px-3 py-2 bg-tech-emerald/20 text-tech-emerald rounded-xl text-xs font-mono font-bold border border-tech-emerald/40 hover:bg-tech-emerald/30 transition"
                          >
                            + Pro
                          </button>
                        </div>
                      </div>

                      {/* Cons */}
                      <div className="space-y-3">
                        <span className="text-xs font-mono font-bold text-rose-400 block">
                          ✗ Trade-offs & Drawbacks ({(product.cons || []).length})
                        </span>
                        <div className="space-y-2">
                          {(product.cons || []).map((c, conIdx) => (
                            <div key={conIdx} className="flex items-center justify-between p-2.5 rounded-xl bg-tech-950 border border-rose-500/20 text-xs text-slate-200">
                              <span>{c}</span>
                              <button
                                type="button"
                                onClick={() => removeProductCon(pIdx, conIdx)}
                                className="text-slate-500 hover:text-rose-400"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>

                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newConInputs[pIdx] || ''}
                            onChange={(e) => setNewConInputs({ ...newConInputs, [pIdx]: e.target.value })}
                            placeholder="Add a con point..."
                            className="flex-1 px-3 py-2 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-rose-400"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                addProductCon(pIdx);
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => addProductCon(pIdx)}
                            className="px-3 py-2 bg-rose-500/20 text-rose-400 rounded-xl text-xs font-mono font-bold border border-rose-500/40 hover:bg-rose-500/30 transition"
                          >
                            + Con
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Verdict Rating & Conclusion for this Device */}
                  <div className="pt-4 border-t border-slate-800/80 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-amber-400">
                      <Star className="w-3.5 h-3.5" />
                      <span>{product.name || `Device #${pIdx + 1}`} Hardware Verdict Rating</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
                      <div className="p-4 rounded-2xl bg-tech-950 border border-slate-800 text-center space-y-2">
                        <span className="text-xs font-mono text-slate-400 block">Final Lab Score</span>
                        <div className="text-4xl font-black font-mono text-amber-300">
                          {(product.verdictScore || 0).toFixed(1)}{' '}
                          <span className="text-sm text-slate-500">/ 10</span>
                        </div>
                        <input
                          type="range"
                          min="1.0"
                          max="10.0"
                          step="0.1"
                          value={product.verdictScore || 9.2}
                          onChange={(e) => updateProduct(pIdx, { verdictScore: parseFloat(e.target.value) })}
                          className="w-full accent-amber-400 cursor-pointer"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                          Verdict Executive Conclusion
                        </label>
                        <textarea
                          rows={3}
                          value={product.verdictSummary || ''}
                          onChange={(e) => updateProduct(pIdx, { verdictSummary: e.target.value })}
                          placeholder="Summary sentence explaining whether this device is recommended and for whom..."
                          className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* 6. Body Content Editor */}
        <div className="p-6 sm:p-8 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-tech-cyan" />
                <span>Body Content & Formatting</span>
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {content.split(/\s+/).filter(Boolean).length} words • ~{Math.ceil(content.split(/\s+/).filter(Boolean).length / 200)} min read
              </span>
            </div>

            {/* Quick Markdown Toolbar */}
            <div className="flex flex-wrap items-center gap-1.5">
              <div className="flex items-center gap-1 p-0.5 bg-tech-950/80 rounded-lg border border-slate-800">
                <button
                  type="button"
                  onClick={() => insertMarkdown('## ')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-tech-cyan/20 hover:text-tech-cyan text-white text-xs font-mono font-bold transition"
                  title="Heading 2 (Major Section) — e.g. ## Display & Architecture"
                >
                  ## H2
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('### ')}
                  className="px-2.5 py-1 rounded bg-slate-900 hover:bg-tech-cyan/20 hover:text-tech-cyan text-slate-300 text-xs font-mono font-semibold transition"
                  title="Heading 3 (Sub-Topic) — e.g. ### Benchmark Scores"
                >
                  ### H3
                </button>
                <button
                  type="button"
                  onClick={() => insertMarkdown('#### ')}
                  className="px-2 py-1 rounded bg-slate-900 hover:bg-tech-cyan/20 hover:text-tech-cyan text-slate-400 text-xs font-mono transition"
                  title="Heading 4 (Deep Detail) — e.g. #### Thermal Throttling"
                >
                  #### H4
                </button>
              </div>

              <div className="h-4 w-px bg-slate-800 hidden sm:block" />

              <button
                type="button"
                onClick={() => insertMarkdown('**', '**')}
                className="px-2.5 py-1 rounded-lg bg-tech-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono font-bold transition"
                title="Bold text"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('- ')}
                className="px-2.5 py-1 rounded-lg bg-tech-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition"
                title="Bullet list"
              >
                List
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('> ')}
                className="px-2.5 py-1 rounded-lg bg-tech-950 border border-slate-800 text-slate-300 hover:text-white text-xs font-mono transition"
                title="Blockquote"
              >
                Quote
              </button>
              <button
                type="button"
                onClick={() => {
                  const url = prompt('Enter image URL:');
                  if (!url) return;
                  const autoAlt = generateAutoAlt(title, categorySlug, 'Hardware Detail');
                  const customAlt = prompt('Image Alt Text (auto-generated for SEO):', autoAlt) || autoAlt;
                  insertMarkdown(`\n\n![${customAlt}](${url})\n\n`);
                }}
                className="px-2.5 py-1 rounded-lg bg-tech-950 border border-slate-800 text-tech-cyan hover:text-white hover:border-tech-cyan text-xs font-mono flex items-center gap-1.5 transition"
                title="Insert image with auto-generated alt text"
              >
                <ImageIcon className="w-3.5 h-3.5 text-tech-cyan" />
                <span>+ Image</span>
              </button>
            </div>
          </div>

          {/* Strict SEO Heading Hierarchy Helper */}
          <div className="flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-xl bg-tech-950/60 border border-slate-800/80 text-[11px] font-mono text-slate-400">
            <span className="text-amber-400 font-bold uppercase tracking-wider text-[10px]">Hierarchy Rule:</span>
            <span className="text-tech-cyan font-bold">H1 (Title)</span>
            <span className="text-slate-600">➔</span>
            <span className="text-white font-semibold">## H2 (Major Section)</span>
            <span className="text-slate-600">➔</span>
            <span className="text-slate-300">### H3 (Sub-Topic)</span>
            <span className="text-slate-600">➔</span>
            <span className="text-slate-400">#### H4 (Detail)</span>
            <span className="ml-auto text-[10px] text-slate-500 hidden md:inline">Avoid raw `#` in body (only 1 H1 per page for Google SEO)</span>
          </div>

          <textarea
            rows={14}
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-4 rounded-2xl bg-tech-950 border border-slate-700 text-white text-sm font-mono leading-relaxed focus:outline-none focus:border-tech-cyan"
          />
        </div>

        {/* 7. SEO & E-E-A-T Package Assistant */}
        <div className="p-6 sm:p-8 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Wand2 className="w-4 h-4 text-tech-cyan" />
                <span>E-E-A-T & Search Optimization Package</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Human-touch keyword mapping and Google algorithm compliance.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAutoSeo}
              className="px-4 py-2 rounded-xl font-mono text-xs font-bold bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/40 hover:bg-tech-cyan/30 transition flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Auto-Generate SEO Package</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Focus Keyword
              </label>
              <input
                type="text"
                value={focusKeyword}
                onChange={(e) => setFocusKeyword(e.target.value)}
                placeholder="e.g. spatial computing 2026"
                className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-tech-cyan"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
                Tags (Comma Separated)
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="Tech, Flagship, Future"
                className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs font-mono focus:outline-none focus:border-tech-cyan"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Meta Title
            </label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Search engine title tag..."
              className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs focus:outline-none focus:border-tech-cyan"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 mb-1.5">
              Meta Description
            </label>
            <textarea
              rows={2}
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              placeholder="150-160 characters describing the article for Google search results..."
              className="w-full px-4 py-2.5 rounded-xl bg-tech-950 border border-slate-700 text-white text-xs leading-relaxed focus:outline-none focus:border-tech-cyan"
            />
          </div>
        </div>

        {/* 8. Publish Button & Feedback */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-tech-emerald/10 border border-tech-emerald/30 text-tech-emerald text-sm font-mono flex items-center gap-3 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="flex items-center gap-4 pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={submitting}
            className="px-8 py-4 rounded-2xl font-black text-sm text-tech-950 bg-gradient-to-r from-tech-cyan via-tech-emerald to-purple-400 shadow-glow font-mono flex items-center gap-2 hover:opacity-95 transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span>{submitting ? 'Publishing Live...' : editingId ? 'Update Post Live' : `Publish ${postType === 'article' ? 'Article' : 'Review'} Live`}</span>
          </button>
        </div>

      </form>
    </div>
  );
}
