import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const divideAndConquer = chapter(
  "divide-and-conquer",
  "Divide & conquer",
  "Split a problem into independent subproblems, solve them, and combine — with the Master Theorem to read the cost.",
  "GitBranch",
  [
    lesson(
      "dc-method",
      "The divide-and-conquer method",
      "The three-step template, the Master Theorem, and fast power.",
      11,
      [
        heading("The template"),
        prose(
          "**Divide and conquer** solves a problem in three steps: **divide** it into smaller independent subproblems, **conquer** each by recursion, then **combine** their answers. Merge sort, quicksort, binary search, and fast exponentiation are all instances.",
        ),
        prose(
          "```\ndef solve(problem):\n    if small enough: return base_case(problem)\n    parts = divide(problem)\n    answers = [solve(p) for p in parts]\n    return combine(answers)\n```",
        ),
        viz("recursion", { variant: "divide", title: "Divide & conquer: branching by level" }),
        heading("The Master Theorem"),
        prose(
          "Many D&C recurrences have the form `T(n) = a·T(n/b) + f(n)` — `a` subproblems of size `n/b` plus `f(n)` combine work. Compare `f(n)` with `n^(log_b a)`:",
        ),
        derive(
          [
            step("f(n) ≪ n^(log_b a)  ⟹  T(n) = Θ(n^(log_b a))", "Leaves dominate (e.g. a=8,b=2)."),
            step("f(n) ≈ n^(log_b a)  ⟹  T(n) = Θ(n^(log_b a) · log n)", "Balanced — merge sort: a=2,b=2,f=n ⟹ n log n."),
            step("f(n) ≫ n^(log_b a)  ⟹  T(n) = Θ(f(n))", "Combine dominates."),
          ],
          "T(n) = a·T(n/b) + f(n)",
          "Reading a D&C recurrence",
        ),
        heading("Fast exponentiation"),
        prose(
          "`xⁿ = (x^(n/2))²` (times an extra `x` if `n` is odd) halves the exponent each step — `O(log n)` multiplications instead of `n`. The same squaring trick powers modular exponentiation (see [Math](/learn/math/primes-combinatorics)) and matrix-power recurrences.",
        ),
        callout(
          "intuition",
          "D&C pays off when the subproblems are **independent** and the **combine** step is cheap. If subproblems overlap and you'd recompute them, that's a job for [dynamic programming](/learn/dynamic-programming/dp-1d) instead.",
        ),
        problem("my-pow"),
        problem("binary-search"),
      ],
    ),
    lesson(
      "dc-classics",
      "Classic divide-and-conquer algorithms",
      "Merge sort, counting inversions, the median of two sorted arrays, and majority voting.",
      11,
      [
        heading("Merge sort & counting inversions"),
        prose(
          "**Merge sort** splits, sorts each half, and merges in `O(n)` — `T(n) = 2T(n/2) + O(n) = O(n log n)`. The same merge step **counts inversions** (out-of-order pairs): when an element from the right half is taken before elements remaining on the left, each of those left elements forms an inversion.",
        ),
        viz("recursion-tree", { variant: "merge", title: "n work per level × log n levels" }),
        heading("Median of two sorted arrays"),
        prose(
          "Binary-searching the **partition point** of the two arrays finds the combined median in `O(log(m+n))` — a subtle but classic divide-and-conquer on the answer space (an `O(m+n)` merge also works and is a fine first solution).",
        ),
        heading("Majority element"),
        prose(
          "The majority of an array is the majority of one of its halves, so D&C finds it by combining the two halves' candidates — `O(n log n)`. **Boyer–Moore voting** does the same job in a single `O(n)` pass with `O(1)` memory by cancelling non-matching pairs.",
        ),
        heading("Other classics"),
        prose(
          "- **Closest pair of points** — `O(n log n)` by splitting the plane and checking a thin strip across the divide.\n- **Karatsuba multiplication** — multiply big numbers in `O(n^1.585)` by reducing four sub-multiplications to three.\n- **Quickselect** — partition like quicksort but recurse into only one side for the k-th element in `O(n)` average.",
        ),
        callout(
          "complexity",
          "Most balanced D&C algorithms land at `O(n log n)` (the `2T(n/2)+O(n)` case). The win over the brute force comes from the **combine** being cheaper than redoing the work.",
        ),
        problem("count-inversions"),
        problem("majority-element"),
        problem("median-two-sorted"),
      ],
    ),
  ],
);
