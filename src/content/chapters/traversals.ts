import { callout, chapter, derive, heading, lesson, prose, step, viz } from "../builder";

export const traversals = chapter(
  "traversals",
  "Tree traversals",
  "The four ways to visit every node — and what each one is good for.",
  "ListTree",
  [
    lesson(
      "tree-traversals",
      "Tree traversals",
      "In-order, pre-order, post-order and level-order — see each visiting sequence light up.",
      15,
      [
        heading("Concept"),
        prose(
          "To **traverse** a tree is to visit every node exactly once in a deliberate order. The order matters because different problems need information at different times. Sometimes you need the parent before the children, sometimes the children before the parent, and sometimes you need nodes level by level.",
        ),
        prose(
          "There are four standard traversal orders. **Pre-order**, **in-order**, and **post-order** are depth-first orders: they go down a branch before coming back. **Level-order** is breadth-first: it scans the tree row by row.",
        ),
        heading("Mental model"),
        prose(
          "Think of a recursive traversal as a tiny program that reaches a node and has three possible moments to do useful work:\n\n1. **Before** visiting children.\n2. **Between** the left and right child.\n3. **After** visiting children.\n\nThose three moments produce pre-order, in-order, and post-order. The tree shape is the same; only the location of `visit(root)` changes.",
        ),
        derive(
          [
            step("visit before children", "Pre-order: Node, Left, Right."),
            step("visit between children", "In-order: Left, Node, Right."),
            step("visit after children", "Post-order: Left, Right, Node."),
            step("use a queue instead of recursion", "Level-order: process by depth from top to bottom."),
          ],
          "Traversal order = where the visit action happens",
          "One skeleton, four behaviours",
        ),
        heading("Depth-first orders"),
        prose(
          "Use this sample tree as a running example:\n\n```text\n        8\n      /   \\\n     3     10\n    / \\      \\\n   1   6      14\n```\n\nA traversal is not changing the tree. It is deciding the sequence in which these nodes are read.",
        ),
        prose(
          "**In-order** means `Left -> Node -> Right`. For the sample BST, the output is `1, 3, 6, 8, 10, 14`. On a BST this is sorted because every left subtree contains smaller values and every right subtree contains larger values.",
        ),
        viz("traversal", { variant: "inorder", title: "In-order → sorted output" }),
        derive(
          [
            step("all left-subtree keys < root", "BST ordering invariant."),
            step("in-order prints left subtree first", "So all smaller keys appear before the root."),
            step("then print root", "The root sits between smaller and larger keys."),
            step("then print right subtree", "All larger keys appear after the root."),
          ],
          "In-order traversal of a BST is sorted",
          "Why the sorted output happens",
        ),
        prose(
          "**Pre-order** means `Node -> Left -> Right`. The sample output is `8, 3, 1, 6, 10, 14`. This is useful when the parent must be handled before its children, such as copying a tree, saving a tree shape, or printing an outline where headings appear before subitems.",
        ),
        viz("traversal", { variant: "preorder", title: "Pre-order" }),
        prose(
          "**Post-order** means `Left -> Right -> Node`. The sample output is `1, 6, 3, 14, 10, 8`. This is useful when the parent answer depends on child answers: deleting a tree, computing subtree sizes, evaluating expression trees, or doing dynamic programming on trees.",
        ),
        viz("traversal", { variant: "postorder", title: "Post-order" }),
        heading("Breadth-first order"),
        prose(
          "**Level-order** visits nodes by depth using a **queue**. The sample output is `8, 3, 10, 1, 6, 14`: root first, then depth 1, then depth 2. This is breadth-first search on a tree, and it is the natural order for shortest-depth questions.",
        ),
        viz("traversal", { variant: "level", title: "Level-order (BFS)" }),
        heading("C++ templates"),
        prose(
          "The depth-first versions differ only in where the `visit(root)` line is placed. That is the most important pattern to remember:\n\n```cpp\nvoid preorder(Node* root) {\n    if (!root) return;\n    visit(root);              // before children\n    preorder(root->left);\n    preorder(root->right);\n}\n\nvoid inorder(Node* root) {\n    if (!root) return;\n    inorder(root->left);\n    visit(root);              // between left and right\n    inorder(root->right);\n}\n\nvoid postorder(Node* root) {\n    if (!root) return;\n    postorder(root->left);\n    postorder(root->right);\n    visit(root);              // after children\n}\n```",
        ),
        prose(
          "BFS/level-order replaces recursion with an explicit queue:\n\n```cpp\nvoid levelOrder(Node* root) {\n    if (!root) return;\n    queue<Node*> q;\n    q.push(root);\n\n    while (!q.empty()) {\n        Node* u = q.front(); q.pop();\n        visit(u);\n        if (u->left) q.push(u->left);\n        if (u->right) q.push(u->right);\n    }\n}\n```",
        ),
        heading("Choosing the order"),
        prose(
          "A good rule of thumb:\n\n- Need sorted values from a BST? Use **in-order**.\n- Need to create, copy, serialize, or print a hierarchy top-down? Use **pre-order**.\n- Need child results before parent results? Use **post-order**.\n- Need nearest-by-depth, level grouping, or minimum number of edges from the root? Use **level-order/BFS**.",
        ),
        heading("Complexities"),
        callout(
          "complexity",
          "Every traversal is `O(n)` time because each of the `n` nodes is visited once. Depth-first uses `O(h)` auxiliary space for the recursion stack, where `h` is height. Level-order uses `O(w)` auxiliary space for the queue, where `w` is the maximum number of nodes on any level. In the worst case, both can be `O(n)`.",
        ),
        heading("Why every traversal is linear"),
        derive(
          [
            step("each node is enqueued/called once", "The traversal reaches every node from exactly one parent."),
            step("each node is visited once", "The output action happens one time per node."),
            step("n nodes × constant work", "Ignoring child-pointer checks, the work scales with node count."),
          ],
          "O(n)",
          "Visit every node exactly once",
        ),
        callout(
          "intuition",
          "Same tree, four orders, four different sequences. The traversal order is not decoration; it controls when information becomes available.",
        ),
      ],
    ),
    lesson(
      "dfs-vs-bfs",
      "Depth-first vs breadth-first",
      "Two ways to explore a tree — go deep, or go wide.",
      14,
      [
        heading("Concept"),
        prose(
          "Strip away the exact visit order and tree traversal splits into two large families. **Depth-first search (DFS)** follows one branch as far as it can before backtracking. **Breadth-first search (BFS)** explores every node at the current depth before moving deeper.",
        ),
        prose(
          "The difference is not just visual. DFS asks, 'What happens if I keep going down this path?' BFS asks, 'What can I reach in 0 steps, then 1 step, then 2 steps?' That one choice decides memory usage, first-found answers, and which problems feel natural.",
        ),
        heading("DFS mechanics"),
        viz("traversal", { variant: "preorder", title: "DFS — go deep first (pre-order)" }),
        prose(
          "DFS behaves like a **stack**. The most recently discovered unfinished node gets processed next. In recursive DFS, the call stack stores the path from the root to the current node. Each call remembers: 'I am at this node, I have already handled some child work, and after the child returns I know where to continue.'",
        ),
        prose(
          "For the sample tree, a pre-order DFS reads `8, 3, 1, 6, 10, 14`. Notice how it goes `8 -> 3 -> 1` before it ever looks at `10`. That is the depth-first personality: finish the current corridor, then backtrack.",
        ),
        prose(
          "```cpp\nbool contains(Node* root, int target) {\n    if (!root) return false;\n    if (root->key == target) return true;\n    return contains(root->left, target) || contains(root->right, target);\n}\n```",
        ),
        heading("When DFS is the right tool"),
        prose(
          "DFS is natural when the answer is about **subtrees** or **complete paths**: height of a tree, subtree sum, validating a BST, printing all root-to-leaf paths, expression-tree evaluation, serialization, and tree dynamic programming. It is also the base pattern for backtracking: choose, recurse, undo.",
        ),
        prose(
          "A post-order DFS can compute subtree sizes because it waits until child answers are ready:\n\n```cpp\nint subtreeSize(Node* root) {\n    if (!root) return 0;\n    int left = subtreeSize(root->left);\n    int right = subtreeSize(root->right);\n    return 1 + left + right;\n}\n```",
        ),
        heading("BFS mechanics"),
        prose(
          "BFS behaves like a **queue**. Nodes discovered earlier are processed earlier, so all depth-`d` nodes are expanded before any depth-`d+1` node. On the sample tree, BFS reads `8, 3, 10, 1, 6, 14`: the tree is scanned in horizontal layers.",
        ),
        viz("traversal", { variant: "level", title: "BFS — go wide, level by level" }),
        prose(
          "BFS is the right choice when distance in edges matters. In a tree, the first time BFS finds a target, that target has the minimum depth among all matching nodes because all nodes at depth `d` are processed before any node at depth `d+1`.",
        ),
        heading("Worked example"),
        prose(
          "If the root is depth `0`, its children are depth `1`, grandchildren depth `2`, and so on. DFS might find a target at depth `5` before checking a different branch at depth `2`. BFS cannot do that: it exhausts depth `0`, then `1`, then `2`. That layer invariant is the same idea behind BFS shortest paths in unweighted graphs.",
        ),
        derive(
          [
            step("queue starts with the root", "Depth 0 is processed first."),
            step("children enter after their parent", "Depth d creates depth d+1."),
            step("FIFO order keeps older depths ahead", "All depth d nodes leave the queue before depth d+1 nodes."),
            step("first found target is shallowest", "No smaller depth is still waiting."),
          ],
          "BFS finds minimum-depth targets",
          "Layer-by-layer invariant",
        ),
        heading("Tree vs graph detail"),
        prose(
          "On a tree, there is exactly one path from the root to any node, so traversal does not need a `visited` set if you only follow child pointers downward. On a general graph, cycles exist, so DFS and BFS must mark visited vertices. Without that, a graph traversal can loop forever.",
        ),
        prose(
          "```cpp\n// Graph BFS needs visited/dist because neighbours can point back.\nqueue<int> q;\nvector<int> dist(n, -1);\nq.push(start);\ndist[start] = 0;\n\nwhile (!q.empty()) {\n    int u = q.front(); q.pop();\n    for (int v : adj[u]) {\n        if (dist[v] == -1) {\n            dist[v] = dist[u] + 1;\n            q.push(v);\n        }\n    }\n}\n```",
        ),
        heading("Time and space complexity"),
        prose(
          "On a tree with `n` nodes, DFS and BFS both take `O(n)` time in the worst case because they may need to inspect every node. DFS auxiliary space is `O(h)` for height; on a balanced tree that is `O(log n)`, while a skewed tree is `O(n)`. BFS auxiliary space is `O(w)` for width; a complete tree can have about `n/2` nodes on the last level, so worst-case queue space is `O(n)`.",
        ),
        callout(
          "complexity",
          "Memory intuition: DFS stores one active root-to-current path; BFS stores the frontier of an entire layer. DFS can be much smaller on wide trees, while BFS is the tool that guarantees the shallowest answer.",
        ),
        callout(
          "note",
          "Same trade-off as pathfinding: DFS (a stack) is memory-light but wanders; BFS (a queue) finds the nearest target first. The structure you traverse with decides which you get.",
        ),
      ],
    ),
  ],
);
