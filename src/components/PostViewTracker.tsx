'use client';

import { useEffect, useRef } from 'react';

export default function PostViewTracker({ postId }: { postId: string }) {
  const tracked = useRef(false);

  useEffect(() => {
    if (tracked.current) return;
    tracked.current = true;

    try {
      fetch(`/api/posts/${postId}/view`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      }).catch(() => {});
    } catch (e) {}
  }, [postId]);

  return null;
}
