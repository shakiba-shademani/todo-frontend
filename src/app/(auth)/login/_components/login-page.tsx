'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Logo } from '@/components/app-logo';
import { ROUTES } from '@/constants/routes';
import { useLogin } from '@/hooks/apis/auth';
import { useGetCurrentUser } from '@/hooks/apis/users';

import { loginFormValidator, type LoginFormValues } from '../_validators/login-validator';

export default function LoginPage() {
  const router = useRouter();
  const { data: user, isLoading } = useGetCurrentUser();
  const loginMutation = useLogin();
  const [error, setError] = useState('');
  const form = useForm<LoginFormValues>({ resolver: zodResolver(loginFormValidator) });

  useEffect(() => {
    if (!isLoading && user) router.replace(ROUTES.today);
  }, [isLoading, user, router]);

  async function onSubmit(values: LoginFormValues) {
    setError('');

    try {
      await loginMutation.mutateAsync(values);
      router.replace(ROUTES.today);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not log in');
    }
  }

  return (
    <div className='mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10'>
      <Logo size={64} withWordmark />

      <h1 className='mt-8 text-xl font-semibold'>Welcome back</h1>

      <p className='mt-1 text-sm text-muted'>Log in to see today&apos;s tasks.</p>

      <form className='mt-6 space-y-4' onSubmit={form.handleSubmit(onSubmit)}>
        <div>
          <label className='mb-1 block text-sm font-medium' htmlFor='username'>
            Username
          </label>

          <input
            id='username'
            autoComplete='username'
            className='h-12 w-full rounded-xl border border-line bg-card px-3 outline-none ring-primary focus:ring-2'
            {...form.register('username')}
          />

          {form.formState.errors.username ? (
            <p className='mt-1 text-xs text-red-500'>{form.formState.errors.username.message}</p>
          ) : null}
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium' htmlFor='password'>
            Password
          </label>

          <input
            id='password'
            type='password'
            autoComplete='current-password'
            className='h-12 w-full rounded-xl border border-line bg-card px-3 outline-none ring-primary focus:ring-2'
            {...form.register('password')}
          />

          {form.formState.errors.password ? (
            <p className='mt-1 text-xs text-red-500'>{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        {error ? <p className='text-sm text-red-500'>{error}</p> : null}

        <button
          type='submit'
          disabled={form.formState.isSubmitting || loginMutation.isPending}
          className='h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-70'
        >
          {form.formState.isSubmitting || loginMutation.isPending ? 'Logging in...' : 'Log in'}
        </button>
      </form>

      <p className='mt-6 text-center text-sm text-muted'>
        New here?{' '}

        <Link href={ROUTES.register} className='font-medium text-primary'>
          Create an account
        </Link>
      </p>
    </div>
  );
}
