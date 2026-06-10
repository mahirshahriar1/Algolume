import type { Problem } from "../types";

export const dpProblems: Problem[] = [
  {
    id: "climbing-stairs",
    title: "Climbing Stairs",
    topic: "dynamic-programming",
    difficulty: "easy",
    summary: "How many ways to climb n stairs taking 1 or 2 steps? (1D DP)",
    statement: `You climb a staircase of \`n\` steps, taking **1 or 2** steps at a time. Return
the number of distinct ways to reach the top. The ways to reach step \`i\` equal
the ways to reach \`i-1\` plus \`i-2\` — it's the Fibonacci recurrence.`,
    funcName: "climbing_stairs",
    starter: `def climbing_stairs(n):
    # Number of ways to climb n stairs taking 1 or 2 steps
    pass
`,
    examples: [
      { input: [2], expected: 2, explain: "1+1 or 2." },
      { input: [3], expected: 3, explain: "1+1+1, 1+2, 2+1." },
      { input: [5], expected: 8 },
    ],
    tests: [
      { input: [1], expected: 1 },
      { input: [0], expected: 1 },
      { input: [10], expected: 89 },
      { input: [20], expected: 10946 },
    ],
    hints: [
      "ways(i) = ways(i-1) + ways(i-2); base ways(0)=ways(1)=1.",
      "You only need the last two values — roll them forward to use O(1) space.",
    ],
    solution: `def climbing_stairs(n):
    a, b = 1, 1
    for _ in range(n):
        a, b = b, a + b
    return a
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/dynamic-programming/dp-1d",
    tags: ["dp", "1d", "fibonacci"],
  },
  {
    id: "coin-change",
    title: "Coin Change",
    topic: "dynamic-programming",
    difficulty: "medium",
    summary: "Fewest coins to make an amount (1D DP over amounts).",
    statement: `Given coin denominations \`coins\` and a target \`amount\`, return the **minimum
number of coins** that sum to \`amount\`, or \`-1\` if it can't be made. Build a 1D
table \`dp[a]\` = fewest coins for amount \`a\`, trying every coin for each amount.`,
    funcName: "coin_change",
    starter: `def coin_change(coins, amount):
    # Fewest coins to make amount, or -1 if impossible
    pass
`,
    examples: [
      { input: [[1, 2, 5], 11], expected: 3, explain: "5 + 5 + 1." },
      { input: [[2], 3], expected: -1 },
      { input: [[1], 0], expected: 0 },
    ],
    tests: [
      { input: [[1, 2, 5], 100], expected: 20 },
      { input: [[2, 5, 10, 1], 27], expected: 4 },
      { input: [[186, 419, 83, 408], 6249], expected: 20 },
      { input: [[5], 7], expected: -1 },
    ],
    hints: [
      "dp[0] = 0; dp[a] starts at infinity.",
      "For each amount a, try every coin c ≤ a: dp[a] = min(dp[a], dp[a-c] + 1).",
      "If dp[amount] is still infinity at the end, return -1.",
    ],
    solution: `def coin_change(coins, amount):
    INF = float("inf")
    dp = [0] + [INF] * amount
    for a in range(1, amount + 1):
        for c in coins:
            if c <= a:
                dp[a] = min(dp[a], dp[a - c] + 1)
    return dp[amount] if dp[amount] != INF else -1
`,
    complexity: { time: "O(amount · k)", space: "O(amount)" },
    lesson: "/learn/dynamic-programming/dp-1d",
    tags: ["dp", "1d", "unbounded knapsack"],
  },
  {
    id: "longest-common-subsequence",
    title: "Longest Common Subsequence",
    topic: "dynamic-programming",
    difficulty: "hard",
    summary: "Length of the longest subsequence shared by two strings (2D DP).",
    statement: `Given strings \`a\` and \`b\`, return the length of their **longest common
subsequence** (characters in order, not necessarily contiguous). Fill a 2D table:
when characters match, extend the diagonal; otherwise take the best of dropping a
character from either string.`,
    funcName: "longest_common_subsequence",
    starter: `def longest_common_subsequence(a, b):
    # Length of the longest common subsequence of a and b
    pass
`,
    examples: [
      { input: ["abcde", "ace"], expected: 3, explain: "'ace'." },
      { input: ["abc", "abc"], expected: 3 },
      { input: ["abc", "def"], expected: 0 },
    ],
    tests: [
      { input: ["", "abc"], expected: 0 },
      { input: ["bl", "yby"], expected: 1 },
      { input: ["oxcpqrsvwf", "shmtulqrypy"], expected: 2 },
      { input: ["aaaa", "aa"], expected: 2 },
    ],
    hints: [
      "dp[i][j] = LCS of the first i chars of a and first j of b.",
      "If a[i-1] == b[j-1]: dp[i][j] = dp[i-1][j-1] + 1.",
      "Else dp[i][j] = max(dp[i-1][j], dp[i][j-1]).",
    ],
    solution: `def longest_common_subsequence(a, b):
    m, n = len(a), len(b)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if a[i - 1] == b[j - 1]:
                dp[i][j] = dp[i - 1][j - 1] + 1
            else:
                dp[i][j] = max(dp[i - 1][j], dp[i][j - 1])
    return dp[m][n]
`,
    complexity: { time: "O(m · n)", space: "O(m · n)" },
    lesson: "/learn/dynamic-programming/dp-2d",
    tags: ["dp", "2d", "strings"],
  },
  {
    id: "min-assignment-cost",
    title: "Assignment Problem (Bitmask DP)",
    topic: "dynamic-programming",
    difficulty: "hard",
    summary: "Assign n workers to n tasks at minimum cost — dp over subsets.",
    statement: `Given an \`n × n\` matrix \`cost\` where \`cost[i][j]\` is the cost of giving task
\`j\` to worker \`i\`, assign **each worker a distinct task** to minimize total cost.

Use **bitmask DP**: \`dp[mask]\` = the min cost to assign the first \`popcount(mask)\`
workers, where \`mask\` is the set of tasks already used. Worker \`i = popcount(mask)\`
tries each unused task \`j\`.`,
    funcName: "min_assignment_cost",
    starter: `def min_assignment_cost(cost):
    # Min total cost to assign each worker a distinct task (bitmask DP)
    pass
`,
    examples: [
      { input: [[[9, 11, 14], [6, 15, 13], [12, 13, 6]]], expected: 23, explain: "w0→t1, w1→t0, w2→t2 = 11+6+6." },
      { input: [[[1, 2], [3, 4]]], expected: 5 },
    ],
    tests: [
      { input: [[[1]]], expected: 1 },
      { input: [[[3, 1], [2, 4]]], expected: 3 },
      { input: [[[10, 2, 8], [9, 7, 6], [4, 3, 5]]], expected: 12 },
    ],
    hints: [
      "Let mask be the set of tasks already assigned; the worker to place is popcount(mask).",
      "dp[mask | (1<<j)] = min(..., dp[mask] + cost[worker][j]) for each unused task j.",
      "Start dp[0] = 0; the answer is dp[(1<<n) - 1].",
    ],
    solution: `def min_assignment_cost(cost):
    n = len(cost)
    INF = float("inf")
    dp = [INF] * (1 << n)
    dp[0] = 0
    for mask in range(1 << n):
        if dp[mask] == INF:
            continue
        worker = bin(mask).count("1")
        if worker >= n:
            continue
        for j in range(n):
            if not (mask >> j) & 1:
                nm = mask | (1 << j)
                dp[nm] = min(dp[nm], dp[mask] + cost[worker][j])
    return dp[(1 << n) - 1]
`,
    complexity: { time: "O(2ⁿ · n)", space: "O(2ⁿ)" },
    lesson: "/learn/dynamic-programming/bitmask-dp",
    tags: ["bitmask dp", "dp"],
  },
  {
    id: "tsp-held-karp",
    title: "Travelling Salesman (Held-Karp)",
    topic: "dynamic-programming",
    difficulty: "hard",
    summary: "Shortest tour visiting every city once — exact, via bitmask DP.",
    statement: `Given an \`n × n\` distance matrix \`dist\` (\`dist[i][j]\` = distance from city
\`i\` to \`j\`), return the length of the **shortest tour** that starts at city 0,
visits **every** city exactly once, and returns to 0.

Use **Held-Karp**: \`dp[mask][i]\` = the cheapest path that starts at 0, visits
exactly the set \`mask\`, and ends at \`i\`. It's exponential (\`O(2ⁿ·n²)\`) — TSP is
NP-hard — but exact for small \`n\`.`,
    funcName: "held_karp",
    starter: `def held_karp(dist):
    # Length of the shortest tour from city 0 visiting all cities and returning
    pass
`,
    examples: [
      { input: [[[0, 10, 15, 20], [10, 0, 35, 25], [15, 35, 0, 30], [20, 25, 30, 0]]], expected: 80, explain: "0→1→3→2→0 = 10+25+30+15." },
      { input: [[[0, 1], [1, 0]]], expected: 2 },
    ],
    tests: [
      { input: [[[0, 2, 9, 10], [1, 0, 6, 4], [15, 7, 0, 8], [6, 3, 12, 0]]], expected: 21 },
      { input: [[[0, 3, 4, 2, 7], [3, 0, 4, 6, 3], [4, 4, 0, 5, 8], [2, 6, 5, 0, 6], [7, 3, 8, 6, 0]]], expected: 19 },
    ],
    hints: [
      "dp[mask][i]: cheapest path starting at 0, covering exactly mask, ending at i. Base dp[{0}][0] = 0.",
      "Transition: for j not in mask, dp[mask | (1<<j)][j] = min(..., dp[mask][i] + dist[i][j]).",
      "Answer: min over i of dp[full][i] + dist[i][0] to close the tour.",
    ],
    solution: `def held_karp(dist):
    n = len(dist)
    if n == 1:
        return 0
    INF = float("inf")
    dp = [[INF] * n for _ in range(1 << n)]
    dp[1][0] = 0  # mask {0}, ending at 0
    for mask in range(1 << n):
        if not (mask & 1):
            continue
        for i in range(n):
            if dp[mask][i] == INF:
                continue
            for j in range(n):
                if mask & (1 << j):
                    continue
                nm = mask | (1 << j)
                cand = dp[mask][i] + dist[i][j]
                if cand < dp[nm][j]:
                    dp[nm][j] = cand
    full = (1 << n) - 1
    return min(dp[full][i] + dist[i][0] for i in range(1, n))
`,
    complexity: { time: "O(2ⁿ · n²)", space: "O(2ⁿ · n)" },
    lesson: "/learn/dynamic-programming/bitmask-dp",
    tags: ["bitmask dp", "tsp", "np-hard"],
  },
];
