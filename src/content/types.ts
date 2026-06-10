/**
 * Content model for the handbook. Lessons are authored as data — a list of
 * typed blocks — so reading, watching (viz), and (later) playgrounds/problems
 * interleave on one page, and the book scales without bespoke layouts.
 */

export type CalloutTone = "intuition" | "warning" | "complexity" | "note";

export type VizModule =
  | "sorting"
  | "pathfinding"
  // derivation visuals
  | "bigo-growth"
  | "sum-triangle"
  | "halving"
  | "recursion"
  | "recursion-tree"
  | "backtracking"
  // structure simulations
  | "array"
  | "linear-search"
  | "binary-search"
  | "ternary-search"
  | "sliding-window"
  | "stack"
  | "queue"
  | "linked-list"
  | "hash"
  | "dsu"
  | "bst"
  | "red-black-tree"
  | "heap"
  | "dp"
  | "bits"
  | "traversal"
  | "bellman-ford"
  | "floyd-warshall"
  | "mst";

/** One step of a cost derivation: a formula and the reasoning behind it. */
export interface DerivationStep {
  expr: string;
  note: string;
}

export type LessonBlock =
  | { kind: "prose"; md: string }
  | { kind: "heading"; text: string }
  | { kind: "callout"; tone: CalloutTone; md: string }
  | { kind: "viz"; module: VizModule; algo?: string; variant?: string; size?: number; title?: string }
  | { kind: "playground"; title?: string; starter: string }
  | { kind: "derivation"; title?: string; steps: DerivationStep[]; result: string }
  // Embeds a practice problem card linking to /problems/:ref (see lib/problems).
  | { kind: "problem"; ref: string }
  | { kind: "divider" };

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  estMinutes: number;
  blocks: LessonBlock[];
}

export interface Chapter {
  id: string;
  title: string;
  blurb: string;
  /** lucide-react icon name, resolved in the UI. */
  icon: string;
  lessons: Lesson[];
}
