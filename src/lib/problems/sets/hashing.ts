import type { Problem } from "../types";

export const hashingProblems: Problem[] = [
  {
    id: "contains-duplicate",
    title: "Contains Duplicate",
    topic: "hashing",
    difficulty: "easy",
    summary: "Does any value appear at least twice?",
    statement: `Given an integer array \`nums\`, return \`True\` if any value appears **at least
twice**, and \`False\` if every element is distinct.`,
    funcName: "contains_duplicate",
    starter: `def contains_duplicate(nums):
    # Return True if any value repeats, else False
    pass
`,
    examples: [
      { input: [[1, 2, 3, 1]], expected: true, explain: "1 appears twice." },
      { input: [[1, 2, 3, 4]], expected: false },
      { input: [[1, 1, 1, 3, 3, 4, 3, 2, 4, 2]], expected: true },
    ],
    tests: [
      { input: [[1]], expected: false },
      { input: [[]], expected: false },
      { input: [[0, 0]], expected: true },
      { input: [[7, 8, 9, 10]], expected: false },
    ],
    hints: [
      "A set tracks what you've already seen in O(1) per lookup.",
      "If len(set(nums)) < len(nums), there was a duplicate.",
    ],
    solution: `def contains_duplicate(nums):
    return len(set(nums)) < len(nums)
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/hashing/hash-tables",
    tags: ["hash set"],
  },
  {
    id: "valid-anagram",
    title: "Valid Anagram",
    topic: "hashing",
    difficulty: "easy",
    summary: "Is t a rearrangement of the letters of s?",
    statement: `Given two strings \`s\` and \`t\`, return \`True\` if \`t\` is an **anagram** of
\`s\` — i.e. it uses exactly the same letters with the same counts.`,
    funcName: "is_anagram",
    starter: `def is_anagram(s, t):
    # Return True if t is an anagram of s
    pass
`,
    examples: [
      { input: ["anagram", "nagaram"], expected: true },
      { input: ["rat", "car"], expected: false },
      { input: ["a", "a"], expected: true },
    ],
    tests: [
      { input: ["ab", "a"], expected: false },
      { input: ["", ""], expected: true },
      { input: ["listen", "silent"], expected: true },
      { input: ["aacc", "ccac"], expected: false },
    ],
    hints: [
      "Different lengths can never be anagrams.",
      "Compare letter frequency counts — collections.Counter makes this one line.",
    ],
    solution: `def is_anagram(s, t):
    from collections import Counter
    return Counter(s) == Counter(t)
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/hashing/hash-tables",
    tags: ["frequency count", "string"],
  },
  {
    id: "first-unique-char",
    title: "First Unique Character",
    topic: "hashing",
    difficulty: "easy",
    summary: "Index of the first non-repeating character.",
    statement: `Given a string \`s\`, return the **index of the first character that does not
repeat** anywhere in the string. If there is none, return \`-1\`.`,
    funcName: "first_uniq_char",
    starter: `def first_uniq_char(s):
    # Return the index of the first non-repeating char, or -1
    pass
`,
    examples: [
      { input: ["leetcode"], expected: 0, explain: "'l' never repeats." },
      { input: ["loveleetcode"], expected: 2, explain: "'v' at index 2 is the first unique." },
      { input: ["aabb"], expected: -1 },
    ],
    tests: [
      { input: ["z"], expected: 0 },
      { input: ["dddccdbba"], expected: 8 },
      { input: ["aabbccddee"], expected: -1 },
      { input: ["aabbc"], expected: 4 },
    ],
    hints: [
      "First count every character's frequency in one pass.",
      "Then scan left to right and return the first index whose count is 1.",
    ],
    solution: `def first_uniq_char(s):
    from collections import Counter
    counts = Counter(s)
    for i, ch in enumerate(s):
        if counts[ch] == 1:
            return i
    return -1
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/hashing/hash-tables",
    tags: ["frequency count", "string"],
  },
  {
    id: "top-k-frequent",
    title: "Top K Frequent Elements",
    topic: "hashing",
    difficulty: "medium",
    summary: "Return the k most frequent values (any order).",
    statement: `Given an integer array \`nums\` and an integer \`k\`, return the \`k\` **most
frequent** elements. The answer is unique for the given inputs; return them in
any order.`,
    funcName: "top_k_frequent",
    starter: `def top_k_frequent(nums, k):
    # Return the k most frequent values (any order)
    pass
`,
    examples: [
      { input: [[1, 1, 1, 2, 2, 3], 2], expected: [1, 2], explain: "1 appears 3×, 2 appears 2×." },
      { input: [[1], 1], expected: [1] },
    ],
    tests: [
      { input: [[4, 4, 4, 5, 5, 6], 2], expected: [4, 5] },
      { input: [[7, 7, 8, 8, 9], 2], expected: [7, 8] },
      { input: [[1, 2], 2], expected: [1, 2] },
      { input: [[5, 5, 5, 5], 1], expected: [5] },
    ],
    hints: [
      "Count frequencies with a dict (or collections.Counter).",
      "Sort the distinct values by frequency descending and take the first k.",
      "Counter(nums).most_common(k) does exactly this.",
    ],
    solution: `def top_k_frequent(nums, k):
    from collections import Counter
    return [val for val, _ in Counter(nums).most_common(k)]
`,
    compare: "set",
    complexity: { time: "O(n log n)", space: "O(n)" },
    lesson: "/learn/hashing/hash-tables",
    tags: ["frequency count", "heap"],
  },
  {
    id: "longest-consecutive",
    title: "Longest Consecutive Sequence",
    topic: "hashing",
    difficulty: "hard",
    summary: "Length of the longest run of consecutive integers — in O(n).",
    statement: `Given an unsorted array \`nums\`, return the length of the **longest run of
consecutive integers** (e.g. \`[100,4,200,1,3,2]\` → \`4\` for \`1,2,3,4\`).
Sorting would be \`O(n log n)\`; a hash set gets you to \`O(n)\`.`,
    funcName: "longest_consecutive",
    starter: `def longest_consecutive(nums):
    # Return the length of the longest consecutive integer run
    pass
`,
    examples: [
      { input: [[100, 4, 200, 1, 3, 2]], expected: 4, explain: "The run 1,2,3,4 has length 4." },
      { input: [[0, 3, 7, 2, 5, 8, 4, 6, 0, 1]], expected: 9 },
    ],
    tests: [
      { input: [[]], expected: 0 },
      { input: [[1, 2, 0, 1]], expected: 3 },
      { input: [[8, 1, 4, 7, 3, -1, 0, 5, 2, 6]], expected: 10 },
      { input: [[10]], expected: 1 },
    ],
    hints: [
      "Put everything in a set so membership is O(1).",
      "A number starts a run only if (number - 1) is NOT in the set — avoid recounting.",
      "From each run-start, walk +1, +2, … while they're in the set and track the longest.",
    ],
    solution: `def longest_consecutive(nums):
    seen = set(nums)
    best = 0
    for x in seen:
        if x - 1 not in seen:        # x is the start of a run
            length = 1
            while x + length in seen:
                length += 1
            best = max(best, length)
    return best
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/hashing/hash-tables",
    tags: ["hash set", "union find"],
  },
];
