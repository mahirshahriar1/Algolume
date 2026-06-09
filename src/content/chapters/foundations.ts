import { callout, chapter, derive, heading, lesson, prose, step, viz } from "../builder";

export const foundations = chapter(
  "foundations",
  "Foundations",
  "How to think about algorithms and measure what they cost.",
  "Compass",
  [
    lesson(
      "big-o",
      "Big-O in one sitting",
      "What Big-O measures, the classes worth knowing, and how to derive one from a loop.",
      8,
      [
        prose(
          "Before we sort or search anything, we need a way to talk about **how expensive** an algorithm is — without getting lost in which laptop it ran on. That's what **Big-O notation** is for. It describes how the work an algorithm does *grows* as the input gets bigger.",
        ),
        callout(
          "intuition",
          "Big-O isn't about seconds. It's about **shape** — how the cost curve bends as `n` grows. A slow `O(n)` algorithm beats a fast `O(n²)` one once the input is big enough.",
        ),
        heading("The classes worth memorising"),
        prose(
          "You can get remarkably far knowing just six growth classes, cheapest first:\n\n- `O(1)` — **constant**. Same cost no matter the size (array index, hash lookup).\n- `O(log n)` — **logarithmic**. Halves the problem each step (binary search).\n- `O(n)` — **linear**. Touch each element once (a single loop).\n- `O(n log n)` — **linearithmic**. The best general sorting can do.\n- `O(n²)` — **quadratic**. A loop inside a loop (bubble, insertion).\n- `O(2ⁿ)` / `O(n!)` — **exponential / factorial**. Brute-forcing every combination.",
        ),
        prose("Drag `n` and watch the curves separate — the whole point of Big-O is what happens as `n` grows:"),
        viz("bigo-growth", { title: "How the classes grow" }),
        heading("The counting tricks you actually use"),
        prose(
          "Most interview and classroom complexity problems reduce to a few counting moves. Keep these in your pocket:\n\n- **One loop over n items** → `n` operations → `O(n)`.\n- **Two independent loops in a row** → `n + n` → `O(n)`, not `O(n²)`.\n- **Nested loops** → multiply the ranges: `n × n` → `O(n²)`.\n- **Shrinking nested loop** → add a staircase: `(n−1)+(n−2)+...+1` → `O(n²)`.\n- **Loop doubles/halves each step** → count powers: `1, 2, 4, 8...n` or `n, n/2, n/4...1` → `O(log n)`.\n- **Recursive split into halves with linear merge work** → `log n` levels × `n` work per level → `O(n log n)`.",
        ),
        callout(
          "note",
          "A fast way to sanity-check: ask **how many times can this line run for one input item?** If every item is touched once, think `O(n)`. If every item can pair with every other item, think `O(n²)`. If the candidate set keeps shrinking by a fixed fraction, think logarithms.",
        ),
        heading("Constants, lower terms, and why we drop them"),
        prose(
          "Big-O keeps the term that dominates for large `n`. The arithmetic can look different, but the growth shape is the same:\n\n- `3n + 20` → `O(n)` because the linear term eventually dwarfs the constant.\n- `n² + 100n + 9000` → `O(n²)` because the square term eventually wins.\n- `½n² − ½n` → `O(n²)` because constant factors and smaller terms do not change the curve family.\n\nThis is not pretending constants never matter in real code. It means Big-O answers a narrower question: **what happens as input size scales?**",
        ),
        heading("Deriving a bound from a loop"),
        prose(
          "You don't guess a complexity — you **count operations**. Take the classic nested loop where the inner loop shrinks each pass (exactly what bubble and selection sort do):",
        ),
        prose("```\nfor i in range(n):\n    for j in range(i + 1, n):\n        compare(a[i], a[j])\n```"),
        derive(
          [
            step("(n−1) + (n−2) + … + 1", "The inner loop runs n−1 times, then n−2, down to 1."),
            step("= Σ k, for k = 1 … n−1", "That's just the sum of the first n−1 integers."),
            step("= n(n−1) / 2", "Gauss's closed form for the sum."),
            step("= ½n² − ½n", "Expand it out."),
            step("drop ½ and the −½n term", "Constants and lower-order terms don't change the shape."),
          ],
          "O(n²)",
          "Why nested loops are quadratic",
        ),
        prose("That sum is a staircase that fills half a square. Drag `n` to see the filled ratio settle toward ½ — and half of `n²` is still `O(n²)`:"),
        viz("sum-triangle", { title: "1 + 2 + … + n  ≈  ½n²" }),
        callout(
          "complexity",
          "Two simplifications make Big-O easy to read: **drop constant factors** (`O(2n)` → `O(n)`) and **keep only the dominant term** (`O(n² + n)` → `O(n²)`). For large `n`, the biggest term wins.",
        ),
        heading("Logarithms come from halving"),
        prose(
          "Whenever an algorithm throws away *half* of what's left each step, the number of steps is how many times you can halve `n` before reaching 1 — and that's the definition of a logarithm.",
        ),
        derive(
          [
            step("n → n/2 → n/4 → … → 1", "Each step discards half the remaining input."),
            step("after k steps: n / 2ᵏ = 1", "Stop when one element is left."),
            step("2ᵏ = n  ⟹  k = log₂ n", "Solve for the number of steps k."),
          ],
          "O(log n)",
          "Why binary search is logarithmic",
        ),
        viz("halving", { title: "Halving n down to 1" }),
        heading("A few maths examples"),
        prose(
          "These small equations show up constantly:\n\n- `for i in range(0, n, 2)` runs about `n/2` times → `O(n)`.\n- `i = 1; while i < n: i *= 2` runs `log₂ n` times → `O(log n)`.\n- `for i in range(n): for j in range(10): ...` runs `10n` times → `O(n)`.\n- `for i in range(n): for j in range(i): ...` runs `0+1+...+(n−1)` → `O(n²)`.\n- `T(n)=2T(n/2)+n` has `log₂ n` levels, each doing total `n` work → `O(n log n)`.",
        ),
        callout(
          "note",
          "Big-O describes the **worst case** by default. You'll also meet **average case** (typical inputs) and **best case** — quick sort is `O(n log n)` on average but `O(n²)` at its worst.",
        ),
      ],
    ),
    lesson(
      "space-complexity",
      "Space complexity",
      "Memory has a Big-O too — auxiliary space, recursion stacks, input space, and trade-offs.",
      8,
      [
        prose(
          "Big-O usually measures **time**, but the same idea applies to **memory**. *Space complexity* counts the extra memory an algorithm needs as the input grows — not counting the input itself.",
        ),
        heading("Input space vs auxiliary space"),
        prose(
          "There are two common ways people talk about space:\n\n- **Input space**: the memory needed to store the input itself. An array of `n` numbers is `O(n)` input space.\n- **Auxiliary space**: extra memory the algorithm allocates while running. This is what interview questions usually mean by \"space complexity\".\n\nIf a function reverses an array in place, the input is `O(n)` but the auxiliary space is only `O(1)`.",
        ),
        callout(
          "intuition",
          "In-place algorithms (bubble sort, array reversal) use `O(1)` extra space. Merge sort needs an `O(n)` buffer to merge. A hash table spends `O(n)` memory to buy `O(1)` lookups.",
        ),
        heading("Common space patterns"),
        prose(
          "- **A few variables** (`i`, `best`, `sum`) → `O(1)` auxiliary space.\n- **A copied array, set, map, or frequency table** with up to `n` entries → `O(n)`.\n- **A 2D table** for dynamic programming over two dimensions → often `O(nm)`.\n- **A queue for BFS** can grow to the width of the graph/tree → `O(w)` or `O(V)`.\n- **A recursion stack** stores unfinished calls → one stack frame per active call.",
        ),
        heading("Recursion stack maths"),
        derive(
          [
            step("factorial(n) calls factorial(n−1)", "Only one recursive branch is active at a time."),
            step("n → n−1 → n−2 → … → 1", "The stack depth grows linearly."),
            step("n active frames in the worst moment", "Each frame stores local variables and return position."),
          ],
          "O(n) space",
          "Linear recursion uses linear stack space",
        ),
        derive(
          [
            step("binary_search keeps one half", "Only one recursive branch continues."),
            step("n → n/2 → n/4 → … → 1", "The stack depth is logarithmic."),
            step("depth = log₂ n", "One frame per level."),
          ],
          "O(log n) space if recursive, O(1) if iterative",
          "Halving recursion uses logarithmic stack space",
        ),
        heading("The trade-off"),
        prose(
          "Often you can **spend memory to save time**. Two-sum is `O(n²)` by brute force, but remembering seen values in a hash set makes it `O(n)` time for `O(n)` space. Knowing both axes lets you pick the right balance.",
        ),
        heading("Space-saving tricks"),
        prose(
          "A few patterns show up again and again:\n\n- Use **two pointers** instead of making a reversed copy.\n- Store **counts** instead of full lists when only frequencies matter.\n- Roll a DP table from `O(nm)` down to `O(m)` when each row only depends on the previous row.\n- Prefer an **iterative loop** over recursion when stack depth might become large.\n- Stream data one item at a time when you do not need the whole input in memory.",
        ),
        callout(
          "note",
          "Recursion isn't free either: each pending call sits on the stack, so recursion `d` levels deep costs `O(d)` space — that's `O(log n)` for balanced recursion and `O(n)` for a degenerate chain.",
        ),
      ],
    ),
    lesson(
      "time-complexity-in-practice",
      "Time complexity in practice",
      "Best, average, worst, amortized time, and what Big-O deliberately ignores.",
      6,
      [
        prose(
          "Time complexity is the count of work as input grows. Big-O is the headline version, but real analysis often asks *which case* and *which operation* you are measuring.",
        ),
        heading("Best, average, worst"),
        prose(
          "- **Best case**: the luckiest input. Linear search finds the target at index 0 → `O(1)`.\n- **Worst case**: the hardest input. Linear search target absent → `O(n)`.\n- **Average case**: expected over typical inputs. Searching for a random present item in an array checks about `n/2` items → still `O(n)`.",
        ),
        heading("Worked examples"),
        prose(
          "Example 1 — two separate passes:\n\n```\nfor x in a: print(x)\nfor x in a: print(x * 2)\n```\nThe first loop runs `n` times and the second loop runs `n` times, so the total is `2n` → `O(n)`.",
        ),
        prose(
          "Example 2 — every pair:\n\n```\nfor i in range(n):\n    for j in range(n):\n        check(i, j)\n```\nFor each of `n` choices of `i`, `j` runs `n` times. Total work is `n × n = n²` → `O(n²)`.",
        ),
        prose(
          "Example 3 — shrinking work:\n\n```\nfor i in range(n):\n    for j in range(i + 1, n):\n        compare(i, j)\n```\nThe inner loop does `(n−1) + (n−2) + ... + 1 = n(n−1)/2` checks → `O(n²)`, even though it is only half the square.",
        ),
        prose(
          "Example 4 — doubling:\n\n```\ni = 1\nwhile i < n:\n    i *= 2\n```\nThe values go `1, 2, 4, 8, ...`. After `k` steps, `i = 2ᵏ`; stop when `2ᵏ ≥ n`, so `k = log₂ n` → `O(log n)`.",
        ),
        callout(
          "note",
          "Unless someone says otherwise, complexity usually means **worst-case time**. It is a promise the algorithm will not exceed, not a prediction that every input behaves that way.",
        ),
        heading("Amortized time"),
        prose(
          "Some operations are usually cheap but occasionally expensive. Appending to a dynamic array is a classic example: most appends are `O(1)`, but when capacity fills, the array allocates a bigger block and copies old items.",
        ),
        derive(
          [
            step("many appends cost 1", "Most writes land in existing capacity."),
            step("resize copies 1, then 2, then 4, then 8 ... items", "Each old item is copied only a small number of times across many appends."),
            step("1 + 2 + 4 + ... + n < 2n", "The total copying over n appends is linear."),
          ],
          "O(1) amortized append",
          "Occasional expensive work spread over many operations",
        ),
        heading("Big-O vs real runtime"),
        prose(
          "Big-O ignores constants, hardware, cache locality, language overhead, and input distribution. That is useful for comparing growth, but it is not the whole performance story. For small `n`, a clean `O(n²)` algorithm may beat a complicated `O(n log n)` one. For large `n`, the growth curve eventually takes over.",
        ),
        callout(
          "intuition",
          "Use Big-O to choose the right family of algorithm. Use measurement to choose between implementations in the same family.",
        ),
      ],
    ),
  ],
);
