import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { apiClient, mapAxiosError } from '@/src/services/api/client';
import { productMock } from '@/src/services/mocks/productMock';
import type { Product } from '@/src/types/product';

export const productService = {
  async list(): Promise<Product[]> {
    try {
      if (USE_MOCK) return await productMock.list();
      const response = await apiClient.get<Product[]>(API_ENDPOINTS.products.list);
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async getById(id: number): Promise<Product> {
    try {
      if (USE_MOCK) return await productMock.getById(id);
      const response = await apiClient.get<Product>(API_ENDPOINTS.products.byId(id));
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },

  async search(query: string): Promise<Product[]> {
    try {
      if (USE_MOCK) return await productMock.search(query);
      const response = await apiClient.get<Product[]>(API_ENDPOINTS.products.list, {
        params: { q: query },
      });
      return response.data;
    } catch (error) {
      throw mapAxiosError(error);
    }
  },
};
