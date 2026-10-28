'use client';

import { useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

import { DateNav } from '@/components/date-nav';
import { TaskItem } from '@/components/task-item';
import { useCreateTask, useDeleteTask, useGetTasks, useUpdateTask } from '@/hooks/apis/tasks';
import type { Task } from '@/hooks/apis/tasks/types';
import { todayISO } from '@/utils/date';

import { addTaskValidator, type AddTaskFormValues } from '../_validators/add-task-validator';

export default function AddPage() {
  const [date, setDate] = useState(todayISO);
  const form = useForm<AddTaskFormValues>({ resolver: zodResolver(addTaskValidator) });
  const tasksQuery = useGetTasks(date);
  const createMutation = useCreateTask(date);
  const toggleMutation = useUpdateTask(date);
  const deleteMutation = useDeleteTask(date);
  const tasks = tasksQuery.data ?? [];

  return (
    <>
      <h1 className='text-xl font-semibold'>Add a task</h1>

      <p className='mt-1 text-sm text-muted'>Choose a date, then add or delete tasks.</p>

      <div className='mt-4'>
        <DateNav value={date} onChange={setDate} />
      </div>

      <form
        className='mt-4 space-y-3'
        onSubmit={form.handleSubmit((values) =>
          createMutation.mutate(
            { title: values.title.trim(), date },
            {
              onSuccess: () => form.reset({ title: '' }),
            }
          )
        )}
      >
        <input
          placeholder='What do you need to do?'
          className='h-12 w-full rounded-xl border border-line bg-card px-3 outline-none ring-primary focus:ring-2'
          {...form.register('title')}
        />

        {form.formState.errors.title ? (
          <p className='text-xs text-red-500'>{form.formState.errors.title.message}</p>
        ) : null}

        {createMutation.isError ? (
          <p className='text-sm text-red-500'>
            {createMutation.error instanceof Error
              ? createMutation.error.message
              : 'Could not add task'}
          </p>
        ) : null}

        <button
          type='submit'
          disabled={createMutation.isPending}
          className='h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-70'
        >
          {createMutation.isPending ? 'Adding...' : 'Add task'}
        </button>
      </form>

      <h2 className='mt-8 text-base font-semibold'>Tasks for this day</h2>

      {tasksQuery.isLoading ? (
        <p className='mt-4 text-sm text-muted'>Loading...</p>
      ) : tasks.length === 0 ? (
        <p className='mt-4 text-sm text-muted'>Nothing here yet.</p>
      ) : (
        <ul className='mt-3 space-y-2'>
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={(item: Task) =>
                toggleMutation.mutate({ id: item.id, payload: { done: !item.done } })
              }
              onDelete={(item: Task) => deleteMutation.mutate(item.id)}
              busy={deleteMutation.isPending || toggleMutation.isPending}
            />
          ))}
        </ul>
      )}
    </>
  );
}
