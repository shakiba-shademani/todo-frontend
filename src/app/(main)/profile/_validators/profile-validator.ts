import { z } from 'zod';

export const nameSchema = z.object({
  displayName: z.string().min(1, 'Name is required').max(50),
});

export const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, 'At least 8 characters'),
    newPassword: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type NameFormValues = z.infer<typeof nameSchema>;
export type PasswordFormValues = z.infer<typeof passwordSchema>;
