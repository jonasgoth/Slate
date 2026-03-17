import { supabase } from '../supabase';
import type { Ritual } from '@/types';

function toError(error: { message: string; details?: string; code?: string }): Error {
  console.error('[Supabase error]', error);
  return new Error(error.message);
}

export async function fetchRituals(): Promise<Ritual[]> {
  const { data, error } = await supabase
    .from('rituals')
    .select('*')
    .order('position', { ascending: true });
  if (error) throw toError(error);
  return data ?? [];
}

export async function addRitual(title: string, mode: Ritual['mode']): Promise<Ritual> {
  const { data, error } = await supabase
    .from('rituals')
    .insert({ title, mode, position: Math.floor(Date.now() / 1000) })
    .select()
    .single();
  if (error) throw toError(error);
  return data;
}

export async function updateRitual(id: string, updates: Partial<Ritual>): Promise<void> {
  const { error } = await supabase.from('rituals').update(updates).eq('id', id);
  if (error) throw toError(error);
}

export async function deleteRitual(id: string): Promise<void> {
  const { error } = await supabase.from('rituals').delete().eq('id', id);
  if (error) throw toError(error);
}
