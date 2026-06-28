import { useAuthStore } from '@/src/store/authStore';
import { selectFavoriteItems, useFavoritesStore } from '@/src/store/favoritesStore';

export function useFavorites() {
  const userId = useAuthStore((state) => state.user?.id);
  const items = useFavoritesStore((state) => selectFavoriteItems(state, userId));
  const toggle = useFavoritesStore((state) => state.toggle);
  const remove = useFavoritesStore((state) => state.remove);
  const isFavorite = useFavoritesStore((state) => state.isFavorite);

  return {
    items,
    toggle,
    remove,
    isFavorite: (productId: number) => isFavorite(productId, userId),
    count: items.length,
  };
}
