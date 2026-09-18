import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getAllPosts, savePost } from '@/lib/posts-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json(
      { success: true, count: posts.length, posts },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch posts: ' + (error?.message || 'Unknown error') },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch (parseErr: any) {
      return NextResponse.json(
        { success: false, error: 'Malformed JSON payload: ' + (parseErr?.message || 'Invalid JSON format') },
        { status: 400 }
      );
    }

    if (!body || !body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Title and body content are required fields' },
        { status: 400 }
      );
    }

    const saved = await savePost(body);

    // Revalidate paths safely
    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath(`/blog/${saved.slug}`);
      if (saved.categorySlug) {
        revalidatePath(`/category/${saved.categorySlug}`);
      }
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json({ success: true, post: saved }, { status: 201 });
  } catch (error: any) {
    console.error('Error saving post:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error?.message || 'Failed to save post',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
