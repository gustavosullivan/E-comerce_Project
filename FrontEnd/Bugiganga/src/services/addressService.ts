import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { useAddressStore } from '@/src/store/addressStore';
import type { UserAddress } from '@/src/types/address';

export const addressService = {
  getAddress(userId: number): UserAddress | null {
    if (USE_MOCK) {
      return useAddressStore.getState().getAddress(userId);
    }
    return useAddressStore.getState().getAddress(userId);
  },

  async saveAddress(userId: number, address: UserAddress): Promise<UserAddress> {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 400));
        useAddressStore.getState().setAddress(userId, address);
        return useAddressStore.getState().getAddress(userId)!;
      }

      const response = await apiClient.put<UserAddress>(API_ENDPOINTS.users.address, address);
      useAddressStore.getState().setAddress(userId, response.data);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
