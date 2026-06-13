import type { Problem } from "../types";

// Pattern-matching problems for the Strings chapter (topic "strings").

export const stringMatchingProblems: Problem[] = [
  {
    id: "str-str",
    title: "Find the Index of First Match",
    topic: "strings",
    difficulty: "easy",
    summary: "Return the first index where `needle` occurs in `haystack`.",
    statement: `Return the index of the **first occurrence** of \`needle\` in \`haystack\`, or
\`-1\` if it isn't present. If \`needle\` is the empty string, return \`0\`. (This is
the \`strStr\` / \`indexOf\` operation.)`,
    funcName: "str_str",
    starter: `def str_str(haystack, needle):
    # Index of the first occurrence of needle in haystack, or -1
    pass
`,
    examples: [
      { input: ["hello", "ll"], expected: 2 },
      { input: ["aaaaa", "bba"], expected: -1 },
      { input: ["", ""], expected: 0 },
    ],
    tests: [
      { input: ["a", ""], expected: 0 },
      { input: ["abc", "c"], expected: 2 },
      { input: ["mississippi", "issip"], expected: 4 },
    ],
    hints: [
      "Try each starting index i and check whether the next len(needle) characters match.",
      "The naive approach is O(n·m); KMP gets it to O(n+m).",
    ],
    solution: `def str_str(haystack, needle):
    if needle == "":
        return 0
    n, m = len(haystack), len(needle)
    for i in range(n - m + 1):
        if haystack[i:i + m] == needle:
            return i
    return -1
`,
    complexity: { time: "O(n·m)", space: "O(1)" },
    lesson: "/learn/strings/pattern-matching",
    tags: ["string", "pattern matching"],
  },
  {
    id: "count-occurrences",
    title: "Count Pattern Occurrences",
    topic: "strings",
    difficulty: "medium",
    summary: "How many times does the pattern occur (overlaps allowed)?",
    statement: `Return the number of times \`pattern\` occurs in \`text\`, **counting
overlapping** occurrences (e.g. \`"aa"\` occurs twice in \`"aaa"\`). Return \`0\` for
an empty pattern.`,
    funcName: "count_occurrences",
    starter: `def count_occurrences(text, pattern):
    # Count overlapping occurrences of pattern in text
    pass
`,
    examples: [
      { input: ["aaa", "aa"], expected: 2, explain: "Positions 0 and 1 overlap." },
      { input: ["abababab", "abab"], expected: 3 },
    ],
    tests: [
      { input: ["abc", "d"], expected: 0 },
      { input: ["aaa", "a"], expected: 3 },
      { input: ["mississippi", "iss"], expected: 2 },
      { input: ["", ""], expected: 0 },
    ],
    hints: [
      "Search starting from each found index + 1 (not + len) so overlaps count.",
      "str.find(pattern, start) makes the scan easy.",
    ],
    solution: `def count_occurrences(text, pattern):
    if pattern == "":
        return 0
    count = 0
    i = 0
    while True:
        j = text.find(pattern, i)
        if j == -1:
            break
        count += 1
        i = j + 1
    return count
`,
    complexity: { time: "O(n·m)", space: "O(1)" },
    lesson: "/learn/strings/pattern-matching",
    tags: ["string", "pattern matching"],
  },
  {
    id: "longest-happy-prefix",
    title: "Longest Happy Prefix",
    topic: "strings",
    difficulty: "hard",
    summary: "Longest proper prefix that is also a suffix — the KMP failure value.",
    statement: `A **happy prefix** is a non-empty prefix that is also a suffix (but not the
whole string). Return the **longest** happy prefix of \`s\` (or \`""\` if none).
This is exactly the last value of the **KMP failure function**.`,
    funcName: "longest_happy_prefix",
    starter: `def longest_happy_prefix(s):
    # Longest proper prefix of s that is also a suffix
    pass
`,
    examples: [
      { input: ["level"], expected: "l", explain: "'l' is a prefix and a suffix." },
      { input: ["ababab"], expected: "abab" },
      { input: ["abcdef"], expected: "" },
    ],
    tests: [
      { input: ["aaaa"], expected: "aaa" },
      { input: ["a"], expected: "" },
      { input: ["aabaaab"], expected: "aab" },
    ],
    hints: [
      "Compute the prefix-function (failure function) array π.",
      "π[i] = length of the longest proper prefix of s[:i+1] that is also a suffix.",
      "The answer is s[:π[-1]].",
    ],
    solution: `def longest_happy_prefix(s):
    n = len(s)
    if n == 0:
        return ""
    pi = [0] * n
    k = 0
    for i in range(1, n):
        while k > 0 and s[i] != s[k]:
            k = pi[k - 1]
        if s[i] == s[k]:
            k += 1
        pi[i] = k
    return s[:pi[-1]]
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/strings/kmp",
    tags: ["string", "kmp", "prefix function"],
  },
];
