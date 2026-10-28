'use client';

import { useEffect, useState, useSyncExternalStore } from 'react';

import { zodResolver } from '@hookform/resolvers/zod';
import { Camera, Moon, Sun } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useForm } from 'react-hook-form';

import { ROUTES } from '@/constants/routes';
import { useLogout } from '@/hooks/apis/auth';
import {
  useChangePassword,
  useGetCurrentUser,
  useUpdateProfile,
  useUploadAvatar,
} from '@/hooks/apis/users';

import {
  nameSchema,
  passwordSchema,
  type NameFormValues,
  type PasswordFormValues,
} from '../_validators/profile-validator';

function subscribeToClient() {
  return () => undefined;
}

export default function ProfilePage() {
  const { data: user } = useGetCurrentUser();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const isClient = useSyncExternalStore(subscribeToClient, () => true, () => false);
  const logoutMutation = useLogout();
  const updateProfileMutation = useUpdateProfile();
  const changePasswordMutation = useChangePassword();
  const uploadAvatarMutation = useUploadAvatar();
  const [avatarError, setAvatarError] = useState('');
  const [nameMessage, setNameMessage] = useState('');
  const [passwordMessage, setPasswordMessage] = useState('');

  const nameForm = useForm<NameFormValues>({
    resolver: zodResolver(nameSchema),
    defaultValues: { displayName: user?.displayName ?? '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

  useEffect(() => {
    if (user?.displayName) {
      nameForm.reset({ displayName: user.displayName });
    }
  }, [user?.displayName, nameForm]);

  async function onSaveName(values: NameFormValues) {
    setNameMessage('');

    try {
      await updateProfileMutation.mutateAsync({ displayName: values.displayName.trim() });
      setNameMessage('Name saved.');
    } catch (err) {
      setNameMessage(err instanceof Error ? err.message : 'Could not save name');
    }
  }

  async function onChangePassword(values: PasswordFormValues) {
    setPasswordMessage('');

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      passwordForm.reset();
      setPasswordMessage('Password updated.');
    } catch (err) {
      setPasswordMessage(err instanceof Error ? err.message : 'Could not update password');
    }
  }

  async function onAvatar(file?: File) {
    if (!file) return;
    setAvatarError('');

    try {
      await uploadAvatarMutation.mutateAsync(file);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Could not upload photo');
    }
  }

  async function onLogout() {
    await logoutMutation.mutateAsync();
    router.replace(ROUTES.login);
  }

  const dark = isClient && resolvedTheme === 'dark';

  return (
    <>
      <h1 className='text-xl font-semibold'>Profile</h1>

      <div className='mt-6 flex flex-col items-center'>
        <label className='relative cursor-pointer'>
          <div className='h-24 w-24 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700'>
            {user?.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.avatarUrl} alt='' className='h-full w-full object-cover' />
            ) : (
              <div className='flex h-full w-full items-center justify-center text-2xl font-semibold text-muted'>
                {user?.displayName?.[0]?.toUpperCase() ?? 'T'}
              </div>
            )}
          </div>

          <span className='absolute bottom-0 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white shadow'>
            <Camera size={14} />
          </span>

          <input
            type='file'
            accept='image/png,image/jpeg,image/webp,image/gif'
            className='hidden'
            onChange={(event) => onAvatar(event.target.files?.[0])}
          />
        </label>

        <p className='mt-3 text-sm text-muted'>@{user?.username}</p>

        {avatarError ? <p className='mt-2 text-sm text-red-500'>{avatarError}</p> : null}
      </div>

      <section className='mt-8 rounded-2xl border border-line bg-card p-4'>
        <h2 className='text-sm font-semibold'>Appearance</h2>

        <button
          type='button'
          onClick={() => setTheme(dark ? 'light' : 'dark')}
          className='mt-3 flex h-11 w-full items-center justify-between rounded-xl bg-background px-3 text-sm'
        >
          <span>{dark ? 'Dark mode' : 'Light mode'}</span>

          {dark ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </section>

      <form
        className='mt-4 space-y-3 rounded-2xl border border-line bg-card p-4'
        onSubmit={nameForm.handleSubmit(onSaveName)}
      >
        <h2 className='text-sm font-semibold'>Your name</h2>

        <input
          className='h-11 w-full rounded-xl border border-line bg-background px-3 outline-none ring-primary focus:ring-2'
          {...nameForm.register('displayName')}
        />

        {nameForm.formState.errors.displayName ? (
          <p className='text-xs text-red-500'>{nameForm.formState.errors.displayName.message}</p>
        ) : null}

        {nameMessage ? <p className='text-xs text-muted'>{nameMessage}</p> : null}

        <button
          type='submit'
          disabled={nameForm.formState.isSubmitting || updateProfileMutation.isPending}
          className='h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white'
        >
          Save name
        </button>
      </form>

      <form
        className='mt-4 space-y-3 rounded-2xl border border-line bg-card p-4'
        onSubmit={passwordForm.handleSubmit(onChangePassword)}
      >
        <h2 className='text-sm font-semibold'>Change password</h2>

        <input
          type='password'
          placeholder='Current password'
          autoComplete='current-password'
          className='h-11 w-full rounded-xl border border-line bg-background px-3 outline-none ring-primary focus:ring-2'
          {...passwordForm.register('currentPassword')}
        />

        <input
          type='password'
          placeholder='New password'
          autoComplete='new-password'
          className='h-11 w-full rounded-xl border border-line bg-background px-3 outline-none ring-primary focus:ring-2'
          {...passwordForm.register('newPassword')}
        />

        <input
          type='password'
          placeholder='Confirm new password'
          autoComplete='new-password'
          className='h-11 w-full rounded-xl border border-line bg-background px-3 outline-none ring-primary focus:ring-2'
          {...passwordForm.register('confirmPassword')}
        />

        {passwordForm.formState.errors.currentPassword ? (
          <p className='text-xs text-red-500'>
            {passwordForm.formState.errors.currentPassword.message}
          </p>
        ) : null}

        {passwordForm.formState.errors.newPassword ? (
          <p className='text-xs text-red-500'>
            {passwordForm.formState.errors.newPassword.message}
          </p>
        ) : null}

        {passwordForm.formState.errors.confirmPassword ? (
          <p className='text-xs text-red-500'>
            {passwordForm.formState.errors.confirmPassword.message}
          </p>
        ) : null}

        {passwordMessage ? <p className='text-xs text-muted'>{passwordMessage}</p> : null}

        <button
          type='submit'
          disabled={passwordForm.formState.isSubmitting || changePasswordMutation.isPending}
          className='h-11 w-full rounded-xl bg-primary text-sm font-semibold text-white'
        >
          Update password
        </button>
      </form>

      <button
        type='button'
        onClick={onLogout}
        className='mt-6 h-12 w-full rounded-xl border border-red-200 text-sm font-semibold text-red-600 dark:border-red-900'
      >
        Log out
      </button>
    </>
  );
}
