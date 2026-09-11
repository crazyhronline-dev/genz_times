export const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'genztime2026',
  displayName: 'GenZ Editorial Team',
  role: 'Editor-in-Chief & Super Admin',
};

export const AUTH_COOKIE_NAME = 'genz_time_admin_session';
export const AUTH_STORAGE_KEY = 'genz_time_admin_auth';

export function verifyAdminCredentials(user: string, pass: string): boolean {
  const u = user.trim().toLowerCase();
  const validUser = u === ADMIN_CREDENTIALS.username || u === 'genz';
  const validPass = pass.trim() === ADMIN_CREDENTIALS.password;
  return validUser && validPass;
}
