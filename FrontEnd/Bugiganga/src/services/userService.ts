import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { authMock } from '@/src/services/mocks/authMock';
import type { UpdateProfileRequest, UserProfile } from '@/src/types/user';

export const userService = {
  async getProfile(): Promise<UserProfile> {
    try {
      if (USE_MOCK) {
        const user = await authMock.getMe();
        return { ...user };
      }
      const response = await apiClient.get<UserProfile>(API_ENDPOINTS.users.profile);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      if (USE_MOCK) {
        const user = await authMock.getMe();
        return { ...user, ...data };
      }
      const response = await apiClient.put<UserProfile>(API_ENDPOINTS.users.profile, data);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
