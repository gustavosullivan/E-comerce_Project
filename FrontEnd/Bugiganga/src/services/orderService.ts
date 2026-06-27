import { isAxiosError } from 'axios';

import type { CartItem } from '@/src/types/cart';
import type { UserAddress } from '@/src/types/address';
import type { Order } from '@/src/types/order';
import type { Product } from '@/src/types/product';

import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { productService } from '@/src/services/productService';
import type { User } from '@/src/types/auth';

export interface CreateOrderRequest {
  items: { productId: number; quantity: number }[];
  total: number;
  deliveryAddress?: UserAddress | null;
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
      const response = await apiClient.post<Order>(API_ENDPOINTS.orders, {
        ...data,
        deliveryAddress: context?.deliveryAddress ?? data.deliveryAddress,
      });
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async listOrders(userId: number): Promise<Order[]> {
    return [];
  },

  async getOrderById(id: number): Promise<Order | null> {
    return null;
  },

  fromCartItems(items: CartItem[]): CreateOrderRequest {
    return {
      items: items.map((item) => ({ productId: item.product.id, quantity: item.quantity })),
      total: items.reduce((sum, item) => sum + item.product.price * item.quantity, 0),
    };
  },

  async getAdminSalesSummary(adminId: User['id']): Promise<AdminSalesSummary> {
    try {
      const [ordersResponse, products] = await Promise.all([
        apiClient.get<Order[]>(API_ENDPOINTS.orders),
        productService.getAdminProducts(adminId),
      ]);

      let totalSalesValue = 0;
      const soldProductsMap = new Map<
        number,
        { product: Product; quantity: number; totalPrice: number }
      >();

      ordersResponse.data.forEach((order) => {
        order.items.forEach((cartItem) => {
          const product = products.find((item) => item.id === cartItem.product.id);
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

      return {
        totalSalesValue,
        soldProducts: Array.from(soldProductsMap.values()),
      };
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
