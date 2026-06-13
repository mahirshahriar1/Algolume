import type { Problem } from "../types";

export const graphProblems: Problem[] = [
  {
    id: "count-components",
    title: "Number of Connected Components",
    topic: "graphs",
    difficulty: "easy",
    summary: "Count the connected pieces of an undirected graph.",
    statement: `Given \`n\` nodes labelled \`0…n-1\` and a list of undirected \`edges\`
(\`[a, b]\`), return the number of **connected components**. Use union-find (or a
BFS/DFS from each unvisited node).`,
    funcName: "count_components",
    starter: `def count_components(n, edges):
    # Number of connected components in the undirected graph
    pass
`,
    examples: [
      { input: [5, [[0, 1], [1, 2], [3, 4]]], expected: 2, explain: "{0,1,2} and {3,4}." },
      { input: [5, [[0, 1], [1, 2], [2, 3], [3, 4]]], expected: 1 },
    ],
    tests: [
      { input: [4, []], expected: 4 },
      { input: [1, []], expected: 1 },
      { input: [6, [[0, 1], [2, 3], [4, 5]]], expected: 3 },
    ],
    hints: [
      "Start with n components; each edge that joins two different sets reduces the count by 1.",
      "Union-find with path compression makes the joins nearly O(1).",
    ],
    solution: `def count_components(n, edges):
    parent = list(range(n))
    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x
    count = n
    for a, b in edges:
        ra, rb = find(a), find(b)
        if ra != rb:
            parent[ra] = rb
            count -= 1
    return count
`,
    complexity: { time: "O(V + E α(V))", space: "O(V)" },
    lesson: "/learn/graphs/graph-traversal",
    tags: ["graph", "union find"],
  },
  {
    id: "course-schedule",
    title: "Course Schedule",
    topic: "graphs",
    difficulty: "medium",
    summary: "Can you finish all courses? — detect a cycle in a dependency graph.",
    statement: `There are \`n\` courses \`0…n-1\`. Each pair \`[a, b]\` in \`prerequisites\` means
you must take \`b\` **before** \`a\`. Return \`True\` if you can finish every course —
i.e. the dependency graph has **no cycle** (it's a DAG). Use a topological sort
(Kahn's algorithm) and check that every node is processed.`,
    funcName: "course_schedule",
    starter: `def course_schedule(n, prerequisites):
    # True if all courses can be finished (no cyclic dependency)
    pass
`,
    examples: [
      { input: [2, [[1, 0]]], expected: true, explain: "Take 0, then 1." },
      { input: [2, [[1, 0], [0, 1]]], expected: false, explain: "0 and 1 depend on each other." },
    ],
    tests: [
      { input: [4, [[1, 0], [2, 1], [3, 2]]], expected: true },
      { input: [3, [[0, 1], [1, 2], [2, 0]]], expected: false },
      { input: [1, []], expected: true },
    ],
    hints: [
      "Build the graph and an in-degree count per course.",
      "Kahn's algorithm: repeatedly remove a node with in-degree 0 and decrement its neighbours.",
      "If you can remove all n nodes, there's no cycle.",
    ],
    solution: `def course_schedule(n, prerequisites):
    from collections import deque, defaultdict
    g = defaultdict(list)
    indeg = [0] * n
    for a, b in prerequisites:
        g[b].append(a)
        indeg[a] += 1
    q = deque(i for i in range(n) if indeg[i] == 0)
    seen = 0
    while q:
        u = q.popleft()
        seen += 1
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    return seen == n
`,
    complexity: { time: "O(V + E)", space: "O(V + E)" },
    lesson: "/learn/graphs/graph-traversal",
    tags: ["graph", "topological sort", "cycle"],
  },
  {
    id: "topo-order",
    title: "Topological Order (lexicographically smallest)",
    topic: "graphs",
    difficulty: "hard",
    summary: "Order a DAG so every edge points forward — smallest order, or none.",
    statement: `Given a DAG with \`n\` nodes \`0…n-1\` and directed \`edges\` (\`[a, b]\` means
\`a\` comes **before** \`b\`), return the **lexicographically smallest** topological
ordering. If the graph has a cycle (no valid ordering), return \`[]\`. Use Kahn's
algorithm with a **min-heap** of zero-in-degree nodes.`,
    funcName: "topo_order",
    starter: `def topo_order(n, edges):
    # Lexicographically smallest topological order, or [] if a cycle exists
    pass
`,
    examples: [
      { input: [4, [[0, 1], [0, 2], [1, 3], [2, 3]]], expected: [0, 1, 2, 3] },
      { input: [2, [[0, 1]]], expected: [0, 1] },
    ],
    tests: [
      { input: [3, [[1, 2]]], expected: [0, 1, 2] },
      { input: [2, [[0, 1], [1, 0]]], expected: [] },
      { input: [3, []], expected: [0, 1, 2] },
    ],
    hints: [
      "Compute in-degrees; seed a min-heap with every node of in-degree 0.",
      "Pop the smallest, append it, and decrement its neighbours' in-degrees (pushing new zeros).",
      "If you didn't output all n nodes, there was a cycle → return [].",
    ],
    solution: `def topo_order(n, edges):
    import heapq
    from collections import defaultdict
    g = defaultdict(list)
    indeg = [0] * n
    for a, b in edges:
        g[a].append(b)
        indeg[b] += 1
    h = [i for i in range(n) if indeg[i] == 0]
    heapq.heapify(h)
    out = []
    while h:
        u = heapq.heappop(h)
        out.append(u)
        for v in g[u]:
            indeg[v] -= 1
            if indeg[v] == 0:
                heapq.heappush(h, v)
    return out if len(out) == n else []
`,
    complexity: { time: "O((V + E) log V)", space: "O(V + E)" },
    lesson: "/learn/graphs/graph-traversal",
    tags: ["graph", "topological sort", "heap"],
  },
];
