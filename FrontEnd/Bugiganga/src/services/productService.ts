import { API_ENDPOINTS } from '@/src/config/api';
import { MOCK_CATEGORIES } from '@/src/mocks/categories';
import { apiClient, throwServiceError } from '@/src/services/api/client';
import { uploadProductImage } from '@/src/services/cloudinaryService';
import type { User } from '@/src/types/auth';
import type { Product, ProductInput } from '@/src/types/product';
import { parseProductForm, type ProductFormData } from '@/src/validation/productSchema';
import type { ImagePickerAsset } from 'expo-image-picker';

const PRODUCT_CURRENCY = 'BRL' as const;

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
  imageURL?: string;
  categoryId?: number;
  sellerId?: number;
}

interface ApiProductRequest {
  description?: string;
  brand?: string;
  model?: string;
  currency?: string;
  price?: number;
  stock?: number;
  imageURL?: string;
  categoryId?: number;
}

function resolveCategoryName(categoryId: number): string {
  return MOCK_CATEGORIES.find((category) => category.id === categoryId)?.name ?? 'Outros';
}

function mapApiProduct(product: ApiProduct): Product {
  const categoryId = product.categoryId ?? 1;

  return {
    id: product.id,
    name: product.description,
    description: product.description,
    brand: product.brand,
    model: product.model,
    price: (product.convertedPrice != null && product.convertedPrice >= 0) ? product.convertedPrice : product.price,
    stock: product.stock,
    imageUrl: product.imageURL || `https://picsum.photos/seed/api-product-${product.id}/600/600`,
    categoryId,
    categoryName: resolveCategoryName(categoryId),
    userId: product.sellerId ?? 1,
    isFeatured: product.id <= 4,
    isNew: product.id > 8,
    isBestseller: product.stock >= 15,
  };
}

function productInputToApiRequest(data: Partial<ProductInput>): ApiProductRequest {
  return {
    description: data.description,
    brand: data.brand,
    model: data.model,
    currency: PRODUCT_CURRENCY,
    price: data.price,
    stock: data.stock,
    imageURL: data.imageUrl,
    categoryId: data.categoryId,
  };
}


function formDataToProductInput(data: ProductFormData, userId: User['id']): ProductInput {
  return {
    name: data.description,
    description: data.description,
    brand: data.brand,
    model: data.model,
    price: Number(String(data.price).replace(',', '.')),
    stock: Number(data.stock),
    imageUrl: data.imageUrl ?? `https://picsum.photos/seed/${Date.now()}/400/400`,
    categoryId: data.categoryId,
    userId,
  };
}

function formDataToPartialInput(data: Partial<ProductFormData>): Partial<ProductInput> {
  const partial: Partial<ProductInput> = {};

  if (data.description != null) { partial.name = data.description; partial.description = data.description; }
  if (data.brand != null) partial.brand = data.brand;
  if (data.model != null) partial.model = data.model;
  if (data.price != null) partial.price = Number(String(data.price).replace(',', '.'));
  if (data.stock != null) partial.stock = Number(data.stock);
  if (data.imageUrl != null) partial.imageUrl = data.imageUrl;
  if (data.categoryId != null) partial.categoryId = data.categoryId;

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
    name: data.description,
    description: data.description,
    brand: data.brand,
    model: data.model,
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

  if (data.description != null) { partial.name = data.description; partial.description = data.description; }
  if (data.brand != null) partial.brand = data.brand;
  if (data.model != null) partial.model = data.model;
  if (data.price != null) partial.price = data.price;
  if (data.stock != null) partial.stock = data.stock;
  if (imageUrl != null) partial.imageUrl = imageUrl;
  if (data.categoryId != null) partial.categoryId = data.categoryId;

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

async function fetchAllProductPages(targetCurrency: string): Promise<ApiProduct[]> {
  const products: ApiProduct[] = [];
  let page = 0;
  const size = 50;

  while (true) {
    const response = await apiClient.get<{ content: ApiProduct[]; last: boolean } | ApiProduct[]>(
      API_ENDPOINTS.products.list,
      {
        params: { targetCurrency, page, size },
      },
    );

    if (Array.isArray(response.data)) {
      return response.data.map((product) => product);
    }

    const pageData = response.data.content ?? [];
    products.push(...pageData);

    if (response.data.last || pageData.length === 0) {
      break;
    }

    page += 1;
  }

  return products;
}

export const productService = {
  async list(targetCurrency = 'BRL'): Promise<Product[]> {
    try {
      const data = await fetchAllProductPages(targetCurrency);
      return data.map(mapApiProduct);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async getById(id: number, targetCurrency = 'BRL'): Promise<Product> {
    try {
      const response = await apiClient.get<ApiProduct>(API_ENDPOINTS.products.byId(id), {
        params: { targetCurrency },
      });
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async search(query: string, targetCurrency = 'BRL'): Promise<Product[]> {
    try {
      const normalizedQuery = query.trim().toLowerCase();
      const data = await fetchAllProductPages(targetCurrency);
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
        API_ENDPOINTS.products.create,
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
        API_ENDPOINTS.products.wsById(id),
        productInputToApiRequest(data),
      );
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async remove(id: number): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.products.wsById(id));
    } catch (error) {
      throwServiceError(error);
    }
  },

  async createProduct(userId: User['id'], productData: ProductFormData): Promise<Product> {
    try {
      const input = formDataToProductInput(productData, userId);
      const response = await apiClient.post<ApiProduct>(
        API_ENDPOINTS.products.create,
        productInputToApiRequest(input),
      );
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async getAdminProducts(adminId: User['id'], targetCurrency = 'BRL'): Promise<Product[]> {
    try {
      const data = await fetchAllProductPages(targetCurrency);
      return data.map(mapApiProduct);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async updateProduct(productId: Product['id'], updatedData: Partial<ProductFormData>): Promise<Product> {
    try {
      const input = formDataToPartialInput(updatedData);
      const response = await apiClient.put<ApiProduct>(
        API_ENDPOINTS.products.wsById(productId),
        productInputToApiRequest(input),
      );
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },

  async deleteProduct(productId: Product['id']): Promise<void> {
    try {
      await apiClient.delete(API_ENDPOINTS.products.wsById(productId));
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
        API_ENDPOINTS.products.create,
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
        API_ENDPOINTS.products.wsById(productId),
        productInputToApiRequest(input),
      );
      return mapApiProduct(response.data);
    } catch (error) {
      throwServiceError(error);
    }
  },
};