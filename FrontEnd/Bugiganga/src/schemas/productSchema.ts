import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(3, 'O nome deve ter pelo menos 3 caracteres.'),
  description: z.string().min(10, 'A descrição deve ter pelo menos 10 caracteres.').optional(),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive('O preço deve ser um valor positivo.'),
  ),
  stock: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().int().min(0, 'O estoque não pode ser negativo.'),
  ),
  imageUrl: z.string().url('A URL da imagem deve ser válida.').optional(),
  category: z.string().min(3, 'A categoria deve ter pelo menos 3 caracteres.'),
});

export type ProductFormData = z.infer<typeof productSchema>;