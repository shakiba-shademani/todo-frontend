'use client';

import { type ReactNode, useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { ROUTES } from '@/constants/routes';
import { useGetCurrentUser } from '@/hooks/apis/users';

export function AuthGuard({ children }: { children: ReactNode }) {
  const { data: user, isLoading } = useGetCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(ROUTES.login);
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return (
      <div className='flex min-h-dvh items-center justify-center'>
        <div className='h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent' />
      </div>
    );
  }

  return <>{children}</>;
}
