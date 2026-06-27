import { isAxiosError } from 'axios';

import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, throwServiceError } from '@/src/services/api/client';
import type { UpdateProfileRequest, UserProfile } from '@/src/types/user';
import { useAuthStore } from '@/src/store/authStore';
export const userService = {
  async getProfile(): Promise<UserProfile> {
    const user = useAuthStore.getState().user;
    if (user) {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.email.split('@')[0],
        avatarUrl: useAuthStore.getState().avatarUri || undefined,
      };
    }
    return {
      id: 0,
      name: 'Usuário Teste',
      email: 'teste@example.com',
      username: 'usuarioteste',
    };
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    const current = await this.getProfile();
    return {
      ...current,
      ...data,
    };
  },
};
