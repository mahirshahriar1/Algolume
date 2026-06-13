import type { SieveFrame, SieveRole } from "@/lib/sims/sieve";
import { cn } from "@/lib/cn";

const CELL: Record<SieveRole, string> = {
  candidate: "border-line bg-surface text-muted",
  prime: "border-run/50 bg-run/15 text-run font-semibold",
  composite: "border-line bg-elevated text-subtle line-through opacity-50",
  current: "border-compare bg-compare/20 text-compare font-bold",
  marking: "border-swap bg-swap/20 text-swap font-bold",
};

export function SieveCanvas({ frame }: { frame: SieveFrame | undefined }) {
  if (!frame) return null;
  const nums = Array.from({ length: frame.n - 1 }, (_, i) => i + 2); // 2..n

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap gap-1.5">
        {nums.map((v) => (
          <div
            key={v}
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-md border font-mono text-xs transition-colors duration-150",
              CELL[frame.roles[v] ?? "candidate"],
            )}
          >
            {v}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {[
          { label: "Current prime p", cls: "bg-compare" },
          { label: "Marking p×k", cls: "bg-swap" },
          { label: "Prime", cls: "bg-run/60" },
          { label: "Composite", cls: "bg-elevated border border-line" },
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
