'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { fetchTodos, addTodo as apiAddTodo, updateTodo as apiUpdateTodo, deleteTodo as apiDeleteTodo, fetchArchivedCompletedCount } from '@/lib/queries/todos';
import { fetchBacklog, addBacklogTodo, updateBacklogTodo, deleteBacklogTodo } from '@/lib/queries/backlog';
import { fetchPlans, addPlan as apiAddPlan, updatePlan as apiUpdatePlan, deletePlan as apiDeletePlan } from '@/lib/queries/plans';
import { fetchRituals, addRitual as apiAddRitual, updateRitual as apiUpdateRitual, deleteRitual as apiDeleteRitual } from '@/lib/queries/rituals';
import type { Todo, BacklogTodo, Plan, Ritual, Mode } from '@/types';
import { setStoredMode, mergeMode, pruneStoredModes } from '@/lib/modeStorage';

interface DataContextValue {
  today: string;
  todos: Todo[];
  todosLoading: boolean;
  addTodo: (title: string, mode: Mode) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  reorderTodos: (reordered: Todo[]) => Promise<void>;

  backlog: BacklogTodo[];
  backlogLoading: boolean;
  addBacklog: (title: string, mode: Mode) => Promise<void>;
  updateBacklog: (id: string, updates: Partial<BacklogTodo>) => Promise<void>;
  deleteBacklog: (id: string) => Promise<void>;
  reorderBacklog: (reordered: BacklogTodo[]) => Promise<void>;
  moveToToday: (id: string) => Promise<void>;
  moveToBacklog: (id: string) => Promise<void>;

  plans: Plan[];
  plansLoading: boolean;
  addPlan: (title: string, date: string, mode: Mode) => Promise<void>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  reorderPlans: (reordered: Plan[]) => Promise<void>;

  rituals: Ritual[];
  ritualsLoading: boolean;
  addRitual: (title: string, mode: Mode) => Promise<void>;
  updateRitual: (id: string, updates: Partial<Ritual>) => Promise<void>;
  deleteRitual: (id: string) => Promise<void>;

  totalCompletedCount: number;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const today = useMemo(() => format(new Date(), 'yyyy-MM-dd'), []);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [todosLoading, setTodosLoading] = useState(true);
  const [backlog, setBacklog] = useState<BacklogTodo[]>([]);
  const [backlogLoading, setBacklogLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [rituals, setRituals] = useState<Ritual[]>([]);
  const [ritualsLoading, setRitualsLoading] = useState(true);
  const [archivedCompletedCount, setArchivedCompletedCount] = useState(0);

  useEffect(() => {
    fetchTodos(today).then((data) => {
      const merged = mergeMode(data);
      pruneStoredModes(new Set(merged.map((t) => t.id)));
      setTodos(merged);
      setTodosLoading(false);
    });
    fetchBacklog().then((data) => { setBacklog(mergeMode(data)); setBacklogLoading(false); });
    fetchPlans().then((data) => { setPlans(mergeMode(data)); setPlansLoading(false); });
    fetchRituals().then((data) => { setRituals(data); setRitualsLoading(false); });
    fetchArchivedCompletedCount().then(setArchivedCompletedCount);

    const todosChannel = supabase
      .channel(`day_todos_${today}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'day_todos', filter: `date=eq.${today}` },
        () => fetchTodos(today).then((fresh) => setTodos(mergeMode(fresh)))
      )
      .subscribe();

    const backlogChannel = supabase
      .channel('backlog_todos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'backlog_todos' },
        () => fetchBacklog().then((fresh) => setBacklog(mergeMode(fresh)))
      )
      .subscribe();

    const plansChannel = supabase
      .channel('plans')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'plans' },
        () => fetchPlans().then((fresh) => setPlans(mergeMode(fresh)))
      )
      .subscribe();

    const ritualsChannel = supabase
      .channel('rituals')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'rituals' },
        () => fetchRituals().then(setRituals)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(todosChannel);
      supabase.removeChannel(backlogChannel);
      supabase.removeChannel(plansChannel);
      supabase.removeChannel(ritualsChannel);
    };
  }, [today]);

  // --- Todos ---
  const addTodo = useCallback(async (title: string, mode: Mode) => {
    const todo = await apiAddTodo(title, today, mode);
    setStoredMode(todo.id, mode);
    setTodos((prev) => [...prev, { ...todo, mode }]);
  }, [today]);

  const updateTodo = useCallback(async (id: string, updates: Partial<Todo>) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    await apiUpdateTodo(id, updates);
  }, []);

  const deleteTodo = useCallback(async (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
    await apiDeleteTodo(id);
  }, []);

  const reorderTodos = useCallback(async (reordered: Todo[]) => {
    setTodos(reordered);
    await Promise.all(reordered.map((t, i) => apiUpdateTodo(t.id, { position: i })));
  }, []);

  // --- Backlog ---
  const addBacklog = useCallback(async (title: string, mode: Mode) => {
    const todo = await addBacklogTodo(title, mode);
    setStoredMode(todo.id, mode);
    setBacklog((prev) => [...prev, { ...todo, mode }]);
  }, []);

  const updateBacklog = useCallback(async (id: string, updates: Partial<BacklogTodo>) => {
    setBacklog((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
    await updateBacklogTodo(id, updates);
  }, []);

  const deleteBacklog = useCallback(async (id: string) => {
    setBacklog((prev) => prev.filter((t) => t.id !== id));
    await deleteBacklogTodo(id);
  }, []);

  const reorderBacklog = useCallback(async (reordered: BacklogTodo[]) => {
    setBacklog(reordered);
    await Promise.all(reordered.map((t, i) => updateBacklogTodo(t.id, { position: i })));
  }, []);

  const moveToToday = useCallback(async (id: string) => {
    const todo = backlog.find((t) => t.id === id);
    if (!todo) return;
    const mode = todo.mode ?? 'personal';
    const newTodo = await apiAddTodo(todo.title, today, mode);
    setStoredMode(newTodo.id, mode);
    await deleteBacklogTodo(id);
    setBacklog((prev) => prev.filter((t) => t.id !== id));
  }, [backlog, today]);

  const moveToBacklog = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    const mode = todo.mode ?? 'personal';
    const newTodo = await addBacklogTodo(todo.title, mode);
    setStoredMode(newTodo.id, mode);
    await apiDeleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, [todos]);

  // --- Plans ---
  const addPlan = useCallback(async (title: string, date: string, mode: Mode) => {
    const plan = await apiAddPlan(title, date, mode);
    setStoredMode(plan.id, mode);
    setPlans((prev) => [...prev, { ...plan, mode }]);
  }, []);

  const updatePlan = useCallback(async (id: string, updates: Partial<Plan>) => {
    setPlans((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
    await apiUpdatePlan(id, updates);
  }, []);

  const deletePlan = useCallback(async (id: string) => {
    setPlans((prev) => prev.filter((p) => p.id !== id));
    await apiDeletePlan(id);
  }, []);

  const reorderPlans = useCallback(async (reordered: Plan[]) => {
    setPlans(reordered);
    await Promise.all(reordered.map((p, i) => apiUpdatePlan(p.id, { position: i })));
  }, []);

  // --- Rituals ---
  const addRitual = useCallback(async (title: string, mode: Mode) => {
    const ritual = await apiAddRitual(title, mode);
    setRituals((prev) => [...prev, { ...ritual, mode }]);
  }, []);

  const updateRitual = useCallback(async (id: string, updates: Partial<Ritual>) => {
    setRituals((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    await apiUpdateRitual(id, updates);
  }, []);

  const deleteRitual = useCallback(async (id: string) => {
    setRituals((prev) => prev.filter((r) => r.id !== id));
    await apiDeleteRitual(id);
  }, []);

  const totalCompletedCount = useMemo(() => {
    const todayCompleted = todos.filter((t) => t.is_completed).length;
    const backlogCompleted = backlog.filter((t) => t.is_completed).length;
    return archivedCompletedCount + todayCompleted + backlogCompleted;
  }, [archivedCompletedCount, todos, backlog]);

  const value = useMemo<DataContextValue>(() => ({
    today,
    todos, todosLoading, addTodo, updateTodo, deleteTodo, reorderTodos,
    backlog, backlogLoading, addBacklog, updateBacklog, deleteBacklog, reorderBacklog, moveToToday,
    moveToBacklog,
    plans, plansLoading, addPlan, updatePlan, deletePlan, reorderPlans,
    rituals, ritualsLoading, addRitual, updateRitual, deleteRitual,
    totalCompletedCount,
  }), [
    today,
    todos, todosLoading, addTodo, updateTodo, deleteTodo, reorderTodos,
    backlog, backlogLoading, addBacklog, updateBacklog, deleteBacklog, reorderBacklog, moveToToday,
    moveToBacklog,
    plans, plansLoading, addPlan, updatePlan, deletePlan, reorderPlans,
    rituals, ritualsLoading, addRitual, updateRitual, deleteRitual,
    totalCompletedCount,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
