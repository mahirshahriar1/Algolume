import type { KadaneFrame, KadaneCellRole } from "@/lib/sims/kadane";
import { cn } from "@/lib/cn";

const CELL: Record<KadaneCellRole, string> = {
  default: "border-line bg-surface text-fg",
  current: "border-compare bg-compare/20 text-compare font-bold",
  window: "border-compare/40 bg-compare/10 text-fg",
  best: "border-run/50 bg-run/15 text-run",
  bestcurrent: "border-run bg-run/25 text-run font-bold",
};

export function KadaneCanvas({ frame }: { frame: KadaneFrame | undefined }) {
  if (!frame) return null;
  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-end justify-center gap-1.5">
        {frame.values.map((v, i) => (
          <div key={i} className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-11 w-11 items-center justify-center rounded-md border font-mono text-sm transition-colors duration-150",
                CELL[frame.roles[i] ?? "default"],
              )}
            >
              {v}
            </div>
            <span className="mt-0.5 font-mono text-[10px] text-subtle">{i}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-3">
        <div className="rounded-lg border border-compare/40 bg-compare/10 px-4 py-2 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-subtle">Running sum</div>
          <div className="font-mono text-xl font-semibold text-compare">{frame.cur}</div>
        </div>
        <div className="rounded-lg border border-run/40 bg-run/10 px-4 py-2 text-center">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-subtle">Best so far</div>
          <div className="font-mono text-xl font-semibold text-run">{frame.best}</div>
        </div>
      </div>

      <div className="flex flex-wrap justify-center gap-x-3 gap-y-1.5">
        {[
          { label: "Current element", cls: "bg-compare" },
          { label: "Current window", cls: "bg-compare/40" },
          { label: "Best window", cls: "bg-run/60" },
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
