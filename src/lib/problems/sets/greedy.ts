import type { Problem } from "../types";

export const greedyProblems: Problem[] = [
  {
    id: "activity-selection",
    title: "Activity Selection",
    topic: "greedy",
    difficulty: "easy",
    summary: "Max non-overlapping intervals — take earliest finish each time.",
    statement: `Given activities as \`[start, end]\` intervals, return the **maximum number**
you can attend if you can only do one at a time. The greedy rule: sort by **finish
time** and take each activity whose start is ≥ the last selected finish.`,
    funcName: "max_activities",
    starter: `def max_activities(intervals):
    # Max number of non-overlapping intervals
    pass
`,
    examples: [
      { input: [[[1, 3], [2, 5], [4, 7], [1, 8], [5, 9], [8, 10]]], expected: 3, explain: "[1,3], [4,7], [8,10]." },
      { input: [[[1, 2], [2, 3], [3, 4]]], expected: 3 },
    ],
    tests: [
      { input: [[[1, 4], [2, 3], [3, 5]]], expected: 2 },
      { input: [[]], expected: 0 },
      { input: [[[0, 10]]], expected: 1 },
      { input: [[[1, 3], [1, 3], [1, 3]]], expected: 1 },
    ],
    hints: [
      "Sort the intervals by their end time.",
      "Track the finish time of the last selected activity, starting at -infinity.",
      "Take an activity only if its start ≥ that last finish; then update the finish.",
    ],
    solution: `def max_activities(intervals):
    intervals = sorted(intervals, key=lambda x: x[1])
    count = 0
    last = float("-inf")
    for s, e in intervals:
        if s >= last:
            count += 1
            last = e
    return count
`,
    complexity: { time: "O(n log n)", space: "O(1)" },
    lesson: "/learn/greedy/greedy-intro",
    tags: ["greedy", "intervals"],
  },
  {
    id: "jump-game",
    title: "Jump Game",
    topic: "greedy",
    difficulty: "medium",
    summary: "Can you reach the last index? Track the furthest reachable point.",
    statement: `\`nums[i]\` is the **maximum** jump length from index \`i\`. Starting at index
0, return \`True\` if you can reach the last index. Greedily track the furthest
index reachable so far; if you ever stand beyond it, you're stuck.`,
    funcName: "can_jump",
    starter: `def can_jump(nums):
    # True if the last index is reachable from index 0
    pass
`,
    examples: [
      { input: [[2, 3, 1, 1, 4]], expected: true, explain: "0→1→4." },
      { input: [[3, 2, 1, 0, 4]], expected: false, explain: "You get stuck at index 3." },
    ],
    tests: [
      { input: [[0]], expected: true },
      { input: [[2, 0, 0]], expected: true },
      { input: [[1, 0, 1, 0]], expected: false },
      { input: [[5, 9, 3, 2, 1, 0, 2, 3, 3, 1, 0, 0]], expected: true },
    ],
    hints: [
      "Keep `reach` = the furthest index you can get to.",
      "If the current index i exceeds reach, return False — you can't even stand here.",
      "Otherwise reach = max(reach, i + nums[i]).",
    ],
    solution: `def can_jump(nums):
    reach = 0
    for i, x in enumerate(nums):
        if i > reach:
            return False
        reach = max(reach, i + x)
    return True
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/greedy/greedy-intro",
    tags: ["greedy", "array"],
  },
  {
    id: "min-arrows",
    title: "Minimum Arrows to Burst Balloons",
    topic: "greedy",
    difficulty: "hard",
    summary: "Fewest points that stab every interval — a greedy sweep.",
    statement: `Each balloon is an interval \`[start, end]\`; an arrow shot at \`x\` bursts every
balloon with \`start ≤ x ≤ end\`. Return the **minimum number of arrows** to burst
all balloons. Sort by end, shoot at the first end, and skip every balloon that
arrow already bursts.`,
    funcName: "min_arrows",
    starter: `def min_arrows(points):
    # Minimum number of arrows to burst all balloons (intervals)
    pass
`,
    examples: [
      { input: [[[10, 16], [2, 8], [1, 6], [7, 12]]], expected: 2, explain: "Arrows at 6 and 12." },
      { input: [[[1, 2], [3, 4], [5, 6], [7, 8]]], expected: 4 },
    ],
    tests: [
      { input: [[[1, 2], [2, 3], [3, 4], [4, 5]]], expected: 2 },
      { input: [[[1, 2]]], expected: 1 },
      { input: [[]], expected: 0 },
      { input: [[[1, 10], [2, 9], [3, 8], [4, 7]]], expected: 1 },
    ],
    hints: [
      "Sort balloons by their end coordinate.",
      "Shoot an arrow at the end of the first balloon; it bursts every balloon that starts ≤ that end.",
      "When a balloon starts after the current arrow position, you need a new arrow at its end.",
    ],
    solution: `def min_arrows(points):
    if not points:
        return 0
    points = sorted(points, key=lambda x: x[1])
    arrows = 1
    end = points[0][1]
    for s, e in points[1:]:
        if s > end:
            arrows += 1
            end = e
    return arrows
`,
    complexity: { time: "O(n log n)", space: "O(1)" },
    lesson: "/learn/greedy/greedy-classics",
    tags: ["greedy", "intervals"],
  },
  {
    id: "max-product-subarray",
    title: "Maximum Product Subarray",
    topic: "greedy",
    difficulty: "hard",
    summary: "Largest product of a contiguous subarray — track max AND min.",
    statement: `Given an integer array \`nums\`, return the largest **product** of any
contiguous subarray. The Kadane twist: a negative number flips big↔small, so carry
**both** the running max and running min; multiplying the min by a negative can
become the new max.`,
    funcName: "max_product_subarray",
    starter: `def max_product_subarray(nums):
    # Largest product over all contiguous subarrays
    pass
`,
    examples: [
      { input: [[2, 3, -2, 4]], expected: 6, explain: "[2,3] → 6." },
      { input: [[-2, 0, -1]], expected: 0 },
    ],
    tests: [
      { input: [[-2, 3, -4]], expected: 24 },
      { input: [[2, -5, -2, -4, 3]], expected: 24 },
      { input: [[-2]], expected: -2 },
      { input: [[-1, -1, -1]], expected: 1 },
    ],
    hints: [
      "Keep cur_max and cur_min of products ending at the current index.",
      "When nums[i] is negative, swap cur_max and cur_min before updating.",
      "cur_max = max(x, cur_max*x); cur_min = min(x, cur_min*x); track the global best.",
    ],
    solution: `def max_product_subarray(nums):
    best = cur_max = cur_min = nums[0]
    for x in nums[1:]:
        if x < 0:
            cur_max, cur_min = cur_min, cur_max
        cur_max = max(x, cur_max * x)
        cur_min = min(x, cur_min * x)
        best = max(best, cur_max)
    return best
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/greedy/kadane",
    tags: ["greedy", "kadane", "dp"],
  },
];
