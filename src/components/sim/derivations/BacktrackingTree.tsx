import { cn } from "@/lib/cn";

const NODES = [
  { id: "root", label: "start", x: 50, y: 10, role: "active", reveal: 1 },
  { id: "a", label: "A", x: 22, y: 34, role: "path", reveal: 2 },
  { id: "b", label: "B", x: 50, y: 34, role: "pruned", reveal: 3 },
  { id: "c", label: "C", x: 78, y: 34, role: "path", reveal: 2 },
  { id: "ab", label: "AB", x: 12, y: 60, role: "pruned", reveal: 3 },
  { id: "ac", label: "AC", x: 32, y: 60, role: "solution", reveal: 4 },
  { id: "ca", label: "CA", x: 68, y: 60, role: "path", reveal: 2 },
  { id: "cb", label: "CB", x: 88, y: 60, role: "solution", reveal: 4 },
];

const EDGES = [
  ["root", "a"],
  ["root", "b"],
  ["root", "c"],
  ["a", "ab"],
  ["a", "ac"],
  ["c", "ca"],
  ["c", "cb"],
];

const ROLE: Record<string, string> = {
  active: "fill-compare stroke-compare text-white",
  path: "fill-pivot/20 stroke-pivot text-fg",
  pruned: "fill-swap/15 stroke-swap text-swap",
  solution: "fill-run/20 stroke-run text-run",
};

export function BacktrackingTree({ step = 5 }: { step?: number }) {
  const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
  const visibleNodes = NODES.filter((n) => n.reveal <= step);
  const visibleIds = new Set(visibleNodes.map((n) => n.id));
  return (
    <div className="space-y-4">
      <svg viewBox="0 0 100 74" className="h-64 w-full overflow-visible">
        <g fill="none" stroke="currentColor" strokeWidth="1.2" className="text-line">
          {EDGES.map(([a, b]) => {
            if (!visibleIds.has(a) || !visibleIds.has(b)) return null;
            const from = byId[a];
            const to = byId[b];
            return <line key={`${a}-${b}`} x1={from.x} y1={from.y + 4} x2={to.x} y2={to.y - 5} />;
          })}
        </g>
        {visibleNodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
            <circle
              r="6.5"
              className={cn(
                "stroke transition-all duration-300",
                ROLE[node.reveal === step && node.role !== "solution" && node.role !== "pruned" ? "active" : node.role],
              )}
              strokeWidth="1.6"
            />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-current font-mono text-[4px] font-bold"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      <div className="grid grid-cols-2 gap-2 text-xs sm:grid-cols-4">
        <Key cls="bg-compare" label="Current" />
        <Key cls="bg-pivot/40" label="Explored" />
        <Key cls="bg-swap/30" label="Pruned" />
        <Key cls="bg-run/30" label="Solution" />
      </div>
      <p className="text-sm text-muted">
        Backtracking is depth-first search over choices: try a branch, prune it
        if it cannot work, then undo and try the next branch.
      </p>
    </div>
  );
}

function Key({ cls, label }: { cls: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn("h-2.5 w-2.5 rounded-sm", cls)} />
      {label}
    </span>
  );
}
