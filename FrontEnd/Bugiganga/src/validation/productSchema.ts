import { z } from 'zod';

export const PRODUCT_TYPES = ['BOOK', 'VINYL'] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const PRODUCT_TYPE_LABELS: Record<ProductType, {
  label: string;
  description: string;
  brand: string;
  model: string;
}> = {
  BOOK: {
    label: 'Livro',
    description: 'Título do livro',
    brand: 'Editora',
    model: 'Autor',
  },
  VINYL: {
    label: 'Disco de Vinil',
    description: 'Nome do álbum',
    brand: 'Gravadora',
    model: 'Artista',
  },
};

export const productFormSchema = z.object({
  productType: z.enum(PRODUCT_TYPES, { required_error: 'Selecione o tipo do produto' }),
  description: z.string().min(2, 'Informe o título/nome do álbum'),
  brand: z.string().min(1, 'Informe a editora/gravadora'),
  model: z.string().min(1, 'Informe o autor/artista'),
  price: z
    .string()
    .min(1, 'Informe o preço')
    .refine((value) => !Number.isNaN(Number(value.replace(',', '.'))), 'Preço inválido')
    .refine((value) => Number(value.replace(',', '.')) > 0, 'O preço deve ser maior que zero'),
  categoryId: z.number({ required_error: 'Selecione uma categoria' }),
  stock: z
    .string()
    .min(1, 'Informe o estoque')
    .refine((value) => /^\d+$/.test(value), 'Estoque inválido'),
  imageUrl: z.string().optional(),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export function parseProductForm(data: ProductFormData) {
  return {
    productType: data.productType,
    description: data.description.trim(),
    brand: data.brand.trim(),
    model: data.model.trim(),
    price: Number(data.price.replace(',', '.')),
    categoryId: data.categoryId,
    stock: Number(data.stock),
    imageUrl: data.imageUrl?.trim() ?? '',
  };
}

export function productToFormValues(product: {
  name: string;
  description: string;
  price: number;
  categoryId: number;
  stock: number;
  imageUrl: string;
}): ProductFormData {
  return {
    productType: 'BOOK',
    description: product.description,
    brand: '',
    model: '',
    price: String(product.price),
    categoryId: product.categoryId,
    stock: String(product.stock),
    imageUrl: product.imageUrl,
  };
}
