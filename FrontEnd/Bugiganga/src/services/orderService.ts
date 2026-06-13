import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { useOrderHistoryStore } from '@/src/store/orderHistoryStore';
import type { CartItem } from '@/src/types/cart';
import type { UserAddress } from '@/src/types/address';
import type { Order } from '@/src/types/order';

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
  total: number;
}

export interface CreateOrderContext {
  items: CartItem[];
  userId: number;
  buyerName: string;
  buyerEmail: string;
  deliveryAddress?: UserAddress | null;
}

export const orderService = {
  async createOrder(
    data: CreateOrderRequest,
    context?: CreateOrderContext,
  ): Promise<Order> {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 800));

        const order: Order = {
          id: Date.now(),
          userId: context?.userId ?? 0,
          buyerName: context?.buyerName ?? 'Cliente',
          buyerEmail: context?.buyerEmail ?? '—',
          deliveryAddress: context?.deliveryAddress ?? undefined,
          status: 'PAID',
          items: context?.items ?? [],
          total: data.total,
          createdAt: new Date().toISOString(),
          message: 'Compra realizada com sucesso.',
        };

        useOrderHistoryStore.getState().addOrder(order);
        return order;
      }

      const response = await apiClient.post<Order>(API_ENDPOINTS.orders, data);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async listOrders(userId: number): Promise<Order[]> {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 300));
        return useOrderHistoryStore.getState().getOrdersByUserId(userId);
      }

      const response = await apiClient.get<Order[]>(API_ENDPOINTS.orders);
      return response.data.filter((o) => o.userId === userId);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async getOrderById(id: number): Promise<Order | null> {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 200));
        return useOrderHistoryStore.getState().getOrderById(id) ?? null;
      }

      const response = await apiClient.get<Order>(`${API_ENDPOINTS.orders}/${id}`);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  fromCartItems(items: CartItem[]): CreateOrderRequest {
    return {
      items: items.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      total: items.reduce((s, i) => s + i.product.price * i.quantity, 0),
    };
  },
};
