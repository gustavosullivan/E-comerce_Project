import { z } from 'zod';

import { addressSchema } from '@/src/validation/addressSchema';

export const profileSettingsSchema = addressSchema
  .extend({
    name: z.string().min(2, 'Informe seu nome'),
    currentPassword: z.string(),
    newPassword: z.string(),
    confirmPassword: z.string(),
  })
  .superRefine((data, ctx) => {
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
  });

export type ProfileSettingsFormData = z.infer<typeof profileSettingsSchema>;
