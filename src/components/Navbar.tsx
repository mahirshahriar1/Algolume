import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Github, Linkedin, Search, Menu, X, MessageSquarePlus } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { CommandPalette } from "./CommandPalette";
import { ShortcutsHelp } from "./ShortcutsHelp";
import { AccountMenu, SyncStatusLine } from "./AccountMenu";
import { initAuth, useAuth, signInWithGoogle } from "@/lib/auth";
import { isSupabaseConfigured } from "@/lib/supabase";

const REPO_URL = "https://github.com/mahirshahriar1/Algolume";
const LINKEDIN_URL = "https://www.linkedin.com/in/mahir-shahriar-tamim/";

const NAV = [
  { to: "/learn", label: "Learn" },
  { to: "/visualizers", label: "Visualizers" },
  { to: "/playground", label: "Playground" },
  { to: "/problems", label: "Problems" },
  { to: "/notes", label: "Notes" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const { user } = useAuth();

  // Resolve the auth session + start cloud sync once (no-op without Supabase env).
  useEffect(() => {
    initAuth();
  }, []);

  // Global shortcuts: ⌘/Ctrl-K opens the switcher; "?" opens shortcut help
  // (ignored while typing in a field).
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen((v) => !v);
        return;
      }
      const el = e.target as HTMLElement | null;
      const typing = el && (el.tagName === "INPUT" || el.tagName === "TEXTAREA" || el.isContentEditable);
      if (e.key === "?" && !typing && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setHelpOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // Close the mobile menu on navigation.
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line/50 bg-base/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <Logo className="h-8 w-8" />
            <span className="font-display text-xl font-semibold tracking-tight">
              Algo<span className="text-run">lume</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1">
            <div className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                      active
                        ? "bg-elevated text-fg"
                        : "text-muted hover:text-fg hover:bg-elevated/60",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <span className="mx-1 hidden h-5 w-px bg-line md:block" aria-hidden="true" />

            {/* Quick switcher (⌘K) */}
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden items-center gap-2 rounded-lg border border-line bg-elevated/60 px-2.5 py-1.5 text-sm text-muted transition-colors hover:text-fg sm:flex"
              aria-label="Open quick switcher"
              title="Quick switcher (Ctrl/⌘ K)"
            >
              <Search className="h-4 w-4" />
              <kbd className="font-mono text-[11px] text-subtle">⌘K</kbd>
            </button>
            <button
              onClick={() => setPaletteOpen(true)}
              className="btn-icon sm:hidden"
              aria-label="Open quick switcher"
            >
              <Search className="h-5 w-5" />
            </button>

            <Link
              to="/issue"
              className={cn("btn-icon", pathname.startsWith("/issue") && "bg-elevated text-fg")}
              aria-label="Submit an issue"
              title="Submit an issue / feedback"
            >
              <MessageSquarePlus className="h-5 w-5" />
            </Link>
            <ThemeToggle />
            <AccountMenu />
            <a
              href={LINKEDIN_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-icon hidden sm:inline-flex"
              aria-label="Author's LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href={REPO_URL}
              target="_blank"
              rel="noreferrer"
              className="btn-icon hidden sm:inline-flex"
              aria-label="GitHub repository"
            >
              <Github className="h-5 w-5" />
            </a>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="btn-icon md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </nav>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="border-t border-line bg-base md:hidden">
            <nav className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-3 sm:px-6">
              {NAV.map((item) => {
                const active = pathname.startsWith(item.to);
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      "rounded-lg px-3 py-2.5 text-sm font-medium",
                      active ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60 hover:text-fg",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <Link to="/issue" className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted hover:bg-elevated/60 hover:text-fg">
                Submit an issue
              </Link>
              {isSupabaseConfigured && !user && (
                <button
                  onClick={() => signInWithGoogle()}
                  className="mt-1 flex items-center gap-2 rounded-lg border border-line bg-elevated/60 px-3 py-2.5 text-sm font-medium text-fg"
                >
                  Sign in with Google
                </button>
              )}
              <SyncStatusLine />
              <div className="mt-1 flex items-center gap-2 border-t border-line pt-2">
                <a href={LINKEDIN_URL} target="_blank" rel="noreferrer" className="btn-icon" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
                <a href={REPO_URL} target="_blank" rel="noreferrer" className="btn-icon" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </nav>
          </div>
        )}
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />
      <ShortcutsHelp open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  );
}
