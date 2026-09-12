import { UserRole } from '@/types/user';

export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'genztime2026',
  displayName: 'GenZ Editorial Team',
  role: 'Editor-in-Chief & Super Admin',
};

export const AUTH_COOKIE_NAME = 'genz_time_admin_session';
export const AUTH_STORAGE_KEY = 'genz_time_admin_auth';

// Role-Based Module Access Permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  admin: ['overview', 'articles', 'publish', 'categories', 'deals', 'reviews', 'enquiries', 'team', 'system'],
  editor: ['overview', 'articles', 'publish', 'deals', 'reviews', 'enquiries'],
  author: ['overview', 'articles', 'publish', 'deals'],
};

export const ROLE_CONFIG: Record<UserRole, { label: string; badgeColor: string; description: string }> = {
  admin: {
    label: 'Super Admin',
    badgeColor: 'bg-rose-500/20 text-rose-400 border border-rose-500/40',
    description: 'Full unrestricted control across all 9 modules including Team, System & Categories.',
  },
  editor: {
    label: 'Senior Editor',
    badgeColor: 'bg-tech-cyan/20 text-tech-cyan border border-tech-cyan/40',
    description: 'Can manage Articles, Reviews, Deals, Lab Scores, and respond to Contact Enquiries.',
  },
  author: {
    label: 'Staff Writer',
    badgeColor: 'bg-amber-400/20 text-amber-300 border border-amber-400/40',
    description: 'Access to Publish Studio, Articles, and Deals to draft content.',
  },
};

export function hasModuleAccess(role: UserRole | string | undefined, module: string): boolean {
  if (!role) return false;
  const userRole = (role as UserRole) || 'author';
  const allowed = ROLE_PERMISSIONS[userRole] || ROLE_PERMISSIONS.author;
  return allowed.includes(module);
}

export function verifyAdminCredentials(user: string, pass: string): boolean {
  const u = user.trim().toLowerCase();
  const validUser = u === ADMIN_CREDENTIALS.username || u === 'genz';
  const validPass = pass.trim() === ADMIN_CREDENTIALS.password;
  return validUser && validPass;
}
