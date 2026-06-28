import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authPersistStorage } from '@/src/storage/authPersistStorage';
import { snackbar } from '@/src/store/snackbarStore';
import { useAuthStore } from '@/src/store/authStore';
import type { Product } from '@/src/types/product';

const EMPTY_FAVORITES: Product[] = [];

interface FavoritesState {
  favoritesByUser: Record<number, Product[]>;
  toggle: (product: Product) => void;
  isFavorite: (productId: number, userId?: number) => boolean;
  remove: (productId: number, userId?: number) => void;
}

function resolveUserId(userId?: number): number | null {
  const resolved = userId ?? useAuthStore.getState().user?.id;
  return resolved && resolved > 0 ? resolved : null;
}

export function selectFavoriteItems(
  state: FavoritesState,
  userId?: number | null,
): Product[] {
  if (!userId) return EMPTY_FAVORITES;
  return state.favoritesByUser[userId] ?? EMPTY_FAVORITES;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      favoritesByUser: {},
      toggle: (product) => {
        const userId = resolveUserId();
        if (!userId) {
          snackbar.error('Faça login para salvar favoritos');
          return;
        }

        const currentItems = get().favoritesByUser[userId] ?? [];
        const exists = currentItems.some((item) => item.id === product.id);

        if (exists) {
          set((state) => ({
            favoritesByUser: {
              ...state.favoritesByUser,
              [userId]: currentItems.filter((item) => item.id !== product.id),
            },
          }));
          snackbar.info('Removido dos favoritos');
          return;
        }

        set((state) => ({
          favoritesByUser: {
            ...state.favoritesByUser,
            [userId]: [...currentItems, product],
          },
        }));
        snackbar.success('Salvo nos favoritos');
      },
      isFavorite: (productId, userId) => {
        const resolvedUserId = resolveUserId(userId);
        if (!resolvedUserId) return false;
        return (get().favoritesByUser[resolvedUserId] ?? []).some((item) => item.id === productId);
      },
      remove: (productId, userId) => {
        const resolvedUserId = resolveUserId(userId);
        if (!resolvedUserId) return;

        set((state) => ({
          favoritesByUser: {
            ...state.favoritesByUser,
            [resolvedUserId]: (state.favoritesByUser[resolvedUserId] ?? []).filter(
              (item) => item.id !== productId,
            ),
          },
        }));
      },
    }),
    {
      name: 'bugiganga-favorites',
      storage: authPersistStorage,
      version: 1,
      migrate: (persisted) => {
        if (!persisted || typeof persisted !== 'object') {
          return { favoritesByUser: {} };
        }
        if ('items' in persisted) {
          return { favoritesByUser: {} };
        }
        return persisted as FavoritesState;
      },
    },
  ),
);
