import type { MstEdge, MstFrame } from "@/lib/sims/mst";
import { cn } from "@/lib/cn";

function edgeLabel(edge: MstEdge, frame: MstFrame) {
  return `${frame.nodes[edge.u].label}-${frame.nodes[edge.v].label}`;
}

function labelPoint(edge: MstEdge, frame: MstFrame) {
  const a = frame.nodes[edge.u];
  const b = frame.nodes[edge.v];
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

function edgeTone(edge: MstEdge, frame: MstFrame) {
  const active = frame.activeEdgeId === edge.id;
  const accepted = frame.acceptedEdgeIds.includes(edge.id);
  const rejected = frame.rejectedEdgeIds.includes(edge.id);
  const frontier = frame.frontierEdgeIds.includes(edge.id);
  if (accepted) return active ? "stroke-run" : "stroke-run/80";
  if (rejected) return "stroke-swap/60";
  if (active) return "stroke-compare";
  if (frontier) return "stroke-pivot/65";
  return "stroke-line";
}

export function MstCanvas({ frame }: { frame: MstFrame | undefined }) {
  if (!frame) return null;
  const edgeById = new Map(frame.edges.map((edge) => [edge.id, edge]));
  const activeEdge = frame.activeEdgeId === undefined ? undefined : edgeById.get(frame.activeEdgeId);

  return (
    <div className="w-full space-y-4">
      <svg viewBox="0 0 100 76" className="h-72 w-full" role="img" aria-label="Minimum spanning tree graph">
        {frame.edges.map((edge) => {
          const a = frame.nodes[edge.u];
          const b = frame.nodes[edge.v];
          const accepted = frame.acceptedEdgeIds.includes(edge.id);
          const rejected = frame.rejectedEdgeIds.includes(edge.id);
          const active = frame.activeEdgeId === edge.id;
          const pt = labelPoint(edge, frame);
          return (
            <g key={edge.id}>
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                className={cn("transition-colors duration-150", edgeTone(edge, frame))}
                strokeWidth={accepted || active ? 2.6 : 1.35}
                strokeLinecap="round"
                strokeDasharray={rejected ? "3 3" : undefined}
              />
              <rect
                x={pt.x - 5}
                y={pt.y - 4.3}
                width={10}
                height={7}
                rx={2}
                className={cn("fill-surface stroke-line", active && "stroke-compare")}
                strokeWidth={0.6}
              />
              <text
                x={pt.x}
                y={pt.y + 1.1}
                textAnchor="middle"
                className={cn("fill-muted font-mono", (active || accepted) && "fill-fg font-bold")}
                style={{ fontSize: 4 }}
              >
                {edge.w}
              </text>
            </g>
          );
        })}

        {frame.nodes.map((node) => {
          const active = activeEdge && (activeEdge.u === node.id || activeEdge.v === node.id);
          const visited = frame.visited?.[node.id] ?? false;
          const connected = frame.acceptedEdgeIds.some((edgeId) => {
            const edge = edgeById.get(edgeId);
            return edge && (edge.u === node.id || edge.v === node.id);
          });
          return (
            <g key={node.id}>
              {active && (
                <circle cx={node.x} cy={node.y} r={8.6} className="fill-compare/15 stroke-compare" strokeWidth={1} />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={6.5}
                className={cn(
                  "stroke-surface",
                  visited ? "fill-run" : connected ? "fill-compare" : "fill-elevated",
                )}
                strokeWidth={0.9}
              />
              <text
                x={node.x}
                y={node.y + 1.7}
                textAnchor="middle"
                className={visited || connected ? "fill-white font-display font-semibold" : "fill-fg font-display font-semibold"}
                style={{ fontSize: 4.7 }}
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + 12.5}
                textAnchor="middle"
                className="fill-muted font-mono"
                style={{ fontSize: 3.4 }}
              >
                {frame.mode === "kruskal" && frame.components ? `C${frame.components[node.id]}` : visited ? "in" : "out"}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="rounded-xl border border-line bg-surface p-3">
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
            {frame.mode === "kruskal" ? "Sorted edge order" : "Cheapest crossing edges"}
          </span>
          <span className="font-mono text-xs font-semibold text-run">total {frame.total}</span>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {frame.sortedEdgeIds.map((id) => {
            const edge = edgeById.get(id);
            if (!edge) return null;
            const accepted = frame.acceptedEdgeIds.includes(id);
            const rejected = frame.rejectedEdgeIds.includes(id);
            const frontier = frame.frontierEdgeIds.includes(id);
            const active = frame.activeEdgeId === id;
            return (
              <span
                key={id}
                className={cn(
                  "rounded-md border px-2 py-1 font-mono text-[11px]",
                  accepted
                    ? "border-run/40 bg-run/10 text-run"
                    : rejected
                      ? "border-swap/40 bg-swap/10 text-swap"
                      : active
                        ? "border-compare/50 bg-compare/10 text-compare"
                        : frontier
                          ? "border-pivot/40 bg-pivot/10 text-pivot"
                          : "border-line bg-elevated text-muted",
                )}
              >
                {edgeLabel(edge, frame)}:{edge.w}
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
