'use client';

import { AppProvider } from '@/lib/app/provider';
import AppShell from '@/components/layout/AppShell';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppProvider>
      <AppShell>
        {children}
      </AppShell>
    </AppProvider>
  );
}
