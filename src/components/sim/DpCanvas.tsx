import type { DpFrame, DpRole } from "@/lib/sims/dp";
import { cn } from "@/lib/cn";

const CELL: Record<DpRole, string> = {
  default: "border-line bg-surface text-subtle",
  filled: "border-line bg-elevated text-fg",
  active: "border-compare bg-compare/15 text-compare font-bold",
  dep: "border-pivot/60 bg-pivot/10 text-fg",
  result: "border-run bg-run/15 text-run font-bold",
};

export function DpCanvas({ frame }: { frame: DpFrame | undefined }) {
  if (!frame) return null;
  const { rows, cols, cells, rowLabels, colLabels } = frame;

  return (
    <div className="w-full space-y-3">
      <div className="overflow-auto">
        <div className="inline-block">
          {/* column header row */}
          {colLabels && (
            <div className="flex">
              {rowLabels && <div className="h-7 w-7 shrink-0" />}
              {colLabels.map((lbl, j) => (
                <div key={`c-${j}`} className="flex h-7 w-11 shrink-0 items-center justify-center font-mono text-[11px] font-semibold text-subtle">
                  {lbl}
                </div>
              ))}
            </div>
          )}
          {Array.from({ length: rows }, (_, i) => (
            <div key={`r-${i}`} className="flex">
              {rowLabels && (
                <div className="flex h-11 w-7 shrink-0 items-center justify-center font-mono text-[11px] font-semibold text-subtle">
                  {rowLabels[i]}
                </div>
              )}
              {Array.from({ length: cols }, (_, j) => {
                const cell = cells[i * cols + j];
                return (
                  <div
                    key={`${i}-${j}`}
                    className={cn(
                      "m-[1.5px] flex h-11 w-11 shrink-0 items-center justify-center rounded-md border font-mono text-sm transition-colors duration-150",
                      CELL[cell?.role ?? "default"],
                    )}
                  >
                    {cell?.text}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {[
          { label: "Current cell", cls: "bg-compare" },
          { label: "Reads from", cls: "bg-pivot/60" },
          { label: "Computed", cls: "bg-elevated border border-line" },
          { label: "Answer", cls: "bg-run" },
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
