import type { NodeRole, TreeEdgeView, TreeFrame, TreeNodeView } from "./types";

/**
 * A small binary-tree model with frame builders for BST insertion/search and
 * the four traversals. Layout is computed by in-order x-position (so the tree
 * never overlaps) and depth-based y.
 */

interface BNode {
  value: number;
  left: BNode | null;
  right: BNode | null;
  id: number;
}

let nodeId = 0;
const mk = (value: number): BNode => ({ value, left: null, right: null, id: nodeId++ });

function insert(root: BNode | null, value: number): BNode {
  if (!root) return mk(value);
  if (value < root.value) root.left = insert(root.left, value);
  else root.right = insert(root.right, value);
  return root;
}

/** Assign x by in-order index, y by depth → a clean non-overlapping layout. */
function layout(root: BNode | null): { nodes: Map<number, { x: number; y: number; value: number }>; edges: [number, number][]; depth: number } {
  const nodes = new Map<number, { x: number; y: number; value: number }>();
  const edges: [number, number][] = [];
  let order = 0;
  let maxDepth = 0;
  const walk = (n: BNode | null, d: number) => {
    if (!n) return;
    walk(n.left, d + 1);
    const x = order++;
    nodes.set(n.id, { x, y: d, value: n.value });
    maxDepth = Math.max(maxDepth, d);
    if (n.left) edges.push([n.id, n.left.id]);
    if (n.right) edges.push([n.id, n.right.id]);
    walk(n.right, d + 1);
  };
  walk(root, 0);
  return { nodes, edges, depth: maxDepth };
}

// Layout in "node units": x = in-order column × spacing, y = depth × row. The
// canvas sizes its viewBox from these, so nodes never overlap and wide trees
// just scroll. In-order columns keep each parent between its two subtrees.
const COL = 16;
const ROW = 24;

function view(
  root: BNode | null,
  roles: Map<number, NodeRole>,
  caption: string,
  output?: string,
  lines?: number[],
): TreeFrame {
  const { nodes, edges } = layout(root);
  const nodeViews: TreeNodeView[] = [];
  nodes.forEach((p, id) => {
    nodeViews.push({
      id,
      value: p.value,
      x: (p.x + 0.5) * COL,
      y: 12 + p.y * ROW,
      role: roles.get(id) ?? "default",
    });
  });
  const pathRoles: NodeRole[] = ["path", "active", "match"];
  const edgeViews: TreeEdgeView[] = edges.map(([from, to]) => ({
    from,
    to,
    role: pathRoles.includes(roles.get(to) ?? "default") ? "path" : "default",
  }));
  return { nodes: nodeViews, edges: edgeViews, caption, output, lines };
}

// ---- Pseudocode (frames carry the active lines) ----------------------------
export const BST_CODE = [
  "def insert(node, x):",
  "    if node is None: return Node(x)",
  "    if x < node.val:",
  "        node.left = insert(node.left, x)",
  "    else:",
  "        node.right = insert(node.right, x)",
  "    return node",
  "",
  "def search(node, x):",
  "    while node and node.val != x:",
  "        node = left if x < node.val else right",
  "    return node",
];

export const RB_CODE = [
  "def rb_insert(root, x):",
  "    z = bst_insert(root, x)",
  "    z.color = RED",
  "    while z.parent and z.parent.color == RED:",
  "        if uncle(z).color == RED:",
  "            recolor(parent, uncle, grandparent)",
  "            z = grandparent",
  "        else:",
  "            rotate_to_fix(z)",
  "            recolor(parent, grandparent)",
  "    root.color = BLACK",
];

const TRAVERSAL_CODE: Record<string, string[]> = {
  inorder: ["def inorder(node):", "    if node is None: return", "    inorder(node.left)", "    visit(node)", "    inorder(node.right)"],
  preorder: ["def preorder(node):", "    if node is None: return", "    visit(node)", "    preorder(node.left)", "    preorder(node.right)"],
  postorder: ["def postorder(node):", "    if node is None: return", "    postorder(node.left)", "    postorder(node.right)", "    visit(node)"],
  level: ["def level_order(root):", "    q = deque([root])", "    while q:", "        node = q.popleft()", "        visit(node)", "        q += [node.left, node.right]"],
};
const VISIT_LINE: Record<string, number> = { inorder: 4, preorder: 3, postorder: 5, level: 5 };

export function treeCode(variant: string): string[] {
  if (variant === "red-black") return RB_CODE;
  return variant === "insert" ? BST_CODE : TRAVERSAL_CODE[variant] ?? TRAVERSAL_CODE.inorder;
}

const SEED = [50, 30, 70, 20, 40, 60, 80, 35];

/** Insert a list of values into a fresh BST (insertion order = the values). */
function buildTreeFrom(values: number[]): BNode | null {
  nodeId = 0;
  let root: BNode | null = null;
  for (const v of values) root = insert(root, v);
  return root;
}

function buildSeedTree(values: number[] = SEED): BNode | null {
  return buildTreeFrom(values);
}

/**
 * Reorder values so inserting them yields a height-balanced BST (recursive
 * median-first). Used by the "balanced" tree shape so depth stays ~log₂ n.
 */
export function balancedOrder(values: number[]): number[] {
  const sorted = [...new Set(values)].sort((a, b) => a - b);
  const out: number[] = [];
  const rec = (lo: number, hi: number) => {
    if (lo > hi) return;
    const mid = (lo + hi) >> 1;
    out.push(sorted[mid]);
    rec(lo, mid - 1);
    rec(mid + 1, hi);
  };
  rec(0, sorted.length - 1);
  return out;
}

export type TreeShape = "custom" | "balanced" | "random" | "left-skew" | "right-skew";

/**
 * Produce an insertion sequence of `count` distinct values that realises a
 * requested tree shape. `left-skew`/`right-skew` deliberately build degenerate
 * O(n)-height trees so the depth cost is visible.
 */
export function shapeValues(shape: TreeShape, count: number, seedValues?: number[]): number[] {
  const n = Math.max(1, Math.min(31, Math.floor(count)));
  if (shape === "custom" && seedValues?.length) return seedValues.slice(0, 31);
  // Distinct, evenly spaced values 10..(10+...), easy to read two digits.
  const pool = Array.from({ length: n }, (_, i) => (i + 1) * Math.max(1, Math.floor(96 / (n + 1))));
  if (shape === "left-skew") return [...pool].reverse(); // each insert goes left
  if (shape === "right-skew") return pool; // ascending → each insert goes right
  if (shape === "balanced") return balancedOrder(pool);
  // random: shuffle deterministically-ish by index rotation (no Math.random use)
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (i * 7 + 3) % (i + 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/** Height (max depth + 1) of a BST built from the given insertion sequence. */
export function treeHeight(root: BNode | null): number {
  if (!root) return 0;
  return 1 + Math.max(treeHeight(root.left), treeHeight(root.right));
}

// ---- BST: insert a sequence, showing the search path each time --------------
export function bstInsert(): TreeFrame[] {
  nodeId = 0;
  const seq = [50, 30, 70, 20, 40, 60];
  let root: BNode | null = null;
  const frames: TreeFrame[] = [];

  for (const value of seq) {
    if (!root) {
      root = mk(value);
      frames.push(view(root, new Map([[root.id, "new"]]), `Insert ${value} → it becomes the root.`, undefined, [1, 2]));
      continue;
    }
    const path: number[] = [];
    let cur: BNode | null = root;
    while (cur) {
      path.push(cur.id);
      const roles = new Map<number, NodeRole>(path.map((id) => [id, "path"]));
      roles.set(cur.id, "active");
      const goLeft = value < cur.value;
      frames.push(
        view(root, roles, goLeft ? `${value} < ${cur.value} → go left.` : `${value} ≥ ${cur.value} → go right.`, undefined, goLeft ? [3, 4] : [5, 6]),
      );
      if (goLeft) {
        if (!cur.left) { cur.left = mk(value); break; }
        cur = cur.left;
      } else {
        if (!cur.right) { cur.right = mk(value); break; }
        cur = cur.right;
      }
    }
    const roles = new Map<number, NodeRole>(path.map((id) => [id, "path"]));
    frames.push(view(root, withNew(root, value, roles), `Inserted ${value} at the empty spot.`, undefined, [2]));
  }
  frames.push(view(root, new Map(), "Done — a valid binary search tree (left < node < right).", undefined, [7]));
  return frames;
}

function withNew(root: BNode | null, value: number, roles: Map<number, NodeRole>): Map<number, NodeRole> {
  const find = (n: BNode | null): void => {
    if (!n) return;
    if (n.value === value) roles.set(n.id, "new");
    find(n.left); find(n.right);
  };
  find(root);
  return roles;
}

// ---- Traversals: highlight nodes in visitation order ------------------------
type Order = "inorder" | "preorder" | "postorder" | "level";

function traversalOrder(root: BNode | null, order: Order): BNode[] {
  const out: BNode[] = [];
  if (order === "level") {
    const q: BNode[] = root ? [root] : [];
    while (q.length) {
      const n = q.shift()!;
      out.push(n);
      if (n.left) q.push(n.left);
      if (n.right) q.push(n.right);
    }
    return out;
  }
  const walk = (n: BNode | null) => {
    if (!n) return;
    if (order === "preorder") out.push(n);
    walk(n.left);
    if (order === "inorder") out.push(n);
    walk(n.right);
    if (order === "postorder") out.push(n);
  };
  walk(root);
  return out;
}

const ORDER_LABEL: Record<Order, string> = {
  inorder: "In-order (Left → Node → Right)",
  preorder: "Pre-order (Node → Left → Right)",
  postorder: "Post-order (Left → Right → Node)",
  level: "Level-order (breadth-first)",
};

export function treeTraversal(order: Order, values?: number[]): TreeFrame[] {
  const root = buildSeedTree(values);
  const seq = traversalOrder(root, order);
  const frames: TreeFrame[] = [];
  const visited = new Map<number, NodeRole>();
  const vline = VISIT_LINE[order] ?? 4;
  frames.push(view(root, new Map(), `${ORDER_LABEL[order]}. Press play to walk the tree.`, "", [1]));
  const out: number[] = [];
  for (const n of seq) {
    const roles = new Map(visited);
    roles.set(n.id, "active");
    out.push(n.value);
    frames.push(view(root, roles, `Visit ${n.value}.`, out.join(" → "), [vline]));
    visited.set(n.id, "visited");
  }
  frames.push(view(root, visited, `${ORDER_LABEL[order]} complete.`, out.join(" → "), [vline]));
  return frames;
}

export function buildTreeFrames(variant: string, values?: number[]): TreeFrame[] {
  if (variant === "red-black") return rbInsertSequence();
  if (variant === "insert") return bstInsert();
  if (variant === "preorder" || variant === "postorder" || variant === "level")
    return treeTraversal(variant, values);
  return treeTraversal("inorder", values);
}

// ---- Red-black tree insertion ---------------------------------------------

type RBColor = "R" | "B";

interface RBNode {
  value: number;
  color: RBColor;
  left: RBNode | null;
  right: RBNode | null;
  parent: RBNode | null;
  id: number;
}

let rbId = 1000;
const rbMk = (value: number): RBNode => ({
  value,
  color: "R",
  left: null,
  right: null,
  parent: null,
  id: rbId++,
});

function rbLayout(root: RBNode | null): {
  nodes: Map<number, { x: number; y: number; value: number; color: RBColor }>;
  edges: [number, number][];
} {
  const nodes = new Map<number, { x: number; y: number; value: number; color: RBColor }>();
  const edges: [number, number][] = [];
  let order = 0;
  const walk = (n: RBNode | null, d: number) => {
    if (!n) return;
    walk(n.left, d + 1);
    nodes.set(n.id, { x: order++, y: d, value: n.value, color: n.color });
    if (n.left) edges.push([n.id, n.left.id]);
    if (n.right) edges.push([n.id, n.right.id]);
    walk(n.right, d + 1);
  };
  walk(root, 0);
  return { nodes, edges };
}

function rbView(
  root: RBNode | null,
  highlights: Map<number, NodeRole>,
  caption: string,
  lines?: number[],
): TreeFrame {
  const { nodes, edges } = rbLayout(root);
  const nodeViews: TreeNodeView[] = [];
  nodes.forEach((p, id) => {
    nodeViews.push({
      id,
      value: p.value,
      x: (p.x + 0.5) * COL,
      y: 12 + p.y * ROW,
      role: highlights.get(id) ?? (p.color === "R" ? "red" : "black"),
    });
  });
  const edgeViews: TreeEdgeView[] = edges.map(([from, to]) => ({
    from,
    to,
    role: ["path", "active", "violation", "rotate", "recolor"].includes(highlights.get(to) ?? "")
      ? "path"
      : "default",
  }));
  return { nodes: nodeViews, edges: edgeViews, caption, lines };
}

function rbRoot(n: RBNode | null): RBNode | null {
  let cur = n;
  while (cur?.parent) cur = cur.parent;
  return cur;
}

function rbLeftRotate(root: RBNode, x: RBNode): RBNode {
  const y = x.right;
  if (!y) return root;
  x.right = y.left;
  if (y.left) y.left.parent = x;
  y.parent = x.parent;
  if (!x.parent) root = y;
  else if (x === x.parent.left) x.parent.left = y;
  else x.parent.right = y;
  y.left = x;
  x.parent = y;
  return root;
}

function rbRightRotate(root: RBNode, x: RBNode): RBNode {
  const y = x.left;
  if (!y) return root;
  x.left = y.right;
  if (y.right) y.right.parent = x;
  y.parent = x.parent;
  if (!x.parent) root = y;
  else if (x === x.parent.right) x.parent.right = y;
  else x.parent.left = y;
  y.right = x;
  x.parent = y;
  return root;
}

function rbInsertRaw(root: RBNode | null, z: RBNode): RBNode {
  let y: RBNode | null = null;
  let x = root;
  while (x) {
    y = x;
    x = z.value < x.value ? x.left : x.right;
  }
  z.parent = y;
  if (!y) return z;
  if (z.value < y.value) y.left = z;
  else y.right = z;
  return root!;
}

function rbRolePairs(nodes: (RBNode | null | undefined)[], role: NodeRole): [number, NodeRole][] {
  return nodes.filter(Boolean).map((n) => [(n as RBNode).id, role]);
}

export function rbInsertSequence(values: number[] = [41, 38, 31, 12, 19, 8, 50, 60]): TreeFrame[] {
  rbId = 1000;
  let root: RBNode | null = null;
  const frames: TreeFrame[] = [];

  for (const value of values) {
    const z = rbMk(value);
    root = rbInsertRaw(root, z);
    root = rbRoot(root)!;
    frames.push(
      rbView(
        root,
        new Map([[z.id, "new"]]),
        `Insert ${value} as a red node using ordinary BST insertion.`,
        [1, 2, 3],
      ),
    );

    let cur = z;
    while (cur.parent?.color === "R") {
      const parent = cur.parent;
      const grand = parent.parent;
      if (!grand) break;
      const parentIsLeft = parent === grand.left;
      const uncle = parentIsLeft ? grand.right : grand.left;
      frames.push(
        rbView(
          root,
          new Map([
            ...rbRolePairs([cur], "active"),
            ...rbRolePairs([parent], "violation"),
            ...rbRolePairs([grand], "path"),
            ...rbRolePairs([uncle], uncle?.color === "R" ? "recolor" : "path"),
          ]),
          `Red parent violation: ${cur.value} and parent ${parent.value} are both red.`,
          [4],
        ),
      );

      if (uncle?.color === "R") {
        parent.color = "B";
        uncle.color = "B";
        grand.color = "R";
        frames.push(
          rbView(
            root,
            new Map([
              ...rbRolePairs([parent, uncle, grand], "recolor"),
            ]),
            `Uncle ${uncle.value} is red: recolor parent and uncle black, grandparent red.`,
            [5, 6, 7],
          ),
        );
        cur = grand;
        continue;
      }

      if (parentIsLeft && cur === parent.right) {
        root = rbLeftRotate(root, parent);
        frames.push(
          rbView(root, new Map(rbRolePairs([parent, cur], "rotate")), "Left rotate parent to turn the triangle into a line.", [8]),
        );
        cur = parent;
      } else if (!parentIsLeft && cur === parent.left) {
        root = rbRightRotate(root, parent);
        frames.push(
          rbView(root, new Map(rbRolePairs([parent, cur], "rotate")), "Right rotate parent to turn the triangle into a line.", [8]),
        );
        cur = parent;
      }

      const p = cur.parent!;
      const g = p.parent!;
      p.color = "B";
      g.color = "R";
      if (p === g.left) {
        root = rbRightRotate(root, g);
        frames.push(
          rbView(root, new Map(rbRolePairs([p, g], "rotate")), "Right rotate grandparent, then recolor to restore the invariants.", [8, 9]),
        );
      } else {
        root = rbLeftRotate(root, g);
        frames.push(
          rbView(root, new Map(rbRolePairs([p, g], "rotate")), "Left rotate grandparent, then recolor to restore the invariants.", [8, 9]),
        );
      }
      root = rbRoot(root)!;
    }

    root = rbRoot(root)!;
    if (root.color !== "B") {
      root.color = "B";
      frames.push(rbView(root, new Map([[root.id, "recolor"]]), "Force the root black.", [10]));
    } else {
      frames.push(rbView(root, new Map(), "Root is black; red-black properties hold after this insertion.", [10]));
    }
  }

  frames.push(rbView(root, new Map(), "Done — the tree remains approximately balanced by recolors and rotations.", [10]));
  return frames;
}

// ---- Interactive ops: operate on a live root the page holds in a ref --------

export type BstHandle = BNode | null;

export function bstSeed(): BstHandle {
  nodeId = 0;
  let root: BNode | null = null;
  for (const v of [50, 30, 70, 20, 40, 60]) root = insert(root, v);
  return root;
}

export function emptyBst(): BstHandle {
  return null;
}

/** A still frame of the current tree (no highlights). */
export function bstSnapshot(root: BstHandle, caption: string): TreeFrame {
  return view(root, new Map(), caption, undefined, [1]);
}

export interface TreeOpResult {
  frames: TreeFrame[];
  next: BstHandle;
}

/** Insert a value, animating the search path then the new node. */
export function bstInsertOp(root: BstHandle, value: number): TreeOpResult {
  if (!root) {
    const r = mk(value);
    return { next: r, frames: [view(r, new Map([[r.id, "new"]]), `Insert ${value} → it becomes the root.`, undefined, [1, 2])] };
  }
  const frames: TreeFrame[] = [];
  const path: number[] = [];
  let cur: BNode | null = root;
  while (cur) {
    path.push(cur.id);
    const roles = new Map<number, NodeRole>(path.map((id) => [id, "path"]));
    roles.set(cur.id, "active");
    const goLeft = value < cur.value;
    frames.push(view(root, roles, goLeft ? `${value} < ${cur.value} → go left.` : value > cur.value ? `${value} > ${cur.value} → go right.` : `${value} is already in the tree.`, undefined, value === cur.value ? [2] : goLeft ? [3, 4] : [5, 6]));
    if (value === cur.value) return { next: root, frames };
    if (goLeft) {
      if (!cur.left) { cur.left = mk(value); break; }
      cur = cur.left;
    } else {
      if (!cur.right) { cur.right = mk(value); break; }
      cur = cur.right;
    }
  }
  frames.push(view(root, withNew(root, value, new Map(path.map((id) => [id, "path"]))), `Inserted ${value}.`, undefined, [2]));
  return { next: root, frames };
}

/** In-order traversal of the current tree — visits in sorted order. */
export function bstTraverseOp(root: BstHandle): TreeOpResult {
  const seq = traversalOrder(root, "inorder");
  const frames: TreeFrame[] = [];
  const visited = new Map<number, NodeRole>();
  const out: number[] = [];
  frames.push(view(root, new Map(), "In-order traversal — left, node, right.", "", []));
  for (const n of seq) {
    const roles = new Map(visited);
    roles.set(n.id, "active");
    out.push(n.value);
    frames.push(view(root, roles, `Visit ${n.value}.`, out.join(" → "), []));
    visited.set(n.id, "visited");
  }
  frames.push(view(root, visited, "Done — in-order gives the values in sorted order.", out.join(" → "), []));
  return { next: root, frames };
}

/** Search a value, animating the comparison path. */
export function bstSearchOp(root: BstHandle, value: number): TreeOpResult {
  const frames: TreeFrame[] = [];
  const path: number[] = [];
  let cur: BNode | null = root;
  while (cur) {
    path.push(cur.id);
    const roles = new Map<number, NodeRole>(path.map((id) => [id, "path"]));
    if (cur.value === value) {
      roles.set(cur.id, "match");
      frames.push(view(root, roles, `Found ${value}!`, undefined, [12]));
      return { next: root, frames };
    }
    roles.set(cur.id, "active");
    frames.push(view(root, roles, value < cur.value ? `${value} < ${cur.value} → search left.` : `${value} > ${cur.value} → search right.`, undefined, [10, 11]));
    cur = value < cur.value ? cur.left : cur.right;
  }
  frames.push(view(root, new Map(path.map((id) => [id, "path"])), `${value} is not in the tree.`, undefined, [12]));
  return { next: root, frames };
}
