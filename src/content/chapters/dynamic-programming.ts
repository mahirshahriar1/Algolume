import { callout, chapter, derive, divider, heading, lesson, problem, prose, step, viz } from "../builder";

export const dynamicProgramming = chapter(
  "dynamic-programming",
  "Dynamic programming",
  "Solve overlapping subproblems once and reuse the answers — 1D and 2D tables.",
  "Grid3x3",
  [
    lesson(
      "dp-1d",
      "DP foundations & 1D tables",
      "Overlapping subproblems, memoization vs tabulation, and 1D DP on climbing stairs and coin change.",
      11,
      [
        heading("Concept"),
        prose(
          "**Dynamic programming** applies when a problem has two traits: **optimal substructure** (the best answer is built from best answers to subproblems) and **overlapping subproblems** (the same subproblems recur). Instead of recomputing them, we solve each subproblem **once** and store the result.",
        ),
        prose(
          "Naive recursion for Fibonacci is `O(2ⁿ)` because `fib(n-2)` is recomputed all over the tree. DP collapses that to `O(n)` by remembering each value.",
        ),
        heading("Memoization vs tabulation"),
        prose(
          "- **Memoization (top-down):** write the natural recursion, but cache each result the first time you compute it.\n- **Tabulation (bottom-up):** define a table `dp[...]`, fill the base cases, then iterate in an order where every value's dependencies are already filled.",
        ),
        prose(
          "Both are `O(states × work-per-state)`. Tabulation avoids recursion overhead and makes the **fill order** explicit — which is what the visualizer shows.",
        ),
        heading("1D DP: climbing stairs"),
        prose(
          "Ways to reach step `i` taking 1 or 2 steps: `dp[i] = dp[i-1] + dp[i-2]`. One dimension (the step index), constant work per state.",
        ),
        prose(
          "```cpp\nint climb(int n) {\n    long long a = 1, b = 1;       // dp[i-2], dp[i-1]\n    for (int i = 0; i < n; i++) { long long t = a + b; a = b; b = t; }\n    return a;\n}\n```",
        ),
        heading("1D DP: coin change"),
        prose(
          "`dp[a]` = fewest coins to make amount `a`. For every amount, try each coin: `dp[a] = min(dp[a], dp[a - c] + 1)`. Watch the 1D table fill:",
        ),
        viz("dp", { variant: "coin", title: "Coin change — a 1D table over amounts" }),
        derive(
          [
            step("states = amounts 0..A", "A + 1 subproblems."),
            step("work per state = try each of k coins", "O(k) per amount."),
            step("(A + 1) × k", "Multiply."),
          ],
          "O(A · k) time, O(A) space",
          "Counting the DP work",
        ),
        callout(
          "intuition",
          "The recurrence *is* the algorithm. Once you can state \"dp[x] in terms of smaller dp[...]\" and the base cases, tabulation is just filling the table in dependency order.",
        ),
        problem("climbing-stairs"),
        problem("coin-change"),
      ],
    ),
    lesson(
      "dp-2d",
      "2D tables: grids, strings & knapsack",
      "When a subproblem needs two indices: unique paths, edit distance, LCS, and 0/1 knapsack.",
      12,
      [
        heading("When you need two dimensions"),
        prose(
          "Some subproblems are indexed by **two** things — a position in two strings, a cell in a grid, or (item, capacity). Then `dp` is a 2D table and each cell depends on a few neighbours.",
        ),
        heading("Unique paths"),
        prose(
          "How many ways to walk from the top-left of an `R×C` grid to the bottom-right, moving only right or down? Each cell is the sum of the cell **above** and the cell to its **left**: `dp[i][j] = dp[i-1][j] + dp[i][j-1]`.",
        ),
        viz("dp", { variant: "paths", title: "Unique paths — each cell adds up + left" }),
        heading("Edit distance"),
        prose(
          "The minimum insert/delete/replace edits to turn `a` into `b`. If the current characters match, copy the diagonal; otherwise it's `1 + min(replace, delete, insert)`:",
        ),
        prose(
          "```\nif a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1]\nelse:                dp[i][j] = 1 + min(dp[i-1][j-1],  # replace\n                                          dp[i-1][j],    # delete\n                                          dp[i][j-1])    # insert\n```",
        ),
        viz("dp", { variant: "edit", title: "Edit distance — the 3-way minimum" }),
        heading("Longest common subsequence"),
        prose(
          "`dp[i][j]` = LCS length of the first `i` chars of `a` and first `j` of `b`. On a match, extend the diagonal by 1; otherwise take the best of dropping one character from either string.",
        ),
        heading("0/1 knapsack"),
        prose(
          "With items of weight/value and a capacity `W`, `dp[i][w]` = best value using the first `i` items within weight `w`. Either skip item `i` (`dp[i-1][w]`) or take it if it fits (`dp[i-1][w - wt[i]] + val[i]`).",
        ),
        prose(
          "```cpp\nfor (int i = 1; i <= n; i++)\n    for (int w = 0; w <= W; w++) {\n        dp[i][w] = dp[i-1][w];                       // skip\n        if (wt[i-1] <= w)\n            dp[i][w] = max(dp[i][w], dp[i-1][w-wt[i-1]] + val[i-1]); // take\n    }\n```",
        ),
        callout(
          "complexity",
          "2D DP is typically `O(R·C)` (or `O(n·W)`) time and space. Many 2D DPs compress to `O(min dimension)` space because each row only needs the previous row.",
        ),
        callout(
          "warning",
          "Get the **fill order** right: a cell must be computed only after the cells it reads. For these tables, iterate rows top-to-bottom, columns left-to-right.",
        ),
        problem("longest-common-subsequence"),
        divider(),
        heading("A curated path for dynamic programming"),
        prose(
          "DP is the topic most people drill with a dedicated set. These two are the classic starting points:",
        ),
        prose(
          "- [AtCoder Educational DP Contest (EDPC)](https://atcoder.jp/contests/dp): 26 problems labelled A–Z that walk through the standard DP patterns — knapsack, LIS/LCS, interval DP, tree DP, and bitmask DP. The canonical DP practice set; pair it with this chapter.\n- [Codeforces blog #122422](https://codeforces.com/blog/entry/122422): a community-curated DP problem/learning list to keep practising after EDPC.\n- More judges and general resources are in the [CP intro](/learn/competitive-programming/first-problem-walkthroughs).",
        ),
      ],
    ),
    lesson(
      "bitmask-dp",
      "Bitmask DP & the Travelling Salesman",
      "Encode a subset in the bits of an integer, then DP over subsets — the assignment problem and Held-Karp TSP.",
      13,
      [
        heading("Subsets as integers"),
        prose(
          "When `n` is small (roughly `n ≤ 20`), a **subset of `n` items** fits in the bits of one integer: bit `i` set means \"item `i` is in the subset\". That turns \"try every subset\" into a loop over `0 … 2ⁿ - 1`, and lets a DP be indexed by **which items are used so far** — `dp[mask]`. (The bit operations themselves are in the [Bit manipulation](/learn/bit-manipulation/bit-basics) chapter.)",
        ),
        prose(
          "```cpp\nfor (int mask = 0; mask < (1 << n); mask++) {\n    int bits = __builtin_popcount(mask);   // how many chosen\n    bool has_i = mask & (1 << i);          // is item i in?\n    int with_i = mask | (1 << i);          // add item i\n    int without = mask & ~(1 << i);        // remove item i\n}\n```",
        ),
        heading("Warm-up: the assignment problem"),
        prose(
          "Assign `n` workers to `n` distinct tasks at minimum cost. Let `dp[mask]` be the min cost once the tasks in `mask` are taken; the worker to place next is `popcount(mask)`. Each transition gives that worker an **unused** task:",
        ),
        prose(
          "```cpp\nvector<int> dp(1 << n, INF);\ndp[0] = 0;\nfor (int mask = 0; mask < (1 << n); mask++) {\n    if (dp[mask] == INF) continue;\n    int w = __builtin_popcount(mask);     // next worker\n    if (w == n) continue;\n    for (int j = 0; j < n; j++)\n        if (!(mask & (1 << j)))\n            dp[mask | (1 << j)] = min(dp[mask | (1 << j)], dp[mask] + cost[w][j]);\n}\nreturn dp[(1 << n) - 1];\n```",
        ),
        heading("Travelling Salesman (Held-Karp)"),
        prose(
          "The **Travelling Salesman Problem (TSP)** asks for the shortest tour that visits every city once and returns to the start. Brute force tries all `(n-1)!` tours. **Held-Karp** is a bitmask DP that does it in `O(2ⁿ · n²)`: let `dp[mask][i]` be the cheapest path that starts at city `0`, visits exactly the cities in `mask`, and ends at city `i`.",
        ),
        prose(
          "```\ndp[{0}][0] = 0\nfor each mask containing 0:\n    for i in mask:\n        for j not in mask:\n            dp[mask | (1<<j)][j] = min(..., dp[mask][i] + dist[i][j])\nanswer = min over i of dp[full][i] + dist[i][0]   # close the tour\n```",
        ),
        viz("dp", { variant: "tsp", title: "Held-Karp: dp[mask][end] over subsets" }),
        derive(
          [
            step("2ⁿ subsets × n end-cities", "The state is (mask, end)."),
            step("O(n) transitions per state", "Try each next city."),
            step("2ⁿ · n²", "Multiply."),
          ],
          "O(2ⁿ · n²) time, O(2ⁿ · n) space",
          "Held-Karp cost",
        ),
        callout(
          "warning",
          "Held-Karp is **exponential** — it only works for small `n` (≈ 20). TSP is **NP-hard**, so no known algorithm solves the general case in polynomial time. See the [NP-hardness](/learn/np-hardness/p-vs-np) chapter for what that means and what to do about it.",
        ),
        heading("Iterating submasks"),
        prose(
          "Some bitmask DPs split a set into two parts. Enumerate every **submask** of a mask efficiently:",
        ),
        prose(
          "```cpp\nfor (int sub = mask; sub > 0; sub = (sub - 1) & mask) {\n    // sub ranges over all non-empty submasks of mask\n}\n```",
        ),
        prose(
          "Summed over all masks this is `O(3ⁿ)` — the basis of partition-style DPs like \"minimum number of groups\".",
        ),
        problem("min-assignment-cost"),
        problem("tsp-held-karp"),
      ],
    ),
  ],
);
