import type { GreedyFrame, IntervalRole } from "@/lib/sims/greedy";
import { cn } from "@/lib/cn";

const BAR: Record<IntervalRole, string> = {
  default: "bg-elevated border-line text-fg",
  active: "bg-compare/20 border-compare text-compare",
  selected: "bg-run/20 border-run text-run",
  rejected: "bg-bar/20 border-line text-subtle line-through opacity-60",
};

export function GreedyCanvas({ frame }: { frame: GreedyFrame | undefined }) {
  if (!frame) return null;
  const { intervals, timeMax, lastFinish } = frame;
  const pct = (t: number) => (t / timeMax) * 100;

  return (
    <div className="w-full space-y-2">
      <div className="relative">
        {/* last-finish marker */}
        {lastFinish !== null && (
          <div
            className="absolute top-0 bottom-5 z-10 w-px bg-run/70"
            style={{ left: `${pct(lastFinish)}%` }}
          >
            <span className="absolute -top-1 -translate-x-1/2 rounded bg-run px-1 font-mono text-[9px] text-white">
              {lastFinish}
            </span>
          </div>
        )}
        <div className="space-y-1.5">
          {intervals.map((iv) => (
            <div key={iv.id} className="relative h-6">
              <div
                className={cn(
                  "absolute flex h-6 items-center justify-center rounded-md border px-1 font-mono text-[11px] transition-colors duration-150",
                  BAR[iv.role],
                )}
                style={{ left: `${pct(iv.start)}%`, width: `${Math.max(6, pct(iv.end - iv.start))}%` }}
                title={`[${iv.start}, ${iv.end}]`}
              >
                {iv.start}–{iv.end}
              </div>
            </div>
          ))}
        </div>
        {/* time axis */}
        <div className="mt-1 flex justify-between border-t border-line pt-1">
          {Array.from({ length: timeMax + 1 }, (_, t) => (
            <span key={t} className="font-mono text-[9px] text-subtle">{t}</span>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {[
          { label: "Considering", cls: "bg-compare" },
          { label: "Selected", cls: "bg-run" },
          { label: "Skipped (overlaps)", cls: "bg-bar/50" },
        ].map((it) => (
          <span key={it.label} className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className={cn("h-2.5 w-2.5 rounded-sm", it.cls)} />
            {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}
