import type { UserAddress } from '@/src/types/address';

export function hasAddress(address?: UserAddress | null): boolean {
  if (!address) return false;
  return Boolean(
    address.street.trim() &&
      address.number.trim() &&
      address.neighborhood.trim() &&
      address.city.trim() &&
      address.state.trim() &&
      address.zipCode.trim(),
  );
}

export function formatZipCode(zipCode: string): string {
  const digits = zipCode.replace(/\D/g, '');
  if (digits.length !== 8) return zipCode;
  return `${digits.slice(0, 5)}-${digits.slice(5)}`;
}

export function formatAddressCompact(address?: UserAddress | null): string {
  if (!hasAddress(address) || !address) {
    return 'Endereço não cadastrado';
  }

  const line1 = `${address.street}, ${address.number}`;
  const complement = address.complement?.trim() ? ` - ${address.complement.trim()}` : '';
  const line2 = `${address.neighborhood} · ${address.city}/${address.state.toUpperCase()}`;
  const zip = formatZipCode(address.zipCode);

  return `${line1}${complement}\n${line2} · CEP ${zip}`;
}

export function formatAddressSingleLine(address?: UserAddress | null): string {
  return formatAddressCompact(address).replace('\n', ' · ');
}
