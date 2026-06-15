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

interface StockAdjustment {
  productId: number;
  quantity: number;
}

interface ProductCatalogState {
  products: Product[];
  addProduct: (data: ProductInput) => Product;
  updateProduct: (id: number, data: Partial<ProductInput>) => Product;
  removeProduct: (id: number) => void;
  decreaseStockForItems: (items: StockAdjustment[]) => void;
  restoreStockForItems: (items: StockAdjustment[]) => void;
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
          userId: data.userId ?? 0,
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
      decreaseStockForItems: (items) => {
        if (items.length === 0) return;

        const products = get().products;

        for (const item of items) {
          const product = products.find((p) => p.id === item.productId);
          if (!product) {
            throw new Error('Produto não encontrado');
          }
          if (product.stock < item.quantity) {
            throw new Error(`Estoque insuficiente para "${product.name}"`);
          }
        }

        set({
          products: products.map((product) => {
            const adjustment = items.find((item) => item.productId === product.id);
            if (!adjustment) return product;
            return { ...product, stock: product.stock - adjustment.quantity };
          }),
        });
      },
      restoreStockForItems: (items) => {
        if (items.length === 0) return;

        set({
          products: get().products.map((product) => {
            const adjustment = items.find((item) => item.productId === product.id);
            if (!adjustment) return product;
            return { ...product, stock: product.stock + adjustment.quantity };
          }),
        });
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
