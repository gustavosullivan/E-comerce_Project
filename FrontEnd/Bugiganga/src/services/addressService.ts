import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { userService } from '@/src/services/userService';
import { useAddressStore } from '@/src/store/addressStore';
import type { UserAddress } from '@/src/types/address';

export const addressService = {
  async getAddress(userId: number): Promise<UserAddress | null> {
    try {
      await userService.getProfile();
      return useAddressStore.getState().getAddress(userId);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async saveAddress(userId: number, address: UserAddress): Promise<UserAddress> {
    try {
      return await userService.updateAddress(userId, address);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
