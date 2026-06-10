/**
 * Dynamic-programming table simulations. Each builder fills a DP table cell by
 * cell, marking the current cell and the cells its transition reads from, so the
 * dependency structure is visible. Three modes cover 1D and 2D shapes.
 */

export type DpMode = "coin" | "paths" | "edit" | "tsp";
export type DpRole = "default" | "filled" | "active" | "dep" | "result";

export interface DpCell {
  text: string;
  role: DpRole;
}

export interface DpFrame {
  mode: DpMode;
  rows: number;
  cols: number;
  cells: DpCell[]; // row-major, length rows*cols
  rowLabels?: string[];
  colLabels?: string[];
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

export const DP_LIMITS = {
  coinMaxAmount: 14,
  gridMax: 6,
  strMax: 7,
  tspMin: 3,
  tspMax: 4,
};

const INF = 1e9;
const fmt = (v: number) => (v >= INF / 2 ? "∞" : String(v));

export const DP_CODE: Record<DpMode, string[]> = {
  coin: [
    "dp = [0] + [INF] * amount",
    "for a in range(1, amount + 1):",
    "    for c in coins:",
    "        if c <= a:",
    "            dp[a] = min(dp[a], dp[a - c] + 1)",
    "return dp[amount]",
  ],
  paths: [
    "dp[0][0] = 1",
    "for i in range(rows):",
    "    for j in range(cols):",
    "        if i > 0: dp[i][j] += dp[i-1][j]",
    "        if j > 0: dp[i][j] += dp[i][j-1]",
    "return dp[rows-1][cols-1]",
  ],
  edit: [
    "dp[i][0] = i;  dp[0][j] = j",
    "for i in range(1, m + 1):",
    "    for j in range(1, n + 1):",
    "        if a[i-1] == b[j-1]:",
    "            dp[i][j] = dp[i-1][j-1]",
    "        else:",
    "            dp[i][j] = 1 + min(diag, up, left)",
    "return dp[m][n]",
  ],
  tsp: [
    "dp[{0}][0] = 0                  # start at city 0",
    "for mask containing city 0:",
    "    for i in mask:",
    "        for j not in mask:",
    "            nm = mask | (1<<j)",
    "            dp[nm][j] = min(dp[nm][j], dp[mask][i] + dist[i][j])",
    "answer = min(dp[full][i] + dist[i][0])",
  ],
};

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, Math.floor(n)));

/* ---- Coin change (1D) ----------------------------------------------------- */

export function buildCoinFrames(coins: number[], amount: number): DpFrame[] {
  const amt = clamp(amount, 1, DP_LIMITS.coinMaxAmount);
  const cs = coins.filter((c) => c > 0 && c <= amt).slice(0, 5);
  const dp = [0, ...Array(amt).fill(INF)];
  const frames: DpFrame[] = [];
  const colLabels = Array.from({ length: amt + 1 }, (_, i) => String(i));

  const emit = (caption: string, lines: number[], active = -1, deps: number[] = []) => {
    frames.push({
      mode: "coin",
      rows: 1,
      cols: amt + 1,
      cells: dp.map((v, i) => ({
        text: fmt(v),
        role: i === active ? "active" : deps.includes(i) ? "dep" : i === amt && caption.startsWith("Done") ? "result" : v < INF / 2 ? "filled" : "default",
      })),
      colLabels,
      caption,
      lines,
      stats: [
        { label: "Coins", value: cs.join(", ") || "—" },
        { label: "Target", value: amt },
        { label: "Answer", value: dp[amt] < INF / 2 ? dp[amt] : "—" },
      ],
    });
  };

  emit(`dp[0] = 0 (zero coins make amount 0); everything else starts at ∞.`, [1]);
  for (let a = 1; a <= amt; a++) {
    for (const c of cs) {
      if (c > a) continue;
      const cand = dp[a - c] >= INF / 2 ? INF : dp[a - c] + 1;
      emit(`dp[${a}] via coin ${c}: dp[${a - c}] + 1 = ${fmt(cand)} (best so far ${fmt(dp[a])}).`, [3, 4, 5], a, [a - c]);
      if (cand < dp[a]) dp[a] = cand;
    }
  }
  emit(
    dp[amt] < INF / 2 ? `Done — ${dp[amt]} coin(s) make ${amt}.` : `Done — amount ${amt} is impossible with these coins.`,
    [6],
    amt,
  );
  return frames;
}

/* ---- Unique paths (2D) ---------------------------------------------------- */

export function buildPathsFrames(rows: number, cols: number): DpFrame[] {
  const R = clamp(rows, 2, DP_LIMITS.gridMax);
  const C = clamp(cols, 2, DP_LIMITS.gridMax);
  const dp = Array.from({ length: R }, () => Array(C).fill(0));
  const frames: DpFrame[] = [];
  const idx = (i: number, j: number) => i * C + j;

  const emit = (caption: string, lines: number[], active = -1, deps: number[] = [], done = false) => {
    const cells: DpCell[] = [];
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        const k = idx(i, j);
        cells.push({
          text: dp[i][j] ? String(dp[i][j]) : i === 0 || j === 0 ? String(dp[i][j]) : "",
          role: k === active ? "active" : deps.includes(k) ? "dep" : done && i === R - 1 && j === C - 1 ? "result" : dp[i][j] ? "filled" : "default",
        });
      }
    }
    frames.push({
      mode: "paths",
      rows: R,
      cols: C,
      cells,
      caption,
      lines,
      stats: [
        { label: "Grid", value: `${R}×${C}` },
        { label: "Answer", value: dp[R - 1][C - 1] || "—" },
      ],
    });
  };

  emit(`Each cell counts paths from the top-left, moving only right or down.`, [1]);
  for (let i = 0; i < R; i++) {
    for (let j = 0; j < C; j++) {
      if (i === 0 && j === 0) {
        dp[i][j] = 1;
        emit(`dp[0][0] = 1 — one way to stand on the start.`, [1], idx(i, j));
        continue;
      }
      const deps: number[] = [];
      let v = 0;
      if (i > 0) { v += dp[i - 1][j]; deps.push(idx(i - 1, j)); }
      if (j > 0) { v += dp[i][j - 1]; deps.push(idx(i, j - 1)); }
      dp[i][j] = v;
      emit(`dp[${i}][${j}] = paths from above + paths from left = ${v}.`, [4, 5], idx(i, j), deps);
    }
  }
  emit(`Done — ${dp[R - 1][C - 1]} unique paths to the bottom-right.`, [6], idx(R - 1, C - 1), [], true);
  return frames;
}

/* ---- Edit distance (2D) --------------------------------------------------- */

export function buildEditFrames(a: string, b: string): DpFrame[] {
  const s = a.slice(0, DP_LIMITS.strMax);
  const t = b.slice(0, DP_LIMITS.strMax);
  const m = s.length;
  const n = t.length;
  const R = m + 1;
  const C = n + 1;
  const dp = Array.from({ length: R }, () => Array(C).fill(0));
  const frames: DpFrame[] = [];
  const idx = (i: number, j: number) => i * C + j;
  const rowLabels = ["∅", ...s.split("")];
  const colLabels = ["∅", ...t.split("")];

  const emit = (caption: string, lines: number[], active = -1, deps: number[] = [], done = false) => {
    const cells: DpCell[] = [];
    for (let i = 0; i < R; i++) {
      for (let j = 0; j < C; j++) {
        const k = idx(i, j);
        const computed = i === 0 || j === 0 || dp[i][j] !== 0 || (active >= 0 && k <= active);
        cells.push({
          text: computed ? String(dp[i][j]) : "",
          role: k === active ? "active" : deps.includes(k) ? "dep" : done && i === m && j === n ? "result" : computed ? "filled" : "default",
        });
      }
    }
    frames.push({
      mode: "edit",
      rows: R,
      cols: C,
      cells,
      rowLabels,
      colLabels,
      caption,
      lines,
      stats: [
        { label: "a → b", value: `${s || "∅"} → ${t || "∅"}` },
        { label: "Distance", value: dp[m][n] },
      ],
    });
  };

  for (let i = 0; i < R; i++) dp[i][0] = i;
  for (let j = 0; j < C; j++) dp[0][j] = j;
  emit(`Base cases: turning a prefix into ∅ (or ∅ into a prefix) costs that many edits.`, [1]);

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const match = s[i - 1] === t[j - 1];
      const deps = [idx(i - 1, j - 1), idx(i - 1, j), idx(i, j - 1)];
      if (match) {
        dp[i][j] = dp[i - 1][j - 1];
        emit(`'${s[i - 1]}' == '${t[j - 1]}' → no edit; copy the diagonal (${dp[i][j]}).`, [4, 5], idx(i, j), [idx(i - 1, j - 1)]);
      } else {
        dp[i][j] = 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
        emit(`'${s[i - 1]}' ≠ '${t[j - 1]}' → 1 + min(replace, delete, insert) = ${dp[i][j]}.`, [6, 7], idx(i, j), deps);
      }
    }
  }
  emit(`Done — edit distance is ${dp[m][n]}.`, [8], idx(m, n), [], true);
  return frames;
}

/* ---- Travelling salesman: Held-Karp bitmask DP (2D table) ----------------- */

const TSP_LABELS = "ABCDE".split("");

/** A small symmetric distance matrix for `n` cities placed on a circle. */
export function tspMatrix(n: number): number[][] {
  const c = clamp(n, DP_LIMITS.tspMin, DP_LIMITS.tspMax);
  const pts = Array.from({ length: c }, (_, i) => {
    const a = (i / c) * 2 * Math.PI;
    return { x: Math.cos(a), y: Math.sin(a) };
  });
  return pts.map((p, i) =>
    pts.map((q, j) => (i === j ? 0 : Math.max(1, Math.round(Math.hypot(p.x - q.x, p.y - q.y) * 6)))),
  );
}

const popcount = (m: number) => {
  let c = 0;
  while (m) { m &= m - 1; c++; }
  return c;
};

const maskStr = (m: number, n: number) => m.toString(2).padStart(n, "0");

/**
 * Held-Karp: dp[mask][i] = cheapest path that starts at city 0, visits exactly
 * the set `mask`, and ends at city `i`. We show it as a 2D table with one row per
 * end-city and one column per subset that contains city 0.
 */
export function buildTspFrames(dist: number[][]): DpFrame[] {
  const n = dist.length;
  const masks = Array.from({ length: 1 << n }, (_, m) => m).filter((m) => m & 1).sort((a, b) => popcount(a) - popcount(b) || a - b);
  const colOf = new Map(masks.map((m, idx) => [m, idx]));
  const cols = masks.length;
  const INFV = Infinity;
  const dp: number[][] = Array.from({ length: 1 << n }, () => Array(n).fill(INFV));
  dp[1][0] = 0;
  const frames: DpFrame[] = [];

  const cellIndex = (i: number, mask: number) => i * cols + colOf.get(mask)!;

  const emit = (caption: string, lines: number[], active = -1, deps: number[] = [], results: number[] = []) => {
    const cells: DpCell[] = [];
    for (let i = 0; i < n; i++) {
      for (let ci = 0; ci < cols; ci++) {
        const mask = masks[ci];
        const k = i * cols + ci;
        const v = dp[mask][i];
        const has = (mask >> i) & 1;
        cells.push({
          text: has && v !== INFV ? String(v) : "",
          role: k === active ? "active" : deps.includes(k) ? "dep" : results.includes(k) ? "result" : has && v !== INFV ? "filled" : "default",
        });
      }
    }
    frames.push({
      mode: "tsp",
      rows: n,
      cols,
      cells,
      rowLabels: Array.from({ length: n }, (_, i) => TSP_LABELS[i] ?? String(i)),
      colLabels: masks.map((m) => maskStr(m, n)),
      caption,
      lines,
      stats: [
        { label: "Cities", value: n },
        { label: "Subsets", value: cols },
      ],
    });
  };

  emit(`dp[{A}][A] = 0 — the tour starts at city A. Columns are subsets containing A.`, [1]);
  for (const mask of masks) {
    for (let i = 0; i < n; i++) {
      if (!((mask >> i) & 1) || dp[mask][i] === INFV) continue;
      for (let j = 0; j < n; j++) {
        if ((mask >> j) & 1) continue;
        const nm = mask | (1 << j);
        const cand = dp[mask][i] + dist[i][j];
        if (cand < dp[nm][j]) {
          dp[nm][j] = cand;
          emit(
            `Extend ${TSP_LABELS[i]}→${TSP_LABELS[j]}: dp[${maskStr(nm, n)}][${TSP_LABELS[j]}] = ${dp[mask][i]} + ${dist[i][j]} = ${cand}.`,
            [4, 5, 6],
            cellIndex(j, nm),
            [cellIndex(i, mask)],
          );
        }
      }
    }
  }
  const full = (1 << n) - 1;
  let best = INFV;
  let bestI = -1;
  for (let i = 1; i < n; i++) {
    if (dp[full][i] + dist[i][0] < best) { best = dp[full][i] + dist[i][0]; bestI = i; }
  }
  emit(`Close the tour: min over end city of dp[full][i] + dist[i][A]. Optimal tour = ${best}.`, [7], -1, [], bestI >= 0 ? [cellIndex(bestI, full)] : []);
  return frames;
}

export function buildDpFrames(mode: DpMode, opts: { coins?: number[]; amount?: number; rows?: number; cols?: number; a?: string; b?: string; cities?: number; dist?: number[][] } = {}): DpFrame[] {
  if (mode === "paths") return buildPathsFrames(opts.rows ?? 3, opts.cols ?? 4);
  if (mode === "edit") return buildEditFrames(opts.a ?? "horse", opts.b ?? "ros");
  if (mode === "tsp") return buildTspFrames(opts.dist ?? tspMatrix(opts.cities ?? 4));
  return buildCoinFrames(opts.coins ?? [1, 3, 4], opts.amount ?? 6);
}

export function dpCode(mode: DpMode): string[] {
  return DP_CODE[mode];
}
