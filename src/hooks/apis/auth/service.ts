import { axiosInstance, clearTokens, getRefreshToken } from '@/hooks/apis/api-config';

import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

const ENDPOINT = '/auth';

export async function login(payload: LoginRequest) {
  const { data } = await axiosInstance.post<AuthResponse>(`${ENDPOINT}/login`, payload, {
    skipAuth: true,
  });
  return data;
}

export async function register(payload: RegisterRequest) {
  const { data } = await axiosInstance.post<AuthResponse>(`${ENDPOINT}/register`, payload, {
    skipAuth: true,
  });
  return data;
}

export async function logout() {
  const refreshToken = getRefreshToken();

  if (refreshToken) {
    try {
      await axiosInstance.post(
        `${ENDPOINT}/logout`,
        { refreshToken },
        {
          skipAuth: true,
        }
      );
    } catch {
      /* ignore network errors on logout */
    }
  }

  clearTokens();
}
