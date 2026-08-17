'use client';

import { DemoProvider } from '@/lib/demo/context';
import AppShell from '@/components/layout/AppShell';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DemoProvider>
      <AppShell>
        {children}
      </AppShell>
    </DemoProvider>
  );
}
