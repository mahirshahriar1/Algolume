import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const sorting = chapter(
  "sorting",
  "Sorting",
  "Putting things in order — five classic algorithms, watched live.",
  "BarChart3",
  [
    lesson(
      "meet-sorting",
      "Meet sorting",
      "Why sorting matters, what makes one algorithm better, and a playground with all five.",
      6,
      [
        prose(
          "Sorting — arranging items into order — is one of the most studied problems in computing, and a perfect first algorithm to *see*. The same input can be sorted by very different strategies, and watching them side by side makes their personalities obvious.",
        ),
        prose(
          "Press play below, then switch algorithms and watch how each one moves elements around. Drag the timeline to scrub backwards — every step is recorded, so you can rewind any moment.",
        ),
        viz("sorting", { title: "Sorting playground" }),
        heading("What makes one better?"),
        prose(
          "Three things separate sorting algorithms:\n\n- **Time complexity** — how many comparisons and swaps as the array grows. The counters under the visualizer make this tangible.\n- **Space** — does it sort *in place* (`O(1)` extra) or need a copy (`O(n)`)?\n- **Stability** — does it keep equal elements in their original relative order? Matters when you sort by one key after another.",
        ),
        heading("Why comparison sorting bottoms out at n log n"),
        prose(
          "If a sorting algorithm only learns by comparing pairs of elements, it must distinguish all `n!` possible input orders. A comparison has two outcomes, so after `h` comparisons a decision tree has at most `2ʰ` leaves.",
        ),
        derive(
          [
            step("need at least n! leaves", "Each possible ordering must end at a different sorted answer."),
            step("2ʰ ≥ n!", "A binary comparison tree of height h has at most 2ʰ leaves."),
            step("h ≥ log₂(n!)", "Solve for the minimum number of comparisons."),
            step("log₂(n!) = Θ(n log n)", "By Stirling's approximation / summing logs."),
          ],
          "Ω(n log n) lower bound",
          "No comparison sort can beat n log n in the worst case",
        ),
        callout(
          "intuition",
          'There is no single "best" sort. The simple `O(n²)` ones win on tiny or nearly-sorted arrays; the `O(n log n)` ones win at scale. Real libraries often combine several.',
        ),
      ],
    ),
    lesson(
      "bubble-sort",
      "Bubble sort",
      "The simplest sort, and a clean derivation of why it's quadratic.",
      6,
      [
        prose(
          "**Bubble sort** is the friendliest algorithm to learn first. You walk the array comparing each pair of neighbours, swapping them if they're out of order. After one full pass the largest value has *bubbled* to the end. Repeat, and the sorted region grows from the right.",
        ),
        viz("sorting", { algo: "bubble", title: "Bubble sort, step by step" }),
        prose(
          "Watch the code panel: the highlighted line tells you exactly where you are in the loop. When a whole pass makes **no swaps**, the array is already sorted and we stop early — that's the `swapped` flag.",
        ),
        heading("Deriving the cost"),
        prose(
          "Pass 1 compares `n−1` pairs, pass 2 compares `n−2`, and so on, because each pass locks one more element at the end. Add them up:",
        ),
        derive(
          [
            step("(n−1) + (n−2) + … + 1", "Comparisons per pass, shrinking by one each time."),
            step("= n(n−1) / 2", "Sum of the first n−1 integers."),
            step("≈ ½n²", "Drop the lower-order term and the constant."),
          ],
          "O(n²)",
          "Bubble sort comparisons",
        ),
        viz("sum-triangle", { title: "Why those comparisons total ≈ ½n²" }),
        callout(
          "complexity",
          "`O(n²)` time, `O(1)` space, **stable**. Best case on an already-sorted array is `O(n)` thanks to the early-exit flag.",
        ),
        callout(
          "warning",
          "Notice how fast the swap counter climbs even on a small array — that count *is* the `O(n²)`.",
        ),
      ],
    ),
    lesson(
      "merge-sort",
      "Merge sort",
      "Divide in half, sort each half, merge — and solve the recurrence for O(n log n).",
      8,
      [
        prose(
          "**Merge sort** is the textbook *divide and conquer* sort. Split the array in half, sort each half (recursively, the same way), then **merge** the two sorted halves into one. The merge is the clever part: with both halves sorted, you walk them with two pointers and always take the smaller front element.",
        ),
        viz("sorting", { algo: "merge", title: "Merge sort — split then merge" }),
        heading("Deriving the cost"),
        prose(
          "Let `T(n)` be the work to sort `n` items. Each call does two half-sized sorts plus a linear merge. That gives a **recurrence**:",
        ),
        derive(
          [
            step("T(n) = 2·T(n/2) + O(n)", "Two half-problems, plus an O(n) merge."),
            step("the splitting forms a tree of depth log₂ n", "Halving from n down to 1."),
            step("each level merges O(n) elements total", "Every level touches all n items once."),
            step("total = (work per level) × (levels) = n × log n", "Multiply them."),
          ],
          "O(n log n)",
          "The master-theorem case T(n)=2T(n/2)+O(n)",
        ),
        viz("recursion-tree", { title: "n work per level × log n levels" }),
        callout(
          "complexity",
          "`O(n log n)` time in **all** cases (no bad inputs), `O(n)` extra space for the merge buffer, and **stable**. The guaranteed bound is why it's used where worst-case matters.",
        ),
        problem("merge-two-sorted"),
        problem("count-inversions"),
      ],
    ),
    lesson(
      "quick-sort",
      "Quick sort",
      "Partition around a pivot, recurse — fast on average, with a worst case to respect.",
      8,
      [
        prose(
          "**Quick sort** is the workhorse behind many real-world sort implementations. Choose a **pivot**, rearrange so everything smaller sits to its left and everything larger to its right (the **partition** step), then sort each side the same way.",
        ),
        viz("sorting", { algo: "quick", title: "Quick sort with Lomuto partition" }),
        prose(
          "The amber bar is the pivot. As the scan runs, smaller elements get swapped into the growing “less-than” region, and finally the pivot drops into its **exact final position** — it never moves again. That guarantee is what makes the recursion work.",
        ),
        heading("Why average and worst differ"),
        derive(
          [
            step("good pivot: splits into n/2 and n/2", "Balanced ⟹ recurrence T(n)=2T(n/2)+O(n)."),
            step("⟹ O(n log n)", "Same tree as merge sort."),
            step("bad pivot: splits into 0 and n−1", "e.g. sorted input, always picking the end."),
            step("⟹ T(n)=T(n−1)+O(n) = O(n²)", "The tree degenerates into a line."),
          ],
          "O(n log n) average · O(n²) worst",
          "Pivot quality decides the bound",
        ),
        callout(
          "complexity",
          "Average `O(n log n)` time, `O(log n)` stack space, **not stable**. Real implementations randomise or median-pick the pivot to dodge the `O(n²)` worst case.",
        ),
        callout(
          "note",
          "Compare quick sort's comparison count to bubble sort's on the same array size. The gap between `O(n log n)` and `O(n²)` is the whole reason we study more than one sort.",
        ),
        problem("kth-largest"),
      ],
    ),
    lesson(
      "insertion-selection",
      "Insertion & selection sort",
      "Two more O(n²) sorts — one shines on nearly-sorted data, one minimises writes.",
      7,
      [
        prose(
          "**Insertion sort** grows a sorted prefix: take the next element and slide it left into place, like sorting a hand of cards. It's `O(n²)` worst case but `O(n)` on **nearly-sorted** input — the go-to for small or almost-ordered arrays.",
        ),
        viz("sorting", { algo: "insertion", title: "Insertion sort" }),
        prose(
          "**Selection sort** is bubble's mirror image: each pass scans the unsorted tail for the **minimum** and swaps it into place. It always makes exactly `n−1` swaps — handy when writes are expensive — but always does `O(n²)` comparisons, even on sorted input.",
        ),
        viz("sorting", { algo: "selection", title: "Selection sort" }),
        callout(
          "complexity",
          "Both are `O(n²)` time, `O(1)` space. Insertion is **stable** and adaptive; selection is **not stable** but minimises writes.",
        ),
        callout(
          "note",
          "Flip between all five sorts on the same array in the visualizer and compare the comparison/swap counters — their personalities are obvious.",
        ),
      ],
    ),
  ],
);
