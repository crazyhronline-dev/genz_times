import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, ADMIN_CREDENTIALS } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (!cookie || !cookie.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const payload = JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf-8'));
    if (payload.user === ADMIN_CREDENTIALS.username) {
      return NextResponse.json({
        authenticated: true,
        user: {
          name: ADMIN_CREDENTIALS.displayName,
          role: ADMIN_CREDENTIALS.role,
        },
      });
    }
  } catch (e) {
    // invalid token
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
