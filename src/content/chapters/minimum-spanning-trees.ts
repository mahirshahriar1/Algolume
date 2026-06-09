import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const minimumSpanningTrees = chapter(
  "minimum-spanning-trees",
  "Minimum spanning trees",
  "Connect every vertex with minimum total edge weight using Kruskal, Prim, and DSU.",
  "Network",
  [
    lesson(
      "mst-definition",
      "Spanning trees and MSTs",
      "Tree vs spanning tree, why cycles are unnecessary, and what a minimum spanning tree optimizes.",
      11,
      [
        heading("Concept"),
        prose(
          "A **spanning tree** of a connected undirected graph is a subset of edges that connects every vertex and contains no cycle. It is a tree that spans the whole graph. If the graph has `V` vertices, every spanning tree has exactly `V - 1` edges.",
        ),
        prose(
          "A **minimum spanning tree** (MST) is a spanning tree with the smallest possible total edge weight. If the graph represents cities and road costs, an MST is the cheapest way to connect every city so travel between any two cities is possible, without paying for redundant cycles.",
        ),
        heading("Graph prerequisites"),
        prose(
          "MSTs live in **connected, undirected, weighted graphs**. Directed edges change the problem. Disconnected graphs do not have one spanning tree; they have a spanning forest at best. Negative weights are allowed for MSTs because we are not measuring path distance, only total selected edge weight.",
        ),
        heading("Why cycles are unnecessary"),
        derive(
          [
            step("a cycle gives two ways around", "If selected edges contain a cycle, one edge on that cycle is redundant for connectivity."),
            step("remove the heaviest edge on the cycle", "The graph stays connected, because the remaining cycle path still links its endpoints."),
            step("total weight does not increase", "Removing a nonnegative or heaviest edge can only help or tie."),
            step("repeat until no cycles remain", "A cheapest connected solution can always be a tree."),
          ],
          "An MST is connected, acyclic, and has V - 1 edges",
          "Cycles waste edges",
        ),
        viz("mst", { variant: "kruskal", title: "MST simulation: accept or reject edges" }),
        heading("Cut property"),
        prose(
          "A **cut** splits the vertices into two non-empty groups. An edge **crosses** the cut if it has one endpoint on each side. The cut property says: if an edge is the lightest edge crossing some cut, then there is an MST that contains that edge.",
        ),
        callout(
          "intuition",
          "The cut property is the MST superpower. If the current selected vertices are on one side and the rest are outside, the cheapest bridge across that boundary is always safe to take.",
        ),
        heading("Cycle property"),
        prose(
          "The cycle property is the matching rejection rule: in any cycle, a strictly heaviest edge cannot belong to an MST. If it were included, removing it keeps the graph connected through the rest of the cycle and lowers the total cost.",
        ),
        heading("Complexity target"),
        prose(
          "MST algorithms usually sort edges or use a priority queue. Kruskal is `O(E log E)` because it sorts all edges. Prim is `O(E log V)` with a heap and adjacency lists. Both use `O(V + E)` space for the graph and algorithm state.",
        ),
        problem("valid-spanning-tree"),
      ],
    ),
    lesson(
      "kruskal-dsu",
      "Kruskal and DSU",
      "Sort edges by weight, accept safe edges, and use Union-Find to detect cycles.",
      13,
      [
        heading("Concept"),
        prose(
          "**Kruskal's algorithm** sorts every edge by weight and scans from cheapest to most expensive. It accepts an edge if it connects two different components; otherwise it rejects the edge because it would create a cycle.",
        ),
        viz("mst", { variant: "kruskal", title: "Kruskal: sorted edges plus DSU components" }),
        heading("The algorithm"),
        prose(
          "```cpp\nsort(edges.begin(), edges.end()); // by weight\nDSU dsu(n);\nlong long total = 0;\nint used = 0;\n\nfor (auto [w, u, v] : edges) {\n    if (dsu.find(u) != dsu.find(v)) {\n        dsu.unite(u, v);\n        total += w;\n        used++;\n    }\n}\n\nif (used != n - 1) cout << \"no spanning tree\\n\";\nelse cout << total << '\\n';\n```",
        ),
        heading("Union-Find / DSU"),
        prose(
          "A **disjoint set union** structure tracks which component each vertex belongs to. `find(x)` returns the representative of x's component. `unite(a, b)` merges two components. With path compression and union by rank/size, each operation is nearly constant amortized time.",
        ),
        viz("dsu", { title: "DSU simulation: find, compress, unite" }),
        prose(
          "```cpp\nstruct DSU {\n    vector<int> parent, sz;\n    DSU(int n) : parent(n), sz(n, 1) {\n        iota(parent.begin(), parent.end(), 0);\n    }\n    int find(int x) {\n        if (parent[x] == x) return x;\n        return parent[x] = find(parent[x]);\n    }\n    bool unite(int a, int b) {\n        a = find(a); b = find(b);\n        if (a == b) return false;\n        if (sz[a] < sz[b]) swap(a, b);\n        parent[b] = a;\n        sz[a] += sz[b];\n        return true;\n    }\n};\n```",
        ),
        heading("Why Kruskal is correct"),
        derive(
          [
            step("consider the next cheapest edge e = (u, v)", "Kruskal scans edges in nondecreasing weight."),
            step("u and v are in different components", "The current forest creates a cut between those components."),
            step("e is the cheapest edge crossing that cut among unprocessed safe choices", "Any cheaper crossing edge would have appeared earlier."),
            step("by the cut property, e is safe", "There exists an MST containing every accepted edge so far plus e."),
          ],
          "Kruskal builds an MST by repeatedly adding safe edges",
          "Cut-property proof sketch",
        ),
        heading("Complexity"),
        prose(
          "Sorting dominates: `O(E log E)` time. DSU operations contribute `O(E alpha(V))`, where `alpha` is the inverse Ackermann function and is effectively constant for real input sizes. Space is `O(V)` for DSU plus `O(E)` for the edge list.",
        ),
        callout(
          "warning",
          "Kruskal needs an undirected graph. For directed minimum-cost connection problems, you are usually in arborescence territory, which is a different algorithmic world.",
        ),
        problem("minimum-connection-cost"),
      ],
    ),
    lesson(
      "prim",
      "Prim's algorithm",
      "Grow one connected tree with the cheapest edge crossing the current cut.",
      11,
      [
        heading("Concept"),
        prose(
          "**Prim's algorithm** starts from any vertex and grows one connected tree. At every step, it looks at the cut between vertices already in the tree and vertices outside it, then takes the cheapest edge crossing that cut.",
        ),
        viz("mst", { variant: "prim", title: "Prim: grow across the cheapest cut edge" }),
        heading("Priority-queue version"),
        prose(
          "```cpp\nvector<vector<pair<int,int>>> adj(n); // {to, weight}\nvector<bool> used(n, false);\npriority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;\n\npq.push({0, 0}); // cost, vertex\nlong long total = 0;\nint taken = 0;\n\nwhile (!pq.empty()) {\n    auto [cost, u] = pq.top(); pq.pop();\n    if (used[u]) continue;\n    used[u] = true;\n    total += cost;\n    taken++;\n\n    for (auto [v, w] : adj[u]) {\n        if (!used[v]) pq.push({w, v});\n    }\n}\n\nif (taken != n) cout << \"no spanning tree\\n\";\nelse cout << total << '\\n';\n```",
        ),
        heading("Why Prim is correct"),
        derive(
          [
            step("visited vertices define a cut", "Inside the current tree vs outside it."),
            step("choose the lightest edge crossing the cut", "This is exactly what the priority queue is trying to expose."),
            step("the cut property says that edge is safe", "Some MST contains it."),
            step("add the outside endpoint", "The selected edges remain connected and acyclic."),
          ],
          "Prim repeatedly applies the cut property",
          "Growing one safe edge at a time",
        ),
        heading("Kruskal vs Prim"),
        prose(
          "Kruskal is edge-centric: sort all edges and use DSU to avoid cycles. It is simple when the input is already an edge list. Prim is vertex-centric: grow from a start vertex using adjacency lists and a priority queue. It is often natural for dense connected graphs or when the graph is stored as neighbours.",
        ),
        heading("Complexity"),
        prose(
          "With adjacency lists and a binary heap, Prim is `O(E log V)` time and `O(V + E)` space. With an adjacency matrix and no heap, the classic dense-graph version is `O(V^2)` time.",
        ),
        callout(
          "intuition",
          "Dijkstra and Prim both use a priority queue, but they optimize different quantities. Dijkstra chooses the next smallest distance from the source; Prim chooses the next cheapest edge that expands the tree.",
        ),
        problem("second-best-mst"),
      ],
    ),
  ],
);
