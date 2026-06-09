import type { SeqFrame, SeqItem, SeqMarker } from "./types";

/**
 * Frame builders for linear structures. Each returns a list of SeqFrames the
 * EmbeddedSim player scrubs. Every frame carries `lines` so the synced code
 * panel highlights the operation in progress.
 */

let uid = 0;
const item = (label: string | number, role?: SeqItem["role"]): SeqItem => ({
  key: `k${uid++}`,
  label: String(label),
  role,
});

/** One combined pseudocode block per structure (all ops; frames pick lines). */
export const SEQ_CODE: Record<string, string[]> = {
  array: [
    "def reverse(a):",
    "    i, j = 0, len(a) - 1",
    "    while i < j:",
    "        a[i], a[j] = a[j], a[i]",
    "        i += 1; j -= 1",
    "    return a",
  ],
  stack: [
    "def push(x):",
    "    stack.append(x)        # top, O(1)",
    "",
    "def pop():",
    "    return stack.pop()     # top, O(1)",
  ],
  queue: [
    "def enqueue(x):",
    "    queue.append(x)        # rear, O(1)",
    "",
    "def dequeue():",
    "    return queue.popleft() # front, O(1)",
  ],
  "linked-list": [
    "def insert_head(x):",
    "    head = Node(x, next=head)       # O(1)",
    "",
    "def insert_tail(x):",
    "    cur = head",
    "    while cur.next: cur = cur.next  # O(n)",
    "    cur.next = Node(x)",
    "",
    "def delete(x):",
    "    cur = head",
    "    while cur.val != x:             # O(n)",
    "        cur = cur.next",
    "    unlink(cur)",
  ],
  "binary-search": [
    "def binary_search(a, target):",
    "    lo, hi = 0, len(a) - 1",
    "    while lo <= hi:",
    "        mid = (lo + hi) // 2",
    "        if a[mid] == target: return mid",
    "        if a[mid] < target:",
    "            lo = mid + 1          # drop left half",
    "        else:",
    "            hi = mid - 1          # drop right half",
  ],
  "linear-search": [
    "def linear_search(a, target):",
    "    for i in range(len(a)):",
    "        if a[i] == target:",
    "            return i",
    "    return -1",
  ],
  "ternary-search": [
    "def ternary_search(a, target):",
    "    lo, hi = 0, len(a) - 1",
    "    while lo <= hi:",
    "        third = (hi - lo) // 3",
    "        m1, m2 = lo + third, hi - third",
    "        if a[m1] == target: return m1",
    "        if a[m2] == target: return m2",
    "        if target < a[m1]: hi = m1 - 1",
    "        elif target > a[m2]: lo = m2 + 1",
    "        else: lo, hi = m1 + 1, m2 - 1",
  ],
  "sliding-window": [
    "def max_sum(a, k):",
    "    window = sum(a[:k])",
    "    best = window",
    "    for r in range(k, len(a)):",
    "        window += a[r] - a[r-k]   # slide",
    "        best = max(best, window)",
    "    return best",
  ],
};

const plain = (items: SeqItem[]): SeqItem[] => items.map((it) => ({ ...it, role: "default" }));
const topMark = (n: number): SeqMarker[] => (n > 0 ? [{ index: n - 1, label: "top", tone: "run" }] : []);
const endsMark = (n: number): SeqMarker[] =>
  n > 0
    ? [
        { index: 0, label: "front", tone: "compare" },
        { index: n - 1, label: "rear", tone: "run" },
      ]
    : [];
const headMark = (n: number): SeqMarker[] => (n > 0 ? [{ index: 0, label: "head", tone: "run" }] : []);

// ---- Array: reverse in place with two pointers -----------------------------
export function arrayTwoPointer(input: number[] = [3, 8, 1, 9, 4, 7]): SeqFrame[] {
  const a = input.map((v) => item(v));
  const frames: SeqFrame[] = [];
  const snap = (i: number, j: number, caption: string, lines: number[]) =>
    frames.push({
      items: a.map((it, k) => ({ ...it, role: k === i || k === j ? "active" : k < i || k > j ? "done" : "default" })),
      markers: [{ index: i, label: "i", tone: "compare" }, { index: j, label: "j", tone: "pivot" }],
      caption,
      lines,
    });

  let i = 0;
  let j = a.length - 1;
  frames.push({ items: a.slice(), caption: "Reverse an array in place using two pointers.", lines: [1, 2] });
  while (i < j) {
    snap(i, j, `Swap a[${i}] and a[${j}].`, [3, 4]);
    [a[i], a[j]] = [a[j], a[i]];
    snap(i, j, "Swapped — move both pointers inward.", [5]);
    i++;
    j--;
  }
  frames.push({ items: a.map((it) => ({ ...it, role: "done" })), caption: "Pointers met — the array is reversed.", lines: [6] });
  return frames;
}

// ---- Stack: push / pop (LIFO) ----------------------------------------------
export function stackOps(): SeqFrame[] {
  const ops: [("push" | "pop"), number?][] = [["push", 1], ["pop"], ["push", 9], ["pop"], ["pop"]];
  const stack: SeqItem[] = [item(3), item(7)];
  const frames: SeqFrame[] = [];
  const top = () => topMark(stack.length);
  frames.push({ items: stack.slice(), markers: top(), caption: "A stack is LIFO — the right end is the top.", lines: [1] });
  for (const [op, v] of ops) {
    if (op === "push") {
      stack.push(item(v!, "new"));
      frames.push({ items: stack.map((it, k) => ({ ...it, role: k === stack.length - 1 ? "new" : "default" })), markers: top(), caption: `push(${v}) → goes on top.`, lines: [2] });
    } else {
      if (stack.length) stack[stack.length - 1].role = "removed";
      frames.push({ items: stack.slice(), markers: top(), caption: "pop() → removes the top element.", lines: [4, 5] });
      stack.pop();
      frames.push({ items: plain(stack), markers: top(), caption: stack.length ? `Top is now ${stack[stack.length - 1].label}.` : "Stack is empty.", lines: [5] });
    }
  }
  return frames;
}

// ---- Queue: enqueue / dequeue (FIFO) ---------------------------------------
export function queueOps(): SeqFrame[] {
  const ops: [("enq" | "deq"), number?][] = [["enq", 1], ["deq"], ["enq", 9], ["deq"], ["deq"]];
  const q: SeqItem[] = [item(3), item(7)];
  const frames: SeqFrame[] = [];
  const marks = () => endsMark(q.length);
  frames.push({ items: q.slice(), markers: marks(), caption: "A queue is FIFO — add at the rear, remove from the front.", lines: [1] });
  for (const [op, v] of ops) {
    if (op === "enq") {
      q.push(item(v!, "new"));
      frames.push({ items: q.map((it, k) => ({ ...it, role: k === q.length - 1 ? "new" : "default" })), markers: marks(), caption: `enqueue(${v}) → joins the rear.`, lines: [2] });
    } else {
      if (q.length) q[0].role = "removed";
      frames.push({ items: q.slice(), markers: marks(), caption: "dequeue() → leaves from the front.", lines: [4, 5] });
      q.shift();
      frames.push({ items: plain(q), markers: marks(), caption: q.length ? `Front is now ${q[0].label}.` : "Queue is empty.", lines: [5] });
    }
  }
  return frames;
}

// ---- Linked list: insert at head, then delete a value ----------------------
export function linkedListOps(): SeqFrame[] {
  const list: SeqItem[] = [item(8), item(3), item(5)];
  const frames: SeqFrame[] = [];
  const head = () => headMark(list.length);
  frames.push({ items: list.slice(), markers: head(), caption: "A linked list: each node points to the next. We hold the head.", lines: [1] });

  list.unshift(item(1, "new"));
  frames.push({ items: list.map((it, k) => ({ ...it, role: k === 0 ? "new" : "default" })), markers: head(), caption: "insert_head(1) → O(1): point the new node at the old head.", lines: [1, 2] });

  for (let k = 0; k < list.length; k++) {
    const target = list[k].label === "5";
    frames.push({
      items: list.map((it, idx) => ({ ...it, role: idx === k ? (target ? "removed" : "active") : "default" })),
      markers: [{ index: k, label: "cur", tone: "compare" }, ...head()],
      caption: target ? "Found 5 — unlink it." : "Walk: is this 5? (O(n) — no random access).",
      lines: target ? [11] : [10, 11, 12],
    });
    if (target) {
      list.splice(k, 1);
      frames.push({ items: plain(list), markers: head(), caption: "Deleted — previous node now points past it.", lines: [13] });
      break;
    }
  }
  return frames;
}

// ---- Linear search: scan without assumptions -------------------------------
export function linearSearchSim(input: number[] = [14, 3, 58, 21, 9, 33, 67, 28], target = 33): SeqFrame[] {
  const a = input.map((v) => item(v));
  const frames: SeqFrame[] = [];
  frames.push({ items: a.slice(), caption: `Search for ${target} without assuming the array is sorted.`, lines: [1] });
  for (let i = 0; i < input.length; i++) {
    const found = input[i] === target;
    frames.push({
      items: a.map((it, k) => ({
        ...it,
        role: k === i ? (found ? "match" : "active") : k < i ? "dim" : "default",
      })),
      markers: [{ index: i, label: "i", tone: found ? "run" : "compare" }],
      caption: found ? `Found ${target} at index ${i}.` : `Check a[${i}] = ${input[i]}.`,
      lines: found ? [3, 4] : [2, 3],
    });
    if (found) return frames;
  }
  frames.push({ items: a.map((it) => ({ ...it, role: "dim" })), caption: `${target} is not present.`, lines: [5] });
  return frames;
}

// ---- Binary search: shrink a sorted window with lo / mid / hi --------------
export function binarySearchSim(input: number[] = [3, 9, 14, 21, 28, 33, 41, 50, 58, 67], target = 33): SeqFrame[] {
  const arr = [...input].sort((a, b) => a - b);
  const a = arr.map((v) => item(v));
  const frames: SeqFrame[] = [];
  let lo = 0;
  let hi = a.length - 1;
  const snap = (mid: number, caption: string, lines: number[], found = -1) =>
    frames.push({
      items: a.map((it, k) => ({
        ...it,
        role: found === k ? "match" : k < lo || k > hi ? "dim" : k === mid ? "active" : "default",
      })),
      markers: [
        { index: lo, label: "lo", tone: "compare" },
        { index: mid, label: "mid", tone: "pivot" },
        { index: hi, label: "hi", tone: "run" },
      ],
      caption,
      lines,
    });

  frames.push({ items: a.slice(), caption: `Search for ${target} in a sorted array.`, lines: [1, 2] });
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    snap(mid, `mid = a[${mid}] = ${arr[mid]}.`, [3, 4]);
    if (arr[mid] === target) {
      snap(mid, `Found ${target} at index ${mid}!`, [5], mid);
      return frames;
    }
    if (arr[mid] < target) {
      snap(mid, `${arr[mid]} < ${target} → discard the left half.`, [6, 7]);
      lo = mid + 1;
    } else {
      snap(mid, `${arr[mid]} > ${target} → discard the right half.`, [8, 9]);
      hi = mid - 1;
    }
  }
  frames.push({ items: a.map((it) => ({ ...it, role: "dim" })), caption: `${target} is not present.`, lines: [3] });
  return frames;
}

// ---- Ternary search: split a sorted window into thirds ---------------------
export function ternarySearchSim(input: number[] = [3, 9, 14, 21, 28, 33, 41, 50, 58, 67, 72, 81, 90], target = 58): SeqFrame[] {
  const arr = [...input].sort((a, b) => a - b);
  const a = arr.map((v) => item(v));
  const frames: SeqFrame[] = [];
  let lo = 0;
  let hi = a.length - 1;
  const snap = (m1: number, m2: number, caption: string, lines: number[], found = -1) =>
    frames.push({
      items: a.map((it, k) => ({
        ...it,
        role:
          found === k
            ? "match"
            : k < lo || k > hi
              ? "dim"
              : k === m1
                ? "active"
                : k === m2
                  ? "compare"
                  : "default",
      })),
      markers: [
        { index: lo, label: "lo", tone: "compare" },
        { index: m1, label: "m1", tone: "pivot" },
        { index: m2, label: "m2", tone: "swap" },
        { index: hi, label: "hi", tone: "run" },
      ],
      caption,
      lines,
    });

  frames.push({ items: a.slice(), caption: `Search for ${target} by splitting the sorted window into thirds.`, lines: [1, 2] });
  while (lo <= hi) {
    const third = Math.floor((hi - lo) / 3);
    const m1 = lo + third;
    const m2 = hi - third;
    snap(m1, m2, `m1 = a[${m1}] = ${arr[m1]}, m2 = a[${m2}] = ${arr[m2]}.`, [3, 4, 5]);
    if (arr[m1] === target) {
      snap(m1, m2, `Found ${target} at m1, index ${m1}.`, [6], m1);
      return frames;
    }
    if (arr[m2] === target) {
      snap(m1, m2, `Found ${target} at m2, index ${m2}.`, [7], m2);
      return frames;
    }
    if (target < arr[m1]) {
      snap(m1, m2, `${target} < ${arr[m1]} → keep the left third.`, [8]);
      hi = m1 - 1;
    } else if (target > arr[m2]) {
      snap(m1, m2, `${target} > ${arr[m2]} → keep the right third.`, [9]);
      lo = m2 + 1;
    } else {
      snap(m1, m2, `${target} sits between m1 and m2 → keep the middle third.`, [10]);
      lo = m1 + 1;
      hi = m2 - 1;
    }
  }
  frames.push({ items: a.map((it) => ({ ...it, role: "dim" })), caption: `${target} is not present.`, lines: [3] });
  return frames;
}

// ---- Sliding window: max sum of k consecutive elements ---------------------
export function slidingWindowSim(): SeqFrame[] {
  const arr = [2, 1, 5, 1, 3, 2, 4];
  const k = 3;
  const a = arr.map((v) => item(v));
  const frames: SeqFrame[] = [];
  let windowSum = arr.slice(0, k).reduce((x, y) => x + y, 0);
  let best = windowSum;
  let bestL = 0;
  const snap = (l: number, r: number, caption: string, lines: number[], best2 = false) =>
    frames.push({
      items: a.map((it, idx) => ({
        ...it,
        role: best2 ? (idx >= bestL && idx < bestL + k ? "match" : "default") : idx >= l && idx <= r ? "active" : "default",
      })),
      markers: best2 ? [] : [{ index: l, label: "L", tone: "compare" }, { index: r, label: "R", tone: "run" }],
      caption,
      lines,
    });

  frames.push({ items: a.slice(), caption: `Find the largest sum of any ${k} consecutive elements.`, lines: [1] });
  snap(0, k - 1, `First window sum = ${windowSum}. best = ${best}.`, [2, 3]);
  for (let r = k; r < arr.length; r++) {
    windowSum += arr[r] - arr[r - k];
    const l = r - k + 1;
    if (windowSum > best) { best = windowSum; bestL = l; }
    snap(l, r, `Slide → window sum = ${windowSum}. best = ${best}.`, [5, 6]);
  }
  snap(0, 0, `Best window sums to ${best} — found in O(n), one pass.`, [7], true);
  return frames;
}

export const SEQ_SIMS: Record<string, () => SeqFrame[]> = {
  array: arrayTwoPointer,
  stack: stackOps,
  queue: queueOps,
  "linked-list": linkedListOps,
  "linear-search": linearSearchSim,
  "binary-search": binarySearchSim,
  "ternary-search": ternarySearchSim,
  "sliding-window": slidingWindowSim,
};

// ----------------------------------------------------------------------------
// Interactive op builders: current items + arg → animation frames + new state.
// ----------------------------------------------------------------------------

export interface SeqOpResult {
  frames: SeqFrame[];
  next: SeqItem[];
}

export function seqSeed(kind: string): SeqItem[] {
  const vals = kind === "linked-list" ? [8, 3, 5] : [4, 7, 2];
  return vals.map((v) => item(v));
}

export function seqRestFrame(kind: string, items: SeqItem[]): SeqFrame {
  const markers = kind === "stack" ? topMark(items.length) : kind === "queue" ? endsMark(items.length) : headMark(items.length);
  const caption =
    kind === "stack"
      ? "A stack — push to add, pop the top (LIFO)."
      : kind === "queue"
        ? "A queue — enqueue at the rear, dequeue the front (FIFO)."
        : "A linked list — insert at head or tail, or delete a value.";
  return { items: plain(items), markers, caption, lines: [1] };
}

export function pushStack(items: SeqItem[], v: number): SeqOpResult {
  const node = item(v);
  const next = [...items, node];
  return {
    next,
    frames: [
      { items: [...plain(items), { ...node, role: "new" }], markers: topMark(next.length), caption: `push(${v}) → goes on top.`, lines: [1, 2] },
      { items: plain(next), markers: topMark(next.length), caption: `${v} is now the top.`, lines: [2] },
    ],
  };
}

export function popStack(items: SeqItem[]): SeqOpResult {
  if (!items.length) return { next: items, frames: [{ items: [], caption: "Stack is empty — nothing to pop.", lines: [4] }] };
  const last = items[items.length - 1];
  const next = items.slice(0, -1);
  return {
    next,
    frames: [
      { items: items.map((it, i) => ({ ...it, role: i === items.length - 1 ? "removed" : "default" })), markers: topMark(items.length), caption: `pop() removes the top (${last.label}).`, lines: [4, 5] },
      { items: plain(next), markers: topMark(next.length), caption: next.length ? `Top is now ${next[next.length - 1].label}.` : "Stack is empty.", lines: [5] },
    ],
  };
}

export function enqueue(items: SeqItem[], v: number): SeqOpResult {
  const node = item(v);
  const next = [...items, node];
  return {
    next,
    frames: [
      { items: [...plain(items), { ...node, role: "new" }], markers: endsMark(next.length), caption: `enqueue(${v}) → joins the rear.`, lines: [1, 2] },
      { items: plain(next), markers: endsMark(next.length), caption: `${v} waits at the rear.`, lines: [2] },
    ],
  };
}

export function dequeue(items: SeqItem[]): SeqOpResult {
  if (!items.length) return { next: items, frames: [{ items: [], caption: "Queue is empty — nothing to dequeue.", lines: [4] }] };
  const first = items[0];
  const next = items.slice(1);
  return {
    next,
    frames: [
      { items: items.map((it, i) => ({ ...it, role: i === 0 ? "removed" : "default" })), markers: endsMark(items.length), caption: `dequeue() removes the front (${first.label}).`, lines: [4, 5] },
      { items: plain(next), markers: endsMark(next.length), caption: next.length ? `Front is now ${next[0].label}.` : "Queue is empty.", lines: [5] },
    ],
  };
}

export function insertHead(items: SeqItem[], v: number): SeqOpResult {
  const node = item(v);
  const next = [node, ...items];
  return {
    next,
    frames: [
      { items: [{ ...node, role: "new" }, ...plain(items)], markers: headMark(next.length), caption: `insert_head(${v}) → O(1), repoint the head.`, lines: [1, 2] },
      { items: plain(next), markers: headMark(next.length), caption: `${v} is the new head.`, lines: [2] },
    ],
  };
}

export function insertTail(items: SeqItem[], v: number): SeqOpResult {
  const node = item(v);
  const next = [...items, node];
  const frames: SeqFrame[] = [];
  for (let k = 0; k < items.length; k++) {
    frames.push({ items: items.map((it, i) => ({ ...it, role: i === k ? "active" : "default" })), markers: [{ index: k, label: "cur", tone: "compare" }, ...headMark(items.length)], caption: "Walk to the tail (O(n) — no random access).", lines: [5, 6] });
  }
  frames.push({ items: [...plain(items), { ...node, role: "new" }], markers: headMark(next.length), caption: `Append ${v} at the tail.`, lines: [7] });
  frames.push({ items: plain(next), markers: headMark(next.length), caption: `${v} added.`, lines: [7] });
  return { next, frames };
}

export function deleteValue(items: SeqItem[], v: number): SeqOpResult {
  const idx = items.findIndex((it) => it.label === String(v));
  if (idx < 0) return { next: items, frames: [{ items: plain(items), markers: headMark(items.length), caption: `${v} is not in the list.`, lines: [11] }] };
  const next = items.filter((_, i) => i !== idx);
  const frames: SeqFrame[] = [];
  for (let k = 0; k <= idx; k++) {
    const found = k === idx;
    frames.push({
      items: items.map((it, i) => ({ ...it, role: i === k ? (found ? "removed" : "active") : "default" })),
      markers: [{ index: k, label: "cur", tone: "compare" }, ...headMark(items.length)],
      caption: found ? `Found ${v} — unlink it.` : `Is this ${v}? keep walking.`,
      lines: found ? [11] : [10, 11, 12],
    });
  }
  frames.push({ items: plain(next), markers: headMark(next.length), caption: `Deleted ${v}.`, lines: [13] });
  return { next, frames };
}

export function reverseList(items: SeqItem[]): SeqOpResult {
  if (items.length <= 1) {
    return { next: items, frames: [{ items: plain(items), markers: headMark(items.length), caption: "A list of 0–1 nodes is already reversed." }] };
  }
  const rev = [...items].reverse();
  return {
    next: rev,
    frames: [
      { items: items.map((it) => ({ ...it, role: "active" })), markers: headMark(items.length), caption: "Reverse: walk the list, flipping each node's next pointer." },
      { items: rev.map((it) => ({ ...it, role: "default" })), markers: headMark(rev.length), caption: "Reversed — the old tail is the new head." },
    ],
  };
}
