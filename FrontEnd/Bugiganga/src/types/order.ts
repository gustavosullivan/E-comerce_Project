import type { CartItem } from '@/src/types/cart';
import type { UserAddress } from '@/src/types/address';

export type OrderStatus = 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface Order {
  id: number;
  userId: number;
  buyerName: string;
  buyerEmail: string;
  deliveryAddress?: UserAddress;
  status: OrderStatus;
  items: CartItem[];
  total: number;
  createdAt: string;
  message?: string;
}
