import { DEV_MOCK_CREDENTIALS } from '@/src/config/devCredentials';
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
  email: DEV_MOCK_CREDENTIALS.email,
  username: DEV_MOCK_CREDENTIALS.login,
};

export const authMock = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    await mockDelay();

    const identifier = data.email.trim().toLowerCase();
    const validLogin =
      identifier === DEV_MOCK_CREDENTIALS.login ||
      identifier === DEV_MOCK_CREDENTIALS.email;

    if (!validLogin || data.password !== DEV_MOCK_CREDENTIALS.password) {
      throw new Error(
        `Login ou senha incorretos. Use ${DEV_MOCK_CREDENTIALS.login} / ${DEV_MOCK_CREDENTIALS.password} para testar.`,
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

  async changePassword(email: string, data: ChangePasswordRequest): Promise<void> {
    await mockDelay();
    if (data.currentPassword !== DEV_MOCK_CREDENTIALS.password) {
      throw new Error('Senha atual incorreta.');
    }
    if (data.newPassword.length < 8) {
      throw new Error('A nova senha deve ter pelo menos 8 caracteres.');
    }
    if (email.toLowerCase() !== MOCK_USER.email.toLowerCase()) {
      throw new Error('Usuário não encontrado.');
    }
  },
};
