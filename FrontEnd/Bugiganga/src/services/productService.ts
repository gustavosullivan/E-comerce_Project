import { API_ENDPOINTS, USE_MOCK } from '@/src/config/api';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import type { ProductFormData } from '@/src/schemas/productSchema';
import { apiClient, throwServiceError } from '@/src/services/api/client';
import { uploadProductImage } from '@/src/services/cloudinaryService';
import { productMock } from '@/src/services/mocks/productMock';
import { getCatalogProducts, useProductCatalogStore } from '@/src/store/productCatalogStore';
import type { User } from '@/src/types/auth';
import type { Product, ProductInput } from '@/src/types/product';
import type { ImagePickerAsset } from 'expo-image-picker';
import type { parseProductForm } from '@/src/validation/productSchema';

function resolveCategoryId(categoryName: string): number {
  const normalized = categoryName.trim().toLowerCase();
  const found = MOCK_CATEGORIES.find((c) => c.name.toLowerCase() === normalized);
  return found?.id ?? MOCK_CATEGORIES[0].id;
}

function formDataToProductInput(data: ProductFormData, userId: User['id']): ProductInput {
  return {
    name: data.name,
    description: data.description ?? '',
    price: data.price,
    stock: data.stock,
    imageUrl: data.imageUrl ?? `https://picsum.photos/seed/${Date.now()}/400/400`,
    categoryId: resolveCategoryId(data.category),
    userId,
  };
}

function formDataToPartialInput(data: Partial<ProductFormData>): Partial<ProductInput> {
  const partial: Partial<ProductInput> = {};

  if (data.name != null) partial.name = data.name;
  if (data.description != null) partial.description = data.description;
  if (data.price != null) partial.price = data.price;
  if (data.stock != null) partial.stock = data.stock;
  if (data.imageUrl != null) partial.imageUrl = data.imageUrl;
  if (data.category != null) partial.categoryId = resolveCategoryId(data.category);

  return partial;
}

export type AdminProductFormPayload = ReturnType<typeof parseProductForm>;

export type AdminProductSubmit = {
  data: AdminProductFormPayload;
  imageAsset?: ImagePickerAsset | null;
};

function adminFormToProductInput(
  data: AdminProductFormPayload,
  userId: User['id'],
  imageUrl: string,
): ProductInput {
  return {
    name: data.name,
    description: data.description,
    price: data.price,
    stock: data.stock,
    imageUrl,
    categoryId: data.categoryId,
    userId,
  };
}

function adminFormToPartialInput(
  data: Partial<AdminProductFormPayload>,
  imageUrl?: string,
): Partial<ProductInput> {
  const partial: Partial<ProductInput> = {};

  if (data.name != null) partial.name = data.name;
  if (data.description != null) partial.description = data.description;
  if (data.price != null) partial.price = data.price;
  if (data.stock != null) partial.stock = data.stock;
  if (imageUrl != null) partial.imageUrl = imageUrl;
  if (data.categoryId != null) {
    partial.categoryId = data.categoryId;
  }

  return partial;
}

async function resolveProductImageUrl(
  imageAsset?: ImagePickerAsset | null,
  existingUrl?: string,
): Promise<string> {
  if (imageAsset) {
    return uploadProductImage(imageAsset);
  }

  return existingUrl?.trim() ?? '';
}

export const productService = {
  async list(): Promise<Product[]> {
    try {
      if (USE_MOCK) return await productMock.list();
      const response = await apiClient.get<Product[]>(API_ENDPOINTS.products.list);
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },

  async getById(id: number): Promise<Product> {
    try {
      if (USE_MOCK) return await productMock.getById(id);
      const response = await apiClient.get<Product>(API_ENDPOINTS.products.byId(id));
      return response.data;
    } catch (error) {
      throwServiceError(error);
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
      throwServiceError(error);
    }
  },

  async create(data: ProductInput): Promise<Product> {
    try {
      if (USE_MOCK) return await productMock.create(data);
      const response = await apiClient.post<Product>(API_ENDPOINTS.products.list, data);
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },

  async update(id: number, data: Partial<ProductInput>): Promise<Product> {
    try {
      if (USE_MOCK) return await productMock.update(id, data);
      const response = await apiClient.put<Product>(API_ENDPOINTS.products.byId(id), data);
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },

  async remove(id: number): Promise<void> {
    try {
      if (USE_MOCK) return await productMock.remove(id);
      await apiClient.delete(API_ENDPOINTS.products.byId(id));
    } catch (error) {
      throwServiceError(error);
    }
  },

  async createProduct(userId: User['id'], productData: ProductFormData): Promise<Product> {
    try {
      if (USE_MOCK) {
        return useProductCatalogStore.getState().addProduct(formDataToProductInput(productData, userId));
      }
      const response = await apiClient.post<Product>(API_ENDPOINTS.products.list, {
        ...formDataToProductInput(productData, userId),
      });
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },

  async getAdminProducts(adminId: User['id']): Promise<Product[]> {
    try {
      if (USE_MOCK) {
        await productMock.list();
        return getCatalogProducts().filter((product) => product.userId === adminId);
      }
      const response = await apiClient.get<Product[]>(API_ENDPOINTS.products.list, {
        params: { sellerId: adminId },
      });
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },

  async updateProduct(productId: Product['id'], updatedData: Partial<ProductFormData>): Promise<Product> {
    try {
      if (USE_MOCK) {
        return useProductCatalogStore.getState().updateProduct(productId, formDataToPartialInput(updatedData));
      }
      const response = await apiClient.put<Product>(
        API_ENDPOINTS.products.byId(productId),
        formDataToPartialInput(updatedData),
      );
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },

  async deleteProduct(productId: Product['id']): Promise<void> {
    try {
      if (USE_MOCK) {
        useProductCatalogStore.getState().removeProduct(productId);
        return;
      }
      await apiClient.delete(API_ENDPOINTS.products.byId(productId));
    } catch (error) {
      throwServiceError(error);
    }
  },

  async createFromAdminForm(userId: User['id'], submit: AdminProductSubmit): Promise<Product> {
    try {
      const imageUrl = await resolveProductImageUrl(submit.imageAsset, submit.data.imageUrl);
      if (!imageUrl) {
        throw new Error('Selecione uma imagem do produto.');
      }

      const input = adminFormToProductInput(submit.data, userId, imageUrl);

      if (USE_MOCK) {
        return useProductCatalogStore.getState().addProduct(input);
      }

      const response = await apiClient.post<Product>(API_ENDPOINTS.products.list, input);
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },

  async updateFromAdminForm(
    productId: Product['id'],
    submit: AdminProductSubmit,
  ): Promise<Product> {
    try {
      const imageUrl = await resolveProductImageUrl(submit.imageAsset, submit.data.imageUrl);
      if (!imageUrl) {
        throw new Error('Selecione uma imagem do produto.');
      }

      const input = adminFormToPartialInput(submit.data, imageUrl);

      if (USE_MOCK) {
        return useProductCatalogStore.getState().updateProduct(productId, input);
      }

      const response = await apiClient.put<Product>(
        API_ENDPOINTS.products.byId(productId),
        input,
      );
      return response.data;
    } catch (error) {
      throwServiceError(error);
    }
  },
};
