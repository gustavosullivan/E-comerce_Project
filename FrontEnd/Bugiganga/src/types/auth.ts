export type UserRole = 'BUYER' | 'ADMIN';

export interface User {
  id: number;
  name: string;
  email: string;
  username: string;
  buyerProfile: boolean;
  sellerProfile: boolean;
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
  type?: 'Admin' | 'Common';
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

export function isAdmin(user: User | null | undefined): boolean {
  return user?.role === 'ADMIN';
}

export function hasBuyerProfile(user: User | null | undefined): boolean {
  return user?.buyerProfile !== false;
}

export function hasSellerProfile(user: User | null | undefined): boolean {
  return user?.sellerProfile !== false;
}

export function getRoleLabel(role: UserRole | undefined): string {
  if (role === 'ADMIN') return 'Vendedor';
  if (role === 'BUYER') return 'Comprador';
  return '—';
}
