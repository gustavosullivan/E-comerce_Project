import type {
  AuthResponse,
  ChangePasswordRequest,
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

/** Senhas mockadas por e-mail (apenas desenvolvimento) */
const mockPasswords = new Map<string, string>([[MOCK_USER.email, MOCK_PASSWORD]]);

function getPassword(email: string): string | undefined {
  return mockPasswords.get(email.trim().toLowerCase());
}

export const authMock = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    await mockDelay();

    const email = data.email.trim().toLowerCase();
    const validEmail = email === MOCK_USER.email || email === 'demo@bugigangas.com';
    const storedPassword = getPassword(email) ?? MOCK_PASSWORD;

    if (!validEmail || data.password !== storedPassword) {
      throw new Error(
        'E-mail ou senha incorretos. Use demo@bugigangas.com / 12345678 para testar.',
      );
    }

    return {
      token: 'mock-jwt-token-bugigangas',
      user: { ...MOCK_USER, email },
    };
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    await mockDelay();

    if (data.email.toLowerCase() === 'erro@test.com') {
      throw new Error('Este e-mail já está cadastrado.');
    }

    const email = data.email.trim().toLowerCase();
    mockPasswords.set(email, data.password);

    const user: User = {
      id: Date.now(),
      name: data.name,
      email,
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

  async changePassword(email: string, data: ChangePasswordRequest): Promise<void> {
    await mockDelay();

    const key = email.trim().toLowerCase();
    const current = getPassword(key) ?? MOCK_PASSWORD;

    if (data.currentPassword !== current) {
      throw new Error('Senha atual incorreta.');
    }

    mockPasswords.set(key, data.newPassword);
  },
};
