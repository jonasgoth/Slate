'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Mode } from '@/types';

interface ModeContextValue {
  mode: Mode;
  isWorkMode: boolean;
  toggleMode: () => void;
}

const ModeContext = createContext<ModeContextValue | null>(null);

const STORAGE_KEY = 'doto-mode';

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<Mode>('personal');

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'work') setMode('work');
  }, []);

  const toggleMode = () => {
    setMode((prev) => {
      const next: Mode = prev === 'personal' ? 'work' : 'personal';
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  };

  return (
    <ModeContext.Provider value={{ mode, isWorkMode: mode === 'work', toggleMode }}>
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ModeContextValue {
  const ctx = useContext(ModeContext);
  if (!ctx) throw new Error('useMode must be used within ModeProvider');
  return ctx;
}
