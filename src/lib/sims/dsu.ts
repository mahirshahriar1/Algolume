export interface DsuState {
  parent: number[];
  size: number[];
}

export interface DsuFrame {
  parent: number[];
  size: number[];
  active: number[];
  path: number[];
  compressed: number[];
  roots: number[];
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

export interface DsuOpResult {
  frames: DsuFrame[];
  next: DsuState;
}

export const DSU_LIMITS = { min: 4, max: 10 };

export const DSU_CODE = [
  "parent[i] = i; size[i] = 1",
  "find(x):",
  "    if parent[x] != x:",
  "        parent[x] = find(parent[x])",
  "    return parent[x]",
  "unite(a, b):",
  "    ra = find(a); rb = find(b)",
  "    if ra == rb: return false",
  "    if size[ra] < size[rb]: swap(ra, rb)",
  "    parent[rb] = ra",
  "    size[ra] += size[rb]",
];

const clampCount = (n: number) => Math.max(DSU_LIMITS.min, Math.min(DSU_LIMITS.max, Math.floor(n)));
const clampNode = (x: number, n: number) => Math.max(0, Math.min(n - 1, Math.floor(x)));

function clone(state: DsuState): DsuState {
  return { parent: state.parent.slice(), size: state.size.slice() };
}

function rootOf(parent: number[], x: number): number {
  while (parent[x] !== x) x = parent[x];
  return x;
}

function rootList(parent: number[]) {
  return parent.map((p, i) => (p === i ? i : -1)).filter((i) => i >= 0);
}

function componentCount(parent: number[]) {
  return new Set(parent.map((_, i) => rootOf(parent, i))).size;
}

function snapshot(
  state: DsuState,
  caption: string,
  lines: number[],
  markers: Partial<Pick<DsuFrame, "active" | "path" | "compressed" | "roots">> = {},
): DsuFrame {
  return {
    parent: state.parent.slice(),
    size: state.size.slice(),
    active: markers.active ?? [],
    path: markers.path ?? [],
    compressed: markers.compressed ?? [],
    roots: markers.roots ?? rootList(state.parent),
    caption,
    lines,
    stats: [
      { label: "Sets", value: componentCount(state.parent) },
      { label: "Nodes", value: state.parent.length },
      { label: "Roots", value: rootList(state.parent).join(", ") },
    ],
  };
}

export function dsuInitial(count = 8): DsuState {
  const n = clampCount(count);
  return {
    parent: Array.from({ length: n }, (_, i) => i),
    size: Array.from({ length: n }, () => 1),
  };
}

export function dsuSample(count = 8): DsuState {
  const state = dsuInitial(count);
  const n = state.parent.length;
  if (n > 3) {
    state.parent[1] = 0;
    state.parent[2] = 1;
    state.parent[3] = 2;
    state.size[0] = 4;
  }
  if (n > 6) {
    state.parent[5] = 4;
    state.parent[6] = 5;
    state.size[4] = 3;
  }
  if (n > 7) {
    state.parent[7] = 6;
    state.size[4] = 4;
  }
  return state;
}

function traceFind(state: DsuState, x: number, frames: DsuFrame[], label: string): number {
  const start = clampNode(x, state.parent.length);
  const path = [start];
  let cur = start;
  frames.push(snapshot(state, `${label}: start at ${start}.`, [2, 3], { active: [start], path }));

  while (state.parent[cur] !== cur) {
    const next = state.parent[cur];
    frames.push(
      snapshot(state, `${label}: parent[${cur}] = ${next}, so follow the pointer upward.`, [3, 4], {
        active: [cur, next],
        path: path.concat(next),
      }),
    );
    cur = next;
    path.push(cur);
  }

  const root = cur;
  frames.push(snapshot(state, `${label}: ${root} is the root representative.`, [5], { active: [root], path, roots: [root] }));

  for (const node of path.slice(0, -1)) {
    if (state.parent[node] !== root) {
      state.parent[node] = root;
      frames.push(
        snapshot(state, `Path compression: parent[${node}] now points directly to root ${root}.`, [4], {
          active: [node, root],
          path,
          compressed: [node],
          roots: [root],
        }),
      );
    }
  }

  return root;
}

export function dsuFindOp(state: DsuState, x: number): DsuOpResult {
  const next = clone(state);
  const frames: DsuFrame[] = [];
  traceFind(next, x, frames, `find(${clampNode(x, next.parent.length)})`);
  return { frames, next };
}

export function dsuUniteOp(state: DsuState, a: number, b: number): DsuOpResult {
  const next = clone(state);
  const frames: DsuFrame[] = [];
  const u = clampNode(a, next.parent.length);
  const v = clampNode(b, next.parent.length);
  frames.push(snapshot(next, `unite(${u}, ${v}): first find both representatives.`, [6, 7], { active: [u, v] }));
  let ra = traceFind(next, u, frames, `find(${u})`);
  let rb = traceFind(next, v, frames, `find(${v})`);

  if (ra === rb) {
    frames.push(snapshot(next, `${u} and ${v} already share root ${ra}; union would do nothing.`, [8], { active: [u, v], roots: [ra] }));
    return { frames, next };
  }

  if (next.size[ra] < next.size[rb]) {
    [ra, rb] = [rb, ra];
    frames.push(snapshot(next, `Root ${rb} is smaller, so swap roots and attach it under ${ra}.`, [9], { active: [ra, rb], roots: [ra, rb] }));
  } else {
    frames.push(snapshot(next, `Root ${rb} is no larger than ${ra}, so attach ${rb} under ${ra}.`, [9], { active: [ra, rb], roots: [ra, rb] }));
  }

  next.parent[rb] = ra;
  next.size[ra] += next.size[rb];
  next.size[rb] = 1;
  frames.push(snapshot(next, `Union complete: parent[${rb}] = ${ra}; size[${ra}] grows.`, [10, 11], { active: [ra, rb], compressed: [rb], roots: [ra] }));
  return { frames, next };
}

export function buildDsuDemoFrames(): DsuFrame[] {
  let state = dsuSample(8);
  const frames = [snapshot(state, "Sample DSU forest: parent pointers form shallow trees, with one longer chain ready for compression.", [1])];
  let res = dsuFindOp(state, 3);
  frames.push(...res.frames);
  state = res.next;
  res = dsuUniteOp(state, 3, 7);
  frames.push(...res.frames);
  state = res.next;
  res = dsuFindOp(state, 7);
  frames.push(...res.frames);
  return frames;
}
