'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  FolderTree, 
  Plus, 
  Edit3, 
  Trash2, 
  ExternalLink, 
  Check, 
  AlertCircle, 
  Smartphone, 
  Laptop, 
  Headphones, 
  Glasses, 
  Camera, 
  Cpu, 
  Gamepad2, 
  Home, 
  Watch, 
  Radio, 
  Wifi, 
  Zap, 
  Sparkles,
  Layers
} from 'lucide-react';
import { CategoryInfo, BlogPost } from '@/types/blog';

const AVAILABLE_ICONS: Record<string, React.ElementType> = {
  Smartphone,
  Laptop,
  Headphones,
  Glasses,
  Camera,
  Cpu,
  Gamepad2,
  Home,
  Watch,
  Radio,
  Wifi,
  Zap,
};

const COLOR_PRESETS = [
  { name: 'Cyan / Blue', value: 'from-cyan-500 to-blue-600' },
  { name: 'Violet / Purple', value: 'from-violet-500 to-purple-700' },
  { name: 'Emerald / Teal', value: 'from-emerald-400 to-teal-600' },
  { name: 'Fuchsia / Pink', value: 'from-fuchsia-500 to-pink-600' },
  { name: 'Amber / Orange', value: 'from-amber-400 to-orange-600' },
  { name: 'Cyan / Indigo', value: 'from-cyan-400 to-indigo-600' },
  { name: 'Rose / Red', value: 'from-rose-500 to-red-600' },
  { name: 'Teal / Emerald', value: 'from-teal-400 to-emerald-600' },
];

interface AdminCategoriesModuleProps {
  categories: CategoryInfo[];
  posts: BlogPost[];
  onRefresh: () => void;
}

export default function AdminCategoriesModule({
  categories,
  posts,
  onRefresh,
}: AdminCategoriesModuleProps) {
  const [editingCategory, setEditingCategory] = useState<CategoryInfo | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [iconName, setIconName] = useState('Cpu');
  const [featuredColor, setFeaturedColor] = useState('from-cyan-500 to-blue-600');

  const showNotice = (msg: string) => {
    setNotice(msg);
    setTimeout(() => setNotice(null), 3500);
  };

  const handleStartCreate = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIconName('Cpu');
    setFeaturedColor('from-cyan-500 to-blue-600');
    setIsCreating(true);
  };

  const handleStartEdit = (cat: CategoryInfo) => {
    setIsCreating(false);
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description);
    setIconName(cat.iconName || 'Cpu');
    setFeaturedColor(cat.featuredColor || 'from-cyan-500 to-blue-600');
  };

  const handleCancelForm = () => {
    setIsCreating(false);
    setEditingCategory(null);
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (isCreating) {
      setSlug(val.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
    }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const payload = {
        id: editingCategory?.id,
        name: name.trim(),
        slug: slug.trim() || name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
        description: description.trim(),
        iconName,
        featuredColor,
      };

      const url = editingCategory ? `/api/categories/${editingCategory.id}` : '/api/categories';
      const method = editingCategory ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (data.success) {
        showNotice(editingCategory ? 'Category updated successfully!' : 'Category created successfully!');
        setIsCreating(false);
        setEditingCategory(null);
        onRefresh();
      } else {
        alert(data.error || 'Failed to save category');
      }
    } catch (err) {
      alert('Error saving category');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCategory = async (id: string, catName: string) => {
    const assignedCount = posts.filter((p) => p.categorySlug === id || p.category === catName).length;
    const confirmMsg = assignedCount > 0
      ? `Warning: "${catName}" has ${assignedCount} article(s) assigned to it. Are you sure you want to delete it?`
      : `Are you sure you want to permanently delete "${catName}"?`;

    if (!confirm(confirmMsg)) return;

    setDeletingId(id);
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        showNotice(`Category "${catName}" deleted successfully`);
        onRefresh();
      }
    } catch (e) {
      alert('Failed to delete category');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-3xl bg-tech-900/50 border border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-purple-400 mb-1">
            <FolderTree className="w-4 h-4" />
            <span>Product Taxonomy & Classification</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white">
            Category Manager ({categories.length})
          </h2>
          <p className="text-xs text-slate-400 font-mono mt-0.5">
            Create, modify, and delete hardware sectors live across the site.
          </p>
        </div>

        {!isCreating && !editingCategory && (
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-purple-400 to-tech-cyan shadow-glow font-mono flex items-center gap-2 hover:opacity-90 transition shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        )}
      </div>

      {notice && (
        <div className="p-3.5 rounded-xl bg-tech-emerald/10 border border-tech-emerald/30 text-tech-emerald text-xs font-mono flex items-center gap-2 animate-fadeIn">
          <Check className="w-4 h-4" />
          <span>{notice}</span>
        </div>
      )}

      {/* Add / Edit Category Slide-in Form */}
      {(isCreating || editingCategory) && (
        <div className="p-6 rounded-3xl bg-tech-900/80 border border-purple-500/40 shadow-glow space-y-5 animate-fadeIn">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span>{editingCategory ? `Edit Category: ${editingCategory.name}` : 'Create New Category'}</span>
            </h3>
            <button
              onClick={handleCancelForm}
              className="text-xs font-mono text-slate-400 hover:text-white"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSaveCategory} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder="e.g. Smart Wearables"
                  className="w-full px-3.5 py-2.5 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  URL Slug *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="e.g. smart-wearables"
                  className="w-full px-3.5 py-2.5 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Description / SEO Summary
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of hardware products covered in this sector..."
                className="w-full px-3.5 py-2.5 bg-tech-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-400"
              />
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                Select Lucide Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {Object.keys(AVAILABLE_ICONS).map((iKey) => {
                  const IconComp = AVAILABLE_ICONS[iKey];
                  const isSelected = iconName === iKey;
                  return (
                    <button
                      type="button"
                      key={iKey}
                      onClick={() => setIconName(iKey)}
                      className={`p-2.5 rounded-xl border flex items-center gap-1.5 text-xs transition ${
                        isSelected
                          ? 'bg-purple-500/20 border-purple-400 text-purple-300'
                          : 'bg-tech-950 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      <IconComp className="w-4 h-4" />
                      <span className="text-[11px] font-mono">{iKey}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Preset Picker */}
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-2">
                Featured Color Accent
              </label>
              <div className="flex flex-wrap gap-2">
                {COLOR_PRESETS.map((p) => {
                  const isSelected = featuredColor === p.value;
                  return (
                    <button
                      type="button"
                      key={p.value}
                      onClick={() => setFeaturedColor(p.value)}
                      className={`px-3 py-1.5 rounded-xl border text-xs flex items-center gap-2 transition ${
                        isSelected
                          ? 'border-purple-400 bg-white/10 text-white'
                          : 'border-slate-800 bg-tech-950 text-slate-400 hover:text-white'
                      }`}
                    >
                      <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${p.value}`} />
                      <span className="text-[11px] font-mono">{p.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center gap-3 pt-3 border-t border-slate-800">
              <button
                type="submit"
                disabled={saving}
                className="px-5 py-2.5 rounded-xl font-bold text-xs text-tech-950 bg-gradient-to-r from-purple-400 to-tech-cyan shadow-glow font-mono flex items-center gap-2 hover:opacity-90 transition disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                <span>{saving ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}</span>
              </button>

              <button
                type="button"
                onClick={handleCancelForm}
                className="px-4 py-2.5 rounded-xl text-xs font-mono text-slate-400 hover:text-white transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Categories Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => {
          const IconComp = AVAILABLE_ICONS[cat.iconName] || Cpu;
          const assignedPosts = posts.filter((p) => p.categorySlug === cat.slug);

          return (
            <div
              key={cat.id}
              className="p-5 rounded-3xl bg-tech-900/40 border border-slate-800 hover:border-purple-500/40 transition flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${cat.featuredColor || 'from-cyan-500 to-blue-600'} text-tech-950 font-bold shadow-md`}>
                    <IconComp className="w-5 h-5 text-white" />
                  </div>

                  <span className="text-[11px] font-mono text-slate-400 bg-white/5 border border-slate-800 px-2 py-0.5 rounded-full">
                    {assignedPosts.length} reviews
                  </span>
                </div>

                <h3 className="font-bold text-white text-base group-hover:text-tech-cyan transition mb-1">
                  {cat.name}
                </h3>
                <span className="text-[10px] font-mono text-slate-500 block mb-2">
                  /{cat.slug}
                </span>

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center justify-between">
                <Link
                  href={`/category/${cat.slug}`}
                  target="_blank"
                  className="text-xs font-mono text-tech-cyan hover:underline flex items-center gap-1"
                >
                  <span>View</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleStartEdit(cat)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition"
                    title="Edit category"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(cat.id, cat.name)}
                    disabled={deletingId === cat.id}
                    className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 transition disabled:opacity-50"
                    title="Delete category"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
