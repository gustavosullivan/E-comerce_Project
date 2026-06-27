import {
  DEV_BUYER_CREDENTIALS,
  DEV_SELLER_CREDENTIALS,
  LEGACY_BUYER_CREDENTIALS,
  LEGACY_SELLER_CREDENTIALS,
} from '@/src/config/devCredentials';
import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/src/types/auth';

import { mockDelay } from './delay';

const MOCK_BUYER: User = {
  id: 1,
  name: 'Maria Compradora',
  email: DEV_BUYER_CREDENTIALS.email,
  username: DEV_BUYER_CREDENTIALS.login,
  buyerProfile: true,
  sellerProfile: true,
  role: 'BUYER',
};

const MOCK_ADMIN: User = {
  id: 2,
  name: 'João Vendedor',
  email: DEV_SELLER_CREDENTIALS.email,
  username: DEV_SELLER_CREDENTIALS.login,
  buyerProfile: true,
  sellerProfile: true,
  role: 'ADMIN',
};

type Account = {
  email: string;
  login: string;
  password: string;
};

function matchesAccount(identifier: string, account: Account, password: string): boolean {
  return (
    (identifier === account.email || identifier === account.login) &&
    password === account.password
  );
}

function resolveLogin(data: LoginRequest): AuthResponse | null {
  const identifier = data.email.trim().toLowerCase();

  const sellerAccounts: Account[] = [DEV_SELLER_CREDENTIALS, LEGACY_SELLER_CREDENTIALS];
  const buyerAccounts: Account[] = [DEV_BUYER_CREDENTIALS, LEGACY_BUYER_CREDENTIALS];

  if (sellerAccounts.some((account) => matchesAccount(identifier, account, data.password))) {
    return {
      token: 'mock-jwt-token-bugigangas-seller',
      user: MOCK_ADMIN,
    };
  }

  if (buyerAccounts.some((account) => matchesAccount(identifier, account, data.password))) {
    return {
      token: 'mock-jwt-token-bugigangas-buyer',
      user: MOCK_BUYER,
    };
  }

  return null;
}

export const authMock = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    await mockDelay();

    const response = resolveLogin(data);
    if (response) return response;

    throw new Error(
      `Login ou senha incorretos. Comprador: ${DEV_BUYER_CREDENTIALS.email} / ${DEV_BUYER_CREDENTIALS.password} · Vendedor: ${DEV_SELLER_CREDENTIALS.email} / ${DEV_SELLER_CREDENTIALS.password}`,
    );
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await mockDelay();

    if (data.email.toLowerCase() === 'erro@test.com') {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const user: User = {
      id: Date.now(),
      name: data.name,
      email: data.email,
      username: data.username,
      buyerProfile: true,
      sellerProfile: true,
      role: 'BUYER',
    };

    return {
      token: 'mock-jwt-token-bugigangas-buyer',
      user,
    };
  },

  async getMe(): Promise<User> {
    await mockDelay(400);
    return MOCK_BUYER;
  },

  async forgotPassword(_data: ForgotPasswordRequest): Promise<void> {
    await mockDelay();
  },

  async changePassword(email: string, data: ChangePasswordRequest): Promise<void> {
    await mockDelay();

    const identifier = email.trim().toLowerCase();
    const sellerAccounts: Account[] = [DEV_SELLER_CREDENTIALS, LEGACY_SELLER_CREDENTIALS];
    const buyerAccounts: Account[] = [DEV_BUYER_CREDENTIALS, LEGACY_BUYER_CREDENTIALS];

    const account =
      sellerAccounts.find((item) => identifier === item.email || identifier === item.login) ??
      buyerAccounts.find((item) => identifier === item.email || identifier === item.login);

    if (!account || data.currentPassword !== account.password) {
      throw new Error('Senha atual incorreta.');
    }
    if (data.newPassword.length < 8) {
      throw new Error('A nova senha deve ter pelo menos 8 caracteres.');
    }
  },
};
