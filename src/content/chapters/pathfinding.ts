import { callout, chapter, derive, heading, lesson, prose, step, viz } from "../builder";

export const pathfinding = chapter(
  "pathfinding",
  "Pathfinding & Graphs",
  "Searching mazes and networks: BFS, DFS, Dijkstra, A*, Bellman-Ford and Floyd-Warshall.",
  "Network",
  [
    lesson(
      "search-a-grid",
      "Searching a grid",
      "How the four classic searches explore space, and what 'shortest path' really means.",
      11,
      [
        heading("Concept"),
        prose(
          "A maze is just a **graph** in disguise: each open cell is a node, and neighbouring cells are connected by edges. Finding your way out is a **graph search**. The four classics all share one loop — take a node from the *frontier*, mark it visited, add its neighbours — and differ only in **which node they take next**.",
        ),
        prose(
          "- **BFS** takes the oldest node first (a queue) → explores in rings → **shortest path** on an unweighted grid.\n- **DFS** takes the newest first (a stack) → plunges down one corridor → finds *a* path, not the shortest.\n- **Dijkstra** takes the cheapest-so-far → **shortest path** when steps have different costs.\n- **A\\*** takes cheapest-so-far *plus a guess of distance to the goal* → heads straight for the target, exploring far less.",
        ),
        heading("The graph model"),
        prose(
          "A graph is `G = (V, E)`: a set of **vertices** and **edges**. In a grid, each open cell is a vertex and each legal move to a neighbour is an edge. If all edges have cost 1, the path length is just the number of steps. If edges have weights, the path cost is the sum of weights.",
        ),
        heading("Unweighted shortest paths"),
        prose(
          "A graph is **unweighted** when every edge has the same cost. In that world, the cheapest path is the path with the **fewest edges**. BFS is designed exactly for that: it explores all nodes at distance `0`, then all nodes at distance `1`, then distance `2`, and so on.",
        ),
        prose(
          "DFS does not move by distance layers. It follows one branch deeply, then backtracks. That makes DFS excellent for reachability and structure discovery, but the first path it finds can be much longer than the shortest path.",
        ),
        viz("pathfinding", { algo: "bfs", title: "BFS simulation: layer expansion" }),
        viz("pathfinding", { algo: "dfs", title: "DFS simulation: depth-first wandering" }),
        heading("Why BFS is shortest on unweighted graphs"),
        derive(
          [
            step("BFS uses a queue", "Nodes discovered earlier are expanded earlier."),
            step("distance 0 expands before distance 1", "The start node is processed first."),
            step("distance k expands before distance k+1", "All nodes at the current layer enter the queue before the next layer."),
            step("first time you reach a node, it uses the fewest edges", "No shorter path can still be waiting behind a longer one."),
          ],
          "BFS gives shortest paths when every edge has equal cost",
          "Layer order is the proof",
        ),
        heading("BFS example"),
        prose(
          "Imagine the start cell as distance `0`. Its neighbours are distance `1`, their unseen neighbours are distance `2`, and so on. BFS processes the entire distance-`k` ring before touching distance `k+1`. So if the goal is first reached at distance `6`, there cannot be a hidden distance-`4` path still waiting: all distance-`4` nodes were processed earlier.",
        ),
        prose(
          "```cpp\nqueue<int> q;\nvector<int> dist(n, -1);\n\nq.push(start);\ndist[start] = 0;\n\nwhile (!q.empty()) {\n    int u = q.front(); q.pop();\n    for (int v : adj[u]) {\n        if (dist[v] == -1) {\n            dist[v] = dist[u] + 1;\n            q.push(v);\n        }\n    }\n}\n```",
        ),
        heading("DFS is exploration, not optimization"),
        prose(
          "DFS is useful when you need to visit reachable states, detect cycles, topologically sort, or search a huge space with low memory. But DFS commits to one branch before trying alternatives, so the first path it finds can be arbitrarily longer than the shortest path.",
        ),
        heading("DFS notes"),
        prose(
          "DFS is the right mental model for **reachability**, **connected components**, **cycle detection**, **topological sorting**, and **backtracking**. It can be recursive or stack-based:\n\n```cpp\nvoid dfs(int u) {\n    seen[u] = true;\n    for (int v : adj[u]) {\n        if (!seen[v]) dfs(v);\n    }\n}\n```\n\nRecursive DFS uses call-stack space equal to the deepest path. On a graph shaped like a chain, that is `O(V)` stack space.",
        ),
        heading("Complexity and space"),
        prose(
          "With adjacency lists, BFS and DFS both take `O(V+E)` time: each vertex is discovered once, and each edge is inspected a constant number of times. BFS uses `O(V)` space for the visited set plus queue. DFS uses `O(V)` visited space and either `O(V)` explicit stack space or recursion stack in the worst case.",
        ),
        callout(
          "intuition",
          "Run BFS and then A* on the same maze. BFS floods outward evenly; A* leans toward the goal. Same answer, far less work — that's the power of a good heuristic.",
        ),
        callout(
          "note",
          "The visualizer offers both a **grid** and a **node-graph** view. The grid is intuitive; the graph view shows the same algorithms on an arbitrary weighted network — which is what they're really built for.",
        ),
      ],
    ),
    lesson(
      "shortest-paths",
      "Weighted graphs: Dijkstra & A*",
      "Shortest paths with non-negative weights, priority queues, and admissible heuristics.",
      11,
      [
        heading("Concept"),
        prose(
          "On a plain grid every step costs the same, so BFS finds the shortest path. But real maps have **weights** — some moves cost more (rough terrain, longer roads). Now 'shortest' means **cheapest total weight**, and BFS isn't enough.",
        ),
        heading("What shortest path means"),
        prose(
          "For a path `s -> ... -> t`, the total cost is the sum of all edge weights on that path. A **shortest path** is the minimum-cost path among all possible paths from the source to the target. If every edge has weight `1`, this becomes fewest edges and BFS is enough. If weights differ, the algorithm must compare total costs, not just hop counts.",
        ),
        prose(
          "Shortest-path algorithms usually maintain a distance table `dist[v]`: the best cost discovered so far from the source to `v`. They also keep a `parent[v]` or `came_from[v]` pointer so the final route can be reconstructed after the distances are known.",
        ),
        prose(
          "**Dijkstra** always expands the **cheapest-so-far** node (a priority queue ordered by distance), guaranteeing the minimum-cost path. **A\\*** adds a **heuristic** — an estimate of the distance still to go — so it leans toward the goal and explores far fewer nodes.",
        ),
        viz("pathfinding", { title: "Switch to the graph view for weighted edges" }),
        heading("Choosing the shortest-path algorithm"),
        prose(
          "- **BFS**: unweighted graph, single source, fewest edges. `O(V+E)`.\n- **Dijkstra**: non-negative weighted graph, single source. `O((V+E) log V)` with a heap.\n- **A\\***: non-negative weighted graph with a goal and an admissible heuristic. Same optimal answer as Dijkstra, often fewer visited nodes.\n- **Bellman-Ford**: negative edges allowed, single source, detects negative cycles. `O(VE)`.\n- **Floyd-Warshall**: all-pairs shortest paths, small/medium dense graph. `O(V^3)` time and `O(V^2)` space.",
        ),
        heading("Dijkstra's invariant"),
        prose(
          "Dijkstra keeps a tentative distance `dist[v]`: the best cost discovered so far from the start to `v`. The priority queue always pops the node with the smallest tentative distance.",
        ),
        heading("Dijkstra C++ sketch"),
        prose(
          "```cpp\nconst long long INF = 4e18;\nvector<long long> dist(n, INF);\npriority_queue<pair<long long,int>, vector<pair<long long,int>>, greater<>> pq;\n\ndist[start] = 0;\npq.push({0, start});\n\nwhile (!pq.empty()) {\n    auto [d, u] = pq.top(); pq.pop();\n    if (d != dist[u]) continue; // stale queue entry\n\n    for (auto [v, w] : adj[u]) {\n        if (dist[u] + w < dist[v]) {\n            dist[v] = dist[u] + w;\n            pq.push({dist[v], v});\n        }\n    }\n}\n```",
        ),
        derive(
          [
            step("pop u with smallest dist[u]", "No unsettled node currently has a cheaper known route."),
            step("all edge weights are non-negative", "Going through any other unsettled node can only add cost."),
            step("therefore dist[u] cannot improve later", "Any alternative path would be at least as expensive."),
            step("relax every edge u → v", "Try improving neighbours through u."),
          ],
          "When a node is popped, its shortest distance is final",
          "The core proof behind Dijkstra",
        ),
        callout(
          "warning",
          "Dijkstra requires **non-negative weights**. With negative edges, a supposedly final node might become cheaper later. Algorithms like Bellman-Ford handle that different world.",
        ),
        heading("A* and admissible heuristics"),
        prose(
          "A* orders the queue by `f(n)=g(n)+h(n)`: `g(n)` is the exact cost from the start to `n`; `h(n)` estimates the remaining cost to the goal. The heuristic must be **admissible** (never overestimate) for A* to preserve optimality. On a 4-neighbour grid, Manhattan distance is admissible because every move changes row or column by at most one.",
        ),
        heading("Heuristic examples"),
        prose(
          "For a 4-direction grid, **Manhattan distance** `abs(r1-r2)+abs(c1-c2)` is admissible. For an 8-direction grid with diagonal moves, Euclidean or octile distance is usually more appropriate. A bad heuristic that overestimates may be faster, but it can lose the optimal-path guarantee.",
        ),
        derive(
          [
            step("h(n) ≤ true remaining cost", "The heuristic is optimistic."),
            step("f(n)=g(n)+h(n)", "Estimated total path cost through n."),
            step("A* expands lowest f first", "It prefers paths that could still be optimal."),
            step("when the goal is popped", "No frontier path can beat its true cost."),
          ],
          "A* is optimal with an admissible heuristic",
          "Optimism keeps the proof safe",
        ),
        heading("Complexity"),
        prose(
          "With adjacency lists, BFS and DFS are `O(V+E)` because every vertex and edge is considered a constant number of times. Dijkstra and A* depend on the priority queue; with a binary heap they are typically `O((V+E) log V)`. A* often visits far fewer vertices in practice, but its worst-case bound can still match Dijkstra.",
        ),
        callout(
          "intuition",
          "A* = Dijkstra + a goal heuristic. With a good (admissible) heuristic it finds the same optimal path while expanding a fraction of the nodes.",
        ),
        callout(
          "note",
          "Open the graph view in the visualizer and run Dijkstra vs A* on the same start/goal — A* visibly explores less.",
        ),
      ],
    ),
    lesson(
      "bellman-ford",
      "Bellman-Ford",
      "Shortest paths with negative edges, plus negative-cycle detection.",
      9,
      [
        heading("Concept"),
        prose(
          "**Bellman-Ford** solves single-source shortest paths even when some edges have negative weights. It is slower than Dijkstra, but it works in a more general setting and can detect **negative cycles** reachable from the start.",
        ),
        viz("bellman-ford", { title: "Bellman-Ford simulation: repeated relaxation" }),
        heading("Relaxation"),
        prose(
          "Relaxation is the one operation all shortest-path algorithms share: if going through `u` improves the best known distance to `v`, update it.\n\n```cpp\nif (dist[u] + w < dist[v]) {\n    dist[v] = dist[u] + w;\n}\n```",
        ),
        heading("Why V-1 passes are enough"),
        derive(
          [
            step("a shortest simple path uses at most V−1 edges", "If it repeats a vertex, it contains a cycle."),
            step("pass 1 finds best paths using ≤1 edge", "Every edge is relaxed once."),
            step("pass k finds best paths using ≤k edges", "Induction: extend a best ≤k−1 edge path by one edge."),
            step("after V−1 passes", "All simple shortest paths have had enough edges to appear."),
          ],
          "O(VE)",
          "Bellman-Ford dynamic-programming view",
        ),
        heading("Negative cycle detection"),
        prose(
          "After `V−1` passes, do one more pass. If any edge can still relax, the graph has a reachable negative cycle. Distances are not well-defined because looping around that cycle keeps making the path cheaper forever.",
        ),
        heading("C++ sketch"),
        prose(
          "```cpp\nstruct Edge { int u, v; long long w; };\nvector<long long> dist(n, INF);\ndist[start] = 0;\n\nfor (int pass = 1; pass <= n - 1; pass++) {\n    for (auto [u, v, w] : edges) {\n        if (dist[u] != INF && dist[u] + w < dist[v]) {\n            dist[v] = dist[u] + w;\n        }\n    }\n}\n\nbool negativeCycle = false;\nfor (auto [u, v, w] : edges) {\n    if (dist[u] != INF && dist[u] + w < dist[v]) {\n        negativeCycle = true;\n    }\n}\n```",
        ),
        callout(
          "complexity",
          "`O(VE)` time, `O(V)` space. Use Bellman-Ford when negative edges matter or when you need negative-cycle detection.",
        ),
      ],
    ),
    lesson(
      "floyd-warshall",
      "Floyd-Warshall",
      "All-pairs shortest paths with a compact dynamic-programming recurrence.",
      9,
      [
        heading("Concept"),
        prose(
          "**Floyd-Warshall** computes shortest paths between **every pair** of vertices. Instead of choosing one source, it builds a `dist[i][j]` table and gradually allows more intermediate vertices on the path.",
        ),
        viz("floyd-warshall", { title: "Floyd-Warshall simulation: matrix DP" }),
        heading("The recurrence"),
        derive(
          [
            step("dist[i][j]", "Best known path from i to j."),
            step("allow vertices 0..k as intermediates", "Grow the set of allowed middle vertices one at a time."),
            step("either path does not use k", "Then dist[i][j] stays as it was."),
            step("or path uses k", "Then it is dist[i][k] + dist[k][j]."),
            step("take the minimum", "The better of those two cases becomes the new answer."),
          ],
          "dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])",
          "Floyd-Warshall transition",
        ),
        heading("C++ sketch"),
        prose(
          "```cpp\nvector<vector<long long>> dist(n, vector<long long>(n, INF));\nfor (int i = 0; i < n; i++) dist[i][i] = 0;\nfor (auto [u, v, w] : edges) dist[u][v] = min(dist[u][v], w);\n\nfor (int k = 0; k < n; k++) {\n    for (int i = 0; i < n; i++) {\n        for (int j = 0; j < n; j++) {\n            if (dist[i][k] == INF || dist[k][j] == INF) continue;\n            dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j]);\n        }\n    }\n}\n```",
        ),
        heading("When to use it"),
        prose(
          "Floyd-Warshall is excellent when `V` is small to medium and you need many source-target answers. It is especially clean for dense graphs, reachability variants, transitive closure, and graph problems where the all-pairs table becomes a building block.",
        ),
        heading("Complexity and negative cycles"),
        prose(
          "Time is `O(V³)` because of the three nested loops over `k`, `i`, and `j`. Space is `O(V²)` for the distance table. After the algorithm, if any `dist[i][i] < 0`, vertex `i` can reach a negative cycle.",
        ),
        callout(
          "intuition",
          "Bellman-Ford repeats over edges; Floyd-Warshall repeats over allowed middle vertices. Both are dynamic programming, but their tables answer different questions.",
        ),
      ],
    ),
  ],
);
