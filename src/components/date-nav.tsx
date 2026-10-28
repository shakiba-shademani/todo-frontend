'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { formatLongDate, shiftISODate, todayISO } from '@/utils/date';

type DateNavProps = {
  value: string;
  onChange: (next: string) => void;
};

export function DateNav({ value, onChange }: DateNavProps) {
  const isToday = value === todayISO();

  return (
    <div className='rounded-2xl border border-line bg-card p-3 shadow-sm'>
      <div className='flex items-center gap-2'>
        <button
          type='button'
          aria-label='Previous day'
          onClick={() => onChange(shiftISODate(value, -1))}
          className='flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-background'
        >
          <ChevronLeft size={20} />
        </button>

        <label className='relative flex min-w-0 flex-1 cursor-pointer flex-col items-center py-1'>
          <span className='truncate text-sm font-semibold'>{formatLongDate(value)}</span>

          <span className='text-xs text-muted'>{isToday ? 'Today' : value}</span>

          <input
            type='date'
            value={value}
            onChange={(event) => onChange(event.target.value)}
            className='absolute inset-0 cursor-pointer opacity-0'
          />
        </label>

        <button
          type='button'
          aria-label='Next day'
          onClick={() => onChange(shiftISODate(value, 1))}
          className='flex h-10 w-10 items-center justify-center rounded-xl text-foreground hover:bg-background'
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {!isToday ? (
        <button
          type='button'
          onClick={() => onChange(todayISO())}
          className='mt-2 w-full text-center text-xs font-medium text-primary'
        >
          Jump to today
        </button>
      ) : null}
    </div>
  );
}
