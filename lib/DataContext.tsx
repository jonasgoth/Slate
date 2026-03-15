'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react';
import { format } from 'date-fns';
import { supabase } from '@/lib/supabase';
import { fetchTodos, addTodo as apiAddTodo, updateTodo as apiUpdateTodo, deleteTodo as apiDeleteTodo } from '@/lib/queries/todos';
import { fetchBacklog, addBacklogTodo, updateBacklogTodo, deleteBacklogTodo } from '@/lib/queries/backlog';
import { fetchPlans, addPlan as apiAddPlan, updatePlan as apiUpdatePlan, deletePlan as apiDeletePlan } from '@/lib/queries/plans';
import type { Todo, BacklogTodo, Plan } from '@/types';

interface DataContextValue {
  today: string;
  todos: Todo[];
  todosLoading: boolean;
  addTodo: (title: string) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
  reorderTodos: (reordered: Todo[]) => Promise<void>;

  backlog: BacklogTodo[];
  backlogLoading: boolean;
  addBacklog: (title: string) => Promise<void>;
  updateBacklog: (id: string, updates: Partial<BacklogTodo>) => Promise<void>;
  deleteBacklog: (id: string) => Promise<void>;
  reorderBacklog: (reordered: BacklogTodo[]) => Promise<void>;
  moveToToday: (id: string) => Promise<void>;
  moveToBacklog: (id: string) => Promise<void>;

  plans: Plan[];
  plansLoading: boolean;
  addPlan: (title: string, date: string) => Promise<void>;
  updatePlan: (id: string, updates: Partial<Plan>) => Promise<void>;
  deletePlan: (id: string) => Promise<void>;
  reorderPlans: (reordered: Plan[]) => Promise<void>;
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

  useEffect(() => {
    fetchTodos(today).then((data) => { setTodos(data); setTodosLoading(false); });
    fetchBacklog().then((data) => { setBacklog(data); setBacklogLoading(false); });
    fetchPlans().then((data) => { setPlans(data); setPlansLoading(false); });

    const todosChannel = supabase
      .channel(`day_todos_${today}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'day_todos', filter: `date=eq.${today}` },
        () => fetchTodos(today).then(setTodos)
      )
      .subscribe();

    const backlogChannel = supabase
      .channel('backlog_todos')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'backlog_todos' },
        () => fetchBacklog().then(setBacklog)
      )
      .subscribe();

    const plansChannel = supabase
      .channel('plans')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'plans' },
        () => fetchPlans().then(setPlans)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(todosChannel);
      supabase.removeChannel(backlogChannel);
      supabase.removeChannel(plansChannel);
    };
  }, [today]);

  // --- Todos ---
  const addTodo = useCallback(async (title: string) => {
    const todo = await apiAddTodo(title, today);
    setTodos((prev) => [...prev, todo]);
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
  const addBacklog = useCallback(async (title: string) => {
    const todo = await addBacklogTodo(title);
    setBacklog((prev) => [...prev, todo]);
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
    await apiAddTodo(todo.title, today);
    await deleteBacklogTodo(id);
    setBacklog((prev) => prev.filter((t) => t.id !== id));
  }, [backlog, today]);

  const moveToBacklog = useCallback(async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    await addBacklogTodo(todo.title);
    await apiDeleteTodo(id);
    setTodos((prev) => prev.filter((t) => t.id !== id));
  }, [todos]);

  // --- Plans ---
  const addPlan = useCallback(async (title: string, date: string) => {
    const plan = await apiAddPlan(title, date);
    setPlans((prev) => [...prev, plan]);
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

  const value = useMemo<DataContextValue>(() => ({
    today,
    todos, todosLoading, addTodo, updateTodo, deleteTodo, reorderTodos,
    backlog, backlogLoading, addBacklog, updateBacklog, deleteBacklog, reorderBacklog, moveToToday,
    moveToBacklog,
    plans, plansLoading, addPlan, updatePlan, deletePlan, reorderPlans,
  }), [
    today,
    todos, todosLoading, addTodo, updateTodo, deleteTodo, reorderTodos,
    backlog, backlogLoading, addBacklog, updateBacklog, deleteBacklog, reorderBacklog, moveToToday,
    moveToBacklog,
    plans, plansLoading, addPlan, updatePlan, deletePlan, reorderPlans,
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}
