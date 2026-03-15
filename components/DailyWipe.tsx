'use client';

import { useEffect, useRef } from 'react';
import {
  fetchStaleTodos,
  archiveDayLog,
  deleteCompletedTodosByDate,
  carryForwardTodos,
} from '@/lib/queries/todos';

interface DailyWipeProps {
  today: string;
}

export function DailyWipe({ today }: DailyWipeProps) {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const doWipe = async () => {
      const stale = await fetchStaleTodos(today);
      if (stale.length === 0) return;

      const dates = [...new Set(stale.map((t) => t.date))];

      for (const date of dates) {
        const dateTodos = stale.filter((t) => t.date === date);
        await archiveDayLog(date, dateTodos);
        await deleteCompletedTodosByDate(date);
        await carryForwardTodos(date, today);
      }
    };

    doWipe();
  }, [today]);

  return null;
}
