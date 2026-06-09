import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { authMock } from '@/src/services/mocks/authMock';
import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/src/types/auth';

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      if (USE_MOCK) return await authMock.login(data);
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.login, data);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      if (USE_MOCK) return await authMock.register(data);
      const response = await apiClient.post<AuthResponse>(API_ENDPOINTS.auth.register, data);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async getMe(): Promise<User> {
    try {
      if (USE_MOCK) return await authMock.getMe();
      const response = await apiClient.get<User>(API_ENDPOINTS.auth.me);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      if (USE_MOCK) return await authMock.forgotPassword(data);
      await apiClient.post(API_ENDPOINTS.auth.forgotPassword, data);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async changePassword(email: string, data: ChangePasswordRequest): Promise<void> {
    try {
      if (USE_MOCK) return await authMock.changePassword(email, data);
      await apiClient.post(API_ENDPOINTS.auth.changePassword, data);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
