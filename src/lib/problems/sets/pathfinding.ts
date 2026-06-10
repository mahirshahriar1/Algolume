import type { Problem } from "../types";

// Pathfinding problems operate on integer grids (list of lists) — the BFS/DFS
// engine the visualizers teach, applied to classic interview problems.

export const pathfindingProblems: Problem[] = [
  {
    id: "number-of-islands",
    title: "Number of Islands",
    topic: "pathfinding",
    difficulty: "easy",
    summary: "Count connected groups of land in a grid.",
    statement: `Given a grid of \`0\` (water) and \`1\` (land), return the number of **islands**.
An island is a group of \`1\`s connected **4-directionally** (up/down/left/right).
Flood-fill each unvisited land cell with BFS or DFS and count how many fills you
start.`,
    funcName: "num_islands",
    starter: `def num_islands(grid):
    # Return the count of 4-directionally connected groups of 1s
    pass
`,
    examples: [
      { input: [[[1, 1, 0, 0], [1, 0, 0, 1], [0, 0, 1, 1]]], expected: 2, explain: "A left L-shape and a right block." },
      { input: [[[1]]], expected: 1 },
    ],
    tests: [
      { input: [[[1, 1, 1], [0, 1, 0], [1, 0, 1]]], expected: 3 },
      { input: [[[0]]], expected: 0 },
      { input: [[[1, 1, 1], [1, 1, 1]]], expected: 1 },
      { input: [[]], expected: 0 },
    ],
    hints: [
      "Scan every cell; when you hit an unvisited 1, that's a new island.",
      "Flood-fill from it (BFS/DFS), marking every reachable 1 as visited.",
      "Only count the cells where you *start* a fill.",
    ],
    solution: `def num_islands(grid):
    if not grid:
        return 0
    from collections import deque
    R, C = len(grid), len(grid[0])
    seen = set()
    count = 0
    for i in range(R):
        for j in range(C):
            if grid[i][j] == 1 and (i, j) not in seen:
                count += 1
                q = deque([(i, j)]); seen.add((i, j))
                while q:
                    x, y = q.popleft()
                    for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < R and 0 <= ny < C and grid[nx][ny] == 1 and (nx, ny) not in seen:
                            seen.add((nx, ny)); q.append((nx, ny))
    return count
`,
    complexity: { time: "O(R·C)", space: "O(R·C)" },
    lesson: "/learn/pathfinding/search-a-grid",
    tags: ["bfs", "dfs", "flood fill"],
  },
  {
    id: "shortest-grid-path",
    title: "Shortest Path in a Grid",
    topic: "pathfinding",
    difficulty: "medium",
    summary: "Fewest cells from top-left to bottom-right (BFS finds it).",
    statement: `Given a grid of \`0\` (open) and \`1\` (blocked), return the length of the
**shortest path** from the top-left \`(0,0)\` to the bottom-right corner, moving
**4-directionally** through open cells. Length counts the cells visited (start and
end included). Return \`-1\` if there is no path. BFS explores by distance, so the
first time it reaches the goal is the shortest path.`,
    funcName: "shortest_grid_path",
    starter: `def shortest_grid_path(grid):
    # BFS from (0,0) to bottom-right through 0-cells; return path length or -1
    pass
`,
    examples: [
      { input: [[[0, 0, 1], [1, 0, 0], [1, 1, 0]]], expected: 5, explain: "Down the open diagonal: 5 cells." },
      { input: [[[0, 1], [1, 0]]], expected: -1, explain: "Diagonal moves aren't allowed." },
    ],
    tests: [
      { input: [[[0, 0, 0], [0, 0, 0]]], expected: 4 },
      { input: [[[0]]], expected: 1 },
      { input: [[[1, 0], [0, 0]]], expected: -1 },
    ],
    hints: [
      "If the start or goal cell is blocked, return -1 immediately.",
      "BFS with a queue of (row, col, distance); the start has distance 1.",
      "The first time you dequeue the goal, that distance is the answer.",
    ],
    solution: `def shortest_grid_path(grid):
    if not grid or grid[0][0] == 1:
        return -1
    from collections import deque
    R, C = len(grid), len(grid[0])
    if grid[R - 1][C - 1] == 1:
        return -1
    q = deque([(0, 0, 1)]); seen = {(0, 0)}
    while q:
        x, y, d = q.popleft()
        if x == R - 1 and y == C - 1:
            return d
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < R and 0 <= ny < C and grid[nx][ny] == 0 and (nx, ny) not in seen:
                seen.add((nx, ny)); q.append((nx, ny, d + 1))
    return -1
`,
    complexity: { time: "O(R·C)", space: "O(R·C)" },
    lesson: "/learn/pathfinding/search-a-grid",
    tags: ["bfs", "shortest path"],
  },
  {
    id: "rotting-oranges",
    title: "Rotting Oranges",
    topic: "pathfinding",
    difficulty: "hard",
    summary: "Multi-source BFS: how long until every fresh orange rots?",
    statement: `In a grid, \`0\` is empty, \`1\` is a fresh orange, \`2\` is rotten. Every minute,
a rotten orange rots any **4-directionally adjacent** fresh orange. Return the
number of minutes until no orange is fresh, or \`-1\` if some fresh orange can
never rot. This is **multi-source BFS** — start from *all* rotten oranges at once.`,
    funcName: "oranges_rotting",
    starter: `def oranges_rotting(grid):
    # Minutes until no fresh orange remains, or -1 if impossible
    pass
`,
    examples: [
      { input: [[[2, 1, 1], [1, 1, 0], [0, 1, 1]]], expected: 4 },
      { input: [[[2, 1, 1], [0, 1, 1], [1, 0, 1]]], expected: -1, explain: "The bottom-left orange is isolated." },
    ],
    tests: [
      { input: [[[0, 2]]], expected: 0 },
      { input: [[[2, 2], [1, 1]]], expected: 1 },
      { input: [[[0, 0]]], expected: 0 },
      { input: [[[1]]], expected: -1 },
    ],
    hints: [
      "Seed the BFS queue with every rotten orange (time 0) and count the fresh ones.",
      "Each BFS layer is one minute; rot adjacent fresh oranges and decrement the fresh count.",
      "At the end, if any fresh remain it's -1; otherwise the answer is the last minute reached.",
    ],
    solution: `def oranges_rotting(grid):
    from collections import deque
    R, C = len(grid), len(grid[0])
    q = deque(); fresh = 0
    for i in range(R):
        for j in range(C):
            if grid[i][j] == 2:
                q.append((i, j, 0))
            elif grid[i][j] == 1:
                fresh += 1
    grid = [row[:] for row in grid]
    t = 0
    while q:
        x, y, t = q.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < R and 0 <= ny < C and grid[nx][ny] == 1:
                grid[nx][ny] = 2; fresh -= 1; q.append((nx, ny, t + 1))
    return -1 if fresh > 0 else t
`,
    complexity: { time: "O(R·C)", space: "O(R·C)" },
    lesson: "/learn/pathfinding/search-a-grid",
    tags: ["bfs", "multi-source"],
  },
];
