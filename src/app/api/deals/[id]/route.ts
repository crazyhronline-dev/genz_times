import { NextResponse } from 'next/server';
import { getDealById, saveDeal, deleteDeal } from '@/lib/deals-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface Params {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const deal = await getDealById(params.id);
    if (!deal) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, deal });
  } catch (error) {
    console.error('Error fetching deal:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch deal' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const updated = await saveDeal({ ...body, id: params.id });
    return NextResponse.json({ success: true, deal: updated });
  } catch (error) {
    console.error('Error updating deal:', error);
    return NextResponse.json({ success: false, error: 'Failed to update deal' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: Params) {
  try {
    const success = await deleteDeal(params.id);
    if (!success) {
      return NextResponse.json({ success: false, error: 'Deal not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Deal deleted successfully' });
  } catch (error) {
    console.error('Error deleting deal:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete deal' }, { status: 500 });
  }
}
