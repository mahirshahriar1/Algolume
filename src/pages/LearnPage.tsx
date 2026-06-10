import { Link } from "react-router-dom";
import {
  ArrowLeft, ArrowRight, BarChart3, Binary, BookOpen, Check, Clock, Compass, Gauge, GitBranch,
  Grid3x3, Hash, Layers, ListTree, MonitorPlay, Network, Play, Repeat, RotateCcw, Rows3,
  Search, Sigma, Spline, Terminal, Triangle, type LucideIcon,
} from "lucide-react";
import { CHAPTERS, LESSON_COUNT, TOTAL_MINUTES } from "@/content";
import type { Chapter, Lesson } from "@/content/types";
import { lessonKey, useCompleted } from "@/lib/progress";
import { cn } from "@/lib/cn";

const ICONS: Record<string, LucideIcon> = {
  Compass, Rows3, Search, BarChart3, Repeat, Spline, Layers, Hash, GitBranch, ListTree, Network, Terminal, Triangle, Grid3x3, Binary, Sigma, Gauge,
};

/** Categorise a lesson by what it contains, for its branch icon. */
function lessonKind(lesson: Lesson): { Icon: LucideIcon; tint: string; label: string } {
  if (lesson.blocks.some((b) => b.kind === "viz"))
    return { Icon: MonitorPlay, tint: "text-compare", label: "Interactive" };
  if (lesson.blocks.some((b) => b.kind === "derivation"))
    return { Icon: Sigma, tint: "text-pivot", label: "Derivation" };
  return { Icon: BookOpen, tint: "text-muted", label: "Reading" };
}

export function LearnPage() {
  const completed = useCompleted();
  const doneCount = completed.size;
  const pct = LESSON_COUNT > 0 ? Math.round((doneCount / LESSON_COUNT) * 100) : 0;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6">
      {/* Header */}
      <div className="mb-14 max-w-2xl">
        <p className="eyebrow mb-3 inline-flex items-center gap-2">
          <BookOpen className="h-3.5 w-3.5 text-run" />
          The handbook
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Your algorithms <span className="text-run">roadmap.</span>
        </h1>
        <p className="mt-4 text-lg text-muted">
          Follow the path module by module — read the idea, watch it run, and take
          notes. Each branch is a lesson; tick them off as you go.
        </p>
        <div className="mt-5 flex items-center gap-5 text-sm text-subtle">
          <span>{CHAPTERS.length} modules</span>
          <span className="h-3 w-px bg-line" />
          <span>{LESSON_COUNT} lessons</span>
          <span className="h-3 w-px bg-line" />
          <span>~{TOTAL_MINUTES} min</span>
        </div>
        {doneCount > 0 && (
          <div className="mt-6 max-w-md">
            <div className="mb-1.5 flex items-center justify-between text-xs text-muted">
              <span>Overall progress</span>
              <span className="font-mono text-fg">{doneCount}/{LESSON_COUNT} · {pct}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-run transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
          </div>
        )}
      </div>

      {/* Roadmap */}
      <div className="space-y-14">
        {CHAPTERS.map((chapter, i) => (
          <ModuleRow key={chapter.id} chapter={chapter} index={i} completed={completed} />
        ))}
      </div>
    </div>
  );
}

function ModuleRow({ chapter, index, completed }: { chapter: Chapter; index: number; completed: Set<string> }) {
  const Icon = ICONS[chapter.icon] ?? Compass;
  const total = chapter.lessons.length;
  const done = chapter.lessons.filter((l) => completed.has(lessonKey(chapter.id, l.id))).length;
  const pct = Math.round((done / total) * 100);
  const next = chapter.lessons.find((l) => !completed.has(lessonKey(chapter.id, l.id))) ?? chapter.lessons[0];
  const ctaLabel = done === 0 ? "Start module" : done === total ? "Review" : "Continue";
  const CtaIcon = done === 0 ? Play : done === total ? RotateCcw : ArrowRight;
  const flip = index % 2 === 1; // alternate: even left, odd right

  return (
    <div className={cn("grid items-center gap-x-6 gap-y-5", flip ? "lg:grid-cols-[1fr_310px]" : "lg:grid-cols-[310px_1fr]")}>
      {/* Module node */}
      <div className={cn("relative", flip ? "lg:order-2" : "lg:order-1")}>
        <div className="card p-5">
          <span className="mb-3 inline-flex items-center gap-1.5 rounded-md border border-visited/40 bg-visited/10 px-2 py-0.5 text-[11px] font-semibold text-visited">
            <Icon className="h-3.5 w-3.5" />
            Module {index + 1}
          </span>
          <h2 className="font-display text-lg font-semibold tracking-tight">{chapter.title}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted">{chapter.blurb}</p>

          <div className="mt-4 flex items-center gap-4 text-xs text-subtle">
            <span className="flex items-center gap-1"><ListTree className="h-3.5 w-3.5" />{total} lessons</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" />~{chapter.lessons.reduce((s, l) => s + l.estMinutes, 0)} min</span>
          </div>

          <div className="mt-3">
            <div className="h-1.5 overflow-hidden rounded-full bg-line">
              <div className="h-full rounded-full bg-run transition-[width] duration-300" style={{ width: `${pct}%` }} />
            </div>
            <div className="mt-1 text-[11px] text-subtle">{done}/{total} complete</div>
          </div>

          <Link to={`/learn/${chapter.id}/${next.id}`} className={cn("mt-4 w-full", done === total ? "btn-ghost" : "btn-primary")}>
            <CtaIcon className={cn("h-4 w-4", done === 0 && "fill-current")} />
            {ctaLabel}
          </Link>
        </div>
        {/* connector stub from the module into the trunk (lg only) */}
        <span
          className={cn(
            "absolute top-1/2 hidden h-[2px] w-8 -translate-y-1/2 bg-line lg:block",
            flip ? "left-0 -translate-x-full" : "right-0 translate-x-full",
          )}
        />
      </div>

      {/* Lessons branching off a trunk */}
      <div className={cn("relative", flip ? "lg:order-1" : "lg:order-2")}>
        <span
          className={cn("absolute top-5 bottom-5 hidden w-[2px] bg-line lg:block", flip ? "right-2" : "left-2")}
          aria-hidden="true"
        />
        <ol className={cn("space-y-3", flip ? "lg:pr-12" : "lg:pl-12")}>
          {chapter.lessons.map((lesson) => {
            const isDone = completed.has(lessonKey(chapter.id, lesson.id));
            const kind = lessonKind(lesson);
            return (
              <li key={lesson.id} className="relative">
                {/* branch line + node (mirrored on flipped rows) */}
                <span
                  className={cn("absolute top-1/2 hidden h-[2px] w-10 -translate-y-1/2 bg-line lg:block", flip ? "right-2" : "left-2")}
                  aria-hidden="true"
                />
                <span
                  className={cn(
                    "absolute top-1/2 z-10 hidden h-3 w-3 -translate-y-1/2 rounded-full ring-4 ring-base lg:block",
                    flip ? "right-2 translate-x-1/2" : "left-2 -translate-x-1/2",
                    isDone ? "bg-run" : "bg-elevated",
                  )}
                  aria-hidden="true"
                >
                  {isDone && <Check className="absolute inset-0 m-auto h-2 w-2 text-base" />}
                </span>

                <Link
                  to={`/learn/${chapter.id}/${lesson.id}`}
                  className={cn(
                    "card card-hover group flex items-center gap-3 p-3.5 lg:max-w-md",
                    flip ? "flex-row-reverse pl-4 text-right lg:ml-auto" : "pr-4",
                  )}
                >
                  <span className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-elevated", kind.tint)}>
                    {isDone ? <Check className="h-4 w-4 text-run" /> : <kind.Icon className="h-4 w-4" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-fg group-hover:text-run">{lesson.title}</span>
                    <span className="block truncate text-xs text-subtle">{kind.label} · {lesson.estMinutes} min</span>
                  </span>
                  {flip ? (
                    <ArrowLeft className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:-translate-x-1 group-hover:text-run" />
                  ) : (
                    <ArrowRight className="h-4 w-4 shrink-0 text-subtle transition-transform group-hover:translate-x-1 group-hover:text-run" />
                  )}
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </div>
  );
}
