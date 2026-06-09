export type ShortestPathMode = "bellman-ford" | "floyd-warshall";

export interface SpNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface SpEdge {
  from: number;
  to: number;
  w: number;
}

export interface ShortestPathFrame {
  mode: ShortestPathMode;
  nodes: SpNode[];
  edges: SpEdge[];
  dist: number[];
  matrix?: number[][];
  activeEdge?: { from: number; to: number };
  activeCell?: { i: number; j: number };
  via?: number;
  changed?: boolean;
  /** the source vertex id (Bellman-Ford) so the canvas can highlight it */
  source?: number;
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

export const INF = 1_000_000;

const cloneMatrix = (m: number[][]) => m.map((row) => row.slice());
export const formatDist = (n: number) => (n >= INF / 2 ? "INF" : String(n));

const BF_NODES: SpNode[] = [
  { id: 0, label: "S", x: 10, y: 34 },
  { id: 1, label: "A", x: 36, y: 14 },
  { id: 2, label: "B", x: 34, y: 54 },
  { id: 3, label: "C", x: 67, y: 50 },
  { id: 4, label: "D", x: 72, y: 18 },
];

const BF_EDGES: SpEdge[] = [
  { from: 0, to: 1, w: 6 },
  { from: 0, to: 2, w: 7 },
  { from: 1, to: 2, w: 8 },
  { from: 1, to: 3, w: 5 },
  { from: 1, to: 4, w: -4 },
  { from: 2, to: 3, w: -3 },
  { from: 2, to: 4, w: 9 },
  { from: 3, to: 1, w: -2 },
  { from: 4, to: 3, w: 7 },
  { from: 4, to: 0, w: 2 },
];

const FW_NODES: SpNode[] = [
  { id: 0, label: "A", x: 18, y: 24 },
  { id: 1, label: "B", x: 50, y: 14 },
  { id: 2, label: "C", x: 76, y: 44 },
  { id: 3, label: "D", x: 31, y: 58 },
];

const FW_EDGES: SpEdge[] = [
  { from: 0, to: 1, w: 3 },
  { from: 0, to: 3, w: 7 },
  { from: 1, to: 0, w: 8 },
  { from: 1, to: 2, w: 2 },
  { from: 2, to: 0, w: 5 },
  { from: 2, to: 3, w: 1 },
  { from: 3, to: 0, w: 2 },
];

export interface SpGraph {
  nodes: SpNode[];
  edges: SpEdge[];
}

export const SP_LABELS = "SABCDEFGH".split("");

/** Limits that keep the visualization legible (and the matrix small for FW). */
export const SP_LIMITS = {
  minNodes: 3,
  maxNodes: 7,
  maxEdges: 16,
  minWeight: -9,
  maxWeight: 20,
};

/** Place `count` nodes evenly on a circle so any size lays out without overlap. */
export function circleNodes(count: number): SpNode[] {
  const n = Math.max(SP_LIMITS.minNodes, Math.min(SP_LIMITS.maxNodes, Math.floor(count)));
  const cx = 50;
  const cy = 38;
  const r = 30;
  return Array.from({ length: n }, (_, i) => {
    // Start at the top and go clockwise; node 0 (the source "S") sits on the left.
    const angle = Math.PI + (i / n) * 2 * Math.PI;
    return {
      id: i,
      label: SP_LABELS[i] ?? String(i),
      x: Math.round((cx + r * Math.cos(angle)) * 10) / 10,
      y: Math.round((cy + r * Math.sin(angle)) * 10) / 10,
    };
  });
}

/**
 * Deterministic graph generator (no Math.random — keeps frames reproducible and
 * resume-safe). `seed` just rotates the edge pattern so "Randomize" feels fresh.
 */
export function generateGraph(
  count: number,
  opts: { negative?: boolean; seed?: number } = {},
): SpGraph {
  const nodes = circleNodes(count);
  const n = nodes.length;
  const seed = opts.seed ?? 0;
  const edges: SpEdge[] = [];
  const seen = new Set<string>();
  const push = (from: number, to: number, w: number) => {
    const key = `${from}-${to}`;
    if (from === to || seen.has(key) || edges.length >= SP_LIMITS.maxEdges) return;
    seen.add(key);
    edges.push({ from, to, w });
  };
  // A spanning chain guarantees every node is reachable from the source.
  for (let i = 0; i < n - 1; i++) {
    const w = 2 + ((i * 3 + seed) % 7);
    push(i, i + 1, w);
  }
  // A few extra "shortcut" edges add interesting relaxations.
  for (let i = 0; i < n; i++) {
    const to = (i + 2 + seed) % n;
    const base = 1 + ((i * 5 + seed * 2) % 9);
    const w = opts.negative && i % 3 === 1 ? -(1 + (i % 4)) : base;
    push(i, to, w);
  }
  push(n - 1, 0, opts.negative ? -2 : 4);
  return { nodes, edges };
}

/**
 * Parse "FROM TO WEIGHT" lines (labels or indices) into an edge list, bounded by
 * the limits. Returns the valid edges plus any human-readable issues.
 */
export function parseEdges(text: string, nodes: SpNode[]): { edges: SpEdge[]; errors: string[] } {
  const byLabel = new Map(nodes.map((nd) => [nd.label.toUpperCase(), nd.id]));
  const edges: SpEdge[] = [];
  const errors: string[] = [];
  const seen = new Set<string>();
  text.split(/\n+/).forEach((line, i) => {
    const trimmed = line.trim();
    if (!trimmed) return;
    const parts = trimmed.split(/[\s,]+/);
    if (parts.length < 3) {
      errors.push(`Line ${i + 1}: expected "from to weight".`);
      return;
    }
    const resolve = (tok: string): number | undefined => {
      const up = tok.toUpperCase();
      if (byLabel.has(up)) return byLabel.get(up);
      const idx = parseInt(tok, 10);
      return Number.isFinite(idx) && idx >= 0 && idx < nodes.length ? idx : undefined;
    };
    const from = resolve(parts[0]);
    const to = resolve(parts[1]);
    const w = parseInt(parts[2], 10);
    if (from === undefined || to === undefined) {
      errors.push(`Line ${i + 1}: unknown node.`);
      return;
    }
    if (!Number.isFinite(w) || w < SP_LIMITS.minWeight || w > SP_LIMITS.maxWeight) {
      errors.push(`Line ${i + 1}: weight must be ${SP_LIMITS.minWeight}..${SP_LIMITS.maxWeight}.`);
      return;
    }
    const key = `${from}-${to}`;
    if (from === to || seen.has(key)) return;
    if (edges.length >= SP_LIMITS.maxEdges) {
      errors.push(`Only the first ${SP_LIMITS.maxEdges} edges are used.`);
      return;
    }
    seen.add(key);
    edges.push({ from, to, w });
  });
  return { edges, errors };
}

/** Render an edge list back to editable "FROM TO WEIGHT" text. */
export function edgesToText(nodes: SpNode[], edges: SpEdge[]): string {
  return edges.map((e) => `${nodes[e.from].label} ${nodes[e.to].label} ${e.w}`).join("\n");
}

export const SHORTEST_PATH_CODE: Record<ShortestPathMode, string[]> = {
  "bellman-ford": [
    "dist[start] = 0",
    "for pass in range(1, V):",
    "    changed = False",
    "    for (u, v, w) in edges:",
    "        if dist[u] == INF: continue",
    "        if dist[u] + w < dist[v]:",
    "            dist[v] = dist[u] + w",
    "            changed = True",
    "    if not changed: break",
    "for (u, v, w) in edges:",
    "    if dist[u] + w < dist[v]:",
    "        negative_cycle = True",
  ],
  "floyd-warshall": [
    "dist = adjacency_matrix",
    "for k in range(V):",
    "    for i in range(V):",
    "        for j in range(V):",
    "            through_k = dist[i][k] + dist[k][j]",
    "            if through_k < dist[i][j]:",
    "                dist[i][j] = through_k",
    "return dist",
  ],
};

export function buildBellmanFordFrames(
  nodes: SpNode[] = BF_NODES,
  edges: SpEdge[] = BF_EDGES,
  source = 0,
): ShortestPathFrame[] {
  const frames: ShortestPathFrame[] = [];
  const dist = Array(nodes.length).fill(INF);
  const src = Math.max(0, Math.min(nodes.length - 1, source));
  dist[src] = 0;
  let updates = 0;
  const srcLabel = nodes[src].label;

  const emit = (
    caption: string,
    lines: number[],
    activeEdge?: { from: number; to: number },
    changed = false,
    pass = 0,
  ) => {
    frames.push({
      mode: "bellman-ford",
      nodes,
      edges,
      dist: dist.slice(),
      activeEdge,
      changed,
      source: src,
      caption,
      lines,
      stats: [
        { label: "Pass", value: pass || "-" },
        { label: "Updates", value: updates },
        { label: "Source", value: srcLabel },
      ],
    });
  };

  emit(`Initialize all distances to INF, except the source ${srcLabel} = 0.`, [1]);

  for (let pass = 1; pass <= nodes.length - 1; pass++) {
    let changedInPass = false;
    emit(`Pass ${pass}: scan every edge and relax any distance that improves.`, [2, 3], undefined, false, pass);

    for (const edge of edges) {
      const from = nodes[edge.from].label;
      const to = nodes[edge.to].label;
      const before = dist[edge.to];
      const candidate = dist[edge.from] >= INF / 2 ? INF : dist[edge.from] + edge.w;
      if (candidate < before) {
        dist[edge.to] = candidate;
        updates++;
        changedInPass = true;
        emit(
          `Relax ${from}->${to}: ${formatDist(candidate)} beats ${formatDist(before)}, so dist[${to}] becomes ${candidate}.`,
          [4, 5, 6, 7, 8],
          { from: edge.from, to: edge.to },
          true,
          pass,
        );
      } else {
        emit(
          `Check ${from}->${to}: candidate ${formatDist(candidate)} does not improve dist[${to}] = ${formatDist(before)}.`,
          [4, 5, 6],
          { from: edge.from, to: edge.to },
          false,
          pass,
        );
      }
    }

    if (!changedInPass) {
      emit(`Pass ${pass} made no updates, so the distances are already stable.`, [9], undefined, false, pass);
      break;
    }
  }

  let negative = false;
  for (const edge of edges) {
    const candidate = dist[edge.from] >= INF / 2 ? INF : dist[edge.from] + edge.w;
    if (candidate < dist[edge.to]) negative = true;
  }
  emit(
    negative
      ? "One more pass can still relax an edge, so a reachable negative cycle exists."
      : "Extra pass finds no improvement: no reachable negative cycle in this sample.",
    [10, 11, 12],
  );

  return frames;
}

export function buildFloydWarshallFrames(
  nodes: SpNode[] = FW_NODES,
  edges: SpEdge[] = FW_EDGES,
): ShortestPathFrame[] {
  const frames: ShortestPathFrame[] = [];
  const FW_N = nodes;
  const n = FW_N.length;
  const dist: number[][] = Array.from({ length: n }, (_, i) =>
    Array.from({ length: n }, (_, j) => (i === j ? 0 : INF)),
  );
  for (const edge of edges) dist[edge.from][edge.to] = edge.w;
  let updates = 0;

  const emit = (
    caption: string,
    lines: number[],
    activeCell?: { i: number; j: number },
    via?: number,
    changed = false,
  ) => {
    frames.push({
      mode: "floyd-warshall",
      nodes: FW_N,
      edges,
      dist: [],
      matrix: cloneMatrix(dist),
      activeCell,
      via,
      changed,
      caption,
      lines,
      stats: [
        { label: "Allowed k", value: via === undefined ? "-" : FW_N[via].label },
        { label: "Updates", value: updates },
        { label: "Pairs", value: `${n * n}` },
      ],
    });
  };

  emit("Start with direct edge weights in the distance matrix.", [1]);

  for (let k = 0; k < n; k++) {
    emit(`Now allow ${FW_N[k].label} as an intermediate vertex.`, [2], undefined, k);
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        const through = dist[i][k] >= INF / 2 || dist[k][j] >= INF / 2 ? INF : dist[i][k] + dist[k][j];
        if (through < dist[i][j]) {
          const before = dist[i][j];
          dist[i][j] = through;
          updates++;
          emit(
            `${FW_N[i].label}->${FW_N[j].label} improves via ${FW_N[k].label}: ${formatDist(before)} -> ${through}.`,
            [3, 4, 5, 6, 7],
            { i, j },
            k,
            true,
          );
        } else {
          emit(
            `${FW_N[i].label}->${FW_N[j].label} through ${FW_N[k].label} gives ${formatDist(through)}, no better than ${formatDist(dist[i][j])}.`,
            [3, 4, 5, 6],
            { i, j },
            k,
            false,
          );
        }
      }
    }
  }

  emit("Done: the matrix now contains shortest distances for every ordered pair.", [8]);
  return frames;
}

export function buildShortestPathFrames(
  mode: ShortestPathMode,
  opts?: { graph?: SpGraph; source?: number },
): ShortestPathFrame[] {
  if (mode === "floyd-warshall") {
    return opts?.graph
      ? buildFloydWarshallFrames(opts.graph.nodes, opts.graph.edges)
      : buildFloydWarshallFrames();
  }
  return opts?.graph
    ? buildBellmanFordFrames(opts.graph.nodes, opts.graph.edges, opts.source ?? 0)
    : buildBellmanFordFrames();
}

export function shortestPathCode(mode: ShortestPathMode): string[] {
  return SHORTEST_PATH_CODE[mode];
}
