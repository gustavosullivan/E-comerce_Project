import { useCurrencyStore, type SupportedCurrency } from '@/src/store/currencyStore';

export function formatCurrency(value: number, currencyCode?: SupportedCurrency): string {
  const code = currencyCode || useCurrencyStore.getState().currency;
  
  const locales: Record<SupportedCurrency, string> = {
    BRL: 'pt-BR',
    USD: 'en-US',
    EUR: 'de-DE', // typical format used for Euros in Europe
  };

  return value.toLocaleString(locales[code], { 
    style: 'currency', 
    currency: code 
  });
}

export function useFormatCurrency() {
  const currency = useCurrencyStore((s) => s.currency);
  return (value: number) => formatCurrency(value, currency);
}
