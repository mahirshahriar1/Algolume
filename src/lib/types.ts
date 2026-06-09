/**
 * Core types shared across every visualizer.
 *
 * The whole app is built on one idea: an algorithm does not animate itself.
 * Instead it *emits a list of frames* describing each meaningful step. A frame
 * is an immutable snapshot — array state, what's highlighted, which line of code
 * is executing, and a human description. The player then scrubs through those
 * frames, which is what makes pause / step / rewind / restart trivial and exact.
 */

/** Semantic roles used to colour array bars / grid cells at a given step. */
export type Highlight =
  | "default"
  | "compare" // currently being compared
  | "swap" // being swapped / written
  | "pivot" // pivot or key element
  | "sorted" // locked in final position
  | "range"; // within the active sub-range (e.g. merge window)

/** One immutable snapshot of an array-based algorithm at a single step. */
export interface SortFrame {
  /** The full array as it looks at this step. */
  array: number[];
  /** index -> semantic role; absent indices render as "default". */
  highlights: Record<number, Highlight>;
  /** 1-based source line numbers active at this step (for code sync). */
  lines: number[];
  /** Short human-readable description of what's happening. */
  caption: string;
  /** Live variable readouts to show in the state panel. */
  vars?: Record<string, string | number>;
  /** Running tally of primitive operations up to this frame. */
  stats?: { comparisons: number; swaps: number; writes: number };
}

/** An algorithm definition the UI can render generically. */
export interface SortAlgorithm {
  id: string;
  name: string;
  /** One-line summary shown under the selector. */
  blurb: string;
  complexity: { time: string; space: string; stable: boolean };
  /** Source code, line by line (1-based when indexed +1). */
  code: string[];
  /** Pure generator: input array -> ordered list of frames. */
  run: (input: number[]) => SortFrame[];
}
