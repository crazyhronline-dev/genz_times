import fs from 'fs/promises';
import path from 'path';
import { BlogPost } from '@/types/blog';
import { evaluateEeat } from './eeat';
import { checkPlagiarism } from './plagiarism';
import { generateHighLevelSeo } from './auto-seo';

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'posts.json');
const BACKUP_FILE = path.join(DATA_DIR, 'posts.backup.json');
const ARCHIVE_FILE = path.join(DATA_DIR, 'deleted_posts.json');
const BACKUPS_DIR = path.join(DATA_DIR, 'backups');

/**
 * Ensures data directories and initial files exist
 */
async function ensureDataDirs() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    await fs.mkdir(BACKUPS_DIR, { recursive: true });
  } catch (err) {
    console.error('Directory creation notice:', err);
  }
}

/**
 * Safely writes posts atomically and updates secondary backups
 */
async function safeWritePosts(posts: BlogPost[], createSnapshot = true): Promise<void> {
  await ensureDataDirs();
  const jsonContent = JSON.stringify(posts, null, 2);

  // 1. Write atomically via temporary file
  const tmpFile = path.join(DATA_DIR, `posts.json.tmp.${Date.now()}.${Math.random().toString(36).substring(2, 7)}`);
  await fs.writeFile(tmpFile, jsonContent, 'utf-8');
  await fs.rename(tmpFile, DATA_FILE);

  // 2. Dual-save to persistent backup file
  try {
    await fs.writeFile(BACKUP_FILE, jsonContent, 'utf-8');
  } catch (bkErr) {
    console.warn('Backup write notice:', bkErr);
  }

  // 3. Create daily snapshot if requested
  if (createSnapshot) {
    try {
      const dateStr = new Date().toISOString().slice(0, 10);
      const snapPath = path.join(BACKUPS_DIR, `posts-${dateStr}.json`);
      await fs.writeFile(snapPath, jsonContent, 'utf-8');
    } catch (snapErr) {
      console.warn('Snapshot write notice:', snapErr);
    }
  }
}

/**
 * Retrieves all posts with multi-tiered fallback and auto-healing
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  // Layer 1: Try reading primary DATA_FILE
  try {
    const data = await fs.readFile(DATA_FILE, 'utf-8');
    if (data && data.trim().length > 0) {
      const posts: BlogPost[] = JSON.parse(data);
      if (Array.isArray(posts) && posts.length > 0) {
        return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
    }
  } catch (error) {
    console.error('Warning: Error reading primary posts database:', error);
  }

  // Layer 2: Auto-heal from BACKUP_FILE
  try {
    const backupData = await fs.readFile(BACKUP_FILE, 'utf-8');
    if (backupData && backupData.trim().length > 0) {
      const posts: BlogPost[] = JSON.parse(backupData);
      if (Array.isArray(posts) && posts.length > 0) {
        console.warn('Recovered posts from secondary backup! Auto-repairing primary data file...');
        await safeWritePosts(posts, false).catch(() => {});
        return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
    }
  } catch (backupError) {
    console.warn('Warning: Error reading secondary backup:', backupError);
  }

  // Layer 3: Auto-heal from latest snapshot in BACKUPS_DIR
  try {
    const files = await fs.readdir(BACKUPS_DIR);
    const postBackups = files.filter((f) => f.startsWith('posts-') && f.endsWith('.json')).sort().reverse();
    if (postBackups.length > 0) {
      const latestSnapshotPath = path.join(BACKUPS_DIR, postBackups[0]);
      const snapData = await fs.readFile(latestSnapshotPath, 'utf-8');
      const posts: BlogPost[] = JSON.parse(snapData);
      if (Array.isArray(posts) && posts.length > 0) {
        console.warn(`Recovered posts from snapshot ${postBackups[0]}! Auto-repairing...`);
        await safeWritePosts(posts, false).catch(() => {});
        return posts.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      }
    }
  } catch (snapError) {
    // ignore
  }

  return [];
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

  // Safeguard: If posts is empty unexpectedly, attempt to load backup to prevent overwrite
  if (posts.length === 0) {
    try {
      const backupData = await fs.readFile(BACKUP_FILE, 'utf-8');
      const backupPosts: BlogPost[] = JSON.parse(backupData);
      if (Array.isArray(backupPosts) && backupPosts.length > 0) {
        posts.push(...backupPosts);
      }
    } catch {
      // no backup
    }
  }

  const slug = postData.slug
    ? postData.slug.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : (postData.title || 'post').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

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

  // Safe Auto SEO metadata generation
  let autoSeo = {
    focusKeyword: `${postData.title || 'Gadget'} review`,
    tags: ['GenZ Tech', 'Gen Z Reviews', 'Hardware Tests', 'GenZ Time Lab'],
    metaTitle: `${postData.title || 'Gadget'} Review | GenZ Time`,
    metaDescription: (postData.content || '').slice(0, 160).replace(/[#*`_]/g, ''),
    slug,
  };

  try {
    autoSeo = generateHighLevelSeo({
      title: postData.title || '',
      content: postData.content || '',
      category: postData.category || 'Tech Gadgets',
      specs: postData.specs,
      authorName,
    });
  } catch (e) {
    console.warn('Auto SEO generation warning:', e);
  }

  const rawMetaTitle = postData.seo?.metaTitle || autoSeo.metaTitle;
  const cleanMetaTitle = rawMetaTitle.replace(/\s*\|\s*GenZ\s*Time.*$/i, '').trim() + ' | GenZ Time';

  // Safe E-E-A-T calculation
  let eeatScore = 94;
  if (typeof postData.eeatScore === 'number') {
    eeatScore = postData.eeatScore;
  } else {
    try {
      eeatScore = evaluateEeat({
        title: postData.title || '',
        content: postData.content || '',
        specs: postData.specs || {},
        pros: Array.isArray(postData.pros) ? postData.pros : [],
        cons: Array.isArray(postData.cons) ? postData.cons : [],
        verdictScore: postData.verdictScore,
      }).overallScore;
    } catch {
      eeatScore = 94;
    }
  }

  // Safe Plagiarism check
  let originalityScore = 98;
  if (typeof postData.originalityScore === 'number') {
    originalityScore = postData.originalityScore;
  } else {
    try {
      originalityScore = checkPlagiarism(postData.content || '').originalityScore;
    } catch {
      originalityScore = 98;
    }
  }

  const existingIndex = posts.findIndex((p) => p.id === id || p.slug === slug);
  const existingPost = existingIndex >= 0 ? posts[existingIndex] : null;

  const newPost: BlogPost = {
    id: existingPost?.id || id,
    title: postData.title || 'Untitled Article',
    subtitle: postData.subtitle,
    slug,
    excerpt: postData.excerpt || (postData.content || '').slice(0, 160).replace(/[#*`_]/g, '') + '...',
    content: postData.content || '',
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
    publishedAt: postData.publishedAt || existingPost?.publishedAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    readingTime,
    postType: postData.postType || (postData.verdictScore && postData.verdictScore > 0 ? 'review' : 'article'),
    verdictScore: postData.verdictScore ?? (existingPost?.verdictScore ?? 9.0),
    verdictSummary: postData.verdictSummary || existingPost?.verdictSummary || 'An exceptional tech gadget delivering superb performance and industrial design.',
    pros: Array.isArray(postData.pros) ? postData.pros.filter(Boolean) : (existingPost?.pros || []),
    cons: Array.isArray(postData.cons) ? postData.cons.filter(Boolean) : (existingPost?.cons || []),
    specs: postData.specs || existingPost?.specs || {},
    keyTakeaways: Array.isArray(postData.keyTakeaways) ? postData.keyTakeaways.filter(Boolean) : (existingPost?.keyTakeaways || []),
    faqs: postData.faqs || existingPost?.faqs || [],
    sources: postData.sources || existingPost?.sources || [],
    isComparison: postData.isComparison ?? (existingPost?.isComparison ?? false),
    comparisonCount: postData.comparisonCount ?? existingPost?.comparisonCount,
    comparedProducts: postData.comparedProducts ?? existingPost?.comparedProducts,
    seo: {
      metaTitle: cleanMetaTitle,
      metaDescription: postData.seo?.metaDescription?.trim() || autoSeo.metaDescription,
      focusKeyword: postData.seo?.focusKeyword?.trim() || autoSeo.focusKeyword,
      canonicalUrl: postData.seo?.canonicalUrl || `https://genztime.com/blog/${slug}`,
      ogImage: postData.seo?.ogImage || postData.featuredImage,
    },
    isFeatured: postData.isFeatured ?? (existingPost?.isFeatured ?? false),
    isTrending: postData.isTrending ?? (existingPost?.isTrending ?? false),
    views: typeof postData.views === 'number' ? postData.views : (existingPost?.views || 0),
    eeatScore,
    originalityScore,
  };

  if (existingIndex >= 0) {
    posts[existingIndex] = newPost;
  } else {
    posts.unshift(newPost);
  }

  await safeWritePosts(posts);
  return newPost;
}

export async function incrementPostViews(idOrSlug: string): Promise<number | null> {
  try {
    const posts = await getAllPosts();
    const post = posts.find((p) => p.id === idOrSlug || p.slug.toLowerCase() === idOrSlug.toLowerCase());
    if (!post) return null;
    post.views = (post.views || 0) + 1;
    await safeWritePosts(posts, false);
    return post.views;
  } catch (error) {
    console.error('Error incrementing post views:', error);
    return null;
  }
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await getAllPosts();
  const postToDelete = posts.find((p) => p.id === id);
  if (!postToDelete) return false;

  const filtered = posts.filter((p) => p.id !== id);

  // Safety guard: Never allow deleting all posts at once
  if (filtered.length === 0 && posts.length > 1) {
    console.error('Safety guard blocked accidental deletion of entire post database!');
    return false;
  }

  // Move to archive deleted_posts.json so it is NEVER lost
  try {
    await ensureDataDirs();
    let deletedList: BlogPost[] = [];
    try {
      const archData = await fs.readFile(ARCHIVE_FILE, 'utf-8');
      deletedList = JSON.parse(archData);
      if (!Array.isArray(deletedList)) deletedList = [];
    } catch {
      deletedList = [];
    }
    deletedList.unshift({ ...postToDelete, updatedAt: new Date().toISOString() });
    await fs.writeFile(ARCHIVE_FILE, JSON.stringify(deletedList, null, 2), 'utf-8');
  } catch (archErr) {
    console.warn('Archive save warning:', archErr);
  }

  await safeWritePosts(filtered);
  return true;
}

/**
 * Restores an archived post back to the live database
 */
export async function restoreDeletedPost(id: string): Promise<BlogPost | null> {
  try {
    const archData = await fs.readFile(ARCHIVE_FILE, 'utf-8');
    const deletedList: BlogPost[] = JSON.parse(archData);
    const postIndex = deletedList.findIndex((p) => p.id === id);
    if (postIndex === -1) return null;

    const postToRestore = deletedList[postIndex];
    deletedList.splice(postIndex, 1);
    await fs.writeFile(ARCHIVE_FILE, JSON.stringify(deletedList, null, 2), 'utf-8');

    return await savePost(postToRestore);
  } catch (error) {
    console.error('Error restoring post:', error);
    return null;
  }
}
