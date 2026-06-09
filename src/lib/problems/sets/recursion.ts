import type { Problem } from "../types";

export const recursionProblems: Problem[] = [
  {
    id: "factorial",
    title: "Factorial",
    topic: "recursion",
    difficulty: "easy",
    summary: "Compute n! with a base case and a recursive step.",
    statement: `Return \`n!\` = \`n × (n-1) × ... × 1\`, with \`0! = 1\`. You may write it
recursively or iteratively, but think about the base case.`,
    funcName: "factorial",
    starter: `def factorial(n):
    # Return n! (with 0! == 1)
    pass
`,
    examples: [
      { input: [0], expected: 1, explain: "The empty product is 1." },
      { input: [1], expected: 1 },
      { input: [5], expected: 120, explain: "5 × 4 × 3 × 2 × 1." },
    ],
    tests: [
      { input: [3], expected: 6 },
      { input: [6], expected: 720 },
      { input: [10], expected: 3628800 },
      { input: [8], expected: 40320 },
    ],
    hints: [
      "Base case: factorial(0) == 1.",
      "Recursive case: factorial(n) == n * factorial(n - 1).",
    ],
    solution: `def factorial(n):
    if n <= 1:
        return 1
    return n * factorial(n - 1)
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/recursion/recursion-basics",
    tags: ["recursion", "base case"],
  },
  {
    id: "fibonacci",
    title: "Fibonacci Number",
    topic: "recursion",
    difficulty: "easy",
    summary: "Return the n-th Fibonacci number (0-indexed).",
    statement: `The Fibonacci sequence starts \`F(0) = 0\`, \`F(1) = 1\`, and
\`F(n) = F(n-1) + F(n-2)\` for \`n ≥ 2\`. Return \`F(n)\`.

A naive recursion is \`O(2ⁿ)\` — prefer an iterative or memoised \`O(n)\` solution.`,
    funcName: "fib",
    starter: `def fib(n):
    # Return the n-th Fibonacci number, with fib(0) == 0
    pass
`,
    examples: [
      { input: [0], expected: 0 },
      { input: [1], expected: 1 },
      { input: [10], expected: 55 },
    ],
    tests: [
      { input: [2], expected: 1 },
      { input: [7], expected: 13 },
      { input: [15], expected: 610 },
      { input: [20], expected: 6765 },
    ],
    hints: [
      "Handle n == 0 and n == 1 directly.",
      "Carry two running values a, b and roll them forward n times to stay O(n).",
    ],
    solution: `def fib(n):
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/recursion/recursion-basics",
    tags: ["recursion", "dynamic programming"],
  },
  {
    id: "sum-digits",
    title: "Sum of Digits",
    topic: "recursion",
    difficulty: "easy",
    summary: "Add up the decimal digits of a non-negative integer.",
    statement: `Given a non-negative integer \`n\`, return the **sum of its decimal digits**.
Try expressing it recursively: the last digit plus the digit-sum of the rest.`,
    funcName: "sum_digits",
    starter: `def sum_digits(n):
    # Return the sum of the decimal digits of n
    pass
`,
    examples: [
      { input: [123], expected: 6, explain: "1 + 2 + 3." },
      { input: [0], expected: 0 },
      { input: [9], expected: 9 },
    ],
    tests: [
      { input: [100], expected: 1 },
      { input: [99999], expected: 45 },
      { input: [4], expected: 4 },
      { input: [12345], expected: 15 },
    ],
    hints: [
      "n % 10 is the last digit; n // 10 drops it.",
      "Base case: when n == 0, the sum is 0.",
    ],
    solution: `def sum_digits(n):
    if n == 0:
        return 0
    return n % 10 + sum_digits(n // 10)
`,
    complexity: { time: "O(log n)", space: "O(log n)" },
    lesson: "/learn/recursion/recursion-basics",
    tags: ["recursion", "math"],
  },
  {
    id: "generate-parentheses",
    title: "Generate Parentheses",
    topic: "recursion",
    difficulty: "medium",
    summary: "All well-formed combinations of n pairs of parentheses.",
    statement: `Given \`n\` pairs of parentheses, return **all combinations of well-formed
parentheses**. Any order is accepted.

This is classic **backtracking**: build the string one bracket at a time, keeping
it valid at every step.`,
    funcName: "generate_parenthesis",
    starter: `def generate_parenthesis(n):
    # Return a list of all valid strings of n pairs of parentheses
    pass
`,
    examples: [
      { input: [1], expected: ["()"] },
      { input: [2], expected: ["(())", "()()"] },
      { input: [3], expected: ["((()))", "(()())", "(())()", "()(())", "()()()"] },
    ],
    tests: [
      { input: [0], expected: [""] },
      { input: [1], expected: ["()"] },
    ],
    hints: [
      "Track how many '(' and ')' you've placed. You can add '(' while open < n.",
      "You can add ')' only while close < open — that keeps every prefix valid.",
      "When the string reaches length 2n, record it.",
    ],
    solution: `def generate_parenthesis(n):
    res = []
    def backtrack(s, open_count, close_count):
        if len(s) == 2 * n:
            res.append(s)
            return
        if open_count < n:
            backtrack(s + "(", open_count + 1, close_count)
        if close_count < open_count:
            backtrack(s + ")", open_count, close_count + 1)
    backtrack("", 0, 0)
    return res
`,
    compare: "unordered",
    complexity: { time: "O(4ⁿ / √n)", space: "O(n)" },
    lesson: "/learn/recursion/backtracking",
    tags: ["backtracking", "recursion"],
  },
  {
    id: "permutations",
    title: "Permutations",
    topic: "recursion",
    difficulty: "hard",
    summary: "Every ordering of a list of distinct integers.",
    statement: `Given a list of **distinct** integers \`nums\`, return **all possible
permutations** (in any order). Build each permutation by choosing an unused
element at every depth and undoing the choice on the way back up.`,
    funcName: "permute",
    starter: `def permute(nums):
    # Return a list of all permutations (each a list) of nums
    pass
`,
    examples: [
      { input: [[1, 2, 3]], expected: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] },
      { input: [[0, 1]], expected: [[0, 1], [1, 0]] },
      { input: [[1]], expected: [[1]] },
    ],
    tests: [
      { input: [[1, 2]], expected: [[1, 2], [2, 1]] },
      { input: [[0, 1, 2]], expected: [[0, 1, 2], [0, 2, 1], [1, 0, 2], [1, 2, 0], [2, 0, 1], [2, 1, 0]] },
    ],
    hints: [
      "At each depth, loop over the remaining (unused) numbers; append one, recurse, then pop it.",
      "When the current permutation has the same length as nums, record a copy of it.",
      "A 'used' boolean array (or removing from a working list) tracks what's still available.",
    ],
    solution: `def permute(nums):
    res = []
    def backtrack(path, remaining):
        if not remaining:
            res.append(path[:])
            return
        for i in range(len(remaining)):
            path.append(remaining[i])
            backtrack(path, remaining[:i] + remaining[i + 1:])
            path.pop()
    backtrack([], nums)
    return res
`,
    compare: "unordered",
    complexity: { time: "O(n · n!)", space: "O(n)" },
    lesson: "/learn/recursion/backtracking",
    tags: ["backtracking", "recursion"],
  },
];
