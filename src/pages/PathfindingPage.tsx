import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Network,
  Eraser,
  Boxes,
  RouteOff,
  Route,
  Grid3x3,
  Workflow,
  RotateCcw,
  Shuffle,
} from "lucide-react";
import { PATH_ALGORITHMS, PATH_BY_ID } from "@/lib/pathfinding";
import type { SearchMode } from "@/lib/pathfinding";
import {
  GRAPH_ALGORITHMS,
  GRAPH_BY_ID,
  generateGraph,
  MIN_NODES,
  MAX_NODES,
} from "@/lib/graph";
import { usePlayer, useTransportKeys } from "@/lib/usePlayer";
import { GridCanvas } from "@/components/GridCanvas";
import { GraphCanvas } from "@/components/GraphCanvas";
import { CodePanel } from "@/components/CodePanel";
import { PlaybackControls } from "@/components/PlaybackControls";
import { cn } from "@/lib/cn";

type View = "grid" | "graph";

const ROWS = 16;
const COLS = 30;
const MID = Math.floor(ROWS / 2);
const G_START = MID * COLS + 4;
const G_GOAL = MID * COLS + (COLS - 5);

const GRID_LEGEND = [
  { label: "Start", className: "bg-run" },
  { label: "Goal", className: "bg-swap" },
  { label: "Wall", className: "bg-fg" },
  { label: "Frontier", className: "bg-compare/60" },
  { label: "Visited", className: "bg-visited/45" },
  { label: "Path", className: "bg-pivot" },
];
const GRAPH_LEGEND = [
  { label: "Start", className: "bg-run" },
  { label: "Goal", className: "bg-swap" },
  { label: "Frontier", className: "bg-compare" },
  { label: "Visited", className: "bg-visited" },
  { label: "Path", className: "bg-pivot" },
];

function randomWalls(start: number, goal: number): Set<number> {
  const walls = new Set<number>();
  for (let i = 0; i < ROWS * COLS; i++) {
    if (i === start || i === goal) continue;
    if (Math.random() < 0.28) walls.add(i);
  }
  return walls;
}

export function PathfindingPage() {
  const [view, setView] = useState<View>("grid");
  const [algoId, setAlgoId] = useState<SearchMode>("bfs");

  // Grid state
  const [walls, setWalls] = useState<Set<number>>(() => new Set());
  const [gridStart, setGridStart] = useState(G_START);
  const [gridGoal, setGridGoal] = useState(G_GOAL);

  // Graph state. The layout is generated from (nodeCount, seed); dragged
  // positions are kept as overrides so node count + dragging never conflict.
  const [nodeCount, setNodeCount] = useState(14);
  const [seed, setSeed] = useState(0);
  const initialGraph = useMemo(() => generateGraph(nodeCount, seed), [nodeCount, seed]);
  const [dragPos, setDragPos] = useState<Record<number, { x: number; y: number }>>({});
  const nodes = useMemo(
    () =>
      initialGraph.nodes.map((nd) =>
        dragPos[nd.id] ? { ...nd, x: dragPos[nd.id].x, y: dragPos[nd.id].y } : nd,
      ),
    [initialGraph, dragPos],
  );
  // Weights track current geometry so A*'s heuristic stays admissible.
  const edges = useMemo(
    () =>
      initialGraph.edges.map((e) => ({
        a: e.a,
        b: e.b,
        w: Math.hypot(nodes[e.a].x - nodes[e.b].x, nodes[e.a].y - nodes[e.b].y) / 10,
      })),
    [initialGraph, nodes],
  );
  const [graphStart, setGraphStart] = useState(initialGraph.start);
  const [graphGoal, setGraphGoal] = useState(initialGraph.goal);
  const [arm, setArm] = useState<"start" | "goal">("start");

  // When the graph is regenerated (count/seed change), reset endpoints + drags.
  useEffect(() => {
    setGraphStart(initialGraph.start);
    setGraphGoal(initialGraph.goal);
    setDragPos({});
  }, [initialGraph]);

  // Endpoints, clamped so a shrunk graph can never reference a missing node.
  const safeStart = Math.min(graphStart, nodes.length - 1);
  let safeGoal = Math.min(graphGoal, nodes.length - 1);
  if (safeGoal === safeStart) safeGoal = (safeStart + 1) % nodes.length;

  const meta = view === "grid" ? PATH_BY_ID[algoId] : GRAPH_BY_ID[algoId];
  const algoList = view === "grid" ? PATH_ALGORITHMS : GRAPH_ALGORITHMS;

  const frames = useMemo(() => {
    if (view === "grid") {
      return PATH_BY_ID[algoId].run({
        rows: ROWS,
        cols: COLS,
        walls,
        start: gridStart,
        goal: gridGoal,
      });
    }
    return GRAPH_BY_ID[algoId].run({ nodes, edges, start: safeStart, goal: safeGoal });
  }, [view, algoId, walls, gridStart, gridGoal, nodes, edges, safeStart, safeGoal]);

  const player = usePlayer(frames, view === "grid" ? 24 : 8);
  useTransportKeys(player);
  const current = player.current as any;

  const setWall = useCallback((idx: number, wall: boolean) => {
    setWalls((prev) => {
      if (wall === prev.has(idx)) return prev;
      const next = new Set(prev);
      if (wall) next.add(idx);
      else next.delete(idx);
      return next;
    });
  }, []);

  const placeGraphEndpoint = useCallback(
    (id: number) => {
      if (arm === "start") {
        if (id !== safeGoal) setGraphStart(id);
      } else if (id !== safeStart) {
        setGraphGoal(id);
      }
    },
    [arm, safeStart, safeGoal],
  );

  const dragNode = useCallback((id: number, x: number, y: number) => {
    setDragPos((prev) => ({ ...prev, [id]: { x, y } }));
  }, []);

  const stats = current?.stats;
  const found = frames[frames.length - 1]?.stats.path ?? 0;
  const showWeights =
    (algoId === "dijkstra" || algoId === "astar") && nodes.length <= 20;
  const legend = view === "grid" ? GRID_LEGEND : GRAPH_LEGEND;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header + view toggle */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2 text-sm font-medium text-compare">
            <Network className="h-4 w-4" />
            Pathfinding
          </div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
            {meta.name}
          </h1>
          <p className="max-w-2xl text-sm text-muted">{meta.blurb}</p>
        </div>

        <div className="flex overflow-hidden rounded-lg border border-line">
          <ViewTab active={view === "grid"} onClick={() => setView("grid")} icon={<Grid3x3 className="h-4 w-4" />}>
            Grid
          </ViewTab>
          <ViewTab active={view === "graph"} onClick={() => setView("graph")} icon={<Workflow className="h-4 w-4" />}>
            Graph
          </ViewTab>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left: controls */}
        <aside className="space-y-5 lg:col-span-3">
          <section className="panel p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
              Algorithm
            </h2>
            <div className="space-y-1.5">
              {algoList.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAlgoId(a.id)}
                  className={cn(
                    "w-full rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 cursor-pointer",
                    a.id === algoId
                      ? "bg-compare/15 text-fg ring-1 ring-compare/40"
                      : "text-muted hover:bg-elevated",
                  )}
                >
                  <span className="font-medium">{a.name}</span>
                  <span className="mt-0.5 block text-[11px] text-subtle">
                    {a.guarantee}
                  </span>
                </button>
              ))}
            </div>
          </section>

          {view === "grid" ? (
            <section className="panel p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
                Grid
              </h2>
              <div className="space-y-2">
                <button
                  onClick={() => setWalls(randomWalls(gridStart, gridGoal))}
                  className="btn-ghost w-full"
                >
                  <Boxes className="h-4 w-4" />
                  Random walls
                </button>
                <button onClick={() => setWalls(new Set())} className="btn-ghost w-full">
                  <Eraser className="h-4 w-4" />
                  Clear walls
                </button>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-subtle">
                Click &amp; drag to draw walls. Drag the{" "}
                <span className="font-medium text-run">green</span> and{" "}
                <span className="font-medium text-swap">red</span> markers to move
                start and goal.
              </p>
            </section>
          ) : (
            <section className="panel p-4">
              <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
                Graph
              </h2>

              <div className="mb-1.5 flex items-center justify-between text-xs">
                <span className="text-muted">Nodes</span>
                <span className="font-mono text-fg tabular-nums">{nodeCount}</span>
              </div>
              <input
                type="range"
                min={MIN_NODES}
                max={MAX_NODES}
                value={nodeCount}
                onChange={(e) => setNodeCount(Number(e.target.value))}
                aria-label="Number of nodes"
                className="mb-1 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line
                  accent-compare [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
                  [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none
                  [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-compare"
              />
              <div className="mb-3 flex justify-between font-mono text-[10px] text-subtle">
                <span>{MIN_NODES}</span>
                <span>{MAX_NODES}</span>
              </div>

              <button onClick={() => setSeed((s) => s + 1)} className="btn-ghost mb-2 w-full">
                <Shuffle className="h-4 w-4" />
                Regenerate graph
              </button>

              <p className="mb-2 text-xs text-subtle">Click a node to set the…</p>
              <div className="mb-3 flex overflow-hidden rounded-lg border border-line">
                {(["start", "goal"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setArm(m)}
                    className={cn(
                      "flex-1 py-1.5 text-xs font-semibold capitalize transition-colors duration-150 cursor-pointer",
                      arm === m
                        ? m === "start"
                          ? "bg-run text-white"
                          : "bg-swap text-white"
                        : "bg-elevated text-muted hover:bg-line/60",
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
              <button onClick={() => setDragPos({})} className="btn-ghost w-full">
                <RotateCcw className="h-4 w-4" />
                Reset layout
              </button>
              <p className="mt-3 text-xs leading-relaxed text-subtle">
                Drag any node to rearrange the graph. Edge numbers are weights
                (used by Dijkstra &amp; A*).
              </p>
            </section>
          )}

          <section className="panel p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
              Result
            </h2>
            <div className="flex items-center gap-2 text-sm">
              {found > 0 ? (
                <>
                  <Route className="h-4 w-4 text-pivot" />
                  <span className="text-fg">
                    Path found — {found} {view === "grid" ? "cells" : "nodes"}
                  </span>
                </>
              ) : (
                <>
                  <RouteOff className="h-4 w-4 text-subtle" />
                  <span className="text-muted">No path</span>
                </>
              )}
            </div>
          </section>
        </aside>

        {/* Center: canvas + transport */}
        <main className="space-y-5 lg:col-span-6">
          <div className="panel p-3 sm:p-4">
            <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-2">
              {legend.map((l) => (
                <div key={l.label} className="flex items-center gap-1.5">
                  <span className={cn("h-3 w-3 rounded-sm", l.className)} />
                  <span className="text-xs text-muted">{l.label}</span>
                </div>
              ))}
            </div>
            {view === "grid" ? (
              <GridCanvas
                rows={ROWS}
                cols={COLS}
                walls={walls}
                start={gridStart}
                goal={gridGoal}
                frame={current}
                onSetWall={setWall}
                onMoveStart={setGridStart}
                onMoveGoal={setGridGoal}
              />
            ) : (
              <div className="h-[360px] sm:h-[440px]">
                <GraphCanvas
                  nodes={nodes}
                  edges={edges}
                  start={safeStart}
                  goal={safeGoal}
                  frame={current}
                  showWeights={showWeights}
                  arm={arm}
                  onPlace={placeGraphEndpoint}
                  onDragNode={dragNode}
                />
              </div>
            )}
          </div>

          <div className="panel flex min-h-[52px] items-center gap-3 px-4 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-compare/15 text-[11px] font-bold text-compare tabular-nums">
              {player.index}
            </span>
            <p className="text-sm text-fg">
              {current?.caption ?? "Press play to run the search."}
            </p>
          </div>

          <PlaybackControls player={player} />

          <div className="grid grid-cols-3 gap-3">
            <Stat label="Visited" value={stats?.visited ?? 0} />
            <Stat label="Frontier" value={stats?.frontier ?? 0} />
            <Stat label={view === "grid" ? "Path length" : "Path nodes"} value={stats?.path ?? 0} />
          </div>
        </main>

        {/* Right: code */}
        <aside className="space-y-5 lg:col-span-3">
          <CodePanel
            code={meta.code}
            activeLines={current?.lines ?? []}
            className="lg:sticky lg:top-20"
          />
          <section className="panel p-4">
            <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-subtle">
              Guarantee
            </h2>
            <p className="text-sm text-muted">{meta.guarantee}.</p>
          </section>
        </aside>
      </div>
    </div>
  );
}

function ViewTab({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold transition-colors duration-150 cursor-pointer",
        active ? "bg-compare text-white" : "bg-elevated text-muted hover:bg-line/60",
      )}
    >
      {icon}
      {children}
    </button>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div className="panel flex flex-col items-center justify-center gap-1 p-3 text-center">
      <span className="font-mono text-xl font-bold tabular-nums text-fg">{value}</span>
      <span className="text-[11px] text-subtle">{label}</span>
    </div>
  );
}
