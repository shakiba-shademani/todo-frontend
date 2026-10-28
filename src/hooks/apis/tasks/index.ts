'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createTask, deleteTask, getTasks, updateTask } from './service';
import type { CreateTaskRequest, Task, UpdateTaskRequest } from './types';

export const taskKeys = {
  all: ['tasks'] as const,
  list: (date: string) => ['tasks', 'list', date] as const,
};

export function useGetTasks(date: string) {
  return useQuery<Task[], Error>({
    queryKey: taskKeys.list(date),
    queryFn: () => getTasks(date),
  });
}

export function useCreateTask(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateTaskRequest) => createTask(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(date) });
    },
  });
}

export function useUpdateTask(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskRequest }) =>
      updateTask(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(date) });
    },
  });
}

export function useDeleteTask(date: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.list(date) });
    },
  });
}
