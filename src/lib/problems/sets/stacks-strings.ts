import type { Problem } from "../types";

export const stackStringProblems: Problem[] = [
  {
    id: "valid-parentheses",
    title: "Valid Parentheses",
    topic: "stacks-queues",
    difficulty: "easy",
    summary: "Are the brackets balanced and correctly nested?",
    statement: `Given a string \`s\` containing only \`()\`, \`[]\` and \`{}\`, return \`True\` if
every bracket is **closed by the matching type** in the correct order, else
\`False\`.`,
    funcName: "is_valid",
    starter: `def is_valid(s):
    # Return True if the brackets are balanced and well-nested
    pass
`,
    examples: [
      { input: ["()"], expected: true },
      { input: ["()[]{}"], expected: true },
      { input: ["(]"], expected: false, explain: "'(' is closed by ']'." },
    ],
    tests: [
      { input: ["([)]"], expected: false },
      { input: ["{[]}"], expected: true },
      { input: ["("], expected: false },
      { input: [""], expected: true },
      { input: ["]"], expected: false },
    ],
    hints: [
      "A stack is the natural fit: push opening brackets, pop on closers.",
      "Map each closer to its opener; on a closer, the stack top must match.",
      "At the end, the stack must be empty.",
    ],
    solution: `def is_valid(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        else:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/stacks-queues/stack",
    tags: ["stack", "string"],
  },
  {
    id: "reverse-string",
    title: "Reverse String",
    topic: "stacks-queues",
    difficulty: "easy",
    summary: "Return the characters of a string in reverse order.",
    statement: `Given a string \`s\`, return it reversed. Try it with a two-pointer swap, a
loop that prepends, or Python slicing.`,
    funcName: "reverse_string",
    starter: `def reverse_string(s):
    # Return s reversed
    pass
`,
    examples: [
      { input: ["hello"], expected: "olleh" },
      { input: ["Algolume"], expected: "emuloglA" },
      { input: ["a"], expected: "a" },
    ],
    tests: [
      { input: [""], expected: "" },
      { input: ["ab"], expected: "ba" },
      { input: ["racecar"], expected: "racecar" },
      { input: ["12345"], expected: "54321" },
    ],
    hints: [
      "Python slicing s[::-1] reverses in one step.",
      "To do it manually, walk from the end and build a new string.",
    ],
    solution: `def reverse_string(s):
    return s[::-1]
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/stacks-queues/stack",
    tags: ["string", "two pointers"],
  },
  {
    id: "daily-temperatures",
    title: "Daily Temperatures",
    topic: "stacks-queues",
    difficulty: "medium",
    summary: "Days until a warmer temperature — a monotonic stack.",
    statement: `Given a list of daily \`temperatures\`, return a list where \`answer[i]\` is the
**number of days to wait** until a warmer temperature. If there is no future
warmer day, put \`0\`.`,
    funcName: "daily_temperatures",
    starter: `def daily_temperatures(temperatures):
    # answer[i] = days until a warmer temperature, else 0
    pass
`,
    examples: [
      { input: [[73, 74, 75, 71, 69, 72, 76, 73]], expected: [1, 1, 4, 2, 1, 1, 0, 0] },
      { input: [[30, 40, 50, 60]], expected: [1, 1, 1, 0] },
    ],
    tests: [
      { input: [[30, 60, 90]], expected: [1, 1, 0] },
      { input: [[90, 80, 70]], expected: [0, 0, 0] },
      { input: [[55, 55, 55]], expected: [0, 0, 0] },
      { input: [[1]], expected: [0] },
    ],
    hints: [
      "Keep a stack of indices whose warmer day you haven't found yet.",
      "For each new day, pop every stacked index that is colder than today and fill its gap.",
      "The gap is (current index - popped index).",
    ],
    solution: `def daily_temperatures(temperatures):
    answer = [0] * len(temperatures)
    stack = []  # indices of days awaiting a warmer one
    for i, t in enumerate(temperatures):
        while stack and temperatures[stack[-1]] < t:
            j = stack.pop()
            answer[j] = i - j
        stack.append(i)
    return answer
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/stacks-queues/stack",
    tags: ["monotonic stack"],
  },
  {
    id: "largest-rectangle-histogram",
    title: "Largest Rectangle in Histogram",
    topic: "stacks-queues",
    difficulty: "hard",
    summary: "Biggest axis-aligned rectangle fitting under a histogram.",
    statement: `Given bar \`heights\` of a histogram (each bar width \`1\`), return the area of
the **largest rectangle** that fits entirely inside it. A monotonic stack finds,
for every bar, how far left and right it can extend while staying the shortest —
in \`O(n)\`.`,
    funcName: "largest_rectangle",
    starter: `def largest_rectangle(heights):
    # Return the area of the largest rectangle under the histogram
    pass
`,
    examples: [
      { input: [[2, 1, 5, 6, 2, 3]], expected: 10, explain: "Bars 5 and 6 give 2 × 5 = 10." },
      { input: [[2, 4]], expected: 4 },
    ],
    tests: [
      { input: [[2]], expected: 2 },
      { input: [[0]], expected: 0 },
      { input: [[1, 1, 1, 1]], expected: 4 },
      { input: [[5, 4, 3, 2, 1]], expected: 9 },
      { input: [[]], expected: 0 },
    ],
    hints: [
      "Keep a stack of indices with increasing heights.",
      "When a shorter bar arrives, pop taller bars and compute their rectangle: height × width.",
      "Appending a sentinel height of 0 at the end flushes the stack cleanly.",
    ],
    solution: `def largest_rectangle(heights):
    stack = []  # indices, heights increasing
    best = 0
    for i, h in enumerate(heights + [0]):
        while stack and heights[stack[-1]] >= h:
            height = heights[stack.pop()]
            width = i if not stack else i - stack[-1] - 1
            best = max(best, height * width)
        stack.append(i)
    return best
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/stacks-queues/stack",
    tags: ["monotonic stack"],
  },
];
