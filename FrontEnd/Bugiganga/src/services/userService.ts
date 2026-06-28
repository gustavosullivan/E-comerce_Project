import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import {
  buildAddressPayload,
  mapApiAddress,
  syncUserProfileStores,
  type ApiUserProfile,
} from '@/src/services/userProfileSync';
import type { UpdateProfileRequest, UserProfile } from '@/src/types/user';
import type { UserAddress } from '@/src/types/address';

interface ApiProfileUser extends ApiUserProfile {
  name: string;
  email: string;
}

function mapApiProfile(user: ApiProfileUser): UserProfile {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.email.split('@')[0] ?? 'user',
    avatarUrl: user.avatarUrl ?? undefined,
  };
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get<ApiProfileUser>(API_ENDPOINTS.auth.me);
      syncUserProfileStores(response.data);
      return mapApiProfile(response.data);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfile> {
    try {
      const response = await apiClient.put<ApiProfileUser>(API_ENDPOINTS.auth.me, {
        ...(data.name !== undefined ? { name: data.name } : {}),
        ...(data.avatarUrl !== undefined ? { avatarUrl: data.avatarUrl } : {}),
      });

      syncUserProfileStores(response.data);
      return mapApiProfile(response.data);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async updateAddress(userId: number, address: UserAddress): Promise<UserAddress> {
    try {
      const response = await apiClient.put<ApiProfileUser>(API_ENDPOINTS.auth.me, buildAddressPayload(address));
      syncUserProfileStores(response.data);
      return mapApiAddress(response.data);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
