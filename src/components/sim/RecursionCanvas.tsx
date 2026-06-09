import type { RecFrame, RecNode, RecRole, RecStackItem } from "@/lib/sims/recursion";
import { cn } from "@/lib/cn";

const NODE_ROLE: Record<RecRole, string> = {
  pending: "fill-elevated/40 stroke-line text-subtle opacity-35",
  waiting: "fill-elevated stroke-line text-fg",
  active: "fill-compare stroke-compare text-white",
  done: "fill-run/15 stroke-run/40 text-fg",
  path: "fill-pivot/20 stroke-pivot text-fg",
  pruned: "fill-swap/15 stroke-swap text-swap",
  solution: "fill-run/25 stroke-run text-run",
};

const STACK_ROLE: Record<RecRole, string> = {
  pending: "border-line bg-elevated/40 text-subtle",
  waiting: "border-line bg-elevated text-fg",
  active: "border-compare bg-compare text-white",
  done: "border-run/50 bg-run/15 text-run",
  path: "border-pivot/50 bg-pivot/15 text-fg",
  pruned: "border-swap/50 bg-swap/15 text-swap",
  solution: "border-run bg-run/20 text-run",
};

export function RecursionCanvas({ frame }: { frame: RecFrame | undefined }) {
  if (!frame) return null;
  if (frame.kind === "stack") return <StackView stack={frame.stack ?? []} output={frame.output} />;
  return <TreeView frame={frame} />;
}

function StackView({ stack, output }: { stack: RecStackItem[]; output?: string }) {
  return (
    <div className="flex min-h-[18rem] w-full flex-col items-center justify-center gap-4">
      <div className="flex w-full max-w-sm flex-col-reverse gap-2">
        {stack.map((item, index) => (
          <div
            key={`${item.label}-${index}`}
            className={cn(
              "rounded-lg border px-4 py-2 text-center shadow-sm transition-colors duration-300",
              STACK_ROLE[item.role],
            )}
          >
            <div className="font-mono text-sm font-semibold">{item.label}</div>
            {item.detail && <div className="mt-0.5 text-[11px] opacity-80">{item.detail}</div>}
          </div>
        ))}
      </div>
      {output && <div className="rounded-lg bg-elevated px-3 py-2 font-mono text-sm text-run">{output}</div>}
    </div>
  );
}

function TreeView({ frame }: { frame: RecFrame }) {
  const nodes = frame.nodes ?? [];
  const byId = Object.fromEntries(nodes.map((node) => [node.id, node])) as Record<string, RecNode>;
  return (
    <div className="w-full space-y-3">
      <svg viewBox="0 0 100 100" className="h-[22rem] w-full overflow-visible">
        <g fill="none" stroke="currentColor" strokeWidth="0.9" className="text-line">
          {(frame.edges ?? []).map((edge) => {
            const from = byId[edge.from];
            const to = byId[edge.to];
            if (!from || !to) return null;
            return <line key={`${edge.from}-${edge.to}`} x1={from.x} y1={from.y + 3.5} x2={to.x} y2={to.y - 4.5} />;
          })}
        </g>
        {nodes.map((node) => (
          <g key={node.id} transform={`translate(${node.x} ${node.y})`}>
            <circle r="4.8" className={cn("stroke transition-all duration-300", NODE_ROLE[node.role])} strokeWidth="1.2" />
            <text
              textAnchor="middle"
              dominantBaseline="middle"
              className="fill-current font-mono text-[3.2px] font-bold"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
      {frame.output && (
        <div className="rounded-lg bg-elevated/70 px-3 py-2 text-center font-mono text-xs text-run">
          {frame.output}
        </div>
      )}
    </div>
  );
}
