import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const graphs = chapter(
  "graphs",
  "Graphs & representations",
  "How to store a graph, traverse it with BFS/DFS, and order or component-split it.",
  "Network",
  [
    lesson(
      "graph-representations",
      "Representing a graph",
      "Adjacency list vs matrix vs edge list, and the directed/undirected/weighted choices.",
      10,
      [
        heading("What a graph is"),
        prose(
          "A **graph** is a set of **vertices** connected by **edges**. Edges can be **directed** (one-way) or **undirected**, and **weighted** or unweighted. Trees, grids, road networks, dependency graphs, and social networks are all graphs — most non-trivial algorithms problems are graph problems in disguise.",
        ),
        heading("Three representations"),
        prose(
          "- **Adjacency list** — `adj[u]` is the list of `u`'s neighbours. Space `O(V + E)`; iterating a vertex's neighbours is fast. **The default** for sparse graphs.\n- **Adjacency matrix** — `m[u][v] = 1` (or the weight) if an edge exists. Space `O(V²)`; edge lookup is `O(1)` but iterating neighbours is `O(V)`. Good for dense graphs or when you need instant edge tests.\n- **Edge list** — just a list of `(u, v, w)`. Compact; ideal for algorithms that sort edges (like Kruskal).",
        ),
        prose(
          "```cpp\nint V, E;\nvector<vector<int>> adj(V);          // adjacency list\nfor (auto [u, v] : edges) {\n    adj[u].push_back(v);\n    adj[v].push_back(u);             // omit for a directed graph\n}\n```",
        ),
        derive(
          [
            step("list: O(V + E) space", "Store only the edges that exist."),
            step("matrix: O(V²) space", "A slot for every possible edge."),
            step("sparse graphs have E ≪ V²", "So the list usually wins."),
          ],
          "Pick the list unless the graph is dense",
          "Space trade-off",
        ),
        callout(
          "intuition",
          "When in doubt, use an **adjacency list**. Reach for a matrix only when the graph is dense (`E ≈ V²`) or you do many `is there an edge u–v?` checks.",
        ),
      ],
    ),
    lesson(
      "graph-traversal",
      "Traversal, components, cycles & topological sort",
      "BFS and DFS on a general graph, then the structural algorithms they unlock.",
      12,
      [
        heading("BFS and DFS need a visited set"),
        prose(
          "Unlike a tree, a graph can have **cycles** and multiple paths to a node, so a traversal must remember where it's been. **BFS** (queue) explores in layers — shortest path in *unweighted* graphs. **DFS** (stack/recursion) dives deep — natural for components, cycles, and ordering. Both are `O(V + E)`.",
        ),
        prose(
          "```cpp\n// BFS from src\nqueue<int> q; vector<bool> seen(V, false);\nq.push(src); seen[src] = true;\nwhile (!q.empty()) {\n    int u = q.front(); q.pop();\n    for (int v : adj[u]) if (!seen[v]) { seen[v] = true; q.push(v); }\n}\n```",
        ),
        viz("pathfinding", { title: "BFS/DFS exploring a graph (grid + node views)" }),
        heading("Connected components"),
        prose(
          "Run a traversal from every unvisited vertex; each launch discovers one **component**. Counting the launches counts the components (or use union-find — see [DSU](/learn/minimum-spanning-trees/kruskal-dsu)).",
        ),
        heading("Cycle detection"),
        prose(
          "In an **undirected** graph, a DFS that reaches an already-visited vertex that isn't the parent means a cycle. In a **directed** graph, a cycle exists iff DFS finds a **back edge** to a node currently on the recursion stack — equivalently, iff a topological sort fails to order every node.",
        ),
        heading("Topological sort"),
        prose(
          "For a **DAG** (directed acyclic graph), a **topological order** lists vertices so every edge points forward — the order you can do tasks with dependencies. **Kahn's algorithm** repeatedly removes a vertex with in-degree 0:",
        ),
        prose(
          "```cpp\nvector<int> indeg(V, 0);\nfor (int u = 0; u < V; u++) for (int v : adj[u]) indeg[v]++;\nqueue<int> q;\nfor (int u = 0; u < V; u++) if (!indeg[u]) q.push(u);\nvector<int> order;\nwhile (!q.empty()) {\n    int u = q.front(); q.pop(); order.push_back(u);\n    for (int v : adj[u]) if (--indeg[v] == 0) q.push(v);\n}\nif ((int)order.size() != V) { /* cycle: no topo order */ }\n```",
        ),
        callout(
          "complexity",
          "BFS, DFS, component counting, cycle detection, and topological sort are all `O(V + E)` with an adjacency list. Use a **min-heap** instead of a plain queue in Kahn's to get the lexicographically smallest order.",
        ),
        problem("count-components"),
        problem("course-schedule"),
        problem("topo-order"),
      ],
    ),
  ],
);
