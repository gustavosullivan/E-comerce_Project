export type UserRole = 'BUYER' | 'SELLER';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  role: UserRole;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export function isBuyer(user: User | null | undefined): boolean {
  return user?.role === 'BUYER';
}

export function isSeller(user: User | null | undefined): boolean {
  return user?.role === 'SELLER';
}

export function getRoleLabel(role: UserRole | undefined): string {
  if (role === 'SELLER') return 'Vendedor';
  if (role === 'BUYER') return 'Comprador';
  return '—';
}
