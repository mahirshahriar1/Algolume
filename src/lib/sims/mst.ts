export type MstMode = "kruskal" | "prim";

export interface MstNode {
  id: number;
  label: string;
  x: number;
  y: number;
}

export interface MstEdge {
  id: number;
  u: number;
  v: number;
  w: number;
}

export interface MstGraph {
  nodes: MstNode[];
  edges: MstEdge[];
}

export interface MstFrame {
  mode: MstMode;
  nodes: MstNode[];
  edges: MstEdge[];
  sortedEdgeIds: number[];
  acceptedEdgeIds: number[];
  rejectedEdgeIds: number[];
  frontierEdgeIds: number[];
  activeEdgeId?: number;
  components?: number[];
  visited?: boolean[];
  total: number;
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

export const MST_LIMITS = {
  minNodes: 4,
  maxNodes: 8,
  maxEdges: 18,
  minWeight: 1,
  maxWeight: 30,
};

const LABELS = "ABCDEFGH".split("");

export const MST_CODE: Record<MstMode, string[]> = {
  kruskal: [
    "sort edges by weight",
    "make each vertex its own DSU set",
    "for (u, v, w) in edges:",
    "    if find(u) != find(v):",
    "        add edge to MST",
    "        union(u, v)",
    "    else:",
    "        reject edge; it forms a cycle",
    "stop after V - 1 accepted edges",
  ],
  prim: [
    "start from any vertex",
    "visited[start] = true",
    "while not all vertices are visited:",
    "    choose cheapest edge crossing the cut",
    "    add that edge to the MST",
    "    mark the new vertex visited",
    "return total MST weight",
  ],
};

function clampCount(count: number) {
  return Math.max(MST_LIMITS.minNodes, Math.min(MST_LIMITS.maxNodes, Math.floor(count)));
}

export function circleMstNodes(count: number): MstNode[] {
  const n = clampCount(count);
  const cx = 50;
  const cy = 38;
  const r = 30;
  return Array.from({ length: n }, (_, i) => {
    const angle = -Math.PI / 2 + (i / n) * 2 * Math.PI;
    return {
      id: i,
      label: LABELS[i] ?? String(i),
      x: Math.round((cx + r * Math.cos(angle)) * 10) / 10,
      y: Math.round((cy + r * Math.sin(angle)) * 10) / 10,
    };
  });
}

function withIds(edges: Omit<MstEdge, "id">[]): MstEdge[] {
  return edges.slice(0, MST_LIMITS.maxEdges).map((edge, id) => ({ ...edge, id }));
}

export function generateMstGraph(count: number, seed = 0): MstGraph {
  const nodes = circleMstNodes(count);
  const n = nodes.length;
  const edges: Omit<MstEdge, "id">[] = [];
  const seen = new Set<string>();
  const push = (u: number, v: number, w: number) => {
    const a = Math.min(u, v);
    const b = Math.max(u, v);
    const key = `${a}-${b}`;
    if (a === b || seen.has(key) || edges.length >= MST_LIMITS.maxEdges) return;
    seen.add(key);
    edges.push({ u: a, v: b, w });
  };

  for (let i = 0; i < n - 1; i++) {
    push(i, i + 1, 2 + ((seed + i * 3) % 9));
  }
  push(0, n - 1, 4 + (seed % 8));

  for (let i = 0; i < n; i++) {
    const v = (i + 2 + seed) % n;
    const w = 3 + ((seed * 5 + i * 7) % 17);
    push(i, v, w);
  }
  for (let i = 0; i < n; i += 2) {
    const v = (i + 3 + seed) % n;
    const w = 5 + ((seed * 2 + i * 11) % 19);
    push(i, v, w);
  }

  return { nodes, edges: withIds(edges) };
}

export function mstEdgesToText(nodes: MstNode[], edges: MstEdge[]): string {
  return edges.map((edge) => `${nodes[edge.u].label} ${nodes[edge.v].label} ${edge.w}`).join("\n");
}

export function parseMstEdges(text: string, nodes: MstNode[]): { edges: MstEdge[]; errors: string[] } {
  const byLabel = new Map(nodes.map((node) => [node.label.toUpperCase(), node.id]));
  const raw: Omit<MstEdge, "id">[] = [];
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
    const u0 = resolve(parts[0]);
    const v0 = resolve(parts[1]);
    const w = parseInt(parts[2], 10);
    if (u0 === undefined || v0 === undefined) {
      errors.push(`Line ${i + 1}: unknown node.`);
      return;
    }
    if (!Number.isFinite(w) || w < MST_LIMITS.minWeight || w > MST_LIMITS.maxWeight) {
      errors.push(`Line ${i + 1}: weight must be ${MST_LIMITS.minWeight}..${MST_LIMITS.maxWeight}.`);
      return;
    }
    const u = Math.min(u0, v0);
    const v = Math.max(u0, v0);
    const key = `${u}-${v}`;
    if (u === v || seen.has(key)) return;
    if (raw.length >= MST_LIMITS.maxEdges) {
      errors.push(`Only the first ${MST_LIMITS.maxEdges} edges are used.`);
      return;
    }
    seen.add(key);
    raw.push({ u, v, w });
  });

  return { edges: withIds(raw), errors };
}

function sortedEdges(edges: MstEdge[]) {
  return edges.slice().sort((a, b) => a.w - b.w || a.u - b.u || a.v - b.v);
}

function edgeName(nodes: MstNode[], edge: MstEdge) {
  return `${nodes[edge.u].label}-${nodes[edge.v].label}`;
}

function componentsOf(parent: number[]) {
  const find = (x: number): number => {
    while (parent[x] !== x) x = parent[x];
    return x;
  };
  const rootToId = new Map<number, number>();
  return parent.map((_, i) => {
    const root = find(i);
    if (!rootToId.has(root)) rootToId.set(root, rootToId.size + 1);
    return rootToId.get(root)!;
  });
}

export function buildKruskalFrames(graph: MstGraph = generateMstGraph(6)): MstFrame[] {
  const { nodes, edges } = graph;
  const order = sortedEdges(edges);
  const sortedEdgeIds = order.map((edge) => edge.id);
  const frames: MstFrame[] = [];
  const parent = nodes.map((node) => node.id);
  const rank = nodes.map(() => 0);
  const accepted: number[] = [];
  const rejected: number[] = [];
  let total = 0;

  const find = (x: number): number => {
    if (parent[x] !== x) parent[x] = find(parent[x]);
    return parent[x];
  };
  const union = (a: number, b: number) => {
    let ra = find(a);
    let rb = find(b);
    if (ra === rb) return;
    if (rank[ra] < rank[rb]) [ra, rb] = [rb, ra];
    parent[rb] = ra;
    if (rank[ra] === rank[rb]) rank[ra]++;
  };
  const emit = (caption: string, lines: number[], activeEdgeId?: number) => {
    frames.push({
      mode: "kruskal",
      nodes,
      edges,
      sortedEdgeIds,
      acceptedEdgeIds: accepted.slice(),
      rejectedEdgeIds: rejected.slice(),
      frontierEdgeIds: [],
      activeEdgeId,
      components: componentsOf(parent),
      total,
      caption,
      lines,
      stats: [
        { label: "Accepted", value: `${accepted.length}/${Math.max(0, nodes.length - 1)}` },
        { label: "Rejected", value: rejected.length },
        { label: "Weight", value: total },
      ],
    });
  };

  emit("Sort all edges by weight. Kruskal will try the cheapest remaining edge first.", [1, 2]);

  for (const edge of order) {
    if (accepted.length === nodes.length - 1) break;
    const name = edgeName(nodes, edge);
    emit(`Consider edge ${name} with weight ${edge.w}.`, [3, 4], edge.id);
    if (find(edge.u) !== find(edge.v)) {
      accepted.push(edge.id);
      total += edge.w;
      union(edge.u, edge.v);
      emit(`Accept ${name}: it joins two different components.`, [4, 5, 6], edge.id);
    } else {
      rejected.push(edge.id);
      emit(`Reject ${name}: both endpoints are already connected, so this would form a cycle.`, [7, 8], edge.id);
    }
  }

  emit(
    accepted.length === nodes.length - 1
      ? `Done: ${accepted.length} edges connect all vertices with total weight ${total}.`
      : "The graph is disconnected, so no spanning tree exists.",
    [9],
  );
  return frames;
}

export function buildPrimFrames(graph: MstGraph = generateMstGraph(6), start = 0): MstFrame[] {
  const { nodes, edges } = graph;
  const frames: MstFrame[] = [];
  const source = Math.max(0, Math.min(nodes.length - 1, start));
  const visited = nodes.map(() => false);
  const accepted: number[] = [];
  let total = 0;
  visited[source] = true;

  const crossing = () =>
    sortedEdges(edges.filter((edge) => visited[edge.u] !== visited[edge.v]));
  const emit = (caption: string, lines: number[], activeEdgeId?: number, frontier: MstEdge[] = crossing()) => {
    frames.push({
      mode: "prim",
      nodes,
      edges,
      sortedEdgeIds: sortedEdges(edges).map((edge) => edge.id),
      acceptedEdgeIds: accepted.slice(),
      rejectedEdgeIds: [],
      frontierEdgeIds: frontier.map((edge) => edge.id),
      activeEdgeId,
      visited: visited.slice(),
      total,
      caption,
      lines,
      stats: [
        { label: "Visited", value: visited.filter(Boolean).length },
        { label: "Accepted", value: `${accepted.length}/${Math.max(0, nodes.length - 1)}` },
        { label: "Weight", value: total },
      ],
    });
  };

  emit(`Start Prim from ${nodes[source].label}. The cut is between visited and unvisited vertices.`, [1, 2]);

  while (visited.some((v) => !v)) {
    const candidates = crossing();
    if (candidates.length === 0) {
      emit("No edge crosses the cut, so the graph is disconnected.", [3, 4]);
      break;
    }
    const edge = candidates[0];
    const next = visited[edge.u] ? edge.v : edge.u;
    emit(`The cheapest crossing edge is ${edgeName(nodes, edge)} with weight ${edge.w}.`, [3, 4], edge.id, candidates);
    accepted.push(edge.id);
    total += edge.w;
    visited[next] = true;
    emit(`Accept it and add ${nodes[next].label} to the growing tree.`, [5, 6], edge.id, crossing());
  }

  emit(
    visited.every(Boolean)
      ? `Done: the tree reaches every vertex with total weight ${total}.`
      : "Prim stopped before visiting every vertex.",
    [7],
  );
  return frames;
}

export function buildMstFrames(
  mode: MstMode,
  opts?: { graph?: MstGraph; start?: number },
): MstFrame[] {
  if (mode === "prim") return buildPrimFrames(opts?.graph, opts?.start ?? 0);
  return buildKruskalFrames(opts?.graph);
}

export function mstCode(mode: MstMode): string[] {
  return MST_CODE[mode];
}
