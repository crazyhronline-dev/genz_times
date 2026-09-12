import { NextRequest, NextResponse } from 'next/server';
import { getUserById, updateUser, deleteUser } from '@/lib/users-db';

export const dynamic = 'force-dynamic';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const user = await getUserById(params.id);
    if (!user) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        username: user.username,
        email: user.email,
        role: user.role,
        designation: user.designation,
        active: user.active,
        createdAt: user.createdAt,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to retrieve user' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const updates = await request.json();

    // If password provided, validate length
    if (updates.password !== undefined && updates.password.trim().length > 0 && updates.password.trim().length < 6) {
      return NextResponse.json({ success: false, error: 'New password must be at least 6 characters.' }, { status: 400 });
    }

    // Clean empty password so we don't overwrite with blank
    if (updates.password !== undefined && updates.password.trim() === '') {
      delete updates.password;
    }

    const updated = await updateUser(params.id, updates);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      user: {
        id: updated.id,
        name: updated.name,
        username: updated.username,
        email: updated.email,
        role: updated.role,
        designation: updated.designation,
        active: updated.active,
        createdAt: updated.createdAt,
        lastLogin: updated.lastLogin,
      },
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const result = await deleteUser(params.id);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Failed to delete user' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'User removed from editorial team' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete user' }, { status: 500 });
  }
}
