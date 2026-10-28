import { z } from 'zod';

export const registerFormValidator = z
  .object({
    username: z
      .string()
      .min(3, 'At least 3 characters')
      .max(30)
      .regex(/^[a-zA-Z0-9_]+$/, 'Letters, numbers, and underscores only'),
    displayName: z.string().max(50).optional(),
    password: z.string().min(8, 'At least 8 characters'),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type RegisterFormValues = z.infer<typeof registerFormValidator>;
