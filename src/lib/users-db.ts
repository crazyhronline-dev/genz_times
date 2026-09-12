import fs from 'fs/promises';
import path from 'path';
import { EditorialUser, UserRole } from '@/types/user';

const USERS_FILE = path.join(process.cwd(), 'data', 'users.json');

export const DEFAULT_USERS: EditorialUser[] = [
  {
    id: 'usr-superadmin-01',
    name: 'GenZ Editorial Team',
    username: 'admin',
    email: 'admin@genztime.com',
    password: 'genztime2026',
    role: 'admin',
    designation: 'Editor-in-Chief & Super Admin',
    active: true,
    createdAt: '2026-09-01T00:00:00.000Z',
  },
  {
    id: 'usr-editor-02',
    name: 'Alex Rivera',
    username: 'alex_reviewer',
    email: 'alex@genztime.com',
    password: 'reviewer2026',
    role: 'editor',
    designation: 'Senior Hardware Reviewer',
    active: true,
    createdAt: '2026-09-05T10:00:00.000Z',
  },
  {
    id: 'usr-author-03',
    name: 'Maya Patel',
    username: 'maya_writer',
    email: 'maya@genztime.com',
    password: 'writer2026',
    role: 'author',
    designation: 'Staff Tech Writer & Contributor',
    active: true,
    createdAt: '2026-09-08T14:00:00.000Z',
  },
];

export async function getAllUsers(): Promise<EditorialUser[]> {
  try {
    const data = await fs.readFile(USERS_FILE, 'utf-8');
    const users: EditorialUser[] = JSON.parse(data);
    return Array.isArray(users) && users.length > 0 ? users : DEFAULT_USERS;
  } catch (error) {
    return DEFAULT_USERS;
  }
}

export async function getUserById(id: string): Promise<EditorialUser | null> {
  const users = await getAllUsers();
  return users.find((u) => u.id === id) || null;
}

export async function getUserByUsername(username: string): Promise<EditorialUser | null> {
  const users = await getAllUsers();
  const normalized = username.trim().toLowerCase();
  return users.find((u) => u.username.toLowerCase() === normalized) || null;
}

export async function verifyUserCredentials(username: string, pass: string): Promise<EditorialUser | null> {
  const user = await getUserByUsername(username);
  if (!user) return null;
  if (!user.active) return null;
  if (user.password !== pass.trim()) return null;
  
  // Update lastLogin asynchronously
  updateUser(user.id, { lastLogin: new Date().toISOString() }).catch(() => {});
  
  return user;
}

export async function saveUser(
  input: {
    name: string;
    username: string;
    email: string;
    password: string;
    role: UserRole;
    designation?: string;
  }
): Promise<{ success: boolean; user?: EditorialUser; error?: string }> {
  const users = await getAllUsers();
  const cleanUsername = input.username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
  const cleanEmail = input.email.trim().toLowerCase();

  // Validate username uniqueness
  if (users.some((u) => u.username.toLowerCase() === cleanUsername)) {
    return { success: false, error: 'Username already taken. Please choose another.' };
  }

  // Validate email uniqueness
  if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
    return { success: false, error: 'Email address already registered.' };
  }

  const defaultDesignations: Record<UserRole, string> = {
    admin: 'Editorial Super Admin',
    editor: 'Senior Hardware Reviewer',
    author: 'Staff Tech Writer',
  };

  const newUser: EditorialUser = {
    id: `usr-${Date.now()}`,
    name: input.name.trim(),
    username: cleanUsername,
    email: cleanEmail,
    password: input.password.trim(),
    role: input.role || 'author',
    designation: input.designation?.trim() || defaultDesignations[input.role || 'author'],
    active: true,
    createdAt: new Date().toISOString(),
  };

  users.push(newUser);

  await fs.mkdir(path.dirname(USERS_FILE), { recursive: true });
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');

  return { success: true, user: newUser };
}

export async function updateUser(
  id: string,
  updates: Partial<EditorialUser>
): Promise<EditorialUser | null> {
  const users = await getAllUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index === -1) return null;

  // Protect username of primary super admin
  if (users[index].username === 'admin' && updates.username && updates.username !== 'admin') {
    updates.username = 'admin';
  }

  users[index] = {
    ...users[index],
    ...updates,
    id: users[index].id, // Prevent ID overwrite
  };

  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
  return users[index];
}

export async function deleteUser(id: string): Promise<{ success: boolean; error?: string }> {
  const users = await getAllUsers();
  const target = users.find((u) => u.id === id);

  if (!target) {
    return { success: false, error: 'User not found.' };
  }

  if (target.username === 'admin') {
    return { success: false, error: 'Cannot delete the primary Editor-in-Chief / Super Admin account.' };
  }

  const filtered = users.filter((u) => u.id !== id);
  await fs.writeFile(USERS_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return { success: true };
}
