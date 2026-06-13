/**
 * Combinatorial game theory on the subtraction game: positions 0..n, a move
 * removes m ∈ moves stones, last to move wins (normal play). Compute either
 * Win/Lose status or Grundy numbers bottom-up, showing each position's
 * dependencies (the positions reachable in one move).
 */

export type GameMode = "wl" | "grundy";

export interface GameCell {
  text: string;
  role: "default" | "win" | "lose" | "current" | "dep";
}

export interface GameFrame {
  mode: GameMode;
  cells: GameCell[]; // positions 0..n
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

export const GAME_LIMITS = { min: 6, max: 24 };

export const GAME_CODE: Record<GameMode, string[]> = {
  wl: [
    "win[0] = False           # no move ⟹ you lose",
    "for i in 1..n:",
    "    win[i] = any(not win[i-m]   # can reach a losing pos",
    "                 for m in moves if m <= i)",
  ],
  grundy: [
    "g[0] = 0",
    "for i in 1..n:",
    "    reachable = { g[i-m] for m in moves if m <= i }",
    "    g[i] = mex(reachable)   # smallest int not present",
  ],
};

export function buildGameFrames(mode: GameMode, nRaw: number, moves: number[]): GameFrame[] {
  const n = Math.max(GAME_LIMITS.min, Math.min(GAME_LIMITS.max, Math.floor(nRaw)));
  const ms = [...new Set(moves.filter((m) => m > 0))].sort((a, b) => a - b);
  const frames: GameFrame[] = [];

  if (mode === "wl") {
    const win = Array(n + 1).fill(false);
    const emit = (cur: number, deps: number[], caption: string, lines: number[]) => {
      const cells: GameCell[] = Array.from({ length: n + 1 }, (_, i) => ({
        text: i <= cur ? (win[i] ? "W" : "L") : "",
        role: i === cur ? "current" : deps.includes(i) ? "dep" : i < cur ? (win[i] ? "win" : "lose") : "default",
      }));
      frames.push({ mode, cells, caption, lines, stats: [{ label: "Moves", value: ms.join(", ") }, { label: "n", value: n }] });
    };
    emit(0, [], `Position 0 is Losing (L): the player to move has no move and loses.`, [1]);
    for (let i = 1; i <= n; i++) {
      const deps = ms.filter((m) => m <= i).map((m) => i - m);
      win[i] = deps.some((d) => !win[d]);
      emit(i, deps, `From ${i} you can reach {${deps.join(", ")}}. ${win[i] ? "One is Losing → this is Winning (W)." : "All are Winning → this is Losing (L)."}`, [2, 3, 4]);
    }
    emit(n, [], `Position ${n} is ${win[n] ? "Winning — the first player has a strategy." : "Losing — the first player loses with best play."}`, [2]);
    return frames;
  }

  const g = Array(n + 1).fill(0);
  const emit = (cur: number, deps: number[], caption: string, lines: number[]) => {
    const cells: GameCell[] = Array.from({ length: n + 1 }, (_, i) => ({
      text: i <= cur ? String(g[i]) : "",
      role: i === cur ? "current" : deps.includes(i) ? "dep" : i < cur ? (g[i] === 0 ? "lose" : "win") : "default",
    }));
    frames.push({ mode, cells, caption, lines, stats: [{ label: "Moves", value: ms.join(", ") }, { label: "n", value: n }] });
  };
  emit(0, [], `Grundy g[0] = 0 (a terminal/losing position).`, [1]);
  for (let i = 1; i <= n; i++) {
    const deps = ms.filter((m) => m <= i).map((m) => i - m);
    const reach = new Set(deps.map((d) => g[d]));
    let mex = 0;
    while (reach.has(mex)) mex++;
    g[i] = mex;
    emit(i, deps, `g[${i}] = mex{${[...reach].sort((a, b) => a - b).join(", ")}} = ${mex}. (g=0 ⟺ losing.)`, [3, 4]);
  }
  emit(n, [], `g[${n}] = ${g[n]} — ${g[n] === 0 ? "losing" : "winning"} for the player to move.`, [4]);
  return frames;
}

export function gameCode(mode: GameMode): string[] {
  return GAME_CODE[mode];
}
