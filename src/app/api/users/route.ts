import { NextRequest, NextResponse } from 'next/server';
import { getAllUsers, saveUser } from '@/lib/users-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const rawUsers = await getAllUsers();
    // Sanitize: never return plaintext passwords to client
    const users = rawUsers.map((u) => ({
      id: u.id,
      name: u.name,
      username: u.username,
      email: u.email,
      role: u.role,
      designation: u.designation,
      active: u.active,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin,
      hasPassword: Boolean(u.password),
    }));

    return NextResponse.json({ success: true, users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch editorial team' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, username, email, password, role, designation } = body;

    // Validation
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ success: false, error: 'Full name is required (min 2 chars).' }, { status: 400 });
    }

    if (!username || username.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'Username is required (min 3 chars, alphanumeric/underscore).' }, { status: 400 });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json({ success: false, error: 'Valid email address is required.' }, { status: 400 });
    }

    if (!password || password.trim().length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters long.' }, { status: 400 });
    }

    const validRoles = ['admin', 'editor', 'author'];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ success: false, error: 'Invalid user role specified.' }, { status: 400 });
    }

    const result = await saveUser({
      name,
      username,
      email,
      password,
      role,
      designation,
    });

    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const created = result.user!;
    return NextResponse.json({
      success: true,
      user: {
        id: created.id,
        name: created.name,
        username: created.username,
        email: created.email,
        role: created.role,
        designation: created.designation,
        active: created.active,
        createdAt: created.createdAt,
      },
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ success: false, error: 'Failed to create team member' }, { status: 500 });
  }
}
