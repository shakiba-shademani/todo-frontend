'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { setTokens } from '@/hooks/apis/api-config';
import { taskKeys } from '@/hooks/apis/tasks';
import { userKeys } from '@/hooks/apis/users';

import { login, logout, register } from './service';
import type { LoginRequest, RegisterRequest } from './types';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginRequest) => login(payload),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(userKeys.me, data.user);
    },
  });
}

export function useRegister() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: RegisterRequest) => register(payload),
    onSuccess: (data) => {
      setTokens(data.accessToken, data.refreshToken);
      queryClient.setQueryData(userKeys.me, data.user);
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.removeQueries({ queryKey: userKeys.all });
      queryClient.removeQueries({ queryKey: taskKeys.all });
    },
  });
}
