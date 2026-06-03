import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import type { Cart } from '@/src/types/cart';

const EMPTY_CART: Cart = { id: 1, items: [], total: 0 };

export const cartService = {
  async getCart(): Promise<Cart> {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 500));
        return EMPTY_CART;
      }
      const response = await apiClient.get<Cart>(API_ENDPOINTS.cart);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
