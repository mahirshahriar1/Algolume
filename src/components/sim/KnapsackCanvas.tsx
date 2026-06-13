import type { KnapsackFrame, KnapRole } from "@/lib/sims/knapsack";
import { cn } from "@/lib/cn";

const ROW: Record<KnapRole, string> = {
  default: "border-line bg-surface",
  active: "border-compare bg-compare/10",
  full: "border-run/50 bg-run/10",
  partial: "border-pivot/50 bg-pivot/10",
  skipped: "border-line bg-elevated opacity-60",
};
const BADGE: Record<KnapRole, string> = {
  default: "",
  active: "text-compare",
  full: "text-run",
  partial: "text-pivot",
  skipped: "text-subtle",
};

export function KnapsackCanvas({ frame }: { frame: KnapsackFrame | undefined }) {
  if (!frame) return null;
  const fill = Math.min(100, (frame.usedWeight / frame.capacity) * 100);

  return (
    <div className="w-full space-y-3">
      {/* capacity gauge */}
      <div>
        <div className="mb-1 flex items-center justify-between text-[11px] text-subtle">
          <span className="font-semibold uppercase tracking-wider">Bag fill</span>
          <span className="font-mono">{frame.usedWeight} / {frame.capacity}</span>
        </div>
        <div className="h-4 overflow-hidden rounded-full bg-elevated">
          <div className="h-full rounded-full bg-run transition-[width] duration-200" style={{ width: `${fill}%` }} />
        </div>
      </div>

      {/* items sorted by ratio */}
      <div className="space-y-1.5">
        {frame.items.map((it) => (
          <div key={it.id} className={cn("flex items-center gap-3 rounded-lg border px-3 py-2 transition-colors", ROW[it.role])}>
            <div className="flex-1">
              <div className="flex items-center gap-2 font-mono text-sm text-fg">
                <span>v={it.value}</span>
                <span className="text-subtle">w={it.weight}</span>
                <span className="rounded bg-elevated px-1.5 py-0.5 text-[11px] text-muted">ratio {it.ratio}</span>
              </div>
              {/* taken fraction bar */}
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-elevated">
                <div
                  className={cn("h-full rounded-full", it.role === "partial" ? "bg-pivot" : "bg-run")}
                  style={{ width: `${it.taken * 100}%` }}
                />
              </div>
            </div>
            <span className={cn("w-16 text-right font-mono text-xs font-semibold", BADGE[it.role])}>
              {it.role === "full" ? "100%" : it.role === "partial" ? `${Math.round(it.taken * 100)}%` : it.role === "skipped" ? "skip" : "—"}
            </span>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-run/40 bg-run/10 px-4 py-2 text-center">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-subtle">Total value </span>
        <span className="font-mono text-lg font-semibold text-run">{frame.totalValue}</span>
      </div>
    </div>
  );
}
