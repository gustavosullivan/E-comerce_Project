import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authPersistStorage } from '@/src/storage/authPersistStorage';

export type SupportedCurrency = 'BRL' | 'USD' | 'EUR';

interface CurrencyState {
  currency: SupportedCurrency;
  setCurrency: (c: SupportedCurrency) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: 'BRL',
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'bugigangas-currency-store',
      storage: authPersistStorage,
    }
  )
);
