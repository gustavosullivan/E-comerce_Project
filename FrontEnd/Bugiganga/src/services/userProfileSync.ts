import { useAddressStore } from '@/src/store/addressStore';
import { useAuthStore } from '@/src/store/authStore';
import { useWalletStore } from '@/src/store/walletStore';
import { EMPTY_ADDRESS, type UserAddress } from '@/src/types/address';

export interface ApiUserProfile {
  id: number;
  avatarUrl?: string | null;
  street?: string | null;
  number?: string | null;
  complement?: string | null;
  neighborhood?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  balance?: number | null;
}

export function mapApiAddress(user: ApiUserProfile): UserAddress {
  return {
    street: user.street?.trim() ?? '',
    number: user.number?.trim() ?? '',
    complement: user.complement?.trim() ?? '',
    neighborhood: user.neighborhood?.trim() ?? '',
    city: user.city?.trim() ?? '',
    state: user.state?.trim().toUpperCase() ?? '',
    zipCode: user.zipCode?.trim() ?? '',
  };
}

export function hasApiAddress(user: ApiUserProfile): boolean {
  const address = mapApiAddress(user);
  return Object.entries(address).some(([key, value]) => {
    if (key === 'complement') return false;
    return value.trim().length > 0;
  });
}

export function syncUserProfileStores(user: ApiUserProfile): void {
  useAuthStore.getState().setAvatarUri(user.avatarUrl ?? null);

  if (user.id > 0) {
    useAddressStore.getState().setAddress(user.id, mapApiAddress(user));

    if (user.balance != null) {
      useWalletStore.getState().setBalance(user.id, user.balance);
    }
  }
}

export function buildAddressPayload(address: UserAddress) {
  return {
    street: address.street.trim(),
    number: address.number.trim(),
    complement: address.complement?.trim() ?? '',
    neighborhood: address.neighborhood.trim(),
    city: address.city.trim(),
    state: address.state.trim().toUpperCase(),
    zipCode: address.zipCode.trim(),
  };
}

export { EMPTY_ADDRESS };
