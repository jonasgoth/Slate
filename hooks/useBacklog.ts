'use client';

import { useData } from '@/lib/DataContext';

export function useBacklog() {
  const { backlog, backlogLoading, addBacklog, updateBacklog, deleteBacklog, reorderBacklog, moveToToday } = useData();
  return {
    todos: backlog,
    loading: backlogLoading,
    addTodo: addBacklog,
    updateTodo: updateBacklog,
    deleteTodo: deleteBacklog,
    reorderTodos: reorderBacklog,
    moveToToday,
  };
}
