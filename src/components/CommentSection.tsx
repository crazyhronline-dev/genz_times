'use client';

import React, { useState } from 'react';
import { MessageSquare, Send, CheckCircle2 } from 'lucide-react';

interface Comment {
  id: string;
  name: string;
  handle: string;
  timeAgo: string;
  text: string;
}

export default function CommentSection() {
  const [comments, setComments] = useState<Comment[]>([
    {
      id: 'c1',
      name: 'Alex Rivera',
      handle: '@alexhardware',
      timeAgo: '2 days ago',
      text: 'Spot on with the thermal analysis! Great to see a review that actually measures the wattage under sustained 4K rendering load instead of just repeating press release numbers.',
    },
    {
      id: 'c2',
      name: 'Priya Sharma',
      handle: '@priyadev',
      timeAgo: 'Yesterday',
      text: 'How does the battery drain behave during continuous 5G tethering? Wondering if this makes a difference for daily mobile workflows.',
    },
  ]);

  const [author, setAuthor] = useState('');
  const [newComment, setNewComment] = useState('');
  const [success, setSuccess] = useState(false);

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const commentObj: Comment = {
      id: `c-${Date.now()}`,
      name: author.trim() || 'Tech Enthusiast',
      handle: `@${(author.trim() || 'guest').toLowerCase().replace(/\s+/g, '')}`,
      timeAgo: 'Just now',
      text: newComment.trim(),
    };

    setComments([...comments, commentObj]);
    setNewComment('');
    setAuthor('');
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <section className="my-12 p-6 sm:p-8 rounded-3xl bg-tech-900/50 border border-slate-800">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5 text-tech-cyan" />
        <h3 className="text-lg font-bold text-white">Community Discussion & Tech Feedback</h3>
        <span className="text-xs font-mono bg-white/10 px-2.5 py-0.5 rounded-full text-slate-300">
          {comments.length} Comments
        </span>
      </div>

      {/* Existing Comments */}
      <div className="space-y-4 mb-6">
        {comments.map((c) => (
          <div key={c.id} className="p-4 rounded-xl bg-tech-950/70 border border-slate-800/80">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-sm text-white font-mono">
                {c.name} <span className="text-slate-500 font-normal text-xs">({c.handle})</span>
              </span>
              <span className="text-[11px] font-mono text-slate-500">{c.timeAgo}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{c.text}</p>
          </div>
        ))}
      </div>

      {success && (
        <div className="p-3 mb-4 rounded-xl bg-tech-emerald/15 border border-tech-emerald/30 text-tech-emerald text-xs font-mono flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Comment posted to community thread!</span>
        </div>
      )}

      {/* Add comment box */}
      <form onSubmit={handleAddComment} className="pt-4 border-t border-slate-800 space-y-3">
        <h4 className="text-xs font-mono text-slate-400 uppercase tracking-wider">
          Leave a Question or Verdict Feedback
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            placeholder="Your name or handle..."
            className="sm:col-span-1 bg-tech-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan"
          />
          <input
            type="text"
            required
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Ask a technical question or share your impressions..."
            className="sm:col-span-2 bg-tech-950 border border-slate-700 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-tech-cyan"
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-tech-cyan text-tech-950 font-bold text-xs font-mono flex items-center gap-1.5 hover:opacity-90 transition shadow-glow active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Comment</span>
          </button>
        </div>
      </form>
    </section>
  );
}
