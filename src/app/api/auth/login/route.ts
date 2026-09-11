import { NextRequest, NextResponse } from 'next/server';
import { verifyAdminCredentials, AUTH_COOKIE_NAME, ADMIN_CREDENTIALS } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const isValid = verifyAdminCredentials(username, password);
    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid admin username or password' },
        { status: 401 }
      );
    }

    const token = Buffer.from(
      JSON.stringify({
        user: ADMIN_CREDENTIALS.username,
        name: ADMIN_CREDENTIALS.displayName,
        time: Date.now(),
      })
    ).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: {
        name: ADMIN_CREDENTIALS.displayName,
        role: ADMIN_CREDENTIALS.role,
      },
    });

    response.cookies.set({
      name: AUTH_COOKIE_NAME,
      value: token,
      httpOnly: false, // accessible to client for fast state sync
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Authentication error' }, { status: 500 });
  }
}
