import { isAxiosError } from 'axios';

import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { useAddressStore } from '@/src/store/addressStore';
import type { UserAddress } from '@/src/types/address';

export const addressService = {
  async getAddress(userId: number): Promise<UserAddress | null> {
    try {
      const response = await apiClient.get<UserAddress>(API_ENDPOINTS.users.address);
      useAddressStore.getState().setAddress(userId, response.data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 404) {
        return null;
      }
      throw mapAxiosError(error);
    }
  },

  async saveAddress(userId: number, address: UserAddress): Promise<UserAddress> {
    try {
      const response = await apiClient.put<UserAddress>(API_ENDPOINTS.users.address, address);
      useAddressStore.getState().setAddress(userId, response.data);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
