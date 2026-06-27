import { isAxiosError } from 'axios';
import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { useWalletStore } from '@/src/store/walletStore';
import { InsufficientBalanceError, type WalletBalance } from '@/src/types/wallet';

export const walletService = {
  async loadBalance(userId: number): Promise<number> {
    const mockBalance = 1500.00;
    useWalletStore.getState().setBalance(userId, mockBalance);
    return mockBalance;
  },

  getBalance(userId: number): number {
    return useWalletStore.getState().getBalance(userId);
  },

  canAfford(userId: number, amount: number): boolean {
    return walletService.getBalance(userId) >= amount;
  },

  async debit(userId: number, amount: number): Promise<WalletBalance> {
    const current = this.getBalance(userId);
    if (current < amount) throw new InsufficientBalanceError();
    const newBalance = current - amount;
    useWalletStore.getState().setBalance(userId, newBalance);
    return { 
      userId, 
      balance: newBalance, 
      currency: 'BRL', 
      updatedAt: new Date().toISOString() 
    };
  },

  async credit(userId: number, amount: number): Promise<WalletBalance> {
    const current = this.getBalance(userId);
    const newBalance = current + amount;
    useWalletStore.getState().setBalance(userId, newBalance);
    return { 
      userId, 
      balance: newBalance, 
      currency: 'BRL', 
      updatedAt: new Date().toISOString() 
    };
  },
};
