import { NextResponse } from 'next/server';
import { incrementPostViews } from '@/lib/posts-db';

export const dynamic = 'force-dynamic';

interface RouteContext {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: RouteContext) {
  try {
    const updatedViews = await incrementPostViews(params.id);
    if (updatedViews === null) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, views: updatedViews });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update views' }, { status: 500 });
  }
}
