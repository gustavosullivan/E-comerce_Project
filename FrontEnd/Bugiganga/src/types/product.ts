export type ProductInput = Omit<Product, 'id' | 'categoryName'>;

export interface Category {
  id: number;
  name: string;
  slug: string;
}

export interface Product {
  id: number;
  name: string;
  description: string;
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
