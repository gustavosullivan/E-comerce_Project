import { API_ENDPOINTS } from '@/src/config/api';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import type { ProductFormData } from '@/src/schemas/productSchema';
import { apiClient, throwServiceError } from '@/src/services/api/client';
import { uploadProductImage } from '@/src/services/cloudinaryService';
import type { User } from '@/src/types/auth';
import type { Product, ProductInput } from '@/src/types/product';
import type { ImagePickerAsset } from 'expo-image-picker';
import type { parseProductForm } from '@/src/validation/productSchema';

interface ApiProduct {
  id: number;
  description: string;
  brand: string;
  model: string;
  currency: string;
  price: number;
  stock: number;
  convertedPrice?: number;
  requestCurrency?: string;
}

interface ApiProductRequest {
  name?: string;
  description?: string;
  brand?: string;
  model?: string;
  currency?: string;
  price?: number;
  stock?: number;
}

function mapApiProduct(product: ApiProduct): Product {
  const displayName = [product.brand, product.model].filter(Boolean).join(' ').trim();

  return {
    id: product.id,
    name: displayName || product.description,
    description: product.description,
    price: (product.convertedPrice != null && product.convertedPrice >= 0) ? product.convertedPrice : product.price,
    stock: product.stock,
    imageUrl: `https://picsum.photos/seed/api-product-${product.id}/600/600`,
    categoryId: 1,
    categoryName: 'Celulares',
    userId: 1,
    isFeatured: product.id <= 4,
    isNew: product.id > 8,
    isBestseller: product.stock >= 15,
  };
}

function productInputToApiRequest(data: Partial<ProductInput>): ApiProductRequest {
  return {
    name: data.name,
    description: data.description ?? data.name,
    brand: data.name,
    model: data.name,
    currency: 'BRL',
    price: data.price,
    stock: data.stock,
  };
}

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
      const response = await apiClient.get<any>(API_ENDPOINTS.products.list, {
        params: { targetCurrency: 'BRL' },
      });
      const data: ApiProduct[] = Array.isArray(response.data) ? response.data : (response.data?.content ?? []);
      return data.map(mapApiProduct);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async getById(id: number): Promise<Product> {
    try {
      const response = await apiClient.get<ApiProduct>(API_ENDPOINTS.products.byId(id), {
        params: { targetCurrency: 'BRL' },
      });
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async search(query: string): Promise<Product[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.products.list, {
        params: { targetCurrency: 'BRL' },
      });
      const normalizedQuery = query.trim().toLowerCase();
      const data: ApiProduct[] = Array.isArray(response.data) ? response.data : (response.data?.content ?? []);
      return data
        .map(mapApiProduct)
        .filter((product) =>
          [product.name, product.description, product.categoryName]
            .join(' ')
            .toLowerCase()
            .includes(normalizedQuery),
        );
    } catch (error) {
      throwServiceError(error);
    }
  },

  async create(data: ProductInput): Promise<Product> {
    try {
      const response = await apiClient.post<ApiProduct>(
        API_ENDPOINTS.products.list,
        productInputToApiRequest(data),
      );
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async update(id: number, data: Partial<ProductInput>): Promise<Product> {
    try {
      const response = await apiClient.put<ApiProduct>(
        API_ENDPOINTS.products.byId(id),
        productInputToApiRequest(data),
      );
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.products.byId(id));
    } catch (error) {
      throwServiceError(error);
    }
  },

  async createProduct(userId: User['id'], productData: ProductFormData): Promise<Product> {
    try {
      const input = formDataToProductInput(productData, userId);
      const response = await apiClient.post<ApiProduct>(
        API_ENDPOINTS.products.list,
        productInputToApiRequest(input),
      );
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async getAdminProducts(adminId: User['id']): Promise<Product[]> {
    try {
      const response = await apiClient.get<any>(API_ENDPOINTS.products.list, {
        params: { targetCurrency: 'BRL' },
      });
      const data: ApiProduct[] = Array.isArray(response.data) ? response.data : (response.data?.content ?? []);
      return data.map(mapApiProduct).filter((product) => product.userId === adminId);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async updateProduct(productId: Product['id'], updatedData: Partial<ProductFormData>): Promise<Product> {
    try {
      const input = formDataToPartialInput(updatedData);
      const response = await apiClient.put<ApiProduct>(
        API_ENDPOINTS.products.byId(productId),
        productInputToApiRequest(input),
      );
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async deleteProduct(productId: Product['id']): Promise<void> {
    try {
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
      const response = await apiClient.post<ApiProduct>(
        API_ENDPOINTS.products.list,
        productInputToApiRequest(input),
      );
      return mapApiProduct(response.data);
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
      const response = await apiClient.put<ApiProduct>(
        API_ENDPOINTS.products.byId(productId),
        productInputToApiRequest(input),
      );
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },
};
