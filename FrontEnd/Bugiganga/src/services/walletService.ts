import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { DEFAULT_BUYER_BALANCE, useWalletStore } from '@/src/store/walletStore';
import { InsufficientBalanceError, type WalletBalance } from '@/src/types/wallet';

export const walletService = {
  ensureWallet(userId: number, isBuyer: boolean): void {
    useWalletStore.getState().ensureWallet(userId, isBuyer);
  },

  getBalance(userId: number, isBuyer = true): number {
    if (USE_MOCK) {
      useWalletStore.getState().ensureWallet(userId, isBuyer);
      return useWalletStore.getState().getBalance(userId);
    }

    return useWalletStore.getState().getBalance(userId);
  },

  canAfford(userId: number, amount: number, isBuyer = true): boolean {
    return walletService.getBalance(userId, isBuyer) >= amount;
  },

  async debit(userId: number, amount: number, isBuyer = true): Promise<WalletBalance> {
    try {
      if (USE_MOCK) {
        await new Promise((r) => setTimeout(r, 600));
        useWalletStore.getState().ensureWallet(userId, isBuyer);

        const ok = useWalletStore.getState().debit(userId, amount);
        if (!ok) throw new InsufficientBalanceError();

        return {
          userId,
          balance: useWalletStore.getState().getBalance(userId),
          currency: 'BRL',
          updatedAt: new Date().toISOString(),
        };
      }

      const response = await apiClient.post<WalletBalance>(API_ENDPOINTS.wallet.debit, {
        amount,
      });
      useWalletStore.getState().setBalance(userId, response.data.balance);
      return response.data;
    } catch (error) {
      if (error instanceof InsufficientBalanceError) throw error;
      throw mapAxiosError(error);
    }
  },

  credit(userId: number, amount: number): void {
    useWalletStore.getState().credit(userId, amount);
  },

  getDefaultBalance(): number {
    return DEFAULT_BUYER_BALANCE;
  },
};
