import { NextRequest, NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, ROLE_PERMISSIONS } from '@/lib/auth';
import { getUserByUsername } from '@/lib/users-db';
import { UserRole } from '@/types/user';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const cookie = request.cookies.get(AUTH_COOKIE_NAME);

  if (!cookie || !cookie.value) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    const payload = JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf-8'));
    const username = payload.username || payload.user;

    if (!username) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    // Verify user exists and is active in DB
    const dbUser = await getUserByUsername(username);

    if (dbUser && dbUser.active) {
      const role = dbUser.role as UserRole;
      return NextResponse.json({
        authenticated: true,
        user: {
          id: dbUser.id,
          name: dbUser.name,
          username: dbUser.username,
          email: dbUser.email,
          role: dbUser.role,
          designation: dbUser.designation,
        },
        allowedModules: ROLE_PERMISSIONS[role] || ROLE_PERMISSIONS.author,
      });
    }

    // Fallback for legacy admin payload
    if (username === 'admin') {
      return NextResponse.json({
        authenticated: true,
        user: {
          id: 'usr-superadmin-01',
          name: 'Sahil',
          username: 'admin',
          email: 'admin@genztime.com',
          role: 'admin',
          designation: 'Founder & Lead Hardware Editor',
        },
        allowedModules: ROLE_PERMISSIONS.admin,
      });
    }
  } catch (e) {
    // invalid token format
  }

  return NextResponse.json({ authenticated: false }, { status: 401 });
}
