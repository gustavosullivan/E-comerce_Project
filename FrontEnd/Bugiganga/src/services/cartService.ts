import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import type { Cart } from '@/src/types/cart';

export const cartService = {
  async getCart(): Promise<Cart> {
    try {
      const response = await apiClient.get<Cart>(API_ENDPOINTS.cart);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
