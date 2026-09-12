import fs from 'fs/promises';
import path from 'path';
import { CategoryInfo } from '@/types/blog';

const CATEGORIES_FILE = path.join(process.cwd(), 'data', 'categories.json');

export const DEFAULT_CATEGORIES: CategoryInfo[] = [
  {
    id: 'cat-1',
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'In-depth reviews, camera shootouts, and battery tests of flagship, foldable, and budget phones.',
    iconName: 'Smartphone',
    featuredColor: 'from-cyan-500 to-blue-600',
  },
  {
    id: 'cat-2',
    name: 'Laptops & Computing',
    slug: 'laptops-computing',
    description: 'Benchmarks, thermal analysis, and creative workstation evaluations for pros and power users.',
    iconName: 'Laptop',
    featuredColor: 'from-violet-500 to-purple-700',
  },
  {
    id: 'cat-3',
    name: 'Audio & Earbuds',
    slug: 'audio-earbuds',
    description: 'Audiophile-grade frequency curve analysis, ANC tests, and true wireless earbud comparisons.',
    iconName: 'Headphones',
    featuredColor: 'from-emerald-400 to-teal-600',
  },
  {
    id: 'cat-4',
    name: 'VR & Wearables',
    slug: 'vr-wearables',
    description: 'Spatial computing, mixed reality headsets, smartwatches, and biometrics tracking hardware.',
    iconName: 'Glasses',
    featuredColor: 'from-fuchsia-500 to-pink-600',
  },
  {
    id: 'cat-5',
    name: 'Drones & Cameras',
    slug: 'drones-cameras',
    description: 'Mirrorless cinema rigs, gimbal stabilizers, action cams, and autonomous aerial quadcopters.',
    iconName: 'Camera',
    featuredColor: 'from-amber-400 to-orange-600',
  },
  {
    id: 'cat-6',
    name: 'AI Gadgets & Future Tech',
    slug: 'ai-gadgets',
    description: 'Ambient computing, wearable AI pins, autonomous agents, and experimental next-gen hardware.',
    iconName: 'Cpu',
    featuredColor: 'from-cyan-400 to-indigo-600',
  },
  {
    id: 'cat-7',
    name: 'Gaming Gear',
    slug: 'gaming-gear',
    description: 'Handheld consoles, high-refresh OLED displays, mechanical keyboards, and GPU benchmarks.',
    iconName: 'Gamepad2',
    featuredColor: 'from-rose-500 to-red-600',
  },
  {
    id: 'cat-8',
    name: 'Smart Home & IoT',
    slug: 'smart-home',
    description: 'Matter-compatible mesh networks, robotic vacuums, smart lighting, and ambient home automation.',
    iconName: 'Home',
    featuredColor: 'from-teal-400 to-emerald-600',
  },
];

export async function getAllCategories(): Promise<CategoryInfo[]> {
  try {
    const data = await fs.readFile(CATEGORIES_FILE, 'utf-8');
    const categories: CategoryInfo[] = JSON.parse(data);
    return categories && categories.length > 0 ? categories : DEFAULT_CATEGORIES;
  } catch (error) {
    return DEFAULT_CATEGORIES;
  }
}

export async function getCategoryBySlug(slug: string): Promise<CategoryInfo | null> {
  const categories = await getAllCategories();
  return categories.find((c) => c.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function getCategoryById(id: string): Promise<CategoryInfo | null> {
  const categories = await getAllCategories();
  return categories.find((c) => c.id === id) || null;
}

export async function saveCategory(categoryData: Partial<CategoryInfo> & { name: string }): Promise<CategoryInfo> {
  const categories = await getAllCategories();
  const slug = categoryData.slug
    ? categoryData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : categoryData.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const id = categoryData.id || `cat-${Date.now()}`;

  const newCategory: CategoryInfo = {
    id,
    name: categoryData.name,
    slug,
    description: categoryData.description || `Latest reviews, benchmarks, and guides for ${categoryData.name}.`,
    iconName: categoryData.iconName || 'Cpu',
    featuredColor: categoryData.featuredColor || 'from-cyan-500 to-blue-600',
  };

  const existingIndex = categories.findIndex((c) => c.id === id || c.slug === slug);
  if (existingIndex >= 0) {
    categories[existingIndex] = { ...categories[existingIndex], ...newCategory, id: categories[existingIndex].id };
  } else {
    categories.push(newCategory);
  }

  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
  return newCategory;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const categories = await getAllCategories();
  const filtered = categories.filter((c) => c.id !== id);
  if (filtered.length === categories.length) return false;
  await fs.writeFile(CATEGORIES_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
