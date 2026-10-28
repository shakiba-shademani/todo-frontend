'use client';

import { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import { Logo } from '@/components/app-logo';
import { ROUTES } from '@/constants/routes';
import { useGetCurrentUser } from '@/hooks/apis/users';

export default function SplashPage() {
  const router = useRouter();
  const { data: user, isLoading } = useGetCurrentUser();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), 1600);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!ready || isLoading) return;
    router.replace(user ? ROUTES.today : ROUTES.login);
  }, [ready, isLoading, user, router]);

  return (
    <div className='flex min-h-dvh flex-col items-center justify-center bg-background'>
      <div className='animate-pulse'>
        <Logo size={96} withWordmark />
      </div>

      <p className='mt-3 text-sm text-muted'>Your day, checked off.</p>
    </div>
  );
}
