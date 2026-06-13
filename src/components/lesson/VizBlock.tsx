import { Link } from "react-router-dom";
import { ArrowRight, Maximize2 } from "lucide-react";
import type { VizModule } from "@/content/types";
import { EmbeddedSort } from "./EmbeddedSort";
import { GridPreview } from "@/components/LandingPreviews";
import { SeqSim } from "@/components/sim/SeqSim";
import { TreeSim } from "@/components/sim/TreeSim";
import { HeapSim } from "@/components/sim/HeapSim";
import { DpSim } from "@/components/sim/DpSim";
import type { DpMode } from "@/lib/sims/dp";
import { BitsSim } from "@/components/sim/BitsSim";
import type { BitOp } from "@/lib/sims/bits";
import { GreedySim } from "@/components/sim/GreedySim";
import { KadaneSim } from "@/components/sim/KadaneSim";
import { KnapsackSim } from "@/components/sim/KnapsackSim";
import { MatchSim } from "@/components/sim/MatchSim";
import type { MatchMode } from "@/lib/sims/matching";
import { SieveSim } from "@/components/sim/SieveSim";
import { GameSim } from "@/components/sim/GameSim";
import type { GameMode } from "@/lib/sims/game";
import { HashSim } from "@/components/sim/HashSim";
import { RecursionSim } from "@/components/sim/RecursionSim";
import { ShortestPathSim } from "@/components/sim/ShortestPathSim";
import { MstSim } from "@/components/sim/MstSim";
import { DsuSim } from "@/components/sim/DsuSim";
import { GrowthChart } from "@/components/sim/derivations/GrowthChart";
import { SumTriangle } from "@/components/sim/derivations/SumTriangle";
import { HalvingDiagram } from "@/components/sim/derivations/HalvingDiagram";
import { RecursionTree } from "@/components/sim/derivations/RecursionTree";
import { BacktrackingTree } from "@/components/sim/derivations/BacktrackingTree";

const SEQ = new Set<VizModule>([
  "array", "linear-search", "binary-search", "ternary-search", "sliding-window", "stack", "queue", "linked-list",
]);

function Body({
  module,
  algo,
  variant,
  size,
}: {
  module: VizModule;
  algo?: string;
  variant?: string;
  size?: number;
}) {
  if (module === "sorting") return <EmbeddedSort algo={algo} size={size} />;
  if (SEQ.has(module)) return <SeqSim variant={module} />;
  if (module === "red-black-tree") return <TreeSim variant="red-black" />;
  if (module === "bst" || module === "traversal")
    return <TreeSim variant={variant ?? (module === "traversal" ? "inorder" : "insert")} />;
  if (module === "hash") return <HashSim />;
  if (module === "heap") return <HeapSim />;
  if (module === "dp") return <DpSim variant={(variant as DpMode) ?? "coin"} />;
  if (module === "bits") return <BitsSim variant={(variant as BitOp) ?? "and"} />;
  if (module === "greedy") {
    if (variant === "kadane") return <KadaneSim />;
    if (variant === "knapsack") return <KnapsackSim />;
    return <GreedySim />;
  }
  if (module === "matching") return <MatchSim variant={(variant as MatchMode) ?? "naive"} />;
  if (module === "sieve") return <SieveSim />;
  if (module === "game-theory") return <GameSim variant={(variant as GameMode) ?? "wl"} />;
  if (module === "dsu") return <DsuSim />;
  if (module === "bellman-ford") return <ShortestPathSim variant="bellman-ford" />;
  if (module === "floyd-warshall") return <ShortestPathSim variant="floyd-warshall" />;
  if (module === "mst") return <MstSim variant={variant === "prim" ? "prim" : "kruskal"} />;
  if (module === "bigo-growth") return <GrowthChart />;
  if (module === "sum-triangle") return <SumTriangle />;
  if (module === "halving") return <HalvingDiagram />;
  if (module === "recursion") return <RecursionSim variant={variant ?? "factorial"} />;
  if (module === "recursion-tree") return <RecursionTree variant={variant ?? "merge"} />;
  if (module === "backtracking") return <BacktrackingTree />;

  // pathfinding → live mini-grid + launch
  return (
    <div className="space-y-4">
      <div className="h-56 overflow-hidden rounded-xl border border-line">
        <GridPreview mode={algo === "dfs" ? "dfs" : "bfs"} />
      </div>
      <Link to="/pathfinding" className="btn-primary w-full sm:w-auto">
        <Maximize2 className="h-4 w-4" />
        Open the interactive grid &amp; graph
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

/** Renders an embedded interactive visualization inside a lesson. */
export function VizBlock({
  module,
  algo,
  variant,
  size,
  title,
}: {
  module: VizModule;
  algo?: string;
  variant?: string;
  size?: number;
  title?: string;
}) {
  return (
    <figure className="my-8">
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-subtle">
            {title ?? "Interactive"}
          </span>
          <span className="flex items-center gap-1.5 text-[11px] text-run">
            <span className="h-1.5 w-1.5 rounded-full bg-run" />
            live
          </span>
        </div>
        <div className="p-4">
          <Body module={module} algo={algo} variant={variant} size={size} />
        </div>
      </div>
    </figure>
  );
}
