import { z } from 'zod';

export const addressSchema = z.object({
  zipCode: z.string().min(8, 'Informe o CEP'),
  street: z.string().min(3, 'Informe a rua'),
  number: z.string().min(1, 'Informe o número'),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, 'Informe o bairro'),
  city: z.string().min(2, 'Informe a cidade'),
  state: z.string().trim().length(2, 'Informe a UF com 2 letras'),
});

export type AddressFormData = z.infer<typeof addressSchema>;
