/**
 * Fractional knapsack (greedy). Sort items by value/weight, take as much of the
 * best ratio as fits, splitting the last item to fill the bag exactly. Greedy is
 * provably optimal here (unlike 0/1 knapsack).
 */

export type KnapRole = "default" | "active" | "full" | "partial" | "skipped";

export interface KnapItem {
  id: number;
  weight: number;
  value: number;
  ratio: number;
  taken: number; // 0..1
  role: KnapRole;
}

export interface KnapsackFrame {
  items: KnapItem[]; // sorted by ratio desc
  capacity: number;
  usedWeight: number;
  totalValue: number;
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

export const KNAPSACK_LIMITS = { maxItems: 6, maxWeight: 30 };

export const KNAPSACK_CODE = [
  "sort items by value / weight (descending)",
  "cap = W;  total = 0",
  "for (w, v) in items:",
  "    if w <= cap:           # take all of it",
  "        total += v; cap -= w",
  "    else:                  # take a fraction",
  "        total += v * cap / w; break",
  "return total",
];

export interface RawItem {
  weight: number;
  value: number;
}

export const KNAPSACK_SAMPLE: RawItem[] = [
  { weight: 10, value: 60 },
  { weight: 20, value: 100 },
  { weight: 30, value: 120 },
];

const round2 = (n: number) => Math.round(n * 100) / 100;

export function buildKnapsackFrames(raw: RawItem[] = KNAPSACK_SAMPLE, capacity = 50): KnapsackFrame[] {
  const items = raw
    .filter((it) => it.weight > 0 && it.value > 0)
    .slice(0, KNAPSACK_LIMITS.maxItems)
    .map((it, id) => ({ ...it, id, ratio: round2(it.value / it.weight), taken: 0, role: "default" as KnapRole }))
    .sort((a, b) => b.ratio - a.ratio);
  const cap = Math.max(1, capacity);
  const frames: KnapsackFrame[] = [];
  let used = 0;
  let total = 0;
  let done = false;

  const emit = (caption: string, lines: number[], activeId?: number) => {
    frames.push({
      items: items.map((it) => ({ ...it, role: it.id === activeId ? "active" : it.role })),
      capacity: cap,
      usedWeight: round2(used),
      totalValue: round2(total),
      caption,
      lines,
      stats: [
        { label: "Used", value: `${round2(used)}/${cap}` },
        { label: "Value", value: round2(total) },
      ],
    });
  };

  emit(`Sort by value/weight ratio (descending). Capacity = ${cap}.`, [1, 2]);
  for (const it of items) {
    if (done) {
      it.role = "skipped";
      emit(`Bag is full — skip ${it.value}/${it.weight} (ratio ${it.ratio}).`, [3], it.id);
      continue;
    }
    const room = cap - used;
    if (it.weight <= room) {
      it.taken = 1;
      it.role = "full";
      used += it.weight;
      total += it.value;
      emit(`Take ALL of value ${it.value}, weight ${it.weight} (ratio ${it.ratio}). Value += ${it.value}.`, [4, 5], it.id);
    } else {
      const frac = room / it.weight;
      it.taken = round2(frac);
      it.role = "partial";
      total += it.value * frac;
      used += room;
      done = true;
      emit(`Only ${round2(room)} room left: take ${Math.round(frac * 100)}% → value += ${round2(it.value * frac)}.`, [6, 7], it.id);
    }
  }
  emit(`Done — maximum value = ${round2(total)} within capacity ${cap}.`, [8]);
  return frames;
}

export function parseItems(text: string): { items: RawItem[]; errors: string[] } {
  const items: RawItem[] = [];
  const errors: string[] = [];
  text.split(/\n+/).forEach((line, i) => {
    const t = line.trim();
    if (!t) return;
    const [w, v] = t.split(/[\s,]+/).map((p) => parseInt(p, 10));
    if (!Number.isFinite(w) || !Number.isFinite(v) || w <= 0 || v <= 0) {
      errors.push(`Line ${i + 1}: expected "weight value" (positive).`);
      return;
    }
    if (items.length >= KNAPSACK_LIMITS.maxItems) {
      errors.push(`Only the first ${KNAPSACK_LIMITS.maxItems} items are used.`);
      return;
    }
    items.push({ weight: Math.min(w, KNAPSACK_LIMITS.maxWeight), value: v });
  });
  return { items, errors };
}

export function itemsToText(items: RawItem[]): string {
  return items.map((it) => `${it.weight} ${it.value}`).join("\n");
}
