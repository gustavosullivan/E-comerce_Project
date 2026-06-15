import type { CartItem } from '@/src/types/cart';
import type { UserAddress } from '@/src/types/address';
import type { Order } from '@/src/types/order';
import type { Product } from '@/src/types/product';

import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { getCatalogProducts, useProductCatalogStore } from '@/src/store/productCatalogStore';
import { useOrderHistoryStore } from '@/src/store/orderHistoryStore';
import type { User } from '@/src/types/auth';

const MOCKED_ORDER_SERVICE_LATENCY = 500;

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

export interface AdminSalesSummary {
  totalSalesValue: number;
  soldProducts: {
    product: Product;
    quantity: number;
    totalPrice: number;
  }[];
}

export const orderService = {
  async createOrder(
    data: CreateOrderRequest,
    context?: CreateOrderContext,
  ): Promise<Order> {
    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 800));

        const cartItems = context?.items ?? [];
        const stockAdjustments = cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
        }));

        useProductCatalogStore.getState().decreaseStockForItems(stockAdjustments);

        const order: Order = {
          id: Date.now(),
          userId: context?.userId ?? 0,
          buyerName: context?.buyerName ?? 'Cliente',
          buyerEmail: context?.buyerEmail ?? '—',
          deliveryAddress: context?.deliveryAddress ?? undefined,
          status: 'PAID',
          items: cartItems,
          total: data.total,
          createdAt: new Date().toISOString(),
          message: 'Compra realizada com sucesso.',
        };

        try {
          useOrderHistoryStore.getState().addOrder(order);
        } catch (error) {
          useProductCatalogStore.getState().restoreStockForItems(stockAdjustments);
          throw error;
        }

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
        await new Promise((resolve) => setTimeout(resolve, 300));
        return useOrderHistoryStore.getState().getOrdersByUserId(userId);
      }

      const response = await apiClient.get<Order[]>(API_ENDPOINTS.orders);
      return response.data.filter((order) => order.userId === userId);
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async getOrderById(id: number): Promise<Order | null> {
    try {
      if (USE_MOCK) {
        await new Promise((resolve) => setTimeout(resolve, 200));
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
      items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    };
  },

  async getAdminSalesSummary(adminId: User['id']): Promise<AdminSalesSummary> {
    return new Promise((resolve) => {
      setTimeout(() => {
        let totalSalesValue = 0;
        const soldProductsMap = new Map<
          number,
          { product: Product; quantity: number; totalPrice: number }
        >();

        const catalog = getCatalogProducts();
        const orders = useOrderHistoryStore.getState().orders;

        orders.forEach((order) => {
          order.items.forEach((cartItem) => {
            const product = catalog.find((item) => item.id === cartItem.product.id);
            if (!product || product.userId !== adminId) return;

            const lineTotal = cartItem.product.price * cartItem.quantity;
            const current = soldProductsMap.get(product.id);

            soldProductsMap.set(product.id, {
              product,
              quantity: (current?.quantity ?? 0) + cartItem.quantity,
              totalPrice: (current?.totalPrice ?? 0) + lineTotal,
            });
            totalSalesValue += lineTotal;
          });
        });

        resolve({
          totalSalesValue,
          soldProducts: Array.from(soldProductsMap.values()),
        });
      }, MOCKED_ORDER_SERVICE_LATENCY);
    });
  },
};
