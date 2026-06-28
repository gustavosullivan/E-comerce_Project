import { useAuthStore } from '@/src/store/authStore';
import { selectCartItemCount, selectCartItems, useCartStore } from '@/src/store/cartStore';

export function useCart() {
  const userId = useAuthStore((state) => state.user?.id);
  const items = useCartStore((state) => selectCartItems(state, userId));
  const addItem = useCartStore((state) => state.addItem);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const subtotal = useCartStore((state) => state.getSubtotal(userId));
  const total = useCartStore((state) => state.getTotal(userId));
  const itemCount = useCartStore((state) => selectCartItemCount(state, userId));

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    total,
    itemCount,
  };
}
