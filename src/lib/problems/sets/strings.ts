import type { Problem } from "../types";

// String problems live under the "arrays" topic (Arrays & strings chapter).

export const stringProblems: Problem[] = [
  {
    id: "valid-palindrome",
    title: "Valid Palindrome",
    topic: "arrays",
    difficulty: "easy",
    summary: "Ignore case and non-alphanumerics — is it a palindrome?",
    statement: `Given a string \`s\`, return \`True\` if it reads the same forwards and backwards
**considering only alphanumeric characters** and **ignoring case**.`,
    funcName: "is_palindrome",
    starter: `def is_palindrome(s):
    # True if s is a palindrome (alphanumeric only, case-insensitive)
    pass
`,
    examples: [
      { input: ["A man, a plan, a canal: Panama"], expected: true, explain: "Cleaned: 'amanaplanacanalpanama'." },
      { input: ["race a car"], expected: false },
    ],
    tests: [
      { input: [""], expected: true },
      { input: ["ab_a"], expected: true },
      { input: ["0P"], expected: false },
      { input: ["a."], expected: true },
    ],
    hints: [
      "Filter to alphanumeric characters and lowercase them.",
      "Compare the cleaned string to its reverse, or use two pointers from both ends.",
    ],
    solution: `def is_palindrome(s):
    t = [c.lower() for c in s if c.isalnum()]
    return t == t[::-1]
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/arrays/array-basics",
    tags: ["string", "two pointers"],
  },
  {
    id: "longest-substring-no-repeat",
    title: "Longest Substring Without Repeating",
    topic: "arrays",
    difficulty: "medium",
    summary: "Sliding window over a string with a last-seen map.",
    statement: `Given a string \`s\`, return the length of the **longest substring without
repeating characters**. Slide a window; when a character repeats inside it, jump
the window start past the previous occurrence.`,
    funcName: "length_of_longest_substring",
    starter: `def length_of_longest_substring(s):
    # Length of the longest substring with all-distinct characters
    pass
`,
    examples: [
      { input: ["abcabcbb"], expected: 3, explain: "'abc' has length 3." },
      { input: ["bbbbb"], expected: 1 },
      { input: ["pwwkew"], expected: 3, explain: "'wke' — note 'pwke' is not a substring." },
    ],
    tests: [
      { input: [""], expected: 0 },
      { input: ["au"], expected: 2 },
      { input: ["dvdf"], expected: 3 },
      { input: ["abba"], expected: 2 },
    ],
    hints: [
      "Track the last index where each character was seen.",
      "Keep a window start; on a repeat inside the window, move start to last_seen + 1.",
      "The answer is the max of (i - start + 1) over the scan.",
    ],
    solution: `def length_of_longest_substring(s):
    seen = {}
    start = 0
    best = 0
    for i, c in enumerate(s):
        if c in seen and seen[c] >= start:
            start = seen[c] + 1
        seen[c] = i
        best = max(best, i - start + 1)
    return best
`,
    complexity: { time: "O(n)", space: "O(min(n, alphabet))" },
    lesson: "/learn/arrays/sliding-window",
    tags: ["sliding window", "hash map", "string"],
  },
  {
    id: "group-anagrams",
    title: "Group Anagrams",
    topic: "arrays",
    difficulty: "hard",
    summary: "Bucket words by their sorted-letter signature.",
    statement: `Given a list of strings \`strs\`, **group the anagrams** together. Return a list
of groups; **sort each group ascending**, and the groups may be in any order. Two
words are anagrams iff their sorted characters match — use that as a dictionary
key.`,
    funcName: "group_anagrams",
    starter: `def group_anagrams(strs):
    # Group anagrams; sort each group ascending, any group order
    pass
`,
    examples: [
      {
        input: [["eat", "tea", "tan", "ate", "nat", "bat"]],
        expected: [["ate", "eat", "tea"], ["nat", "tan"], ["bat"]],
      },
      { input: [["a"]], expected: [["a"]] },
    ],
    tests: [
      { input: [[""]], expected: [[""]] },
      { input: [["abc", "bca", "cab", "xyz"]], expected: [["abc", "bca", "cab"], ["xyz"]] },
    ],
    hints: [
      "Anagrams share the same multiset of letters — sorting a word canonicalizes it.",
      "Use a dict keyed by ''.join(sorted(word)); append each word to its bucket.",
      "Return the buckets, each sorted ascending.",
    ],
    solution: `def group_anagrams(strs):
    groups = {}
    for w in strs:
        key = "".join(sorted(w))
        groups.setdefault(key, []).append(w)
    return [sorted(g) for g in groups.values()]
`,
    compare: "unordered",
    complexity: { time: "O(n·k log k)", space: "O(n·k)" },
    lesson: "/learn/hashing/hash-tables",
    tags: ["hash map", "string", "sorting"],
  },
];
