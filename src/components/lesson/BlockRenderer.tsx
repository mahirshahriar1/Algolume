import { Lightbulb, AlertTriangle, Gauge, StickyNote, Sigma, ArrowRight, FlaskConical } from "lucide-react";
import { Link } from "react-router-dom";
import type { CalloutTone, LessonBlock } from "@/content/types";
import { slugify } from "@/lib/slug";
import { cn } from "@/lib/cn";
import { MarkdownLite } from "./MarkdownLite";
import { VizBlock } from "./VizBlock";
import { PlaygroundBlock } from "./PlaygroundBlock";
import { getProblem, DIFFICULTY_LABEL } from "@/lib/problems";

const CALLOUT: Record<
  CalloutTone,
  { icon: typeof Lightbulb; label: string; ring: string; text: string; bg: string }
> = {
  intuition: {
    icon: Lightbulb,
    label: "Intuition",
    ring: "border-compare/40",
    text: "text-compare",
    bg: "bg-compare/10",
  },
  warning: {
    icon: AlertTriangle,
    label: "Watch out",
    ring: "border-swap/40",
    text: "text-swap",
    bg: "bg-swap/10",
  },
  complexity: {
    icon: Gauge,
    label: "Complexity",
    ring: "border-pivot/40",
    text: "text-pivot",
    bg: "bg-pivot/10",
  },
  note: {
    icon: StickyNote,
    label: "Note",
    ring: "border-visited/40",
    text: "text-visited",
    bg: "bg-visited/10",
  },
};

export function BlockRenderer({ block }: { block: LessonBlock }) {
  switch (block.kind) {
    case "prose":
      return <MarkdownLite md={block.md} />;

    case "heading":
      return (
        <h2
          id={slugify(block.text)}
          className="mt-12 mb-2 scroll-mt-24 font-display text-2xl font-semibold tracking-tight"
        >
          {block.text}
        </h2>
      );

    case "callout": {
      const c = CALLOUT[block.tone];
      const Icon = c.icon;
      return (
        <div className={cn("my-6 rounded-xl border p-4", c.ring, c.bg)}>
          <div className={cn("mb-1.5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider", c.text)}>
            <Icon className="h-4 w-4" />
            {c.label}
          </div>
          <div className="[&>p:first-child]:mt-0 [&>p:last-child]:mb-0 text-sm">
            <MarkdownLite md={block.md} />
          </div>
        </div>
      );
    }

    case "viz":
      return (
        <VizBlock
          module={block.module}
          algo={block.algo}
          variant={block.variant}
          size={block.size}
          title={block.title}
        />
      );

    case "playground":
      return <PlaygroundBlock starter={block.starter} title={block.title} />;

    case "derivation":
      return (
        <div className="my-8 rounded-xl border border-line bg-elevated/40 p-5">
          <div className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-subtle">
            <Sigma className="h-4 w-4" />
            {block.title ?? "Deriving the cost"}
          </div>
          <ol className="space-y-3">
            {block.steps.map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-elevated font-mono text-[11px] font-bold text-subtle">
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-mono text-sm text-fg">{s.expr}</div>
                  <div className="text-sm text-muted">{s.note}</div>
                </div>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex items-center gap-2 border-t border-line pt-3">
            <ArrowRight className="h-4 w-4 text-run" />
            <span className="font-mono text-sm font-semibold text-run">{block.result}</span>
          </div>
        </div>
      );

    case "problem": {
      const p = getProblem(block.ref);
      if (!p) return null;
      return (
        <Link
          to={`/problems/${p.id}`}
          className="group my-8 flex items-center gap-4 rounded-xl border border-run/30 bg-run/5 p-4 transition-colors hover:border-run/60 hover:bg-run/10"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-run/15 text-run">
            <FlaskConical className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-run">Practice</span>
              <span className="text-[11px] font-medium text-subtle">{DIFFICULTY_LABEL[p.difficulty]}</span>
            </div>
            <div className="truncate font-display text-base font-semibold text-fg">{p.title}</div>
            <p className="truncate text-sm text-muted">{p.summary}</p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-run transition-transform group-hover:translate-x-0.5" />
        </Link>
      );
    }

    case "divider":
      return <hr className="my-10 border-line" />;
  }
}
