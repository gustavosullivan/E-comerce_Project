import { useCallback, useEffect, useState } from 'react';

import { addressService } from '@/src/services/addressService';
import { useAddressStore } from '@/src/store/addressStore';
import type { UserAddress } from '@/src/types/address';
import { hasAddress } from '@/src/utils/formatAddress';

export function useAddress(userId?: number) {
  const address = useAddressStore((s) => (userId ? s.addresses[userId] ?? null : null));
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    void addressService.getAddress(userId);
  }, [userId]);

  const saveAddress = useCallback(
    async (data: UserAddress) => {
      if (!userId) return null;
      setIsLoading(true);
      try {
        return await addressService.saveAddress(userId, data);
      } finally {
        setIsLoading(false);
      }
    },
    [userId],
  );

  return {
    address,
    hasAddress: hasAddress(address),
    isLoading,
    saveAddress,
  };
}
