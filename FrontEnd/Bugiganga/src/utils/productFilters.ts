import type { ProductFilters, PriceRangePreset } from '@/src/types/productFilters';
import type { Product } from '@/src/types/product';

function matchesPriceRange(price: number, preset: PriceRangePreset): boolean {
  switch (preset) {
    case 'under50':
      return price <= 50;
    case '50to200':
      return price > 50 && price <= 200;
    case 'over200':
      return price > 200;
    default:
      return true;
  }
}

function matchesQuery(product: Product, query: string): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  return (
    product.name.toLowerCase().includes(q) ||
    product.categoryName.toLowerCase().includes(q) ||
    product.description.toLowerCase().includes(q)
  );
}

export function applyProductFilters(
  products: Product[],
  query: string,
  filters: ProductFilters,
): Product[] {
  return products.filter((product) => {
    if (filters.categoryId != null && product.categoryId !== filters.categoryId) {
      return false;
    }
    if (!matchesPriceRange(product.price, filters.priceRange)) {
      return false;
    }
    return matchesQuery(product, query);
  });
}

export function countActiveProductFilters(filters: ProductFilters): number {
  let count = 0;
  if (filters.categoryId != null) count += 1;
  if (filters.priceRange !== 'all') count += 1;
  return count;
}
