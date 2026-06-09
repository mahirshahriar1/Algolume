export type RecMode = "factorial" | "divide" | "backtracking";
export type RecRole = "pending" | "waiting" | "active" | "done" | "path" | "pruned" | "solution";

export interface RecStackItem {
  label: string;
  detail?: string;
  role: RecRole;
}

export interface RecNode {
  id: string;
  label: string;
  x: number;
  y: number;
  role: RecRole;
}

export interface RecEdge {
  from: string;
  to: string;
  role?: RecRole;
}

export interface RecFrame {
  kind: "stack" | "tree";
  caption: string;
  lines?: number[];
  stack?: RecStackItem[];
  nodes?: RecNode[];
  edges?: RecEdge[];
  output?: string;
  stats?: { label: string; value: string | number }[];
}

export const REC_CODE: Record<RecMode, string[]> = {
  factorial: [
    "def factorial(n):",
    "    if n == 0:",
    "        return 1",
    "    return n * factorial(n - 1)",
  ],
  divide: [
    "def divide(a):",
    "    if len(a) <= base: return solve(a)",
    "    parts = split(a)",
    "    answers = [divide(p) for p in parts]",
    "    return combine(answers)",
  ],
  backtracking: [
    "def backtrack(path, depth):",
    "    if depth == limit: record(path); return",
    "    for choice in choices:",
    "        if violates(path, choice): continue",
    "        path.append(choice)",
    "        backtrack(path, depth + 1)",
    "        path.pop()",
  ],
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

export function buildFactorialFrames(n = 4): RecFrame[] {
  const limit = clamp(Math.floor(n), 1, 8);
  const frames: RecFrame[] = [];
  const calls = Array.from({ length: limit + 1 }, (_, i) => limit - i);
  const valueOf = (k: number) => (k <= 1 ? 1 : Array.from({ length: k }, (_, i) => i + 1).reduce((a, b) => a * b, 1));

  for (let depth = 1; depth <= calls.length; depth++) {
    const visible = calls.slice(0, depth);
    const current = visible[visible.length - 1];
    frames.push({
      kind: "stack",
      stack: visible.map((k, i) => ({
        label: `factorial(${k})`,
        detail: k === 0 ? "base case" : `waiting for factorial(${k - 1})`,
        role: i === visible.length - 1 ? "active" : "waiting",
      })),
      caption:
        current === 0
          ? "Reached factorial(0): the base case returns 1."
          : `factorial(${current}) is not a base case, so it calls factorial(${current - 1}).`,
      lines: current === 0 ? [2, 3] : [2, 4],
      stats: [
        { label: "Depth", value: depth },
        { label: "Calls", value: depth },
      ],
    });
  }

  for (let k = 1; k <= limit; k++) {
    const remaining = calls.slice(0, limit - k + 1);
    frames.push({
      kind: "stack",
      stack: remaining.map((call, i) => ({
        label: `factorial(${call})`,
        detail: call === k ? `returns ${valueOf(k)}` : "waiting",
        role: call === k ? "done" : i === remaining.length - 1 ? "active" : "waiting",
      })),
      caption: `Return upward: factorial(${k}) = ${valueOf(k)}.`,
      lines: [4],
      stats: [
        { label: "Depth", value: remaining.length },
        { label: "Value", value: valueOf(k) },
      ],
    });
  }

  frames.push({
    kind: "stack",
    stack: [{ label: `${limit}!`, detail: String(valueOf(limit)), role: "solution" }],
    caption: `Done: factorial(${limit}) = ${valueOf(limit)}.`,
    lines: [4],
    stats: [
      { label: "Calls", value: limit + 1 },
      { label: "Result", value: valueOf(limit) },
    ],
  });
  return frames;
}

interface RawNode {
  id: string;
  label: string;
  size: number;
  depth: number;
  parent?: string;
  leafIndex?: number;
}

function splitSizes(size: number, parts: number): number[] {
  const base = Math.floor(size / parts);
  const extra = size % parts;
  return Array.from({ length: parts }, (_, i) => Math.max(1, base + (i < extra ? 1 : 0)));
}

export function buildDivideFrames({
  n = 16,
  branches = 2,
  base = 1,
  combine = "linear",
}: {
  n?: number;
  branches?: number;
  base?: number;
  combine?: "constant" | "linear";
} = {}): RecFrame[] {
  const rootSize = clamp(Math.floor(n), 2, 96);
  const b = clamp(Math.floor(branches), 2, 3);
  const baseSize = clamp(Math.floor(base), 1, 8);
  const raw: RawNode[] = [];
  const edges: RecEdge[] = [];

  const build = (size: number, depth: number, parent?: string): string => {
    const id = `n${raw.length}`;
    raw.push({ id, label: String(size), size, depth, parent });
    if (parent) edges.push({ from: parent, to: id });
    if (size > baseSize && depth < 5) {
      splitSizes(size, b).forEach((child) => build(child, depth + 1, id));
    }
    return id;
  };
  build(rootSize, 0);

  let leafCursor = 0;
  const assignLeaves = (id: string): number => {
    const children = raw.filter((node) => node.parent === id);
    const node = raw.find((item) => item.id === id)!;
    if (!children.length) {
      node.leafIndex = leafCursor++;
      return node.leafIndex;
    }
    const childPositions = children.map((child) => assignLeaves(child.id));
    node.leafIndex = childPositions.reduce((a, c) => a + c, 0) / childPositions.length;
    return node.leafIndex;
  };
  assignLeaves("n0");

  const maxDepth = Math.max(...raw.map((node) => node.depth));
  const maxLeaf = Math.max(1, leafCursor - 1);
  const positioned = raw.map((node) => ({
    ...node,
    x: 8 + ((node.leafIndex ?? 0) / maxLeaf) * 84,
    y: maxDepth === 0 ? 50 : 10 + (node.depth / maxDepth) * 76,
  }));
  const levelWork = Array.from({ length: maxDepth + 1 }, (_, depth) => {
    const level = raw.filter((node) => node.depth === depth);
    return combine === "linear" ? level.reduce((sum, node) => sum + node.size, 0) : level.length;
  });
  const complexity = combine === "linear" ? "O(n log n)" : b === 2 ? "O(n)" : "O(n)";

  return Array.from({ length: maxDepth + 2 }, (_, step) => {
    const activeDepth = Math.min(step, maxDepth);
    return {
      kind: "tree" as const,
      nodes: positioned.map((node) => ({
        id: node.id,
        label: node.label,
        x: node.x,
        y: node.y,
        role:
          node.depth > activeDepth
            ? "pending"
            : node.depth === activeDepth
              ? "active"
              : node.size <= baseSize
                ? "solution"
                : "done",
      })),
      edges: edges.filter((edge) => {
        const to = raw.find((node) => node.id === edge.to)!;
        return to.depth <= activeDepth;
      }),
      caption:
        step <= maxDepth
          ? `Reveal level ${activeDepth}: ${levelWork[activeDepth]} unit${levelWork[activeDepth] === 1 ? "" : "s"} of ${combine} combine work.`
          : `All leaves reached. Across ${maxDepth + 1} levels, the recurrence is ${complexity}.`,
      lines: step === 0 ? [1] : step <= maxDepth ? [2, 3, 4] : [5],
      stats: [
        { label: "Levels", value: maxDepth + 1 },
        { label: "Leaves", value: raw.filter((node) => node.size <= baseSize || !raw.some((child) => child.parent === node.id)).length },
        { label: "Shape", value: complexity },
      ],
    };
  });
}

const LETTERS = ["A", "B", "C", "D"];

export function buildBacktrackingFrames({
  depth = 3,
  branching = 3,
  pruning = "medium",
}: {
  depth?: number;
  branching?: number;
  pruning?: "none" | "light" | "medium" | "heavy";
} = {}): RecFrame[] {
  const maxDepth = clamp(Math.floor(depth), 2, 4);
  const b = clamp(Math.floor(branching), 2, 4);
  const nodes: RawNode[] = [{ id: "root", label: "start", size: 1, depth: 0 }];
  const edges: RecEdge[] = [];
  const children = new Map<string, string[]>();

  const build = (id: string, path: number[], d: number) => {
    if (d >= maxDepth) return;
    const ids: string[] = [];
    for (let choice = 0; choice < b; choice++) {
      const nextPath = [...path, choice];
      const childId = `${id}-${choice}`;
      nodes.push({ id: childId, label: nextPath.map((c) => LETTERS[c]).join(""), size: 1, depth: d + 1, parent: id });
      edges.push({ from: id, to: childId });
      ids.push(childId);
      build(childId, nextPath, d + 1);
    }
    children.set(id, ids);
  };
  build("root", [], 0);

  let leafCursor = 0;
  const assign = (id: string): number => {
    const node = nodes.find((item) => item.id === id)!;
    const kids = children.get(id) ?? [];
    if (!kids.length) {
      node.leafIndex = leafCursor++;
      return node.leafIndex;
    }
    const xs = kids.map(assign);
    node.leafIndex = xs.reduce((a, c) => a + c, 0) / xs.length;
    return node.leafIndex;
  };
  assign("root");
  const maxLeaf = Math.max(1, leafCursor - 1);
  const positioned = nodes.map((node) => ({
    ...node,
    x: 5 + ((node.leafIndex ?? 0) / maxLeaf) * 90,
    y: 8 + (node.depth / maxDepth) * 84,
  }));

  const shouldPrune = (path: number[]) => {
    if (pruning === "none" || path.length === 0 || path.length >= maxDepth) return false;
    const score = path.reduce((sum, n) => sum + n + 1, 0) + path.length;
    if (pruning === "light") return score % 5 === 0;
    if (pruning === "medium") return score % 3 === 0;
    return score % 2 === 0;
  };

  const frames: RecFrame[] = [];
  const seen = new Set<string>(["root"]);
  const pruned = new Set<string>();
  const solutions = new Set<string>();
  const activePath = new Set<string>(["root"]);
  let visited = 0;

  const frame = (active: string, caption: string, lines: number[]) => {
    const visibleIds = new Set([...seen]);
    frames.push({
      kind: "tree",
      nodes: positioned
        .filter((node) => visibleIds.has(node.id))
        .map((node) => ({
          id: node.id,
          label: node.label,
          x: node.x,
          y: node.y,
          role: node.id === active
            ? "active"
            : solutions.has(node.id)
              ? "solution"
              : pruned.has(node.id)
                ? "pruned"
                : activePath.has(node.id)
                  ? "path"
                  : "done",
        })),
      edges: edges.filter((edge) => visibleIds.has(edge.from) && visibleIds.has(edge.to)),
      caption,
      lines,
      stats: [
        { label: "Visited", value: visited },
        { label: "Pruned", value: pruned.size },
        { label: "Solutions", value: solutions.size },
      ],
    });
  };

  const pathFor = (id: string) => (id === "root" ? [] : id.split("-").slice(1).map(Number));
  const dfs = (id: string) => {
    visited++;
    activePath.add(id);
    frame(id, id === "root" ? "Start with an empty path." : `Try path ${nodes.find((node) => node.id === id)?.label}.`, [1, 3, 5]);
    const path = pathFor(id);
    if (shouldPrune(path)) {
      pruned.add(id);
      frame(id, `Prune ${nodes.find((node) => node.id === id)?.label}: it violates a constraint.`, [4]);
      activePath.delete(id);
      return;
    }
    if (path.length === maxDepth) {
      solutions.add(id);
      frame(id, `Record solution ${nodes.find((node) => node.id === id)?.label}.`, [2]);
      activePath.delete(id);
      return;
    }
    for (const child of children.get(id) ?? []) {
      seen.add(child);
      dfs(child);
      frame(id, `Backtrack to ${id === "root" ? "start" : nodes.find((node) => node.id === id)?.label}; undo the last choice.`, [7]);
    }
    activePath.delete(id);
  };
  dfs("root");
  return frames;
}
