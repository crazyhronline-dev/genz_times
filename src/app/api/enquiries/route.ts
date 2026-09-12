import { NextRequest, NextResponse } from 'next/server';
import { getAllEnquiries, getUnreadCount, saveEnquiry } from '@/lib/enquiries-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const [enquiries, unreadCount] = await Promise.all([
      getAllEnquiries(),
      getUnreadCount(),
    ]);

    return NextResponse.json({
      success: true,
      enquiries,
      unreadCount,
    });
  } catch (error) {
    console.error('Error fetching enquiries:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const saved = await saveEnquiry(body);
    return NextResponse.json({
      success: true,
      enquiry: saved,
    });
  } catch (error) {
    console.error('Error creating enquiry:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create enquiry' },
      { status: 500 }
    );
  }
}
