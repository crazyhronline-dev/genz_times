import { NextRequest, NextResponse } from 'next/server';
import { getAllPosts, savePost } from '@/lib/posts-db';

export async function GET() {
  try {
    const posts = await getAllPosts();
    return NextResponse.json({ success: true, posts });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch posts' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, error: 'Title and content are required fields' },
        { status: 400 }
      );
    }

    const saved = await savePost(body);
    return NextResponse.json({ success: true, post: saved }, { status: 201 });
  } catch (error) {
    console.error('Error saving post:', error);
    return NextResponse.json({ success: false, error: 'Failed to save post' }, { status: 500 });
  }
}
