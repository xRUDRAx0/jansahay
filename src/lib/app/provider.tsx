'use client';

// ============================================================
// JANSAHAY — AppProvider
// Reads mode from localStorage, renders LiveProvider or DemoProvider.
// ============================================================

import { useState, useEffect, type ReactNode } from 'react';
import { LiveProvider } from '@/lib/live/context';
import { DemoProvider } from '@/lib/demo/context';
import { getStoredMode, type AppMode } from '@/lib/app/mode';

export function AppProvider({ children }: { children: ReactNode }) {
  // Default to 'live' on server; hydrate from localStorage on client
  const [mode, setMode] = useState<AppMode>('live');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setMode(getStoredMode());
    setReady(true);
  }, []);

  // During SSR / before hydration, render LiveProvider (safe default)
  if (!ready) {
    return <LiveProvider>{children}</LiveProvider>;
  }

  if (mode === 'demo') {
    return <DemoProvider>{children}</DemoProvider>;
  }
  return <LiveProvider>{children}</LiveProvider>;
}
