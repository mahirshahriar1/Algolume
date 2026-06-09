/**
 * Problem model for the practice system. Like lessons, problems are authored as
 * plain data (typed TS modules) so the set scales without bespoke pages. A
 * problem ships with a runnable Python starter, visible examples, hidden graded
 * tests, hints, and reference solutions. Python is checked in-browser via
 * Pyodide (see `runner.ts`); C++ snippets are teaching/reference material until
 * a compiler backend or WASM toolchain is added.
 */

export type Difficulty = "easy" | "medium" | "hard";

/**
 * How a returned value is judged against the expected one.
 * - `exact`     — Python `==` (default; works for numbers, strings, lists, dicts)
 * - `unordered` — compare as sorted sequences (order doesn't matter)
 * - `set`       — compare as sets (order + duplicates don't matter)
 * - `approx`    — floating-point comparison within 1e-6
 */
export type CompareMode = "exact" | "unordered" | "set" | "approx";

/** One graded or example case: positional args in, one expected value out. */
export interface TestCase {
  /** Positional arguments spread into the entry function. */
  input: unknown[];
  expected: unknown;
  /** Shown only for example cases, to teach the mapping input → output. */
  explain?: string;
}

export interface Problem {
  /** Unique kebab-case slug — used in the URL `/problems/:id`. */
  id: string;
  title: string;
  /** Chapter id this problem reinforces (e.g. "arrays"); used for grouping. */
  topic: string;
  difficulty: Difficulty;
  /** One-line teaser shown in the browser list. */
  summary: string;
  /** Full markdown statement (MarkdownLite syntax). */
  statement: string;
  /** Name of the function the solver must implement — the checker calls it. */
  funcName: string;
  /** Pre-filled editor code: the signature + a TODO body. */
  starter: string;
  /** Always-visible sample cases (input + expected + optional explanation). */
  examples: TestCase[];
  /** Hidden graded cases run on "Submit" (never reveal input/expected up front). */
  tests: TestCase[];
  /** Progressive hints, revealed one at a time. */
  hints: string[];
  /** Reference solution, revealable after an attempt. */
  solution: string;
  /** Optional C++ reference solution, revealable beside the Python solution. */
  cppSolution?: string;
  /** Output comparison strategy (default "exact"). */
  compare?: CompareMode;
  complexity?: { time: string; space: string };
  /** Optional deep link to the lesson that teaches the idea. */
  lesson?: string;
  tags?: string[];
}
