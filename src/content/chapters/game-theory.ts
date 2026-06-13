import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const gameTheory = chapter(
  "game-theory",
  "Game theory",
  "Impartial games: winning/losing positions, Nim, and Sprague–Grundy numbers.",
  "Dices",
  [
    lesson(
      "game-basics",
      "Winning & losing positions",
      "Impartial games, normal play, and computing W/L positions bottom-up.",
      10,
      [
        heading("Impartial games"),
        prose(
          "An **impartial game** is a two-player, perfect-information game where the **available moves depend only on the position**, not on whose turn it is (so both players have the same options). Under **normal play**, the player who **cannot move loses**. Many take-away and stone games fit this mould.",
        ),
        heading("Winning and losing positions"),
        prose(
          "Label every position **W** (the player to move can force a win) or **L** (the player to move will lose against best play). Two rules define them:",
        ),
        prose(
          "- A position with **no moves** is **L** (you just lost).\n- A position is **W** if **some** move leads to an **L** position (hand the loss to your opponent).\n- A position is **L** if **every** move leads to a **W** position.",
        ),
        heading("The subtraction game"),
        prose(
          "From a pile of `n` stones, each move removes a count in a fixed set (e.g. `{1, 2}`); last to move wins. Compute `W/L` bottom-up from `0`. With moves `{1, 2}`, the pattern is `L, W, W, L, W, W, …` — you lose exactly when `n` is a multiple of 3.",
        ),
        viz("game-theory", { variant: "wl", title: "Win/Lose positions filled from the terminal state" }),
        derive(
          [
            step("win[0] = L", "No move ⟹ you lose."),
            step("win[i] = W if any win[i−m] = L", "You can hand your opponent a loss."),
            step("otherwise win[i] = L", "Every move helps the opponent."),
          ],
          "O(n · |moves|)",
          "Backward induction on positions",
        ),
        callout(
          "intuition",
          "Always think **backwards from the end**. The terminal position's status is known; every other position is decided by the positions one move away. This is the same DP-over-states idea as everywhere else.",
        ),
        problem("subtraction-game"),
      ],
    ),
    lesson(
      "nim-grundy",
      "Nim & Sprague–Grundy",
      "The XOR rule for Nim and Grundy numbers that compose independent games.",
      12,
      [
        heading("Nim"),
        prose(
          "In **Nim**, several piles of stones; a move removes any positive number from **one** pile; last to move wins. The remarkable theorem: the position is **losing** (for the player to move) **iff the XOR of all pile sizes is 0**. That XOR is called the **nim-sum**.",
        ),
        derive(
          [
            step("nim-sum = p₁ ⊕ p₂ ⊕ … ⊕ pₖ", "XOR of the pile sizes."),
            step("nim-sum = 0 ⟹ Losing", "Any move makes it non-zero."),
            step("nim-sum ≠ 0 ⟹ Winning", "You can always move to make it 0."),
          ],
          "First player wins ⟺ nim-sum ≠ 0",
          "The Nim theorem",
        ),
        heading("Grundy numbers (mex)"),
        prose(
          "Every impartial game position has a **Grundy number** (nimber): the **mex** — *minimum excludant*, the smallest non-negative integer not present — of the Grundy numbers of positions reachable in one move. A position is **losing iff its Grundy number is 0**, which generalises the W/L labels to a number.",
        ),
        prose(
          "```\ng(position) = mex{ g(next) for next in moves(position) }\nmex(S) = smallest non-negative integer not in S\n```",
        ),
        viz("game-theory", { variant: "grundy", title: "Grundy numbers via mex (0 ⟺ losing)" }),
        heading("Sprague–Grundy: summing games"),
        prose(
          "The **Sprague–Grundy theorem** says any impartial game equals a single Nim pile of size `g`. For a game that's the **sum of independent subgames** (you move in exactly one each turn), the Grundy number of the whole is the **XOR** of the subgames' Grundy numbers. So you analyse each component, then XOR — Nim is just the special case where each pile's Grundy number is its size.",
        ),
        callout(
          "warning",
          "These results are for **normal play** (last move wins). **Misère** play (last move *loses*) needs different analysis — don't assume the XOR rule carries over unchanged.",
        ),
        problem("nim-winner"),
        problem("grundy-number"),
      ],
    ),
  ],
);
