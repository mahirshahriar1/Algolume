/**
 * Greedy interval-scheduling (activity selection) simulation. Sort activities by
 * finish time, then greedily take each one whose start is ≥ the last selected
 * finish. Builders emit Frame[] for the shared player.
 */

export type IntervalRole = "default" | "active" | "selected" | "rejected";

export interface IntervalView {
  id: number;
  start: number;
  end: number;
  role: IntervalRole;
}

export interface GreedyFrame {
  intervals: IntervalView[]; // sorted by finish time (display order)
  timeMax: number;
  lastFinish: number | null;
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

export const GREEDY_LIMITS = { maxIntervals: 8, maxTime: 20 };

export const GREEDY_CODE = [
  "activities.sort(key=finish_time)",
  "last_finish = -inf",
  "count = 0",
  "for (start, end) in activities:",
  "    if start >= last_finish:   # compatible",
  "        select; count += 1",
  "        last_finish = end",
  "return count",
];

export interface RawInterval {
  start: number;
  end: number;
}

export const GREEDY_SAMPLE: RawInterval[] = [
  { start: 1, end: 4 },
  { start: 3, end: 5 },
  { start: 0, end: 6 },
  { start: 5, end: 7 },
  { start: 3, end: 9 },
  { start: 5, end: 9 },
  { start: 6, end: 10 },
  { start: 8, end: 11 },
];

export function buildActivitySelection(raw: RawInterval[] = GREEDY_SAMPLE): GreedyFrame[] {
  const items = raw
    .filter((iv) => iv.end > iv.start)
    .slice(0, GREEDY_LIMITS.maxIntervals)
    .map((iv, id) => ({ ...iv, id }))
    .sort((a, b) => a.end - b.end || a.start - b.start);
  const timeMax = Math.max(1, ...items.map((iv) => iv.end));
  const frames: GreedyFrame[] = [];
  const roles = new Map<number, IntervalRole>();
  let lastFinish: number | null = null;
  let count = 0;

  const view = (): IntervalView[] => items.map((iv) => ({ ...iv, role: roles.get(iv.id) ?? "default" }));
  const emit = (caption: string, lines: number[], active?: number) => {
    const snapshot = view().map((iv) => ({ ...iv, role: iv.id === active ? "active" : iv.role }));
    frames.push({
      intervals: snapshot,
      timeMax,
      lastFinish,
      caption,
      lines,
      stats: [
        { label: "Selected", value: count },
        { label: "Total", value: items.length },
        { label: "Last finish", value: lastFinish ?? "—" },
      ],
    });
  };

  emit("Sort activities by finish time — the earliest-finishing leaves the most room.", [1, 2, 3]);
  for (const iv of items) {
    emit(`Consider [${iv.start}, ${iv.end}]. Last finish = ${lastFinish ?? "−∞"}.`, [4, 5], iv.id);
    if (lastFinish === null || iv.start >= lastFinish) {
      roles.set(iv.id, "selected");
      lastFinish = iv.end;
      count++;
      emit(`Start ${iv.start} ≥ last finish: SELECT it; last finish becomes ${iv.end}.`, [5, 6, 7], iv.id);
    } else {
      roles.set(iv.id, "rejected");
      emit(`Start ${iv.start} < last finish ${lastFinish}: it overlaps — skip.`, [5], iv.id);
    }
  }
  emit(`Done — a maximum of ${count} non-overlapping activities.`, [8]);
  return frames;
}

/** Parse "start end" lines into intervals, bounded by the limits. */
export function parseIntervals(text: string): { intervals: RawInterval[]; errors: string[] } {
  const intervals: RawInterval[] = [];
  const errors: string[] = [];
  text.split(/\n+/).forEach((line, i) => {
    const t = line.trim();
    if (!t) return;
    const parts = t.split(/[\s,]+/).map((p) => parseInt(p, 10));
    if (parts.length < 2 || parts.some((n) => !Number.isFinite(n))) {
      errors.push(`Line ${i + 1}: expected "start end".`);
      return;
    }
    let [s, e] = parts;
    s = Math.max(0, Math.min(GREEDY_LIMITS.maxTime, s));
    e = Math.max(0, Math.min(GREEDY_LIMITS.maxTime, e));
    if (e <= s) {
      errors.push(`Line ${i + 1}: end must be > start.`);
      return;
    }
    if (intervals.length >= GREEDY_LIMITS.maxIntervals) {
      errors.push(`Only the first ${GREEDY_LIMITS.maxIntervals} activities are used.`);
      return;
    }
    intervals.push({ start: s, end: e });
  });
  return { intervals, errors };
}

export function intervalsToText(intervals: RawInterval[]): string {
  return intervals.map((iv) => `${iv.start} ${iv.end}`).join("\n");
}
