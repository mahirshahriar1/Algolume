import type { Difficulty, Problem } from "./types";
import { arrayProblems } from "./sets/arrays";
import { searchingProblems } from "./sets/searching";
import { recursionProblems } from "./sets/recursion";
import { hashingProblems } from "./sets/hashing";
import { stackStringProblems } from "./sets/stacks-strings";
import { sortingProblems } from "./sets/sorting";
import { treeProblems } from "./sets/trees";
import { traversalProblems } from "./sets/traversals";
import { linkedListProblems } from "./sets/linked-lists";
import { pathfindingProblems } from "./sets/pathfinding";
import { stringProblems } from "./sets/strings";
import { heapProblems } from "./sets/heaps";
import { dpProblems } from "./sets/dp";
import { bitProblems } from "./sets/bit-manipulation";
import { mathProblems } from "./sets/math";
import { mstProblems } from "./sets/mst";
import { CPP_SNIPPETS } from "./cpp";

export type { Problem, TestCase, Difficulty, CompareMode } from "./types";

/** Every problem, in browsing order (grouped loosely by topic difficulty ramp). */
export const PROBLEMS: Problem[] = [
  ...arrayProblems,
  ...searchingProblems,
  ...recursionProblems,
  ...hashingProblems,
  ...stackStringProblems,
  ...sortingProblems,
  ...treeProblems,
  ...traversalProblems,
  ...linkedListProblems,
  ...pathfindingProblems,
  ...stringProblems,
  ...heapProblems,
  ...dpProblems,
  ...bitProblems,
  ...mathProblems,
  ...mstProblems,
].map((problem) => ({ ...problem, ...CPP_SNIPPETS[problem.id] }));

const BY_ID = new Map(PROBLEMS.map((p) => [p.id, p]));

export function getProblem(id: string): Problem | undefined {
  return BY_ID.get(id);
}

/** Topics present in the set, in first-appearance order, with their counts. */
export function problemTopics(): { topic: string; count: number }[] {
  const order: string[] = [];
  const counts = new Map<string, number>();
  for (const p of PROBLEMS) {
    if (!counts.has(p.topic)) order.push(p.topic);
    counts.set(p.topic, (counts.get(p.topic) ?? 0) + 1);
  }
  return order.map((topic) => ({ topic, count: counts.get(topic)! }));
}

export const DIFFICULTY_ORDER: Difficulty[] = ["easy", "medium", "hard"];

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Easy",
  medium: "Medium",
  hard: "Hard",
};

/** Human-readable topic titles (kept aligned with chapter titles). */
export const TOPIC_LABEL: Record<string, string> = {
  arrays: "Arrays & strings",
  searching: "Searching",
  sorting: "Sorting",
  recursion: "Recursion",
  hashing: "Hashing",
  "stacks-queues": "Stacks & queues",
  trees: "Trees",
  traversals: "Traversals",
  heaps: "Heaps",
  "dynamic-programming": "Dynamic programming",
  "bit-manipulation": "Bit manipulation",
  math: "Math for algorithms",
  "linked-lists": "Linked lists",
  pathfinding: "Pathfinding",
  "minimum-spanning-trees": "Minimum spanning trees",
};

export function topicLabel(topic: string): string {
  return TOPIC_LABEL[topic] ?? topic;
}

export const PROBLEM_COUNT = PROBLEMS.length;
