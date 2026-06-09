import type { NodeRole, TreeFrame } from "@/lib/sims/types";
import { cn } from "@/lib/cn";

const FILL: Record<NodeRole, string> = {
  default: "fill-elevated",
  path: "fill-pivot/25",
  active: "fill-compare",
  match: "fill-run",
  visited: "fill-visited/70",
  new: "fill-run",
  red: "fill-swap",
  black: "fill-fg",
  violation: "fill-swap",
  rotate: "fill-pivot",
  recolor: "fill-compare",
};

const STROKE: Record<NodeRole, string> = {
  default: "stroke-line",
  path: "stroke-pivot",
  active: "stroke-compare",
  match: "stroke-run",
  visited: "stroke-visited",
  new: "stroke-run",
  red: "stroke-swap",
  black: "stroke-fg",
  violation: "stroke-swap",
  rotate: "stroke-pivot",
  recolor: "stroke-compare",
};

const LIGHT_LABEL = new Set<NodeRole>([
  "active",
  "match",
  "new",
  "visited",
  "red",
  "black",
  "violation",
  "rotate",
  "recolor",
]);

/**
 * Renders one TreeFrame. The viewBox is sized to the node coordinates and the
 * SVG fills its container with preserveAspectRatio="meet" — so a big tree
 * scales down to fit (like the pathfinding graph) instead of overflowing.
 */
export function TreeCanvas({
  frame,
  className = "h-56",
}: {
  frame: TreeFrame | undefined;
  className?: string;
}) {
  if (!frame || frame.nodes.length === 0) {
    return <div className="py-10 text-center text-sm text-subtle">empty tree</div>;
  }
  const pos = new Map(frame.nodes.map((n) => [n.id, n]));
  const maxX = Math.max(...frame.nodes.map((n) => n.x)) + 9;
  const maxY = Math.max(...frame.nodes.map((n) => n.y)) + 11;

  return (
    <div className="w-full">
      <div className={cn("w-full", className)}>
        <svg
          viewBox={`0 0 ${maxX} ${maxY}`}
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full"
        >
          {frame.edges.map((e, i) => {
            const a = pos.get(e.from);
            const b = pos.get(e.to);
            if (!a || !b) return null;
            return (
              <line
                key={i}
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={cn("transition-colors duration-200", e.role === "path" ? "stroke-pivot" : "stroke-line")}
                strokeWidth={e.role === "path" ? 1.6 : 0.9}
                strokeLinecap="round"
              />
            );
          })}
          {frame.nodes.map((n) => {
            const role = n.role ?? "default";
            return (
              <g key={n.id} className="transition-transform duration-300" style={{ transform: `translate(${n.x}px, ${n.y}px)` }}>
                <circle r={6.2} className={cn("transition-colors duration-200", FILL[role], STROKE[role])} strokeWidth={1} />
                <text
                  y={1.9}
                  textAnchor="middle"
                  className={cn("font-mono font-semibold", LIGHT_LABEL.has(role) ? "fill-white" : "fill-fg")}
                  style={{ fontSize: 5 }}
                >
                  {n.value}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
      {frame.output !== undefined && (
        <div className="mt-2 text-center">
          <span className="rounded-md bg-elevated px-2 py-1 font-mono text-sm text-run">
            {frame.output || "—"}
          </span>
        </div>
      )}
    </div>
  );
}
