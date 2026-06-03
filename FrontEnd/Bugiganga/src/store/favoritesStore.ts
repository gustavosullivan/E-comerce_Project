import { create } from 'zustand';

import type { Product } from '@/src/types/product';

interface FavoritesState {
  items: Product[];
  toggle: (product: Product) => void;
  isFavorite: (productId: number) => boolean;
  remove: (productId: number) => void;
}

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  items: [],
  toggle: (product) => {
    const exists = get().isFavorite(product.id);
    if (exists) {
      set((state) => ({ items: state.items.filter((p) => p.id !== product.id) }));
      return;
    }
    set((state) => ({ items: [...state.items, product] }));
  },
  isFavorite: (productId) => get().items.some((p) => p.id === productId),
  remove: (productId) => {
    set((state) => ({ items: state.items.filter((p) => p.id !== productId) }));
  },
}));
