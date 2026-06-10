import { z } from 'zod';

function isValidLogin(value: string): boolean {
  return z.string().email().safeParse(value).success || /^[a-zA-Z0-9._-]{3,30}$/.test(value);
}

export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Informe seu login')
    .refine(isValidLogin, 'Informe um e-mail ou usuário válido'),
  password: z.string().min(1, 'Informe sua senha'),
});

export type LoginFormData = z.infer<typeof loginSchema>;
