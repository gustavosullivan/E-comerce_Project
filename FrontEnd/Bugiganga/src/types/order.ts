import type { CartItem } from '@/src/types/cart';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: number;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  createdAt: string;
}
