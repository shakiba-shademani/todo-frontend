import { z } from 'zod';

export const addTaskValidator = z.object({
  title: z.string().min(1, 'Please enter a task').max(200),
});

export type AddTaskFormValues = z.infer<typeof addTaskValidator>;
