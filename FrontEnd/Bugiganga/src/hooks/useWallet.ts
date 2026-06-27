import { useEffect } from 'react';

import { walletService } from '@/src/services/walletService';
import { useWalletStore } from '@/src/store/walletStore';

export function useWallet(userId?: number, isBuyer = true) {
  const balance = useWalletStore((s) => (userId ? s.balances[userId] ?? 0 : 0));

  useEffect(() => {
    if (userId && isBuyer) {
      void walletService.loadBalance(userId).catch(() => undefined);
    }
  }, [userId, isBuyer]);

  return { balance };
}
