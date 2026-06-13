import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, BookOpen, MonitorPlay, FlaskConical, Compass, CornerDownLeft } from "lucide-react";
import { ALL_LESSONS } from "@/content";
import { VISUALIZERS } from "@/pages/visualizers/registry";
import { PROBLEMS, topicLabel, DIFFICULTY_LABEL } from "@/lib/problems";
import { cn } from "@/lib/cn";

type Kind = "Page" | "Lesson" | "Visualizer" | "Problem";

interface Item {
  label: string;
  sub: string;
  to: string;
  kind: Kind;
}

const KIND_ICON: Record<Kind, typeof BookOpen> = {
  Page: Compass,
  Lesson: BookOpen,
  Visualizer: MonitorPlay,
  Problem: FlaskConical,
};

/** Built once — every navigable destination in the app, flattened. */
function buildItems(): Item[] {
  const pages: Item[] = [
    { label: "Learn", sub: "The handbook library", to: "/learn", kind: "Page" },
    { label: "Visualizers", sub: "Interactive simulations", to: "/visualizers", kind: "Page" },
    { label: "Playground", sub: "Run Python in the browser", to: "/playground", kind: "Page" },
    { label: "Problems", sub: "Practice with hidden tests", to: "/problems", kind: "Page" },
    { label: "Notes", sub: "Your saved notes", to: "/notes", kind: "Page" },
    { label: "Search", sub: "Full-text search", to: "/search", kind: "Page" },
    { label: "Submit an issue", sub: "Report a bug or idea", to: "/issue", kind: "Page" },
  ];
  const lessons: Item[] = ALL_LESSONS.map((r) => ({
    label: r.lesson.title,
    sub: r.chapter.title,
    to: `/learn/${r.chapter.id}/${r.lesson.id}`,
    kind: "Lesson",
  }));
  const viz: Item[] = VISUALIZERS.map((v) => ({
    label: v.title,
    sub: "Visualizer",
    to: v.to ?? `/visualizers/${v.id}`,
    kind: "Visualizer",
  }));
  const problems: Item[] = PROBLEMS.map((p) => ({
    label: p.title,
    sub: `${topicLabel(p.topic)} · ${DIFFICULTY_LABEL[p.difficulty]}`,
    to: `/problems/${p.id}`,
    kind: "Problem",
  }));
  return [...pages, ...lessons, ...viz, ...problems];
}

export function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const navigate = useNavigate();
  const items = useMemo(buildItems, []);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items.slice(0, 8);
    return items
      .filter((it) => `${it.label} ${it.sub} ${it.kind}`.toLowerCase().includes(q))
      .slice(0, 40);
  }, [items, query]);

  // Reset + focus on open.
  useEffect(() => {
    if (open) {
      setQuery("");
      setActive(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the active row scrolled into view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  if (!open) return null;

  const go = (to: string) => {
    onClose();
    navigate(to);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (results[active]) go(results[active].to);
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-fg/30 px-4 pt-[12vh] backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={onKeyDown}
      >
        <div className="flex items-center gap-2.5 border-b border-line px-4">
          <Search className="h-4 w-4 shrink-0 text-subtle" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Jump to a lesson, visualizer, or problem…"
            className="h-12 w-full bg-transparent text-sm text-fg placeholder:text-subtle focus:outline-none"
          />
          <kbd className="hidden shrink-0 rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-[10px] text-subtle sm:block">
            esc
          </kbd>
        </div>

        <div ref={listRef} className="max-h-[50vh] overflow-auto p-1.5">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-subtle">No matches.</p>
          ) : (
            results.map((it, i) => {
              const Icon = KIND_ICON[it.kind];
              return (
                <button
                  key={`${it.to}-${i}`}
                  data-idx={i}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(it.to)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors",
                    i === active ? "bg-run/10" : "hover:bg-elevated",
                  )}
                >
                  <Icon className={cn("h-4 w-4 shrink-0", i === active ? "text-run" : "text-subtle")} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium text-fg">{it.label}</span>
                    <span className="block truncate text-xs text-subtle">{it.sub}</span>
                  </span>
                  <span className="shrink-0 rounded border border-line px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-subtle">
                    {it.kind}
                  </span>
                  {i === active && <CornerDownLeft className="h-3.5 w-3.5 shrink-0 text-run" />}
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
