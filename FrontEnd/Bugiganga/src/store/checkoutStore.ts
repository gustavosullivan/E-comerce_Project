import { create } from 'zustand';

import { useCartStore } from '@/src/store/cartStore';
import type { CartItem } from '@/src/types/cart';
import type { Product } from '@/src/types/product';

type CheckoutMode = 'cart' | 'buyNow';

interface CheckoutState {
  items: CartItem[];
  mode: CheckoutMode;
  setFromCart: () => void;
  setBuyNow: (product: Product, quantity: number) => void;
  getTotal: () => number;
  clear: () => void;
}

export const useCheckoutStore = create<CheckoutState>((set, get) => ({
  items: [],
  mode: 'buyNow',
  setFromCart: () => {
    const cartItems = useCartStore.getState().items;
    set({ items: [...cartItems], mode: 'cart' });
  },
  setBuyNow: (product, quantity) => {
    set({ items: [{ product, quantity }], mode: 'buyNow' });
  },
  getTotal: () =>
    get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
  clear: () => set({ items: [], mode: 'buyNow' }),
}));
