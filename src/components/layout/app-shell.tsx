'use client';

import type { ReactNode } from 'react';

import { CalendarDays, PlusCircle, UserRound } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { AuthGuard } from '@/components/auth-guard';
import { ROUTES } from '@/constants/routes';

const tabs = [
  { href: ROUTES.today, label: 'Today', icon: CalendarDays },
  { href: ROUTES.add, label: 'Add', icon: PlusCircle },
  { href: ROUTES.profile, label: 'Profile', icon: UserRound },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <AuthGuard>
      <div className='mx-auto flex min-h-dvh w-full max-w-md flex-col bg-background'>
        <main className='flex-1 px-4 pb-[calc(5.75rem+env(safe-area-inset-bottom))] pt-[max(1rem,env(safe-area-inset-top))]'>
          {children}
        </main>

        <nav className='fixed bottom-0 left-1/2 z-20 w-full max-w-md -translate-x-1/2 border-t border-line bg-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur'>
          <ul className='grid grid-cols-3'>
            {tabs.map((tab) => {
              const active = pathname === tab.href;
              const Icon = tab.icon;

              return (
                <li key={tab.href}>
                  <Link
                    href={tab.href}
                    className={`flex flex-col items-center gap-1 py-3 text-xs font-medium ${
                      active ? 'text-primary' : 'text-muted'
                    }`}
                  >
                    <Icon size={22} strokeWidth={active ? 2.4 : 1.8} />

                    {tab.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </AuthGuard>
  );
}
