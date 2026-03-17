import type { Mode } from '@/types';

const STORAGE_KEY = 'doto-item-modes';

export function getStoredModeMap(): Map<string, Mode> {
  if (typeof window === 'undefined') return new Map();
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return new Map(JSON.parse(stored) as [string, Mode][]);
  } catch {}
  return new Map();
}

export function setStoredMode(id: string, mode: Mode): void {
  if (typeof window === 'undefined') return;
  const map = getStoredModeMap();
  map.set(id, mode);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...map.entries()]));
}

/** Prune entries for IDs no longer in the DB to prevent unbounded growth. */
export function pruneStoredModes(activeIds: Set<string>): void {
  if (typeof window === 'undefined') return;
  const map = getStoredModeMap();
  let changed = false;
  for (const id of map.keys()) {
    if (!activeIds.has(id)) { map.delete(id); changed = true; }
  }
  if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify([...map.entries()]));
}

/** Merge DB-returned items with stored mode overrides. */
export function mergeMode<T extends { id: string; mode?: Mode }>(
  items: T[],
  fallback: Mode = 'personal'
): T[] {
  const storedMap = getStoredModeMap();
  return items.map((item) => ({
    ...item,
    mode: (item.mode ?? storedMap.get(item.id) ?? fallback) as Mode,
  }));
}
