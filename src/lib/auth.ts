import { useSyncExternalStore } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "./supabase";
import { startSync, stopSync } from "./sync";

/**
 * Auth state for the optional Google sign-in. Local-first: signed-out is the full
 * experience; signing in turns on cloud sync (see sync.ts). No-ops cleanly when
 * Supabase isn't configured.
 */

let user: User | null = null;
let ready = false; // becomes true once the initial session is resolved
const listeners = new Set<() => void>();
// A NEW object each change — useSyncExternalStore compares by reference, so a
// mutated-in-place snapshot would never trigger a re-render (the sign-in→avatar
// swap would only show after a reload).
let snap: { user: User | null; ready: boolean } = { user, ready };
function emit() {
  snap = { user, ready };
  listeners.forEach((l) => l());
}

let initialized = false;
/** Call once on app start. Resolves the current session and watches for changes. */
export function initAuth() {
  if (initialized) return;
  initialized = true;
  if (!supabase) {
    ready = true;
    emit();
    return;
  }
  supabase.auth
    .getSession()
    .then(({ data }) => {
      user = data.session?.user ?? null;
      if (user) startSync(user.id);
    })
    .catch(() => {
      /* unreachable/offline — still mark ready so the UI isn't stuck */
    })
    .finally(() => {
      ready = true;
      emit();
    });
  supabase.auth.onAuthStateChange((_event, session) => {
    const next = session?.user ?? null;
    const changed = next?.id !== user?.id;
    user = next;
    if (!ready) ready = true;
    emit();
    if (changed) {
      if (user) startSync(user.id);
      else stopSync();
    }
  });
}

export function useAuth(): { user: User | null; ready: boolean } {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => snap,
  );
}

export async function signInWithGoogle() {
  if (!supabase) return;
  await supabase.auth.signInWithOAuth({
    provider: "google",
    options: { redirectTo: window.location.origin },
  });
}

export async function signOut() {
  if (!supabase) return;
  await supabase.auth.signOut();
}
