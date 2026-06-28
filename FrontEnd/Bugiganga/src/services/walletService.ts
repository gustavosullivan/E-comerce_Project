import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, getErrorMessage, mapAxiosError } from '@/src/services/api/client';
import { useWalletStore } from '@/src/store/walletStore';
import { InsufficientBalanceError, type WalletBalance } from '@/src/types/wallet';

interface ApiWalletBalance {
  userId: number;
  balance: number;
  currency: string;
  updatedAt: string;
}

function mapWalletBalance(data: ApiWalletBalance): WalletBalance {
  return {
    userId: data.userId,
    balance: data.balance,
    currency: 'BRL',
    updatedAt: data.updatedAt,
  };
}

function isInsufficientBalanceMessage(message: string): boolean {
  return message.toLowerCase().includes('sem saldo suficiente');
}

export const walletService = {
  async loadBalance(userId: number): Promise<number> {
    try {
      const response = await apiClient.get<ApiWalletBalance>(API_ENDPOINTS.wallet.balance);
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
      const response = await apiClient.post<ApiWalletBalance>(API_ENDPOINTS.wallet.debit, { amount });
      const wallet = mapWalletBalance(response.data);
      useWalletStore.getState().setBalance(userId, wallet.balance);
      return wallet;
    } catch (error) {
      if (isInsufficientBalanceMessage(getErrorMessage(error))) {
        throw new InsufficientBalanceError();
      }
      throw mapAxiosError(error);
    }
  },

  async credit(userId: number, amount: number): Promise<WalletBalance> {
    try {
      const response = await apiClient.post<ApiWalletBalance>(API_ENDPOINTS.wallet.credit, { amount });
      const wallet = mapWalletBalance(response.data);
      useWalletStore.getState().setBalance(userId, wallet.balance);
      return wallet;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
