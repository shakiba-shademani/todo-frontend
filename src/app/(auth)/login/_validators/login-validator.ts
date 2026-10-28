import { z } from 'zod';

export const loginFormValidator = z.object({
  username: z.string().min(3, 'At least 3 characters').max(30),
  password: z.string().min(8, 'At least 8 characters'),
});

export type LoginFormValues = z.infer<typeof loginFormValidator>;
