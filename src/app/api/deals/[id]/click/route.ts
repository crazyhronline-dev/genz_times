import { NextResponse } from 'next/server';
import { recordDealInteraction } from '@/lib/deals-db';

export const dynamic = 'force-dynamic';

interface Params {
  params: {
    id: string;
  };
}

export async function POST(request: Request, { params }: Params) {
  try {
    const body = await request.json().catch(() => ({}));
    const type = body.type === 'copy' ? 'copy' : 'click';
    await recordDealInteraction(params.id, type);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
