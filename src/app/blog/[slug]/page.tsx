import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/posts-db';
import { generatePostGraphSchema, SITE_CONFIG } from '@/lib/seo';
import GadgetSpecsBox from '@/components/GadgetSpecsBox';
import ProsConsBox from '@/components/ProsConsBox';
import VerdictBadge from '@/components/VerdictBadge';
import ComparisonMatrix from '@/components/ComparisonMatrix';
import ShareButtons from '@/components/ShareButtons';
import PostCard from '@/components/PostCard';
import CommentSection from '@/components/CommentSection';
import EeatBadge from '@/components/EeatBadge';
import { evaluateEeat } from '@/lib/eeat';
import { 
  Calendar, 
  Clock, 
  ChevronRight, 
  Star, 
  ShieldCheck, 
  Tag, 
  MessageSquare, 
  UserCheck,
  Send,
  FileText,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  ExternalLink,
  Link as LinkIcon
} from 'lucide-react';

interface PageProps {
  params: {
    slug: string;
  };
}

// Dynamic SEO Metadata for Search Engines & Social Platforms
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return {
      title: 'Article Not Found | GenZ Time',
    };
  }

  const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;

  return {
    title: post.seo?.metaTitle || `${post.title} | GenZ Time`,
    description: post.seo?.metaDescription || post.excerpt,
    keywords: post.tags,
    alternates: {
      canonical: post.seo?.canonicalUrl || postUrl,
    },
    openGraph: {
      type: 'article',
      url: postUrl,
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt || post.publishedAt,
      authors: [post.author.name],
      tags: post.tags,
      images: [
        {
          url: post.seo?.ogImage || post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seo?.metaTitle || post.title,
      description: post.seo?.metaDescription || post.excerpt,
      images: [post.seo?.ogImage || post.featuredImage],
      creator: SITE_CONFIG.twitterHandle,
    },
  };
}

export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const dynamicParams = true;

// Generate static params for initial build & SEO indexing
export async function generateStaticParams() {
  const posts = await getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function SinglePostPage({ params }: PageProps) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(post.id, post.categorySlug, 3);
  const postSchema = generatePostGraphSchema(post);

  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const eeatAudit = evaluateEeat({
    title: post.title,
    content: post.content,
    authorName: post.author.name,
    authorBio: post.author.bio,
    specs: post.specs,
    pros: post.pros,
    cons: post.cons,
    verdictScore: post.verdictScore,
  });

  const postUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;

  // Simple parser to render markdown-like content into clean HTML sections
  const renderContent = (content: string) => {
    const paragraphs = content.split('\n\n');
    return paragraphs.map((block, idx) => {
      const trimmed = block.trim();
      if (trimmed.startsWith('### ')) {
        return (
          <h3 key={idx} className="text-xl font-bold text-tech-cyan mt-8 mb-3">
            {trimmed.replace('### ', '')}
          </h3>
        );
      }
      if (trimmed.startsWith('## ')) {
        return (
          <h2 key={idx} className="text-2xl font-black text-white mt-10 mb-4 pb-2 border-b border-slate-800">
            {trimmed.replace('## ', '')}
          </h2>
        );
      }
      if (trimmed.startsWith('- ')) {
        const items = trimmed.split('\n').map((line) => line.replace(/^[-\*]\s+/, ''));
        return (
          <ul key={idx} className="space-y-2 my-4 pl-5 list-disc text-slate-300">
            {items.map((it, i) => (
              <li key={i} className="leading-relaxed">
                <span dangerouslySetInnerHTML={{ __html: it.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>') }} />
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p
          key={idx}
          className="text-base sm:text-lg text-slate-300 leading-relaxed my-4"
          dangerouslySetInnerHTML={{
            __html: trimmed.replace(/\*\*(.*?)\*\*/g, '<strong class="text-white font-semibold">$1</strong>'),
          }}
        />
      );
    });
  };

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Engine Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
      />

      {/* 1. Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs font-mono text-slate-400 mb-6 overflow-x-auto no-scrollbar">
        <Link href="/" className="hover:text-white transition">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href="/blog" className="hover:text-white transition">Reviews</Link>
        <ChevronRight className="w-3.5 h-3.5 flex-shrink-0" />
        <Link href={`/category/${post.categorySlug}`} className="text-tech-cyan hover:underline transition">
          {post.category}
        </Link>
      </nav>

      {/* 2. Article Header & Metadata */}
      <header className="space-y-4 mb-8">
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            href={`/category/${post.categorySlug}`}
            className="px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30"
          >
            {post.category}
          </Link>

          {post.postType === 'article' || !post.verdictScore ? (
            <>
              <span className="flex items-center gap-1 text-xs font-mono bg-tech-cyan/10 text-tech-cyan border border-tech-cyan/30 px-3 py-1 rounded-full font-bold">
                <FileText className="w-3.5 h-3.5" />
                <span>Editorial Deep-Dive</span>
              </span>
              <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-tech-emerald" />
                Verified Editorial Integrity
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1 text-xs font-mono bg-tech-emerald/10 text-tech-emerald border border-tech-emerald/30 px-3 py-1 rounded-full font-bold">
                <Star className="w-3.5 h-3.5 fill-tech-emerald" />
                <span>Score: {post.verdictScore.toFixed(1)} / 10</span>
              </span>
              <span className="text-xs font-mono text-slate-500 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-tech-cyan" />
                Verified Hardware Lab Test
              </span>
            </>
          )}
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight tracking-tight">
          {post.title}
        </h1>

        {post.subtitle && (
          <p className="text-lg sm:text-xl text-slate-200 font-semibold border-l-2 border-tech-cyan pl-4 my-2 italic">
            {post.subtitle}
          </p>
        )}

        <p className="text-lg text-slate-300 leading-relaxed font-normal">
          {post.excerpt}
        </p>

        {/* Byline Author & Time */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover border border-tech-cyan/40"
            />
            <div>
              <span className="font-bold text-white block text-sm">{post.author.name}</span>
              <span className="text-slate-400">{post.author.role}</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              {formattedDate}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {post.readingTime}
            </span>
          </div>
        </div>
      </header>

      {/* 3. Featured Image */}
      <div className="relative rounded-3xl overflow-hidden aspect-[16/9] mb-10 border border-slate-800 shadow-2xl bg-tech-950">
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Key Takeaways / Executive Highlights (For Articles) */}
      {post.keyTakeaways && post.keyTakeaways.length > 0 && (
        <div className="my-8 p-6 rounded-3xl bg-tech-900/60 border border-tech-cyan/30 shadow-glow space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-tech-cyan">
            <Sparkles className="w-4 h-4" />
            <span>Key Takeaways & Executive Summary</span>
          </div>
          <ul className="space-y-2">
            {post.keyTakeaways.map((item, i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm sm:text-base text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-tech-emerald shrink-0 mt-1" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* 4. Social Sharing Toolbar */}
      <ShareButtons url={postUrl} title={post.title} />

      {/* 5. Article Body */}
      <div className="prose-tech">
        {renderContent(post.content)}
      </div>

      {/* 6. Hardware Specifications & Benchmark Matrix (Reviews only) */}
      {post.postType !== 'article' && post.isComparison && post.comparedProducts && post.comparedProducts.length > 1 ? (
        <ComparisonMatrix products={post.comparedProducts} reviewTitle={post.title} />
      ) : (
        <>
          {/* Single Gadget Technical Specifications Sheet */}
          {post.postType !== 'article' && post.specs && Object.keys(post.specs).length > 0 && (
            <GadgetSpecsBox specs={post.specs} gadgetTitle={post.title.split(':')[0]} />
          )}

          {/* Single Gadget Pros & Cons Comparison */}
          {post.postType !== 'article' && ((post.pros?.length ?? 0) > 0 || (post.cons?.length ?? 0) > 0) && (
            <ProsConsBox pros={post.pros || []} cons={post.cons || []} />
          )}
        </>
      )}

      {/* 8. FAQs Accordion (If provided) */}
      {post.faqs && post.faqs.length > 0 && (
        <div className="my-10 p-6 sm:p-8 rounded-3xl bg-tech-900/40 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-tech-cyan font-bold mb-2">
            <HelpCircle className="w-4 h-4" />
            <span>Frequently Asked Questions</span>
          </div>
          <div className="divide-y divide-slate-800/80">
            {post.faqs.map((faq, idx) => (
              <div key={idx} className="py-4 space-y-1.5">
                <h4 className="font-bold text-white text-base">{faq.question}</h4>
                <p className="text-sm text-slate-300 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. Citations & Reference Sources (If provided) */}
      {post.sources && post.sources.length > 0 && (
        <div className="my-8 p-5 rounded-2xl bg-tech-950/60 border border-slate-800/80 space-y-2">
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
            <LinkIcon className="w-3.5 h-3.5 text-tech-cyan" />
            <span>References & Verified Sources</span>
          </div>
          <div className="space-y-1.5">
            {post.sources.map((src, i) => (
              <div key={i} className="text-xs font-mono">
                <a
                  href={src.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-tech-cyan hover:underline flex items-center gap-1.5"
                >
                  <span>{src.title}</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. Google E-E-A-T Quality & Hardware Lab Audit Badge */}
      <EeatBadge audit={eeatAudit} deviceTitle={post.title} />

      {/* 11. Official GenZ Time Verdict Badge (Reviews only - for single product reviews) */}
      {post.postType !== 'article' && (!post.isComparison || !post.comparedProducts || post.comparedProducts.length <= 1) && post.verdictScore && (
        <VerdictBadge
          score={post.verdictScore}
          summary={post.verdictSummary || ''}
          gadgetName={post.title}
        />
      )}

      {/* 9. Tags & Keywords */}
      <div className="pt-6 border-t border-slate-800 my-8">
        <div className="flex items-center gap-2 mb-3 text-xs font-mono uppercase tracking-wider text-slate-400">
          <Tag className="w-3.5 h-3.5 text-tech-cyan" />
          <span>Device Keywords & Indexing Tags:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-lg text-xs font-mono bg-tech-900 border border-slate-700/80 text-slate-300"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* 10. Author Credentials Box */}
      <div className="p-6 rounded-2xl bg-tech-900/60 border border-slate-800 my-10 flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <img
          src={post.author.avatar}
          alt={post.author.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-tech-cyan/40 flex-shrink-0"
        />
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-white text-base">{post.author.name}</h4>
            <span className="flex items-center gap-1 text-[10px] font-mono bg-tech-cyan/10 text-tech-cyan px-2 py-0.5 rounded border border-tech-cyan/30">
              <UserCheck className="w-3 h-3" /> Hardware Verified
            </span>
          </div>
          <p className="text-xs font-mono text-tech-cyan mb-2">{post.author.role}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{post.author.bio}</p>
        </div>
      </div>

      {/* 11. Interactive Discussion / Comments Module */}
      <CommentSection />

      {/* 12. Related Gadget Reviews */}
      {relatedPosts.length > 0 && (
        <section className="my-16 pt-10 border-t border-slate-800">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-black text-white">More Related Gadget Reviews</h3>
            <Link href="/blog" className="text-xs font-mono text-tech-cyan hover:underline">
              Browse All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map((rel) => (
              <PostCard key={rel.id} post={rel} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
