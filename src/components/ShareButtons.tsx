'use client';

import React, { useState } from 'react';
import { Share2, Twitter, Facebook, Linkedin, Link as LinkIcon, Check } from 'lucide-react';

interface Props {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  return (
    <div className="flex items-center gap-2 py-4 border-y border-slate-800/80 my-6">
      <div className="flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 mr-2">
        <Share2 className="w-4 h-4 text-tech-cyan" />
        <span>Share Review:</span>
      </div>

      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-white/5 hover:bg-tech-cyan/20 hover:text-tech-cyan transition text-slate-300"
        title="Share on X (Twitter)"
      >
        <Twitter className="w-4 h-4" />
      </a>

      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-white/5 hover:bg-blue-500/20 hover:text-blue-400 transition text-slate-300"
        title="Share on LinkedIn"
      >
        <Linkedin className="w-4 h-4" />
      </a>

      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="p-2 rounded-lg bg-white/5 hover:bg-blue-600/20 hover:text-blue-500 transition text-slate-300"
        title="Share on Facebook"
      >
        <Facebook className="w-4 h-4" />
      </a>

      <button
        onClick={handleCopy}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
          copied
            ? 'bg-tech-emerald/20 text-tech-emerald border border-tech-emerald/40'
            : 'bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
        }`}
        title="Copy Link to Clipboard"
      >
        {copied ? (
          <>
            <Check className="w-3.5 h-3.5" />
            <span>Copied!</span>
          </>
        ) : (
          <>
            <LinkIcon className="w-3.5 h-3.5" />
            <span>Copy Link</span>
          </>
        )}
      </button>
    </div>
  );
}
