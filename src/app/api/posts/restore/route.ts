import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { restoreDeletedPost } from '@/lib/posts-db';
import { BlogPost } from '@/types/blog';

export const dynamic = 'force-dynamic';

const ARCHIVE_FILE = path.join(process.cwd(), 'data', 'deleted_posts.json');

export async function GET() {
  try {
    const data = await fs.readFile(ARCHIVE_FILE, 'utf-8');
    const posts: BlogPost[] = JSON.parse(data);
    return NextResponse.json({ success: true, count: posts.length, deletedPosts: posts });
  } catch {
    return NextResponse.json({ success: true, count: 0, deletedPosts: [] });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    if (!body?.id) {
      return NextResponse.json({ success: false, error: 'Post ID is required to restore' }, { status: 400 });
    }
    const restored = await restoreDeletedPost(body.id);
    if (!restored) {
      return NextResponse.json({ success: false, error: 'Post not found in archive or restore failed' }, { status: 404 });
    }
    return NextResponse.json({ success: true, restoredPost: restored });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Restore failed' }, { status: 500 });
  }
}
