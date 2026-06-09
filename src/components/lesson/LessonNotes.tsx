import { useEffect, useRef, useState } from "react";
import { Bold, Italic, Code, SquareCode, List, Heading, Check, Eye, NotebookPen, Pencil } from "lucide-react";
import { MarkdownLite } from "./MarkdownLite";
import { cn } from "@/lib/cn";

/**
 * Per-lesson notes, saved to localStorage (debounced). A small markdown toolbar
 * wraps the selection (bold / italic / code / list / heading / code block), with
 * a live preview toggle. Notes render `inline code` and ```fenced blocks```.
 */
export function LessonNotes({ lessonKey }: { lessonKey: string }) {
  const storageKey = `algolume-notes:${lessonKey}`;
  const [value, setValue] = useState("");
  const [saved, setSaved] = useState(true);
  const [preview, setPreview] = useState(false);
  const timer = useRef<number | null>(null);
  const taRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    try {
      setValue(localStorage.getItem(storageKey) ?? "");
    } catch {
      setValue("");
    }
    setSaved(true);
    setPreview(false);
  }, [storageKey]);

  useEffect(() => {
    if (timer.current) window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => {
      try {
        localStorage.setItem(storageKey, value);
        setSaved(true);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => {
      if (timer.current) window.clearTimeout(timer.current);
    };
  }, [value, storageKey]);

  const setCaret = (start: number, end = start) =>
    requestAnimationFrame(() => {
      const ta = taRef.current;
      if (!ta) return;
      ta.focus();
      ta.selectionStart = start;
      ta.selectionEnd = end;
    });

  /** Wrap the current selection with `pre`…`post`. */
  const wrap = (pre: string, post: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const e = ta.selectionEnd;
    setValue(value.slice(0, s) + pre + value.slice(s, e) + post + value.slice(e));
    setSaved(false);
    setCaret(s + pre.length, e + pre.length);
  };

  /** Prefix the current line (for lists / headings). */
  const prefixLine = (prefix: string) => {
    const ta = taRef.current;
    if (!ta) return;
    const s = ta.selectionStart;
    const lineStart = value.lastIndexOf("\n", s - 1) + 1;
    setValue(value.slice(0, lineStart) + prefix + value.slice(lineStart));
    setSaved(false);
    setCaret(s + prefix.length);
  };

  const insertCode = () => {
    const ta = taRef.current;
    const block = "```python\n\n```";
    if (!ta) {
      setValue((v) => v + (v && !v.endsWith("\n") ? "\n" : "") + block + "\n");
      setSaved(false);
      return;
    }
    const s = ta.selectionStart;
    setValue(value.slice(0, s) + block + value.slice(ta.selectionEnd));
    setSaved(false);
    setCaret(s + "```python\n".length);
  };

  const tools: { icon: typeof Bold; label: string; run: () => void }[] = [
    { icon: Bold, label: "Bold", run: () => wrap("**", "**") },
    { icon: Italic, label: "Italic", run: () => wrap("*", "*") },
    { icon: Code, label: "Inline code", run: () => wrap("`", "`") },
    { icon: SquareCode, label: "Code block", run: insertCode },
    { icon: List, label: "List item", run: () => prefixLine("- ") },
    { icon: Heading, label: "Heading", run: () => prefixLine("## ") },
  ];

  return (
    <div className="panel p-3">
      <div className="mb-2 flex items-center justify-between">
        <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-subtle">
          <NotebookPen className="h-3.5 w-3.5" />
          Your notes
        </span>
        {saved ? (
          <span className="flex items-center gap-1 text-[10px] text-run">
            <Check className="h-3 w-3" />
            Saved
          </span>
        ) : (
          <span className="text-[10px] text-subtle">Editing…</span>
        )}
      </div>

      {/* toolbar */}
      <div className="mb-2 flex flex-wrap items-center gap-1">
        {!preview &&
          tools.map((t) => (
            <button
              key={t.label}
              onClick={t.run}
              title={t.label}
              aria-label={t.label}
              className="flex h-7 w-7 items-center justify-center rounded-md border border-line bg-elevated text-muted transition-colors hover:bg-line/60 hover:text-fg cursor-pointer"
            >
              <t.icon className="h-3.5 w-3.5" />
            </button>
          ))}
        <button
          onClick={() => setPreview((p) => !p)}
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-md border border-line px-2 py-1 text-[11px] font-medium transition-colors cursor-pointer",
            preview ? "bg-run/15 text-run" : "bg-elevated text-muted hover:bg-line/60",
          )}
        >
          {preview ? <Pencil className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
          {preview ? "Edit" : "Preview"}
        </button>
      </div>

      {preview ? (
        <div className="min-h-[11rem] rounded-lg border border-line bg-base/60 p-2.5 text-sm">
          {value.trim() ? (
            <div className="[&>*:first-child]:mt-0 [&>*:last-child]:mb-0">
              <MarkdownLite md={value} />
            </div>
          ) : (
            <p className="text-subtle">Nothing to preview yet.</p>
          )}
        </div>
      ) : (
        <textarea
          ref={taRef}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setSaved(false);
          }}
          placeholder="Jot down anything that clicks. Markdown works — select text and use the toolbar."
          className="h-44 w-full resize-y rounded-lg border border-line bg-base/60 p-2.5 font-sans text-sm text-fg
            placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
      )}

      <div className="mt-1.5 text-right text-[10px] text-subtle">{value.length} characters</div>
    </div>
  );
}
