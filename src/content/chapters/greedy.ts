import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const greedy = chapter(
  "greedy",
  "Greedy algorithms",
  "Make the locally best choice and never look back — when an exchange argument proves it's optimal.",
  "CalendarRange",
  [
    lesson(
      "greedy-intro",
      "The greedy method",
      "When taking the locally best choice is globally optimal — and how to prove it.",
      11,
      [
        heading("Concept"),
        prose(
          "A **greedy algorithm** builds a solution one step at a time, always taking the choice that looks best **right now**, and never undoing it. It's the simplest strategy there is — the hard part isn't coding it, it's knowing **when it actually gives the optimal answer**.",
        ),
        heading("Two properties greedy needs"),
        prose(
          "- **Greedy-choice property:** a globally optimal solution can be reached by making locally optimal choices. The first greedy choice is always part of *some* optimal solution.\n- **Optimal substructure:** after making the greedy choice, the remaining subproblem is the same kind of problem, and combining its optimal solution with the greedy choice is optimal.",
        ),
        heading("Activity selection"),
        prose(
          "The classic example: given activities with start/finish times, attend the **most** activities without overlap. The greedy rule is to repeatedly take the activity that **finishes earliest** among those still compatible — finishing early leaves the most room for the rest.",
        ),
        viz("greedy", { title: "Sort by finish time, then take non-overlapping activities" }),
        heading("Why it's optimal — the exchange argument"),
        derive(
          [
            step("Let g be the activity that finishes first.", "Greedy picks it."),
            step("Take any optimal solution O; let o be its first activity.", "o finishes no earlier than g."),
            step("Swap o for g in O.", "g finishes ≤ o, so it still doesn't overlap the rest — the set stays valid and the same size."),
            step("So an optimal solution contains the greedy choice; recurse on the rest.", "By induction, greedy is optimal."),
          ],
          "Greedy = optimal for activity selection",
          "Exchange argument",
        ),
        callout(
          "intuition",
          "An **exchange argument** is the standard proof for greedy: show you can transform any optimal solution into the greedy one without making it worse. If you can't, greedy probably isn't optimal.",
        ),
        heading("When greedy fails"),
        prose(
          "Greedy is *not* a universal hammer. For **0/1 knapsack**, taking the highest value-per-weight item first can be wrong — you might fill the bag with one efficient item and waste the rest. That problem needs [dynamic programming](/learn/dynamic-programming/dp-2d). Always justify greedy with an exchange argument (or a counterexample to kill it).",
        ),
        problem("activity-selection"),
        problem("jump-game"),
      ],
    ),
    lesson(
      "kadane",
      "Kadane's maximum subarray",
      "Scan once, greedily restarting or extending a running sum to find the best contiguous block.",
      9,
      [
        heading("The problem"),
        prose(
          "Given an array of numbers (possibly negative), find the **contiguous subarray with the largest sum**. Checking every subarray is `O(n²)`; **Kadane's algorithm** does it in a single `O(n)` pass.",
        ),
        heading("The greedy choice"),
        prose(
          "Scan left to right keeping `cur` = the best sum of a subarray **ending at the current element**. At each new element `x` you make one local choice: **extend** the previous block (`cur + x`) or **restart** a fresh block at `x`. Take whichever is larger — that's the greedy step. Track the best `cur` ever seen.",
        ),
        prose(
          "```\ncur = max(x, cur + x)   # restart vs extend\nbest = max(best, cur)\n```",
        ),
        prose(
          "It's a **greedy/DP hybrid**: `cur` is a one-state DP recurrence, and the \"restart when the running sum would only hurt\" rule is the greedy insight — once `cur` goes negative it can never help a future element, so drop it.",
        ),
        viz("greedy", { variant: "kadane", title: "Kadane: restart vs extend, tracking the best window" }),
        derive(
          [
            step("cur tracks the best sum ending here", "Either extend or restart."),
            step("a negative cur can only lower a future sum", "So restart drops it."),
            step("one pass, O(1) state", "best updates as we go."),
          ],
          "O(n) time, O(1) space",
          "Why one pass suffices",
        ),
        heading("Variations"),
        prose(
          "The same scan adapts: track the **indices** for the actual subarray, or keep both a running **max and min** product to handle **maximum product subarray** (a negative times a small negative can become large).",
        ),
        callout(
          "intuition",
          "Kadane is the cleanest example of \"greedy local choice + remember the best\". If a prefix is dragging your sum below zero, the greedy move is to forget it entirely.",
        ),
        problem("max-subarray"),
        problem("max-product-subarray"),
      ],
    ),
    lesson(
      "greedy-classics",
      "Classic greedy algorithms",
      "Fractional knapsack, interval problems, and Huffman coding.",
      11,
      [
        heading("Fractional knapsack"),
        prose(
          "Unlike 0/1 knapsack, here you may take **fractions** of items. Greedy *is* optimal: sort by **value/weight** ratio and take as much of the best ratio as fits, then the next, splitting the last item to fill the bag exactly.",
        ),
        prose(
          "```cpp\nsort(items, by value/weight descending);\ndouble total = 0; int cap = W;\nfor (auto& it : items) {\n    if (it.weight <= cap) { total += it.value; cap -= it.weight; }\n    else { total += it.value * (double)cap / it.weight; break; }\n}\n```",
        ),
        viz("greedy", { variant: "knapsack", title: "Fractional knapsack: fill by value/weight ratio" }),
        callout(
          "warning",
          "The fractional version is greedy-optimal; the **0/1** version (whole items only) is **not** — that's a dynamic-programming problem. The difference is whether you can split an item.",
        ),
        heading("Interval problems"),
        prose(
          "A whole family of problems yields to \"sort by an endpoint, then sweep\": **interval scheduling** (max non-overlapping, sort by finish), **minimum arrows / point cover** (sort by end, shoot at each end), **merge intervals** (sort by start), and **minimum rooms** (sort starts and ends, sweep a counter). The trick is choosing *which* endpoint to sort by.",
        ),
        heading("Huffman coding"),
        prose(
          "To compress symbols by frequency, **Huffman's algorithm** repeatedly merges the **two least-frequent** nodes into a parent (with a min-heap), building an optimal prefix-free code bottom-up. Rare symbols get longer codes, frequent ones shorter — provably minimal total encoded length. It's greedy + a [priority queue](/learn/heaps/heap-operations).",
        ),
        derive(
          [
            step("Pop the two smallest frequencies.", "A min-heap gives them in O(log n)."),
            step("Merge them into a node of summed frequency; push it back.", "Repeat until one tree remains."),
            step("Left/right edges = bits 0/1; depth = code length.", "Frequent symbols stay shallow."),
          ],
          "O(n log n)",
          "Huffman builds an optimal prefix code",
        ),
        callout(
          "complexity",
          "Most greedy algorithms are dominated by an initial **sort** — `O(n log n)` — followed by a single `O(n)` sweep. Huffman is `O(n log n)` via the heap.",
        ),
        problem("min-arrows"),
      ],
    ),
  ],
);
