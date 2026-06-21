import { z } from 'zod';

import { addressSchema } from '@/src/validation/addressSchema';

function applyPasswordRefine<T extends {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}>(data: T, ctx: z.RefinementCtx) {
  const changingPassword =
    data.currentPassword.length > 0 ||
    data.newPassword.length > 0 ||
    data.confirmPassword.length > 0;

  if (!changingPassword) return;

  if (!data.currentPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Informe a senha atual',
      path: ['currentPassword'],
    });
  }
  if (data.newPassword.length < 8) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'A nova senha deve ter pelo menos 8 caracteres',
      path: ['newPassword'],
    });
  }
  if (data.newPassword !== data.confirmPassword) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    });
  }
}

const profileBaseSchema = z.object({
  name: z.string().min(2, 'Informe seu nome'),
  email: z.string().min(1, 'Informe seu e-mail').email('E-mail inválido'),
  currentPassword: z.string(),
  newPassword: z.string(),
  confirmPassword: z.string(),
});

export const adminProfileSettingsSchema = profileBaseSchema.superRefine(applyPasswordRefine);

export const profileSettingsSchema = addressSchema
  .extend(profileBaseSchema.shape)
  .superRefine(applyPasswordRefine);

export type AdminProfileSettingsFormData = z.infer<typeof adminProfileSettingsSchema>;
export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;
