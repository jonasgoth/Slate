import { supabase } from '../supabase';
import type { Plan } from '@/types';

function toError(error: { message: string; details?: string; code?: string }): Error {
  console.error('[Supabase error]', error);
  return new Error(error.message);
}

export async function fetchPlans(): Promise<Plan[]> {
  const { data, error } = await supabase
    .from('plans')
    .select('*')
    .order('position', { ascending: true });
  if (error) throw toError(error);
  return data ?? [];
}

export async function addPlan(title: string, date: string): Promise<Plan> {
  const { data, error } = await supabase
    .from('plans')
    .insert({ title, date, position: Math.floor(Date.now() / 1000) })
    .select()
    .single();
  if (error) throw toError(error);
  return data;
}

export async function updatePlan(id: string, updates: Partial<Plan>): Promise<void> {
  const { error } = await supabase.from('plans').update(updates).eq('id', id);
  if (error) {
    if (error.code === 'PGRST204' && 'emoji' in updates) {
      const { emoji, ...rest } = updates;
      if (typeof window !== 'undefined' && emoji) {
        localStorage.setItem(`plan-emoji-${id}`, emoji);
      }
      if (Object.keys(rest).length > 0) {
        const { error: retryError } = await supabase.from('plans').update(rest).eq('id', id);
        if (retryError) throw toError(retryError);
      }
      return;
    }
    throw toError(error);
  }
}

export async function deletePlan(id: string): Promise<void> {
  const { error } = await supabase.from('plans').delete().eq('id', id);
  if (error) throw toError(error);
}
