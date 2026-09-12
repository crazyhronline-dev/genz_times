import { NextResponse } from 'next/server';
import { getAllDeals, saveDeal } from '@/lib/deals-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const deals = await getAllDeals();
    return NextResponse.json({ success: true, deals });
  } catch (error) {
    console.error('Error fetching deals:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch deals' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.title || !body.store || !body.discountText) {
      return NextResponse.json(
        { success: false, error: 'Title, Store, and Discount Text are required' },
        { status: 400 }
      );
    }

    const saved = await saveDeal(body);
    return NextResponse.json({ success: true, deal: saved }, { status: 201 });
  } catch (error) {
    console.error('Error creating deal:', error);
    return NextResponse.json({ success: false, error: 'Failed to save deal' }, { status: 500 });
  }
}
