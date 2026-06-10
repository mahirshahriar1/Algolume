import { useSyncExternalStore } from "react";

/**
 * Local, reactive store of solved problem ids (localStorage-backed), mirroring
 * lib/progress.ts for lessons. A problem is marked solved the first time every
 * graded test passes; the browser and problem pages stay in sync via
 * useSyncExternalStore.
 */

const KEY = "algolume-solved";

function load(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

let solved = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...solved]));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function markSolved(id: string) {
  if (solved.has(id)) return;
  const next = new Set(solved);
  next.add(id);
  solved = next;
  persist();
}

export function clearSolved(id: string) {
  if (!solved.has(id)) return;
  const next = new Set(solved);
  next.delete(id);
  solved = next;
  persist();
}

/** Wipe all solved markers (used by the reset-progress control). */
export function clearAllSolved() {
  if (solved.size === 0) return;
  solved = new Set();
  persist();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Reactive set of solved problem ids. */
export function useSolved(): Set<string> {
  return useSyncExternalStore(subscribe, () => solved);
}
