import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Check, Circle, Clock, List, MonitorPlay, NotebookPen } from "lucide-react";
import { CHAPTERS, adjacentLessons, getLesson } from "@/content";
import { BlockRenderer } from "@/components/lesson/BlockRenderer";
import { CopyButton } from "@/components/CopyButton";
import { LessonNotes } from "@/components/lesson/LessonNotes";
import { lessonKey, toggleComplete, useCompleted } from "@/lib/progress";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/cn";

const VIZ_LINKS: Record<string, { to: string; label: string }> = {
  sorting: { to: "/sorting", label: "Sorting visualizer" },
  pathfinding: { to: "/pathfinding", label: "Pathfinding visualizer" },
  array: { to: "/visualizers/array", label: "Array techniques" },
  "sliding-window": { to: "/visualizers/array", label: "Array techniques" },
  "linear-search": { to: "/visualizers/searching", label: "Searching visualizer" },
  "binary-search": { to: "/visualizers/searching", label: "Searching visualizer" },
  "ternary-search": { to: "/visualizers/searching", label: "Searching visualizer" },
  stack: { to: "/visualizers/stack", label: "Stack visualizer" },
  queue: { to: "/visualizers/queue", label: "Queue visualizer" },
  "linked-list": { to: "/visualizers/linked-list", label: "Linked list visualizer" },
  hash: { to: "/visualizers/hash", label: "Hash table visualizer" },
  bst: { to: "/visualizers/trees", label: "Trees visualizer" },
  "red-black-tree": { to: "/visualizers/trees", label: "Trees visualizer" },
  traversal: { to: "/visualizers/traversals", label: "Traversal visualizer" },
  "bellman-ford": { to: "/visualizers/shortest-paths", label: "Graph lab · shortest paths" },
  "floyd-warshall": { to: "/visualizers/shortest-paths", label: "Graph lab · shortest paths" },
  mst: { to: "/visualizers/mst", label: "Graph lab · spanning tree" },
  dsu: { to: "/visualizers/dsu", label: "Graph lab · union-find" },
  heap: { to: "/visualizers/heap", label: "Heap visualizer" },
  dp: { to: "/visualizers/dp", label: "DP table visualizer" },
  bits: { to: "/visualizers/bits", label: "Bit manipulation visualizer" },
  recursion: { to: "/visualizers/recursion", label: "Recursion visualizer" },
  "recursion-tree": { to: "/visualizers/recursion", label: "Recursion visualizer" },
  backtracking: { to: "/visualizers/recursion", label: "Recursion visualizer" },
};

const CHAPTER_VIZ: Record<string, { to: string; label: string }> = {
  foundations: { to: "/visualizers", label: "Browse visualizers" },
  arrays: { to: "/visualizers/array", label: "Array techniques" },
  searching: { to: "/visualizers/searching", label: "Searching visualizer" },
  sorting: { to: "/sorting", label: "Sorting visualizer" },
  recursion: { to: "/visualizers/recursion", label: "Recursion visualizer" },
  "linked-lists": { to: "/visualizers/linked-list", label: "Linked list visualizer" },
  "stacks-queues": { to: "/visualizers/stack", label: "Stack visualizer" },
  hashing: { to: "/visualizers/hash", label: "Hash table visualizer" },
  trees: { to: "/visualizers/trees", label: "Trees visualizer" },
  traversals: { to: "/visualizers/traversals", label: "Traversal visualizer" },
  heaps: { to: "/visualizers/heap", label: "Heap visualizer" },
  "dynamic-programming": { to: "/visualizers/dp", label: "DP table visualizer" },
  "bit-manipulation": { to: "/visualizers/bits", label: "Bit manipulation visualizer" },
  pathfinding: { to: "/pathfinding", label: "Pathfinding visualizer" },
  "minimum-spanning-trees": { to: "/visualizers/mst", label: "Graph algorithms lab" },
};

export function LessonPage() {
  const { chapterId = "", lessonId = "" } = useParams();
  const ref = getLesson(chapterId, lessonId);
  const completed = useCompleted();
  const [progress, setProgress] = useState(0);
  const spineRef = useRef<HTMLDivElement>(null);
  const activeLessonRef = useRef<HTMLAnchorElement>(null);

  // Scroll to top on lesson change + track reading progress.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId, lessonId]);

  // Slide the chapter spine so the current lesson is centered in view, without
  // scrolling the whole page.
  useEffect(() => {
    const container = spineRef.current;
    const active = activeLessonRef.current;
    if (!container || !active) return;
    const c = container.getBoundingClientRect();
    const a = active.getBoundingClientRect();
    container.scrollTop += a.top - c.top - (container.clientHeight / 2 - a.height / 2);
  }, [chapterId, lessonId]);

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? window.scrollY / max : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [chapterId, lessonId]);

  if (!ref) return <Navigate to="/learn" replace />;

  const { chapter, lesson } = ref;
  const { prev, next } = adjacentLessons(chapterId, lessonId);
  const chapterNo = CHAPTERS.findIndex((c) => c.id === chapterId) + 1;
  const lessonNo = chapter.lessons.findIndex((l) => l.id === lessonId) + 1;
  const thisKey = lessonKey(chapterId, lessonId);
  const isDone = completed.has(thisKey);
  const outline = [
    { id: "overview", text: "Overview", index: -1 },
    ...lesson.blocks.flatMap((block, index) => {
      if (block.kind === "heading") {
        return [{ id: slugify(block.text), text: block.text, index }];
      }
      if (block.kind === "viz" && block.title) {
        return [{ id: `viz-${index}-${slugify(block.title)}`, text: block.title, index }];
      }
      if (block.kind === "derivation") {
        const text = block.title ?? "Deriving the cost";
        return [{ id: `derive-${index}-${slugify(text)}`, text, index }];
      }
      return [];
    }),
  ];
  const outlineIdByIndex = new Map(outline.filter((item) => item.index >= 0).map((item) => [item.index, item.id]));
  const visualizerLinks = Array.from(
    new Map(
      [
        ...lesson.blocks.flatMap((block) =>
          block.kind === "viz" && VIZ_LINKS[block.module] ? [VIZ_LINKS[block.module]] : [],
        ),
        CHAPTER_VIZ[chapterId] ?? { to: "/visualizers", label: "Browse visualizers" },
      ].map((link) => [link.to, link]),
    ).values(),
  );

  return (
    <>
      {/* Reading progress bar */}
      <div className="sticky top-16 z-20 h-0.5 bg-transparent">
        <div
          className="h-full bg-run transition-[width] duration-150"
          style={{ width: `${progress * 100}%` }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[220px_minmax(0,1fr)_230px]">
        {/* Left: the book's spine */}
        <aside className="hidden lg:block">
          <div ref={spineRef} className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-auto pr-2">
            <Link
              to="/learn"
              className="mb-4 flex items-center gap-1.5 text-xs font-medium text-muted hover:text-fg"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              All chapters
            </Link>
            {CHAPTERS.map((c) => (
              <div key={c.id} className="mb-5">
                <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                  {c.title}
                </p>
                <ul className="space-y-0.5 border-l border-line">
                  {c.lessons.map((l) => {
                    const active = c.id === chapterId && l.id === lessonId;
                    const done = completed.has(lessonKey(c.id, l.id));
                    return (
                      <li key={l.id}>
                        <Link
                          ref={active ? activeLessonRef : undefined}
                          to={`/learn/${c.id}/${l.id}`}
                          className={cn(
                            "-ml-px flex items-center gap-2 border-l-2 py-1 pl-3 text-sm transition-colors",
                            active
                              ? "border-run font-medium text-fg"
                              : "border-transparent text-muted hover:border-line hover:text-fg",
                          )}
                        >
                          {done ? (
                            <Check className="h-3.5 w-3.5 shrink-0 text-run" />
                          ) : (
                            <Circle className="h-3.5 w-3.5 shrink-0 text-line" />
                          )}
                          <span className="min-w-0 truncate">{l.title}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </aside>

        {/* Center: the lesson */}
        <article className="min-w-0">
          <div className="flex items-center gap-2 text-sm font-medium">
            <span className="font-mono text-xs text-subtle">
              Ch {String(chapterNo).padStart(2, "0")}
            </span>
            <Link to="/learn" className="text-compare hover:underline">
              {chapter.title}
            </Link>
          </div>
          <h1 id="overview" className="mt-2 scroll-mt-24 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
            {lesson.title}
          </h1>
          <p className="mt-3 text-lg text-muted">{lesson.summary}</p>
          <div className="mt-3 flex items-center gap-3 text-xs text-subtle">
            <span>
              Lesson {lessonNo} of {chapter.lessons.length}
            </span>
            <span className="h-3 w-px bg-line" />
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {lesson.estMinutes} min read
            </span>
            <span className="h-3 w-px bg-line" />
            <CopyButton text={typeof window !== "undefined" ? window.location.href : ""} label="Copy link" />
          </div>

          <hr className="my-8 border-line" />

          <div className="text-[15px]">
            {lesson.blocks.map((block, i) => {
              const anchor = block.kind === "heading" ? undefined : outlineIdByIndex.get(i);
              return (
                <div key={i} id={anchor} className={anchor ? "scroll-mt-24" : undefined}>
                  <BlockRenderer block={block} />
                </div>
              );
            })}
          </div>

          {/* Mark complete */}
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => toggleComplete(thisKey)}
              className={cn(
                "btn",
                isDone
                  ? "bg-run/15 text-run ring-1 ring-run/40 hover:bg-run/20"
                  : "btn-primary",
              )}
            >
              <Check className="h-4 w-4" />
              {isDone ? "Completed — click to undo" : "Mark this lesson complete"}
            </button>
          </div>

          {/* Prev / next */}
          <nav className="mt-10 grid grid-cols-1 gap-3 border-t border-line pt-6 sm:grid-cols-2">
            {prev ? (
              <Link
                to={`/learn/${prev.chapter.id}/${prev.lesson.id}`}
                className="card card-hover group flex items-center gap-3 p-4"
              >
                <ArrowLeft className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-fg" />
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider text-subtle">
                    Previous
                  </span>
                  <span className="block truncate font-medium">{prev.lesson.title}</span>
                </span>
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link
                to={`/learn/${next.chapter.id}/${next.lesson.id}`}
                className="card card-hover group flex items-center justify-end gap-3 p-4 text-right"
              >
                <span className="min-w-0">
                  <span className="block text-[11px] uppercase tracking-wider text-subtle">
                    Next
                  </span>
                  <span className="block truncate font-medium">{next.lesson.title}</span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-muted transition-colors group-hover:text-fg" />
              </Link>
            ) : (
              <span />
            )}
          </nav>
        </article>

        {/* Right: on this page + notes */}
        <aside className="hidden lg:block">
          <div className="sticky top-24 space-y-5">
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                <List className="h-3.5 w-3.5" />
                On this page
              </p>
              <ul className="space-y-1 border-l border-line">
                {outline.map((item) => (
                  <li key={item.id}>
                    <a
                      href={`#${item.id}`}
                      className="-ml-px block border-l-2 border-transparent py-0.5 pl-3 text-sm text-muted transition-colors hover:border-line hover:text-fg"
                    >
                      {item.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">
                <MonitorPlay className="h-3.5 w-3.5" />
                Practice visually
              </p>
              <div className="space-y-2">
                {visualizerLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="card card-hover flex items-center justify-between gap-2 px-3 py-2 text-sm font-medium"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="h-3.5 w-3.5 text-subtle" />
                  </Link>
                ))}
              </div>
            </div>
            <LessonNotes lessonKey={`${chapterId}/${lessonId}`} />
            <Link
              to="/notes"
              className="flex items-center gap-1.5 px-1 text-xs font-medium text-muted hover:text-fg"
            >
              <NotebookPen className="h-3.5 w-3.5" />
              View all notes
            </Link>
          </div>
        </aside>
      </div>
    </>
  );
}
