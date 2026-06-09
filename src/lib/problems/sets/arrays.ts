import type { Problem } from "../types";

export const arrayProblems: Problem[] = [
  {
    id: "two-sum",
    title: "Two Sum",
    topic: "arrays",
    difficulty: "easy",
    summary: "Find the two indices whose values add up to a target.",
    statement: `Given an array of integers \`nums\` and an integer \`target\`, return the
**indices of the two numbers** that add up to \`target\`.

You may assume that each input has **exactly one** solution, and you may not use
the same element twice. Return the indices in increasing order.`,
    funcName: "two_sum",
    starter: `def two_sum(nums, target):
    # Return [i, j] with i < j and nums[i] + nums[j] == target
    pass
`,
    examples: [
      { input: [[2, 7, 11, 15], 9], expected: [0, 1], explain: "nums[0] + nums[1] = 2 + 7 = 9." },
      { input: [[3, 2, 4], 6], expected: [1, 2], explain: "nums[1] + nums[2] = 2 + 4 = 6." },
      { input: [[3, 3], 6], expected: [0, 1] },
    ],
    tests: [
      { input: [[1, 2, 3, 4, 5], 9], expected: [3, 4] },
      { input: [[0, 4, 3, 0], 0], expected: [0, 3] },
      { input: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
      { input: [[5, 75, 25], 100], expected: [1, 2] },
    ],
    hints: [
      "The brute force is two nested loops — O(n²). Can a hash map remember what you've seen?",
      "For each value x, you need target - x. Store each value's index in a dict as you scan.",
      "Before storing nums[i], check if (target - nums[i]) is already a key.",
    ],
    solution: `def two_sum(nums, target):
    seen = {}
    for i, x in enumerate(nums):
        need = target - x
        if need in seen:
            return [seen[need], i]
        seen[x] = i
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/hashing/two-sum",
    tags: ["hash map", "array"],
  },
  {
    id: "running-sum",
    title: "Running Sum",
    topic: "arrays",
    difficulty: "easy",
    summary: "Build the array of prefix sums.",
    statement: `Given an array \`nums\`, return its **running sum**, where
\`result[i] = nums[0] + nums[1] + ... + nums[i]\`.`,
    funcName: "running_sum",
    starter: `def running_sum(nums):
    # Return the list of prefix sums
    pass
`,
    examples: [
      { input: [[1, 2, 3, 4]], expected: [1, 3, 6, 10], explain: "1, 1+2, 1+2+3, 1+2+3+4." },
      { input: [[1, 1, 1, 1, 1]], expected: [1, 2, 3, 4, 5] },
    ],
    tests: [
      { input: [[3, 1, 2, 10, 1]], expected: [3, 4, 6, 16, 17] },
      { input: [[1]], expected: [1] },
      { input: [[-1, 2, -3]], expected: [-1, 1, -2] },
      { input: [[0, 0, 0]], expected: [0, 0, 0] },
    ],
    hints: [
      "Keep a running total and append it at each step.",
      "result[i] = result[i-1] + nums[i] for i > 0.",
    ],
    solution: `def running_sum(nums):
    out = []
    total = 0
    for x in nums:
        total += x
        out.append(total)
    return out
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/arrays/array-basics",
    tags: ["prefix sum", "array"],
  },
  {
    id: "max-subarray",
    title: "Maximum Subarray",
    topic: "arrays",
    difficulty: "medium",
    summary: "Largest sum of any contiguous subarray (Kadane's algorithm).",
    statement: `Given an integer array \`nums\`, find the contiguous subarray (containing at
least one number) with the **largest sum** and return that sum.`,
    funcName: "max_subarray",
    starter: `def max_subarray(nums):
    # Return the maximum sum over all contiguous subarrays
    pass
`,
    examples: [
      { input: [[-2, 1, -3, 4, -1, 2, 1, -5, 4]], expected: 6, explain: "[4, -1, 2, 1] sums to 6." },
      { input: [[1]], expected: 1 },
      { input: [[5, 4, -1, 7, 8]], expected: 23 },
    ],
    tests: [
      { input: [[-1]], expected: -1 },
      { input: [[-2, -1]], expected: -1 },
      { input: [[8, -19, 5, -4, 20]], expected: 21 },
      { input: [[-3, -2, -3, -1]], expected: -1 },
    ],
    hints: [
      "At each index, either extend the previous subarray or start fresh at the current element.",
      "best_ending_here = max(x, best_ending_here + x). Track the global max of that.",
      "Initialise both running and global best to nums[0], then scan from index 1.",
    ],
    solution: `def max_subarray(nums):
    best = cur = nums[0]
    for x in nums[1:]:
        cur = max(x, cur + x)
        best = max(best, cur)
    return best
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/arrays/array-basics",
    tags: ["dynamic programming", "kadane"],
  },
  {
    id: "move-zeroes",
    title: "Move Zeroes",
    topic: "arrays",
    difficulty: "easy",
    summary: "Push all zeroes to the end, keeping the order of the rest.",
    statement: `Given an array \`nums\`, return a new array with all \`0\`s moved to the **end**
while keeping the relative order of the non-zero elements.`,
    funcName: "move_zeroes",
    starter: `def move_zeroes(nums):
    # Return the array with zeroes pushed to the end (order preserved)
    pass
`,
    examples: [
      { input: [[0, 1, 0, 3, 12]], expected: [1, 3, 12, 0, 0], explain: "Non-zero order kept; two zeroes trail." },
      { input: [[0]], expected: [0] },
    ],
    tests: [
      { input: [[1, 2, 3]], expected: [1, 2, 3] },
      { input: [[0, 0, 1]], expected: [1, 0, 0] },
      { input: [[4, 0, 5, 0, 0, 6]], expected: [4, 5, 6, 0, 0, 0] },
      { input: [[1, 0]], expected: [1, 0] },
    ],
    hints: [
      "Collect the non-zero values first, then pad with zeroes.",
      "len(nums) - count_of_non_zeroes tells you how many zeroes to append.",
    ],
    solution: `def move_zeroes(nums):
    nonzero = [x for x in nums if x != 0]
    zeros = len(nums) - len(nonzero)
    return nonzero + [0] * zeros
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/arrays/array-basics",
    tags: ["two pointers", "array"],
  },
  {
    id: "product-except-self",
    title: "Product of Array Except Self",
    topic: "arrays",
    difficulty: "medium",
    summary: "result[i] = product of every element except nums[i] — no division.",
    statement: `Given an array \`nums\`, return an array \`result\` where \`result[i]\` is the
**product of all elements except** \`nums[i]\`. Solve it in \`O(n)\` **without
using division** (so a zero in the input doesn't break you).`,
    funcName: "product_except_self",
    starter: `def product_except_self(nums):
    # result[i] = product of all nums except nums[i], no division
    pass
`,
    examples: [
      { input: [[1, 2, 3, 4]], expected: [24, 12, 8, 6], explain: "24=2·3·4, 12=1·3·4, …" },
      { input: [[2, 3]], expected: [3, 2] },
    ],
    tests: [
      { input: [[-1, 1, 0, -3, 3]], expected: [0, 0, 9, 0, 0] },
      { input: [[5]], expected: [1] },
      { input: [[1, 1]], expected: [1, 1] },
      { input: [[2, 2, 2, 2]], expected: [8, 8, 8, 8] },
    ],
    hints: [
      "Make a prefix-product pass (everything to the left of i) into the result.",
      "Then a right-to-left pass multiplying in the suffix product (everything to the right).",
      "Carry a single running 'right' value so you stay at O(1) extra space.",
    ],
    solution: `def product_except_self(nums):
    n = len(nums)
    res = [1] * n
    left = 1
    for i in range(n):
        res[i] = left
        left *= nums[i]
    right = 1
    for i in range(n - 1, -1, -1):
        res[i] *= right
        right *= nums[i]
    return res
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/arrays/array-basics",
    tags: ["prefix product", "array"],
  },
  {
    id: "trapping-rain-water",
    title: "Trapping Rain Water",
    topic: "arrays",
    difficulty: "hard",
    summary: "How much water is trapped between the bars after it rains?",
    statement: `Given non-negative bar heights, compute how many units of water are trapped
between them after raining. Water above index \`i\` is bounded by the tallest bar
to its left and to its right: \`min(maxLeft, maxRight) - height[i]\`.`,
    funcName: "trap",
    starter: `def trap(height):
    # Return the total trapped water
    pass
`,
    examples: [
      { input: [[0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1]], expected: 6, explain: "The classic skyline traps 6 units." },
      { input: [[4, 2, 0, 3, 2, 5]], expected: 9 },
    ],
    tests: [
      { input: [[]], expected: 0 },
      { input: [[1]], expected: 0 },
      { input: [[3, 0, 2, 0, 4]], expected: 7 },
      { input: [[4, 2, 3]], expected: 1 },
      { input: [[5, 4, 3, 2, 1]], expected: 0 },
    ],
    hints: [
      "For each index, the water it holds is min(maxLeft, maxRight) - height[i] (clamped at 0).",
      "Two pointers from both ends: advance the side with the smaller running max.",
      "Whichever max is smaller bounds the water, so add (thatMax - height) as you move in.",
    ],
    solution: `def trap(height):
    if not height:
        return 0
    lo, hi = 0, len(height) - 1
    left_max, right_max = height[lo], height[hi]
    total = 0
    while lo < hi:
        if left_max <= right_max:
            lo += 1
            left_max = max(left_max, height[lo])
            total += left_max - height[lo]
        else:
            hi -= 1
            right_max = max(right_max, height[hi])
            total += right_max - height[hi]
    return total
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/arrays/array-basics",
    tags: ["two pointers", "stack"],
  },
];
