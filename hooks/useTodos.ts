'use client';

import { useData } from '@/lib/DataContext';

export function useTodos() {
  const { todos, todosLoading, addTodo, updateTodo, deleteTodo, reorderTodos, moveToBacklog } = useData();
  return { todos, loading: todosLoading, addTodo, updateTodo, deleteTodo, reorderTodos, moveToBacklog };
}
