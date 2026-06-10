import type { Problem } from "../types";

export const bitProblems: Problem[] = [
  {
    id: "single-number",
    title: "Single Number",
    topic: "bit-manipulation",
    difficulty: "easy",
    summary: "Every value appears twice except one — find it with XOR.",
    statement: `Every element in \`nums\` appears **exactly twice** except for one, which
appears once. Return that single element using **O(1) extra space**. The trick:
\`x ^ x = 0\` and \`x ^ 0 = x\`, so XOR-ing everything cancels the pairs.`,
    funcName: "single_number",
    starter: `def single_number(nums):
    # Return the element that appears once (XOR trick)
    pass
`,
    examples: [
      { input: [[2, 2, 1]], expected: 1 },
      { input: [[4, 1, 2, 1, 2]], expected: 4 },
    ],
    tests: [
      { input: [[1]], expected: 1 },
      { input: [[7, 3, 3, 7, 9]], expected: 9 },
      { input: [[0, 1, 0]], expected: 1 },
    ],
    hints: [
      "XOR is associative/commutative and a^a = 0.",
      "Fold the whole array with ^; the pairs vanish, leaving the unique value.",
    ],
    solution: `def single_number(nums):
    result = 0
    for x in nums:
        result ^= x
    return result
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/bit-manipulation/bit-basics",
    tags: ["bit manipulation", "xor"],
  },
  {
    id: "counting-bits",
    title: "Counting Bits",
    topic: "bit-manipulation",
    difficulty: "medium",
    summary: "Popcount for every number 0..n in O(n) using a bit DP.",
    statement: `Return an array \`ans\` of length \`n + 1\` where \`ans[i]\` is the number of set
bits (\`1\`s) in \`i\`. The DP insight: \`i\` has the same bits as \`i >> 1\` plus the
lowest bit, so \`ans[i] = ans[i >> 1] + (i & 1)\`.`,
    funcName: "counting_bits",
    starter: `def counting_bits(n):
    # Return [popcount(0), popcount(1), ..., popcount(n)]
    pass
`,
    examples: [
      { input: [2], expected: [0, 1, 1], explain: "0→0, 1→1, 2(10)→1." },
      { input: [5], expected: [0, 1, 1, 2, 1, 2] },
    ],
    tests: [
      { input: [0], expected: [0] },
      { input: [1], expected: [0, 1] },
      { input: [8], expected: [0, 1, 1, 2, 1, 2, 2, 3, 1] },
    ],
    hints: [
      "Dropping the lowest bit (i >> 1) gives a smaller, already-solved subproblem.",
      "ans[i] = ans[i >> 1] + (i & 1).",
    ],
    solution: `def counting_bits(n):
    dp = [0] * (n + 1)
    for i in range(1, n + 1):
        dp[i] = dp[i >> 1] + (i & 1)
    return dp
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/bit-manipulation/bit-basics",
    tags: ["bit manipulation", "dp"],
  },
];
