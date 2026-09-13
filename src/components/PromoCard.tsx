'use client';

import React, { useState } from 'react';
import { PromoDeal } from '@/types/deal';
import { 
  Ticket, 
  ExternalLink, 
  Check, 
  Copy, 
  Sparkles, 
  Tag, 
  Store, 
  ShieldCheck, 
  Flame,
  ArrowRight
} from 'lucide-react';

interface PromoCardProps {
  deal: PromoDeal;
  onSelectTag?: (tag: string) => void;
}

export default function PromoCard({ deal, onSelectTag }: PromoCardProps) {
  // If hideCode is true, the code starts concealed (masked 50%)
  const [isRevealed, setIsRevealed] = useState<boolean>(!deal.hideCode);
  const [copied, setCopied] = useState(false);

  // Compute 50% masked representation of promo code
  const code = deal.promoCode || '';
  const halfLen = Math.ceil(code.length / 2);
  const visiblePart = code.slice(0, halfLen);
  const maskedPart = '*'.repeat(Math.max(0, code.length - halfLen));

  const handleGetCode = async () => {
    // 1. Reveal code on the card
    setIsRevealed(true);

    // 2. Copy code to clipboard if present
    if (code) {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (err) {
        console.error('Clipboard copy failed:', err);
      }
      // Record copy metric asynchronously
      fetch(`/api/deals/${deal.id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'copy' }),
      }).catch(() => {});
    }

    // 3. If referral link is present, open in a new tab
    if (deal.referralUrl) {
      window.open(deal.referralUrl, '_blank', 'noopener,noreferrer');
      fetch(`/api/deals/${deal.id}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'click' }),
      }).catch(() => {});
    }
  };

  const handleCopyOnly = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!code) return;
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch (err) {
      console.error('Clipboard copy failed:', err);
    }
  };

  return (
    <article 
      itemScope 
      itemType="https://schema.org/Offer" 
      id={deal.id}
      className="group relative rounded-3xl bg-tech-900/60 border border-slate-800/90 hover:border-tech-cyan/50 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-xl hover:shadow-glow"
    >
      <meta itemProp="name" content={deal.metaTitle || deal.title} />
      <meta itemProp="description" content={deal.metaDescription || deal.description} />
      <meta itemProp="price" content={deal.discountText} />
      <meta itemProp="priceCurrency" content="USD" />
      <meta itemProp="availability" content="https://schema.org/InStock" />
      <meta itemProp="priceValidUntil" content={deal.expiresAt || "2026-12-31"} />
      <meta itemProp="validFrom" content={deal.verifiedAt || deal.createdAt || "2026-09-01"} />
      {deal.promoCode && <meta itemProp="couponCode" content={deal.promoCode} />}
      <meta itemProp="url" content={deal.referralUrl || `https://genztime.com/deals#${deal.id}`} />

      {/* Top Banner Image with Badges */}
      <div className={`relative aspect-[16/9] w-full overflow-hidden flex items-center justify-center ${
        deal.imageUrl.includes('logos') ? 'bg-slate-900/90' : 'bg-tech-950'
      }`}>
        <img
          src={deal.imageUrl}
          alt={deal.imageAlt || deal.metaTitle || `${deal.title} - ${deal.store} discount coupon`}
          itemProp="image"
          loading="lazy"
          className={`transition-transform duration-500 group-hover:scale-105 ${
            deal.imageUrl.includes('logos')
              ? 'w-auto h-auto max-w-[75%] max-h-[65%] object-contain drop-shadow-md'
              : 'w-full h-full object-cover'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tech-950 via-tech-950/30 to-transparent pointer-events-none" />

        {/* Store Name Badge */}
        <div className="absolute top-3.5 left-3.5 z-10" itemProp="seller" itemScope itemType="https://schema.org/Organization">
          <span itemProp="name" className="px-3 py-1 rounded-xl text-xs font-mono font-bold bg-tech-950/85 backdrop-blur-md text-white border border-slate-700/80 shadow-md flex items-center gap-1.5">
            <Store className="w-3.5 h-3.5 text-tech-cyan" />
            <span>{deal.store}</span>
          </span>
        </div>

        {/* Discount Ribbon Badge */}
        <div className="absolute top-3.5 right-3.5 z-10">
          <span className="px-3 py-1 rounded-xl text-xs font-mono font-black uppercase tracking-wider bg-gradient-to-r from-emerald-400 to-teal-500 text-tech-950 shadow-glow flex items-center gap-1">
            <Flame className="w-3.5 h-3.5 text-tech-950 fill-tech-950 animate-pulse" />
            <span>{deal.discountText}</span>
          </span>
        </div>

        {/* Verified Today Tag */}
        <div className="absolute bottom-3 left-3.5 z-10 flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 bg-tech-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-500/30 backdrop-blur-sm">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Verified & Tested</span>
        </div>
      </div>

      {/* Content Body */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <h3 className="font-bold text-white text-lg group-hover:text-tech-cyan transition-colors leading-snug mb-2">
            {deal.title}
          </h3>

          <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
            {deal.description}
          </p>

          {/* High-Ranking Tag Chips */}
          {deal.tags && deal.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 pt-3">
              {deal.tags.slice(0, 4).map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTag?.(tag);
                  }}
                  className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 hover:bg-tech-cyan/20 text-slate-400 hover:text-tech-cyan border border-slate-800 hover:border-tech-cyan/40 transition flex items-center gap-0.5"
                  title={`Filter by #${tag}`}
                >
                  <Tag className="w-2.5 h-2.5 opacity-60" />
                  <span>#{tag}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Category & Verified Status */}
        <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-3 border-t border-slate-800/80">
          <span className="capitalize px-2 py-0.5 rounded bg-white/5 border border-slate-800">
            #{deal.category}
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Verified Active</span>
          </span>
        </div>

        {/* Promo Code & Action Box */}
        <div className="space-y-3 pt-2">
          {code ? (
            <div className="p-3 rounded-2xl bg-tech-950 border border-dashed border-tech-cyan/40 flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block mb-0.5">
                  Promo Code
                </span>
                <div className="flex items-center gap-1 font-mono font-black text-sm text-white tracking-widest">
                  {isRevealed ? (
                    <span className="text-tech-cyan select-all">{code}</span>
                  ) : (
                    <>
                      <span className="text-white">{visiblePart}</span>
                      <span className="text-slate-500 select-none">{maskedPart}</span>
                    </>
                  )}
                </div>
              </div>

              {isRevealed && (
                <button
                  type="button"
                  onClick={handleCopyOnly}
                  className="p-2 rounded-xl bg-tech-cyan/15 hover:bg-tech-cyan/25 text-tech-cyan border border-tech-cyan/30 text-xs font-mono flex items-center gap-1 transition"
                  title="Copy full code"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-tech-emerald" />
                      <span className="text-tech-emerald text-[11px] font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="text-[11px]">Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-2xl bg-tech-950 border border-slate-800 flex items-center gap-2 text-xs font-mono text-emerald-400">
              <Sparkles className="w-4 h-4 shrink-0" />
              <span>Direct Discount Applied (No Code Required)</span>
            </div>
          )}

          {/* Primary Action Button */}
          {!isRevealed ? (
            <button
              type="button"
              onClick={handleGetCode}
              className="w-full py-3 px-4 rounded-xl font-bold font-mono text-xs text-tech-950 bg-gradient-to-r from-tech-cyan via-teal-300 to-emerald-400 shadow-glow flex items-center justify-center gap-2 hover:opacity-95 transition-all group/btn"
            >
              <Ticket className="w-4 h-4 text-tech-950 group-hover/btn:rotate-12 transition-transform" />
              <span>Get This Promo Code</span>
              {deal.referralUrl && <ExternalLink className="w-3.5 h-3.5 opacity-80" />}
            </button>
          ) : deal.referralUrl ? (
            <a
              href={deal.referralUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 px-4 rounded-xl font-bold font-mono text-xs text-white bg-white/10 hover:bg-white/20 border border-slate-700 flex items-center justify-center gap-2 transition"
            >
              <span>{copied ? 'Code Copied! Visit Store' : 'Visit Store / Claim Deal'}</span>
              <ExternalLink className="w-3.5 h-3.5 text-tech-cyan" />
            </a>
          ) : (
            <button
              type="button"
              onClick={handleCopyOnly}
              className="w-full py-2.5 px-4 rounded-xl font-bold font-mono text-xs text-tech-emerald bg-tech-emerald/15 border border-tech-emerald/30 flex items-center justify-center gap-2 transition"
            >
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Code Copied to Clipboard!' : 'Copy Promo Code'}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
