import { getCatalogProducts, useProductCatalogStore } from '@/src/store/productCatalogStore';
import type { Product, ProductInput } from '@/src/types/product';

import { mockDelay } from './delay';

export const productMock = {
  async list(): Promise<Product[]> {
    await mockDelay(600);
    return getCatalogProducts();
  },

  async getById(id: number): Promise<Product> {
    await mockDelay(400);
    const product = getCatalogProducts().find((p) => p.id === id);
    if (!product) throw new Error('Produto não encontrado');
    return product;
  },

  async search(query: string): Promise<Product[]> {
    await mockDelay(400);
    const q = query.trim().toLowerCase();
    const products = getCatalogProducts();
    if (!q) return products;
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  },

  async create(data: ProductInput): Promise<Product> {
    await mockDelay(500);
    return useProductCatalogStore.getState().addProduct(data);
  },

  async update(id: number, data: Partial<ProductInput>): Promise<Product> {
    await mockDelay(500);
    return useProductCatalogStore.getState().updateProduct(id, data);
  },

  async remove(id: number): Promise<void> {
    await mockDelay(400);
    useProductCatalogStore.getState().removeProduct(id);
  },
};
