import { create } from 'zustand';

import type { CartItem } from '@/src/types/cart';
import type { Product } from '@/src/types/product';

interface CartState {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: () => number;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  addItem: (product, quantity = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.product.id === product.id
              ? { ...i, quantity: i.quantity + quantity }
              : i,
          ),
        };
      }
      return { items: [...state.items, { product, quantity }] };
    });
  },
  removeItem: (productId) => {
    set((state) => ({ items: state.items.filter((i) => i.product.id !== productId) }));
  },
  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      ),
    }));
  },
  clearCart: () => set({ items: [] }),
  getSubtotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  getTotal: () => get().getSubtotal(),
}));
