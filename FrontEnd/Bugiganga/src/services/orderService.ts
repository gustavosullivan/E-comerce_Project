import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import type { CartItem } from '@/src/types/cart';

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
  total: number;
}

export interface OrderResponse {
  id: number;
  message: string;
}

export const orderService = {
  async createOrder(data: CreateOrderRequest): Promise<OrderResponse> {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 800));
        return { id: Date.now(), message: 'Compra realizada com sucesso.' };
      }
      const response = await apiClient.post<OrderResponse>(API_ENDPOINTS.orders, data);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  /** Helper para montar payload a partir do carrinho/checkout */
  fromCartItems(items: CartItem[]): CreateOrderRequest {
    return {
      items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      total: items.reduce((s, i) => s + i.product.price * i.quantity, 0),
    };
  },
};
