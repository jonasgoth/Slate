'use client';

import { useRef } from 'react';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion, type Variants } from 'framer-motion';
import { DataProvider, useData } from '@/lib/DataContext';
import { ModeProvider, useMode } from '@/lib/ModeContext';
import { Sidebar } from './Sidebar';
import { DailyWipe } from './DailyWipe';
import { ThemeToggle } from './ThemeToggle';

const PAGE_ORDER = ['/today', '/backlog', '/plans'];

const EASE = [0.25, 0.1, 0.25, 1] as [number, number, number, number];

const pageVariants: Variants = {
  initial: (dir: number) => ({
    x: dir * 120,
    opacity: 0,
  }),
  animate: {
    x: 0,
    opacity: 1,
    transition: {
      x: { duration: 0.12, ease: EASE },
      opacity: { duration: 0.08 },
    },
  },
  exit: (dir: number) => ({
    x: dir * -120,
    opacity: 0,
    transition: {
      x: { duration: 0.08, ease: EASE },
      opacity: { duration: 0.06 },
    },
  }),
};

function AppShellInner({ children }: { children: React.ReactNode }) {
  const { today, todos, backlog, plans } = useData();
  const { mode } = useMode();
  const pathname = usePathname();

  const prevPathRef = useRef(pathname);
  const directionRef = useRef(0);

  if (prevPathRef.current !== pathname) {
    const prevOrder = PAGE_ORDER.indexOf(prevPathRef.current);
    const currOrder = PAGE_ORDER.indexOf(pathname);
    if (prevOrder !== -1 && currOrder !== -1) {
      directionRef.current = currOrder > prevOrder ? 1 : -1;
    }
    prevPathRef.current = pathname;
  }

  const todayCount = todos.filter((t) => !t.is_completed && (t.mode ?? 'personal') === mode).length;
  const backlogCount = backlog.filter((t) => !t.is_completed && (t.mode ?? 'personal') === mode).length;
  const plansCount = plans.filter((p) => (p.mode ?? 'personal') === mode).length;

  return (
    <div style={{ backgroundColor: 'var(--bg-app)', overflowX: 'hidden', minHeight: '100vh' }}>
      <AnimatePresence mode="wait" custom={directionRef.current}>
        <motion.main
          key={pathname}
          custom={directionRef.current}
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ paddingBottom: '108px' }}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      <Sidebar todayCount={todayCount} backlogCount={backlogCount} plansCount={plansCount} />
      <ThemeToggle />
      <DailyWipe today={today} />
    </div>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <ModeProvider>
      <DataProvider>
        <AppShellInner>{children}</AppShellInner>
      </DataProvider>
    </ModeProvider>
  );
}
