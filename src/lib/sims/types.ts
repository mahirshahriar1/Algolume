/**
 * Shared frame types for the data-structure simulations. Like the sorting /
 * pathfinding engines, every simulation is a pure `() => Frame[]` that the
 * generic EmbeddedSim player scrubs.
 */

export type SeqRole =
  | "default"
  | "active" // currently being looked at
  | "compare" // second element in a comparison
  | "match" // found / success
  | "done" // settled / sorted region
  | "new" // just inserted
  | "removed" // about to leave
  | "dim"; // eliminated from consideration (e.g. discarded half)

export interface SeqItem {
  key: string; // stable identity for animation
  label: string;
  role?: SeqRole;
}

export interface SeqMarker {
  index: number; // which item this pointer sits above
  label: string; // e.g. "i", "top", "head", "front"
  tone?: "run" | "compare" | "pivot" | "swap" | "visited";
}

export interface SeqFrame {
  items: SeqItem[];
  markers?: SeqMarker[];
  caption: string;
  /** 1-based active source lines for the synced code panel. */
  lines?: number[];
}

// ---- Trees -----------------------------------------------------------------

export type NodeRole =
  | "default"
  | "path"
  | "active"
  | "match"
  | "visited"
  | "new"
  | "red"
  | "black"
  | "violation"
  | "rotate"
  | "recolor";

export interface TreeNodeView {
  id: number;
  value: string | number;
  x: number; // 0..100 layout space
  y: number;
  role?: NodeRole;
}

export interface TreeEdgeView {
  from: number;
  to: number;
  role?: NodeRole;
}

export interface TreeFrame {
  nodes: TreeNodeView[];
  edges: TreeEdgeView[];
  caption: string;
  /** optional sequence readout, e.g. traversal output so far */
  output?: string;
  lines?: number[];
}
