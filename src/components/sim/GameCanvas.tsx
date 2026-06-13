import type { GameFrame, GameCell } from "@/lib/sims/game";
import { cn } from "@/lib/cn";

const CELL: Record<GameCell["role"], string> = {
  default: "border-dashed border-line bg-surface text-subtle",
  win: "border-run/50 bg-run/15 text-run",
  lose: "border-swap/50 bg-swap/15 text-swap",
  current: "border-compare bg-compare/20 text-compare font-bold",
  dep: "border-pivot/60 bg-pivot/10 text-fg",
};

export function GameCanvas({ frame }: { frame: GameFrame | undefined }) {
  if (!frame) return null;
  return (
    <div className="w-full space-y-3">
      <div className="overflow-x-auto pb-1">
        <div className="flex gap-1.5">
          {frame.cells.map((c, i) => (
            <div key={i} className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-md border font-mono text-sm font-semibold transition-colors duration-150",
                  CELL[c.role],
                )}
              >
                {c.text}
              </div>
              <span className="mt-0.5 font-mono text-[10px] text-subtle">{i}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {[
          { label: "Current position", cls: "bg-compare" },
          { label: "Reachable (one move)", cls: "bg-pivot/60" },
          { label: frame.mode === "wl" ? "Winning (W)" : "g > 0 (winning)", cls: "bg-run/60" },
          { label: frame.mode === "wl" ? "Losing (L)" : "g = 0 (losing)", cls: "bg-swap/60" },
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
