export type ProductInput = Omit<Product, 'id' | 'categoryName'>;

export type CategoryProductType = 'BOOK' | 'VINYL';

export interface Category {
  id: number;
  name: string;
  slug: string;
  productType: CategoryProductType;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  brand?: string;
  model?: string;
  price: number;
  imageUrl: string;
  stock: number;
  categoryId: number;
  categoryName: string;
  userId: number; // Added userId
  isNew?: boolean;
  isFeatured?: boolean;
  isBestseller?: boolean;
}
