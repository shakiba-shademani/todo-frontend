import { axiosInstance } from '@/hooks/apis/api-config';

import type { ChangePasswordRequest, PublicUser, UpdateProfileRequest } from './types';

const ENDPOINT = '/users/me';

export async function getCurrentUser() {
  const { data } = await axiosInstance.get<PublicUser>(ENDPOINT);
  return data;
}

export async function updateProfile(payload: UpdateProfileRequest) {
  const { data } = await axiosInstance.patch<PublicUser>(ENDPOINT, payload);
  return data;
}

export async function changePassword(payload: ChangePasswordRequest) {
  await axiosInstance.patch(`${ENDPOINT}/password`, payload);
}

export async function uploadAvatar(file: File) {
  const body = new FormData();
  body.append('file', file);
  const { data } = await axiosInstance.post<PublicUser>(`${ENDPOINT}/avatar`, body);
  return data;
}
