import { callout, chapter, derive, heading, lesson, prose, step, viz } from "../builder";

export const searching = chapter(
  "searching",
  "Searching",
  "Finding a value in a collection — and why sorted data changes everything.",
  "Search",
  [
    lesson(
      "linear-search",
      "Linear search",
      "The baseline: check every element until you find the target.",
      4,
      [
        prose(
          "The most direct way to find a value is to **look at every element** until you spot it (or run out). No assumptions about the data, no setup — just a single pass.",
        ),
        prose(
          "```\ndef linear_search(a, target):\n    for i in range(len(a)):\n        if a[i] == target:\n            return i\n    return -1\n```",
        ),
        viz("linear-search", { title: "Scanning one item at a time" }),
        callout(
          "complexity",
          "`O(n)` time, `O(1)` space. In the worst case (target last, or absent) you touch all `n` elements. Best case is `O(1)` if it's first.",
        ),
        callout(
          "intuition",
          "Linear search is the *only* option on unsorted data. The moment the data is **sorted**, we can do dramatically better — that's the next lesson.",
        ),
      ],
    ),
    lesson(
      "binary-search",
      "Binary search",
      "Halving a sorted array each step to find a value in O(log n).",
      7,
      [
        prose(
          "If the array is **sorted**, you don't have to check every element. Look at the middle: if the target is smaller, it must be in the left half; if larger, the right half. Either way you **discard half the array** in one comparison, and repeat.",
        ),
        prose(
          "```\ndef binary_search(a, target):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if a[mid] == target: return mid\n        if a[mid] < target:  lo = mid + 1\n        else:                hi = mid - 1\n    return -1\n```",
        ),
        viz("binary-search", { title: "Shrinking the search window with lo / mid / hi" }),
        heading("The loop invariant"),
        prose(
          "A **loop invariant** is a fact that stays true before and after every iteration. For binary search, the invariant is: *if the target exists, it is inside the current window `lo..hi`*. Initially that window is the whole array. Each comparison discards only a half that cannot contain the target, so the invariant remains true. When the window is empty, the invariant tells us the target is absent.",
        ),
        heading("Why it's O(log n)"),
        prose("Count how many times you can halve the search window before it's empty:"),
        derive(
          [
            step("start with n candidates", "The whole array is in play."),
            step("n → n/2 → n/4 → … → 1", "Each comparison halves the window."),
            step("after k steps: n / 2ᵏ = 1", "Stop when one candidate remains."),
            step("2ᵏ = n  ⟹  k = log₂ n", "Solve for the step count k."),
          ],
          "O(log n)",
          "Halving ⟹ logarithmic",
        ),
        viz("halving", { title: "Each comparison halves the window" }),
        callout(
          "complexity",
          "`O(log n)` time, `O(1)` space (iterative). For a million elements that's ~20 comparisons instead of a million — the payoff for keeping data sorted.",
        ),
        callout(
          "warning",
          "Binary search **requires sorted input**. The cost of sorting first (`O(n log n)`) only pays off if you'll search many times.",
        ),
      ],
    ),
    lesson(
      "ternary-search",
      "Ternary search",
      "Splitting search into thirds, why it is O(log n), and why binary still usually wins.",
      7,
      [
        prose(
          "If binary search asks one middle question, ternary search asks two. Pick two probes, `m1` and `m2`, so the sorted window is split into three parts. If the target is smaller than `a[m1]`, keep the left third; if larger than `a[m2]`, keep the right third; otherwise keep the middle third.",
        ),
        prose(
          "```\ndef ternary_search(a, target):\n    lo, hi = 0, len(a) - 1\n    while lo <= hi:\n        third = (hi - lo) // 3\n        m1, m2 = lo + third, hi - third\n        if a[m1] == target: return m1\n        if a[m2] == target: return m2\n        if target < a[m1]: hi = m1 - 1\n        elif target > a[m2]: lo = m2 + 1\n        else: lo, hi = m1 + 1, m2 - 1\n    return -1\n```",
        ),
        viz("ternary-search", { title: "Shrinking the search window by thirds" }),
        heading("Bases in search"),
        prose(
          "Binary search leaves `1/2` of the candidates each round. Ternary search leaves `1/3`. More generally, a `b`-way search that keeps one of `b` equal regions takes about `log_b n` rounds.",
        ),
        derive(
          [
            step("start with n candidates", "The whole sorted array is still possible."),
            step("n → n/3 → n/9 → … → 1", "Each ternary round keeps one third."),
            step("after k rounds: n / 3ᵏ = 1", "Stop when the window has one candidate."),
            step("3ᵏ = n  ⟹  k = log₃ n", "The base is 3 because each step splits into thirds."),
          ],
          "O(log n)",
          "Ternary search has log base 3 rounds",
        ),
        callout(
          "intuition",
          "`log₂ n`, `log₃ n`, and `log₁₀ n` differ by constant factors: `log₃ n = log₂ n / log₂ 3`. Big-O drops that constant, so all fixed-base logarithms become `O(log n)`.",
        ),
        callout(
          "warning",
          "For ordinary sorted-array lookup, ternary search is usually **not faster** than binary search. It reduces the number of rounds, but each round does up to two value comparisons. Ternary search shines more naturally in optimization problems over a unimodal function.",
        ),
      ],
    ),
  ],
);
