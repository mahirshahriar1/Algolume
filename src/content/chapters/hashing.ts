import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const hashing = chapter(
  "hashing",
  "Hashing & hash tables",
  "Turning keys into bucket indices for O(1) average lookup.",
  "Hash",
  [
    lesson(
      "hash-tables",
      "Hash tables",
      "How a hash function gives near-constant-time lookup, and what happens on a collision.",
      8,
      [
        prose(
          "A **hash table** stores key/value pairs and finds them in **O(1) on average**. The trick is a **hash function** that turns any key into a bucket index. To store or find a key, you hash it and go straight to that bucket — no scanning.",
        ),
        heading("The intuition"),
        prose(
          "Think of a hash table like a wall of labelled lockers. Without hashing, finding a key means walking down a hallway asking every locker, \"are you the one?\" With hashing, the key itself tells you which locker to open. A good hash function spreads keys across lockers so most lockers stay short and easy to inspect.",
        ),
        prose(
          "The core recipe is:\n\n1. Convert the key into an integer hash code.\n2. Compress that integer into a valid bucket index, often `hash % bucket_count`.\n3. Store the key/value pair in that bucket.\n4. On lookup, hash the key again and inspect only that bucket.",
        ),
        prose(
          "Here we insert keys into 7 buckets with `h(k) = k mod 7`. Watch what happens when two keys want the same bucket:",
        ),
        viz("hash", { title: "Insert with h(k) = k mod 7 (separate chaining)" }),
        heading("C++ separate chaining example"),
        prose(
          "This small table stores integers using `key % bucketCount`. Each bucket is a `vector<int>`, so collisions are handled by keeping multiple keys in the same bucket chain.\n\n```cpp\nclass HashSet {\n    static const int bucketCount = 7;\n    vector<int> buckets[bucketCount];\n\n    int hash(int key) {\n        return key % bucketCount;\n    }\n\npublic:\n    void insert(int key) {\n        int i = hash(key);\n        for (int x : buckets[i]) {\n            if (x == key) return;      // already present\n        }\n        buckets[i].push_back(key);     // collision? append to chain\n    }\n\n    bool contains(int key) {\n        int i = hash(key);\n        for (int x : buckets[i]) {\n            if (x == key) return true;\n        }\n        return false;\n    }\n};\n```",
        ),
        heading("Hash collisions"),
        prose(
          "When two keys hash to the same bucket — a **collision** — we **chain** them in a little linked list in that bucket. As long as the table isn't too full, chains stay short and lookups stay fast.",
        ),
        prose(
          "Example: with `h(k)=k mod 7`, the keys `12`, `19`, and `26` all land in bucket `5`, because each leaves remainder `5`. The hash table has not failed; collision handling is part of the design. The danger is not one collision, but **too many collisions in the same bucket**, which turns lookup back into a small linear search.",
        ),
        derive(
          [
            step("load factor α = items / buckets", "How full the table is on average."),
            step("average chain length ≈ α", "Items spread roughly evenly across buckets."),
            step("keep α below a constant (resize if not)", "Grow the table when it fills up."),
          ],
          "O(1) average lookup",
          "Why hashing is (amortised) constant time",
        ),
        callout(
          "warning",
          "`O(1)` is the **average** case. A bad hash function (everything in one bucket) degrades to `O(n)` — a single long chain. Good hashing spreads keys evenly.",
        ),
        heading("What makes a hash function good?"),
        prose(
          "For a hash table, a good hash function is:\n\n- **Deterministic**: the same key always gives the same hash.\n- **Uniform enough**: common inputs spread across buckets instead of clustering.\n- **Fast**: hashing should be cheaper than the search it replaces.\n- **Consistent with equality**: if two keys are equal, they must hash to the same value.\n\nA hash function does not need to be random, and it does not need to avoid all collisions. It needs to make collisions rare enough that buckets stay short.",
        ),
        heading("Resizing"),
        prose(
          "When the load factor gets too high, the table allocates more buckets and **rehashes** every key into the larger table. That resize is expensive in the moment, but it happens occasionally; spread over many insertions, hash-table insert remains amortized `O(1)`.",
        ),
        callout(
          "intuition",
          "Python's `dict` and `set`, and most languages' maps, are hash tables. This is why membership tests (`x in seen`) are so fast — and why two-sum-style problems use a set.",
        ),
      ],
    ),
    lesson(
      "sets-two-sum",
      "Sets & the two-sum trick",
      "How a hash set turns an O(n²) search into a single O(n) pass.",
      6,
      [
        prose(
          "A **hash set** is a hash table that stores only keys — membership in `O(1)`. That single power collapses a lot of brute-force scans.",
        ),
        prose(
          "The classic is **two-sum**: find two numbers that add up to a target. Brute force checks every pair — `O(n²)`. With a set you do it in one pass: for each number, ask whether its **complement** has already been seen.",
        ),
        prose(
          "```\ndef two_sum(nums, target):\n    seen = set()\n    for x in nums:\n        if target - x in seen:   # O(1)\n            return True\n        seen.add(x)\n    return False\n```",
        ),
        prose(
          "The same idea in C++ uses `unordered_set`, which is the standard-library hash set:\n\n```cpp\nbool twoSum(vector<int>& nums, int target) {\n    unordered_set<int> seen;\n\n    for (int x : nums) {\n        int need = target - x;\n        if (seen.count(need)) return true;\n        seen.insert(x);\n    }\n    return false;\n}\n```",
        ),
        viz("hash", { title: "Each lookup hashes straight to a bucket" }),
        derive(
          [
            step("brute force: every pair", "Two nested loops → n(n−1)/2 checks."),
            step("⟹ O(n²)", "Quadratic."),
            step("hash set: one pass, O(1) lookups", "Trade O(n) memory for speed."),
            step("⟹ O(n) time", "Linear."),
          ],
          "O(n²) → O(n)",
          "Trading memory for time",
        ),
        callout(
          "intuition",
          "Whenever you catch yourself writing two nested loops to find a pair or a duplicate, ask: could a hash set just remember what I've seen?",
        ),
        problem("two-sum"),
        problem("contains-duplicate"),
      ],
    ),
  ],
);
