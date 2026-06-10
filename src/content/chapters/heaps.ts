import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const heaps = chapter(
  "heaps",
  "Heaps & priority queues",
  "A complete binary tree in an array that always hands you the min (or max) in O(log n).",
  "Triangle",
  [
    lesson(
      "heap-basics",
      "The heap structure",
      "Why a complete binary tree packs into an array, and the one invariant that makes it a heap.",
      9,
      [
        heading("Concept"),
        prose(
          "A **binary heap** is a **complete binary tree** — every level is full except possibly the last, which fills left to right — that satisfies the **heap property**. In a **min-heap**, every node is **≤ both its children**, so the smallest value is always at the root. (A max-heap is the mirror image.)",
        ),
        prose(
          "A heap is *not* sorted and it is *not* a binary search tree. It only guarantees the **root is the extreme value**; siblings and cousins are unordered. That weaker promise is exactly what lets it stay cheap to maintain.",
        ),
        heading("The array trick"),
        prose(
          "Because the tree is *complete*, we never need pointers — we pack it into an array by reading level by level. For the node at index `i`:",
        ),
        prose(
          "```\nparent(i) = (i - 1) // 2\nleft(i)   = 2*i + 1\nright(i)  = 2*i + 2\n```",
        ),
        derive(
          [
            step("level L holds 2^L nodes, starting at index 2^L − 1", "Completeness means each level is packed contiguously."),
            step("a node at index i has children at 2i+1, 2i+2", "Doubling moves you one level down."),
            step("⟹ no gaps, no pointers", "The array *is* the tree."),
          ],
          "O(n) space, pointer-free",
          "Why index arithmetic works",
        ),
        viz("heap", { title: "Min-heap: insert sifts up, extract-min sifts down" }),
        heading("Complexity target"),
        prose(
          "The tree has height `⌊log₂ n⌋`, so the operations that walk a root-to-leaf path — insert and extract — are `O(log n)`. Reading the min (the root) is `O(1)`. Building a heap from `n` items is `O(n)` with the bottom-up method (a classic surprise).",
        ),
        callout(
          "intuition",
          "Think of a heap as a tournament bracket where the champion (min) sits on top. You don't know who is second-best without playing a couple more matches — that's the O(log n) you pay on extract.",
        ),
      ],
    ),
    lesson(
      "heap-operations",
      "Sift up, sift down & the priority queue",
      "Insert, extract-min, heapsort, and where priority queues show up in graph algorithms.",
      11,
      [
        heading("Insert — sift up"),
        prose(
          "To **insert**, append the value at the end of the array (keeping completeness), then **sift up**: while it is smaller than its parent, swap them. It rises until its parent is ≤ it or it becomes the root.",
        ),
        prose(
          "```cpp\nvoid push(vector<int>& h, int x) {\n    h.push_back(x);\n    int i = h.size() - 1;\n    while (i > 0 && h[(i - 1) / 2] > h[i]) {\n        swap(h[i], h[(i - 1) / 2]);\n        i = (i - 1) / 2;\n    }\n}\n```",
        ),
        heading("Extract-min — sift down"),
        prose(
          "To **remove the minimum**, take the root, move the **last** element to the root (keeping completeness), then **sift down**: repeatedly swap it with its **smaller child** until both children are ≥ it.",
        ),
        prose(
          "```cpp\nint pop_min(vector<int>& h) {\n    int top = h[0];\n    h[0] = h.back(); h.pop_back();\n    int i = 0, n = h.size();\n    while (true) {\n        int c = i, l = 2*i+1, r = 2*i+2;\n        if (l < n && h[l] < h[c]) c = l;\n        if (r < n && h[r] < h[c]) c = r;\n        if (c == i) break;\n        swap(h[i], h[c]); i = c;\n    }\n    return top;\n}\n```",
        ),
        viz("heap", { title: "Watch sift-up on insert and sift-down on extract" }),
        heading("Heapsort"),
        derive(
          [
            step("build a heap from n items", "O(n) with the bottom-up sift-down."),
            step("extract-min n times", "Each extract is O(log n)."),
            step("n × O(log n)", "Dominates the build."),
          ],
          "O(n log n)",
          "Sorting by repeated extraction",
        ),
        heading("Priority queues in the wild"),
        prose(
          "A heap *is* a **priority queue** — `push` and `pop-min` in `O(log n)`. This is the engine behind **Dijkstra** and **Prim** (always expand the cheapest frontier item), **Huffman coding**, **k-way merge**, scheduling, and \"top-k\" problems. In C++ it's `std::priority_queue`; in Python, `heapq` (a min-heap of the underlying list).",
        ),
        callout(
          "warning",
          "`std::priority_queue` is a **max**-heap by default. For a min-heap use `priority_queue<int, vector<int>, greater<int>>`. Python's `heapq` is a **min**-heap; negate values for max-heap behaviour.",
        ),
        problem("last-stone-weight"),
        problem("k-smallest"),
        problem("merge-k-sorted"),
      ],
    ),
  ],
);
