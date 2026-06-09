import { ArrowRight } from "lucide-react";
import type { SeqFrame, SeqRole } from "@/lib/sims/types";
import { cn } from "@/lib/cn";

const ROLE: Record<SeqRole, string> = {
  default: "bg-elevated border-line text-fg",
  active: "bg-compare border-compare text-white",
  compare: "bg-pivot border-pivot text-white",
  match: "bg-run border-run text-white",
  done: "bg-run/20 border-run/40 text-fg",
  new: "bg-run/20 border-run text-fg",
  removed: "bg-swap/15 border-swap/40 text-subtle line-through",
  dim: "bg-elevated border-line text-subtle opacity-40",
};

const TONE: Record<string, string> = {
  run: "text-run",
  compare: "text-compare",
  pivot: "text-pivot",
  swap: "text-swap",
  visited: "text-visited",
};

/**
 * Renders one SeqFrame as labelled boxes with optional pointer markers
 * above and arrows between (for linked lists). Covers arrays, stacks, queues
 * and linked lists. Rows wrap instead of scrolling so lesson embeds stay
 * contained on narrow screens.
 */
export function SeqCanvas({
  frame,
  linked = false,
  showIndices = false,
}: {
  frame: SeqFrame | undefined;
  linked?: boolean;
  showIndices?: boolean;
}) {
  if (!frame) return null;
  const markersAt = (i: number) => (frame.markers ?? []).filter((m) => m.index === i);

  return (
    <div className="flex max-w-full flex-wrap items-end justify-center gap-x-1.5 gap-y-3 sm:gap-x-2">
      {frame.items.length === 0 && (
        <span className="rounded-lg border border-dashed border-line px-6 py-4 text-sm text-subtle">
          empty
        </span>
      )}
      {frame.items.map((it, i) => (
        <div key={it.key} className="flex items-center">
          <div className="flex flex-col items-center">
            {/* pointer markers */}
            <div className="flex h-5 items-end gap-1">
              {markersAt(i).map((m, k) => (
                <span
                  key={k}
                  className={cn(
                    "font-mono text-[11px] font-bold leading-none",
                    m.tone ? TONE[m.tone] : "text-subtle",
                  )}
                >
                  {m.label}↓
                </span>
              ))}
            </div>
            <div
              className={cn(
                "flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-sm font-bold shadow-sm transition-colors duration-200 sm:h-10 sm:w-10 lg:h-11 lg:w-11",
                ROLE[it.role ?? "default"],
                it.role === "new" && "animate-pop-in",
              )}
            >
              {it.label}
            </div>
            {showIndices && (
              <span className="mt-1 font-mono text-[10px] text-subtle">{i}</span>
            )}
          </div>
          {linked && i < frame.items.length - 1 && (
            <ArrowRight className="mx-0.5 h-4 w-4 shrink-0 text-subtle" />
          )}
        </div>
      ))}
      {linked && frame.items.length > 0 && (
        <span className="ml-1 self-center font-mono text-xs text-subtle">→ null</span>
      )}
    </div>
  );
}
