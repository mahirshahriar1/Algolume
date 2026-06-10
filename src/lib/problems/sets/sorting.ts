import type { Problem } from "../types";

export const sortingProblems: Problem[] = [
  {
    id: "merge-two-sorted",
    title: "Merge Two Sorted Arrays",
    topic: "sorting",
    difficulty: "easy",
    summary: "The merge step at the heart of merge sort.",
    statement: `Given two arrays \`a\` and \`b\`, each already sorted ascending, return a single
sorted array containing all of their elements. This is exactly the **merge** step
of merge sort — walk both with two pointers, always taking the smaller front.`,
    funcName: "merge_sorted",
    starter: `def merge_sorted(a, b):
    # Return one sorted array with all elements of a and b
    pass
`,
    examples: [
      { input: [[1, 3, 5], [2, 4, 6]], expected: [1, 2, 3, 4, 5, 6], explain: "Interleave by always taking the smaller head." },
      { input: [[], [1, 2]], expected: [1, 2] },
    ],
    tests: [
      { input: [[1, 2], []], expected: [1, 2] },
      { input: [[1, 1, 1], [1, 1]], expected: [1, 1, 1, 1, 1] },
      { input: [[5], [1, 2, 3]], expected: [1, 2, 3, 5] },
      { input: [[-3, 0], [-1, 2]], expected: [-3, -1, 0, 2] },
      { input: [[], []], expected: [] },
    ],
    hints: [
      "Keep one index per array; compare the two current fronts.",
      "Append the smaller front and advance only that pointer.",
      "When one array runs out, append the rest of the other.",
    ],
    solution: `def merge_sorted(a, b):
    out = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            out.append(a[i]); i += 1
        else:
            out.append(b[j]); j += 1
    out.extend(a[i:])
    out.extend(b[j:])
    return out
`,
    complexity: { time: "O(m + n)", space: "O(m + n)" },
    lesson: "/learn/sorting/merge-sort",
    tags: ["merge sort", "two pointers"],
  },
  {
    id: "kth-largest",
    title: "Kth Largest Element",
    topic: "sorting",
    difficulty: "medium",
    summary: "Find the k-th largest value (1-indexed) in an unsorted array.",
    statement: `Given an unsorted array \`nums\` and an integer \`k\`, return the **k-th largest**
element (1-indexed, by sorted order, so duplicates count). Sorting gives an easy
\`O(n log n)\`; a quickselect partition gets the average case to \`O(n)\`.`,
    funcName: "find_kth_largest",
    starter: `def find_kth_largest(nums, k):
    # Return the k-th largest element (k = 1 is the maximum)
    pass
`,
    examples: [
      { input: [[3, 2, 1, 5, 6, 4], 2], expected: 5, explain: "Sorted desc: 6,5,… → 2nd is 5." },
      { input: [[3, 2, 3, 1, 2, 4, 5, 5, 6], 4], expected: 4 },
      { input: [[1], 1], expected: 1 },
    ],
    tests: [
      { input: [[7, 7, 7], 2], expected: 7 },
      { input: [[1, 2], 2], expected: 1 },
      { input: [[5, 4, 3, 2, 1], 5], expected: 1 },
      { input: [[2, 1], 1], expected: 2 },
    ],
    hints: [
      "Sorting ascending puts the k-th largest at index len(nums) - k.",
      "For O(n) average time, use quickselect: partition around a pivot and recurse into the side that holds the target rank.",
      "A min-heap of size k also works: keep the k largest seen; its root is the answer.",
    ],
    solution: `def find_kth_largest(nums, k):
    return sorted(nums)[-k]
`,
    complexity: { time: "O(n log n)", space: "O(1)" },
    lesson: "/learn/sorting/quick-sort",
    tags: ["quickselect", "heap", "sorting"],
  },
  {
    id: "count-inversions",
    title: "Count Inversions",
    topic: "sorting",
    difficulty: "hard",
    summary: "How far is the array from sorted? Count out-of-order pairs in O(n log n).",
    statement: `An **inversion** is a pair of indices \`i < j\` with \`nums[i] > nums[j]\`. The
number of inversions measures how far an array is from sorted. Counting them in
\`O(n²)\` is easy; do it in \`O(n log n)\` by counting **during a merge sort** — when
an element from the right half is taken before elements remaining in the left
half, each of those left elements forms an inversion with it.`,
    funcName: "count_inversions",
    starter: `def count_inversions(nums):
    # Return the number of pairs i < j with nums[i] > nums[j]
    pass
`,
    examples: [
      { input: [[1, 2, 3]], expected: 0, explain: "Already sorted — no inversions." },
      { input: [[3, 2, 1]], expected: 3, explain: "(3,2), (3,1), (2,1)." },
      { input: [[1, 3, 2]], expected: 1 },
    ],
    tests: [
      { input: [[2, 4, 1, 3, 5]], expected: 3 },
      { input: [[5, 4, 3, 2, 1]], expected: 10 },
      { input: [[1]], expected: 0 },
      { input: [[]], expected: 0 },
      { input: [[1, 1, 1]], expected: 0 },
    ],
    hints: [
      "Brute force is two nested loops — correct but O(n²).",
      "Modify merge sort: while merging, when you take from the right half, every element still left in the left half is greater, so it's an inversion.",
      "Add (len(left) - i) to the count at that moment, where i is the left pointer.",
    ],
    solution: `def count_inversions(nums):
    def sort_count(arr):
        if len(arr) <= 1:
            return arr, 0
        mid = len(arr) // 2
        left, a = sort_count(arr[:mid])
        right, b = sort_count(arr[mid:])
        merged = []
        i = j = inv = 0
        while i < len(left) and j < len(right):
            if left[i] <= right[j]:
                merged.append(left[i]); i += 1
            else:
                merged.append(right[j]); j += 1
                inv += len(left) - i   # left[i:] are all > right[j]
        merged.extend(left[i:])
        merged.extend(right[j:])
        return merged, a + b + inv
    return sort_count(nums)[1]
`,
    complexity: { time: "O(n log n)", space: "O(n)" },
    lesson: "/learn/sorting/merge-sort",
    tags: ["merge sort", "divide and conquer"],
  },
];
