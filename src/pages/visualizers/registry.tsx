import {
  BarChart3, Binary, CalendarRange, Dices, GitBranch, Grid3x3, Hash, Layers, ListRestart, ListTree, Network, Rows3, Search, Sigma, Spline,
  Triangle, Type,
  type LucideIcon,
} from "lucide-react";
import {
  InteractiveSeq, InteractiveHash, ArrayViz, SearchingViz, RecursionViz, TraversalViz,
  TreesViz, GraphAlgosViz, HeapViz, DpViz, BitsViz, GreedyLab, MatchViz, SieveViz, GameViz,
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
  /** 3-pane page body for this visualizer; `id` is the matched route id (for alias tabs). */
  Component?: (entry: VizEntry, id?: string) => JSX.Element;
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
    id: "heap",
    title: "Heap / priority queue",
    blurb: "Insert and extract-min on a min-heap — watch values sift up and down, with the backing array in sync.",
    icon: Triangle,
    accent: "text-pivot",
    lesson: "/learn/heaps/heap-basics",
    complexity: [{ label: "Push", value: "O(log n)" }, { label: "Pop-min", value: "O(log n)" }, { label: "Peek", value: "O(1)" }],
    Component: (e) => <HeapViz complexity={e.complexity} lesson={e.lesson} />,
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
    id: "sieve",
    title: "Sieve of Eratosthenes",
    blurb: "Cross out composites: for each prime p, strike its multiples from p². What survives is prime.",
    icon: Sigma,
    accent: "text-run",
    lesson: "/learn/math/primes-combinatorics",
    complexity: [{ label: "Time", value: "n log log n" }, { label: "Space", value: "O(n)" }],
    Component: (e) => <SieveViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "game-theory",
    title: "Game theory (Nim / Grundy)",
    blurb: "Subtraction game: compute Win/Lose positions and Grundy numbers bottom-up from the terminal state.",
    icon: Dices,
    accent: "text-pivot",
    lesson: "/learn/game-theory/game-basics",
    complexity: [{ label: "W/L", value: "O(n·k)" }, { label: "Grundy", value: "O(n·k)" }, { label: "Nim", value: "O(piles)" }],
    Component: (e) => <GameViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "matching",
    title: "String pattern matching",
    blurb: "Slide a pattern across text — naive vs KMP. Watch comparisons, mismatches, and KMP's failure-function skips.",
    icon: Type,
    accent: "text-compare",
    lesson: "/learn/strings/pattern-matching",
    complexity: [{ label: "Naive", value: "O(n·m)" }, { label: "KMP", value: "O(n+m)" }, { label: "Space", value: "O(m)" }],
    Component: (e) => <MatchViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "greedy",
    title: "Greedy algorithms",
    blurb: "Three classics in one lab: activity selection (interval timeline), Kadane's max subarray, and fractional knapsack.",
    icon: CalendarRange,
    accent: "text-run",
    lesson: "/learn/greedy/greedy-intro",
    complexity: [{ label: "Activity", value: "n log n" }, { label: "Kadane", value: "O(n)" }, { label: "Knapsack", value: "n log n" }],
    Component: (_e, id) => <GreedyLab initial={id} />,
  },
  {
    id: "bits",
    title: "Bit manipulation",
    blurb: "AND/OR/XOR/NOT, shifts, and the x & -x / x & (x-1) tricks — applied bit by bit on 8-bit binary with place values.",
    icon: Binary,
    accent: "text-compare",
    lesson: "/learn/bit-manipulation/bit-basics",
    complexity: [{ label: "Op", value: "O(1)" }, { label: "Popcount", value: "O(bits)" }, { label: "Width", value: "8-bit" }],
    Component: (e) => <BitsViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "dp",
    title: "Dynamic programming",
    blurb: "Watch a DP table fill cell by cell: coin change (1D), unique paths, and edit distance (2D), with dependencies highlighted.",
    icon: Grid3x3,
    accent: "text-visited",
    lesson: "/learn/dynamic-programming/dp-1d",
    complexity: [{ label: "Coin", value: "O(amount·k)" }, { label: "Paths", value: "O(R·C)" }, { label: "Edit", value: "O(m·n)" }],
    Component: (e) => <DpViz complexity={e.complexity} lesson={e.lesson} />,
  },
  {
    id: "graphs",
    title: "Graph algorithms",
    blurb: "One weighted-graph lab: shortest paths (Bellman-Ford/Floyd-Warshall), minimum spanning trees (Kruskal/Prim), and the union-find structure that powers Kruskal.",
    icon: Network,
    accent: "text-run",
    lesson: "/learn/minimum-spanning-trees/mst-definition",
    complexity: [{ label: "Shortest", value: "O(VE)" }, { label: "MST", value: "E log V" }, { label: "Union-Find", value: "α(n)" }],
    Component: (_e, id) => <GraphAlgosViz initial={id} />,
  },
];

const BASE_VIZ_BY_ID = Object.fromEntries(VISUALIZERS.map((v) => [v.id, v])) as Record<string, VizEntry>;

// Old per-algorithm routes still resolve — they open the unified Graph lab, and
// GraphAlgosViz reads the route id to preselect the matching tab.
export const VIZ_BY_ID = {
  ...BASE_VIZ_BY_ID,
  bst: BASE_VIZ_BY_ID.trees,
  "red-black-tree": BASE_VIZ_BY_ID.trees,
  "shortest-paths": BASE_VIZ_BY_ID.graphs,
  "bellman-ford": BASE_VIZ_BY_ID.graphs,
  "floyd-warshall": BASE_VIZ_BY_ID.graphs,
  mst: BASE_VIZ_BY_ID.graphs,
  kruskal: BASE_VIZ_BY_ID.graphs,
  prim: BASE_VIZ_BY_ID.graphs,
  dsu: BASE_VIZ_BY_ID.graphs,
  "union-find": BASE_VIZ_BY_ID.graphs,
  kadane: BASE_VIZ_BY_ID.greedy,
  knapsack: BASE_VIZ_BY_ID.greedy,
  "activity-selection": BASE_VIZ_BY_ID.greedy,
} as Record<string, VizEntry>;
