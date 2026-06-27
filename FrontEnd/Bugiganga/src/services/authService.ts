import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { useAuthStore } from '@/src/store/authStore';
import type {
  AuthResponse,
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  RegisterRequest,
  User,
} from '@/src/types/auth';

type ApiUserType = 'Admin' | 'Common' | number;

interface ApiUser {
  id: number;
  name: string;
  email: string;
  username?: string;
  type?: ApiUserType;
  buyerProfile?: boolean;
  sellerProfile?: boolean;
}

interface ApiAuthResponse {
  token: string;
  user: ApiUser;
}

function mapApiUser(user: ApiUser): User {
  const role = user.type === 'Admin' || user.type === 0 ? 'ADMIN' : 'BUYER';

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username ?? user.email,
    buyerProfile: user.buyerProfile ?? true,
    sellerProfile: user.sellerProfile ?? true,
    role,
  };
}

function mapApiAuthResponse(response: ApiAuthResponse): AuthResponse {
  return {
    token: response.token,
    user: mapApiUser(response.user),
  };
}

export const authService = {
  async login(data: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await apiClient.post<ApiAuthResponse>(API_ENDPOINTS.auth.login, data);
      return mapApiAuthResponse(response.data);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    try {
      await apiClient.post<ApiUser>(API_ENDPOINTS.auth.register, {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      return await authService.login({ email: data.email, password: data.password });
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async getMe(): Promise<User> {
    try {
      const response = await apiClient.get<ApiUser>(API_ENDPOINTS.auth.me);
      return mapApiUser(response.data);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async forgotPassword(data: ForgotPasswordRequest): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.forgotPassword, data);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async changePassword(email: string, data: ChangePasswordRequest): Promise<void> {
    try {
      await apiClient.post(API_ENDPOINTS.auth.changePassword, data);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
