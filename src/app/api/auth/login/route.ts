import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, ADMIN_CREDENTIALS } from '@/lib/auth';
import { verifyUserCredentials, getUserByUsername } from '@/lib/users-db';
import { UserSession } from '@/types/user';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Username and password are required' },
        { status: 400 }
      );
    }

    // 1. Verify against dynamic users database
    let user = await verifyUserCredentials(username, password);

    // 2. Fallback to hardcoded admin check if DB is empty or during migration
    if (!user) {
      const u = username.trim().toLowerCase();
      if ((u === ADMIN_CREDENTIALS.username || u === 'genz') && password.trim() === ADMIN_CREDENTIALS.password) {
        user = {
          id: 'usr-superadmin-01',
          name: ADMIN_CREDENTIALS.displayName,
          username: ADMIN_CREDENTIALS.username,
          email: 'admin@genztime.com',
          password: ADMIN_CREDENTIALS.password,
          role: 'admin',
          designation: ADMIN_CREDENTIALS.role,
          active: true,
          createdAt: '2026-09-01T00:00:00.000Z',
        };
      }
    }

    if (!user) {
      // Check if user exists but inactive
      const existing = await getUserByUsername(username);
      if (existing && !existing.active) {
        return NextResponse.json(
          { success: false, error: 'This account has been deactivated. Please contact the Editor-in-Chief.' },
          { status: 403 }
        );
      }

      return NextResponse.json(
        { success: false, error: 'Invalid username or password' },
        { status: 401 }
      );
    }

    const sessionUser: UserSession = {
      id: user.id,
      name: user.name,
      username: user.username,
      email: user.email,
      role: user.role,
      designation: user.designation,
    };

    const token = Buffer.from(
      JSON.stringify({
        ...sessionUser,
        time: Date.now(),
      })
    ).toString('base64');

    const response = NextResponse.json({
      success: true,
      user: sessionUser,
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
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Authentication error' }, { status: 500 });
  }
}
