# Algolume — Plan

> **One place to learn algorithms.** Read it like a book, watch it run, play
> with it, take notes, and prove you've got it by solving problems — all in the
> same page. *Illuminate algorithms.*

---

## 1. Vision

Algolume is an interactive handbook for data structures & algorithms that
unifies five things normally scattered across a textbook, YouTube, LeetCode and
a notes app — into one local-first, no-signup web app:

| Pillar | What it means | Status |
|--------|---------------|--------|
| 📖 **Read** | A real book: clear, well-sequenced chapters & lessons. | planned |
| ▶️ **Watch** | Every concept has a live simulation you can step / pause / rewind. | ✅ engine done |
| 🎛️ **Play** | A sandbox to run an algorithm on *your own* input. | partial |
| 🧩 **Practice** | Coding problems with a real interpreter + hidden tests. | planned |
| 📝 **Note** | Personal notes & highlights saved per lesson, all in one place. | planned |

The north star (à la cartesian.app): **300+ interactive visualizations, 250+
editable/runnable snippets, a built-in Python interpreter, 22 chapters** — but
with first-class **notes** and a **book-like reading flow** layered on top.

---

## 2. The lesson experience (how the pillars combine)

A lesson is **not** a wall of text with a video bolted on. It's a single
scrollable page assembled from typed **content blocks**, so reading, watching,
playing, practising and noting are interleaved:

```
┌─ Lesson: "Quick Sort" ─────────────────────────────┐
│  prose        →  what & why, in book-quality prose  │
│  callout      →  intuition / gotcha / complexity    │
│  viz block    →  embedded sorting simulation        │  ← reuses the engine
│  playground   →  "try it on your own array"         │  ← editable + run
│  prose        →  partition deep-dive                │
│  note-anchor  →  user highlights + margin notes     │  ← personal notes
│  problem      →  "implement Lomuto partition"       │  ← tests + checker
│  quiz         →  2–3 quick checks for understanding │
└─────────────────────────────────────────────────────┘
```

Every block is **embeddable and self-contained** — the same `<Visualizer>` and
`<Playground>` components work inside a lesson, on a standalone page, or on the
landing previews.

---

## 3. Architecture principles

1. **Algorithms emit frames, they don't animate.** Pure `input → Frame[]`; the
   generic `usePlayer` scrubs them. *(done — `lib/types.ts`, `usePlayer.ts`.)*
2. **One generic player, many canvases.** ArrayCanvas, GridCanvas, GraphCanvas
   today; TreeCanvas, ListCanvas next. *(done.)*
3. **Semantic color tokens, light + dark.** *(done.)*
4. **Content as data.** Chapters/lessons are structured data (TS modules, or
   MDX) — never bespoke per-page layout. This is what lets the book scale to
   hundreds of pages.
5. **Local-first persistence.** Notes, highlights and progress live in the
   browser (IndexedDB), exportable to Markdown. No account required.
6. **Everything composes.** A viz, an editor, or a problem is a component that
   drops into any lesson by referencing data — not copy-paste.

---

## 4. Information architecture

```
/                     Landing (marketing + live previews)
/learn                Library — all chapters as a contents page
/learn/:chapter       Chapter overview + lesson list
/learn/:chapter/:lesson   A lesson (the block-based page above)
/playground           Standalone sandbox (pick algo → edit → run → watch)
/problems             Problem set browser (filter by topic/difficulty)
/notes                All your notes & highlights in one place
/sorting /pathfinding Existing standalone visualizers (kept; also embedded)
```

**Reading layout** (lesson page): left = chapter/lesson **sidebar** (the book's
spine); center = **content column** at comfortable reading width; right rail =
**"On this page"** outline + **your notes** for this lesson.

---

## 5. Content & lesson data model

```ts
type LessonBlock =
  | { kind: "prose"; md: string }
  | { kind: "heading"; text: string; id: string }
  | { kind: "callout"; tone: "intuition" | "warning" | "complexity"; md: string }
  | { kind: "viz"; module: "sorting" | "pathfinding" | ...; preset?: object }
  | { kind: "playground"; title?: string; starter: string }
  | { kind: "problem"; ref: string }      // → a Problem definition
  | { kind: "quiz"; q: string; choices: string[]; answer: number; why: string }
  | { kind: "note-anchor"; id: string };  // attach personal notes here

interface Lesson {
  id: string; chapter: string; title: string; summary: string;
  estMinutes: number; blocks: LessonBlock[]; problems: string[];
}
interface Chapter { id: string; title: string; blurb: string; lessons: Lesson[]; }
```

Authoring: start with **TS data modules** (typed, zero build magic); graduate to
**MDX** if prose volume demands it.

---

## 6. Notes system

- **Inline highlights** on prose (select text → highlight + optional note).
- **Per-lesson note panel** in the right rail; **global `/notes`** view collects
  everything, grouped by chapter, searchable.
- **Note anchors** bind a note to a specific block/line so it survives edits.
- **Storage:** IndexedDB (via a thin wrapper), **export to Markdown**, import
  back. Everything offline, nothing leaves the device.

---

## 7. Playground & problem-solving

- **Editor:** CodeMirror 6 (Python syntax, theming matched to our tokens).
- **Runtime:** **Pyodide** for runnable Python, eventually in a **web worker** so
  the UI never blocks; stdout/stderr streamed to an output console; tracebacks
  surfaced inline. C++ reference snippets are included with problem solutions;
  executable C++ remains a future compiler/judge task.
- **Playground:** edit an algorithm, run it on custom input, and (where it maps
  to a known algorithm) **feed the result back into the visualizer**.
- **Problems:** `{ prompt, starter, hiddenTests, solution, complexity, hints }`.
  A checker runs hidden tests against the user's function and reports pass/fail
  per case — like the reference's challenge system.

### Practice standard (every topic)

- **Each topic gets a laddered set — easy + medium + hard** — and ideally several
  at each level so there is enough to practise, not just one token problem.
- **Embed the problems in the lessons.** A lesson ends with the `problem("id")`
  cards that exercise exactly what it just taught, so the flow is *learn → watch →
  then immediately solve* on the same page. Standalone `/problems` is the browser;
  the lesson embed is the call-to-action.
- Ladder difficulty *within* a topic: easy = reinforce the core idea, medium =
  combine it with another tool, hard = the well-known hard variant.
- **Authoring rules:** entry functions return a value (clean equality); 2–3 visible
  examples (+ `explain`) and 3–5 hidden tests with edge cases; hints go nudge →
  step → near-answer; reference `solution` matches the stated complexity; set
  `topic`/`lesson` so practice links back to the reading. Include Python and
  C++ reference solutions where the problem shape supports it. **Every runnable
  Python solution must be verified against all its cases in CPython before it
  ships.** C++ snippets should compile cleanly with GNU C++17.

### Problem browser — make it a real, searchable hub

The `/problems` page should feel like a **topic roadmap**, not a generic card
wall. As the set grows, students should see prerequisite flow, topic progress,
and the next queue of problems from one screen. Current direction:

- **Zoomable / pannable topic map:** nodes for Arrays & Hashing, Two Pointers,
  Binary Search, Stacks & Queues, Recursion, Graphs & MST, DP, Bit Manipulation,
  Math, and future tracks, connected by prerequisite-style edges.
- **Per-node progress:** every node with available problems shows solved / total
  and a compact progress bar; planned nodes stay visible but subdued.
- **Focused problem queue:** selecting a node filters the right-side queue to the
  matching topic(s), while keeping difficulty and text search available.
- **Real search & facets:** full-text search over title/summary/tags, plus
  filters for **difficulty**, **topic/map node**, and **status**. Done now:
  node, difficulty, solved/unsolved status, and search text are reflected in the
  URL so views are shareable. Still later: attempted/recently-attempted state.
- **Sort options:** by roadmap order, difficulty, or recently added.
- **Progress at a glance:** global solved summary plus per-node progress, echoing
  the lesson progress bar.
- **Empty/zero states** that read well, and skeletons while Pyodide warms up.
- Keep it **fast and keyboard-friendly** (arrow/enter to open), and wire it into
  the command palette once that lands.

---

## 8. Roadmap (incremental — one phase at a time)

### Done
- **Phase 0 — Foundation** ✅ — Vite/React/TS/Tailwind, frame engine, generic player.
- **Phase 1 — Brand & theming** ✅ — Algolume identity, semantic tokens,
  **light + dark (light is the default)**, editorial landing page.
- **Phase 2 — Visualizers** ✅ — Array/searching/sorting/recursion/linear
  structures/hash/combined trees/traversal/pathfinding/shortest-path visualizers in lesson order;
  searching includes linear/binary/ternary, recursion includes customizable call
  stack, divide-and-conquer and backtracking/pruning simulations shared with lessons;
  shortest paths includes Bellman-Ford relaxation and Floyd-Warshall matrix DP.

### Next
- **Phase 3 — Handbook shell** ✅
  - [x] Chapter/lesson **data model** + content registry (prev/next, lookup)
  - [x] `/learn` library + **lesson reading layout** (spine sidebar + content
        column + right rail with "on this page")
  - [x] Block renderer + tiny Markdown renderer: prose, heading, callout,
        **embedded viz block** (compact sorting widget; pathfinding launch)
  - [x] Reading progress bar + prev/next lesson nav
  - [x] First lessons authored: Foundations (Big-O), Sorting (×3), Pathfinding
  - [ ] More content + per-lesson "mark complete" progress
- **Phase 4 — Notes & progress** ✅ (core)
  - [x] Per-lesson notes saved locally (right rail, autosaved)
  - [x] **Lesson completion** tracking (checks in sidebar + library, progress bar)
  - [x] Global **`/notes`** view with **Markdown export** + delete
  - [ ] Inline text highlights on prose; IndexedDB upgrade (currently localStorage)
- **Phase 5 — Playground & problems** ✅
  - [x] In-browser **Python** via **Pyodide** (lazy CDN load), output console
  - [x] `/playground` page: Python editor (line numbers, tab-indent) + examples + run
  - [x] Problem schema + base64-JSON **hidden-test checker** in Pyodide;
        `/problems` browser (zoomable topic roadmap + focused queue/search) + `/problems/:id`
        solve page (Run examples / Submit, per-case results, progressive hints,
        revealable solution); reactive solved store
  - [x] Revealable C++ reference snippets for the current problem set; Python
        remains the only in-browser graded language for now
  - [x] `/problems` shareable filters: roadmap node, difficulty, solved/unsolved
        status, search text, visible count, and clear-filters action
  - [x] In-lesson **`problem("id")` block** (embedded after the matching lesson)
  - [x] Laddered set started: every current topic has **easy + medium + hard**
        (arrays, searching, recursion, hashing, stacks/strings)
  - [x] In-lesson runnable **playground block** (edit + run inside a lesson)
- **Phase 6 — Content build-out** (toward 22 chapters; see §9) — *CP onboarding
  now comes first, topic 10 done, and each module is multi-lesson*: Competitive
  programming intro (judge loop, C-to-C++ bridge, statement reading,
  submissions/verdicts/templates), Foundations (Big-O with counting
  tricks/math examples, practical time complexity, deeper space complexity), Arrays
  (basics, sliding window), Searching (linear with sim, binary, ternary + log bases), Sorting (×5), Recursion
  (basics with stack/tree visuals, divide-and-conquer recurrences, backtracking
  with examples + decision-tree visual), Linked lists (pointers in C++ + ×2), Stacks & queues (×3), Hashing
  (tables with C++/collisions, two-sum), Trees (basics, BST ops, red-black trees with one combined visualizer), Traversals (×2), Pathfinding
  (grid BFS/DFS simulations, Dijkstra/A*, Bellman-Ford, Floyd-Warshall), Minimum spanning trees
  (definition, cut/cycle properties, Kruskal, Prim, DSU, visualizer + problems). **Every module has multiple
  lessons**; each pairs prose with an interactive sim and/or a derivation visual.
  - **Goal: each module = several lessons (learn → understand → visualize).**
    Keep adding lessons + visualizers to existing modules, not just new modules.
  - **Lesson standard from now on:** avoid one huge prose chunk. Use sections
    such as **Concept**, **Math/Invariant intuition**, **Visualization**,
    **Complexities (time + space)**, and **Examples / C++ sketch** whenever the
    topic supports them, so the right-rail outline is useful and the lesson
    reads like university notes.
  - Sim engine: `SeqCanvas` (array / **binary-search** lo·mid·hi /
    **sliding-window** / stack / queue / list), `TreeCanvas` (BST + traversals),
    `HashCanvas`, shortest-path graph/matrix canvas; derivation visuals
    (growth chart, ½n² triangle, halving, recurrence tree).
  - [x] **Topic 12 — Heaps & priority queues** ✅: chapter (structure + operations),
        interactive heap visualizer (sift up/down + backing array), and a laddered
        problem set (Last Stone Weight / K Smallest / Merge K Sorted Lists).
  - [x] **Topic 19 — Dynamic programming (1D + 2D)** ✅: chapter (foundations/1D +
        2D tables), a **DP-table visualizer** (coin change / unique paths / edit
        distance, dependency-highlighted), and laddered problems (Climbing Stairs /
        Coin Change / Longest Common Subsequence). Knapsack/LIS variants still to add.
  - [x] **Topic 21 — Bit manipulation** ✅: theory-first chapter (binary/two's
        complement, operators, bit tricks) + **bitmask DP** (subsets as integers,
        assignment problem), with laddered problems (Single Number / Counting Bits /
        Assignment Problem). A small bit-op visualizer is still a nice-to-add.
  - [x] **Topic 22 — Math for algorithms** ✅: chapter (gcd/lcm/modular arithmetic;
        sieve/fast-power/modular-inverse/nCr mod p) + laddered problems (GCD /
        Modular Exponentiation / Binomial mod p). Bit-manipulation now has an
        interactive **bit-ops visualizer** too.
  - [x] **Reorg done**: Bit manipulation moved up (after Arrays); bitmask-DP lesson +
        assignment problem moved into the DP chapter; added a **Held-Karp /
        Travelling Salesman** bitmask-DP **simulation** (tsp mode on the DP table)
        and a TSP problem.
  - [x] **NP-hardness chapter** ✅ (after Foundations, no visualizer): P/NP,
        verification, NP-complete, reductions, NP-hard, TSP/SAT/knapsack, and the
        coping strategies (exact-exponential, approximation, heuristics, etc.).
  - [x] **Topic 17 — Greedy algorithms** ✅: chapter (greedy method + exchange
        argument; classics) + **activity-selection visualizer** (interval timeline)
        + problems (Activity Selection / Jump Game / Minimum Arrows).
  - [x] **Topic 20 — Strings & pattern matching** ✅: chapter (naive scan; KMP +
        failure function + Rabin–Karp) + **pattern-matching visualizer** (naive vs
        KMP) + problems (strStr / Count Occurrences / Longest Happy Prefix).
  - [x] **Greedy visualizers expanded** ✅: Greedy lab now has Activity selection,
        **Kadane's max subarray**, and **fractional knapsack** (+ Max Product
        Subarray problem).
  - [x] **Topic 13 — Graphs & representations** ✅: chapter (list/matrix/edge-list;
        BFS/DFS, components, cycle detection, topological sort) + problems
        (Connected Components / Course Schedule / Topological Order).
  - [x] **Topic 18 — Divide & conquer** ✅: chapter (template + Master Theorem;
        classics) + problems (Fast Power / Majority Element, reusing binary search /
        count inversions / median-of-two-sorted).
  - [x] **Math expanded + Game theory chapter** ✅: sieve visualizer + extended
        Euclid / totient / CRT notes + cp-algorithms & Forthright resources +
        Count Primes; new **Game theory** chapter (W/L positions, Nim, Sprague–
        Grundy) with a **W/L + Grundy visualizer** and problems (Nim / Subtraction
        Game / Grundy Number).
  - **All 22 outline chapters + extras (NP-hardness, game theory) are covered.**
  - [x] **Supabase + Google OAuth progress sync** ✅ (local-first): optional
        sign-in mirrors lesson progress, notes, and solved problems to a per-user
        JSON row (RLS), merging on login (union + newest-wins notes) with a live
        sync-status chip. No-ops cleanly when env vars are unset.
  - [x] **Competitive programming handbook intro**: add a practical onboarding
        path before the problem set:
        - What CP is, how online judges work, and what "accepted" means.
        - C to C++ transition for students who know C: `iostream`, `vector`,
          `string`, `pair`, `tuple`, `sort`, lambdas, references, range-for,
          STL containers, iterators, and common pitfalls.
        - How to read a problem statement: inputs/outputs, constraints,
          examples, hidden tests, edge cases, and deriving the needed complexity.
        - How to submit: local compile/run, sample testing, custom tests,
          choosing language/version, reading verdicts (AC/WA/TLE/MLE/RE/CE),
          debugging without seeing hidden tests.
        - CP templates and habits: fast I/O, type aliases, `long long`, modular
          arithmetic, test-case loops, assertions, and clean function structure.
  - [x] **Minimum spanning tree notes**: add a full MST chapter/lesson set with
        graph prerequisites, tree vs spanning tree, MST definition, cut
        property, cycle property, Kruskal, Prim, DSU/Union-Find, proof
        sketches, time/space complexity, examples, and a visualizer for edge
        selection/rejection.
  - [ ] More visualizers: insertion/selection done; add heap, weighted-grid,
        sliding-window-substring, recursion call-tree, hash-resize.
- **Phase 7 — Polish**
  - [x] Keyboard shortcuts (space / ←/→ in players)
  - [x] Full-text **search** across lessons/notes (icon nav + debounced input)
  - [x] Lesson right rail: always-on "On this page" + visualizer links
  - [x] **Command palette** (⌘K / Ctrl+K) — quick-jump to any lesson, visualizer,
        or problem from anywhere
  - [x] **Mobile nav menu** (hamburger dropdown under `md`)
  - [ ] Shareable deep links (viz presets / lesson sections encoded in URL)
  - [ ] Weighted grid + maze; Tree/List/Heap/Hash visualizers as content lands

---

## 9. Content outline (the 22 chapters)

1. Complexity & Big-O · 2. Arrays & strings · 3. Searching (linear, binary, ternary) ·
4. Sorting *(visualizer ready)* · 5. Recursion & backtracking · 6. Linked lists ·
7. Stacks & queues · 8. Hashing & hash tables · 9. Trees & BSTs ·
10. Tree traversals · 11. Balanced trees · 12. Heaps & priority queues ·
13. Graphs & representations · 14. Graph traversal *(visualizer ready)* ·
15. Shortest paths *(visualizer ready)* · 16. Minimum spanning trees *(visualizer ready)* ·
17. Greedy algorithms · 18. Divide & conquer ·
**19. Dynamic programming — 1D *and* 2D DP** ·
20. Strings & pattern matching ·
**21. Bit manipulation — theory + bitmask DP** ·
**22. Math for algorithms — full, detailed chapter**.

Each chapter = several lessons, each lesson ending in problems. Visualizer-ready
topics get an embedded simulation from day one.

> **Every chapter must be detailed and eloquent.** No stub chapters — each reads
> like polished university notes (Concept · Math/Invariant · Visualization ·
> Complexity time+space · Examples/C++), with a visualization where it helps and a
> laddered problem set embedded at the end. The three chapters called out above
> need extra depth:
>
> - **19 · Dynamic programming** — both **1D DP** (Fibonacci/climbing stairs, house
>   robber, coin change, longest increasing subsequence) **and 2D DP** (grid paths,
>   0/1 knapsack, edit distance, LCS). Teach the full arc: recognise overlapping
>   subproblems → state definition → recurrence/transition → base cases →
>   memoization vs tabulation → space optimisation. Visualizer: a **DP table** that
>   fills cell-by-cell, lighting the cells a transition reads from.
> - **21 · Bit manipulation** — primarily **theoretical**: binary representation,
>   two's complement, the core operators (`&`, `|`, `^`, `~`, `<<`, `>>`), common
>   tricks (test/set/clear/toggle a bit, lowest set bit `x & -x`, popcount, power-of-
>   two check, XOR tricks). Then **bitmask DP**: subsets as integers, iterating
>   submasks, and canonical problems (subset-sum over masks, assignment/TSP-style
>   `dp[mask]`). Light/optional visualizer: a bit-grid that animates an operation.
> - **22 · Math for algorithms** — a real, detailed chapter: divisibility, GCD/LCM
>   (Euclid), modular arithmetic (mod add/mul, fast exponentiation, modular
>   inverse), primes (sieve of Eratosthenes, primality), combinatorics (factorials,
>   nCr, Pascal), and number-theory tricks that show up in problems.

---

## 10. Content backlog / TODO

- **Intro to competitive programming handbook** ✅
  - Implemented as the **Competitive programming intro** module with lessons on
    the judge loop, C-to-C++ bridge, statement/constraint reading, and
    submissions/verdicts/templates. It now appears first in `/learn`, and
    `/problems` links to it before the filterable problem set.
  - Why CP matters for algorithms: constraints force algorithm choice.
  - C to C++ bridge: arrays to `vector`, C strings to `string`, structs/classes,
    references vs pointers, STL algorithms, container complexity tables.
  - Expanded with fast-I/O details (`ios::sync_with_stdio(false)`,
    `cin.tie(nullptr)`, `\n` vs `endl`), dynamic library type guidance
    (`std::vector`, `std::string`, Java `ArrayList`, Java `StringBuilder`),
    beginner problem walkthroughs (Codeforces 4A, UVa 10055, UVa 100), and
    resource links (NSUPS blogs, cp-algorithms, USACO Guide CP resources,
    Forthright48 CPPS 101, GeeksforGeeks references).
  - Problem-reading workflow: restate the task, identify input size, list edge
    cases, choose data structures, estimate Big-O, then code.
  - Submission workflow: compile locally, run samples, make adversarial tests,
    submit, interpret verdicts, and improve.
- **Minimum spanning trees** ✅
  - Implemented as a full **Minimum spanning trees** chapter with definition,
    cut/cycle properties, Kruskal, Prim, DSU, proof sketches, C++ examples,
    a Kruskal/Prim visualizer, and easy/medium/hard practice problems.
  - Motivation: connect all nodes with minimum total edge cost.
  - Foundations: connected undirected weighted graphs, spanning tree has
    `V-1` edges, why cycles are unnecessary.
  - Kruskal: sort edges, use DSU, accept edges joining different components.
  - Prim: grow one connected tree with a priority queue.
  - Proofs: cut property, cycle property, exchange argument.
  - Complexity: Kruskal `O(E log E)`, Prim `O(E log V)` with a heap, DSU nearly
    constant amortized with path compression + union by rank.
  - Visualizer: accepted/rejected edges, components, current cut, priority
    queue/DSU state, and total MST weight.
- **Graph extensions**
  - Graph representation chapter: adjacency list/matrix/edge list trade-offs.
  - More shortest path practice: path reconstruction, multi-source BFS,
    0-1 BFS, DAG shortest paths.
- **Problem practice**
  - Add tagged problem sets after each lesson, with starter code, hidden tests,
    hints, expected complexity, and editorial solution.
  - Add a **C++ reference solution** for every new problem alongside the runnable
    Python starter/solution. Visualizer code snippets can stay concise; no need
    to mirror every visualizer snippet in C++.
  - **More problems per topic** — grow each topic well past one-per-level so
    students have enough to drill; keep the easy/medium/hard ladder and embed the
    cards into the matching lessons (`problem("id")`).
  - Backfill problem sets for topics that don't have one yet (sorting, linked
    lists, trees, traversals, pathfinding), then extend forward as new chapters
    land. Every problem verified in CPython before shipping.
- **Dynamic programming (chapter 19)** — detailed 1D + 2D treatment
  - 1D: climbing stairs, house robber, coin change, max subarray (revisit as DP),
    longest increasing subsequence.
  - 2D: unique grid paths, 0/1 knapsack, edit distance, longest common
    subsequence, matrix-chain-style problems.
  - Pedagogy arc: spot overlapping subproblems → define state → write the
    transition → base cases → memoization vs tabulation → space optimisation.
  - Visualizer: a **DP table** that fills cell by cell and highlights the cells
    each transition depends on (and the reconstructed answer path).
  - Laddered problems: easy (1D) → medium (basic 2D) → hard (knapsack/edit
    distance), embedded in the lessons.
- **Bit manipulation (chapter 21)** — theory-first, then bitmask DP
  - Theory: binary/two's complement, `& | ^ ~ << >>`, set/clear/toggle/test a
    bit, lowest set bit `x & -x`, popcount, power-of-two check, XOR identities.
  - **Bitmask DP:** represent subsets as integers, iterate submasks, and solve
    canonical `dp[mask]` problems (subset selection, assignment/TSP flavour).
  - Optional small visualizer: a bit row that animates a single operation.
- **Math for algorithms (chapter 22)** — make it a full chapter, not a stub
  - GCD/LCM (Euclid), modular arithmetic (mod add/mul, **fast exponentiation**,
    modular inverse), primes (**sieve**, primality), combinatorics (factorials,
    nCr, Pascal's triangle), and recurring number-theory tricks.
- **Precision and machine arithmetic for CP** — add a focused section/chapter
  because numeric representation is a frequent source of WA.
  - **How machines store integers:** fixed-width binary words, signed vs unsigned
    interpretation, two's complement intuition, range limits, C++ signed overflow
    being unsafe/undefined, unsigned arithmetic wrapping modulo `2^k`, and why
    sums/products/counts often need `long long` or `__int128`.
  - **How machines store floating point:** IEEE-style sign/exponent/mantissa
    model, binary fractions, why many decimal values (like `0.1`) are not exact,
    rounding after operations, loss of significance, and why equality comparison
    on `double` is usually wrong.
  - **Contest handling rules:** use integer arithmetic when possible, scale
    decimals to cents/units when exactness matters, compare floats with absolute
    and relative `eps`, print with `fixed << setprecision(k)`, use `long double`
    when precision margins are tight, and read the statement's accepted error
    tolerance carefully.
  - **C++ examples:** overflow demonstration, safe multiplication with
    `__int128`, modular multiplication, `eps` comparator, geometry orientation
    with integers vs floating point, and binary-search-on-answer precision loops.
  - **Visualizer idea:** bit layout for integers and floating point: sign,
    exponent, mantissa, rounding step, and overflow/wraparound animation.
- **Competitive programming number theory track**
  - GCD/LCM, Euclid and extended Euclid, modular arithmetic, fast power, modular
    inverse, primes, sieve and segmented sieve, factorization, divisor count/sum,
    Euler phi, Fermat/Euler theorem, CRT, Diophantine equations, combinatorics
    modulo primes, and number-theory problem patterns.
  - Pair lessons with CP resources such as cp-algorithms, USACO Guide, and
    Forthright48 CPPS 101, plus laddered problems from easy divisibility to
    harder modular/CRT tasks.
- **Competitive programming game theory track**
  - Normal-play impartial games, winning/losing states, state graphs, DP over
    moves, Nim and xor, Sprague-Grundy numbers, `mex`, composite games by xor of
    Grundy values, and common traps (misere variants, terminal-state definition,
    cyclic games).
  - Include worked examples, small game-state visualizer, and problems that move
    from take-away games to DAG games and Grundy decomposition.
- **Quality bar for all chapters** — every existing and future chapter should be
  *detailed and eloquent*: sectioned university-notes prose, a visualization
  where it earns its place, and an embedded laddered problem set. Audit older
  chapters and bring any thin ones up to this bar.

---

## 11. Accounts & progress sync (Supabase + Google OAuth)

Today all progress (lesson completion, notes, solved problems) lives in
`localStorage` — great for no-signup use, but it doesn't follow the student across
devices. Add **optional** sign-in so progress can sync, while keeping the app fully
usable signed-out.

- **Auth:** **Google OAuth via Supabase Auth.** A single "Sign in with Google"
  button; Supabase handles the OAuth handshake and session.
- **What syncs:** lesson completion, per-lesson notes, and solved-problem ids —
  the three local stores (`lib/progress.ts`, `lib/notesStore.ts`,
  `lib/problems/solved.ts`).
- **Model:** keep the local stores as the source of truth offline; when signed in,
  mirror them to Supabase (Postgres) keyed by user id, and **merge** on login
  (union of solved/completed, newest-wins for notes). Local-first stays the
  default; the cloud is a backup/sync layer, not a gate.
- **Schema sketch:** `progress(user_id, lesson_key, completed_at)`,
  `solved(user_id, problem_id, solved_at)`, `notes(user_id, lesson_key, body,
  updated_at)`, with row-level security so a user only sees their own rows.
- **UX:** signed-out = exactly today's experience; signed-in adds a small avatar
  menu and a "synced" indicator. No feature is locked behind login.
- **Keep secrets right:** only the Supabase anon/public key ships to the client;
  RLS does the enforcement. Env via Vite `import.meta.env`.

---

## 12. Tech

**Now:** React 18 · Vite · TypeScript · Tailwind · React Router · lucide-react ·
**Pyodide** (Python in-browser) · Fraunces/Inter/JetBrains Mono.
**Planned:** **Supabase** (Auth + Postgres for Google sign-in & progress sync) ·
CodeMirror 6 (richer editor) · IndexedDB wrapper (offline notes/progress) · MDX
(optional, if prose grows).

---

## 13. Links & contact

- **Repo:** https://github.com/mahirshahriar1/Algolume
- **Author:** Mahir Shahriar — https://www.linkedin.com/in/mahir-shahriar-tamim/

---

## 14. Working agreement

- Build **incrementally**, one phase/chunk at a time; keep `log.md` updated.
- Keep `npm run build` green before a chunk is "done".
- Every feature works in **light *and* dark**, and is **embeddable** (so it can
  live inside a lesson, not just a standalone page).
- Default to **content-as-data** so the book scales without bespoke pages.
- Future lesson edits should follow the sectioned university-notes pattern:
  concept, mathematical intuition/invariants, visualization, time and space
  complexity, and concrete examples/code where useful.

---

## 15. Ideas & enhancements (nice-to-haves to consider)

Optional directions beyond the core roadmap — not commitments, just things worth
weighing as the project grows:

- **Per-topic deep-dive workflow** (active going forward): user picks one topic →
  detailed analysis + a custom visualization + a laddered easy/medium/hard problem
  set, all embedded in the lessons.
- **Playground-to-visualizer bridge** — the in-lesson runnable playground block
  exists now; next, where a snippet maps to a known algorithm, feed its result
  into the matching visualizer.
- **Spaced repetition / review** — resurface concepts and previously-missed
  problems on a schedule once accounts exist.
- **Profile & streaks** — solved count, per-topic mastery bars, a daily streak;
  light gamification to keep momentum (after Supabase).
- **Multi-language problems** — C++ reference solutions are in place. Next step
  is executable C++ grading via either a bundled WASM compiler/runtime or a small
  backend judge service; until then, only Python submissions are checked
  in-browser.
- **Shareable deep links & permalinks** — link to a specific lesson section,
  a visualizer preset (graph/tree/state encoded in the URL), or a problem.
- **Command palette** (⌘K) — jump to any lesson, visualizer, or problem; already
  listed under Phase 7 polish.
- **Mobile pass** — a real mobile nav menu and touch-friendly visualizer controls.
- **Accessibility** — keyboard-navigable visualizers, ARIA on canvases, reduced-
  motion support, and color-blind-safe accents.
- **Export & portfolio** — export notes/progress to Markdown/PDF; a public
  read-only "what I've learned" page.
- **Editorial walkthroughs** — for hard problems, a step-by-step editorial (not
  just the final solution) that builds the idea up.
- **Visualizer gallery growth** — heap, weighted grid + maze, segment tree, trie,
  and a DP-table visualizer (ties into chapter 19). *Keep related algorithms in
  one lab rather than many look-alike cards:* the weighted-graph family (shortest
  paths, MST, union-find) now lives in a single tabbed **Graph algorithms** lab —
  apply the same grouping to future families (e.g. a tree-structures lab).
- **Analytics-light** — privacy-respecting, self-hosted metrics on which lessons/
  problems are used, to guide where to invest next.
- **Content QA** — a script that runs every problem's reference solution against
  its own tests in CI, so a bad expected value can never ship.
