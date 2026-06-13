import { z } from 'zod';

export const productFormSchema = z.object({
  name: z.string().min(2, 'Informe o nome do produto'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres'),
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
  imageUrl: z.string().min(1, 'Informe a URL da imagem'),
});

export type ProductFormData = z.infer<typeof productFormSchema>;

export function parseProductForm(data: ProductFormData) {
  return {
    name: data.name.trim(),
    description: data.description.trim(),
    price: Number(data.price.replace(',', '.')),
    categoryId: data.categoryId,
    stock: Number(data.stock),
    imageUrl: data.imageUrl.trim(),
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
    name: product.name,
    description: product.description,
    price: String(product.price),
    categoryId: product.categoryId,
    stock: String(product.stock),
    imageUrl: product.imageUrl,
  };
}
