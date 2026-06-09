/** Hash-table model with separate chaining, used by HashSim + the dedicated page. */

export const BUCKETS = 7;

export type Bucket = { value: number; isNew?: boolean; hl?: "active" | "match" }[];

export interface HashFrame {
  buckets: Bucket[];
  active: number; // bucket being touched (-1 = none)
  caption: string;
  formula?: string;
  lines?: number[];
}

export const HASH_CODE = [
  "def insert(key):",
  "    i = key % len(buckets)   # hash",
  "    buckets[i].append(key)   # chain on collision",
  "",
  "def lookup(key):",
  "    i = key % len(buckets)",
  "    for k in buckets[i]:      # scan the chain",
  "        if k == key: return True",
  "    return False",
];

export function emptyBuckets(): Bucket[] {
  return Array.from({ length: BUCKETS }, () => []);
}

const clone = (b: Bucket[]): Bucket[] => b.map((x) => x.map((e) => ({ ...e })));

export interface HashOpResult {
  frames: HashFrame[];
  next: Bucket[];
}

/** Insert one key, animating the hash + placement (and any collision). */
export function hashInsertOp(buckets: Bucket[], k: number): HashOpResult {
  const h = k % BUCKETS;
  const frames: HashFrame[] = [];
  frames.push({ buckets: clone(buckets), active: h, caption: `Insert ${k}: hash it to a bucket.`, formula: `h(${k}) = ${k} mod ${BUCKETS} = ${h}`, lines: [1, 2] });
  const collision = buckets[h].length > 0;
  const next = clone(buckets);
  next[h].push({ value: k, isNew: true });
  frames.push({
    buckets: clone(next),
    active: h,
    caption: collision ? `Bucket ${h} was taken → chain ${k} on (a collision).` : `Place ${k} in bucket ${h} — O(1) average.`,
    formula: `h(${k}) = ${h}`,
    lines: [3],
  });
  next.forEach((bk) => bk.forEach((e) => (e.isNew = false)));
  return { frames, next };
}

/** Look up a key: hash to its bucket, then scan the chain. */
export function hashLookupOp(buckets: Bucket[], k: number): HashOpResult {
  const h = k % BUCKETS;
  const frames: HashFrame[] = [];
  frames.push({ buckets: clone(buckets), active: h, caption: `Look up ${k}: hash to bucket ${h}.`, formula: `h(${k}) = ${k} mod ${BUCKETS} = ${h}`, lines: [5, 6] });
  const chain = buckets[h];
  let found = false;
  for (let i = 0; i < chain.length; i++) {
    const b = clone(buckets);
    const hit = chain[i].value === k;
    b[h][i].hl = hit ? "match" : "active";
    frames.push({
      buckets: b,
      active: h,
      caption: hit ? `Found ${k} in the chain!` : `${chain[i].value} ≠ ${k} — keep scanning…`,
      formula: `h(${k}) = ${h}`,
      lines: hit ? [7, 8] : [7],
    });
    if (hit) { found = true; break; }
  }
  if (!found) frames.push({ buckets: clone(buckets), active: h, caption: `${k} is not in bucket ${h} — not found.`, lines: [9] });
  return { frames, next: buckets };
}

/** Canned demo sequence for the embedded lesson sim. */
export function buildHashFrames(): HashFrame[] {
  const keys = [12, 5, 19, 26, 7, 33];
  let buckets = emptyBuckets();
  const frames: HashFrame[] = [
    { buckets: emptyBuckets(), active: -1, caption: `A hash table maps a key to a bucket with h(k) = k mod ${BUCKETS}.` },
  ];
  for (const k of keys) {
    const r = hashInsertOp(buckets, k);
    frames.push(...r.frames);
    buckets = r.next;
  }
  frames.push({ buckets: clone(buckets), active: -1, caption: "All keys placed. Lookups hash straight to the right bucket." });
  return frames;
}
