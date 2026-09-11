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
  const post = await getPostById(params.id);
  if (!post) {
    return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
  }
  return NextResponse.json(
    { success: true, post },
    { headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' } }
  );
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
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
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const post = await getPostById(params.id);
    const success = await deletePost(params.id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
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

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}
