import { MOCK_PRODUCTS } from '@/src/mocks/products';
import type { Product } from '@/src/types/product';

import { mockDelay } from './delay';

export const productMock = {
  async list(): Promise<Product[]> {
    await mockDelay(600);
    return MOCK_PRODUCTS;
  },

  async getById(id: number): Promise<Product> {
    await mockDelay(400);
    const product = MOCK_PRODUCTS.find((p) => p.id === id);
    if (!product) throw new Error('Produto não encontrado');
    return product;
  },

  async search(query: string): Promise<Product[]> {
    await mockDelay(400);
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_PRODUCTS;
    return MOCK_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.categoryName.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  },
};
