/**
 * Min-heap simulation. The heap is a complete binary tree stored in an array:
 * node i has children 2i+1 and 2i+2 and parent (i-1)//2. Insert sifts up;
 * extract-min sifts down. Builders emit Frame[] for the shared player.
 */

export type HeapRole = "default" | "active" | "compare" | "swap" | "new" | "root" | "removed";

export interface HeapFrame {
  values: number[];
  roles: HeapRole[];
  caption: string;
  lines: number[];
  output?: string;
  stats?: { label: string; value: string | number }[];
}

export const HEAP_CODE = [
  "def push(heap, x):            # sift up",
  "    heap.append(x)",
  "    i = len(heap) - 1",
  "    while i > 0 and heap[(i-1)//2] > heap[i]:",
  "        swap(heap, i, (i-1)//2)",
  "        i = (i-1)//2",
  "",
  "def pop_min(heap):            # sift down",
  "    heap[0] = heap[-1]; heap.pop()",
  "    i = 0",
  "    while True:",
  "        c = smallest(i, 2i+1, 2i+2)",
  "        if c == i: break",
  "        swap(heap, i, c); i = c",
];

export type HeapHandle = number[];

const parent = (i: number) => (i - 1) >> 1;

const roleArray = (n: number, set: Record<number, HeapRole> = {}): HeapRole[] =>
  Array.from({ length: n }, (_, i) => set[i] ?? "default");

const stats = (h: number[]) => [
  { label: "Size", value: h.length },
  { label: "Min", value: h.length ? h[0] : "—" },
  { label: "Height", value: h.length ? Math.floor(Math.log2(h.length)) + 1 : 0 },
];

export interface HeapOpResult {
  frames: HeapFrame[];
  next: HeapHandle;
}

export function heapSeed(): HeapHandle {
  // A valid min-heap to start from.
  return [1, 3, 2, 7, 5, 8, 4];
}

export function heapSnapshot(h: HeapHandle, caption: string): HeapFrame {
  return { values: h.slice(), roles: roleArray(h.length, h.length ? { 0: "root" } : {}), caption, lines: [1], stats: stats(h) };
}

/** Insert a value and animate the sift-up. */
export function heapInsertOp(heap: HeapHandle, value: number): HeapOpResult {
  const h = heap.slice();
  const frames: HeapFrame[] = [];
  h.push(value);
  let i = h.length - 1;
  frames.push({ values: h.slice(), roles: roleArray(h.length, { [i]: "new" }), caption: `Append ${value} at the end (index ${i}).`, lines: [2, 3], stats: stats(h) });

  while (i > 0) {
    const p = parent(i);
    frames.push({
      values: h.slice(),
      roles: roleArray(h.length, { [i]: "active", [p]: "compare" }),
      caption: `Compare ${h[i]} with its parent ${h[p]}.`,
      lines: [4],
      stats: stats(h),
    });
    if (h[p] <= h[i]) {
      frames.push({ values: h.slice(), roles: roleArray(h.length, { [i]: "active" }), caption: `Parent ${h[p]} ≤ ${h[i]}: heap property holds, stop.`, lines: [4], stats: stats(h) });
      break;
    }
    [h[i], h[p]] = [h[p], h[i]];
    frames.push({ values: h.slice(), roles: roleArray(h.length, { [i]: "swap", [p]: "swap" }), caption: `Swap up: ${h[p]} ↔ ${h[i]}.`, lines: [5, 6], stats: stats(h) });
    i = p;
  }
  frames.push(heapSnapshot(h, "Insert complete — still a valid min-heap."));
  return { frames, next: h };
}

/** Remove the minimum (root) and animate the sift-down. */
export function heapExtractOp(heap: HeapHandle): HeapOpResult {
  const h = heap.slice();
  if (h.length === 0) return { frames: [heapSnapshot(h, "Heap is empty.")], next: h };
  const frames: HeapFrame[] = [];
  const min = h[0];
  frames.push({ values: h.slice(), roles: roleArray(h.length, { 0: "removed" }), caption: `Remove the minimum (root = ${min}).`, lines: [8], output: `min = ${min}`, stats: stats(h) });
  const last = h.pop()!;
  if (h.length === 0) {
    return { frames: [...frames, { values: [], roles: [], caption: `Heap now empty. Returned ${min}.`, lines: [8], output: `min = ${min}`, stats: stats(h) }], next: h };
  }
  h[0] = last;
  frames.push({ values: h.slice(), roles: roleArray(h.length, { 0: "active" }), caption: `Move the last element ${last} to the root.`, lines: [9], output: `min = ${min}`, stats: stats(h) });

  let i = 0;
  while (true) {
    const l = 2 * i + 1;
    const r = 2 * i + 2;
    let c = i;
    if (l < h.length && h[l] < h[c]) c = l;
    if (r < h.length && h[r] < h[c]) c = r;
    const highlights: Record<number, HeapRole> = { [i]: "active" };
    if (l < h.length) highlights[l] = highlights[l] ?? "compare";
    if (r < h.length) highlights[r] = highlights[r] ?? "compare";
    frames.push({ values: h.slice(), roles: roleArray(h.length, highlights), caption: `Compare ${h[i]} with its children; smallest is ${h[c]}.`, lines: [11, 12], output: `min = ${min}`, stats: stats(h) });
    if (c === i) {
      frames.push({ values: h.slice(), roles: roleArray(h.length, { [i]: "active" }), caption: `${h[i]} is ≤ both children: stop.`, lines: [13], output: `min = ${min}`, stats: stats(h) });
      break;
    }
    [h[i], h[c]] = [h[c], h[i]];
    frames.push({ values: h.slice(), roles: roleArray(h.length, { [i]: "swap", [c]: "swap" }), caption: `Swap down: ${h[c]} ↔ ${h[i]}.`, lines: [14], output: `min = ${min}`, stats: stats(h) });
    i = c;
  }
  frames.push({ ...heapSnapshot(h, `Extract complete — returned ${min}.`), output: `min = ${min}` });
  return { frames, next: h };
}

/** A canned insert-then-extract sequence for lesson embeds. */
export function buildHeapDemoFrames(): HeapFrame[] {
  let h: HeapHandle = [];
  const frames: HeapFrame[] = [heapSnapshot(h, "Start with an empty min-heap. Watch each insert sift up.")];
  for (const v of [5, 3, 8, 1, 9, 2]) {
    const res = heapInsertOp(h, v);
    frames.push(...res.frames);
    h = res.next;
  }
  for (let k = 0; k < 2; k++) {
    const res = heapExtractOp(h);
    frames.push(...res.frames);
    h = res.next;
  }
  return frames;
}
