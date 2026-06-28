import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authPersistStorage } from '@/src/storage/authPersistStorage';
import { useAuthStore } from '@/src/store/authStore';
import type { CartItem } from '@/src/types/cart';
import type { Product } from '@/src/types/product';

const EMPTY_CART_ITEMS: CartItem[] = [];

interface CartState {
  cartsByUser: Record<number, CartItem[]>;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getSubtotal: (userId?: number) => number;
  getTotal: (userId?: number) => number;
  getItemCount: (userId?: number) => number;
}

function resolveUserId(userId?: number): number | null {
  const resolved = userId ?? useAuthStore.getState().user?.id;
  return resolved && resolved > 0 ? resolved : null;
}

export function selectCartItems(state: CartState, userId?: number | null): CartItem[] {
  if (!userId) return EMPTY_CART_ITEMS;
  return state.cartsByUser[userId] ?? EMPTY_CART_ITEMS;
}

export function selectCartItemCount(state: CartState, userId?: number | null): number {
  return selectCartItems(state, userId).reduce((sum, item) => sum + item.quantity, 0);
}

function getSubtotalForItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartsByUser: {},
      addItem: (product, quantity = 1) => {
        const userId = resolveUserId();
        if (!userId) return;

        set((state) => {
          const currentItems = state.cartsByUser[userId] ?? [];
          const existing = currentItems.find((item) => item.product.id === product.id);

          if (existing) {
            return {
              cartsByUser: {
                ...state.cartsByUser,
                [userId]: currentItems.map((item) =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + quantity }
                    : item,
                ),
              },
            };
          }

          return {
            cartsByUser: {
              ...state.cartsByUser,
              [userId]: [...currentItems, { product, quantity }],
            },
          };
        });
      },
      removeItem: (productId) => {
        const userId = resolveUserId();
        if (!userId) return;

        set((state) => ({
          cartsByUser: {
            ...state.cartsByUser,
            [userId]: (state.cartsByUser[userId] ?? []).filter(
              (item) => item.product.id !== productId,
            ),
          },
        }));
      },
      updateQuantity: (productId, quantity) => {
        const userId = resolveUserId();
        if (!userId) return;

        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          cartsByUser: {
            ...state.cartsByUser,
            [userId]: (state.cartsByUser[userId] ?? []).map((item) =>
              item.product.id === productId ? { ...item, quantity } : item,
            ),
          },
        }));
      },
      clearCart: () => {
        const userId = resolveUserId();
        if (!userId) return;

        set((state) => ({
          cartsByUser: {
            ...state.cartsByUser,
            [userId]: EMPTY_CART_ITEMS,
          },
        }));
      },
      getSubtotal: (userId) => {
        const resolvedUserId = resolveUserId(userId);
        if (!resolvedUserId) return 0;
        return getSubtotalForItems(get().cartsByUser[resolvedUserId] ?? []);
      },
      getTotal: (userId) => get().getSubtotal(userId),
      getItemCount: (userId) => selectCartItemCount(get(), resolveUserId(userId)),
    }),
    {
      name: 'bugiganga-cart',
      storage: authPersistStorage,
      version: 1,
      migrate: (persisted) => {
        if (!persisted || typeof persisted !== 'object') {
          return { cartsByUser: {} };
        }
        if ('items' in persisted) {
          return { cartsByUser: {} };
        }
        return persisted as CartState;
      },
    },
  ),
);
