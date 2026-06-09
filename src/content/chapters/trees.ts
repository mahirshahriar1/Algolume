import { callout, chapter, derive, heading, lesson, prose, step, viz } from "../builder";

export const trees = chapter(
  "trees",
  "Trees & BSTs",
  "Hierarchical structure, and the binary search tree's ordered layout.",
  "GitBranch",
  [
    lesson(
      "tree-basics",
      "Trees & binary search trees",
      "Nodes, children, and the ordering invariant that makes a BST searchable in O(log n).",
      8,
      [
        prose(
          "A **tree** is a hierarchy of **nodes**: a single **root** at the top, each node holding children below it, with no cycles. A **binary tree** limits each node to at most two children — a **left** and a **right**.",
        ),
        prose(
          "A **binary search tree (BST)** adds one rule, the **ordering invariant**: for every node, everything in its **left** subtree is smaller, and everything in its **right** subtree is larger. That rule is what makes it searchable. Watch it being built:",
        ),
        viz("bst", { variant: "insert", title: "Building a BST by inserting values" }),
        prose(
          "To insert (or search), you start at the root and go **left if smaller, right if larger**, repeating until you find the value or reach an empty spot. Each step discards a whole subtree — the same halving we saw in binary search.",
        ),
        callout(
          "complexity",
          "Search, insert and delete are `O(h)` where `h` is the tree's **height**. A **balanced** tree has `h ≈ log n` → `O(log n)`. But insert sorted data and it degenerates into a linked list → `h = n` → `O(n)`.",
        ),
        heading("Why balanced height is logarithmic"),
        derive(
          [
            step("level 0 holds 1 node", "The root."),
            step("level 1 holds up to 2 nodes", "Each node has two children."),
            step("level 2 holds up to 4 nodes", "Capacity doubles each level."),
            step("levels 0..h hold about 2ʰ nodes", "A balanced binary tree fills exponentially."),
            step("2ʰ ≈ n  ⟹  h ≈ log₂ n", "Solve for height."),
          ],
          "O(log n) height when balanced",
          "Doubling capacity makes height logarithmic",
        ),
        callout(
          "warning",
          "That worst case is why **self-balancing** trees (AVL, red-black) exist — they rearrange on insert to keep the height near `log n`.",
        ),
      ],
    ),
    lesson(
      "bst-operations",
      "Searching a BST & why balance matters",
      "Search follows one path down — fast when balanced, slow when not.",
      9,
      [
        heading("Concept"),
        prose(
          "Searching a BST is just the insert path without inserting: start at the root and go **left if smaller, right if larger** until you find the value or fall off the tree.",
        ),
        viz("bst", { variant: "insert", title: "Insert & search follow a single root-to-leaf path" }),
        heading("Search invariant"),
        prose(
          "At every node, the BST invariant lets you delete one whole side of the tree from consideration. If `target < node->key`, the target cannot be in the right subtree because every value there is even larger. If `target > node->key`, the target cannot be in the left subtree because every value there is smaller.",
        ),
        derive(
          [
            step("look at one node", "Compare target with the current key."),
            step("target is smaller", "Only the left subtree can still contain it."),
            step("target is larger", "Only the right subtree can still contain it."),
            step("target is equal", "Search is finished."),
            step("child pointer is nullptr", "The value is not present."),
          ],
          "One comparison discards an entire subtree",
          "BST search invariant",
        ),
        heading("Worked example"),
        prose(
          "Suppose the insertion order produced root `50`, with `30` on the left and `70` on the right. Searching for `65` compares with `50` first, goes right, compares with `70`, then goes left. The search never looks inside the entire left subtree of `50`; those values are all too small. On a balanced tree, this pruning happens about `log2(n)` times.",
        ),
        heading("C++ search code"),
        prose(
          "```cpp\nstruct Node {\n    int key;\n    Node* left;\n    Node* right;\n};\n\nNode* search(Node* root, int target) {\n    Node* cur = root;\n    while (cur != nullptr) {\n        if (target == cur->key) return cur;\n        if (target < cur->key) cur = cur->left;\n        else cur = cur->right;\n    }\n    return nullptr;\n}\n```\n\nThe iterative version uses `O(1)` extra space. A recursive version is shorter, but it uses call-stack space proportional to the height of the tree.",
        ),
        heading("Time and space complexity"),
        prose(
          "Because each step discards a whole subtree, the cost is the tree's **height**, `O(h)`. A **balanced** tree has `h ≈ log n`, so search, insert and delete are all `O(log n)`. The dedicated BST visualizer lets you insert and search your own values.",
        ),
        callout(
          "warning",
          "But insert **already-sorted** data and every node goes right — the tree degenerates into a linked list with `h = n`, and operations slow to `O(n)`.",
        ),
        callout(
          "complexity",
          "Balanced BST: search time `O(log n)`, iterative search space `O(1)`, recursive search space `O(log n)`. Skewed BST: search time `O(n)`, recursive stack `O(n)`. Insert and delete have the same height-based bound because they also navigate a root-to-leaf path.",
        ),
        callout(
          "note",
          "That failure mode is why **self-balancing** trees (AVL, red-black) exist: they rotate on insert/delete to keep the height near `log n`, guaranteeing `O(log n)`.",
        ),
      ],
    ),
    lesson(
      "red-black-trees",
      "Red-black trees",
      "A self-balancing BST that uses colors and rotations to guarantee O(log n).",
      10,
      [
        prose(
          "A **red-black tree** is a binary search tree with one extra bit of information per node: the node is either **red** or **black**. Those colors enforce balance loosely enough that insertion is cheap, but strongly enough that height stays logarithmic.",
        ),
        heading("The invariants"),
        prose(
          "A red-black tree must satisfy these rules:\n\n- Every node is red or black.\n- The root is black.\n- All `nullptr` leaves are considered black.\n- A red node cannot have a red parent or red child.\n- Every path from a node down to a `nullptr` leaf has the same number of black nodes. This is the **black height**.",
        ),
        callout(
          "intuition",
          "The colors prevent the tree from becoming a long linked list. Red nodes may lean a little, but the equal black-height rule keeps every root-to-leaf path within a constant factor of every other path.",
        ),
        viz("red-black-tree", { title: "Red-black insertion: recolor and rotate" }),
        heading("Insertion idea"),
        prose(
          "Insertion starts exactly like BST insertion: find the empty spot. The new node is colored **red** because adding a red node does not immediately increase the black height of any path. The only possible problem is a **red-red violation**: the new red node might have a red parent.",
        ),
        prose(
          "If the parent and uncle are both red, we **recolor**: parent and uncle become black, grandparent becomes red, and the possible violation moves upward. If the uncle is black, we use one or two **rotations** to reshape the local subtree, then recolor parent/grandparent.",
        ),
        heading("C++ node sketch"),
        prose(
          "```cpp\nenum Color { RED, BLACK };\n\nstruct Node {\n    int key;\n    Color color;\n    Node* left;\n    Node* right;\n    Node* parent;\n\n    Node(int k)\n        : key(k), color(RED), left(nullptr), right(nullptr), parent(nullptr) {}\n};\n```\n\nProduction implementations use sentinels for `nil` leaves, but the pointer idea is the same as the linked-list chapter: rotations are careful pointer rewiring.",
        ),
        heading("Why height is logarithmic"),
        derive(
          [
            step("no red node has a red child", "Red nodes cannot appear consecutively."),
            step("every root-leaf path has the same black height bh", "The black-height invariant."),
            step("longest path alternates red/black", "At most twice as long as the all-black shortest path."),
            step("a subtree with black height bh has at least 2ᵇʰ − 1 internal nodes", "Minimum size grows exponentially with black height."),
            step("height h ≤ 2 log₂(n+1)", "So search/insert/delete follow O(log n) height."),
          ],
          "O(log n)",
          "Red-black height bound",
        ),
        callout(
          "complexity",
          "Search is ordinary BST search: `O(log n)` because height is bounded. Insert and delete are also `O(log n)` total; rotations themselves are `O(1)` pointer changes.",
        ),
        callout(
          "note",
          "C++ `std::map` and `std::set` are commonly implemented as red-black trees or equivalent balanced trees. `unordered_map` is hashing; `map` is ordered tree navigation.",
        ),
      ],
    ),
  ],
);
