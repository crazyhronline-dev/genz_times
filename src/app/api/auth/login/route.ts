import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, ADMIN_CREDENTIALS } from '@/lib/auth';
import { verifyUserCredentials, getUserByUsername } from '@/lib/users-db';
import { UserSession } from '@/types/user';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const pin = body.pin ? String(body.pin).trim() : null;
    const username = body.username ? String(body.username).trim() : '';
    const password = body.password ? String(body.password).trim() : '';

    // Check for Master Admin PIN 050505
    const isAdminPin = pin === '050505' || password === '050505' || ((username.toLowerCase() === 'admin' || !username) && (password === '050505' || pin === '050505'));

    let user: any = null;

    if (isAdminPin) {
      user = {
        id: 'usr-superadmin-01',
        name: ADMIN_CREDENTIALS.displayName,
        username: ADMIN_CREDENTIALS.username,
        email: 'admin@genztime.com',
        password: '050505',
        role: 'admin',
        designation: ADMIN_CREDENTIALS.role,
        active: true,
        createdAt: '2026-09-01T00:00:00.000Z',
      };
    } else if (username && password) {
      // 1. Verify against dynamic users database
      user = await verifyUserCredentials(username, password);

      // 2. Fallback to hardcoded admin check
      if (!user) {
        const u = username.toLowerCase();
        if ((u === ADMIN_CREDENTIALS.username || u === 'genz') && password === '050505') {
          user = {
            id: 'usr-superadmin-01',
            name: ADMIN_CREDENTIALS.displayName,
            username: ADMIN_CREDENTIALS.username,
            email: 'admin@genztime.com',
            password: '050505',
            role: 'admin',
            designation: ADMIN_CREDENTIALS.role,
            active: true,
            createdAt: '2026-09-01T00:00:00.000Z',
          };
        }
      }
    } else {
      return NextResponse.json(
        { success: false, error: 'Please enter your 6-digit Admin Security PIN (or staff credentials)' },
        { status: 400 }
      );
    }

    if (!user) {
      if (pin || (!username && password)) {
        return NextResponse.json(
          { success: false, error: 'Incorrect 6-digit Security PIN. Access denied.' },
          { status: 401 }
        );
      }

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
