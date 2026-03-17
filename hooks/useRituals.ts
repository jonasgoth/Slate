'use client';

import { useData } from '@/lib/DataContext';

export function useRituals() {
  const { rituals, ritualsLoading, addRitual, updateRitual, deleteRitual } = useData();
  return { rituals, loading: ritualsLoading, addRitual, updateRitual, deleteRitual };
}
