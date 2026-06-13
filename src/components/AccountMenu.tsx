import { useEffect, useRef, useState } from "react";
import { Cloud, CloudOff, Loader2, Check, LogOut, AlertCircle } from "lucide-react";
import { isSupabaseConfigured } from "@/lib/supabase";
import { useAuth, signInWithGoogle, signOut } from "@/lib/auth";
import { useSyncStatus } from "@/lib/sync";
import { cn } from "@/lib/cn";

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1Z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.06H2.18a11 11 0 0 0 0 9.88l3.66-2.84Z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38Z" />
    </svg>
  );
}

/** Status chip — shows the cloud-sync state at a glance. */
function SyncChip() {
  const { status, lastSyncedAt } = useSyncStatus();
  const map = {
    syncing: { icon: Loader2, cls: "text-compare", spin: true, label: "Syncing…" },
    synced: { icon: Check, cls: "text-run", spin: false, label: "Synced" },
    error: { icon: AlertCircle, cls: "text-swap", spin: false, label: "Sync error" },
    idle: { icon: Cloud, cls: "text-subtle", spin: false, label: "Local only" },
  }[status];
  const Icon = map.icon;
  return (
    <span className={cn("flex items-center gap-1.5 text-xs", map.cls)} title={lastSyncedAt ? `Last synced ${new Date(lastSyncedAt).toLocaleTimeString()}` : undefined}>
      <Icon className={cn("h-3.5 w-3.5", map.spin && "animate-spin")} />
      {map.label}
    </span>
  );
}

export function AccountMenu() {
  const { user, ready } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Sync is opt-in via env config; hide the control entirely when not set up.
  if (!isSupabaseConfigured) return null;

  // Show the sign-in button by default (even before the session resolves, so it
  // can never get stuck); it swaps to the avatar once a user is detected.
  if (!user) {
    return (
      <button
        onClick={() => signInWithGoogle()}
        className="flex items-center gap-2 rounded-lg border border-line bg-elevated/60 px-3 py-1.5 text-sm font-medium text-fg transition-colors hover:bg-elevated"
        title="Sign in to sync your progress across devices"
      >
        <GoogleIcon className="h-4 w-4" />
        Sign in
      </button>
    );
  }
  void ready;

  const email = user.email ?? "Account";
  const initial = (email[0] ?? "A").toUpperCase();
  const avatar = (user.user_metadata?.avatar_url as string | undefined) ?? null;

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-line bg-elevated text-sm font-semibold text-fg transition-colors hover:border-run/40"
        aria-label="Account"
        title={email}
      >
        {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : initial}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-64 overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
          <div className="border-b border-line px-4 py-3">
            <p className="truncate text-sm font-medium text-fg">{email}</p>
            <div className="mt-1.5">
              <SyncChip />
            </div>
          </div>
          <p className="px-4 py-2 text-[11px] leading-4 text-subtle">
            Your lessons, notes, and solved problems sync to your account automatically.
          </p>
          <button
            onClick={() => {
              setOpen(false);
              signOut();
            }}
            className="flex w-full items-center gap-2 border-t border-line px-4 py-2.5 text-left text-sm text-muted transition-colors hover:bg-elevated hover:text-fg"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}

/** Tiny standalone indicator used in the mobile menu. */
export function SyncStatusLine() {
  const { user } = useAuth();
  if (!isSupabaseConfigured || !user) return null;
  return (
    <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted">
      <CloudOff className="hidden" />
      <SyncChip />
    </div>
  );
}
