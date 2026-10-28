'use client';

import { useEffect, useState } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { Logo } from '@/components/app-logo';
import { ROUTES } from '@/constants/routes';
import { useRegister } from '@/hooks/apis/auth';
import { useGetCurrentUser } from '@/hooks/apis/users';

import { registerFormValidator, type RegisterFormValues } from '../_validators/register-validator';

export default function RegisterPage() {
  const router = useRouter();
  const { data: user, isLoading } = useGetCurrentUser();
  const registerMutation = useRegister();
  const [error, setError] = useState('');
  const form = useForm<RegisterFormValues>({ resolver: zodResolver(registerFormValidator) });

  useEffect(() => {
    if (!isLoading && user) router.replace(ROUTES.today);
  }, [isLoading, user, router]);

  async function onSubmit(values: RegisterFormValues) {
    setError('');

    try {
      await registerMutation.mutateAsync({
        username: values.username,
        password: values.password,
        displayName: values.displayName || undefined,
      });
      router.replace(ROUTES.today);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create account');
    }
  }

  return (
    <div className='mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10'>
      <Logo size={64} withWordmark />

      <h1 className='mt-8 text-xl font-semibold'>Create account</h1>

      <p className='mt-1 text-sm text-muted'>Pick a username and password to get started.</p>

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
          <label className='mb-1 block text-sm font-medium' htmlFor='displayName'>
            Name <span className='font-normal text-muted'>(optional)</span>
          </label>

          <input
            id='displayName'
            autoComplete='name'
            className='h-12 w-full rounded-xl border border-line bg-card px-3 outline-none ring-primary focus:ring-2'
            {...form.register('displayName')}
          />
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium' htmlFor='password'>
            Password
          </label>

          <input
            id='password'
            type='password'
            autoComplete='new-password'
            className='h-12 w-full rounded-xl border border-line bg-card px-3 outline-none ring-primary focus:ring-2'
            {...form.register('password')}
          />

          {form.formState.errors.password ? (
            <p className='mt-1 text-xs text-red-500'>{form.formState.errors.password.message}</p>
          ) : null}
        </div>

        <div>
          <label className='mb-1 block text-sm font-medium' htmlFor='confirmPassword'>
            Confirm password
          </label>

          <input
            id='confirmPassword'
            type='password'
            autoComplete='new-password'
            className='h-12 w-full rounded-xl border border-line bg-card px-3 outline-none ring-primary focus:ring-2'
            {...form.register('confirmPassword')}
          />

          {form.formState.errors.confirmPassword ? (
            <p className='mt-1 text-xs text-red-500'>
              {form.formState.errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        {error ? <p className='text-sm text-red-500'>{error}</p> : null}

        <button
          type='submit'
          disabled={form.formState.isSubmitting || registerMutation.isPending}
          className='h-12 w-full rounded-xl bg-primary text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-70'
        >
          {form.formState.isSubmitting || registerMutation.isPending
            ? 'Creating...'
            : 'Create account'}
        </button>
      </form>

      <p className='mt-6 text-center text-sm text-muted'>
        Already have an account?{' '}

        <Link href={ROUTES.login} className='font-medium text-primary'>
          Log in
        </Link>
      </p>
    </div>
  );
}
