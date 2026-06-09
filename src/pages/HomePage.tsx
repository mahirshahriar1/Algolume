import { Link } from "react-router-dom";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  Github,
  Linkedin,
  Network,
  Play,
  Sparkles,
} from "lucide-react";
import {
  SortBarsPreview,
  GridPreview,
  PlaybackPreview,
  ChallengePreview,
} from "@/components/LandingPreviews";
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

const TOPICS = [
  {
    to: "/sorting",
    icon: BarChart3,
    title: "Sorting",
    desc: "Bubble, insertion, selection, merge & quick sort — watch comparisons and swaps unfold.",
    accent: "text-swap",
  },
  {
    to: "/pathfinding",
    icon: Network,
    title: "Pathfinding",
    desc: "BFS, DFS, Dijkstra and A* on an interactive grid. Draw walls and watch the frontier expand.",
    accent: "text-compare",
  },
];

export function HomePage() {
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
        </div>

        <div className="animate-fade-in [animation-delay:120ms]">
          <div className="card card-hover h-80 overflow-hidden sm:h-96">
            <SortBarsPreview />
          </div>
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

      {/* Topics */}
      <section className="py-16">
        <p className="eyebrow mb-3">Start exploring</p>
        <h2 className="mb-8 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Pick a topic.
        </h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {TOPICS.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="card card-hover group flex flex-col gap-3 p-6"
            >
              <span className={cn("w-fit rounded-xl bg-elevated p-3", t.accent)}>
                <t.icon className="h-6 w-6" />
              </span>
              <h3 className="font-display text-xl font-semibold">{t.title}</h3>
              <p className="text-sm leading-relaxed text-muted">{t.desc}</p>
              <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-run">
                Open visualizer
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="border-t border-line py-10 text-center">
        <p className="font-display text-lg font-semibold">
          Algo<span className="text-run">lume</span>
        </p>
        <p className="mt-1 text-xs text-subtle">
          One place to learn algorithms — read, watch, play, practice, take notes.
        </p>
        <div className="mt-4 flex items-center justify-center gap-3">
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
        </div>
      </footer>
    </div>
  );
}
