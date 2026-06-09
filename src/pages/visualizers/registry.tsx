import {
  BarChart3, GitBranch, Hash, Layers, ListRestart, ListTree, Network, Rows3, Search, Spline,
  type LucideIcon,
} from "lucide-react";
import {
  InteractiveSeq, InteractiveHash, ArrayViz, SearchingViz, RecursionViz, TraversalViz,
  TreesViz, ShortestPathViz, MstViz, DsuViz,
} from "@/components/sim/Interactive";

export interface VizEntry {
  id: string;
  title: string;
  blurb: string;
  icon: LucideIcon;
  accent: string;
  lesson?: string;
  /** external standalone page (Sorting/Pathfinding have richer dedicated pages) */
  to?: string;
  complexity?: { label: string; value: string }[];
  /** 3-pane page body for this visualizer */
  Component?: (entry: VizEntry) => JSX.Element;
}

export const VISUALIZERS: VizEntry[] = [
  {
    id: "array",
    title: "Array techniques",
    blurb: "Four patterns in one: two-pointer reverse, binary search, ternary search, and the sliding window.",
    icon: Rows3,
    accent: "text-run",
    lesson: "/learn/arrays/array-basics",
    complexity: [{ label: "Index", value: "O(1)" }, { label: "Search", value: "O(n)" }, { label: "Ins mid", value: "O(n)" }],
    Component: (e) => <ArrayViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "searching",
    title: "Searching",
    blurb: "Linear, binary and ternary search with custom arrays, target values, and live candidate windows.",
    icon: Search,
    accent: "text-compare",
    lesson: "/learn/searching/linear-search",
    complexity: [{ label: "Linear", value: "O(n)" }, { label: "Binary", value: "O(log n)" }, { label: "Ternary", value: "O(log n)" }],
    Component: (e) => <SearchingViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "sorting",
    title: "Sorting",
    blurb: "Bubble, insertion, selection, merge & quick sort — comparisons and swaps, live.",
    icon: BarChart3,
    accent: "text-swap",
    to: "/sorting",
    lesson: "/learn/sorting/meet-sorting",
  },
  {
    id: "recursion",
    title: "Recursion & backtracking",
    blurb: "Custom call stacks, divide-and-conquer trees, and backtracking/pruning trees.",
    icon: ListRestart,
    accent: "text-pivot",
    lesson: "/learn/recursion/recursion-basics",
    complexity: [{ label: "Chain sp.", value: "O(d)" }, { label: "Tree time", value: "O(b^d)" }, { label: "D&C", value: "n log n" }],
    Component: (e) => <RecursionViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "linked-list",
    title: "Linked list",
    blurb: "Insert at head or tail, delete a value — see why access is O(n).",
    icon: Spline,
    accent: "text-visited",
    lesson: "/learn/linked-lists/linked-list-basics",
    complexity: [{ label: "Ins head", value: "O(1)" }, { label: "Access", value: "O(n)" }, { label: "Delete", value: "O(n)" }],
    Component: (e) => <InteractiveSeq kind="linked-list" complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "stack",
    title: "Stack (LIFO)",
    blurb: "Push and pop from the top. Add your own values and watch it behave.",
    icon: Layers,
    accent: "text-pivot",
    lesson: "/learn/stacks-queues/stack",
    complexity: [{ label: "Push", value: "O(1)" }, { label: "Pop", value: "O(1)" }, { label: "Search", value: "O(n)" }],
    Component: (e) => <InteractiveSeq kind="stack" complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "queue",
    title: "Queue (FIFO)",
    blurb: "Enqueue at the rear, dequeue from the front — interactively.",
    icon: Layers,
    accent: "text-compare",
    lesson: "/learn/stacks-queues/queue",
    complexity: [{ label: "Enqueue", value: "O(1)" }, { label: "Dequeue", value: "O(1)" }, { label: "Search", value: "O(n)" }],
    Component: (e) => <InteractiveSeq kind="queue" complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "hash",
    title: "Hash table",
    blurb: "Insert keys with h(k)=k mod 7 and watch collisions chain.",
    icon: Hash,
    accent: "text-compare",
    lesson: "/learn/hashing/hash-tables",
    complexity: [{ label: "Insert", value: "O(1)*" }, { label: "Lookup", value: "O(1)*" }, { label: "Worst", value: "O(n)" }],
    Component: (e) => <InteractiveHash complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "trees",
    title: "Trees & BSTs",
    blurb: "BST insert/search plus red-black recolors and rotations in one tree lab.",
    icon: GitBranch,
    accent: "text-run",
    lesson: "/learn/trees/tree-basics",
    complexity: [{ label: "BST", value: "O(h)" }, { label: "RB", value: "O(log n)" }, { label: "Rot.", value: "O(1)" }],
    Component: (e) => <TreesViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "dsu",
    title: "DSU / Union-Find",
    blurb: "Find representatives, compress paths, and unite components by size.",
    icon: GitBranch,
    accent: "text-compare",
    lesson: "/learn/minimum-spanning-trees/kruskal-dsu",
    complexity: [{ label: "Find", value: "α(n)" }, { label: "Union", value: "α(n)" }, { label: "Space", value: "O(n)" }],
    Component: (e) => <DsuViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "traversals",
    title: "Tree traversals",
    blurb: "In-order, pre-order, post-order and level-order on one tree.",
    icon: ListTree,
    accent: "text-pivot",
    lesson: "/learn/traversals/tree-traversals",
    complexity: [{ label: "Traversal", value: "O(n)" }, { label: "DFS sp.", value: "O(h)" }, { label: "BFS sp.", value: "O(w)" }],
    Component: (e) => <TraversalViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "pathfinding",
    title: "Pathfinding",
    blurb: "BFS, DFS, Dijkstra & A* on a grid and a weighted node graph.",
    icon: Network,
    accent: "text-compare",
    to: "/pathfinding",
    lesson: "/learn/pathfinding/search-a-grid",
  },
  {
    id: "shortest-paths",
    title: "Shortest paths",
    blurb: "Bellman-Ford edge relaxation and Floyd-Warshall matrix dynamic programming.",
    icon: Network,
    accent: "text-run",
    lesson: "/learn/pathfinding/bellman-ford",
    complexity: [{ label: "BF", value: "O(VE)" }, { label: "FW", value: "O(V^3)" }, { label: "Space", value: "V / V^2" }],
    Component: (e) => <ShortestPathViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "mst",
    title: "Minimum spanning trees",
    blurb: "Kruskal edge acceptance/rejection and Prim cut growth on editable weighted graphs.",
    icon: Network,
    accent: "text-pivot",
    lesson: "/learn/minimum-spanning-trees/mst-definition",
    complexity: [{ label: "Kruskal", value: "O(E log E)" }, { label: "Prim", value: "O(E log V)" }, { label: "DSU", value: "α(V)" }],
    Component: (e) => <MstViz complexity={e.complexity} lesson={e.lesson} />,
  },
];

const BASE_VIZ_BY_ID = Object.fromEntries(VISUALIZERS.map((v) => [v.id, v])) as Record<string, VizEntry>;

export const VIZ_BY_ID = {
  ...BASE_VIZ_BY_ID,
  bst: BASE_VIZ_BY_ID.trees,
  "red-black-tree": BASE_VIZ_BY_ID.trees,
  "bellman-ford": BASE_VIZ_BY_ID["shortest-paths"],
  "floyd-warshall": BASE_VIZ_BY_ID["shortest-paths"],
} as Record<string, VizEntry>;
