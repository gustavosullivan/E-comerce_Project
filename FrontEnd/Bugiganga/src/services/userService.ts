import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, throwServiceError } from '@/src/services/api/client';
import type { UpdateProfileRequest, UserProfile } from '@/src/types/user';

export const userService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<UserProfile>(API_ENDPOINTS.users.profile);
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const response = await apiClient.put<UserProfile>(API_ENDPOINTS.users.profile, data);
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },
};
