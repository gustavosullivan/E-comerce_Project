import type { Product } from '@/src/types/product';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Cart {
  id: number;
  items: CartItem[];
  total: number;
}

export interface CartSummary {
  items: CartItem[];
  subtotal: number;
  total: number;
}
