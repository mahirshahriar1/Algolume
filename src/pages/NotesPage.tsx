import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Download, NotebookPen, Trash2, ArrowRight, BookOpen, Search } from "lucide-react";
import { getAllNotes, noteKeyFor } from "@/lib/notesStore";
import { getLesson } from "@/content";
import { MarkdownLite } from "@/components/lesson/MarkdownLite";

export function NotesPage() {
  const [tick, setTick] = useState(0);
  const [query, setQuery] = useState("");
  const allNotes = useMemo(() => {
    void tick; // re-read after edits/deletes
    return getAllNotes().map((n) => {
      const [chapterId, lessonId] = n.lessonKey.split("/");
      return { ...n, ref: getLesson(chapterId, lessonId), chapterId, lessonId };
    });
  }, [tick]);

  const q = query.trim().toLowerCase();
  const notes = q
    ? allNotes.filter((n) => {
        const title = n.ref ? `${n.ref.chapter.title} ${n.ref.lesson.title}` : n.lessonKey;
        return n.text.toLowerCase().includes(q) || title.toLowerCase().includes(q);
      })
    : allNotes;

  const remove = (lessonKey: string) => {
    try {
      localStorage.removeItem(noteKeyFor(lessonKey));
    } catch {
      /* ignore */
    }
    setTick((t) => t + 1);
  };

  const exportMd = () => {
    const md = allNotes
      .map((n) => {
        const title = n.ref
          ? `${n.ref.chapter.title} — ${n.ref.lesson.title}`
          : n.lessonKey;
        return `## ${title}\n\n${n.text.trim()}\n`;
      })
      .join("\n");
    const blob = new Blob([`# My Algolume notes\n\n${md}`], {
      type: "text/markdown",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "algolume-notes.md";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="mx-auto max-w-3xl px-5 py-12 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3 inline-flex items-center gap-2">
            <NotebookPen className="h-3.5 w-3.5 text-run" />
            Your notes
          </p>
          <h1 className="font-display text-4xl font-semibold tracking-tight">
            Everything you've jotted down.
          </h1>
          <p className="mt-3 text-muted">
            {allNotes.length} note{allNotes.length === 1 ? "" : "s"}, saved on this device as you read.
          </p>
        </div>
        {allNotes.length > 0 && (
          <button onClick={exportMd} className="btn-ghost">
            <Download className="h-4 w-4" />
            Export Markdown
          </button>
        )}
      </div>

      {allNotes.length > 0 && (
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search your notes…"
            className="h-11 w-full rounded-xl border border-line bg-surface pl-10 pr-3 text-sm text-fg
              placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
          />
        </div>
      )}

      {allNotes.length === 0 ? (
        <div className="card flex flex-col items-center gap-4 p-10 text-center">
          <span className="rounded-2xl bg-elevated p-4 text-subtle">
            <NotebookPen className="h-7 w-7" />
          </span>
          <p className="text-muted">
            No notes yet. Open a lesson and use the notes panel in the right rail.
          </p>
          <Link to="/learn" className="btn-primary">
            <BookOpen className="h-4 w-4" />
            Browse the handbook
          </Link>
        </div>
      ) : notes.length === 0 ? (
        <p className="py-10 text-center text-muted">No notes match “{query}”.</p>
      ) : (
        <div className="space-y-4">
          {notes.map((n) => (
            <div key={n.lessonKey} className="card p-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                {n.ref ? (
                  <Link
                    to={`/learn/${n.chapterId}/${n.lessonId}`}
                    className="group inline-flex items-center gap-2 text-sm font-semibold text-fg hover:text-run"
                  >
                    <span className="text-xs font-normal text-subtle">
                      {n.ref.chapter.title}
                    </span>
                    <span className="text-line">/</span>
                    {n.ref.lesson.title}
                    <ArrowRight className="h-3.5 w-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ) : (
                  <span className="text-sm text-subtle">{n.lessonKey}</span>
                )}
                <button
                  onClick={() => remove(n.lessonKey)}
                  className="text-subtle transition-colors hover:text-swap cursor-pointer"
                  aria-label="Delete note"
                  title="Delete note"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="text-sm [&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
                <MarkdownLite md={n.text} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
