import type { Problem } from "../types";

// Traversal problems take a binary tree as a level-order array (None = missing
// child), and the starter hands the solver a TreeNode + build_tree helper so they
// can focus on the traversal itself.

const HELPER = `class TreeNode:
    def __init__(self, val):
        self.val = val
        self.left = None
        self.right = None

def build_tree(arr):
    # arr is level-order with None for a missing child
    if not arr or arr[0] is None:
        return None
    root = TreeNode(arr[0])
    queue, i, qi = [root], 1, 0
    while i < len(arr):
        node = queue[qi]; qi += 1
        if i < len(arr):
            if arr[i] is not None:
                node.left = TreeNode(arr[i]); queue.append(node.left)
            i += 1
        if i < len(arr):
            if arr[i] is not None:
                node.right = TreeNode(arr[i]); queue.append(node.right)
            i += 1
    return root
`;

export const traversalProblems: Problem[] = [
  {
    id: "inorder-traversal",
    title: "Inorder Traversal",
    topic: "traversals",
    difficulty: "easy",
    summary: "Visit left, node, right — return the value sequence.",
    statement: `The tree is given as a **level-order array** where \`None\` marks a missing child.
A \`build_tree(arr)\` helper (and \`TreeNode\`) is provided. Return the **in-order**
traversal: left subtree, then the node, then the right subtree.`,
    funcName: "inorder",
    starter: `${HELPER}
def inorder(arr):
    root = build_tree(arr)
    # TODO: return the in-order list of values
    pass
`,
    examples: [
      { input: [[1, null, 2, 3]], expected: [1, 3, 2], explain: "1 has only a right child (2), whose left child is 3." },
      { input: [[4, 2, 6, 1, 3, 5, 7]], expected: [1, 2, 3, 4, 5, 6, 7], explain: "A balanced BST → sorted output." },
    ],
    tests: [
      { input: [[]], expected: [] },
      { input: [[1]], expected: [1] },
      { input: [[3, 9, 20, null, null, 15, 7]], expected: [9, 3, 15, 20, 7] },
    ],
    hints: [
      "Recurse: visit the left child, append the current value, then the right child.",
      "The base case is an empty (None) node — just return.",
    ],
    solution: `${HELPER}
def inorder(arr):
    root = build_tree(arr)
    out = []
    def go(n):
        if not n:
            return
        go(n.left); out.append(n.val); go(n.right)
    go(root)
    return out
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/traversals/tree-traversals",
    tags: ["dfs", "inorder"],
  },
  {
    id: "level-order-traversal",
    title: "Level-Order Traversal",
    topic: "traversals",
    difficulty: "medium",
    summary: "Group node values by depth using a BFS queue.",
    statement: `Return the **level-order** traversal as a **list of levels** — each inner list
holds the node values at one depth, top to bottom, left to right. Use a queue
(breadth-first). The \`build_tree\` / \`TreeNode\` helper is provided.`,
    funcName: "level_order",
    starter: `${HELPER}
def level_order(arr):
    root = build_tree(arr)
    # TODO: return a list of levels (each a list of values)
    pass
`,
    examples: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [9, 20], [15, 7]] },
      { input: [[1]], expected: [[1]] },
    ],
    tests: [
      { input: [[]], expected: [] },
      { input: [[1, 2, 3, 4, null, null, 5]], expected: [[1], [2, 3], [4, 5]] },
    ],
    hints: [
      "Keep a list of nodes for the current level; collect their values into one inner list.",
      "Build the next level from all current nodes' non-empty children, then repeat.",
      "Stop when a level has no nodes.",
    ],
    solution: `${HELPER}
def level_order(arr):
    root = build_tree(arr)
    if not root:
        return []
    res, q = [], [root]
    while q:
        res.append([n.val for n in q])
        nxt = []
        for n in q:
            if n.left: nxt.append(n.left)
            if n.right: nxt.append(n.right)
        q = nxt
    return res
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/traversals/tree-traversals",
    tags: ["bfs", "level order"],
  },
  {
    id: "zigzag-traversal",
    title: "Zigzag Level-Order",
    topic: "traversals",
    difficulty: "hard",
    summary: "Level-order, but alternate left→right and right→left per level.",
    statement: `Return the level-order traversal, but **alternate direction** each level: the
first level left-to-right, the second right-to-left, and so on. The
\`build_tree\` / \`TreeNode\` helper is provided.`,
    funcName: "zigzag",
    starter: `${HELPER}
def zigzag(arr):
    root = build_tree(arr)
    # TODO: return levels, reversing every other one
    pass
`,
    examples: [
      { input: [[3, 9, 20, null, null, 15, 7]], expected: [[3], [20, 9], [15, 7]], explain: "Level 1 normal, level 2 reversed." },
      { input: [[1]], expected: [[1]] },
    ],
    tests: [
      { input: [[]], expected: [] },
      { input: [[1, 2, 3, 4, 5, 6, 7]], expected: [[1], [3, 2], [4, 5, 6, 7]] },
    ],
    hints: [
      "Do a normal BFS by level first.",
      "Track a left-to-right flag and flip it each level.",
      "When the flag is false, reverse that level's value list before adding it.",
    ],
    solution: `${HELPER}
def zigzag(arr):
    root = build_tree(arr)
    if not root:
        return []
    res, q, ltr = [], [root], True
    while q:
        level = [n.val for n in q]
        res.append(level if ltr else level[::-1])
        nxt = []
        for n in q:
            if n.left: nxt.append(n.left)
            if n.right: nxt.append(n.right)
        q, ltr = nxt, not ltr
    return res
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/traversals/tree-traversals",
    tags: ["bfs", "zigzag"],
  },
];
