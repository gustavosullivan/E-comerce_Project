import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authPersistStorage } from '@/src/storage/authPersistStorage';
import type { Order } from '@/src/types/order';

interface OrderHistoryState {
  orders: Order[];
  addOrder: (order: Order) => void;
  getOrdersByUserId: (userId: number) => Order[];
  getOrderById: (id: number) => Order | undefined;
}

export const useOrderHistoryStore = create<OrderHistoryState>()(
  persist(
    (set, get) => ({
      orders: [],
      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders.filter((o) => o.id !== order.id)],
        })),
      getOrdersByUserId: (userId) =>
        get()
          .orders.filter((o) => o.userId === userId)
          .sort(
            (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
          ),
      getOrderById: (id) => get().orders.find((o) => o.id === id),
    }),
    {
      name: 'bugiganga-order-history',
      storage: authPersistStorage,
    },
  ),
);
