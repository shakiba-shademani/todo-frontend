import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, UNAUTHORIZED_EVENT } from '@/constants/storage';

import type { AuthResponse } from './auth/types';

type RetryConfig = InternalAxiosRequestConfig & {
  skipAuth?: boolean;
  _retry?: boolean;
};

export { UNAUTHORIZED_EVENT };

export const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
});

export function getAccessToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

function toApiError(error: unknown): Error {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return new Error(message.join(', '));
    if (typeof message === 'string') return new Error(message);
    return new Error(error.message || 'Request failed');
  }

  if (error instanceof Error) return error;
  return new Error('Request failed');
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;

  refreshPromise = (async () => {
    const refreshToken = getRefreshToken();
    if (!refreshToken) return false;

    try {
      const { data } = await axiosInstance.post<AuthResponse>('/auth/refresh', { refreshToken }, {
        skipAuth: true,
      } as RetryConfig);
      setTokens(data.accessToken, data.refreshToken);
      return true;
    } catch {
      clearTokens();
      return false;
    }
  })();

  try {
    return await refreshPromise;
  } finally {
    refreshPromise = null;
  }
}

axiosInstance.interceptors.request.use((config) => {
  const request = config as RetryConfig;

  if (request.data instanceof FormData) {
    delete request.headers['Content-Type'];
  } else if (!request.headers['Content-Type']) {
    request.headers['Content-Type'] = 'application/json';
  }

  const token = getAccessToken();
  if (token && !request.skipAuth) {
    request.headers.Authorization = `Bearer ${token}`;
  }

  return request;
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;

    if (error.response?.status === 401 && original && !original.skipAuth && !original._retry) {
      original._retry = true;
      const refreshed = await refreshAccessToken();

      if (refreshed) {
        const token = getAccessToken();
        if (token) {
          original.headers.Authorization = `Bearer ${token}`;
        }
        return axiosInstance(original);
      }

      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
      }

      return Promise.reject(new Error('Please log in again'));
    }

    return Promise.reject(toApiError(error));
  }
);
