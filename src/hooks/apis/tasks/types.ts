export type Task = {
  id: string;
  title: string;
  date: string;
  done: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskRequest = {
  title: string;
  date: string;
};

export type UpdateTaskRequest = {
  done?: boolean;
  title?: string;
};
