import { Link } from "react-router-dom";
import {
  ArrowRight,
  BookOpen,
  Code2,
  FlaskConical,
  Github,
  Linkedin,
  MonitorPlay,
  NotebookPen,
  Play,
  Sparkles,
} from "lucide-react";
import {
  SortBarsPreview,
  GridPreview,
  PlaybackPreview,
  ChallengePreview,
} from "@/components/LandingPreviews";
import { CHAPTERS, LESSON_COUNT } from "@/content";
import { PROBLEM_COUNT } from "@/lib/problems";
import { VISUALIZERS } from "@/pages/visualizers/registry";
import { VizThumb } from "@/pages/visualizers/VizThumb";
import { cn } from "@/lib/cn";

/* Editorial feature row: prose on one side, a floating paper card on the other. */
function FeatureRow({
  eyebrow,
  lead,
  leadClass,
  rest,
  points,
  media,
  reverse,
}: {
  eyebrow: string;
  lead: string;
  leadClass: string;
  rest: string;
  points: string[];
  media: React.ReactNode;
  reverse?: boolean;
}) {
  return (
    <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={cn(reverse && "lg:order-2")}>
        <p className="eyebrow mb-4">{eyebrow}</p>
        <h2 className="font-display text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
          <span className={leadClass}>{lead}</span> {rest}
        </h2>
        <ul className="mt-6 space-y-3">
          {points.map((p) => (
            <li key={p} className="flex gap-3 text-[15px] leading-relaxed text-muted">
              <span
                className={cn("mt-2 h-1.5 w-1.5 shrink-0 rounded-full", leadClass.replace("text-", "bg-"))}
              />
              {p}
            </li>
          ))}
        </ul>
      </div>
      <div className={cn(reverse && "lg:order-1")}>
        <div className="card card-hover overflow-hidden">{media}</div>
      </div>
    </div>
  );
}

const PILLARS = [
  { icon: BookOpen, title: "Read", desc: "Book-quality lessons, sectioned like university notes.", accent: "text-run" },
  { icon: MonitorPlay, title: "Watch", desc: "Every concept pairs with a live, step-through visualizer.", accent: "text-compare" },
  { icon: Code2, title: "Play", desc: "Run real Python in the in-browser playground.", accent: "text-pivot" },
  { icon: FlaskConical, title: "Practice", desc: "Laddered problems graded against hidden tests.", accent: "text-swap" },
  { icon: NotebookPen, title: "Note", desc: "Jot notes per lesson — and sync them across devices.", accent: "text-visited" },
];

const TINT: Record<string, string> = {
  "text-run": "bg-run/10",
  "text-compare": "bg-compare/10",
  "text-pivot": "bg-pivot/10",
  "text-swap": "bg-swap/10",
  "text-visited": "bg-visited/10",
};

const FEATURED_IDS = ["sorting", "pathfinding", "trees", "graphs", "dp", "greedy"];

export function HomePage() {
  const vizById = Object.fromEntries(VISUALIZERS.map((v) => [v.id, v]));
  const featured = FEATURED_IDS.map((id) => vizById[id]).filter(Boolean);

  const stats = [
    { value: CHAPTERS.length, label: "Chapters" },
    { value: LESSON_COUNT, label: "Lessons" },
    { value: PROBLEM_COUNT, label: "Problems" },
    { value: VISUALIZERS.length, label: "Visualizers" },
  ];

  return (
    <div className="mx-auto max-w-6xl px-5 sm:px-6">
      {/* Hero */}
      <section className="grid grid-cols-1 items-center gap-12 py-16 lg:grid-cols-[1.1fr_1fr] lg:py-24">
        <div className="animate-fade-in">
          <p className="eyebrow mb-5 inline-flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5 text-pivot" />
            The interactive DSA handbook
          </p>
          <h1 className="font-display text-5xl font-semibold leading-[0.98] tracking-tight sm:text-6xl lg:text-7xl">
            <span className="text-swap">Visualize</span> every
            <br />
            algorithm.
          </h1>
          <p className="mt-6 max-w-md text-lg leading-relaxed text-muted">
            Don't just read about data structures and algorithms — watch them
            run. Step through real executions, rewind any line, and experiment
            with your own inputs.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link to="/learn" className="btn-primary text-base">
              <BookOpen className="h-4 w-4" />
              Open the handbook
            </Link>
            <Link
              to="/visualizers"
              className="btn border-2 border-run/50 bg-run/10 text-run hover:bg-run/15 dark:border-run/60 dark:bg-run/20 dark:text-white dark:hover:bg-run/30"
            >
              <Play className="h-4 w-4 fill-current" />
              Jump to a visualizer
            </Link>
          </div>
          <p className="mt-5 text-xs text-subtle">Free · no signup · runs entirely in your browser.</p>
        </div>

        <div className="animate-fade-in [animation-delay:120ms]">
          <div className="card card-hover h-80 overflow-hidden sm:h-96">
            <SortBarsPreview />
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="rounded-xl border border-line bg-surface px-4 py-4 text-center">
            <div className="font-display text-3xl font-semibold tracking-tight text-fg">{s.value}</div>
            <div className="mt-0.5 text-xs font-medium uppercase tracking-wider text-subtle">{s.label}</div>
          </div>
        ))}
      </section>

      {/* Five pillars */}
      <section className="py-16">
        <p className="eyebrow mb-3">All in one page</p>
        <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Five ways to learn, woven together.
        </h2>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {PILLARS.map((p) => (
            <div key={p.title} className="card flex flex-col gap-2 p-4">
              <span className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-elevated", p.accent)}>
                <p.icon className="h-5 w-5" />
              </span>
              <h3 className="font-display text-base font-semibold text-fg">{p.title}</h3>
              <p className="text-xs leading-relaxed text-muted">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Feature rows */}
      <section id="features" className="scroll-mt-20 space-y-24 py-12 sm:space-y-32">
        <FeatureRow
          eyebrow="Rich visualizers"
          lead="See"
          leadClass="text-swap"
          rest="the algorithm move."
          points={[
            "Every core concept comes with a dynamic visualizer you can experiment with.",
            "All interactive elements are procedurally generated from your own inputs.",
            "A playback system lets you pause, rewind and step through any part of the run.",
          ]}
          media={
            <div className="h-72">
              <GridPreview />
            </div>
          }
        />

        <FeatureRow
          reverse
          eyebrow="Step-by-step execution"
          lead="Trace"
          leadClass="text-visited"
          rest="every line."
          points={[
            "Pause, rewind, or restart an execution with full control over the pace.",
            "Watch exactly how each variable changes as the program runs, in real time.",
            "Bring your own values to test edge cases and corner-case scenarios.",
          ]}
          media={<PlaybackPreview />}
        />

        <FeatureRow
          eyebrow="Practice & verify"
          lead="Practice"
          leadClass="text-run"
          rest="until it clicks."
          points={[
            "Work through focused challenges at the end of each topic.",
            "Write and run real code in the browser, checked against hidden test cases.",
            "Detailed explanations, multiple solutions and complexity analysis.",
          ]}
          media={<ChallengePreview />}
        />
      </section>

      {/* Featured visualizers */}
      <section className="py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-3">Start exploring</p>
            <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
              Jump straight into a visualizer.
            </h2>
          </div>
          <Link to="/visualizers" className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-run hover:underline sm:inline-flex">
            All visualizers
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <Link
              key={v.id}
              to={v.to ?? `/visualizers/${v.id}`}
              className="card card-hover group flex flex-col overflow-hidden"
            >
              <div className={cn("flex h-24 items-center justify-center border-b border-line", TINT[v.accent] ?? "bg-elevated")}>
                <span className={cn("transition-transform duration-300 group-hover:scale-110", v.accent)}>
                  <VizThumb id={v.id} />
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-display text-base font-semibold text-fg">{v.title}</h3>
                <p className="mt-1 flex-1 text-sm leading-relaxed text-muted">{v.blurb}</p>
                <span className={cn("mt-3 inline-flex items-center gap-1 text-sm font-semibold", v.accent)}>
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="pb-20">
        <div className="card overflow-hidden p-10 text-center sm:p-14">
          <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">
            Stop memorizing. Start <span className="text-run">seeing</span> how it works.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-muted">
            Read, watch it run, run your own code, and prove it with problems — from
            Big-O all the way to bitmask DP.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            <Link to="/learn" className="btn-primary text-base">
              <BookOpen className="h-4 w-4" />
              Start with the handbook
            </Link>
            <Link
              to="/problems"
              className="btn border-2 border-line bg-surface text-fg hover:bg-elevated text-base"
            >
              <FlaskConical className="h-4 w-4" />
              Try a problem
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-line py-10 text-center">
        <p className="font-display text-lg font-semibold">
          Algo<span className="text-run">lume</span>
        </p>
        <p className="mt-1 text-xs text-subtle">
          One place to learn algorithms — read, watch, play, practice, take notes.
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://github.com/mahirshahriar1/Algolume"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
          >
            <Github className="h-4 w-4" />
            GitHub
          </a>
          <span className="h-3 w-px bg-line" aria-hidden="true" />
          <a
            href="https://www.linkedin.com/in/mahir-shahriar-tamim/"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-fg"
          >
            <Linkedin className="h-4 w-4" />
            Mahir Shahriar
          </a>
          <span className="h-3 w-px bg-line" aria-hidden="true" />
          <Link to="/issue" className="text-sm text-muted transition-colors hover:text-fg">
            Submit an issue
          </Link>
        </div>
      </footer>
    </div>
  );
}
