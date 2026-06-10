import type { Problem } from "../types";

// Tree problems take a BST insertion order (a plain list of ints) and rebuild the
// tree inside the function, so everything stays JSON-serializable for the grader.

export const treeProblems: Problem[] = [
  {
    id: "bst-search-path",
    title: "BST Search Path",
    topic: "trees",
    difficulty: "easy",
    summary: "Trace the nodes visited while searching a BST.",
    statement: `Build a binary search tree by inserting \`values\` left-to-right (ignore
duplicates). Then search for \`target\` and return the **list of node values you
visit**, starting at the root, until you find \`target\` or fall off the tree.`,
    funcName: "bst_search_path",
    starter: `def bst_search_path(values, target):
    # Build a BST from values, then return the search path to target
    pass
`,
    examples: [
      { input: [[5, 3, 8, 2, 4, 7], 4], expected: [5, 3, 4], explain: "5 → go left to 3 → go right to 4." },
      { input: [[5, 3, 8, 2, 4, 7], 8], expected: [5, 8] },
      { input: [[5, 3, 8, 2, 4, 7], 6], expected: [5, 8, 7], explain: "6 isn't present; the walk ends at 7." },
    ],
    tests: [
      { input: [[5, 3, 8, 2, 4, 7], 5], expected: [5] },
      { input: [[5, 3, 8, 2, 4, 7], 1], expected: [5, 3, 2] },
      { input: [[10], 10], expected: [10] },
      { input: [[10], 99], expected: [10] },
    ],
    hints: [
      "Insert each value: go left when smaller, right when larger, until you find an empty spot.",
      "To search, start at the root and append each node's value as you pass through it.",
      "Move left if target < node, right if target > node; stop when equal or the child is empty.",
    ],
    solution: `def bst_search_path(values, target):
    class Node:
        def __init__(self, v):
            self.v, self.left, self.right = v, None, None

    root = None
    for v in values:
        if root is None:
            root = Node(v); continue
        cur = root
        while True:
            if v < cur.v:
                if cur.left is None: cur.left = Node(v); break
                cur = cur.left
            elif v > cur.v:
                if cur.right is None: cur.right = Node(v); break
                cur = cur.right
            else:
                break

    path = []
    cur = root
    while cur:
        path.append(cur.v)
        if target == cur.v:
            break
        cur = cur.left if target < cur.v else cur.right
    return path
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/trees/bst-operations",
    tags: ["bst", "tree"],
  },
  {
    id: "kth-smallest-bst",
    title: "Kth Smallest in a BST",
    topic: "trees",
    difficulty: "medium",
    summary: "An in-order walk of a BST yields sorted order.",
    statement: `Build a BST from the insertion list \`values\`, then return the **k-th smallest**
value (1-indexed). The key fact: an **in-order traversal** of a BST visits values
in ascending order, so the k-th visited node is the answer.`,
    funcName: "kth_smallest_bst",
    starter: `def kth_smallest_bst(values, k):
    # Build a BST, then return the k-th smallest value (k = 1 is the minimum)
    pass
`,
    examples: [
      { input: [[5, 3, 8, 2, 4, 7], 1], expected: 2, explain: "Sorted: 2,3,4,5,7,8 → 1st is 2." },
      { input: [[5, 3, 8, 2, 4, 7], 3], expected: 4 },
      { input: [[5, 3, 8, 2, 4, 7], 6], expected: 8 },
    ],
    tests: [
      { input: [[3, 1, 4, 2], 2], expected: 2 },
      { input: [[10, 5, 15], 2], expected: 10 },
      { input: [[1, 2, 3, 4, 5], 5], expected: 5 },
      { input: [[5, 4, 3, 2, 1], 1], expected: 1 },
    ],
    hints: [
      "Insert the values to build the BST.",
      "In-order traversal (left, node, right) emits the values sorted.",
      "Collect the in-order list and return index k - 1.",
    ],
    solution: `def kth_smallest_bst(values, k):
    class Node:
        def __init__(self, v):
            self.v, self.left, self.right = v, None, None

    root = None
    for v in values:
        if root is None:
            root = Node(v); continue
        cur = root
        while True:
            if v < cur.v:
                if cur.left is None: cur.left = Node(v); break
                cur = cur.left
            elif v > cur.v:
                if cur.right is None: cur.right = Node(v); break
                cur = cur.right
            else:
                break

    out = []
    def inorder(n):
        if not n: return
        inorder(n.left); out.append(n.v); inorder(n.right)
    inorder(root)
    return out[k - 1]
`,
    complexity: { time: "O(n)", space: "O(n)" },
    lesson: "/learn/trees/bst-operations",
    tags: ["bst", "inorder"],
  },
  {
    id: "lca-bst",
    title: "Lowest Common Ancestor in a BST",
    topic: "trees",
    difficulty: "hard",
    summary: "Use the BST ordering to find the split point of two values.",
    statement: `Build a BST from \`values\`, then return the value of the **lowest common
ancestor** (LCA) of \`a\` and \`b\` (both guaranteed present). Use the BST property:
the LCA is the first node where \`a\` and \`b\` stop going the **same** direction.`,
    funcName: "lca_bst",
    starter: `def lca_bst(values, a, b):
    # Build a BST, then return the value of the LCA of a and b
    pass
`,
    examples: [
      { input: [[6, 2, 8, 0, 4, 7, 9, 3, 5], 2, 8], expected: 6, explain: "2 goes left, 8 goes right → split at the root." },
      { input: [[6, 2, 8, 0, 4, 7, 9, 3, 5], 2, 4], expected: 2, explain: "4 is in 2's right subtree, so 2 is the ancestor." },
      { input: [[6, 2, 8, 0, 4, 7, 9, 3, 5], 3, 5], expected: 4 },
    ],
    tests: [
      { input: [[6, 2, 8, 0, 4, 7, 9, 3, 5], 7, 9], expected: 8 },
      { input: [[5, 3, 8], 3, 8], expected: 5 },
      { input: [[5, 3, 8, 2, 4], 2, 4], expected: 3 },
      { input: [[10, 5, 15, 3, 7], 3, 7], expected: 5 },
    ],
    hints: [
      "Walk down from the root using the BST property.",
      "If both a and b are less than the node, the LCA is to the left; if both greater, to the right.",
      "The moment they fall on different sides (or one equals the node), that node is the LCA.",
    ],
    solution: `def lca_bst(values, a, b):
    class Node:
        def __init__(self, v):
            self.v, self.left, self.right = v, None, None

    root = None
    for v in values:
        if root is None:
            root = Node(v); continue
        cur = root
        while True:
            if v < cur.v:
                if cur.left is None: cur.left = Node(v); break
                cur = cur.left
            elif v > cur.v:
                if cur.right is None: cur.right = Node(v); break
                cur = cur.right
            else:
                break

    cur = root
    while cur:
        if a < cur.v and b < cur.v:
            cur = cur.left
        elif a > cur.v and b > cur.v:
            cur = cur.right
        else:
            return cur.v
    return -1
`,
    complexity: { time: "O(h)", space: "O(n)" },
    lesson: "/learn/trees/bst-operations",
    tags: ["bst", "lca"],
  },
];
