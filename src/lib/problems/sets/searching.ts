import type { Problem } from "../types";

export const searchingProblems: Problem[] = [
  {
    id: "binary-search",
    title: "Binary Search",
    topic: "searching",
    difficulty: "easy",
    summary: "Find a target in a sorted array in O(log n).",
    statement: `Given a **sorted** ascending array \`nums\` and a \`target\`, return the index
of \`target\` if it exists, otherwise return \`-1\`. Aim for \`O(log n)\` time.`,
    funcName: "binary_search",
    starter: `def binary_search(nums, target):
    # Return the index of target, or -1 if absent
    pass
`,
    examples: [
      { input: [[-1, 0, 3, 5, 9, 12], 9], expected: 4, explain: "nums[4] == 9." },
      { input: [[-1, 0, 3, 5, 9, 12], 2], expected: -1, explain: "2 is not present." },
      { input: [[5], 5], expected: 0 },
    ],
    tests: [
      { input: [[5], -5], expected: -1 },
      { input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 10], expected: 9 },
      { input: [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1], expected: 0 },
      { input: [[2, 4, 6, 8], 5], expected: -1 },
    ],
    hints: [
      "Track a window [lo, hi]. Compare the middle element to the target.",
      "If nums[mid] < target, the answer is to the right (lo = mid + 1); else hi = mid - 1.",
      "Use mid = (lo + hi) // 2 and loop while lo <= hi.",
    ],
    solution: `def binary_search(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return -1
`,
    complexity: { time: "O(log n)", space: "O(1)" },
    lesson: "/learn/searching/binary-search",
    tags: ["binary search", "sorted"],
  },
  {
    id: "search-insert-position",
    title: "Search Insert Position",
    topic: "searching",
    difficulty: "easy",
    summary: "Where would the target go in a sorted array?",
    statement: `Given a sorted ascending array of **distinct** integers and a \`target\`,
return the index if it is found. If not, return the index where it **would be
inserted** to keep the array sorted.`,
    funcName: "search_insert",
    starter: `def search_insert(nums, target):
    # Return the index of target, or where it would be inserted
    pass
`,
    examples: [
      { input: [[1, 3, 5, 6], 5], expected: 2 },
      { input: [[1, 3, 5, 6], 2], expected: 1, explain: "2 would sit between 1 and 3." },
      { input: [[1, 3, 5, 6], 7], expected: 4, explain: "7 is larger than everything." },
    ],
    tests: [
      { input: [[1, 3, 5, 6], 0], expected: 0 },
      { input: [[1], 0], expected: 0 },
      { input: [[1, 3], 2], expected: 1 },
      { input: [[1, 3, 5, 6, 9, 12], 12], expected: 5 },
    ],
    hints: [
      "This is binary search, but instead of -1 you return where the search collapsed.",
      "When the loop ends, lo is exactly the insertion point.",
    ],
    solution: `def search_insert(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[mid] < target:
            lo = mid + 1
        else:
            hi = mid - 1
    return lo
`,
    complexity: { time: "O(log n)", space: "O(1)" },
    lesson: "/learn/searching/binary-search",
    tags: ["binary search", "lower bound"],
  },
  {
    id: "search-rotated",
    title: "Search in Rotated Sorted Array",
    topic: "searching",
    difficulty: "medium",
    summary: "Binary search in a sorted array that was rotated at an unknown pivot.",
    statement: `An ascending array of **distinct** integers was rotated at some unknown pivot
(e.g. \`[0,1,2,4,5,6,7]\` → \`[4,5,6,7,0,1,2]\`). Given \`nums\` and \`target\`,
return its index, or \`-1\`. Aim for \`O(log n)\` — at each step **one half is
still sorted**, and you can tell which.`,
    funcName: "search_rotated",
    starter: `def search_rotated(nums, target):
    # Return the index of target in the rotated sorted array, or -1
    pass
`,
    examples: [
      { input: [[4, 5, 6, 7, 0, 1, 2], 0], expected: 4 },
      { input: [[4, 5, 6, 7, 0, 1, 2], 3], expected: -1 },
      { input: [[5, 1, 3], 5], expected: 0 },
    ],
    tests: [
      { input: [[1], 0], expected: -1 },
      { input: [[1], 1], expected: 0 },
      { input: [[3, 1], 1], expected: 1 },
      { input: [[4, 5, 6, 7, 8, 1, 2, 3], 8], expected: 4 },
    ],
    hints: [
      "Compute mid. If nums[lo..mid] is sorted (nums[lo] <= nums[mid]), the left half is clean.",
      "If the target lies inside the sorted half's range, search there; otherwise search the other half.",
      "Mirror the logic when the right half is the sorted one.",
    ],
    solution: `def search_rotated(nums, target):
    lo, hi = 0, len(nums) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if nums[mid] == target:
            return mid
        if nums[lo] <= nums[mid]:
            if nums[lo] <= target < nums[mid]:
                hi = mid - 1
            else:
                lo = mid + 1
        else:
            if nums[mid] < target <= nums[hi]:
                lo = mid + 1
            else:
                hi = mid - 1
    return -1
`,
    complexity: { time: "O(log n)", space: "O(1)" },
    lesson: "/learn/searching/binary-search",
    tags: ["binary search", "rotated"],
  },
  {
    id: "median-two-sorted",
    title: "Median of Two Sorted Arrays",
    topic: "searching",
    difficulty: "hard",
    summary: "Find the median of two sorted arrays as a single value.",
    statement: `Given two sorted ascending arrays \`a\` and \`b\`, return the **median** of the
combined set of numbers as a float. If the total count is even, the median is the
average of the two middle values.

A clean \`O(m+n)\` merge earns the green check; the famous \`O(log(m+n))\`
binary-search-on-partition is the stretch goal.`,
    funcName: "find_median_sorted",
    starter: `def find_median_sorted(a, b):
    # Return the median of the merged sorted arrays (a float)
    pass
`,
    examples: [
      { input: [[1, 3], [2]], expected: 2, explain: "Merged [1,2,3] → median 2." },
      { input: [[1, 2], [3, 4]], expected: 2.5, explain: "Merged [1,2,3,4] → (2+3)/2." },
    ],
    tests: [
      { input: [[], [1]], expected: 1 },
      { input: [[2], []], expected: 2 },
      { input: [[1, 3, 5], [2, 4, 6]], expected: 3.5 },
      { input: [[0, 0], [0, 0]], expected: 0 },
    ],
    hints: [
      "Merge the two arrays into one sorted list with a two-pointer walk.",
      "If the length is odd, the middle element is the median; if even, average the two middle ones.",
    ],
    solution: `def find_median_sorted(a, b):
    merged = []
    i = j = 0
    while i < len(a) and j < len(b):
        if a[i] <= b[j]:
            merged.append(a[i]); i += 1
        else:
            merged.append(b[j]); j += 1
    merged.extend(a[i:])
    merged.extend(b[j:])
    n = len(merged)
    mid = n // 2
    if n % 2 == 1:
        return float(merged[mid])
    return (merged[mid - 1] + merged[mid]) / 2
`,
    compare: "approx",
    complexity: { time: "O(m + n)", space: "O(m + n)" },
    lesson: "/learn/searching/binary-search",
    tags: ["binary search", "merge"],
  },
];
