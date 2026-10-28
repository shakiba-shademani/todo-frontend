'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { getRefreshToken } from '@/hooks/apis/api-config';

import { changePassword, getCurrentUser, updateProfile, uploadAvatar } from './service';
import type { ChangePasswordRequest, PublicUser, UpdateProfileRequest } from './types';

export const userKeys = {
  all: ['users'] as const,
  me: ['users', 'me'] as const,
};

export function useGetCurrentUser() {
  return useQuery<PublicUser, Error>({
    queryKey: userKeys.me,
    queryFn: getCurrentUser,
    enabled: typeof window !== 'undefined' && Boolean(getRefreshToken()),
    retry: false,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProfileRequest) => updateProfile(payload),
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me, user);
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => changePassword(payload),
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (file: File) => uploadAvatar(file),
    onSuccess: (user) => {
      queryClient.setQueryData(userKeys.me, user);
    },
  });
}
