import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authPersistStorage } from '@/src/storage/authPersistStorage';

/** Crédito inicial em reais para contas comprador (padrão do backend). */
export const DEFAULT_BUYER_BALANCE = 1800;

interface WalletState {
  balances: Record<number, number>;
  ensureWallet: (userId: number, isBuyer: boolean) => void;
  getBalance: (userId: number) => number;
  setBalance: (userId: number, amount: number) => void;
  debit: (userId: number, amount: number) => boolean;
  credit: (userId: number, amount: number) => void;
}

export const useWalletStore = create<WalletState>()(
  persist(
    (set, get) => ({
      balances: {},
      ensureWallet: (userId, isBuyer) => {
        if (!isBuyer || userId <= 0) return;
        const current = get().balances[userId];
        if (current == null) {
          set((state) => ({
            balances: { ...state.balances, [userId]: DEFAULT_BUYER_BALANCE },
          }));
        }
      },
      getBalance: (userId) => get().balances[userId] ?? 0,
      setBalance: (userId, amount) =>
        set((state) => ({
          balances: { ...state.balances, [userId]: Math.max(0, amount) },
        })),
      debit: (userId, amount) => {
        const balance = get().getBalance(userId);
        if (amount <= 0) return true;
        if (balance < amount) return false;
        set((state) => ({
          balances: {
            ...state.balances,
            [userId]: Math.round((balance - amount) * 100) / 100,
          },
        }));
        return true;
      },
      credit: (userId, amount) => {
        if (amount <= 0) return;
        const balance = get().getBalance(userId);
        set((state) => ({
          balances: {
            ...state.balances,
            [userId]: Math.round((balance + amount) * 100) / 100,
          },
        }));
      },
    }),
    {
      name: 'bugiganga-wallet',
      storage: authPersistStorage,
    },
  ),
);
