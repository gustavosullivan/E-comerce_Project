import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authPersistStorage } from '@/src/storage/authPersistStorage';
import { EMPTY_ADDRESS, type UserAddress } from '@/src/types/address';

interface AddressState {
  addresses: Record<number, UserAddress>;
  getAddress: (userId: number) => UserAddress | null;
  setAddress: (userId: number, address: UserAddress) => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set, get) => ({
      addresses: {},
      getAddress: (userId) => get().addresses[userId] ?? null,
      setAddress: (userId, address) =>
        set((state) => ({
          addresses: {
            ...state.addresses,
            [userId]: {
              ...EMPTY_ADDRESS,
              ...address,
              state: address.state.trim().toUpperCase(),
            },
          },
        })),
    }),
    {
      name: 'bugiganga-addresses',
      storage: authPersistStorage,
    },
  ),
);
