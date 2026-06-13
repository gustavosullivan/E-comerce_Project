import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { MOCK_PRODUCTS } from '@/src/mocks/products';
import { authPersistStorage } from '@/src/storage/authPersistStorage';
import type { Product, ProductInput } from '@/src/types/product';

function resolveCategoryName(categoryId: number): string {
  return MOCK_CATEGORIES.find((c) => c.id === categoryId)?.name ?? 'Outros';
}

function nextProductId(products: Product[]): number {
  if (products.length === 0) return 1;
  return Math.max(...products.map((p) => p.id)) + 1;
}

interface ProductCatalogState {
  products: Product[];
  addProduct: (data: ProductInput) => Product;
  updateProduct: (id: number, data: Partial<ProductInput>) => Product;
  removeProduct: (id: number) => void;
  resetCatalog: () => void;
}

export const useProductCatalogStore = create<ProductCatalogState>()(
  persist(
    (set, get) => ({
      products: MOCK_PRODUCTS,
      addProduct: (data) => {
        const product: Product = {
          id: nextProductId(get().products),
          name: data.name.trim(),
          description: data.description.trim(),
          price: data.price,
          imageUrl: data.imageUrl.trim(),
          stock: data.stock,
          categoryId: data.categoryId,
          categoryName: resolveCategoryName(data.categoryId),
          isNew: data.isNew ?? true,
          isFeatured: data.isFeatured ?? false,
          isBestseller: data.isBestseller ?? false,
        };
        set({ products: [...get().products, product] });
        return product;
      },
      updateProduct: (id, data) => {
        const current = get().products.find((p) => p.id === id);
        if (!current) throw new Error('Produto não encontrado');

        const categoryId = data.categoryId ?? current.categoryId;
        const updated: Product = {
          ...current,
          ...data,
          name: data.name?.trim() ?? current.name,
          description: data.description?.trim() ?? current.description,
          imageUrl: data.imageUrl?.trim() ?? current.imageUrl,
          categoryId,
          categoryName: resolveCategoryName(categoryId),
        };

        set({
          products: get().products.map((p) => (p.id === id ? updated : p)),
        });
        return updated;
      },
      removeProduct: (id) => {
        set({ products: get().products.filter((p) => p.id !== id) });
      },
      resetCatalog: () => set({ products: MOCK_PRODUCTS }),
    }),
    {
      name: 'bugigangas-catalog',
      storage: authPersistStorage,
      skipHydration: true,
    },
  ),
);

export function getCatalogProducts(): Product[] {
  return useProductCatalogStore.getState().products;
}
