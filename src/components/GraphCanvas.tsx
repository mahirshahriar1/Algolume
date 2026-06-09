import { useRef } from "react";
import type { GraphEdge, GraphFrame, GraphNode } from "@/lib/graph";
import { OVERLAY } from "@/lib/pathfinding";
import { cn } from "@/lib/cn";

interface Props {
  nodes: GraphNode[];
  edges: GraphEdge[];
  start: number;
  goal: number;
  frame: GraphFrame | undefined;
  showWeights: boolean;
  arm: "start" | "goal";
  onPlace: (id: number) => void;
  onDragNode: (id: number, x: number, y: number) => void;
}

const clamp = (v: number) => Math.max(4, Math.min(96, v));

function nodeFill(id: number, start: number, goal: number, role: number): string {
  if (id === start) return "fill-run";
  if (id === goal) return "fill-swap";
  switch (role) {
    case OVERLAY.FRONTIER:
      return "fill-compare";
    case OVERLAY.VISITED:
      return "fill-visited";
    case OVERLAY.CURRENT:
    case OVERLAY.PATH:
      return "fill-pivot";
    default:
      return "fill-elevated";
  }
}

/** Whether a node's label should be light (it sits on a saturated fill). */
function labelLight(id: number, start: number, goal: number, role: number): boolean {
  return id === start || id === goal || role !== OVERLAY.NONE;
}

export function GraphCanvas({
  nodes,
  edges,
  start,
  goal,
  frame,
  showWeights,
  arm,
  onPlace,
  onDragNode,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const drag = useRef<{ id: number; downX: number; downY: number; moved: boolean } | null>(
    null,
  );

  const overlay = frame?.overlay;
  const pathEdges = frame?.pathEdges ?? [];
  const isPathEdge = (a: number, b: number) =>
    pathEdges.some(([x, y]) => (x === a && y === b) || (x === b && y === a));

  const toSvg = (clientX: number, clientY: number) => {
    const svg = svgRef.current!;
    const pt = svg.createSVGPoint();
    pt.x = clientX;
    pt.y = clientY;
    const ctm = svg.getScreenCTM();
    if (!ctm) return { x: 0, y: 0 };
    const loc = pt.matrixTransform(ctm.inverse());
    return { x: loc.x, y: loc.y };
  };

  const onPointerDown = (e: React.PointerEvent, id: number) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    const p = toSvg(e.clientX, e.clientY);
    drag.current = { id, downX: p.x, downY: p.y, moved: false };
  };

  const onPointerMove = (e: React.PointerEvent, id: number) => {
    const d = drag.current;
    if (!d || d.id !== id) return;
    const p = toSvg(e.clientX, e.clientY);
    if (!d.moved && Math.hypot(p.x - d.downX, p.y - d.downY) < 2) return;
    d.moved = true;
    onDragNode(id, clamp(p.x), clamp(p.y));
  };

  const onPointerUp = (id: number) => {
    const d = drag.current;
    drag.current = null;
    if (d && !d.moved) onPlace(id); // a click (no drag) assigns the armed endpoint
  };

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full touch-none select-none"
      role="img"
      aria-label="Graph — drag nodes to move them, click to set start/goal"
    >
      {/* Edges */}
      {edges.map((e: GraphEdge, i) => {
        const a = nodes[e.a];
        const b = nodes[e.b];
        const path = isPathEdge(e.a, e.b);
        return (
          <g key={i} className="pointer-events-none">
            <line
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              className={cn(
                "transition-colors duration-150",
                path ? "stroke-pivot" : "stroke-line",
              )}
              strokeWidth={path ? 1.6 : 0.7}
              strokeLinecap="round"
            />
            {showWeights && (
              <text
                x={(a.x + b.x) / 2}
                y={(a.y + b.y) / 2 - 0.8}
                textAnchor="middle"
                className="fill-subtle font-mono"
                style={{ fontSize: 2.7 }}
              >
                {Math.round(e.w)}
              </text>
            )}
          </g>
        );
      })}

      {/* Nodes */}
      {nodes.map((n: GraphNode) => {
        const role = overlay ? overlay[n.id] : 0;
        const isEndpoint = n.id === start || n.id === goal;
        return (
          <g
            key={n.id}
            onPointerDown={(e) => onPointerDown(e, n.id)}
            onPointerMove={(e) => onPointerMove(e, n.id)}
            onPointerUp={() => onPointerUp(n.id)}
            className={cn(arm && !isEndpoint ? "cursor-pointer" : "cursor-grab")}
          >
            {role === OVERLAY.CURRENT && (
              <circle
                cx={n.x}
                cy={n.y}
                r={5.2}
                className="fill-none stroke-pivot"
                strokeWidth={0.8}
              />
            )}
            <circle
              cx={n.x}
              cy={n.y}
              r={3.8}
              className={cn(
                "stroke-surface transition-colors duration-150",
                nodeFill(n.id, start, goal, role),
              )}
              strokeWidth={0.7}
            />
            <text
              x={n.x}
              y={n.y + 1.3}
              textAnchor="middle"
              className={cn(
                "pointer-events-none font-display font-semibold",
                labelLight(n.id, start, goal, role) ? "fill-white" : "fill-fg",
              )}
              style={{ fontSize: n.label.length > 1 ? 2.9 : 3.6 }}
            >
              {n.label}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
