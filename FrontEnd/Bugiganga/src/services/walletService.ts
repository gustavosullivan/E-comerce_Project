import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { useWalletStore } from '@/src/store/walletStore';
import { InsufficientBalanceError, type WalletBalance } from '@/src/types/wallet';

export const walletService = {
  async loadBalance(userId: number): Promise<number> {
    try {
      const response = await apiClient.get<WalletBalance>(API_ENDPOINTS.wallet.balance);
      useWalletStore.getState().setBalance(userId, response.data.balance);
      return response.data.balance;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  getBalance(userId: number): number {
    return useWalletStore.getState().getBalance(userId);
  },

  canAfford(userId: number, amount: number): boolean {
    return walletService.getBalance(userId) >= amount;
  },

  async debit(userId: number, amount: number): Promise<WalletBalance> {
    try {
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

  async credit(userId: number, amount: number): Promise<WalletBalance> {
    try {
      const response = await apiClient.post<WalletBalance>(API_ENDPOINTS.wallet.credit, {
        amount,
      });
      useWalletStore.getState().setBalance(userId, response.data.balance);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
