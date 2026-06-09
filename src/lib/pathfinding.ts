/**
 * Pathfinding module — same idea as sorting: algorithms don't animate, they
 * emit an ordered list of immutable GridFrames. BFS / DFS / Dijkstra / A* are
 * all variations of one best-first search that differ only in how the next
 * cell is chosen from the frontier, so they share a single `search()` core.
 */

/** Per-cell overlay role at a given step (base walls/start/goal live on the grid). */
export const OVERLAY = {
  NONE: 0,
  FRONTIER: 1, // discovered, waiting in the frontier (open set)
  VISITED: 2, // expanded (closed set)
  CURRENT: 3, // the cell being expanded this step
  PATH: 4, // part of the final reconstructed path
} as const;

export interface GridInput {
  rows: number;
  cols: number;
  walls: Set<number>;
  start: number;
  goal: number;
}

/** One immutable snapshot of a search. `overlay[i]` is the role of cell i. */
export interface GridFrame {
  overlay: Int8Array;
  lines: number[];
  caption: string;
  stats: { visited: number; frontier: number; path: number };
  vars?: Record<string, string | number>;
}

export type SearchMode = "bfs" | "dfs" | "dijkstra" | "astar";

export interface PathAlgorithm {
  id: SearchMode;
  name: string;
  blurb: string;
  guarantee: string;
  weighted: boolean;
  code: string[];
  run: (input: GridInput) => GridFrame[];
}

/** Human "(row, col)" label for a flat cell index. */
export function rc(i: number, cols: number): string {
  return `(${Math.floor(i / cols)}, ${i % cols})`;
}

// Line groups, shared because every algorithm's `code` array uses the same
// 11-line skeleton (only the wording differs).
const L_INIT = [2, 3];
const L_POP = [5, 6];
const L_SCAN = [7, 8, 9, 10];
const L_PATH = [11];
const L_FAIL = [4];

function search(input: GridInput, mode: SearchMode): GridFrame[] {
  const { rows, cols, walls, start, goal } = input;
  const N = rows * cols;

  const frames: GridFrame[] = [];
  const visited = new Uint8Array(N);
  const inFrontier = new Uint8Array(N);
  const g = new Float64Array(N).fill(Infinity);
  const came = new Int32Array(N).fill(-1);
  let frontier: number[] = [start];
  inFrontier[start] = 1;
  g[start] = 0;
  let visitedCount = 0;

  const heuristic = (i: number): number => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    return Math.abs(r - Math.floor(goal / cols)) + Math.abs(c - (goal % cols));
  };

  const priority = (i: number): number => {
    if (mode === "dijkstra") return g[i];
    if (mode === "astar") return g[i] + heuristic(i);
    return 0;
  };

  const neighbors = (i: number): number[] => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const out: number[] = [];
    if (r > 0) out.push(i - cols); // up
    if (c < cols - 1) out.push(i + 1); // right
    if (r < rows - 1) out.push(i + cols); // down
    if (c > 0) out.push(i - 1); // left
    return out;
  };

  const popBest = (): number => {
    if (mode === "bfs") return frontier.shift()!; // FIFO queue
    if (mode === "dfs") return frontier.pop()!; // LIFO stack
    // Dijkstra / A*: lowest priority. Grids are small, so a linear scan beats
    // the overhead of a real heap and keeps the code readable.
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
  ) => {
    const overlay = new Int8Array(N);
    for (let i = 0; i < N; i++) if (visited[i]) overlay[i] = OVERLAY.VISITED;
    for (const i of frontier) if (inFrontier[i]) overlay[i] = OVERLAY.FRONTIER;
    if (current >= 0) overlay[current] = OVERLAY.CURRENT;
    if (path) for (const i of path) overlay[i] = OVERLAY.PATH;
    frames.push({
      overlay,
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

  emit(-1, L_INIT, "Seed the frontier with the start cell.");

  let found = false;
  while (frontier.length > 0) {
    const current = popBest();
    inFrontier[current] = 0;
    if (visited[current]) continue; // stale duplicate (decrease-key by re-push)
    visited[current] = 1;
    visitedCount++;

    if (current === goal) {
      emit(current, L_POP, "Popped the goal — search complete.");
      found = true;
      break;
    }
    emit(current, L_POP, `Pop best cell ${rc(current, cols)} and mark it visited.`);

    let added = 0;
    for (const nb of neighbors(current)) {
      if (walls.has(nb) || visited[nb]) continue;
      const tentative = g[current] + 1;
      if (tentative < g[nb]) {
        g[nb] = tentative;
        came[nb] = current;
        if (!inFrontier[nb]) {
          inFrontier[nb] = 1;
          frontier.push(nb);
        }
        added++;
      }
    }
    emit(
      current,
      L_SCAN,
      added > 0
        ? `Relax ${added} neighbour${added > 1 ? "s" : ""} into the frontier.`
        : "No new neighbours to add.",
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
    for (const i of path) {
      set.add(i);
      emit(-1, L_PATH, `Trace path back from goal — ${set.size}/${path.length} cells.`, set);
    }
  } else {
    emit(-1, L_FAIL, "Frontier exhausted — the goal is unreachable.");
  }

  return frames;
}

// Each algorithm shares the search core but ships its own readable pseudocode.
const bfsCode = [
  "from collections import deque",
  "frontier = deque([start])        # FIFO queue",
  "seen = {start}",
  "while frontier:",
  "    current = frontier.popleft()",
  "    if current == goal: break",
  "    for n in neighbors(current):",
  "        if n in walls or n in seen: continue",
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
  "    for n in neighbors(current):",
  "        if n in walls or n in seen: continue",
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
  "    for n in neighbors(current):",
  "        if n in walls: continue",
  "        nd = dist[current] + 1",
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
  "    for n in neighbors(current):",
  "        if n in walls: continue",
  "        ng = g[current] + 1",
  "        if ng < g.get(n, INF): heapq.heappush(frontier, (ng + h(n), n))",
  "path = reconstruct(came_from, goal)",
];

export const PATH_ALGORITHMS: PathAlgorithm[] = [
  {
    id: "bfs",
    name: "Breadth-First Search",
    blurb: "Explores the grid in rings, one distance layer at a time.",
    guarantee: "Shortest path (unweighted)",
    weighted: false,
    code: bfsCode,
    run: (input) => search(input, "bfs"),
  },
  {
    id: "dfs",
    name: "Depth-First Search",
    blurb: "Plunges as deep as possible before backtracking. Fast but wanders.",
    guarantee: "Finds a path, not the shortest",
    weighted: false,
    code: dfsCode,
    run: (input) => search(input, "dfs"),
  },
  {
    id: "dijkstra",
    name: "Dijkstra",
    blurb: "Expands the closest unvisited cell first using accumulated distance.",
    guarantee: "Shortest path (weighted)",
    weighted: true,
    code: dijkstraCode,
    run: (input) => search(input, "dijkstra"),
  },
  {
    id: "astar",
    name: "A* Search",
    blurb: "Dijkstra guided by a goal heuristic — heads straight for the target.",
    guarantee: "Shortest path, fewer cells explored",
    weighted: true,
    code: astarCode,
    run: (input) => search(input, "astar"),
  },
];

export const PATH_BY_ID = Object.fromEntries(
  PATH_ALGORITHMS.map((a) => [a.id, a]),
) as Record<SearchMode, PathAlgorithm>;
