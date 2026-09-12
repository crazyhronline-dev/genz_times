export type UserRole = 'admin' | 'editor' | 'author';

export interface EditorialUser {
  id: string;
  name: string;
  username: string;
  email: string;
  password: string; // Stored securely
  role: UserRole;
  designation: string; // e.g. "Editor-in-Chief", "Senior Hardware Reviewer", "Mobile Tech Writer"
  avatar?: string;
  active: boolean;
  createdAt: string; // ISO 8601
  lastLogin?: string;
}

export interface UserSession {
  id: string;
  name: string;
  username: string;
  email: string;
  role: UserRole;
  designation: string;
}
