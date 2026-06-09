import type { Problem } from "../types";

export const mstProblems: Problem[] = [
  {
    id: "valid-spanning-tree",
    title: "Valid Spanning Tree",
    topic: "minimum-spanning-trees",
    difficulty: "easy",
    summary: "Check whether undirected edges connect all n nodes without a cycle.",
    statement: `Given \`n\` nodes labeled \`0..n-1\` and undirected edges \`[u, v]\`,
return \`True\` if those edges form a **spanning tree**: all nodes are connected
and there is no cycle.`,
    funcName: "valid_spanning_tree",
    starter: `def valid_spanning_tree(n, edges):
    # Return True if edges form one connected acyclic graph
    pass
`,
    examples: [
      { input: [5, [[0, 1], [0, 2], [0, 3], [1, 4]]], expected: true },
      { input: [5, [[0, 1], [1, 2], [2, 0], [3, 4]]], expected: false, explain: "There is a cycle among 0,1,2 and node 3/4 are separate." },
      { input: [1, []], expected: true },
    ],
    tests: [
      { input: [4, [[0, 1], [1, 2], [2, 3]]], expected: true },
      { input: [4, [[0, 1], [1, 2]]], expected: false },
      { input: [3, [[0, 1], [1, 2], [0, 2]]], expected: false },
      { input: [2, [[0, 1]]], expected: true },
    ],
    hints: [
      "A tree with n nodes must have exactly n - 1 edges.",
      "Use DSU. If an edge joins nodes already in the same component, it creates a cycle.",
      "After processing n - 1 edges with no cycle, the edge count condition guarantees connectivity.",
    ],
    solution: `def valid_spanning_tree(n, edges):
    if len(edges) != n - 1:
        return False
    parent = list(range(n))

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    for u, v in edges:
        ru, rv = find(u), find(v)
        if ru == rv:
            return False
        parent[rv] = ru
    return True
`,
    complexity: { time: "O(E alpha(V))", space: "O(V)" },
    lesson: "/learn/minimum-spanning-trees/mst-definition",
    tags: ["dsu", "tree", "graph"],
  },
  {
    id: "minimum-connection-cost",
    title: "Minimum Connection Cost",
    topic: "minimum-spanning-trees",
    difficulty: "medium",
    summary: "Return the MST weight of a weighted undirected graph, or -1 if disconnected.",
    statement: `Given \`n\` nodes labeled \`0..n-1\` and weighted undirected edges
\`[u, v, w]\`, return the total weight of a minimum spanning tree. If the graph is
disconnected, return \`-1\`.`,
    funcName: "minimum_connection_cost",
    starter: `def minimum_connection_cost(n, edges):
    # Return the MST total weight, or -1 if no spanning tree exists
    pass
`,
    examples: [
      { input: [4, [[0, 1, 1], [0, 2, 4], [1, 2, 2], [1, 3, 6], [2, 3, 3]]], expected: 6, explain: "Use weights 1, 2, and 3." },
      { input: [3, [[0, 1, 5]]], expected: -1, explain: "Node 2 is disconnected." },
    ],
    tests: [
      { input: [5, [[0, 1, 2], [1, 2, 3], [0, 2, 10], [2, 3, 1], [3, 4, 4], [1, 4, 8]]], expected: 10 },
      { input: [2, [[0, 1, 7]]], expected: 7 },
      { input: [1, []], expected: 0 },
      { input: [4, [[0, 1, 1], [2, 3, 1]]], expected: -1 },
    ],
    hints: [
      "This is Kruskal: sort edges by weight.",
      "Use DSU to accept only edges connecting different components.",
      "If you accept fewer than n - 1 edges, the graph was disconnected.",
    ],
    solution: `def minimum_connection_cost(n, edges):
    parent = list(range(n))
    size = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        ra, rb = find(a), find(b)
        if ra == rb:
            return False
        if size[ra] < size[rb]:
            ra, rb = rb, ra
        parent[rb] = ra
        size[ra] += size[rb]
        return True

    total = 0
    used = 0
    for u, v, w in sorted(edges, key=lambda e: e[2]):
        if union(u, v):
            total += w
            used += 1
    return total if used == n - 1 else -1
`,
    complexity: { time: "O(E log E)", space: "O(V)" },
    lesson: "/learn/minimum-spanning-trees/kruskal-dsu",
    tags: ["kruskal", "dsu", "mst"],
  },
  {
    id: "second-best-mst",
    title: "Second Best MST",
    topic: "minimum-spanning-trees",
    difficulty: "hard",
    summary: "Find the cheapest spanning tree whose total weight is strictly larger than the MST.",
    statement: `For a small weighted undirected graph, return the weight of the **second best**
spanning tree: the cheapest spanning tree whose total weight is strictly larger
than the MST weight. If no strictly heavier spanning tree exists, return \`-1\`.

Input sizes for this exercise are small enough to enumerate edge subsets, so
focus on the definition first.`,
    funcName: "second_best_mst",
    starter: `def second_best_mst(n, edges):
    # Return the cheapest spanning-tree weight strictly larger than the MST
    pass
`,
    examples: [
      { input: [4, [[0, 1, 1], [1, 2, 2], [2, 3, 3], [0, 3, 4], [0, 2, 5]]], expected: 7 },
      { input: [3, [[0, 1, 1], [1, 2, 1], [0, 2, 1]]], expected: -1, explain: "Every spanning tree has weight 2." },
    ],
    tests: [
      { input: [2, [[0, 1, 5]]], expected: -1 },
      { input: [4, [[0, 1, 1], [1, 2, 1], [2, 3, 1], [3, 0, 1], [0, 2, 10]]], expected: 12 },
      { input: [4, [[0, 1, 3], [1, 2, 4], [2, 3, 5], [0, 3, 6], [0, 2, 7], [1, 3, 8]]], expected: 13 },
      { input: [3, [[0, 1, 2]]], expected: -1 },
    ],
    hints: [
      "A spanning tree on n nodes uses exactly n - 1 edges.",
      "For this small version, try every combination of n - 1 edges and test whether it is a tree.",
      "Collect all valid tree weights, find the minimum, then the smallest weight greater than that.",
    ],
    solution: `def second_best_mst(n, edges):
    from itertools import combinations

    def is_tree(combo):
        parent = list(range(n))

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        for u, v, _ in combo:
            ru, rv = find(u), find(v)
            if ru == rv:
                return False
            parent[rv] = ru
        root = find(0) if n else 0
        return all(find(i) == root for i in range(n))

    weights = []
    for combo in combinations(edges, max(0, n - 1)):
        if is_tree(combo):
            weights.append(sum(w for _, _, w in combo))
    if not weights:
        return -1
    best = min(weights)
    heavier = [w for w in weights if w > best]
    return min(heavier) if heavier else -1
`,
    complexity: { time: "O(C(E,V-1) * V)", space: "O(V)" },
    lesson: "/learn/minimum-spanning-trees/prim",
    tags: ["mst", "spanning tree", "enumeration"],
  },
];
