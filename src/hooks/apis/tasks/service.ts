import { axiosInstance } from '@/hooks/apis/api-config';

import type { CreateTaskRequest, Task, UpdateTaskRequest } from './types';

const ENDPOINT = '/tasks';

export async function getTasks(date: string) {
  const { data } = await axiosInstance.get<Task[]>(ENDPOINT, { params: { date } });
  return data;
}

export async function createTask(payload: CreateTaskRequest) {
  const { data } = await axiosInstance.post<Task>(ENDPOINT, payload);
  return data;
}

export async function updateTask(id: string, payload: UpdateTaskRequest) {
  const { data } = await axiosInstance.patch<Task>(`${ENDPOINT}/${id}`, payload);
  return data;
}

export async function deleteTask(id: string) {
  await axiosInstance.delete(`${ENDPOINT}/${id}`);
}
