export type PriceRangePreset = 'all' | 'under50' | '50to200' | 'over200';

export type ProductFilters = {
  categoryId: number | null;
  priceRange: PriceRangePreset;
};

export const EMPTY_PRODUCT_FILTERS: ProductFilters = {
  categoryId: null,
  priceRange: 'all',
};

export const PRICE_RANGE_OPTIONS: { id: PriceRangePreset; label: string }[] = [
  { id: 'all', label: 'Qualquer preço' },
  { id: 'under50', label: 'Até R$ 50' },
  { id: '50to200', label: 'R$ 50 – R$ 200' },
  { id: 'over200', label: 'Acima de R$ 200' },
];
