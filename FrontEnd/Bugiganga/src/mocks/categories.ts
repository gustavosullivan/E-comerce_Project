import type { Category, CategoryProductType } from '@/src/types/product';

export const MOCK_CATEGORIES: Category[] = [
  { id: 1, name: 'Disco pop', slug: 'disco-pop', productType: 'VINYL' },
  { id: 2, name: 'Disco rock', slug: 'disco-rock', productType: 'VINYL' },
  { id: 3, name: 'Disco MPB', slug: 'disco-mpb', productType: 'VINYL' },
  { id: 4, name: 'Disco colecionável', slug: 'disco-colecionavel', productType: 'VINYL' },
  { id: 5, name: 'Livros estrangeiros', slug: 'livros-estrangeiros', productType: 'BOOK' },
  { id: 6, name: 'Livros brasileiros', slug: 'livros-brasileiros', productType: 'BOOK' },
  { id: 7, name: 'Livros clássicos', slug: 'livros-classicos', productType: 'BOOK' },
  { id: 8, name: 'Livros colecionáveis', slug: 'livros-colecionaveis', productType: 'BOOK' },
];

export function getCategoriesByProductType(productType: CategoryProductType): Category[] {
  return MOCK_CATEGORIES.filter((category) => category.productType === productType);
}

export function getDefaultCategoryId(productType: CategoryProductType): number {
  return getCategoriesByProductType(productType)[0]?.id ?? 1;
}

export function getProductTypeByCategoryId(categoryId: number): CategoryProductType {
  return MOCK_CATEGORIES.find((category) => category.id === categoryId)?.productType ?? 'BOOK';
}

export function isCategoryValidForProductType(
  categoryId: number,
  productType: CategoryProductType,
): boolean {
  return getCategoriesByProductType(productType).some((category) => category.id === categoryId);
}
