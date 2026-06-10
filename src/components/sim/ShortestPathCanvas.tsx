import { Fragment } from "react";
import type { ShortestPathFrame, SpEdge, SpNode } from "@/lib/sims/shortestPath";
import { INF, formatDist } from "@/lib/sims/shortestPath";
import { cn } from "@/lib/cn";

function hasReverse(edge: SpEdge, edges: SpEdge[]) {
  return edges.some((other) => other.from === edge.to && other.to === edge.from);
}

function edgePath(edge: SpEdge, nodes: SpNode[], edges: SpEdge[]) {
  const a = nodes[edge.from];
  const b = nodes[edge.to];
  const reverse = hasReverse(edge, edges);
  if (!reverse) return `M ${a.x} ${a.y} L ${b.x} ${b.y}`;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const sign = edge.from < edge.to ? 1 : -1;
  const mx = (a.x + b.x) / 2 + (-dy / len) * 7 * sign;
  const my = (a.y + b.y) / 2 + (dx / len) * 7 * sign;
  return `M ${a.x} ${a.y} Q ${mx} ${my} ${b.x} ${b.y}`;
}

function labelPoint(edge: SpEdge, nodes: SpNode[], edges: SpEdge[]) {
  const a = nodes[edge.from];
  const b = nodes[edge.to];
  const reverse = hasReverse(edge, edges);
  if (!reverse) return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 - 2 };
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.max(1, Math.hypot(dx, dy));
  const sign = edge.from < edge.to ? 1 : -1;
  return {
    x: (a.x + b.x) / 2 + (-dy / len) * 8 * sign,
    y: (a.y + b.y) / 2 + (dx / len) * 8 * sign,
  };
}

function BellmanFordCanvas({ frame }: { frame: ShortestPathFrame }) {
  const active = frame.activeEdge;
  const source = frame.source ?? 0;
  return (
    <div className="w-full space-y-4">
      <svg viewBox="0 0 90 72" className="h-64 w-full" role="img" aria-label="Bellman-Ford weighted graph">
        <defs>
          <marker id="bf-arrow" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="4" markerHeight="4" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-current text-line" />
          </marker>
          <marker id="bf-arrow-active" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" className={frame.changed ? "fill-run" : "fill-compare"} />
          </marker>
        </defs>
        {frame.edges.map((edge) => {
          const isActive = active?.from === edge.from && active?.to === edge.to;
          const pt = labelPoint(edge, frame.nodes, frame.edges);
          return (
            <g key={`${edge.from}-${edge.to}`}>
              <path
                d={edgePath(edge, frame.nodes, frame.edges)}
                fill="none"
                markerEnd={isActive ? "url(#bf-arrow-active)" : "url(#bf-arrow)"}
                className={cn(
                  "transition-colors duration-150",
                  isActive ? (frame.changed ? "stroke-run" : "stroke-compare") : "stroke-line",
                )}
                strokeWidth={isActive ? 1.9 : 1}
                strokeLinecap="round"
              />
              <rect
                x={pt.x - 3.4}
                y={pt.y - 3.1}
                width={6.8}
                height={4.8}
                rx={1.5}
                className={cn("fill-surface", isActive ? "stroke-compare" : "stroke-line/60")}
                strokeWidth={0.5}
              />
              <text
                x={pt.x}
                y={pt.y + 0.6}
                textAnchor="middle"
                className={cn("font-mono", isActive ? "fill-fg font-bold" : "fill-muted")}
                style={{ fontSize: 3.6 }}
              >
                {edge.w}
              </text>
            </g>
          );
        })}
        {frame.nodes.map((node) => {
          const finite = frame.dist[node.id] < INF / 2;
          const involved = active?.from === node.id || active?.to === node.id;
          return (
            <g key={node.id}>
              {involved && (
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={8.1}
                  className={frame.changed ? "fill-run/20 stroke-run" : "fill-compare/15 stroke-compare"}
                  strokeWidth={1}
                />
              )}
              <circle
                cx={node.x}
                cy={node.y}
                r={6.2}
                className={cn("stroke-surface", node.id === source ? "fill-run" : finite ? "fill-compare" : "fill-elevated")}
                strokeWidth={0.9}
              />
              <text
                x={node.x}
                y={node.y + 1.7}
                textAnchor="middle"
                className={node.id === source || finite ? "fill-white font-display font-semibold" : "fill-fg font-display font-semibold"}
                style={{ fontSize: 4.5 }}
              >
                {node.label}
              </text>
              <text
                x={node.x}
                y={node.y + 12.5}
                textAnchor="middle"
                className="fill-muted font-mono"
                style={{ fontSize: 3.6 }}
              >
                d={formatDist(frame.dist[node.id])}
              </text>
            </g>
          );
        })}
      </svg>

      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: `repeat(${Math.min(frame.nodes.length, 7)}, minmax(0, 1fr))` }}
      >
        {frame.nodes.map((node) => (
          <div
            key={node.id}
            className={cn(
              "rounded-lg border bg-surface px-2 py-2 text-center",
              node.id === source ? "border-run/50" : "border-line",
            )}
          >
            <div className="font-display text-sm font-semibold text-fg">{node.label}</div>
            <div className="font-mono text-xs text-muted">{formatDist(frame.dist[node.id])}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function FloydWarshallCanvas({ frame }: { frame: ShortestPathFrame }) {
  const matrix = frame.matrix ?? [];
  const nodes = frame.nodes;
  const active = frame.activeCell;
  const via = frame.via;
  const n = nodes.length;
  const template = `2.2rem repeat(${n}, minmax(2.9rem, 1fr))`;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line bg-elevated px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-subtle">Allowed intermediate</p>
          <p className="font-display text-xl font-semibold text-fg">{via === undefined ? "direct edges" : nodes[via].label}</p>
        </div>
        {active && via !== undefined && (
          <p className="max-w-xs text-xs leading-5 text-muted">
            Testing {nodes[active.i].label}
            {"->"}
            {nodes[active.j].label} through {nodes[via].label}.
          </p>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="grid" style={{ gridTemplateColumns: template }}>
          <div className="border-b border-r border-line bg-elevated p-2 text-center text-xs font-semibold text-subtle">to</div>
          {nodes.map((node, j) => (
            <div
              key={node.id}
              className={cn(
                "border-b border-r border-line bg-elevated p-2 text-center font-display text-sm font-semibold",
                via === j ? "text-pivot" : "text-fg",
              )}
            >
              {node.label}
            </div>
          ))}
          {matrix.map((row, i) => (
            <Fragment key={`matrix-row-${i}`}>
              <div
                key={`row-${i}`}
                className={cn(
                  "border-b border-r border-line bg-elevated p-2 text-center font-display text-sm font-semibold",
                  via === i ? "text-pivot" : "text-fg",
                )}
              >
                {nodes[i].label}
              </div>
              {row.map((value, j) => {
                const isActive = active?.i === i && active?.j === j;
                const onVia = via !== undefined && (i === via || j === via);
                return (
                  <div
                    key={`${i}-${j}`}
                    className={cn(
                      "border-b border-r border-line p-2 text-center font-mono text-sm transition-colors duration-150",
                      isActive
                        ? frame.changed
                          ? "bg-run/20 text-run"
                          : "bg-compare/15 text-compare"
                        : onVia
                          ? "bg-pivot/10 text-fg"
                          : "text-muted",
                    )}
                  >
                    {formatDist(value)}
                  </div>
                );
              })}
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ShortestPathCanvas({ frame }: { frame: ShortestPathFrame | undefined }) {
  if (!frame) return null;
  return frame.mode === "floyd-warshall" ? (
    <FloydWarshallCanvas frame={frame} />
  ) : (
    <BellmanFordCanvas frame={frame} />
  );
}
