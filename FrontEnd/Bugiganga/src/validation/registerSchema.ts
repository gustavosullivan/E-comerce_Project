import { z } from 'zod';

export const registerSchema = z
  .object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
    password: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirme sua senha'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type RegisterFormData = z.infer<typeof registerSchema>;
