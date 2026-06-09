import { useSyncExternalStore } from "react";

/**
 * Tiny global store for lesson completion, backed by localStorage. Using
 * useSyncExternalStore keeps every consumer (lesson page, sidebar, library)
 * in sync the instant a lesson is toggled — no context provider needed.
 *
 * A lesson is keyed by "chapterId/lessonId".
 */

const KEY = "algolume-progress";

function load(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

let completed = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify([...completed]));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function lessonKey(chapterId: string, lessonId: string): string {
  return `${chapterId}/${lessonId}`;
}

export function toggleComplete(key: string) {
  const next = new Set(completed);
  if (next.has(key)) next.delete(key);
  else next.add(key);
  completed = next; // new identity → snapshot changes
  persist();
}

function subscribe(cb: () => void): () => void {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

/** Reactive set of completed lesson keys. */
export function useCompleted(): Set<string> {
  return useSyncExternalStore(subscribe, () => completed);
}
