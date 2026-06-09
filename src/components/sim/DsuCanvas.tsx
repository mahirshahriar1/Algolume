import type { DsuFrame } from "@/lib/sims/dsu";
import { cn } from "@/lib/cn";

interface LayoutNode {
  x: number;
  y: number;
  depth: number;
}

interface ForestLayout {
  nodes: Map<number, LayoutNode>;
  children: number[][];
  roots: number[];
  height: number;
}

const VIEW_W = 120;
const PAD_X = 8;
const TOP_Y = 16;
const LEVEL_GAP = 19;
const ROOT_GAP_UNITS = 0.55;

export function DsuCanvas({ frame }: { frame: DsuFrame | undefined }) {
  if (!frame) return null;
  const n = frame.parent.length;
  const layout = buildForestLayout(frame.parent);
  const pathEdges = new Set(frame.path.slice(0, -1).map((node, i) => `${node}-${frame.path[i + 1]}`));

  return (
    <div className="w-full space-y-4">
      <svg
        viewBox={`0 0 ${VIEW_W} ${layout.height}`}
        className="h-72 w-full"
        role="img"
        aria-label="Disjoint set union parent forest"
      >
        <defs>
          <marker id="dsu-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-current text-line" />
          </marker>
          <marker id="dsu-arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-compare" />
          </marker>
          <marker id="dsu-arrow-compressed" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4.5" markerHeight="4.5" orient="auto">
            <path d="M 0 0 L 10 5 L 0 10 z" className="fill-run" />
          </marker>
        </defs>

        {layout.roots.map((root) => {
          const pt = layout.nodes.get(root);
          if (!pt) return null;
          return (
            <g key={`root-label-${root}`}>
              <text
                x={pt.x}
                y={pt.y - 10.5}
                textAnchor="middle"
                className="fill-run font-mono font-semibold"
                style={{ fontSize: 3.5 }}
              >
                root {root}
              </text>
              <text
                x={pt.x}
                y={pt.y - 6}
                textAnchor="middle"
                className="fill-subtle font-mono"
                style={{ fontSize: 3 }}
              >
                size {frame.size[root]}
              </text>
            </g>
          );
        })}

        {frame.parent.map((parent, node) => {
          if (parent === node) return null;
          const childPt = layout.nodes.get(node);
          const parentPt = layout.nodes.get(parent);
          if (!childPt || !parentPt) return null;
          const compressed = frame.compressed.includes(node);
          const inPath = pathEdges.has(`${node}-${parent}`);
          const midY = (childPt.y + parentPt.y) / 2;
          const d = `M ${childPt.x} ${childPt.y - 7} C ${childPt.x} ${midY}, ${parentPt.x} ${midY}, ${parentPt.x} ${parentPt.y + 7}`;
          return (
            <path
              key={`${node}-${parent}`}
              d={d}
              fill="none"
              markerEnd={compressed ? "url(#dsu-arrow-compressed)" : inPath ? "url(#dsu-arrow-active)" : "url(#dsu-arrow)"}
              className={cn(
                "transition-colors duration-150",
                compressed ? "stroke-run" : inPath ? "stroke-compare" : "stroke-line",
              )}
              strokeWidth={compressed || inPath ? 2 : 1.25}
              strokeLinecap="round"
            />
          );
        })}

        {frame.parent.map((parent, node) => {
          const pt = layout.nodes.get(node);
          if (!pt) return null;
          const root = parent === node;
          const active = frame.active.includes(node);
          const inPath = frame.path.includes(node);
          const compressed = frame.compressed.includes(node);
          const childCount = layout.children[node]?.length ?? 0;

          return (
            <g key={node}>
              {(active || inPath || compressed) && (
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={9.6}
                  className={compressed ? "fill-run/15 stroke-run" : active ? "fill-compare/15 stroke-compare" : "fill-pivot/10 stroke-pivot"}
                  strokeWidth={1}
                />
              )}
              {root && <circle cx={pt.x} cy={pt.y} r={11.2} className="fill-run/10 stroke-run/40" strokeWidth={0.9} />}
              <circle
                cx={pt.x}
                cy={pt.y}
                r={6.5}
                className={cn(
                  "stroke-surface",
                  root ? "fill-run" : compressed ? "fill-run/80" : inPath ? "fill-compare" : "fill-elevated",
                )}
                strokeWidth={1}
              />
              <text
                x={pt.x}
                y={pt.y + 1.9}
                textAnchor="middle"
                className={root || inPath || compressed ? "fill-white font-display font-semibold" : "fill-fg font-display font-semibold"}
                style={{ fontSize: 4.6 }}
              >
                {node}
              </text>
              {!root && (
                <text x={pt.x} y={pt.y + 12.3} textAnchor="middle" className="fill-muted font-mono" style={{ fontSize: 3.2 }}>
                  p={parent}
                </text>
              )}
              {root && childCount > 0 && (
                <text x={pt.x} y={pt.y + 12.3} textAnchor="middle" className="fill-run font-mono" style={{ fontSize: 3.2 }}>
                  {childCount} child{childCount === 1 ? "" : "ren"}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <div className="overflow-hidden rounded-xl border border-line bg-surface">
        <div className="grid" style={{ gridTemplateColumns: `4rem repeat(${n}, minmax(2.4rem, 1fr))` }}>
          <div className="border-b border-r border-line bg-elevated p-2 text-xs font-semibold text-subtle">i</div>
          {frame.parent.map((_, i) => (
            <div key={`i-${i}`} className="border-b border-r border-line bg-elevated p-2 text-center font-mono text-xs text-fg">{i}</div>
          ))}
          <div className="border-b border-r border-line bg-elevated p-2 text-xs font-semibold text-subtle">parent</div>
          {frame.parent.map((p, i) => (
            <div
              key={`p-${i}`}
              className={cn(
                "border-b border-r border-line p-2 text-center font-mono text-xs",
                frame.compressed.includes(i) ? "bg-run/10 text-run" : frame.path.includes(i) ? "bg-compare/10 text-compare" : "text-muted",
              )}
            >
              {p}
            </div>
          ))}
          <div className="border-r border-line bg-elevated p-2 text-xs font-semibold text-subtle">size</div>
          {frame.size.map((s, i) => (
            <div
              key={`s-${i}`}
              className={cn(
                "border-r border-line p-2 text-center font-mono text-xs",
                frame.parent[i] === i ? "text-run" : "text-subtle",
              )}
            >
              {frame.parent[i] === i ? s : "-"}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function buildForestLayout(parent: number[]): ForestLayout {
  const n = parent.length;
  const children = Array.from({ length: n }, () => [] as number[]);
  const roots: number[] = [];

  parent.forEach((p, i) => {
    if (p === i) roots.push(i);
    else children[p]?.push(i);
  });

  for (const group of children) group.sort((a, b) => a - b);
  roots.sort((a, b) => a - b);

  const weights = new Map<number, number>();
  const depths = new Map<number, number>();
  const weightOf = (node: number): number => {
    const kids = children[node] ?? [];
    const weight = kids.length === 0 ? 1 : kids.reduce((sum, child) => sum + weightOf(child), 0);
    weights.set(node, weight);
    return weight;
  };

  roots.forEach(weightOf);
  const totalUnits = roots.reduce((sum, root) => sum + (weights.get(root) ?? 1), 0)
    + Math.max(0, roots.length - 1) * ROOT_GAP_UNITS;
  const unit = (VIEW_W - PAD_X * 2) / Math.max(1, totalUnits);
  const nodes = new Map<number, LayoutNode>();
  let maxDepth = 0;
  let cursor = PAD_X;

  const place = (node: number, start: number, width: number, depth: number) => {
    depths.set(node, depth);
    maxDepth = Math.max(maxDepth, depth);
    const kids = children[node] ?? [];
    if (kids.length === 0) {
      nodes.set(node, { x: start + width / 2, y: TOP_Y + depth * LEVEL_GAP, depth });
      return;
    }

    let childCursor = start;
    const childXs: number[] = [];
    for (const child of kids) {
      const childWidth = (weights.get(child) ?? 1) * unit;
      place(child, childCursor, childWidth, depth + 1);
      childXs.push(nodes.get(child)?.x ?? childCursor + childWidth / 2);
      childCursor += childWidth;
    }

    const x = childXs.reduce((sum, childX) => sum + childX, 0) / childXs.length;
    nodes.set(node, { x, y: TOP_Y + depth * LEVEL_GAP, depth });
  };

  for (const root of roots) {
    const width = (weights.get(root) ?? 1) * unit;
    place(root, cursor, width, 0);
    cursor += width + ROOT_GAP_UNITS * unit;
  }

  return {
    nodes,
    children,
    roots,
    height: Math.max(78, TOP_Y + maxDepth * LEVEL_GAP + 24),
  };
}
