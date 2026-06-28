import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authPersistStorage } from '@/src/storage/authPersistStorage';

interface AdminProductsState {
  myProductIds: Record<number, number[]>;
  addProductId: (userId: number, productId: number) => void;
  removeProductId: (userId: number, productId: number) => void;
  clearProductIds: (userId: number) => void;
}

export const useAdminProductsStore = create<AdminProductsState>()(
  persist(
    (set) => ({
      myProductIds: {},
      addProductId: (userId, productId) =>
        set((state) => {
          const userProducts = state.myProductIds[userId] || [];
          return {
            myProductIds: {
              ...state.myProductIds,
              [userId]: [...new Set([...userProducts, productId])],
            },
          };
        }),
      removeProductId: (userId, productId) =>
        set((state) => {
          const userProducts = state.myProductIds[userId] || [];
          return {
            myProductIds: {
              ...state.myProductIds,
              [userId]: userProducts.filter((pId) => pId !== productId),
            },
          };
        }),
      clearProductIds: (userId) =>
        set((state) => ({
          myProductIds: {
            ...state.myProductIds,
            [userId]: [],
          },
        })),
    }),
    {
      name: 'bugigangas-admin-products',
      storage: authPersistStorage,
    }
  )
);
