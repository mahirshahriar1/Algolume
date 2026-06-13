import { useSyncExternalStore } from "react";
import { supabase, SYNC_TABLE } from "./supabase";
import { getCompletedKeys, setCompletedKeys, subscribeProgress } from "./progress";
import { getSolvedIds, setSolvedIds, subscribeSolved } from "./problems/solved";
import { getAllNotes, setNote, subscribeNotes } from "./notesStore";

/**
 * Local-first cloud sync. The browser localStorage stores stay the source of
 * truth offline; when signed in, we mirror them to a single per-user JSON row in
 * Supabase. On login we MERGE (union of completed/solved, newest-wins per note),
 * then push; afterwards every local change is debounce-pushed.
 */

interface NoteState {
  text: string;
  updatedAt: number;
}
export interface SyncState {
  progress: string[];
  solved: string[];
  notes: Record<string, NoteState>;
}

export type SyncStatus = "idle" | "syncing" | "synced" | "error";

// ---- status observable (for the UI) ---------------------------------------
let status: SyncStatus = "idle";
let lastSyncedAt: number | null = null;
const statusListeners = new Set<() => void>();
// Fresh object each change (reference-compared by useSyncExternalStore).
let snapshot: { status: SyncStatus; lastSyncedAt: number | null } = { status, lastSyncedAt };
function setStatus(next: SyncStatus) {
  status = next;
  if (next === "synced") lastSyncedAt = Date.now();
  snapshot = { status, lastSyncedAt };
  statusListeners.forEach((l) => l());
}
export function useSyncStatus(): { status: SyncStatus; lastSyncedAt: number | null } {
  return useSyncExternalStore(
    (cb) => {
      statusListeners.add(cb);
      return () => statusListeners.delete(cb);
    },
    () => snapshot,
  );
}

// ---- local <-> state -------------------------------------------------------
function getLocalState(): SyncState {
  const notes: Record<string, NoteState> = {};
  for (const n of getAllNotes()) notes[n.lessonKey] = { text: n.text, updatedAt: n.updatedAt };
  return { progress: getCompletedKeys(), solved: getSolvedIds(), notes };
}

function applyState(state: SyncState) {
  setCompletedKeys(state.progress);
  setSolvedIds(state.solved);
  for (const [key, n] of Object.entries(state.notes)) setNote(key, n.text, n.updatedAt);
}

function mergeStates(local: SyncState, cloud: SyncState): SyncState {
  const progress = [...new Set([...local.progress, ...cloud.progress])];
  const solved = [...new Set([...local.solved, ...cloud.solved])];
  const notes: Record<string, NoteState> = { ...cloud.notes };
  for (const [key, n] of Object.entries(local.notes)) {
    const existing = notes[key];
    if (!existing || n.updatedAt >= existing.updatedAt) notes[key] = n;
  }
  return { progress, solved, notes };
}

const EMPTY: SyncState = { progress: [], solved: [], notes: {} };

async function pull(userId: string): Promise<SyncState> {
  if (!supabase) return EMPTY;
  const { data, error } = await supabase
    .from(SYNC_TABLE)
    .select("state")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) throw error;
  const s = (data?.state ?? {}) as Partial<SyncState>;
  return { progress: s.progress ?? [], solved: s.solved ?? [], notes: s.notes ?? {} };
}

async function push(userId: string, state: SyncState): Promise<void> {
  if (!supabase) return;
  const { error } = await supabase
    .from(SYNC_TABLE)
    .upsert({ user_id: userId, state, updated_at: new Date().toISOString() });
  if (error) throw error;
}

// ---- manager ---------------------------------------------------------------
let currentUser: string | null = null;
let applying = false;
let unsubs: Array<() => void> = [];
let pushTimer: number | null = null;

function schedulePush() {
  if (applying || !currentUser || !supabase) return;
  setStatus("syncing");
  if (pushTimer) window.clearTimeout(pushTimer);
  pushTimer = window.setTimeout(async () => {
    if (!currentUser) return;
    try {
      await push(currentUser, getLocalState());
      setStatus("synced");
    } catch {
      setStatus("error");
    }
  }, 800);
}

/** Start syncing for a signed-in user: pull, merge, apply, push, then watch. */
export async function startSync(userId: string) {
  if (!supabase) return;
  currentUser = userId;
  setStatus("syncing");
  try {
    const cloud = await pull(userId);
    const merged = mergeStates(getLocalState(), cloud);
    applying = true;
    applyState(merged);
    applying = false;
    await push(userId, merged);
    setStatus("synced");
  } catch {
    applying = false;
    setStatus("error");
  }
  unsubs = [subscribeProgress(schedulePush), subscribeSolved(schedulePush), subscribeNotes(schedulePush)];
}

/** Stop syncing (on sign-out). Local data stays put. */
export function stopSync() {
  unsubs.forEach((u) => u());
  unsubs = [];
  currentUser = null;
  if (pushTimer) window.clearTimeout(pushTimer);
  setStatus("idle");
}
