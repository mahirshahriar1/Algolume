import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import {
  Plus, Minus, Search, RotateCcw, Trash2, CornerDownLeft, Shuffle,
  ArrowLeftRight, ListOrdered, GitBranch,
} from "lucide-react";
import { usePlayer } from "@/lib/usePlayer";
import { VizShell3 } from "./VizShell3";
import { SeqCanvas } from "./SeqCanvas";
import { TreeCanvas } from "./TreeCanvas";
import { HashCanvas } from "./HashCanvas";
import { RecursionCanvas } from "./RecursionCanvas";
import { ShortestPathCanvas } from "./ShortestPathCanvas";
import { MstCanvas } from "./MstCanvas";
import { DsuCanvas } from "./DsuCanvas";
import type { SeqFrame, SeqItem } from "@/lib/sims/types";
import {
  pushStack, popStack, enqueue, dequeue, insertHead, insertTail, deleteValue, reverseList,
  arrayTwoPointer, linearSearchSim, binarySearchSim, slidingWindowSim,
  ternarySearchSim,
  seqSeed, seqRestFrame, SEQ_CODE, type SeqOpResult,
} from "@/lib/sims/sequence";
import {
  bstSeed, bstSnapshot, bstInsertOp, bstSearchOp, bstTraverseOp, emptyBst, buildTreeFrames, treeCode, BST_CODE,
  rbInsertSequence, RB_CODE, shapeValues, type TreeShape,
  type BstHandle, type TreeOpResult,
} from "@/lib/sims/tree";
import { emptyBuckets, hashInsertOp, hashLookupOp, HASH_CODE, type Bucket, type HashFrame } from "@/lib/sims/hash";
import {
  heapSeed, heapSnapshot, heapInsertOp, heapExtractOp, HEAP_CODE,
  type HeapHandle, type HeapFrame, type HeapOpResult,
} from "@/lib/sims/heap";
import { HeapCanvas } from "./HeapCanvas";
import {
  buildDpFrames, dpCode, DP_LIMITS, type DpMode,
} from "@/lib/sims/dp";
import { DpCanvas } from "./DpCanvas";
import {
  buildBitFrames, bitCode, BIT_OPS, BIT_MASK, type BitOp,
} from "@/lib/sims/bits";
import { BitsCanvas } from "./BitsCanvas";
import {
  buildActivitySelection, parseIntervals, intervalsToText, GREEDY_CODE, GREEDY_LIMITS, GREEDY_SAMPLE,
  type RawInterval,
} from "@/lib/sims/greedy";
import { GreedyCanvas } from "./GreedyCanvas";
import { buildKadaneFrames, KADANE_CODE } from "@/lib/sims/kadane";
import { KadaneCanvas } from "./KadaneCanvas";
import {
  buildKnapsackFrames, parseItems, itemsToText, KNAPSACK_CODE, KNAPSACK_LIMITS, KNAPSACK_SAMPLE,
} from "@/lib/sims/knapsack";
import { KnapsackCanvas } from "./KnapsackCanvas";
import { buildMatchFrames, matchCode, MATCH_LIMITS, type MatchMode } from "@/lib/sims/matching";
import { MatchCanvas } from "./MatchCanvas";
import { buildSieveFrames, SIEVE_CODE, SIEVE_LIMITS } from "@/lib/sims/sieve";
import { SieveCanvas } from "./SieveCanvas";
import { buildGameFrames, gameCode, GAME_LIMITS, type GameMode } from "@/lib/sims/game";
import { GameCanvas } from "./GameCanvas";
import {
  buildBacktrackingFrames,
  buildDivideFrames,
  buildFactorialFrames,
  REC_CODE,
  type RecMode,
} from "@/lib/sims/recursion";
import {
  buildShortestPathFrames,
  shortestPathCode,
  circleNodes,
  generateGraph,
  parseEdges,
  edgesToText,
  SP_LIMITS,
  type ShortestPathMode,
} from "@/lib/sims/shortestPath";
import {
  buildMstFrames,
  mstCode,
  circleMstNodes,
  generateMstGraph,
  parseMstEdges,
  mstEdgesToText,
  MST_LIMITS,
  type MstMode,
} from "@/lib/sims/mst";
import {
  dsuInitial,
  dsuSample,
  dsuFindOp,
  dsuUniteOp,
  DSU_CODE,
  DSU_LIMITS,
  type DsuFrame,
  type DsuState,
} from "@/lib/sims/dsu";
import { cn } from "@/lib/cn";

interface Meta {
  complexity?: { label: string; value: string }[];
  lesson?: string;
}

/* ---- shared control bits -------------------------------------------------- */

function Controls({ title, children, legend }: { title: string; children: ReactNode; legend?: ReactNode }) {
  return (
    <section className="panel space-y-3 p-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-subtle">{title}</h2>
      {children}
      {legend && <div className="border-t border-line/70 pt-3">{legend}</div>}
    </section>
  );
}

function Legend({ items }: { items: { label: string; cls: string }[] }) {
  return (
    <div className="flex flex-wrap gap-x-3 gap-y-1.5">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5 text-[11px] text-muted">
          <span className={cn("h-2.5 w-2.5 rounded-sm", it.cls)} />
          {it.label}
        </span>
      ))}
    </div>
  );
}

function OpButton({ onClick, icon, children, tone = "ghost" }: { onClick: () => void; icon?: ReactNode; children: ReactNode; tone?: "primary" | "ghost" }) {
  return (
    <button onClick={onClick} className={cn("w-full", tone === "primary" ? "btn-primary" : "btn-ghost")}>
      {icon}
      {children}
    </button>
  );
}

function NumInput({ value, onChange, onEnter }: { value: string; onChange: (v: string) => void; onEnter: () => void }) {
  return (
    <div className="relative">
      <input
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
        onKeyDown={(e) => e.key === "Enter" && onEnter()}
        placeholder="value"
        inputMode="numeric"
        className="h-10 w-full rounded-lg border border-line bg-surface pl-3 pr-7 font-mono text-sm text-fg
          placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
      />
      <CornerDownLeft className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
    </div>
  );
}

const SEQ_LEGEND = [
  { label: "Active", cls: "bg-compare" },
  { label: "New", cls: "bg-run" },
  { label: "Settled", cls: "bg-run/20" },
];
const TREE_LEGEND = [
  { label: "Path", cls: "bg-pivot/40" },
  { label: "Current", cls: "bg-compare" },
  { label: "Visited", cls: "bg-visited/70" },
  { label: "Found", cls: "bg-run" },
];

const rnd = () => Math.floor(Math.random() * 90 + 10);
const parseNums = (raw: string, fallback: number[]) => {
  const nums = raw
    .split(/[,\s]+/)
    .map((part) => parseInt(part, 10))
    .filter((n) => Number.isFinite(n))
    .slice(0, 18)
    .map((n) => Math.max(0, Math.min(99, n)));
  return nums.length ? nums : fallback;
};

/* ---- Stack / Queue / Linked list ----------------------------------------- */

export function InteractiveSeq({ kind, complexity, lesson }: { kind: "stack" | "queue" | "linked-list" } & Meta) {
  // Lazy one-time seed — seqSeed/item must not run on every render.
  const stateRef = useRef<SeqItem[]>([]);
  const inited = useRef(false);
  if (!inited.current) {
    inited.current = true;
    stateRef.current = seqSeed(kind);
  }
  const [frames, setFrames] = useState<SeqFrame[]>(() => [seqRestFrame(kind, stateRef.current)]);
  const [val, setVal] = useState("");
  const player = usePlayer(frames, 3, true);

  const apply = (res: SeqOpResult) => {
    stateRef.current = res.next;
    setFrames(res.frames.length ? res.frames : [seqRestFrame(kind, res.next)]);
    setVal("");
  };
  const num = () => (val === "" ? rnd() : parseInt(val, 10));
  const clear = () => {
    stateRef.current = [];
    setFrames([seqRestFrame(kind, [])]);
  };

  let buttons: ReactNode;
  if (kind === "stack") {
    buttons = (
      <>
        <OpButton tone="primary" onClick={() => apply(pushStack(stateRef.current, num()))} icon={<Plus className="h-4 w-4" />}>Push</OpButton>
        <OpButton onClick={() => apply(popStack(stateRef.current))} icon={<Minus className="h-4 w-4" />}>Pop</OpButton>
      </>
    );
  } else if (kind === "queue") {
    buttons = (
      <>
        <OpButton tone="primary" onClick={() => apply(enqueue(stateRef.current, num()))} icon={<Plus className="h-4 w-4" />}>Enqueue</OpButton>
        <OpButton onClick={() => apply(dequeue(stateRef.current))} icon={<Minus className="h-4 w-4" />}>Dequeue</OpButton>
      </>
    );
  } else {
    buttons = (
      <>
        <OpButton tone="primary" onClick={() => apply(insertHead(stateRef.current, num()))} icon={<Plus className="h-4 w-4" />}>Ins head</OpButton>
        <OpButton onClick={() => apply(insertTail(stateRef.current, num()))} icon={<Plus className="h-4 w-4" />}>Ins tail</OpButton>
        <OpButton onClick={() => apply(deleteValue(stateRef.current, num()))} icon={<Minus className="h-4 w-4" />}>Delete</OpButton>
        <OpButton onClick={() => apply(reverseList(stateRef.current))} icon={<ArrowLeftRight className="h-4 w-4" />}>Reverse</OpButton>
      </>
    );
  }

  const controls = (
    <Controls title="Operations" legend={<Legend items={SEQ_LEGEND} />}>
      <NumInput value={val} onChange={setVal} onEnter={() => apply(kind === "stack" ? pushStack(stateRef.current, num()) : kind === "queue" ? enqueue(stateRef.current, num()) : insertHead(stateRef.current, num()))} />
      <div className="grid grid-cols-2 gap-2">
        {buttons}
        <OpButton onClick={clear} icon={<Trash2 className="h-4 w-4" />}>Clear</OpButton>
      </div>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={SEQ_CODE[kind]}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[{ label: "Size", value: player.current?.items.length ?? 0 }]}
      canvas={<SeqCanvas frame={player.current} linked={kind === "linked-list"} />}
    />
  );
}

/* ---- Binary search tree --------------------------------------------------- */

export function InteractiveBst({ complexity, lesson }: Meta) {
  // Lazy one-time seed — bstSeed() resets the global node-id counter, so it must
  // run exactly once (not on every render) or inserted nodes collide on id.
  const rootRef = useRef<BstHandle>(null);
  const inited = useRef(false);
  if (!inited.current) {
    inited.current = true;
    rootRef.current = bstSeed();
  }
  const [frames, setFrames] = useState(() => [bstSnapshot(rootRef.current, "Insert a value, or search for one.")]);
  const [val, setVal] = useState("");
  const player = usePlayer(frames, 2, true);

  const apply = (res: TreeOpResult) => {
    rootRef.current = res.next;
    setFrames(res.frames.length ? res.frames : [bstSnapshot(res.next, "")]);
    setVal("");
  };
  const num = () => (val === "" ? rnd() : parseInt(val, 10));

  const controls = (
    <Controls title="Operations" legend={<Legend items={TREE_LEGEND} />}>
      <NumInput value={val} onChange={setVal} onEnter={() => apply(bstInsertOp(rootRef.current, num()))} />
      <div className="grid grid-cols-2 gap-2">
        <OpButton tone="primary" onClick={() => apply(bstInsertOp(rootRef.current, num()))} icon={<Plus className="h-4 w-4" />}>Insert</OpButton>
        <OpButton onClick={() => apply(bstSearchOp(rootRef.current, num()))} icon={<Search className="h-4 w-4" />}>Search</OpButton>
        <OpButton onClick={() => apply(bstTraverseOp(rootRef.current))} icon={<ListOrdered className="h-4 w-4" />}>In-order</OpButton>
        <OpButton onClick={() => { rootRef.current = bstSeed(); setFrames([bstSnapshot(rootRef.current, "Reset to a sample tree.")]); }} icon={<RotateCcw className="h-4 w-4" />}>Sample</OpButton>
        <OpButton onClick={() => { rootRef.current = emptyBst(); setFrames([bstSnapshot(null, "Empty tree — insert to begin.")]); }} icon={<Trash2 className="h-4 w-4" />}>Clear</OpButton>
      </div>
    </Controls>
  );

  const tf = player.current;
  const nodes = tf?.nodes.length ?? 0;
  const height = nodes ? Math.max(...tf!.nodes.map((n) => Math.round((n.y - 12) / 24))) + 1 : 0;

  return (
    <VizShell3
      player={player}
      code={BST_CODE}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[{ label: "Nodes", value: nodes }, { label: "Height", value: height }]}
      canvas={<TreeCanvas frame={player.current} className="h-[20rem]" />}
    />
  );
}

type TreeMode = "bst" | "red-black";

const TREE_MODES: [TreeMode, string, string][] = [
  ["bst", "BST", "Insert, search, and in-order traversal."],
  ["red-black", "Red-black", "Recolors and rotations after insertion."],
];

export function TreesViz({ complexity, lesson }: Meta) {
  const [mode, setMode] = useState<TreeMode>("bst");

  const rootRef = useRef<BstHandle>(null);
  const inited = useRef(false);
  if (!inited.current) {
    inited.current = true;
    rootRef.current = bstSeed();
  }
  const [bstFrames, setBstFrames] = useState(() => [bstSnapshot(rootRef.current, "Insert a value, or search for one.")]);
  const [val, setVal] = useState("");
  const applyBst = (res: TreeOpResult) => {
    rootRef.current = res.next;
    setBstFrames(res.frames.length ? res.frames : [bstSnapshot(res.next, "")]);
    setVal("");
  };
  const num = () => (val === "" ? rnd() : parseInt(val, 10));

  const [raw, setRaw] = useState(RB_SAMPLE.join(", "));
  const [seed, setSeed] = useState(0);
  const rbValues = useMemo(() => parseNums(raw, RB_SAMPLE).slice(0, 12), [raw]);
  const rbFrames = useMemo(() => {
    void seed;
    return rbInsertSequence(rbValues);
  }, [rbValues, seed]);

  const frames = mode === "bst" ? bstFrames : rbFrames;
  const player = usePlayer(frames, 2, true, true);

  const modePicker = (
    <div className="grid gap-1.5">
      {TREE_MODES.map(([id, label, desc]) => (
        <button
          key={id}
          onClick={() => setMode(id)}
          className={cn(
            "rounded-lg px-3 py-2 text-left transition-colors duration-150 cursor-pointer",
            id === mode ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
          )}
        >
          <span className="block text-sm font-semibold">{label}</span>
          <span className="block text-[11px] leading-4 text-subtle">{desc}</span>
        </button>
      ))}
    </div>
  );

  const controls =
    mode === "bst" ? (
      <Controls title="Trees visualizer" legend={<Legend items={TREE_LEGEND} />}>
        {modePicker}
        <div className="border-t border-line/70 pt-3">
          <NumInput value={val} onChange={setVal} onEnter={() => applyBst(bstInsertOp(rootRef.current, num()))} />
        </div>
        <div className="grid grid-cols-2 gap-2">
          <OpButton tone="primary" onClick={() => applyBst(bstInsertOp(rootRef.current, num()))} icon={<Plus className="h-4 w-4" />}>Insert</OpButton>
          <OpButton onClick={() => applyBst(bstSearchOp(rootRef.current, num()))} icon={<Search className="h-4 w-4" />}>Search</OpButton>
          <OpButton onClick={() => applyBst(bstTraverseOp(rootRef.current))} icon={<ListOrdered className="h-4 w-4" />}>In-order</OpButton>
          <OpButton onClick={() => { rootRef.current = bstSeed(); setBstFrames([bstSnapshot(rootRef.current, "Reset to a sample tree.")]); }} icon={<RotateCcw className="h-4 w-4" />}>Sample</OpButton>
          <OpButton onClick={() => { rootRef.current = emptyBst(); setBstFrames([bstSnapshot(null, "Empty tree — insert to begin.")]); }} icon={<Trash2 className="h-4 w-4" />}>Clear</OpButton>
        </div>
      </Controls>
    ) : (
      <Controls
        title="Trees visualizer"
        legend={<Legend items={[
          { label: "Red node", cls: "bg-swap" },
          { label: "Black node", cls: "bg-fg" },
          { label: "Violation", cls: "bg-swap/60" },
          { label: "Rotation", cls: "bg-pivot" },
        ]} />}
      >
        {modePicker}
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={4}
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg
            placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
        <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
          Values insert like a BST, then red-black fixes preserve logarithmic height.
        </p>
        <OpButton onClick={() => {
          const next = Array.from({ length: 8 }, rnd);
          setRaw(next.join(", "));
          setSeed((s) => s + 1);
        }} icon={<Shuffle className="h-4 w-4" />}>Random sequence</OpButton>
      </Controls>
    );

  const tf = player.current;
  const nodes = tf?.nodes.length ?? 0;
  const height = nodes ? Math.max(...tf!.nodes.map((n) => Math.round((n.y - 12) / 24))) + 1 : 0;

  return (
    <VizShell3
      player={player}
      code={mode === "bst" ? BST_CODE : RB_CODE}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={mode === "bst"
        ? [{ label: "Mode", value: "BST" }, { label: "Nodes", value: nodes }, { label: "Height", value: height }]
        : [{ label: "Mode", value: "Red-black" }, { label: "Values", value: rbValues.length }, { label: "Frames", value: rbFrames.length }]}
      canvas={<TreeCanvas frame={player.current} className={mode === "bst" ? "h-[20rem]" : "h-[24rem]"} />}
    />
  );
}

/* ---- Hash table ----------------------------------------------------------- */

export function InteractiveHash({ complexity, lesson }: Meta) {
  const ref = useRef<Bucket[]>([]);
  const inited = useRef(false);
  if (!inited.current) {
    inited.current = true;
    ref.current = emptyBuckets();
  }
  const [frames, setFrames] = useState<HashFrame[]>(() => [{ buckets: ref.current, active: -1, caption: "Insert keys — each hashes to h(k) = k mod 7.", lines: [1] }]);
  const [val, setVal] = useState("");
  const player = usePlayer(frames, 2, true);

  const insert = () => {
    const k = val === "" ? rnd() : parseInt(val, 10);
    const res = hashInsertOp(ref.current, k);
    ref.current = res.next;
    setFrames(res.frames);
    setVal("");
  };
  const lookup = () => {
    const k = val === "" ? rnd() : parseInt(val, 10);
    setFrames(hashLookupOp(ref.current, k).frames); // lookup doesn't mutate the table
    setVal("");
  };
  const clear = () => {
    ref.current = emptyBuckets();
    setFrames([{ buckets: ref.current, active: -1, caption: "Cleared.", lines: [1] }]);
  };

  const controls = (
    <Controls title="Operations">
      <NumInput value={val} onChange={setVal} onEnter={insert} />
      <div className="grid grid-cols-2 gap-2">
        <OpButton tone="primary" onClick={insert} icon={<Plus className="h-4 w-4" />}>Insert</OpButton>
        <OpButton onClick={lookup} icon={<Search className="h-4 w-4" />}>Lookup</OpButton>
        <OpButton onClick={clear} icon={<Trash2 className="h-4 w-4" />}>Clear</OpButton>
      </div>
    </Controls>
  );

  const hf = player.current;
  const items = hf ? hf.buckets.reduce((s, b) => s + b.length, 0) : 0;

  return (
    <VizShell3
      player={player}
      code={HASH_CODE}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[{ label: "Items", value: items }, { label: "Load α", value: (items / 7).toFixed(2) }]}
      canvas={<HashCanvas frame={player.current} />}
    />
  );
}

/* ---- DSU / Union-Find ----------------------------------------------------- */

export function DsuViz({ complexity, lesson }: Meta) {
  const stateRef = useRef<DsuState>(dsuSample(8));
  const [nodeCount, setNodeCount] = useState(8);
  const [a, setA] = useState("3");
  const [b, setB] = useState("7");
  const [frames, setFrames] = useState<DsuFrame[]>(() => [{
    parent: stateRef.current.parent.slice(),
    size: stateRef.current.size.slice(),
    active: [],
    path: [],
    compressed: [],
    roots: stateRef.current.parent.map((p, i) => (p === i ? i : -1)).filter((i) => i >= 0),
    caption: "Sample DSU forest. Run find to see parent pointers collapse through path compression.",
    lines: [1],
    stats: [
      { label: "Sets", value: 2 },
      { label: "Nodes", value: stateRef.current.parent.length },
      { label: "Roots", value: "0, 4" },
    ],
  }]);
  const player = usePlayer(frames, 2, true);

  const num = (raw: string) => {
    const parsed = parseInt(raw, 10);
    return Number.isFinite(parsed) ? Math.max(0, Math.min(nodeCount - 1, parsed)) : 0;
  };
  const apply = (res: { frames: DsuFrame[]; next: DsuState }) => {
    stateRef.current = res.next;
    setFrames(res.frames);
  };
  const reset = (sample: boolean) => {
    stateRef.current = sample ? dsuSample(nodeCount) : dsuInitial(nodeCount);
    setFrames([{
      parent: stateRef.current.parent.slice(),
      size: stateRef.current.size.slice(),
      active: [],
      path: [],
      compressed: [],
      roots: stateRef.current.parent.map((p, i) => (p === i ? i : -1)).filter((i) => i >= 0),
      caption: sample
        ? "Loaded a sample forest with longer parent chains for path compression."
        : "Reset to singleton sets: every node is its own root.",
      lines: [1],
      stats: [
        { label: "Sets", value: sample ? "sample" : nodeCount },
        { label: "Nodes", value: nodeCount },
        { label: "Roots", value: stateRef.current.parent.map((p, i) => (p === i ? i : -1)).filter((i) => i >= 0).join(", ") },
      ],
    }]);
  };

  useEffect(() => {
    stateRef.current = dsuSample(nodeCount);
    setA(String(Math.min(3, nodeCount - 1)));
    setB(String(Math.min(7, nodeCount - 1)));
    reset(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeCount]);

  const controls = (
    <Controls
      title="DSU lab"
      legend={<Legend items={[
        { label: "Active", cls: "bg-compare" },
        { label: "Root", cls: "bg-run" },
        { label: "Compressed", cls: "bg-run/70" },
        { label: "Find path", cls: "bg-pivot/70" },
      ]} />}
    >
      <label className="block space-y-1.5">
        <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
          <span>Nodes</span>
          <span className="font-mono text-run">{nodeCount}</span>
        </span>
        <input
          type="range"
          min={DSU_LIMITS.min}
          max={DSU_LIMITS.max}
          value={nodeCount}
          onChange={(e) => setNodeCount(parseInt(e.target.value, 10))}
          className="w-full accent-run"
        />
      </label>

      <div className="grid grid-cols-2 gap-2">
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-subtle">a / find node</span>
          <NumInput value={a} onChange={setA} onEnter={() => apply(dsuFindOp(stateRef.current, num(a)))} />
        </label>
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-subtle">b</span>
          <NumInput value={b} onChange={setB} onEnter={() => apply(dsuUniteOp(stateRef.current, num(a), num(b)))} />
        </label>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <OpButton tone="primary" onClick={() => apply(dsuFindOp(stateRef.current, num(a)))} icon={<Search className="h-4 w-4" />}>
          Find a
        </OpButton>
        <OpButton onClick={() => apply(dsuUniteOp(stateRef.current, num(a), num(b)))} icon={<GitBranch className="h-4 w-4" />}>
          Unite a,b
        </OpButton>
        <OpButton onClick={() => reset(true)} icon={<Shuffle className="h-4 w-4" />}>
          Sample chain
        </OpButton>
        <OpButton onClick={() => reset(false)} icon={<RotateCcw className="h-4 w-4" />}>
          Reset
        </OpButton>
      </div>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={DSU_CODE}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={player.current?.stats}
      canvas={<DsuCanvas frame={player.current} />}
    />
  );
}

/* ---- Array (two-pointer reverse) ----------------------------------------- */

const ARRAY_MODES: [string, string][] = [
  ["reverse", "Two-pointer reverse"],
  ["binary", "Binary search"],
  ["ternary", "Ternary search"],
  ["sliding", "Sliding window"],
];

export function ArrayViz({ complexity, lesson }: Meta) {
  const [mode, setMode] = useState("reverse");
  const [seed, setSeed] = useState(0);
  const frames = useMemo(() => {
    if (mode === "binary") return binarySearchSim();
    if (mode === "ternary") return ternarySearchSim();
    if (mode === "sliding") return slidingWindowSim();
    void seed;
    return arrayTwoPointer(Array.from({ length: 6 }, rnd));
  }, [mode, seed]);
  const player = usePlayer(frames, 2, true, true);
  const code =
    mode === "binary"
      ? SEQ_CODE["binary-search"]
      : mode === "ternary"
        ? SEQ_CODE["ternary-search"]
        : mode === "sliding"
          ? SEQ_CODE["sliding-window"]
          : SEQ_CODE.array;

  const controls = (
    <Controls
      title="Array technique"
      legend={<Legend items={[{ label: "Active", cls: "bg-compare" }, { label: "Found", cls: "bg-run" }, { label: "Eliminated", cls: "bg-bar opacity-40" }]} />}
    >
      <div className="grid grid-cols-1 gap-1.5">
        {ARRAY_MODES.map(([m, label]) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors duration-150 cursor-pointer",
              m === mode ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      {mode === "reverse" && (
        <OpButton onClick={() => setSeed((s) => s + 1)} icon={<Shuffle className="h-4 w-4" />}>New array</OpButton>
      )}
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={code}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[{ label: "Length", value: player.current?.items.length ?? 0 }]}
      canvas={<SeqCanvas frame={player.current} showIndices />}
    />
  );
}

/* ---- Searching ------------------------------------------------------------ */

type SearchMode = "linear" | "binary" | "ternary";

const SEARCH_MODES: [SearchMode, string, string][] = [
  ["linear", "Linear", "Works on unsorted input; scans left to right."],
  ["binary", "Binary", "Sorted input; halves the candidate window."],
  ["ternary", "Ternary", "Sorted input; keeps one of three regions."],
];

const SEARCH_SAMPLE = [14, 3, 58, 21, 9, 33, 67, 28, 50, 72, 41, 90];

export function SearchingViz({ complexity, lesson }: Meta) {
  const [mode, setMode] = useState<SearchMode>("linear");
  const [raw, setRaw] = useState("14, 3, 58, 21, 9, 33, 67, 28, 50, 72, 41, 90");
  const [target, setTarget] = useState("58");
  const [seed, setSeed] = useState(0);
  const values = useMemo(() => parseNums(raw, SEARCH_SAMPLE), [raw]);
  const targetValue = target === "" ? values[Math.min(2, values.length - 1)] : parseInt(target, 10);
  const frames = useMemo(() => {
    void seed;
    const t = Number.isFinite(targetValue) ? targetValue : 58;
    if (mode === "binary") return binarySearchSim(values, t);
    if (mode === "ternary") return ternarySearchSim(values, t);
    return linearSearchSim(values, t);
  }, [mode, seed, targetValue, values]);
  const player = usePlayer(frames, 2, true, true);
  const code =
    mode === "binary"
      ? SEQ_CODE["binary-search"]
      : mode === "ternary"
        ? SEQ_CODE["ternary-search"]
        : SEQ_CODE["linear-search"];
  const sortedMode = mode !== "linear";

  const randomize = () => {
    const next = Array.from({ length: 12 }, rnd);
    setRaw(next.join(", "));
    setTarget(String(next[Math.floor(next.length / 2)]));
    setSeed((s) => s + 1);
  };

  const controls = (
    <Controls
      title="Search controls"
      legend={<Legend items={[{ label: "Checking", cls: "bg-compare" }, { label: "Probe", cls: "bg-pivot" }, { label: "Found", cls: "bg-run" }, { label: "Eliminated", cls: "bg-bar opacity-40" }]} />}
    >
      <div className="grid gap-1.5">
        {SEARCH_MODES.map(([id, label, desc]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "rounded-lg px-3 py-2 text-left transition-colors duration-150 cursor-pointer",
              id === mode ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            <span className="block text-sm font-semibold">{label}</span>
            <span className="block text-[11px] leading-4 text-subtle">{desc}</span>
          </button>
        ))}
      </div>
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Target</span>
        <NumInput value={target} onChange={setTarget} onEnter={() => setSeed((s) => s + 1)} />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Array</span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg
            placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
      </label>
      {sortedMode && (
        <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
          Binary and ternary modes sort a copy before searching, because order is the contract that lets them discard regions.
        </p>
      )}
      <OpButton onClick={randomize} icon={<Shuffle className="h-4 w-4" />}>Random sample</OpButton>
    </Controls>
  );

  const current = player.current;
  const active = current?.items.filter((it) => it.role !== "dim").length ?? 0;
  const found = current?.items.some((it) => it.role === "match") ? "yes" : "no";

  return (
    <VizShell3
      player={player}
      code={code}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[
        { label: "Mode", value: mode },
        { label: "Candidates", value: active },
        { label: "Found", value: found },
      ]}
      canvas={<SeqCanvas frame={current} showIndices />}
    />
  );
}

/* ---- Recursion & backtracking -------------------------------------------- */

const REC_MODES: [RecMode, string, string][] = [
  ["factorial", "Call stack", "Choose n and watch calls push/unwind."],
  ["divide", "Divide & conquer", "Tune n, branching, base size, and combine work."],
  ["backtracking", "Backtracking", "Tune depth, branching factor, and pruning strength."],
];

export function RecursionViz({ complexity, lesson }: Meta) {
  const [mode, setMode] = useState<RecMode>("factorial");
  const [factN, setFactN] = useState("5");
  const [dcN, setDcN] = useState("32");
  const [branches, setBranches] = useState("2");
  const [base, setBase] = useState("1");
  const [combine, setCombine] = useState<"constant" | "linear">("linear");
  const [btDepth, setBtDepth] = useState("3");
  const [btBranching, setBtBranching] = useState("3");
  const [pruning, setPruning] = useState<"none" | "light" | "medium" | "heavy">("medium");
  const frames = useMemo(() => {
    if (mode === "divide") {
      return buildDivideFrames({
        n: parseInt(dcN, 10),
        branches: parseInt(branches, 10),
        base: parseInt(base, 10),
        combine,
      });
    }
    if (mode === "backtracking") {
      return buildBacktrackingFrames({
        depth: parseInt(btDepth, 10),
        branching: parseInt(btBranching, 10),
        pruning,
      });
    }
    return buildFactorialFrames(parseInt(factN, 10));
  }, [base, branches, btBranching, btDepth, combine, dcN, factN, mode, pruning]);
  const player = usePlayer(frames, 2, true, true);

  const controls = (
    <Controls
      title="Recursion pattern"
      legend={<Legend items={[{ label: "Current", cls: "bg-compare" }, { label: "Pruned", cls: "bg-swap/30" }, { label: "Solution", cls: "bg-run/30" }]} />}
    >
      <div className="grid gap-1.5">
        {REC_MODES.map(([id, label, desc]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "rounded-lg px-3 py-2 text-left transition-colors duration-150 cursor-pointer",
              id === mode ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            <span className="block text-sm font-semibold">{label}</span>
            <span className="block text-[11px] leading-4 text-subtle">{desc}</span>
          </button>
        ))}
      </div>
      {mode === "factorial" && (
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-subtle">n</span>
          <NumInput value={factN} onChange={setFactN} onEnter={() => player.restart()} />
        </label>
      )}
      {mode === "divide" && (
        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Input size</span>
            <NumInput value={dcN} onChange={setDcN} onEnter={() => player.restart()} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Base size</span>
            <NumInput value={base} onChange={setBase} onEnter={() => player.restart()} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["2", "3"] as const).map((b) => (
              <button
                key={b}
                onClick={() => setBranches(b)}
                className={cn("rounded-lg px-3 py-2 text-sm font-medium", branches === b ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60")}
              >
                {b}-way split
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-2">
            {(["linear", "constant"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCombine(c)}
                className={cn("rounded-lg px-3 py-2 text-sm font-medium", combine === c ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60")}
              >
                {c} combine
              </button>
            ))}
          </div>
        </div>
      )}
      {mode === "backtracking" && (
        <div className="space-y-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Depth</span>
            <NumInput value={btDepth} onChange={setBtDepth} onEnter={() => player.restart()} />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Choices per level</span>
            <NumInput value={btBranching} onChange={setBtBranching} onEnter={() => player.restart()} />
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["none", "light", "medium", "heavy"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPruning(p)}
                className={cn("rounded-lg px-3 py-2 text-sm font-medium capitalize", pruning === p ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60")}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      )}
      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        The same frame engine powers the lesson embeds. Change the parameters,
        then scrub the playback to inspect every call, split or prune.
      </p>
    </Controls>
  );
  const frameStats = player.current?.stats ?? [];

  return (
    <VizShell3
      player={player}
      code={REC_CODE[mode]}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[
        { label: "Pattern", value: mode },
        { label: "Frames", value: frames.length },
        ...frameStats,
      ]}
      canvas={<RecursionCanvas frame={player.current} />}
    />
  );
}

/* ---- Tree traversals ------------------------------------------------------ */

const ORDERS: [string, string][] = [
  ["inorder", "In-order"],
  ["preorder", "Pre-order"],
  ["postorder", "Post-order"],
  ["level", "Level-order"],
];

const TREE_SHAPES: [TreeShape, string, string][] = [
  ["balanced", "Balanced", "Median-first inserts → height ≈ log₂ n."],
  ["random", "Random", "Shuffled inserts → a typical mixed shape."],
  ["left-skew", "Left-skewed", "Descending inserts → a degenerate O(n) chain."],
  ["right-skew", "Right-skewed", "Ascending inserts → a degenerate O(n) chain."],
  ["custom", "Custom", "Type your own insertion sequence below."],
];

export function TraversalViz({ complexity, lesson }: Meta) {
  const [order, setOrder] = useState("inorder");
  const [shape, setShape] = useState<TreeShape>("balanced");
  const [count, setCount] = useState(7);
  const [raw, setRaw] = useState("50, 30, 70, 20, 40, 60, 80, 35");

  const values = useMemo(() => {
    if (shape === "custom") return parseNums(raw, SEED_TRAVERSAL);
    return shapeValues(shape, count);
  }, [shape, count, raw]);

  const frames = useMemo(() => buildTreeFrames(order, values), [order, values]);
  const player = usePlayer(frames, 2, true, true);

  const controls = (
    <Controls title="Traversal lab" legend={<Legend items={TREE_LEGEND} />}>
      <div>
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-subtle">Order</span>
        <div className="grid grid-cols-2 gap-2">
          {ORDERS.map(([id, label]) => (
            <button
              key={id}
              onClick={() => setOrder(id)}
              className={cn(
                "rounded-lg px-2.5 py-2 text-xs font-medium transition-colors duration-150 cursor-pointer",
                id === order ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-line/70 pt-3">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-subtle">Tree shape</span>
        <div className="grid gap-1.5">
          {TREE_SHAPES.map(([id, label, desc]) => (
            <button
              key={id}
              onClick={() => setShape(id)}
              className={cn(
                "rounded-lg px-3 py-2 text-left transition-colors duration-150 cursor-pointer",
                id === shape ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
              )}
            >
              <span className="block text-sm font-semibold">{label}</span>
              <span className="block text-[11px] leading-4 text-subtle">{desc}</span>
            </button>
          ))}
        </div>
      </div>

      {shape === "custom" ? (
        <label className="block space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Insertion sequence</span>
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={3}
            className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg
              placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
          />
          <span className="block text-[11px] leading-4 text-subtle">Up to 31 values; inserted left-to-right into a BST.</span>
        </label>
      ) : (
        <label className="block space-y-1.5">
          <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
            <span>Node count</span>
            <span className="font-mono text-run">{count}</span>
          </span>
          <input
            type="range"
            min={1}
            max={31}
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value, 10))}
            className="w-full accent-run"
          />
        </label>
      )}
    </Controls>
  );

  const visited = player.current?.output ? player.current.output.split(" → ").filter(Boolean).length : 0;
  const nodes = player.current?.nodes.length ?? 0;
  const height = nodes ? Math.max(...player.current!.nodes.map((n) => Math.round((n.y - 12) / 24))) + 1 : 0;

  return (
    <VizShell3
      player={player}
      code={treeCode(order)}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[
        { label: "Visited", value: visited },
        { label: "Nodes", value: nodes },
        { label: "Height", value: height },
      ]}
      canvas={<TreeCanvas frame={player.current} className="h-[20rem]" />}
    />
  );
}

const SEED_TRAVERSAL = [50, 30, 70, 20, 40, 60, 80, 35];

/* ---- Red-black tree ------------------------------------------------------- */

const RB_SAMPLE = [41, 38, 31, 12, 19, 8, 50, 60];

export function RedBlackViz({ complexity, lesson }: Meta) {
  const [raw, setRaw] = useState(RB_SAMPLE.join(", "));
  const [seed, setSeed] = useState(0);
  const values = useMemo(() => parseNums(raw, RB_SAMPLE).slice(0, 12), [raw]);
  const frames = useMemo(() => {
    void seed;
    return rbInsertSequence(values);
  }, [seed, values]);
  const player = usePlayer(frames, 2, true, true);

  const randomize = () => {
    const next = Array.from({ length: 8 }, rnd);
    setRaw(next.join(", "));
    setSeed((s) => s + 1);
  };

  const controls = (
    <Controls
      title="Insert sequence"
      legend={<Legend items={[
        { label: "Red node", cls: "bg-swap" },
        { label: "Black node", cls: "bg-fg" },
        { label: "Violation", cls: "bg-swap/60" },
        { label: "Rotation", cls: "bg-pivot" },
      ]} />}
    >
      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        rows={4}
        className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg
          placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
      />
      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        Values are inserted as in a BST, colored red, then fixed with recolors
        and rotations whenever a red parent has a red child.
      </p>
      <OpButton onClick={randomize} icon={<Shuffle className="h-4 w-4" />}>Random sequence</OpButton>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={RB_CODE}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[
        { label: "Values", value: values.length },
        { label: "Frames", value: frames.length },
      ]}
      canvas={<TreeCanvas frame={player.current} className="h-[24rem]" />}
    />
  );
}

/* ---- Minimum spanning trees ---------------------------------------------- */

const MST_MODES: [MstMode, string, string][] = [
  ["kruskal", "Kruskal", "Sort edges, accept if they connect different DSU components."],
  ["prim", "Prim", "Grow one tree by taking the cheapest edge across the cut."],
];

export function MstViz({ complexity, lesson }: Meta) {
  const [mode, setMode] = useState<MstMode>("kruskal");
  const [nodeCount, setNodeCount] = useState(6);
  const [start, setStart] = useState(0);
  const [seed, setSeed] = useState(0);
  const [edgesText, setEdgesText] = useState(() => {
    const graph = generateMstGraph(6, 0);
    return mstEdgesToText(graph.nodes, graph.edges);
  });

  const nodes = useMemo(() => circleMstNodes(nodeCount), [nodeCount]);

  useEffect(() => {
    const graph = generateMstGraph(nodeCount, seed);
    setEdgesText(mstEdgesToText(graph.nodes, graph.edges));
  }, [nodeCount, seed]);

  useEffect(() => {
    if (start >= nodeCount) setStart(0);
  }, [nodeCount, start]);

  const { edges, errors } = useMemo(() => parseMstEdges(edgesText, nodes), [edgesText, nodes]);
  const frames = useMemo(
    () => buildMstFrames(mode, { graph: { nodes, edges }, start }),
    [edges, mode, nodes, start],
  );
  const player = usePlayer(frames, 2, true, true);

  const controls = (
    <Controls
      title="MST lab"
      legend={<Legend items={[
        { label: "Accepted", cls: "bg-run" },
        { label: "Rejected", cls: "bg-swap/60" },
        { label: "Frontier", cls: "bg-pivot/70" },
        { label: "Active", cls: "bg-compare" },
      ]} />}
    >
      <div className="grid gap-1.5">
        {MST_MODES.map(([id, label, desc]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "rounded-lg px-3 py-2 text-left transition-colors duration-150 cursor-pointer",
              id === mode ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            <span className="block text-sm font-semibold">{label}</span>
            <span className="block text-[11px] leading-4 text-subtle">{desc}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-line/70 pt-3">
        <label className="block space-y-1.5">
          <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
            <span>Nodes</span>
            <span className="font-mono text-run">{nodeCount}</span>
          </span>
          <input
            type="range"
            min={MST_LIMITS.minNodes}
            max={MST_LIMITS.maxNodes}
            value={nodeCount}
            onChange={(e) => setNodeCount(parseInt(e.target.value, 10))}
            className="w-full accent-run"
          />
          <span className="block text-[11px] leading-4 text-subtle">
            {MST_LIMITS.minNodes}-{MST_LIMITS.maxNodes} nodes keeps the cut and edge queue readable.
          </span>
        </label>
      </div>

      {mode === "prim" && (
        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-subtle">Start vertex</span>
          <div className="flex flex-wrap gap-1.5">
            {nodes.map((node) => (
              <button
                key={node.id}
                onClick={() => setStart(node.id)}
                className={cn(
                  "h-8 w-8 rounded-lg font-mono text-xs font-semibold transition-colors",
                  node.id === start ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
                )}
              >
                {node.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
          Undirected edges <span className="font-normal normal-case text-subtle">(from to weight)</span>
        </span>
        <textarea
          value={edgesText}
          onChange={(e) => setEdgesText(e.target.value)}
          rows={7}
          spellCheck={false}
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg
            placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
        {errors.length > 0 ? (
          <span className="block text-[11px] leading-4 text-swap">{errors[0]}</span>
        ) : (
          <span className="block text-[11px] leading-4 text-subtle">
            Weights {MST_LIMITS.minWeight}..{MST_LIMITS.maxWeight}; up to {MST_LIMITS.maxEdges} undirected edges.
          </span>
        )}
      </label>

      <OpButton onClick={() => setSeed((s) => s + 1)} icon={<Shuffle className="h-4 w-4" />}>
        Randomize graph
      </OpButton>
    </Controls>
  );

  const frameStats = player.current?.stats ?? [];

  return (
    <VizShell3
      player={player}
      code={mstCode(mode)}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[
        { label: "Mode", value: mode === "kruskal" ? "Kruskal" : "Prim" },
        { label: "Edges", value: edges.length },
        { label: "Frames", value: frames.length },
        ...frameStats,
      ]}
      canvas={<MstCanvas frame={player.current} />}
    />
  );
}

const SHORTEST_PATH_MODES: [ShortestPathMode, string, string][] = [
  ["bellman-ford", "Bellman-Ford", "Single-source paths with negative edges."],
  ["floyd-warshall", "Floyd-Warshall", "All-pairs paths with matrix DP."],
];

export function ShortestPathViz({ complexity, lesson }: Meta) {
  const [mode, setMode] = useState<ShortestPathMode>("bellman-ford");
  const [nodeCount, setNodeCount] = useState(5);
  const [negative, setNegative] = useState(true);
  const [source, setSource] = useState(0);
  const [seed, setSeed] = useState(0);
  const [edgesText, setEdgesText] = useState(() => {
    const g = generateGraph(5, { negative: true, seed: 0 });
    return edgesToText(g.nodes, g.edges);
  });

  const nodes = useMemo(() => circleNodes(nodeCount), [nodeCount]);

  // Regenerate the edge list whenever the graph size / negativity / seed change.
  useEffect(() => {
    const g = generateGraph(nodeCount, { negative, seed });
    setEdgesText(edgesToText(g.nodes, g.edges));
  }, [nodeCount, negative, seed]);

  // Keep the source in range as the graph shrinks.
  useEffect(() => {
    if (source >= nodeCount) setSource(0);
  }, [nodeCount, source]);

  const { edges, errors } = useMemo(() => parseEdges(edgesText, nodes), [edgesText, nodes]);
  const frames = useMemo(
    () => buildShortestPathFrames(mode, { graph: { nodes, edges }, source }),
    [mode, nodes, edges, source],
  );
  const player = usePlayer(frames, 2, true, true);
  const frameStats = player.current?.stats ?? [];
  const isFW = mode === "floyd-warshall";

  const controls = (
    <Controls
      title="Shortest-path lab"
      legend={<Legend items={[
        { label: "Active", cls: "bg-compare" },
        { label: "Updated", cls: "bg-run" },
        { label: "Via k", cls: "bg-pivot" },
      ]} />}
    >
      <div className="grid gap-1.5">
        {SHORTEST_PATH_MODES.map(([id, label, desc]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "rounded-lg px-3 py-2 text-left transition-colors duration-150 cursor-pointer",
              id === mode ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            <span className="block text-sm font-semibold">{label}</span>
            <span className="block text-[11px] leading-4 text-subtle">{desc}</span>
          </button>
        ))}
      </div>

      <div className="border-t border-line/70 pt-3">
        <label className="block space-y-1.5">
          <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
            <span>Nodes</span>
            <span className="font-mono text-run">{nodeCount}</span>
          </span>
          <input
            type="range"
            min={SP_LIMITS.minNodes}
            max={SP_LIMITS.maxNodes}
            value={nodeCount}
            onChange={(e) => setNodeCount(parseInt(e.target.value, 10))}
            className="w-full accent-run"
          />
          <span className="block text-[11px] leading-4 text-subtle">
            {SP_LIMITS.minNodes}–{SP_LIMITS.maxNodes} nodes keeps {isFW ? "the matrix" : "the graph"} readable.
          </span>
        </label>
      </div>

      {!isFW && (
        <div>
          <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-subtle">Source</span>
          <div className="flex flex-wrap gap-1.5">
            {nodes.map((nd) => (
              <button
                key={nd.id}
                onClick={() => setSource(nd.id)}
                className={cn(
                  "h-8 w-8 rounded-lg font-mono text-xs font-semibold transition-colors",
                  nd.id === source ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
                )}
              >
                {nd.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
          Edges <span className="font-normal normal-case text-subtle">(from to weight)</span>
        </span>
        <textarea
          value={edgesText}
          onChange={(e) => setEdgesText(e.target.value)}
          rows={6}
          spellCheck={false}
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg
            placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
        {errors.length > 0 ? (
          <span className="block text-[11px] leading-4 text-swap">{errors[0]}</span>
        ) : (
          <span className="block text-[11px] leading-4 text-subtle">
            Weights {SP_LIMITS.minWeight}..{SP_LIMITS.maxWeight}; up to {SP_LIMITS.maxEdges} edges.
          </span>
        )}
      </label>

      {!isFW && (
        <label className="flex cursor-pointer items-center justify-between rounded-lg bg-elevated px-3 py-2">
          <span className="text-xs font-medium text-muted">Allow negative weights</span>
          <input type="checkbox" checked={negative} onChange={(e) => setNegative(e.target.checked)} className="accent-run" />
        </label>
      )}

      <OpButton onClick={() => setSeed((s) => s + 1)} icon={<Shuffle className="h-4 w-4" />}>Randomize graph</OpButton>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={shortestPathCode(mode)}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[
        { label: "Mode", value: mode === "bellman-ford" ? "BF" : "FW" },
        { label: "Edges", value: edges.length },
        { label: "Frames", value: frames.length },
        ...frameStats,
      ]}
      canvas={<ShortestPathCanvas frame={player.current} />}
    />
  );
}

/* ---- Greedy: interval scheduling ------------------------------------------ */

export function GreedyViz({ complexity, lesson }: Meta) {
  const [text, setText] = useState(() => intervalsToText(GREEDY_SAMPLE));
  const [seed, setSeed] = useState(0);
  const { intervals, errors } = useMemo(() => parseIntervals(text), [text]);
  const frames = useMemo(() => buildActivitySelection(intervals.length ? intervals : GREEDY_SAMPLE), [intervals]);
  const player = usePlayer(frames, 2, true, true);

  const randomize = () => {
    // deterministic-ish shuffle of times (no Math.random in the builder itself)
    const n = 6;
    const next: RawInterval[] = Array.from({ length: n }, (_, i) => {
      const s = (i * 3 + seed * 2) % (GREEDY_LIMITS.maxTime - 4);
      const len = 2 + ((i * 5 + seed) % 5);
      return { start: s, end: Math.min(GREEDY_LIMITS.maxTime, s + len) };
    });
    setText(intervalsToText(next));
    setSeed((x) => x + 1);
  };

  const controls = (
    <Controls title="Activity selection">
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
          Activities <span className="font-normal normal-case text-subtle">(start end)</span>
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={7}
          spellCheck={false}
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg
            placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
        {errors.length > 0 ? (
          <span className="block text-[11px] leading-4 text-swap">{errors[0]}</span>
        ) : (
          <span className="block text-[11px] leading-4 text-subtle">
            Up to {GREEDY_LIMITS.maxIntervals} activities; times 0–{GREEDY_LIMITS.maxTime}.
          </span>
        )}
      </label>
      <OpButton onClick={randomize} icon={<Shuffle className="h-4 w-4" />}>Random activities</OpButton>
      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        Greedy rule: always take the next activity that <strong>finishes earliest</strong> and
        doesn't overlap what you've picked. It provably maximises the count.
      </p>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={GREEDY_CODE}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={player.current?.stats ?? []}
      canvas={<GreedyCanvas frame={player.current} />}
    />
  );
}

/* ---- Sieve of Eratosthenes ------------------------------------------------ */

export function SieveViz({ complexity, lesson }: Meta) {
  const [n, setN] = useState(30);
  const frames = useMemo(() => buildSieveFrames(n), [n]);
  const player = usePlayer(frames, 3, true, true);

  const controls = (
    <Controls title="Sieve of Eratosthenes">
      <label className="block space-y-1.5">
        <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
          <span>Up to n</span><span className="font-mono text-run">{n}</span>
        </span>
        <input type="range" min={SIEVE_LIMITS.min} max={SIEVE_LIMITS.max} value={n} onChange={(e) => setN(+e.target.value)} className="w-full accent-run" />
      </label>
      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        For each prime <span className="font-mono">p</span>, cross out its multiples starting at
        <span className="font-mono"> p²</span> (smaller multiples were already crossed by smaller
        primes). Whatever survives is prime.
      </p>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={SIEVE_CODE}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={player.current?.stats ?? []}
      canvas={<SieveCanvas frame={player.current} />}
    />
  );
}

/* ---- Game theory: subtraction game (W/L + Grundy) ------------------------- */

export function GameViz({ complexity, lesson }: Meta) {
  const [mode, setMode] = useState<GameMode>("wl");
  const [n, setN] = useState(16);
  const [movesRaw, setMovesRaw] = useState("1, 2");
  const moves = useMemo(() => {
    const m = movesRaw.split(/[\s,]+/).map((x) => parseInt(x, 10)).filter((v) => v > 0).slice(0, 5);
    return m.length ? m : [1, 2];
  }, [movesRaw]);
  const frames = useMemo(() => buildGameFrames(mode, n, moves), [mode, n, moves]);
  const player = usePlayer(frames, 2, true, true);

  const controls = (
    <Controls title="Subtraction game">
      <div className="grid grid-cols-2 gap-1.5">
        {(["wl", "grundy"] as GameMode[]).map((m) => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={cn(
              "rounded-lg px-2.5 py-2 text-xs font-semibold transition-colors duration-150 cursor-pointer",
              m === mode ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            {m === "wl" ? "Win / Lose" : "Grundy"}
          </button>
        ))}
      </div>
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Allowed moves</span>
        <input
          value={movesRaw}
          onChange={(e) => setMovesRaw(e.target.value)}
          className="h-9 w-full rounded-lg border border-line bg-surface px-3 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
          <span>Positions (n)</span><span className="font-mono text-run">{n}</span>
        </span>
        <input type="range" min={GAME_LIMITS.min} max={GAME_LIMITS.max} value={n} onChange={(e) => setN(+e.target.value)} className="w-full accent-run" />
      </label>
      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        Remove a stone count in <span className="font-mono">moves</span>; last to move wins. A
        position is <strong>Losing</strong> if every move leads to a Winning one. Grundy = mex of
        reachable Grundy values (0 ⟺ losing).
      </p>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={gameCode(mode)}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[{ label: "Mode", value: mode === "wl" ? "W/L" : "Grundy" }, ...(player.current?.stats ?? [])]}
      canvas={<GameCanvas frame={player.current} />}
    />
  );
}

/* ---- String pattern matching ---------------------------------------------- */

const MATCH_MODES: [MatchMode, string, string][] = [
  ["naive", "Naive", "Slide the pattern one step on any mismatch — O(n·m)."],
  ["kmp", "KMP", "Skip ahead using the failure function — O(n + m)."],
];

export function MatchViz({ complexity, lesson }: Meta) {
  const [mode, setMode] = useState<MatchMode>("naive");
  const [text, setText] = useState("abxabcabcaby");
  const [pattern, setPattern] = useState("abcaby");
  const clean = (v: string) => v.replace(/\s+/g, "");
  const frames = useMemo(() => buildMatchFrames(mode, text, pattern), [mode, text, pattern]);
  const player = usePlayer(frames, 2, true, true);

  const controls = (
    <Controls title="Pattern matching">
      <div className="grid gap-1.5">
        {MATCH_MODES.map(([id, label, desc]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "rounded-lg px-3 py-2 text-left transition-colors duration-150 cursor-pointer",
              id === mode ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            <span className="block text-sm font-semibold">{label}</span>
            <span className="block text-[11px] leading-4 text-subtle">{desc}</span>
          </button>
        ))}
      </div>
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Text</span>
        <input
          value={text}
          onChange={(e) => setText(clean(e.target.value).slice(0, MATCH_LIMITS.maxText))}
          className="h-9 w-full rounded-lg border border-line bg-surface px-3 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
      </label>
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Pattern</span>
        <input
          value={pattern}
          onChange={(e) => setPattern(clean(e.target.value).slice(0, MATCH_LIMITS.maxPattern))}
          className="h-9 w-full rounded-lg border border-line bg-surface px-3 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
      </label>
      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        Watch comparisons align the pattern against the text. KMP reuses the matched
        prefix to avoid re-checking characters.
      </p>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={matchCode(mode)}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[{ label: "Mode", value: mode.toUpperCase() }, ...(player.current?.stats ?? [])]}
      canvas={<MatchCanvas frame={player.current} />}
    />
  );
}

/* ---- Greedy: Kadane's maximum subarray ------------------------------------ */

export function KadaneViz({ complexity, lesson }: Meta) {
  const [raw, setRaw] = useState("-2, 1, -3, 4, -1, 2, 1, -5, 4");
  const [seed, setSeed] = useState(0);
  const values = useMemo(() => {
    void seed;
    const nums = raw.split(/[\s,]+/).map((x) => parseInt(x, 10)).filter((n) => Number.isFinite(n)).slice(0, 14);
    return nums.length ? nums : [-2, 1, -3, 4, -1, 2, 1, -5, 4];
  }, [raw, seed]);
  const frames = useMemo(() => buildKadaneFrames(values), [values]);
  const player = usePlayer(frames, 2, true, true);

  const randomize = () => {
    const next = Array.from({ length: 9 }, (_, i) => ((i * 7 + seed * 3) % 13) - 6);
    setRaw(next.join(", "));
    setSeed((s) => s + 1);
  };

  const controls = (
    <Controls title="Kadane's algorithm">
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Array</span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={3}
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
      </label>
      <OpButton onClick={randomize} icon={<Shuffle className="h-4 w-4" />}>Random array</OpButton>
      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        At each element, greedily choose: <strong>restart</strong> here, or <strong>extend</strong> the
        running sum. Keep the best window ever seen.
      </p>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={KADANE_CODE}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={player.current?.stats ?? []}
      canvas={<KadaneCanvas frame={player.current} />}
    />
  );
}

/* ---- Greedy: fractional knapsack ------------------------------------------ */

export function KnapsackViz({ complexity, lesson }: Meta) {
  const [text, setText] = useState(() => itemsToText(KNAPSACK_SAMPLE));
  const [capacity, setCapacity] = useState(50);
  const [seed, setSeed] = useState(0);
  const { items, errors } = useMemo(() => parseItems(text), [text]);
  const frames = useMemo(() => buildKnapsackFrames(items.length ? items : KNAPSACK_SAMPLE, capacity), [items, capacity]);
  const player = usePlayer(frames, 2, true, true);

  const randomize = () => {
    const next = Array.from({ length: 4 }, (_, i) => ({
      weight: 5 + ((i * 7 + seed * 3) % 20),
      value: 20 + ((i * 11 + seed * 5) % 90),
    }));
    setText(itemsToText(next));
    setSeed((s) => s + 1);
  };

  const controls = (
    <Controls title="Fractional knapsack">
      <label className="block space-y-1.5">
        <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
          Items <span className="font-normal normal-case text-subtle">(weight value)</span>
        </span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={5}
          spellCheck={false}
          className="w-full resize-none rounded-lg border border-line bg-surface px-3 py-2 font-mono text-xs text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
        />
        {errors.length > 0 ? (
          <span className="block text-[11px] leading-4 text-swap">{errors[0]}</span>
        ) : (
          <span className="block text-[11px] leading-4 text-subtle">Up to {KNAPSACK_LIMITS.maxItems} items.</span>
        )}
      </label>
      <label className="block space-y-1.5">
        <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
          <span>Capacity</span><span className="font-mono text-run">{capacity}</span>
        </span>
        <input type="range" min={5} max={80} value={capacity} onChange={(e) => setCapacity(+e.target.value)} className="w-full accent-run" />
      </label>
      <OpButton onClick={randomize} icon={<Shuffle className="h-4 w-4" />}>Random items</OpButton>
      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        Greedy by <strong>value/weight</strong>: take the best ratio first, splitting the last
        item to fill the bag. Optimal for the <em>fractional</em> version.
      </p>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={KNAPSACK_CODE}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={player.current?.stats ?? []}
      canvas={<KnapsackCanvas frame={player.current} />}
    />
  );
}

/* ---- Greedy lab: one card, three greedy classics -------------------------- */

type GreedyTab = "activity" | "kadane" | "knapsack";

const GREEDY_TABS: { id: GreedyTab; label: string; lesson: string; complexity: { label: string; value: string }[] }[] = [
  { id: "activity", label: "Activity selection", lesson: "/learn/greedy/greedy-intro", complexity: [{ label: "Sort", value: "O(n log n)" }, { label: "Scan", value: "O(n)" }] },
  { id: "kadane", label: "Kadane (max subarray)", lesson: "/learn/greedy/kadane", complexity: [{ label: "Time", value: "O(n)" }, { label: "Space", value: "O(1)" }] },
  { id: "knapsack", label: "Fractional knapsack", lesson: "/learn/greedy/greedy-classics", complexity: [{ label: "Sort", value: "O(n log n)" }, { label: "Fill", value: "O(n)" }] },
];

const GREEDY_TAB_BY_ID: Record<string, GreedyTab> = {
  greedy: "activity",
  activity: "activity",
  kadane: "kadane",
  knapsack: "knapsack",
};

export function GreedyLab({ initial }: { initial?: string }) {
  const [tab, setTab] = useState<GreedyTab>(GREEDY_TAB_BY_ID[initial ?? ""] ?? "activity");
  const active = GREEDY_TABS.find((t) => t.id === tab)!;
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-surface p-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          {GREEDY_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 cursor-pointer",
                t.id === tab ? "bg-run/15 text-fg ring-1 ring-run/40" : "text-muted hover:bg-elevated",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>
      {tab === "activity" && <GreedyViz complexity={active.complexity} lesson={active.lesson} />}
      {tab === "kadane" && <KadaneViz complexity={active.complexity} lesson={active.lesson} />}
      {tab === "knapsack" && <KnapsackViz complexity={active.complexity} lesson={active.lesson} />}
    </div>
  );
}

/* ---- Bit manipulation ----------------------------------------------------- */

export function BitsViz({ complexity, lesson }: Meta) {
  const [op, setOp] = useState<BitOp>("and");
  const [a, setA] = useState("182");
  const [b, setB] = useState("90");
  const [k, setK] = useState(2);
  const meta = BIT_OPS.find((o) => o.id === op)!;
  const an = Math.max(0, Math.min(BIT_MASK, parseInt(a, 10) || 0));
  const bn = Math.max(0, Math.min(BIT_MASK, parseInt(b, 10) || 0));
  const frames = useMemo(() => buildBitFrames(op, an, bn, k), [op, an, bn, k]);
  const player = usePlayer(frames, 2, true, true);

  const numField = (label: string, val: string, set: (v: string) => void) => (
    <label className="block space-y-1.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-subtle">{label} <span className="font-normal normal-case">(0–255)</span></span>
      <input
        value={val}
        onChange={(e) => set(e.target.value.replace(/[^0-9]/g, "").slice(0, 3))}
        inputMode="numeric"
        className="h-9 w-full rounded-lg border border-line bg-surface px-3 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
      />
    </label>
  );

  const controls = (
    <Controls title="Bit operation">
      <div className="grid grid-cols-2 gap-1.5">
        {BIT_OPS.map((o) => (
          <button
            key={o.id}
            onClick={() => setOp(o.id)}
            className={cn(
              "rounded-lg px-2.5 py-2 text-xs font-medium transition-colors duration-150 cursor-pointer",
              o.id === op ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="space-y-3 border-t border-line/70 pt-3">
        {numField("a", a, setA)}
        {meta.binary && numField("b", b, setB)}
        {(op === "shl" || op === "shr") && (
          <label className="block space-y-1.5">
            <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
              <span>Shift by</span><span className="font-mono text-run">{k}</span>
            </span>
            <input type="range" min={0} max={8} value={k} onChange={(e) => setK(+e.target.value)} className="w-full accent-run" />
          </label>
        )}
      </div>
      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        Values are shown as 8-bit binary with place values. Scrub to apply the
        operation column by column.
      </p>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={bitCode(op)}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[{ label: "Op", value: meta.symbol }, ...(player.current?.stats ?? [])]}
      canvas={<BitsCanvas frame={player.current} />}
    />
  );
}

/* ---- Dynamic programming table -------------------------------------------- */

const DP_MODES: [DpMode, string, string][] = [
  ["coin", "Coin change (1D)", "Min coins to make an amount — a 1D table."],
  ["paths", "Unique paths (2D)", "Count grid paths — each cell adds up + left."],
  ["edit", "Edit distance (2D)", "Turn one string into another — 3-way min."],
  ["tsp", "Travelling salesman", "Held-Karp bitmask DP: dp[mask][end] over subsets."],
];

export function DpViz({ complexity, lesson }: Meta) {
  const [mode, setMode] = useState<DpMode>("coin");
  const [coins, setCoins] = useState("1, 3, 4");
  const [amount, setAmount] = useState(6);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(4);
  const [a, setA] = useState("horse");
  const [b, setB] = useState("ros");
  const [cities, setCities] = useState(4);

  const coinList = useMemo(
    () => coins.split(/[\s,]+/).map((x) => parseInt(x, 10)).filter((n) => Number.isFinite(n) && n > 0).slice(0, 5),
    [coins],
  );
  const frames = useMemo(() => {
    if (mode === "paths") return buildDpFrames("paths", { rows, cols });
    if (mode === "edit") return buildDpFrames("edit", { a, b });
    if (mode === "tsp") return buildDpFrames("tsp", { cities });
    return buildDpFrames("coin", { coins: coinList.length ? coinList : [1], amount });
  }, [mode, rows, cols, a, b, coinList, amount, cities]);
  const player = usePlayer(frames, 2, true, true);

  const sanitizeStr = (v: string) => v.replace(/[^a-zA-Z]/g, "").slice(0, DP_LIMITS.strMax).toLowerCase();

  const controls = (
    <Controls title="DP table lab">
      <div className="grid gap-1.5">
        {DP_MODES.map(([id, label, desc]) => (
          <button
            key={id}
            onClick={() => setMode(id)}
            className={cn(
              "rounded-lg px-3 py-2 text-left transition-colors duration-150 cursor-pointer",
              id === mode ? "bg-run/15 text-fg ring-1 ring-run/40" : "bg-elevated text-muted hover:bg-line/60",
            )}
          >
            <span className="block text-sm font-semibold">{label}</span>
            <span className="block text-[11px] leading-4 text-subtle">{desc}</span>
          </button>
        ))}
      </div>

      {mode === "coin" && (
        <div className="space-y-3 border-t border-line/70 pt-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">Coins</span>
            <input
              value={coins}
              onChange={(e) => setCoins(e.target.value)}
              className="h-9 w-full rounded-lg border border-line bg-surface px-3 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
            />
          </label>
          <label className="block space-y-1.5">
            <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
              <span>Amount</span><span className="font-mono text-run">{amount}</span>
            </span>
            <input type="range" min={1} max={DP_LIMITS.coinMaxAmount} value={amount} onChange={(e) => setAmount(+e.target.value)} className="w-full accent-run" />
          </label>
        </div>
      )}
      {mode === "paths" && (
        <div className="space-y-3 border-t border-line/70 pt-3">
          {([["Rows", rows, setRows], ["Cols", cols, setCols]] as const).map(([label, val, set]) => (
            <label key={label} className="block space-y-1.5">
              <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
                <span>{label}</span><span className="font-mono text-run">{val}</span>
              </span>
              <input type="range" min={2} max={DP_LIMITS.gridMax} value={val} onChange={(e) => set(+e.target.value)} className="w-full accent-run" />
            </label>
          ))}
        </div>
      )}
      {mode === "edit" && (
        <div className="space-y-3 border-t border-line/70 pt-3">
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">String A</span>
            <input value={a} onChange={(e) => setA(sanitizeStr(e.target.value))} className="h-9 w-full rounded-lg border border-line bg-surface px-3 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50" />
          </label>
          <label className="block space-y-1.5">
            <span className="text-xs font-semibold uppercase tracking-wider text-subtle">String B</span>
            <input value={b} onChange={(e) => setB(sanitizeStr(e.target.value))} className="h-9 w-full rounded-lg border border-line bg-surface px-3 font-mono text-sm text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50" />
          </label>
          <p className="text-[11px] leading-4 text-subtle">Up to {DP_LIMITS.strMax} letters each.</p>
        </div>
      )}
      {mode === "tsp" && (
        <div className="space-y-2 border-t border-line/70 pt-3">
          <label className="block space-y-1.5">
            <span className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-subtle">
              <span>Cities</span><span className="font-mono text-run">{cities}</span>
            </span>
            <input type="range" min={DP_LIMITS.tspMin} max={DP_LIMITS.tspMax} value={cities} onChange={(e) => setCities(+e.target.value)} className="w-full accent-run" />
          </label>
          <p className="text-[11px] leading-4 text-subtle">
            Rows = end city, columns = visited subsets containing the start. Each cell
            is the cheapest path covering that subset and ending there.
          </p>
        </div>
      )}

      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        Each cell is a subproblem; the highlighted cells show what the current cell
        reads. Scrub to watch the table fill.
      </p>
    </Controls>
  );

  return (
    <VizShell3
      player={player}
      code={dpCode(mode)}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={[{ label: "Frames", value: frames.length }, ...(player.current?.stats ?? [])]}
      canvas={<DpCanvas frame={player.current} />}
    />
  );
}

/* ---- Heap / priority queue ------------------------------------------------ */

export function HeapViz({ complexity, lesson }: Meta) {
  const ref = useRef<HeapHandle>([]);
  const inited = useRef(false);
  if (!inited.current) {
    inited.current = true;
    ref.current = heapSeed();
  }
  const [frames, setFrames] = useState<HeapFrame[]>(() => [heapSnapshot(ref.current, "A valid min-heap. Insert a value, or extract the minimum.")]);
  const [val, setVal] = useState("");
  const player = usePlayer(frames, 2, true);

  const apply = (res: HeapOpResult) => {
    ref.current = res.next;
    setFrames(res.frames.length ? res.frames : [heapSnapshot(res.next, "")]);
    setVal("");
  };
  const num = () => (val === "" ? rnd() : parseInt(val, 10));

  const controls = (
    <Controls
      title="Heap operations"
      legend={<Legend items={[
        { label: "Active", cls: "bg-compare" },
        { label: "Compare", cls: "bg-pivot/40" },
        { label: "Swap", cls: "bg-swap" },
        { label: "Min / new", cls: "bg-run" },
      ]} />}
    >
      <NumInput value={val} onChange={setVal} onEnter={() => apply(heapInsertOp(ref.current, num()))} />
      <div className="grid grid-cols-2 gap-2">
        <OpButton tone="primary" onClick={() => apply(heapInsertOp(ref.current, num()))} icon={<Plus className="h-4 w-4" />}>Insert</OpButton>
        <OpButton onClick={() => apply(heapExtractOp(ref.current))} icon={<Minus className="h-4 w-4" />}>Extract-min</OpButton>
        <OpButton onClick={() => { ref.current = heapSeed(); setFrames([heapSnapshot(ref.current, "Reset to a sample heap.")]); }} icon={<RotateCcw className="h-4 w-4" />}>Sample</OpButton>
        <OpButton onClick={() => { ref.current = []; setFrames([heapSnapshot([], "Empty heap — insert to begin.")]); }} icon={<Trash2 className="h-4 w-4" />}>Clear</OpButton>
      </div>
      <p className="rounded-lg bg-elevated px-3 py-2 text-xs leading-5 text-muted">
        A min-heap is a complete binary tree kept in an array: node <span className="font-mono">i</span> has
        children <span className="font-mono">2i+1</span>, <span className="font-mono">2i+2</span>. Insert sifts
        up; extract-min sifts down.
      </p>
    </Controls>
  );

  const cur = player.current;
  return (
    <VizShell3
      player={player}
      code={HEAP_CODE}
      complexity={complexity}
      lesson={lesson}
      controls={controls}
      stats={cur?.stats ?? []}
      canvas={<HeapCanvas frame={cur} />}
    />
  );
}

/* ---- Weighted-graph lab: shortest paths · MST · union-find --------------- */

type GraphTab = "shortest" | "mst" | "dsu";

const GRAPH_TABS: { id: GraphTab; label: string; tagline: string; lesson: string; complexity: { label: string; value: string }[] }[] = [
  {
    id: "shortest",
    label: "Shortest paths",
    tagline: "Cheapest route between vertices — Bellman-Ford relaxes edges, Floyd-Warshall fills a distance matrix.",
    lesson: "/learn/pathfinding/bellman-ford",
    complexity: [{ label: "BF", value: "O(VE)" }, { label: "FW", value: "O(V^3)" }, { label: "Space", value: "V / V^2" }],
  },
  {
    id: "mst",
    label: "Spanning tree",
    tagline: "Cheapest set of edges that connects every vertex — Kruskal adds by weight, Prim grows across a cut.",
    lesson: "/learn/minimum-spanning-trees/mst-definition",
    complexity: [{ label: "Kruskal", value: "O(E log E)" }, { label: "Prim", value: "O(E log V)" }, { label: "DSU", value: "α(V)" }],
  },
  {
    id: "dsu",
    label: "Union-Find",
    tagline: "The connectivity engine inside Kruskal: which vertices are already in the same component?",
    lesson: "/learn/minimum-spanning-trees/kruskal-dsu",
    complexity: [{ label: "Find", value: "α(n)" }, { label: "Union", value: "α(n)" }, { label: "Space", value: "O(n)" }],
  },
];

const GRAPH_TAB_BY_ID: Record<string, GraphTab> = {
  graphs: "shortest",
  "shortest-paths": "shortest",
  "bellman-ford": "shortest",
  "floyd-warshall": "shortest",
  mst: "mst",
  kruskal: "mst",
  prim: "mst",
  dsu: "dsu",
  "union-find": "dsu",
};

/**
 * One lab for the weighted-graph family, so the three algorithms don't sprawl
 * across three look-alike cards. A segmented control switches between shortest
 * paths, the minimum spanning tree, and the union-find structure that powers
 * Kruskal — each its own distinct canvas, with its own lesson link + complexity.
 */
export function GraphAlgosViz({ initial }: { initial?: string }) {
  const [tab, setTab] = useState<GraphTab>(GRAPH_TAB_BY_ID[initial ?? ""] ?? "shortest");
  const active = GRAPH_TABS.find((t) => t.id === tab)!;

  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-line bg-surface p-1.5">
        <div className="grid grid-cols-3 gap-1.5">
          {GRAPH_TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                "rounded-lg px-3 py-2 text-sm font-semibold transition-colors duration-150 cursor-pointer",
                t.id === tab ? "bg-run/15 text-fg ring-1 ring-run/40" : "text-muted hover:bg-elevated",
              )}
            >
              {t.label}
            </button>
          ))}
        </div>
        <p className="px-2 pb-1 pt-2 text-xs leading-5 text-subtle">{active.tagline}</p>
      </div>

      {tab === "shortest" && <ShortestPathViz complexity={active.complexity} lesson={active.lesson} />}
      {tab === "mst" && <MstViz complexity={active.complexity} lesson={active.lesson} />}
      {tab === "dsu" && <DsuViz complexity={active.complexity} lesson={active.lesson} />}
    </div>
  );
}
