import { isAxiosError } from 'axios';

import { API_ENDPOINTS } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { useAddressStore } from '@/src/store/addressStore';
import type { UserAddress } from '@/src/types/address';

export const addressService = {
  async getAddress(userId: number): Promise<UserAddress | null> {
    const mockAddress: UserAddress = {
      street: 'Rua Fictícia',
      number: '123',
      complement: 'Apto 45',
      neighborhood: 'Centro',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01000-000',
    };
    useAddressStore.getState().setAddress(userId, mockAddress);
    return mockAddress;
  },

  async saveAddress(userId: number, address: UserAddress): Promise<UserAddress> {
    useAddressStore.getState().setAddress(userId, address);
    return address;
  },
};
