import type {
  AuthResponse,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/src/types/auth';

import { mockDelay } from './delay';

const MOCK_USER: User = {
  id: 1,
  name: 'Maria Antiga',
  email: 'demo@bugigangas.com',
  username: 'maria_vintage',
};

const MOCK_PASSWORD = '12345678';

export const authMock = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    await mockDelay();

    const email = data.email.trim().toLowerCase();
    const validEmail = email === MOCK_USER.email || email === 'demo@bugigangas.com';

    if (!validEmail || data.password !== MOCK_PASSWORD) {
      throw new Error(
        'E-mail ou senha incorretos. Use demo@bugigangas.com / 12345678 para testar.',
      );
    }

    return {
      token: 'mock-jwt-token-bugigangas',
      user: MOCK_USER,
    };
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
    };

    return {
      token: 'mock-jwt-token-bugigangas',
      user,
    };
  },

  async getMe(): Promise<User> {
    await mockDelay(400);
    return MOCK_USER;
  },

  async forgotPassword(_data: ForgotPasswordRequest): Promise<void> {
    await mockDelay();
  },
};
