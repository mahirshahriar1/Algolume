import type { Problem } from "../types";

// Linked-list problems use a plain Python list of values as the "list", so the
// grader stays JSON-friendly while the logic mirrors real pointer work.

export const linkedListProblems: Problem[] = [
  {
    id: "reverse-linked-list",
    title: "Reverse a Linked List",
    topic: "linked-lists",
    difficulty: "easy",
    summary: "Flip the order of the nodes.",
    statement: `A linked list is given as a list of values \`vals\` in head-to-tail order.
Return the values **reversed**. With real nodes you'd rewire each \`next\` pointer
to the previous node as you walk; here, produce the reversed sequence.`,
    funcName: "reverse_list",
    starter: `def reverse_list(vals):
    # Return the values in reverse (head becomes tail)
    pass
`,
    examples: [
      { input: [[1, 2, 3]], expected: [3, 2, 1] },
      { input: [[1]], expected: [1] },
    ],
    tests: [
      { input: [[]], expected: [] },
      { input: [[1, 2, 3, 4, 5]], expected: [5, 4, 3, 2, 1] },
      { input: [[7, 7, 8]], expected: [8, 7, 7] },
    ],
    hints: [
      "Walk the list keeping a `prev` that trails behind the current node.",
      "For each node, point its `next` at `prev`, then advance both.",
      "In array form, that's simply building the result back-to-front.",
    ],
    solution: `def reverse_list(vals):
    out = []
    for x in vals:
        out.insert(0, x)   # mirrors prepending to a new list
    return out
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/linked-lists/linked-list-basics",
    tags: ["linked list", "pointers"],
  },
  {
    id: "remove-nth-from-end",
    title: "Remove Nth Node From End",
    topic: "linked-lists",
    difficulty: "medium",
    summary: "Delete the n-th node counting from the tail in one pass.",
    statement: `Given a linked list as \`vals\` (head to tail) and an integer \`n\`, remove the
**n-th node from the end** and return the remaining values. \`n\` is valid
(1 ≤ n ≤ length). The classic trick is two pointers spaced \`n\` apart.`,
    funcName: "remove_nth_from_end",
    starter: `def remove_nth_from_end(vals, n):
    # Remove the n-th node counting from the end; return the rest
    pass
`,
    examples: [
      { input: [[1, 2, 3, 4, 5], 2], expected: [1, 2, 3, 5], explain: "2nd from the end is 4." },
      { input: [[1], 1], expected: [] },
    ],
    tests: [
      { input: [[1, 2], 1], expected: [1] },
      { input: [[1, 2], 2], expected: [2] },
      { input: [[1, 2, 3], 3], expected: [2, 3] },
      { input: [[5, 4, 3, 2, 1], 5], expected: [4, 3, 2, 1] },
    ],
    hints: [
      "The index from the front is len(vals) - n.",
      "Two-pointer version: advance a `fast` pointer n steps first, then move both until fast hits the end — `slow` lands just before the target.",
    ],
    solution: `def remove_nth_from_end(vals, n):
    out = vals[:]
    del out[len(out) - n]
    return out
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/linked-lists/linked-list-basics",
    tags: ["linked list", "two pointers"],
  },
  {
    id: "add-two-numbers",
    title: "Add Two Numbers (Linked Lists)",
    topic: "linked-lists",
    difficulty: "hard",
    summary: "Add two numbers stored as digit lists, least-significant first.",
    statement: `Two non-negative integers are stored as linked lists of single digits in
**reverse order** (least-significant digit first). Given \`a\` and \`b\`, return their
sum in the same format. Walk both lists together carrying the overflow — exactly
like grade-school addition.`,
    funcName: "add_two_numbers",
    starter: `def add_two_numbers(a, b):
    # a, b are digit lists, least-significant first. Return the sum, same format.
    pass
`,
    examples: [
      { input: [[2, 4, 3], [5, 6, 4]], expected: [7, 0, 8], explain: "342 + 465 = 807." },
      { input: [[0], [0]], expected: [0] },
    ],
    tests: [
      { input: [[9, 9], [1]], expected: [0, 0, 1] },
      { input: [[9, 9, 9], [9, 9, 9]], expected: [8, 9, 9, 1] },
      { input: [[1], [9, 9, 9]], expected: [0, 0, 0, 1] },
    ],
    hints: [
      "Walk both lists in parallel; missing digits count as 0.",
      "Keep a carry: digit = (da + db + carry) % 10, carry = (da + db + carry) // 10.",
      "Don't forget a trailing carry after the last digits (e.g. 99 + 1 = 100).",
    ],
    solution: `def add_two_numbers(a, b):
    res = []
    carry = 0
    i = 0
    while i < len(a) or i < len(b) or carry:
        s = carry + (a[i] if i < len(a) else 0) + (b[i] if i < len(b) else 0)
        res.append(s % 10)
        carry = s // 10
        i += 1
    return res
`,
    complexity: { time: "O(max(m, n))", space: "O(max(m, n))" },
    lesson: "/learn/linked-lists/linked-list-basics",
    tags: ["linked list", "math"],
  },
];
