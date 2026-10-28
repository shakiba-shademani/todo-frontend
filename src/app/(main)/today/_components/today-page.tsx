'use client';

import { useState } from 'react';

import { DateNav } from '@/components/date-nav';
import { TaskItem } from '@/components/task-item';
import { useDeleteTask, useGetTasks, useUpdateTask } from '@/hooks/apis/tasks';
import type { Task } from '@/hooks/apis/tasks/types';
import { useGetCurrentUser } from '@/hooks/apis/users';
import { greeting, todayISO } from '@/utils/date';

export default function TodayPage() {
  const { data: user } = useGetCurrentUser();
  const [date, setDate] = useState(todayISO);
  const tasksQuery = useGetTasks(date);
  const toggleMutation = useUpdateTask(date);
  const deleteMutation = useDeleteTask(date);

  const tasks = tasksQuery.data ?? [];
  const remaining = tasks.filter((task) => !task.done).length;

  return (
    <>
      <header className='mb-5 flex items-center gap-3'>
        <div className='h-12 w-12 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700'>
          {user?.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.avatarUrl} alt='' className='h-full w-full object-cover' />
          ) : (
            <div className='flex h-full w-full items-center justify-center text-sm font-semibold text-muted'>
              {user?.displayName?.[0]?.toUpperCase() ?? 'T'}
            </div>
          )}
        </div>

        <div className='min-w-0'>
          <p className='text-sm text-muted'>{greeting()}</p>

          <h1 className='truncate text-xl font-semibold'>{user?.displayName}</h1>
        </div>
      </header>

      <DateNav value={date} onChange={setDate} />

      <div className='mt-5 flex items-end justify-between'>
        <h2 className='text-base font-semibold'>Tasks</h2>

        <p className='text-xs text-muted'>
          {tasks.length === 0 ? 'None yet' : `${remaining} left`}
        </p>
      </div>

      {tasksQuery.isLoading ? (
        <p className='mt-6 text-center text-sm text-muted'>Loading tasks...</p>
      ) : tasksQuery.isError ? (
        <p className='mt-6 text-center text-sm text-red-500'>
          {tasksQuery.error instanceof Error ? tasksQuery.error.message : 'Could not load tasks'}
        </p>
      ) : tasks.length === 0 ? (
        <div className='mt-8 rounded-2xl border border-dashed border-line px-4 py-10 text-center'>
          <p className='font-medium'>No tasks for this day</p>

          <p className='mt-1 text-sm text-muted'>Add one from the Add tab.</p>
        </div>
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
              busy={toggleMutation.isPending || deleteMutation.isPending}
            />
          ))}
        </ul>
      )}
    </>
  );
}
