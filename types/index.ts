export type Mode = 'personal' | 'work';

export interface Todo {
  id: string;
  title: string;
  is_completed: boolean;
  position: number;
  date: string;
  created_at: string;
  mode: Mode;
}

export interface BacklogTodo {
  id: string;
  title: string;
  is_completed: boolean;
  position: number;
  created_at: string;
  mode: Mode;
}

export interface Plan {
  id: string;
  title: string;
  date: string | null;
  emoji: string;
  position: number;
  created_at: string;
  mode: Mode;
}

export interface Ritual {
  id: string;
  title: string;
  position: number;
  completed_date: string | null;
  created_at: string;
  mode: Mode;
}

export interface DayLog {
  id: string;
  date: string;
  completed_count: number;
  incomplete_count: number;
  todos: Todo[];
  archived_at: string;
}
