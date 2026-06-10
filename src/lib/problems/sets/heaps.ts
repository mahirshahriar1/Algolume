import type { Problem } from "../types";

export const heapProblems: Problem[] = [
  {
    id: "last-stone-weight",
    title: "Last Stone Weight",
    topic: "heaps",
    difficulty: "easy",
    summary: "Repeatedly smash the two heaviest stones — a max-heap.",
    statement: `Each turn, take the **two heaviest** stones \`x ≥ y\` and smash them: if
\`x == y\` both are destroyed, otherwise a stone of weight \`x - y\` remains. Return
the weight of the last stone (or \`0\` if none remain). A max-heap gives the two
heaviest in \`O(log n)\` each turn.`,
    funcName: "last_stone_weight",
    starter: `def last_stone_weight(stones):
    # Smash the two heaviest each turn; return the last stone's weight (or 0)
    pass
`,
    examples: [
      { input: [[2, 7, 4, 1, 8, 1]], expected: 1, explain: "8,7→1; then 4,2→2; 2,1,1,1→ … → 1." },
      { input: [[1]], expected: 1 },
    ],
    tests: [
      { input: [[2, 2]], expected: 0 },
      { input: [[3, 7, 2]], expected: 2 },
      { input: [[10, 4, 2, 10]], expected: 2 },
      { input: [[]], expected: 0 },
    ],
    hints: [
      "Python's heapq is a min-heap; negate the weights to simulate a max-heap.",
      "Pop the two largest; if they differ, push back their difference.",
      "Repeat until ≤ 1 stone remains.",
    ],
    solution: `def last_stone_weight(stones):
    import heapq
    h = [-s for s in stones]
    heapq.heapify(h)
    while len(h) > 1:
        x = -heapq.heappop(h)
        y = -heapq.heappop(h)
        if x != y:
            heapq.heappush(h, -(x - y))
    return -h[0] if h else 0
`,
    complexity: { time: "O(n log n)", space: "O(n)" },
    lesson: "/learn/heaps/heap-operations",
    tags: ["heap", "priority queue"],
  },
  {
    id: "k-smallest",
    title: "K Smallest Elements",
    topic: "heaps",
    difficulty: "medium",
    summary: "Return the k smallest values, sorted ascending.",
    statement: `Given an array \`nums\` and an integer \`k\`, return the **k smallest** elements
in ascending order. A heap of size k (or a partial selection) avoids fully
sorting when k is small.`,
    funcName: "k_smallest",
    starter: `def k_smallest(nums, k):
    # Return the k smallest values, ascending
    pass
`,
    examples: [
      { input: [[3, 1, 2, 5, 4], 2], expected: [1, 2] },
      { input: [[5], 1], expected: [5] },
    ],
    tests: [
      { input: [[4, 4, 4], 2], expected: [4, 4] },
      { input: [[9, 8, 7, 6], 3], expected: [6, 7, 8] },
      { input: [[1, 2, 3, 4, 5], 5], expected: [1, 2, 3, 4, 5] },
    ],
    hints: [
      "heapq.nsmallest(k, nums) returns the k smallest (any order).",
      "Sort the result so it's ascending.",
      "A max-heap of size k that drops its largest also works in O(n log k).",
    ],
    solution: `def k_smallest(nums, k):
    import heapq
    return sorted(heapq.nsmallest(k, nums))
`,
    complexity: { time: "O(n log k)", space: "O(k)" },
    lesson: "/learn/heaps/heap-operations",
    tags: ["heap", "selection"],
  },
  {
    id: "merge-k-sorted",
    title: "Merge K Sorted Lists",
    topic: "heaps",
    difficulty: "hard",
    summary: "Merge many sorted lists with a min-heap of their heads.",
    statement: `Given a list of sorted lists, merge them into **one sorted list**. Push the
head of each list into a min-heap keyed by value; repeatedly pop the smallest and
push the next element from the list it came from — \`O(N log k)\` for \`k\` lists and
\`N\` total elements.`,
    funcName: "merge_k_sorted",
    starter: `def merge_k_sorted(lists):
    # Merge a list of sorted lists into one sorted list
    pass
`,
    examples: [
      { input: [[[1, 4, 5], [1, 3, 4], [2, 6]]], expected: [1, 1, 2, 3, 4, 4, 5, 6] },
      { input: [[[1], [0]]], expected: [0, 1] },
    ],
    tests: [
      { input: [[]], expected: [] },
      { input: [[[]]], expected: [] },
      { input: [[[1, 2, 3]]], expected: [1, 2, 3] },
      { input: [[[5, 5], [5], [1, 5]]], expected: [1, 5, 5, 5, 5] },
    ],
    hints: [
      "Seed the heap with (firstValue, listIndex, 0) for every non-empty list.",
      "Pop the smallest; append it; push the next element from that same list, if any.",
      "Include the list index in the tuple so equal values don't try to compare lists.",
    ],
    solution: `def merge_k_sorted(lists):
    import heapq
    h = []
    for i, lst in enumerate(lists):
        if lst:
            heapq.heappush(h, (lst[0], i, 0))
    out = []
    while h:
        val, i, j = heapq.heappop(h)
        out.append(val)
        if j + 1 < len(lists[i]):
            heapq.heappush(h, (lists[i][j + 1], i, j + 1))
    return out
`,
    complexity: { time: "O(N log k)", space: "O(k)" },
    lesson: "/learn/heaps/heap-operations",
    tags: ["heap", "merge"],
  },
];
