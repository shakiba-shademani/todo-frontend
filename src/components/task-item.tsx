'use client';

import { Check, Trash2 } from 'lucide-react';

import type { Task } from '@/hooks/apis/tasks/types';

type TaskItemProps = {
  task: Task;
  onToggle: (task: Task) => void;
  onDelete: (task: Task) => void;
  busy?: boolean;
};

export function TaskItem({ task, onToggle, onDelete, busy }: TaskItemProps) {
  return (
    <li className='flex items-center gap-3 rounded-2xl border border-line bg-card px-3 py-3 shadow-sm'>
      <button
        type='button'
        disabled={busy}
        onClick={() => onToggle(task)}
        aria-label={task.done ? 'Mark as not done' : 'Mark as done'}
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
          task.done
            ? 'border-primary bg-primary text-white'
            : 'border-slate-300 bg-transparent text-transparent dark:border-slate-500'
        }`}
      >
        <Check size={16} />
      </button>

      <p
        className={`min-w-0 flex-1 text-sm ${task.done ? 'text-muted line-through' : 'text-foreground'}`}
      >
        {task.title}
      </p>

      <button
        type='button'
        disabled={busy}
        aria-label='Delete task'
        onClick={() => onDelete(task)}
        className='rounded-lg p-2 text-muted hover:bg-background hover:text-red-500'
      >
        <Trash2 size={16} />
      </button>
    </li>
  );
}
