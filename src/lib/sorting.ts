import type { Highlight, SortAlgorithm, SortFrame } from "./types";

/**
 * Sorting algorithms, each written as a frame emitter.
 *
 * A small `Recorder` helper accumulates running stats and lets each algorithm
 * push a frame with `rec.push(array, highlights, lines, caption, vars)`. The
 * algorithms are intentionally written close to their textbook pseudocode so
 * the synced code panel reads naturally.
 */

class Recorder {
  frames: SortFrame[] = [];
  comparisons = 0;
  swaps = 0;
  writes = 0;

  push(
    array: number[],
    highlights: Record<number, Highlight>,
    lines: number[],
    caption: string,
    vars?: Record<string, string | number>,
  ) {
    this.frames.push({
      array: array.slice(),
      highlights: { ...highlights },
      lines,
      caption,
      vars,
      stats: {
        comparisons: this.comparisons,
        swaps: this.swaps,
        writes: this.writes,
      },
    });
  }
}

/** Mark a set of indices all sorted — used for the final "done" frame. */
function allSorted(n: number): Record<number, Highlight> {
  const h: Record<number, Highlight> = {};
  for (let i = 0; i < n; i++) h[i] = "sorted";
  return h;
}

// ----------------------------------------------------------------------------
// Bubble sort
// ----------------------------------------------------------------------------
const bubble: SortAlgorithm = {
  id: "bubble",
  name: "Bubble Sort",
  blurb: "Repeatedly swap adjacent out-of-order pairs; the largest bubbles up each pass.",
  complexity: { time: "O(n²)", space: "O(1)", stable: true },
  code: [
    "for i in range(n):",
    "  swapped = False",
    "  for j in range(0, n - i - 1):",
    "    if a[j] > a[j + 1]:",
    "      a[j], a[j+1] = a[j+1], a[j]",
    "      swapped = True",
    "  if not swapped: break",
  ],
  run(input) {
    const rec = new Recorder();
    const a = input.slice();
    const n = a.length;
    const sorted: Record<number, Highlight> = {};
    rec.push(a, {}, [1], "Start bubble sort.");
    for (let i = 0; i < n; i++) {
      let swapped = false;
      for (let j = 0; j < n - i - 1; j++) {
        rec.comparisons++;
        rec.push(
          a,
          { ...sorted, [j]: "compare", [j + 1]: "compare" },
          [3, 4],
          `Compare a[${j}]=${a[j]} and a[${j + 1}]=${a[j + 1]}.`,
          { i, j, swapped: String(swapped) },
        );
        if (a[j] > a[j + 1]) {
          [a[j], a[j + 1]] = [a[j + 1], a[j]];
          rec.swaps++;
          rec.writes += 2;
          swapped = true;
          rec.push(
            a,
            { ...sorted, [j]: "swap", [j + 1]: "swap" },
            [5, 6],
            `Swap → a[${j}]=${a[j]}, a[${j + 1}]=${a[j + 1]}.`,
            { i, j, swapped: String(swapped) },
          );
        }
      }
      sorted[n - i - 1] = "sorted";
      rec.push(a, { ...sorted }, [7], `a[${n - i - 1}] is locked in place.`, { i });
      if (!swapped) break;
    }
    rec.push(a, allSorted(n), [], "Array fully sorted.");
    return rec.frames;
  },
};

// ----------------------------------------------------------------------------
// Insertion sort
// ----------------------------------------------------------------------------
const insertion: SortAlgorithm = {
  id: "insertion",
  name: "Insertion Sort",
  blurb: "Grow a sorted prefix, inserting each new element into its correct slot.",
  complexity: { time: "O(n²)", space: "O(1)", stable: true },
  code: [
    "for i in range(1, n):",
    "  key = a[i]",
    "  j = i - 1",
    "  while j >= 0 and a[j] > key:",
    "    a[j + 1] = a[j]",
    "    j -= 1",
    "  a[j + 1] = key",
  ],
  run(input) {
    const rec = new Recorder();
    const a = input.slice();
    const n = a.length;
    const sorted: Record<number, Highlight> = { 0: "sorted" };
    rec.push(a, { ...sorted }, [1], "Prefix of length 1 is trivially sorted.");
    for (let i = 1; i < n; i++) {
      const key = a[i];
      let j = i - 1;
      rec.push(a, { ...sorted, [i]: "pivot" }, [2, 3], `Take key = a[${i}] = ${key}.`, {
        i,
        key,
        j,
      });
      while (j >= 0) {
        rec.comparisons++;
        rec.push(
          a,
          { ...sorted, [j]: "compare", [j + 1]: "pivot" },
          [4],
          `Is a[${j}]=${a[j]} > key=${key}?`,
          { i, key, j },
        );
        if (a[j] <= key) break;
        a[j + 1] = a[j];
        rec.writes++;
        rec.push(
          a,
          { ...sorted, [j]: "swap", [j + 1]: "swap" },
          [5, 6],
          `Shift a[${j}] right to make room.`,
          { i, key, j },
        );
        j--;
      }
      a[j + 1] = key;
      rec.writes++;
      for (let k = 0; k <= i; k++) sorted[k] = "sorted";
      rec.push(a, { ...sorted }, [7], `Insert key ${key} at index ${j + 1}.`, { i, key });
    }
    rec.push(a, allSorted(n), [], "Array fully sorted.");
    return rec.frames;
  },
};

// ----------------------------------------------------------------------------
// Selection sort
// ----------------------------------------------------------------------------
const selection: SortAlgorithm = {
  id: "selection",
  name: "Selection Sort",
  blurb: "Each pass finds the minimum of the unsorted tail and swaps it to the front.",
  complexity: { time: "O(n²)", space: "O(1)", stable: false },
  code: [
    "for i in range(n):",
    "  min_idx = i",
    "  for j in range(i + 1, n):",
    "    if a[j] < a[min_idx]:",
    "      min_idx = j",
    "  a[i], a[min_idx] = a[min_idx], a[i]",
  ],
  run(input) {
    const rec = new Recorder();
    const a = input.slice();
    const n = a.length;
    const sorted: Record<number, Highlight> = {};
    rec.push(a, {}, [1], "Start selection sort.");
    for (let i = 0; i < n; i++) {
      let min = i;
      rec.push(a, { ...sorted, [min]: "pivot" }, [2], `Assume a[${i}] is the minimum.`, {
        i,
        min_idx: min,
      });
      for (let j = i + 1; j < n; j++) {
        rec.comparisons++;
        rec.push(
          a,
          { ...sorted, [min]: "pivot", [j]: "compare" },
          [3, 4],
          `Compare a[${j}]=${a[j]} against current min a[${min}]=${a[min]}.`,
          { i, j, min_idx: min },
        );
        if (a[j] < a[min]) {
          min = j;
          rec.push(a, { ...sorted, [min]: "pivot" }, [5], `New minimum at index ${j}.`, {
            i,
            j,
            min_idx: min,
          });
        }
      }
      if (min !== i) {
        [a[i], a[min]] = [a[min], a[i]];
        rec.swaps++;
        rec.writes += 2;
      }
      sorted[i] = "sorted";
      rec.push(a, { ...sorted }, [6], `Swap minimum into index ${i}.`, { i, min_idx: min });
    }
    rec.push(a, allSorted(n), [], "Array fully sorted.");
    return rec.frames;
  },
};

// ----------------------------------------------------------------------------
// Merge sort (iterative captioning over recursive merges)
// ----------------------------------------------------------------------------
const merge: SortAlgorithm = {
  id: "merge",
  name: "Merge Sort",
  blurb: "Divide the array in half, sort each half, then merge the two sorted runs.",
  complexity: { time: "O(n log n)", space: "O(n)", stable: true },
  code: [
    "def merge_sort(a, lo, hi):",
    "  if hi - lo <= 1: return",
    "  mid = (lo + hi) // 2",
    "  merge_sort(a, lo, mid)",
    "  merge_sort(a, mid, hi)",
    "  merge(a, lo, mid, hi)  # combine runs",
  ],
  run(input) {
    const rec = new Recorder();
    const a = input.slice();
    const n = a.length;

    const rangeHi = (lo: number, hi: number): Record<number, Highlight> => {
      const h: Record<number, Highlight> = {};
      for (let k = lo; k < hi; k++) h[k] = "range";
      return h;
    };

    const doMerge = (lo: number, mid: number, hi: number) => {
      const left = a.slice(lo, mid);
      const right = a.slice(mid, hi);
      let i = 0,
        j = 0,
        k = lo;
      while (i < left.length && j < right.length) {
        rec.comparisons++;
        const h = rangeHi(lo, hi);
        h[lo + i] = "compare";
        h[mid + j] = "compare";
        rec.push(a, h, [6], `Merge: compare ${left[i]} and ${right[j]}.`, { lo, mid, hi });
        if (left[i] <= right[j]) {
          a[k] = left[i++];
        } else {
          a[k] = right[j++];
        }
        rec.writes++;
        const h2 = rangeHi(lo, hi);
        h2[k] = "swap";
        rec.push(a, h2, [6], `Write ${a[k]} to index ${k}.`, { lo, mid, hi });
        k++;
      }
      while (i < left.length) {
        a[k] = left[i++];
        rec.writes++;
        const h = rangeHi(lo, hi);
        h[k] = "swap";
        rec.push(a, h, [6], `Drain left run → ${a[k]}.`, { lo, mid, hi });
        k++;
      }
      while (j < right.length) {
        a[k] = right[j++];
        rec.writes++;
        const h = rangeHi(lo, hi);
        h[k] = "swap";
        rec.push(a, h, [6], `Drain right run → ${a[k]}.`, { lo, mid, hi });
        k++;
      }
    };

    const sort = (lo: number, hi: number) => {
      if (hi - lo <= 1) return;
      const mid = (lo + hi) >> 1;
      rec.push(a, rangeHi(lo, hi), [2, 3], `Split [${lo}, ${hi}) at ${mid}.`, { lo, mid, hi });
      sort(lo, mid);
      sort(mid, hi);
      doMerge(lo, mid, hi);
    };

    rec.push(a, {}, [1], "Start merge sort.");
    sort(0, n);
    rec.push(a, allSorted(n), [], "Array fully sorted.");
    return rec.frames;
  },
};

// ----------------------------------------------------------------------------
// Quick sort (Lomuto partition)
// ----------------------------------------------------------------------------
const quick: SortAlgorithm = {
  id: "quick",
  name: "Quick Sort",
  blurb: "Pick a pivot, partition elements around it, then recurse on each side.",
  complexity: { time: "O(n log n) avg", space: "O(log n)", stable: false },
  code: [
    "def quicksort(a, lo, hi):",
    "  if lo >= hi: return",
    "  pivot = a[hi]",
    "  i = lo",
    "  for j in range(lo, hi):",
    "    if a[j] < pivot:",
    "      a[i], a[j] = a[j], a[i]; i += 1",
    "  a[i], a[hi] = a[hi], a[i]",
    "  quicksort(a, lo, i-1); quicksort(a, i+1, hi)",
  ],
  run(input) {
    const rec = new Recorder();
    const a = input.slice();
    const n = a.length;
    const sorted: Record<number, Highlight> = {};

    const partition = (lo: number, hi: number): number => {
      const pivot = a[hi];
      let i = lo;
      rec.push(a, { ...sorted, [hi]: "pivot" }, [3, 4], `Pivot = a[${hi}] = ${pivot}.`, {
        lo,
        hi,
        pivot,
        i,
      });
      for (let j = lo; j < hi; j++) {
        rec.comparisons++;
        rec.push(
          a,
          { ...sorted, [hi]: "pivot", [j]: "compare", [i]: "range" },
          [5, 6],
          `Is a[${j}]=${a[j]} < pivot ${pivot}?`,
          { lo, hi, pivot, i, j },
        );
        if (a[j] < pivot) {
          if (i !== j) {
            [a[i], a[j]] = [a[j], a[i]];
            rec.swaps++;
            rec.writes += 2;
          }
          rec.push(
            a,
            { ...sorted, [hi]: "pivot", [i]: "swap", [j]: "swap" },
            [7],
            `a[${j}] < pivot → move into the "less" region at ${i}.`,
            { lo, hi, pivot, i, j },
          );
          i++;
        }
      }
      [a[i], a[hi]] = [a[hi], a[i]];
      rec.swaps++;
      rec.writes += 2;
      sorted[i] = "sorted";
      rec.push(a, { ...sorted, [i]: "sorted" }, [8], `Place pivot at its final index ${i}.`, {
        lo,
        hi,
        pivot,
        i,
      });
      return i;
    };

    const sort = (lo: number, hi: number) => {
      if (lo >= hi) {
        if (lo === hi) sorted[lo] = "sorted";
        return;
      }
      const p = partition(lo, hi);
      sort(lo, p - 1);
      sort(p + 1, hi);
    };

    rec.push(a, {}, [1], "Start quick sort.");
    sort(0, n - 1);
    rec.push(a, allSorted(n), [], "Array fully sorted.");
    return rec.frames;
  },
};

export const SORT_ALGORITHMS: SortAlgorithm[] = [
  bubble,
  insertion,
  selection,
  merge,
  quick,
];

export const SORT_BY_ID = Object.fromEntries(
  SORT_ALGORITHMS.map((a) => [a.id, a]),
) as Record<string, SortAlgorithm>;
