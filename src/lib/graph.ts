/**
 * Node-based graph pathfinding — the same four searches as the grid, but over
 * an arbitrary node/edge graph instead of a lattice. Reuses the frame engine:
 * each search emits an ordered list of immutable GraphFrames.
 *
 * The four algorithms share one best-first `search()` core and differ only in:
 *   - how the next node leaves the frontier (FIFO / LIFO / min-g / min f=g+h)
 *   - the per-edge cost (BFS/DFS count hops; Dijkstra/A* use edge weights)
 *   - the heuristic (A* uses straight-line distance to the goal)
 */
import { OVERLAY } from "./pathfinding";
import type { SearchMode } from "./pathfinding";

export interface GraphNode {
  id: number;
  label: string;
  x: number; // 0..100 layout space
  y: number;
}

export interface GraphEdge {
  a: number;
  b: number;
  w: number; // weight (straight-line distance / 10)
}

export interface GraphInput {
  nodes: GraphNode[];
  edges: GraphEdge[];
  start: number;
  goal: number;
}

export interface GraphFrame {
  /** nodeId -> overlay role (see OVERLAY). */
  overlay: Int8Array;
  /** edges (as [a,b]) to draw as part of the traced path. */
  pathEdges: Array<[number, number]>;
  lines: number[];
  caption: string;
  stats: { visited: number; frontier: number; path: number };
  vars?: Record<string, string | number>;
}

export interface GraphAlgorithm {
  id: SearchMode;
  name: string;
  blurb: string;
  guarantee: string;
  code: string[];
  run: (input: GraphInput) => GraphFrame[];
}

const L_INIT = [2, 3];
const L_POP = [5, 6];
const L_SCAN = [7, 8, 9, 10];
const L_PATH = [11];
const L_FAIL = [4];

const dist = (a: GraphNode, b: GraphNode) =>
  Math.hypot(a.x - b.x, a.y - b.y);

function search(input: GraphInput, mode: SearchMode): GraphFrame[] {
  const { nodes, edges, start, goal } = input;
  const N = nodes.length;

  // Build an adjacency list once.
  const adj: Array<Array<{ to: number; w: number }>> = nodes.map(() => []);
  for (const e of edges) {
    adj[e.a].push({ to: e.b, w: e.w });
    adj[e.b].push({ to: e.a, w: e.w });
  }

  const frames: GraphFrame[] = [];
  const visited = new Uint8Array(N);
  const inFrontier = new Uint8Array(N);
  const g = new Float64Array(N).fill(Infinity);
  const came = new Int32Array(N).fill(-1);
  let frontier: number[] = [start];
  inFrontier[start] = 1;
  g[start] = 0;
  let visitedCount = 0;

  const edgeCost = (w: number) => (mode === "bfs" || mode === "dfs" ? 1 : w);
  const heuristic = (i: number) =>
    mode === "astar" ? dist(nodes[i], nodes[goal]) / 10 : 0;
  const priority = (i: number) => {
    if (mode === "dijkstra") return g[i];
    if (mode === "astar") return g[i] + heuristic(i);
    return 0;
  };

  const popBest = (): number => {
    if (mode === "bfs") return frontier.shift()!;
    if (mode === "dfs") return frontier.pop()!;
    let best = 0;
    for (let k = 1; k < frontier.length; k++) {
      if (priority(frontier[k]) < priority(frontier[best])) best = k;
    }
    return frontier.splice(best, 1)[0];
  };

  const emit = (
    current: number,
    lines: number[],
    caption: string,
    path?: Set<number>,
    pathEdges: Array<[number, number]> = [],
  ) => {
    const overlay = new Int8Array(N);
    for (let i = 0; i < N; i++) if (visited[i]) overlay[i] = OVERLAY.VISITED;
    for (const i of frontier) if (inFrontier[i]) overlay[i] = OVERLAY.FRONTIER;
    if (current >= 0) overlay[current] = OVERLAY.CURRENT;
    if (path) for (const i of path) overlay[i] = OVERLAY.PATH;
    frames.push({
      overlay,
      pathEdges,
      lines,
      caption,
      stats: {
        visited: visitedCount,
        frontier: frontier.length,
        path: path ? path.size : 0,
      },
      vars: { frontier: frontier.length, visited: visitedCount },
    });
  };

  emit(-1, L_INIT, `Seed the frontier with the start node ${nodes[start].label}.`);

  let found = false;
  while (frontier.length > 0) {
    const current = popBest();
    inFrontier[current] = 0;
    if (visited[current]) continue;
    visited[current] = 1;
    visitedCount++;

    if (current === goal) {
      emit(current, L_POP, `Popped the goal ${nodes[goal].label} — done.`);
      found = true;
      break;
    }
    emit(current, L_POP, `Visit node ${nodes[current].label}.`);

    let added = 0;
    for (const { to, w } of adj[current]) {
      if (visited[to]) continue;
      const tentative = g[current] + edgeCost(w);
      if (tentative < g[to]) {
        g[to] = tentative;
        came[to] = current;
        if (!inFrontier[to]) {
          inFrontier[to] = 1;
          frontier.push(to);
        }
        added++;
      }
    }
    emit(
      current,
      L_SCAN,
      added > 0
        ? `Relax ${added} neighbour${added > 1 ? "s" : ""} of ${nodes[current].label}.`
        : `${nodes[current].label} has no new neighbours.`,
    );
  }

  if (found) {
    const path: number[] = [];
    let cur = goal;
    while (cur !== -1) {
      path.push(cur);
      cur = came[cur];
    }
    path.reverse();
    const set = new Set<number>();
    const pe: Array<[number, number]> = [];
    for (let k = 0; k < path.length; k++) {
      set.add(path[k]);
      if (k > 0) pe.push([path[k - 1], path[k]]);
      emit(
        -1,
        L_PATH,
        `Trace shortest path — ${set.size}/${path.length} nodes.`,
        new Set(set),
        pe.slice(),
      );
    }
  } else {
    emit(-1, L_FAIL, "Frontier exhausted — the goal is unreachable.");
  }

  return frames;
}

// Same readable pseudocode as the grid (graph search is the general case).
const bfsCode = [
  "from collections import deque",
  "frontier = deque([start])        # FIFO queue",
  "seen = {start}",
  "while frontier:",
  "    current = frontier.popleft()",
  "    if current == goal: break",
  "    for n in graph[current]:",
  "        if n in seen: continue",
  "        seen.add(n); came_from[n] = current",
  "        frontier.append(n)",
  "path = reconstruct(came_from, goal)",
];
const dfsCode = [
  "# depth-first search",
  "stack = [start]                  # LIFO stack",
  "seen = {start}",
  "while stack:",
  "    current = stack.pop()",
  "    if current == goal: break",
  "    for n in graph[current]:",
  "        if n in seen: continue",
  "        seen.add(n); came_from[n] = current",
  "        stack.append(n)",
  "path = reconstruct(came_from, goal)",
];
const dijkstraCode = [
  "import heapq",
  "frontier = [(0, start)]          # min-heap by dist",
  "dist = {start: 0}",
  "while frontier:",
  "    d, current = heapq.heappop(frontier)",
  "    if current == goal: break",
  "    for n, w in graph[current]:",
  "        if n in done: continue",
  "        nd = dist[current] + w",
  "        if nd < dist.get(n, INF): heapq.heappush(frontier, (nd, n))",
  "path = reconstruct(came_from, goal)",
];
const astarCode = [
  "import heapq",
  "frontier = [(h(start), start)]   # min-heap by f = g + h",
  "g = {start: 0}",
  "while frontier:",
  "    _, current = heapq.heappop(frontier)",
  "    if current == goal: break",
  "    for n, w in graph[current]:",
  "        if n in done: continue",
  "        ng = g[current] + w",
  "        if ng < g.get(n, INF): heapq.heappush(frontier, (ng + h(n), n))",
  "path = reconstruct(came_from, goal)",
];

export const GRAPH_ALGORITHMS: GraphAlgorithm[] = [
  {
    id: "bfs",
    name: "Breadth-First Search",
    blurb: "Explores the graph level by level — fewest edges, ignores weights.",
    guarantee: "Fewest edges (unweighted)",
    code: bfsCode,
    run: (input) => search(input, "bfs"),
  },
  {
    id: "dfs",
    name: "Depth-First Search",
    blurb: "Dives down one branch as far as it can before backtracking.",
    guarantee: "Finds a path, not the shortest",
    code: dfsCode,
    run: (input) => search(input, "dfs"),
  },
  {
    id: "dijkstra",
    name: "Dijkstra",
    blurb: "Expands the node with the smallest total weight from the start.",
    guarantee: "Cheapest path (weighted)",
    code: dijkstraCode,
    run: (input) => search(input, "dijkstra"),
  },
  {
    id: "astar",
    name: "A* Search",
    blurb: "Dijkstra biased toward the goal by a straight-line heuristic.",
    guarantee: "Cheapest path, fewer nodes explored",
    code: astarCode,
    run: (input) => search(input, "astar"),
  },
];

export const GRAPH_BY_ID = Object.fromEntries(
  GRAPH_ALGORITHMS.map((a) => [a.id, a]),
) as Record<SearchMode, GraphAlgorithm>;

export const MIN_NODES = 5;
export const MAX_NODES = 40;

export interface GeneratedGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
  start: number;
  goal: number;
}

/** Small, fast, seedable PRNG so a given (count, seed) always lays out the same. */
function mulberry32(seedNum: number): () => number {
  let a = seedNum;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Procedurally generate a connected weighted graph of `count` nodes.
 * Nodes are placed on a jittered grid; edges are a k-nearest-neighbour mesh
 * made fully connected with a Kruskal pass over the shortest remaining pairs.
 * Start/goal are the left-most and right-most nodes for a clear left→right run.
 */
export function generateGraph(count: number, seed: number): GeneratedGraph {
  const n = Math.max(MIN_NODES, Math.min(MAX_NODES, Math.round(count)));
  const rnd = mulberry32((seed + 1) * 2654435761 + n * 40503);

  const cols = Math.max(1, Math.round(Math.sqrt(n * 1.5)));
  const rows = Math.ceil(n / cols);
  const cells: Array<[number, number]> = [];
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) cells.push([c, r]);
  // Shuffle cells so the unused tail cells are spread out, not clustered.
  for (let i = cells.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [cells[i], cells[j]] = [cells[j], cells[i]];
  }
  const cellW = 88 / cols;
  const cellH = 84 / rows;
  const nodes: GraphNode[] = cells.slice(0, n).map(([c, r], id) => ({
    id,
    label: n <= 26 ? String.fromCharCode(65 + id) : String(id + 1),
    x: 6 + c * cellW + cellW * (0.2 + 0.6 * rnd()),
    y: 8 + r * cellH + cellH * (0.2 + 0.6 * rnd()),
  }));

  const edges: GraphEdge[] = [];
  const seen = new Set<string>();
  const add = (a: number, b: number) => {
    if (a === b) return;
    const key = a < b ? `${a}-${b}` : `${b}-${a}`;
    if (seen.has(key)) return;
    seen.add(key);
    edges.push({ a, b, w: dist(nodes[a], nodes[b]) / 10 });
  };

  // k-nearest-neighbour mesh.
  const k = n <= 8 ? 2 : 3;
  for (let i = 0; i < n; i++) {
    const order = nodes
      .map((_, j) => j)
      .filter((j) => j !== i)
      .sort((p, q) => dist(nodes[i], nodes[p]) - dist(nodes[i], nodes[q]));
    for (let t = 0; t < Math.min(k, order.length); t++) add(i, order[t]);
  }

  // Connectivity pass: union-find + add shortest pairs that merge components.
  const parent = nodes.map((_, i) => i);
  const find = (x: number): number => {
    while (parent[x] !== x) {
      parent[x] = parent[parent[x]];
      x = parent[x];
    }
    return x;
  };
  const union = (a: number, b: number) => {
    const ra = find(a);
    const rb = find(b);
    if (ra !== rb) parent[ra] = rb;
  };
  edges.forEach((e) => union(e.a, e.b));
  const pairs: Array<[number, number, number]> = [];
  for (let i = 0; i < n; i++)
    for (let j = i + 1; j < n; j++) pairs.push([dist(nodes[i], nodes[j]), i, j]);
  pairs.sort((p, q) => p[0] - q[0]);
  for (const [, i, j] of pairs) {
    if (find(i) !== find(j)) {
      add(i, j);
      union(i, j);
    }
  }

  let start = 0;
  let goal = 0;
  for (let i = 1; i < n; i++) {
    if (nodes[i].x < nodes[start].x) start = i;
    if (nodes[i].x > nodes[goal].x) goal = i;
  }
  if (start === goal) goal = (start + 1) % n;

  return { nodes, edges, start, goal };
}
