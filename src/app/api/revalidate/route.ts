import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    revalidatePath('/', 'layout');
    revalidatePath('/');
    revalidatePath('/blog');
    
    return NextResponse.json({
      success: true,
      message: 'Global Next.js cache purged and SSR revalidated successfully',
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Revalidation failed' },
      { status: 500 }
    );
  }
}
