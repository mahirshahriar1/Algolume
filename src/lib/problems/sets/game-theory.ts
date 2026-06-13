import type { Problem } from "../types";

export const gameTheoryProblems: Problem[] = [
  {
    id: "nim-winner",
    title: "Nim — Who Wins?",
    topic: "game-theory",
    difficulty: "easy",
    summary: "First player wins iff the XOR of pile sizes is non-zero.",
    statement: `In **Nim**, players alternate removing any positive number of stones from a
**single** pile; the player who takes the last stone wins. Given the pile sizes,
return \`True\` if the **first player** wins with perfect play. The theorem: the
first player wins **iff the XOR of all pile sizes is non-zero**.`,
    funcName: "nim_winner",
    starter: `def nim_winner(piles):
    # True if the first player wins (normal-play Nim)
    pass
`,
    examples: [
      { input: [[1, 2, 3]], expected: false, explain: "1^2^3 = 0 → first player loses." },
      { input: [[1, 2, 4]], expected: true, explain: "1^2^4 = 7 ≠ 0 → first player wins." },
    ],
    tests: [
      { input: [[0, 0]], expected: false },
      { input: [[5]], expected: true },
      { input: [[3, 3]], expected: false },
      { input: [[1, 1, 1]], expected: true },
    ],
    hints: [
      "Compute the XOR (nim-sum) of all pile sizes.",
      "Non-zero nim-sum ⟹ the first player can move to a zero nim-sum, which is losing for the opponent.",
    ],
    solution: `def nim_winner(piles):
    x = 0
    for p in piles:
        x ^= p
    return x != 0
`,
    complexity: { time: "O(n)", space: "O(1)" },
    lesson: "/learn/game-theory/nim-grundy",
    tags: ["game theory", "nim", "xor"],
  },
  {
    id: "subtraction-game",
    title: "Subtraction Game",
    topic: "game-theory",
    difficulty: "medium",
    summary: "Win/Lose DP: can the first player win from n with allowed moves?",
    statement: `Starting from \`n\` stones, players alternate removing a number of stones in
the set \`moves\`; the last to move wins. Return \`True\` if the **first player** wins.
A position is **Winning** if **some** move leads to a **Losing** position, and
\`0\` (no move available) is Losing.`,
    funcName: "can_win_subtraction",
    starter: `def can_win_subtraction(n, moves):
    # True if the player to move from n wins (normal play)
    pass
`,
    examples: [
      { input: [4, [1, 2]], expected: true },
      { input: [3, [1, 2]], expected: false, explain: "From 3 you can only reach 1 or 2, both Winning." },
    ],
    tests: [
      { input: [0, [1, 2]], expected: false },
      { input: [10, [1, 2]], expected: true },
      { input: [5, [2, 3]], expected: false },
      { input: [6, [1, 3, 4]], expected: true },
    ],
    hints: [
      "Fill win[0..n] bottom-up; win[0] = False.",
      "win[i] = True if any (i - m) for m in moves (m ≤ i) is a losing position.",
      "Return win[n].",
    ],
    solution: `def can_win_subtraction(n, moves):
    win = [False] * (n + 1)
    for i in range(1, n + 1):
        win[i] = any(m <= i and not win[i - m] for m in moves)
    return win[n]
`,
    complexity: { time: "O(n·k)", space: "O(n)" },
    lesson: "/learn/game-theory/game-basics",
    tags: ["game theory", "dp"],
  },
  {
    id: "grundy-number",
    title: "Grundy Number (Sprague–Grundy)",
    topic: "game-theory",
    difficulty: "hard",
    summary: "Compute the Grundy value of a subtraction-game position.",
    statement: `For an impartial game, the **Grundy number** of a position is the **mex**
(minimum excludant — the smallest non-negative integer **not** among) the Grundy
numbers of the positions reachable in one move. Given \`n\` and the allowed
\`moves\`, return the Grundy number of position \`n\`. A position is **losing** iff
its Grundy number is \`0\`; for a **sum** of independent games, XOR their Grundy
numbers (Sprague–Grundy).`,
    funcName: "grundy_number",
    starter: `def grundy_number(n, moves):
    # Grundy value of position n in the subtraction game
    pass
`,
    examples: [
      { input: [3, [1, 2]], expected: 0, explain: "Grundy cycles 0,1,2,0,… so g[3]=0 (losing)." },
      { input: [5, [1, 2]], expected: 2 },
    ],
    tests: [
      { input: [0, [1, 2]], expected: 0 },
      { input: [4, [1, 2]], expected: 1 },
      { input: [7, [1, 3, 4]], expected: 0 },
      { input: [10, [2, 4, 7]], expected: 2 },
    ],
    hints: [
      "g[0] = 0; compute g[i] from the reachable g-values.",
      "mex(S) = the smallest non-negative integer not in the set S.",
      "g[i] = mex{ g[i-m] for m in moves if m ≤ i }.",
    ],
    solution: `def grundy_number(n, moves):
    g = [0] * (n + 1)
    for i in range(1, n + 1):
        reachable = {g[i - m] for m in moves if m <= i}
        mex = 0
        while mex in reachable:
            mex += 1
        g[i] = mex
    return g[n]
`,
    complexity: { time: "O(n·k)", space: "O(n)" },
    lesson: "/learn/game-theory/nim-grundy",
    tags: ["game theory", "grundy", "mex"],
  },
];
