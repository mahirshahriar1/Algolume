/**
 * String pattern-matching simulation: naive sliding-window and KMP (using the
 * failure function to skip). Frames carry the current alignment, the character
 * being compared, how much of the pattern matched, and any found positions.
 */

export type MatchMode = "naive" | "kmp";
export type MatchStatus = "compare" | "match" | "mismatch" | "found" | "done";

export interface MatchFrame {
  text: string;
  pattern: string;
  offset: number; // index in text where the pattern's first char aligns
  comparePos: number; // index within the pattern being compared (-1 = none)
  matched: number; // how many leading pattern chars currently match
  status: MatchStatus;
  foundAt: number[]; // text offsets of completed matches so far
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

export const MATCH_LIMITS = { maxText: 28, maxPattern: 10 };

export const MATCH_CODE: Record<MatchMode, string[]> = {
  naive: [
    "for i in range(n - m + 1):",
    "    j = 0",
    "    while j < m and text[i+j] == pattern[j]:",
    "        j += 1",
    "    if j == m:",
    "        record match at i",
  ],
  kmp: [
    "pi = failure_function(pattern)",
    "j = 0",
    "for i in range(n):",
    "    while j > 0 and text[i] != pattern[j]:",
    "        j = pi[j-1]          # skip using the border",
    "    if text[i] == pattern[j]: j += 1",
    "    if j == m:",
    "        record match; j = pi[j-1]",
  ],
};

function failure(p: string): number[] {
  const pi = Array(p.length).fill(0);
  let k = 0;
  for (let i = 1; i < p.length; i++) {
    while (k > 0 && p[i] !== p[k]) k = pi[k - 1];
    if (p[i] === p[k]) k++;
    pi[i] = k;
  }
  return pi;
}

export function buildMatchFrames(mode: MatchMode, textRaw: string, patternRaw: string): MatchFrame[] {
  const text = textRaw.slice(0, MATCH_LIMITS.maxText);
  const pattern = patternRaw.slice(0, MATCH_LIMITS.maxPattern);
  const n = text.length;
  const m = pattern.length;
  const frames: MatchFrame[] = [];
  const found: number[] = [];
  let comparisons = 0;

  if (m === 0 || m > n) {
    frames.push({ text, pattern, offset: 0, comparePos: -1, matched: 0, status: "done", foundAt: [], caption: m === 0 ? "Empty pattern." : "Pattern longer than text — no match possible.", lines: [], stats: [] });
    return frames;
  }

  const emit = (offset: number, comparePos: number, matched: number, status: MatchStatus, caption: string, lines: number[]) => {
    frames.push({
      text, pattern, offset, comparePos, matched, status, foundAt: found.slice(), caption, lines,
      stats: [
        { label: "Comparisons", value: comparisons },
        { label: "Found", value: found.length },
      ],
    });
  };

  if (mode === "naive") {
    for (let i = 0; i + m <= n; i++) {
      let j = 0;
      while (j < m) {
        comparisons++;
        if (text[i + j] === pattern[j]) {
          emit(i, j, j + 1, "match", `Align at ${i}: text[${i + j}]='${text[i + j]}' == pattern[${j}]='${pattern[j]}'.`, [2, 3]);
          j++;
        } else {
          emit(i, j, j, "mismatch", `Mismatch at text[${i + j}]='${text[i + j]}' ≠ pattern[${j}]='${pattern[j]}' — shift by 1.`, [3]);
          break;
        }
      }
      if (j === m) {
        found.push(i);
        emit(i, -1, m, "found", `Full match at offset ${i}!`, [5, 6]);
      }
    }
  } else {
    const pi = failure(pattern);
    let j = 0;
    for (let i = 0; i < n; i++) {
      while (j > 0 && text[i] !== pattern[j]) {
        emit(i - j, j, j, "mismatch", `Mismatch: text[${i}]='${text[i]}' ≠ pattern[${j}]. Skip via border: j = ${pi[j - 1]}.`, [4, 5]);
        j = pi[j - 1];
      }
      comparisons++;
      if (text[i] === pattern[j]) {
        emit(i - j, j, j + 1, "match", `text[${i}]='${text[i]}' == pattern[${j}]='${pattern[j]}'.`, [6]);
        j++;
      } else {
        emit(i - j, j, 0, "mismatch", `text[${i}]='${text[i]}' ≠ pattern[0] — advance.`, [6]);
      }
      if (j === m) {
        const at = i - m + 1;
        found.push(at);
        emit(at, -1, m, "found", `Full match at offset ${at}! Continue with j = ${pi[j - 1]}.`, [7, 8]);
        j = pi[j - 1];
      }
    }
  }

  frames.push({
    text, pattern, offset: 0, comparePos: -1, matched: 0, status: "done",
    foundAt: found.slice(),
    caption: found.length ? `Done — ${found.length} match(es) at ${found.join(", ")}.` : "Done — no matches.",
    lines: [],
    stats: [{ label: "Comparisons", value: comparisons }, { label: "Found", value: found.length }],
  });
  return frames;
}

export function matchCode(mode: MatchMode): string[] {
  return MATCH_CODE[mode];
}
