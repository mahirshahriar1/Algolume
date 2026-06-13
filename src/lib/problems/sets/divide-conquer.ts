import type { Problem } from "../types";

export const divideConquerProblems: Problem[] = [
  {
    id: "my-pow",
    title: "Fast Power (xⁿ)",
    topic: "divide-and-conquer",
    difficulty: "easy",
    summary: "Compute xⁿ in O(log n) by squaring.",
    statement: `Implement \`pow(x, n)\` — \`x\` raised to the integer power \`n\` (which may be
negative). Use **exponentiation by squaring**: \`xⁿ = (x²)^(n/2)\`, halving the
exponent each step for \`O(log n)\` multiplications.`,
    funcName: "my_pow",
    starter: `def my_pow(x, n):
    # Return x ** n in O(log n)
    pass
`,
    examples: [
      { input: [2.0, 10], expected: 1024, explain: "2^10." },
      { input: [2.0, -2], expected: 0.25, explain: "Negative exponent → reciprocal." },
    ],
    tests: [
      { input: [2.1, 3], expected: 9.261 },
      { input: [1.0, 0], expected: 1 },
      { input: [0.5, 2], expected: 0.25 },
      { input: [3.0, 5], expected: 243 },
    ],
    hints: [
      "For negative n, replace x with 1/x and negate n.",
      "Square x and halve n; multiply into the result whenever the current bit of n is 1.",
    ],
    solution: `def my_pow(x, n):
    if n < 0:
        x = 1 / x
        n = -n
    result = 1.0
    while n:
        if n & 1:
            result *= x
        x *= x
        n >>= 1
    return result
`,
    compare: "approx",
    complexity: { time: "O(log n)", space: "O(1)" },
    lesson: "/learn/divide-and-conquer/dc-method",
    tags: ["divide and conquer", "math"],
  },
  {
    id: "majority-element",
    title: "Majority Element",
    topic: "divide-and-conquer",
    difficulty: "medium",
    summary: "The element appearing more than n/2 times.",
    statement: `Given \`nums\` where one element appears **more than ⌊n/2⌋ times**, return it.
There's a clean divide-and-conquer solution (the majority of the whole is the
majority of one half), and an even simpler **Boyer–Moore voting** pass in O(1)
space.`,
    funcName: "majority_element",
    starter: `def majority_element(nums):
    # Return the element that appears more than n//2 times
    pass
`,
    examples: [
      { input: [[3, 2, 3]], expected: 3 },
      { input: [[2, 2, 1, 1, 1, 2, 2]], expected: 2 },
    ],
    tests: [
      { input: [[1]], expected: 1 },
      { input: [[6, 5, 5]], expected: 5 },
      { input: [[4, 4, 4, 2, 4, 2, 2]], expected: 4 },
    ],
    hints: [
      "Divide & conquer: find the majority of each half; the answer is whichever wins overall.",
      "Boyer–Moore: keep a candidate and a count; +1 when it matches, −1 otherwise, reset on 0.",
      "Because the majority occupies >n/2, it survives all the cancellation.",
    ],
    solution: `def majority_element(nums):
    count = 0
    candidate = None
    for x in nums:
        if count == 0:
            candidate = x
        count += 1 if x == candidate else -1
    return candidate
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/divide-and-conquer/dc-classics",
    tags: ["divide and conquer", "boyer-moore"],
  },
];
