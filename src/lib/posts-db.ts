import fs from 'fs/promises';
import path from 'path';
import { BlogPost } from '@/types/blog';
import { evaluateEeat } from './eeat';
import { checkPlagiarism } from './plagiarism';
import { generateHighLevelSeo } from './auto-seo';

const DATA_FILE = path.join(process.cwd(), 'data', 'posts.json');

export async function getAllPosts(): Promise<BlogPost[]> {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    const posts: BlogPost[] = JSON.parse(data);
    // Return sorted by publishedAt descending (newest first)
    return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  } catch (error) {
    console.error('Error reading posts database:', error);
    return [];
  }
}

export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.slug.toLowerCase() === slug.toLowerCase()) || null;
}

export async function getPostById(id: string): Promise<BlogPost | null> {
  const posts = await getAllPosts();
  return posts.find((p) => p.id === id) || null;
}

export async function getFeaturedPosts(): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const featured = posts.filter((p) => p.isFeatured);
  return featured.length > 0 ? featured : posts.slice(0, 3);
}

export async function getTrendingPosts(): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.isTrending);
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  return posts.filter((p) => p.categorySlug.toLowerCase() === categorySlug.toLowerCase());
}

export async function getRelatedPosts(currentPostId: string, categorySlug: string, limit = 3): Promise<BlogPost[]> {
  const posts = await getAllPosts();
  const sameCat = posts.filter((p) => p.id !== currentPostId && p.categorySlug === categorySlug);
  if (sameCat.length >= limit) {
    return sameCat.slice(0, limit);
  }
  const others = posts.filter((p) => p.id !== currentPostId && p.categorySlug !== categorySlug);
  return [...sameCat, ...others].slice(0, limit);
}

export async function savePost(postData: Partial<BlogPost> & { title: string; content: string }): Promise<BlogPost> {
  const posts = await getAllPosts();

  const slug = postData.slug
    ? postData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : postData.title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const id = postData.id || `post-${Date.now()}`;

  // Estimate reading time: ~200 words per minute
  const wordCount = (postData.content || '').split(/\s+/).length;
  const readingTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

  const authorName = (postData.author?.name && postData.author.name !== 'GenZ Editorial Team')
    ? postData.author.name
    : 'Sahil';
  const authorRole = (postData.author?.role && postData.author.role !== 'Founder & Tech Editor')
    ? postData.author.role
    : 'Founder & Lead Hardware Editor';

  // Auto SEO metadata generation
  const autoSeo = generateHighLevelSeo({
    title: postData.title,
    content: postData.content,
    category: postData.category || 'Tech Gadgets',
    specs: postData.specs,
    authorName,
  });

  const rawMetaTitle = postData.seo?.metaTitle || autoSeo.metaTitle;
  const cleanMetaTitle = rawMetaTitle.replace(/\s*\|\s*GenZ\s*Time.*$/i, '').trim() + ' | GenZ Time';

  const newPost: BlogPost = {
    id,
    title: postData.title,
    slug,
    excerpt: postData.excerpt || postData.content.slice(0, 160).replace(/[#*`_]/g, '') + '...',
    content: postData.content,
    featuredImage: postData.featuredImage || 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1400&q=80',
    featuredImageAlt: postData.featuredImageAlt?.trim() || `${postData.title} - GenZ Time hardware lab review`,
    category: postData.category || 'Smartphones',
    categorySlug: postData.categorySlug || 'smartphones',
    tags: postData.tags && postData.tags.length > 0 ? postData.tags : autoSeo.tags,
    author: {
      name: authorName,
      role: authorRole,
      avatar: postData.author?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: postData.author?.bio || 'Lead hardware reviewer and founder at GenZ Time. Rigorously testing smartphones, silicon benchmarks, gaming gear, and AI hardware with real hands-on lab data.',
    },
    publishedAt: postData.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readingTime,
    verdictScore: postData.verdictScore ?? 9.0,
    verdictSummary: postData.verdictSummary || 'An exceptional tech gadget delivering superb performance and industrial design.',
    pros: postData.pros && postData.pros.length > 0 ? postData.pros : ['Cutting-edge engineering', 'Class-leading performance'],
    cons: postData.cons && postData.cons.length > 0 ? postData.cons : ['Premium pricing'],
    specs: postData.specs || {},
    seo: {
      metaTitle: cleanMetaTitle,
      metaDescription: postData.seo?.metaDescription?.trim() || autoSeo.metaDescription,
      focusKeyword: postData.seo?.focusKeyword?.trim() || autoSeo.focusKeyword,
      canonicalUrl: postData.seo?.canonicalUrl || `https://genztime.com/blog/${slug}`,
      ogImage: postData.seo?.ogImage || postData.featuredImage,
    },
    isFeatured: postData.isFeatured ?? false,
    isTrending: postData.isTrending ?? false,
    views: postData.views ?? Math.floor(Math.random() * 500) + 100,
    eeatScore: postData.eeatScore ?? evaluateEeat({
      title: postData.title,
      content: postData.content,
      specs: postData.specs,
      pros: postData.pros,
      cons: postData.cons,
      verdictScore: postData.verdictScore,
    }).overallScore,
    originalityScore: postData.originalityScore ?? checkPlagiarism(postData.content).originalityScore,
  };

  const existingIndex = posts.findIndex((p) => p.id === id || p.slug === slug);
  if (existingIndex >= 0) {
    posts[existingIndex] = { ...posts[existingIndex], ...newPost, id: posts[existingIndex].id };
  } else {
    posts.unshift(newPost);
  }

  await fs.writeFile(DATA_FILE, JSON.stringify(posts, null, 2), 'utf-8');
  return newPost;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await getAllPosts();
  const filtered = posts.filter((p) => p.id !== id);
  if (filtered.length === posts.length) return false;
  await fs.writeFile(DATA_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
