'use client';

import { type ReactNode, useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

import { UNAUTHORIZED_EVENT } from '@/hooks/apis/api-config';
import { taskKeys } from '@/hooks/apis/tasks';
import { userKeys } from '@/hooks/apis/users';

function SessionListener() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const onUnauthorized = () => {
      queryClient.removeQueries({ queryKey: userKeys.all });
      queryClient.removeQueries({ queryKey: taskKeys.all });
    };

    window.addEventListener(UNAUTHORIZED_EVENT, onUnauthorized);

    return () => window.removeEventListener(UNAUTHORIZED_EVENT, onUnauthorized);
  }, [queryClient]);

  return null;
}

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute='class' defaultTheme='system' enableSystem>
      <SessionListener />

      {children}
    </ThemeProvider>
  );
}
