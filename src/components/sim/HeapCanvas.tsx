import type { HeapFrame, HeapRole } from "@/lib/sims/heap";
import { cn } from "@/lib/cn";

const FILL: Record<HeapRole, string> = {
  default: "fill-elevated",
  active: "fill-compare",
  compare: "fill-pivot/40",
  swap: "fill-swap",
  new: "fill-run",
  root: "fill-run",
  removed: "fill-swap/40",
};
const STROKE: Record<HeapRole, string> = {
  default: "stroke-line",
  active: "stroke-compare",
  compare: "stroke-pivot",
  swap: "stroke-swap",
  new: "stroke-run",
  root: "stroke-run",
  removed: "stroke-swap",
};
const LIGHT_LABEL = new Set<HeapRole>(["active", "swap", "new", "root"]);

interface Pos { x: number; y: number; level: number }

/** Lay out a complete binary tree by array index (children 2i+1, 2i+2). */
function layout(n: number): Pos[] {
  return Array.from({ length: n }, (_, i) => {
    const level = Math.floor(Math.log2(i + 1));
    const posInLevel = i - (2 ** level - 1);
    const count = 2 ** level;
    return {
      x: ((posInLevel + 0.5) / count) * 100,
      y: 10 + level * 22,
      level,
    };
  });
}

export function HeapCanvas({ frame }: { frame: HeapFrame | undefined }) {
  if (!frame) return null;
  const n = frame.values.length;
  if (n === 0) {
    return <div className="py-10 text-center text-sm text-subtle">empty heap</div>;
  }
  const pos = layout(n);
  const maxLevel = Math.max(...pos.map((p) => p.level));
  const height = 20 + maxLevel * 22;

  return (
    <div className="w-full space-y-4">
      <svg viewBox={`0 0 100 ${height}`} preserveAspectRatio="xMidYMid meet" className="h-56 w-full">
        {/* edges */}
        {pos.map((p, i) => {
          const out = [];
          for (const c of [2 * i + 1, 2 * i + 2]) {
            if (c < n) {
              const cp = pos[c];
              out.push(
                <line key={`${i}-${c}`} x1={p.x} y1={p.y} x2={cp.x} y2={cp.y} className="stroke-line" strokeWidth={0.7} strokeLinecap="round" />,
              );
            }
          }
          return out;
        })}
        {/* nodes */}
        {pos.map((p, i) => {
          const role = frame.roles[i] ?? "default";
          return (
            <g key={i}>
              <circle cx={p.x} cy={p.y} r={6} className={cn("transition-colors duration-200", FILL[role], STROKE[role])} strokeWidth={0.9} />
              <text x={p.x} y={p.y + 2} textAnchor="middle" className={cn("font-mono font-semibold", LIGHT_LABEL.has(role) ? "fill-white" : "fill-fg")} style={{ fontSize: 5 }}>
                {frame.values[i]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* backing array */}
      <div>
        <div className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-subtle">Backing array</div>
        <div className="flex flex-wrap gap-1.5">
          {frame.values.map((v, i) => {
            const role = frame.roles[i] ?? "default";
            return (
              <div key={i} className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-lg border font-mono text-sm font-semibold transition-colors",
                    role === "swap" ? "border-swap bg-swap/15 text-swap"
                      : role === "active" ? "border-compare bg-compare/15 text-compare"
                        : role === "compare" ? "border-pivot/50 bg-pivot/10 text-fg"
                          : role === "new" || role === "root" ? "border-run/50 bg-run/10 text-run"
                            : "border-line bg-surface text-fg",
                  )}
                >
                  {v}
                </div>
                <span className="mt-0.5 font-mono text-[10px] text-subtle">{i}</span>
              </div>
            );
          })}
        </div>
      </div>

      {frame.output !== undefined && (
        <div className="text-center">
          <span className="rounded-md bg-elevated px-2 py-1 font-mono text-sm text-run">{frame.output || "—"}</span>
        </div>
      )}
    </div>
  );
}
