import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { ArrowRight, BookOpen, NotebookPen, Search } from "lucide-react";
import { searchEverything } from "@/lib/searchIndex";

export function SearchPage() {
  const [params, setParams] = useSearchParams();
  const initial = params.get("q") ?? "";
  const [query, setQuery] = useState(initial);
  const [debouncedQuery, setDebouncedQuery] = useState(initial);
  const results = useMemo(() => searchEverything(debouncedQuery), [debouncedQuery]);
  const hasQuery = debouncedQuery.trim().length > 0;

  useEffect(() => {
    const id = window.setTimeout(() => setDebouncedQuery(query), 180);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    const next = new URLSearchParams(params);
    if (debouncedQuery.trim()) next.set("q", debouncedQuery);
    else next.delete("q");
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery, setParams]);

  return (
    <div className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <div className="mb-8">
        <p className="eyebrow mb-3 inline-flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-run" />
          Search
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight">
          Find lessons and notes.
        </h1>
        <p className="mt-3 max-w-2xl text-muted">
          Search the handbook content and anything saved in your local lesson notes.
        </p>
      </div>

      <div className="relative mb-6">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search Big-O, binary search, notes..."
          autoFocus
          className="h-12 w-full rounded-xl border border-line bg-surface pl-10 pr-3 text-sm text-fg
            placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
      </div>

      {!hasQuery ? (
        <div className="card flex flex-col items-center gap-4 p-10 text-center">
          <span className="rounded-2xl bg-elevated p-4 text-subtle">
            <BookOpen className="h-7 w-7" />
          </span>
          <p className="text-muted">
            Try a topic, data structure, complexity class, or something from your notes.
          </p>
        </div>
      ) : results.length === 0 ? (
        <p className="py-10 text-center text-muted">No results match "{debouncedQuery}".</p>
      ) : (
        <div className="space-y-4">
          <p className="text-sm text-muted">
            {results.length} result{results.length === 1 ? "" : "s"} for "{debouncedQuery}"
          </p>
          {results.map((result) => (
            <Link
              key={result.key}
              to={`/learn/${result.chapterId}/${result.lessonId}`}
              className="card group block p-5 transition-transform duration-200 hover:-translate-y-0.5"
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-3">
                <div className="inline-flex items-center gap-2 text-sm font-semibold text-fg group-hover:text-run">
                  {result.kind === "lesson" ? (
                    <BookOpen className="h-4 w-4 text-run" />
                  ) : (
                    <NotebookPen className="h-4 w-4 text-run" />
                  )}
                  {result.lessonTitle}
                </div>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-subtle">
                  {result.kind === "lesson" ? "Lesson" : "Note"}
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                </span>
              </div>
              <p className="mb-2 text-xs font-medium uppercase tracking-[0.16em] text-subtle">
                {result.chapterTitle}
              </p>
              {result.kind === "lesson" && (
                <p className="mb-3 text-sm text-muted">{result.summary}</p>
              )}
              <p className="text-sm leading-6 text-muted">{result.snippet}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
