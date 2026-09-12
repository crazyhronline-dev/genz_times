import { NextRequest, NextResponse } from 'next/server';
import { saveEnquiry } from '@/lib/enquiries-db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, inquiryType, deviceOrCompany, message } = body;

    // Validation
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid full name.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid email address.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Please enter a message of at least 10 characters.' },
        { status: 400 }
      );
    }

    // Extract client IP if available
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor ? forwardedFor.split(',')[0].trim() : 'Unknown';

    const saved = await saveEnquiry({
      name,
      email,
      inquiryType: inquiryType || 'general',
      deviceOrCompany: deviceOrCompany || '',
      message,
      ip,
    });

    return NextResponse.json({
      success: true,
      message: 'Inquiry received successfully. Our team will review your message shortly.',
      enquiryId: saved.id,
    });
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process inquiry. Please try again later.' },
      { status: 500 }
    );
  }
}
