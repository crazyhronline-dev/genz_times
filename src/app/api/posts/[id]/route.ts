import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { getPostById, deletePost, savePost } from '@/lib/posts-db';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: Params) {
  try {
    const post = await getPostById(params.id);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: true, post },
      { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0' } }
    );
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error?.message || 'Error fetching post' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    let body: any;
    try {
      body = await request.json();
    } catch (parseErr: any) {
      return NextResponse.json(
        { success: false, error: 'Malformed JSON payload: ' + (parseErr?.message || 'Invalid format') },
        { status: 400 }
      );
    }

    const updated = await savePost({ ...body, id: params.id });

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/blog');
      revalidatePath(`/blog/${updated.slug}`);
      if (updated.categorySlug) {
        revalidatePath(`/category/${updated.categorySlug}`);
      }
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json({ success: true, post: updated });
  } catch (error: any) {
    console.error('Error updating post:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const post = await getPostById(params.id);
    if (!post) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    const success = await deletePost(params.id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Cannot delete post: post protected or database locked' }, { status: 400 });
    }

    try {
      revalidatePath('/', 'layout');
      revalidatePath('/');
      revalidatePath('/blog');
      if (post?.slug) {
        revalidatePath(`/blog/${post.slug}`);
      }
      if (post?.categorySlug) {
        revalidatePath(`/category/${post.categorySlug}`);
      }
    } catch (e) {
      console.warn('Revalidation notice:', e);
    }

    return NextResponse.json({ success: true, message: 'Post archived safely into deleted_posts.json' });
  } catch (error: any) {
    console.error('Error deleting post:', error);
    return NextResponse.json({ success: false, error: error?.message || 'Failed to delete post' }, { status: 500 });
  }
}
