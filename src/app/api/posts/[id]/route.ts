import { NextRequest, NextResponse } from 'next/server';
import { getPostById, deletePost, savePost } from '@/lib/posts-db';

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
  return NextResponse.json({ success: true, post });
}

export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const body = await request.json();
    const updated = await savePost({ ...body, id: params.id });
    return NextResponse.json({ success: true, post: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const success = await deletePost(params.id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 });
  }
}
