import { NextRequest, NextResponse } from 'next/server';
import { getEnquiryById, updateEnquiry, deleteEnquiry } from '@/lib/enquiries-db';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const enquiry = await getEnquiryById(params.id);
    if (!enquiry) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, enquiry });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve enquiry' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const updates = await request.json();
    const updated = await updateEnquiry(params.id, updates);

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, enquiry: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const success = await deleteEnquiry(params.id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Enquiry not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: 'Enquiry removed' });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to delete enquiry' },
      { status: 500 }
    );
  }
}
