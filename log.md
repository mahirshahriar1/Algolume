# Algolume — Progress Log

Newest entries on top. One entry per work session / chunk.

---

## 2026-06-09 — Home page revamp

- Kept the hero + three editorial feature rows (liked), but made the page feel
  fuller and convert better:
  - **Live stats strip** (real counts from the content/problems/registry data):
    chapters, lessons, problems, visualizers.
  - **"Five ways to learn" pillars** — Read · Watch · Play · Practice · Note — small
    accent-coloured cards explaining the unified experience.
  - **Featured-visualizers grid** (sorting, pathfinding, trees, graphs, DP, greedy)
    using the gallery `VizThumb` illustrations + a tinted header, replacing the bare
    two-link "pick a topic" block; with an "All visualizers" link.
  - **Closing CTA** band ("Stop memorizing. Start *seeing* how it works.") → handbook
    + problems.
  - Small hero trust line: "Free · no signup · runs entirely in your browser."

`npm run build` green.

---

## 2026-06-09 — Auth reactivity fix, Notes nav tab, Submit-an-issue page

- **Fixed the "reload to see avatar" bug**: the auth + sync stores mutated their
  `useSyncExternalStore` snapshot **in place**, so React (which reference-compares
  snapshots) never re-rendered on sign-in. Now `emit()`/`setStatus()` assign a
  **fresh object** each change — the navbar swaps to the avatar instantly, and the
  sync chip updates live, no reload.
- Made the account control robust: the **Sign in** button shows by default
  (doesn't wait on the session, so it can't get stuck) and on all widths.
- **Notes** is now a top-level navbar tab (desktop + mobile).
- **Submit an issue** page at `/issue`: a typed feedback form (bug / idea / content
  / other + subject + details + optional reply email) that emails
  03mahirshahriar@gmail.com. Sends via **Web3Forms** when `VITE_WEB3FORMS_KEY` is
  set, else opens a prefilled **mailto:** as a no-setup fallback. Linked from the
  navbar (mobile), the footer, and the ⌘K palette.
- Dev console now prints whether cloud sync is configured (env sanity check).

`npm run build` green.

---

## 2026-06-09 — Cloud sync: Supabase + Google OAuth (local-first)

- Added optional **Google sign-in via Supabase** that mirrors all local data to the
  cloud. **Local-first**: signed-out is unchanged, and the whole feature no-ops when
  `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` are unset (account control hidden).
- **What syncs**: lesson completion (`progress.ts`), solved problems (`solved.ts`),
  and per-lesson notes (`notesStore.ts`). The stores gained `get*/set*/subscribe*`
  APIs; notes now carry an `updatedAt` (in `algolume-notes-meta`) and LessonNotes
  writes through the store (and refreshes if a note changes underneath it).
- **Sync model** (`sync.ts`): on sign-in, **pull → merge → push** (union of
  completed/solved, **newest-wins** per note), then debounced push on every local
  change. One JSON row per user in `user_state` (RLS), via `lib/supabase.ts`
  (null-safe) and `lib/auth.ts` (`useAuth`, sign-in/out, wires sync on auth change).
- **UX**: navbar account control — "Sign in with Google" → avatar dropdown with the
  email, a live **sync-status chip** (Syncing… / Synced / Local only / error), and
  Sign out; mobile menu sign-in; a "sign in to sync" hint on /notes.
- Setup documented in **`.env.example`** (env vars + Google provider steps + the
  `user_state` table SQL with row-level-security policies). `.env*` already
  gitignored. Added `@supabase/supabase-js` (~58 kB gzip).

`npm run build` green.

---

## 2026-06-09 — Math expansion + Game theory chapter (+ two new visualizers)

- **Sieve of Eratosthenes visualizer** (`lib/sims/sieve.ts` + `SieveCanvas`):
  animates crossing out each prime's multiples from p²; interactive `SieveViz` with
  an n slider; registry card, thumbnail, `sieve` viz module embedded in Math.
- **Math chapter expanded**: embedded the sieve viz + **Count Primes** problem;
  added **extended Euclid & general modular inverse**, Euler totient / CRT /
  factorisation notes, and a **Number-theory resources** section linking
  **cp-algorithms** and **Forthright48 CPPS 101** (per request).
- **Game theory chapter (new, CP track)** — *Winning & losing positions* (impartial
  games, normal play, subtraction-game W/L DP) and *Nim & Sprague–Grundy* (the XOR
  nim-sum rule, Grundy numbers via mex, summing games by XOR), with C++.
- **Game-theory visualizer** (`lib/sims/game.ts` + `GameCanvas`): fills the
  subtraction game bottom-up in two modes — **Win/Lose** and **Grundy** — showing
  each position's reachable dependencies; interactive `GameViz` (mode toggle,
  editable moves, n slider).
- **Problems**: Count Primes (math); Nim Winner (easy), Subtraction Game (medium),
  Grundy Number (hard) — all CPython-verified, Python + C++. New `game-theory`
  topic; problems surface under the Math & Geometry roadmap node.

`npm run build` green.

---

## 2026-06-09 — Graphs & Divide-and-Conquer chapters (the last content topics)

- **Graphs & representations chapter (topic 13)** — *Representing a graph*
  (adjacency list/matrix/edge list trade-offs) and *Traversal, components, cycles
  & topological sort* (BFS/DFS with a visited set, connected components, directed/
  undirected cycle detection, Kahn's topo sort), C++ throughout, embedding the
  pathfinding viz. Problems: Connected Components (easy), Course Schedule (medium),
  Topological Order / lexicographically smallest (hard).
- **Divide & Conquer chapter (topic 18)** — *The D&C method* (template, **Master
  Theorem**, fast power) and *Classic D&C* (merge sort + counting inversions,
  median of two sorted arrays, majority element, closest-pair/Karatsuba/
  quickselect notes). Reuses the recursion/recurrence-tree viz and embeds existing
  problems (binary search, count inversions, median of two sorted). New problems:
  Fast Power xⁿ (easy), Majority Element (medium).
- All new problems CPython-verified, Python + C++. Roadmap: Advanced Graphs node →
  graphs topic; D&C problems surface under the Binary Search node.

`npm run build` green. **The 22-chapter handbook outline is now fully covered** —
only Supabase/Google-OAuth sync remains (deferred to last, per request).

---

## 2026-06-09 — Strings & pattern matching deep-dive (chapter + viz + problems)

- **Strings chapter (topic 20)** — two lessons: *Pattern matching: the naive scan*
  (the substring-search problem, sliding window, O(n·m) worst case) and *KMP & the
  failure function* (prefix function / borders, linear matching, plus Rabin–Karp
  rolling hash), with C++.
- **Pattern-matching visualizer**: `lib/sims/matching.ts` + `MatchCanvas` slide a
  pattern across the text showing each comparison, mismatches, the matched prefix,
  and (in KMP mode) the **failure-function skip**; interactive `MatchViz` has a
  naive/KMP toggle + editable text/pattern; registry card, thumbnail, and a
  `matching` viz module (`variant: naive|kmp`) embedded in the lessons.
- **String problems**: Find First Match / strStr (easy), Count Pattern Occurrences
  (medium, overlapping), Longest Happy Prefix (hard, KMP failure function) —
  CPython-verified, Python + C++, embedded. New `strings` topic; problems surface
  under the Arrays & Hashing roadmap node.

`npm run build` green.

---

## 2026-06-09 — Greedy lab expanded: Kadane + fractional knapsack

- The Greedy visualizer is now a **3-tab lab**: Activity selection, **Kadane's
  max subarray**, and **Fractional knapsack** — one gallery card, alias routes
  (`/visualizers/kadane`, `/knapsack`) preselect the tab.
- **Kadane sim** (`lib/sims/kadane.ts` + `KadaneCanvas`): scans the array showing
  restart-vs-extend, the running sum, the best sum, and the best window
  highlighted; editable array + randomize.
- **Fractional-knapsack sim** (`lib/sims/knapsack.ts` + `KnapsackCanvas`): sorts
  items by value/weight, fills the bag (with a capacity gauge + per-item taken
  fraction); editable items + capacity slider.
- **Greedy chapter**: new **Kadane lesson** (restart/extend greedy-DP hybrid, best
  window, max-product variant) with the Kadane viz; embedded the knapsack viz in
  the classics lesson. New **Maximum Product Subarray** problem (hard,
  CPython-verified, Python + C++). Lesson embeds support `viz("greedy", {variant})`.

`npm run build` green.

---

## 2026-06-09 — Greedy algorithms deep-dive (chapter + viz + problems)

- **Greedy chapter (topic 17)** — two lessons: *The greedy method* (greedy-choice
  property, optimal substructure, activity selection, the **exchange-argument**
  proof, and when greedy fails on 0/1 knapsack) and *Classic greedy algorithms*
  (fractional knapsack, the interval-problem family, Huffman coding), with C++.
- **Activity-selection visualizer**: `lib/sims/greedy.ts` + `GreedyCanvas` render
  intervals on a **timeline**, sort by finish time, and animate selecting each
  non-overlapping activity (with the last-finish marker). Interactive `GreedyViz`
  has an editable `start end` activity list + Randomize, bounded by
  `GREEDY_LIMITS`; registry card, thumbnail, and a `greedy` viz module embedded in
  the chapter.
- **Greedy problems**: Activity Selection (easy), Jump Game (medium), Minimum
  Arrows to Burst Balloons (hard) — CPython-verified, Python + C++, embedded; the
  `/problems` Greedy node is now active.

`npm run build` green.

---

## 2026-06-09 — Reorg: NP-hardness chapter, bitmask-DP→DP, TSP/Held-Karp sim

- **Reading order reorganised**: **Bit manipulation moved up** (now after Arrays),
  and a new **NP-hardness** chapter placed right after Foundations (it's complexity
  theory — extends Big-O).
- **NP-hardness chapter** (conceptual, no visualizer): *P, NP & verification*
  (efficient = polynomial, decision problems, P, NP, P-vs-NP) and *NP-complete,
  NP-hard & coping strategies* (reductions, Cook–Levin/SAT, the famous NP-complete
  list, NP-hard incl. optimisation TSP & halting, and how to cope — exact-
  exponential, approximation, heuristics, special cases, parameterised, ILP/SAT).
- **Bitmask DP moved into the DP chapter**: removed the bitmask-DP lesson from the
  bit chapter (which now focuses on bit basics + tricks) and added a new DP lesson
  *Bitmask DP & the Travelling Salesman* — subsets-as-integers, the assignment
  problem, and **Held-Karp TSP**, with a forward link to NP-hardness.
- **TSP / Held-Karp simulation**: added a `tsp` mode to the DP-table visualizer —
  fills `dp[mask][end]` over subsets (rows = end city, columns = visited subsets),
  highlighting each transition's source cell and the closing tour. Exposed in the
  interactive DP lab with a cities slider (3–4).
- **Problems re-homed**: Assignment Problem (bitmask DP) moved to the DP topic; new
  **Travelling Salesman (Held-Karp)** hard problem added — both CPython-verified,
  Python + C++. The bit chapter keeps Single Number + Counting Bits.

`npm run build` green.

---

## 2026-06-09 — Bit-manipulation visualizer + Math for algorithms chapter

- **Bit-manipulation visualizer**: `lib/sims/bits.ts` animates AND/OR/XOR/NOT,
  left/right shift, and the `x & -x` / `x & (x-1)` tricks **column by column** on
  8-bit binary with place values; `BitsCanvas` (operand rows + result row +
  legend), interactive `BitsViz` (op picker + a/b inputs + shift slider), registry
  card, gallery thumbnail, and a `bits` viz module embedded in the bit lessons.
- **Math for algorithms chapter (topic 22)** — two lessons: *Divisibility, GCD &
  modular arithmetic* (Euclid, lcm, mod add/mul, negative mod) and *Primes, fast
  power & combinatorics* (sieve, binary exponentiation, Fermat modular inverse,
  nCr mod p), with C++ throughout.
- **Math problems**: GCD (easy), Modular Exponentiation (medium), Binomial
  Coefficient mod p (hard) — CPython-verified, Python + C++, embedded; the
  `/problems` Math node is now active.

`npm run build` green.

---

## 2026-06-09 — CP judges, Bit Manipulation chapter, DP practice links

- **CP intro resources** — added an "Online judges to practice on" section
  (Codeforces, AtCoder, CodeChef) with how-to-start notes.
- **DP practice path** placed in the **DP chapter** (per request, not CP): the
  AtCoder Educational DP Contest (EDPC, A–Z) and Codeforces blog #122422, with a
  pointer back from the CP intro.
- **Bit manipulation chapter (topic 21)** — theory-first, two lessons:
  *Binary, operators & bit tricks* (two's complement, the six operators,
  test/set/clear/toggle, `x & -x`, `x & (x-1)`/Kernighan, power-of-two, popcount,
  XOR superpowers) and *Bitmask DP* (subsets as integers, mask/submask iteration,
  the assignment problem `dp[mask]`, `O(3ⁿ)` submask sum). C++ throughout.
- **Bit problems**: Single Number (easy, XOR), Counting Bits (medium, bit DP),
  Assignment Problem (hard, bitmask DP) — CPython-verified (caught a hand-computed
  expected), Python + C++, embedded; `/problems` Bit Manipulation node now active.

`npm run build` green.

---

## 2026-06-09 — Dynamic Programming deep-dive + lesson sidebar auto-scroll

- **Lesson sidebar now slides to the current lesson**: the chapter spine
  auto-centers the active lesson on navigation (scrolls only the sidebar
  container, not the page) via refs + a getBoundingClientRect offset.
- **DP-table visualizer** (new): `lib/sims/dp.ts` with three modes — **coin
  change (1D)**, **unique paths (2D)**, **edit distance (2D)** — each fills the
  table cell by cell and highlights the cells the current transition **reads
  from**. `DpCanvas` renders the grid (with string/index headers + a legend);
  interactive `DpViz` has a mode picker + inputs (coins/amount, rows/cols, two
  strings) with limits; registry card, gallery thumbnail, and a `dp` viz module
  for lesson embeds.
- **Dynamic programming chapter (topic 19)** — two lessons: *DP foundations &
  1D tables* (optimal substructure, overlapping subproblems, memoization vs
  tabulation, climbing stairs, coin change) and *2D tables* (unique paths, edit
  distance, LCS, 0/1 knapsack), with C++ and embedded DP-table sims.
- **DP problems**: Climbing Stairs (easy, 1D), Coin Change (medium, 1D), Longest
  Common Subsequence (hard, 2D) — CPython-verified, Python + C++, embedded; the
  `/problems` roadmap 1-D DP and 2-D DP nodes are now active.

`npm run build` green.

---

## 2026-06-09 — 10-feature batch + strings set + Heaps deep-dive

**10 polish features** (build green):
1. Reusable **CopyButton** on all code surfaces (CodePanel, lesson code blocks,
   problem solution, playground editor header).
2. **Keyboard-shortcuts help overlay** — press `?` (ignored while typing).
3. **Random unsolved problem** button on `/problems`.
4. **Strings problem set** (arrays topic): Valid Palindrome (easy), Longest
   Substring Without Repeating (medium), Group Anagrams (hard) — verified + C++ +
   embedded.
5. **Playground persists** the editor code to localStorage across reloads.
6. **404 / NotFound page** (replaces the silent redirect to Home).
7. **Scroll-to-top** floating button after scrolling.
8. **Per-difficulty solved tallies** on the problems header.
9. **Reset-progress controls** in Notes (clear solved problems / completed
   lessons), with `clearAllSolved`/`clearAllProgress` stores.
10. **Copy-link** share buttons on lesson + problem pages.

**Heaps deep-dive (new chapter 12 — content + visualization + problems):**
- New **Heap / priority queue visualizer**: `lib/sims/heap.ts` (min-heap
  insert/extract-min with sift-up/down frames + a canned demo), `HeapCanvas`
  (complete-tree layout by array index + the synced backing array), interactive
  `HeapViz` (insert / extract-min / sample / clear), registry card + gallery
  thumbnail, and a `heap` viz module for lesson embeds.
- New **Heaps & priority queues** chapter (2 lessons): the heap structure
  (complete tree → array indexing, heap property, O(n) build) and operations
  (sift up/down, heapsort, priority-queue uses in Dijkstra/Prim/k-way merge),
  with C++ code and embedded sims.
- **Heap problems**: Last Stone Weight (easy), K Smallest (medium), Merge K
  Sorted Lists (hard) — verified in CPython, Python + C++, embedded; the
  `/problems` roadmap "Heap" node is now active.

`npm run build` green.

---

## 2026-06-09 — Soothing light theme + code surface + text-base bug

- **Bug:** the landing "Two Sum" heading was invisible in light mode. Root cause:
  the custom color token named `base` makes Tailwind emit `.text-base` as *both* a
  font-size and a text-**color** rule (= the page background). The heading used
  `text-base` (as a size) with no explicit color, so it was painted in the bg
  color. Fixed by giving it an explicit `text-fg` + an arbitrary size; other
  `text-base` uses already pair it with a color, so they were fine.
- **Soothing light theme** (replacing the loud "Comic Brutalist" pass — the user
  wanted easy-on-the-eyes, not just darker): "Soft Slate" — gentle blue-grey
  paper, softly-tinted cards, **soft** slate borders, and a **gentle** shadow
  (α 0.14, not a hard black slab). Layered and low-glare.
- **New `code` surface token:** code/editor areas used `bg-surface` (identical to
  cards) so they read as flat white slabs in light mode. Added a dedicated,
  recessed `--code` surface (light + dark) and routed CodePanel, CodeEditor,
  MarkdownLite code blocks, the problem solution panel, and the landing code mock
  to `bg-code` — so code reads as its own calm panel instead of white-on-white.

`npm run build` green.

---

## 2026-06-09 — Feature batch: problems backfill, ⌘K palette, mobile nav, SP declutter

Five features in one pass (all CPython-verified where relevant, build green):

- **Linked-lists problem set** (array I/O): Reverse a Linked List (easy),
  Remove Nth From End (medium), Add Two Numbers / digit lists (hard) — embedded in
  the Linked list basics lesson.
- **Pathfinding problem set** (integer grids): Number of Islands (easy), Shortest
  Path in a Grid (medium), Rotting Oranges / multi-source BFS (hard) — embedded in
  the Searching a grid lesson. (Now **every content topic with a chapter has a
  laddered set**: arrays, searching, sorting, recursion, hashing, stacks, trees,
  traversals, linked-lists, pathfinding, MST.)
- Both sets registered in `index.ts`, C++ snippets in `cpp.ts`, `linked-lists`
  added to `TOPIC_LABEL`. All 6 Python solutions verified against every case.
- **⌘K command palette** (`CommandPalette.tsx`): fuzzy quick-switcher over every
  page, lesson, visualizer, and problem; arrow/enter/esc keys; opened via Ctrl/⌘K
  or the navbar button. Wired through the always-mounted Navbar.
- **Mobile nav menu**: hamburger dropdown under `md` (the nav links were hidden
  with no menu before); social/icon links tucked in there too.
- **Shortest-path canvas declutter**: weight labels got small surface pills +
  dimming (matching the MST fix), and the default generated graph is sparser
  (~n/2 shortcut edges) so labels stop colliding on the small circle.

`npm run build` green.

---

## 2026-06-09 — Light theme → "Comic Brutalist"

- The light palette read very "Claude/Anthropic" (warm cream paper + coral). Per
  request, swapped it for a quirky **Comic Brutalist** light theme: pale-sky
  background, white cards, bold dark-slate outlines, a hard **black** offset
  shadow on cards (cartoon lift), and punchy primary accents (green / bold blue /
  orange / red / purple).
- Scoped entirely to the light CSS variables in `index.css` (`:root`); **dark mode
  is untouched** and the change is trivially reversible. The existing `.card`
  hard-offset-shadow machinery just reads the new `--card-shadow`, so cards pop
  without any component changes.
- **Softened pass** (first version was too bright/glary): muted slate-blue paper
  instead of pale-sky white, off-white cards instead of pure white, gentler ink
  text, slightly muted primaries, and a dark-slate offset shadow at α 0.4 instead
  of solid black at 0.9 — keeps the quirky comic feel but is easy on the eyes.

`npm run build` green.

---

## 2026-06-09 — Trees + traversals problem sets (backfill)

- Backfilled two more empty topics with laddered easy/medium/hard sets (6 problems,
  Python + C++ + verified in CPython):
  - **Trees** (BST built from an insertion list): BST Search Path (easy),
    Kth Smallest in a BST (medium), Lowest Common Ancestor in a BST (hard) —
    embedded in the BST operations lesson.
  - **Traversals** (binary tree as a level-order array, with a provided
    `build_tree` helper): Inorder (easy), Level-Order (medium), Zigzag (hard) —
    embedded in the Tree traversals lesson.
- Registered both sets in `index.ts`, added C++ snippets in `cpp.ts`. All entry
  functions take/return JSON-friendly values so the grader stays simple.

`npm run build` green.

---

## 2026-06-09 — Declutter MST + DSU canvases (label overlap)

- The real complaint was *visual* overlap, not redundant cards: the MST graph
  crammed ~18 edges on a small circle so weight pills piled up, and per-node
  `C1/C5/…` component labels collided with them; the DSU forest printed `p=` and
  `size` labels that overlapped the root ring and the next level.
- **MST graph (`mst.ts` + `MstCanvas`):** default graph is now **sparse** — a ring
  plus ~n/2 skip-one chords instead of a near-complete hairball. Weight labels got
  smaller pills, are **nudged off the line** (alternating sides) so crossings don't
  stack, and inactive ones are dimmed. Dropped the colliding per-node text label —
  components are now shown by **tinting the node** (token palette), so merges read
  at a glance with zero extra text.
- **DSU forest (`DsuCanvas`):** removed the per-node `p=` labels (the parent/size
  table already shows them) and the duplicate child-count; the root now has a
  single `root · size N` label placed **above** the ring; more vertical spacing
  between levels so chains breathe.
- (Earlier this session I'd consolidated DSU/MST/shortest-paths into one Graph
  algorithms lab — kept, since it also reduces gallery clutter.)

`npm run build` green.

---

## 2026-06-09 — Sorting problem set (backfill)

- Backfilled the **sorting** topic, which had no problems: added a laddered set —
  **Merge Two Sorted Arrays** (easy), **Kth Largest Element** (medium), and
  **Count Inversions** (hard, merge-sort counting). Each has examples, hidden
  edge-case tests, hints, Python + C++ reference solutions, and complexity.
- Registered the set in `lib/problems/index.ts`, added C++ snippets in `cpp.ts`,
  and embedded the cards in the Merge sort (`merge-two-sorted`, `count-inversions`)
  and Quick sort (`kth-largest`) lessons.
- All three Python solutions verified against every case in CPython.

`npm run build` green.

---

## 2026-06-09 — Unified graph visualizers (less overlap)

- The DSU, shortest-path, and MST visualizers were three look-alike weighted-graph
  cards with overlapping ideas. Consolidated them into **one "Graph algorithms"
  lab** (`/visualizers/graphs`) with a segmented control: **Shortest paths**
  (Bellman-Ford / Floyd-Warshall) · **Spanning tree** (Kruskal / Prim) ·
  **Union-Find** (the engine inside Kruskal). Each tab keeps its own distinct
  canvas, lesson link, and complexity; a one-line tagline frames how it differs.
- New `GraphAlgosViz` wrapper reuses the existing `ShortestPathViz`, `MstViz`,
  and `DsuViz` components — no behavior lost, just one coherent home.
- Registry: three cards → one; old routes (`/visualizers/dsu`, `/mst`,
  `/shortest-paths`, `/bellman-ford`, `/floyd-warshall`, `/kruskal`, `/prim`,
  `/union-find`) still resolve and **preselect the matching tab** via the route id
  (Component now receives the id). Added a `graphs` gallery thumbnail.
- Learn: fixed the lesson right-rail "Practice visually" links — added `mst`/`dsu`
  module links and a `minimum-spanning-trees` chapter link, all pointing at the
  unified lab and labelled "Graph lab · shortest paths / spanning tree /
  union-find" so they read as one area. (The MST chapter already disambiguates
  Prim vs Dijkstra and undirected-vs-directed in prose.)

`npm run build` green.

---

## 2026-06-09 — In-lesson runnable playground block

- Added a typed `playground(...)` lesson block, renderer support, and search
  indexing so runnable snippets can live directly inside lesson content.
- Built `PlaygroundBlock` with the existing editor, Pyodide execution, Run/Reset
  controls, and an inline output console.
- Embedded the first runnable snippet in **Arrays & two pointers** for reversing
  an array with two pointers.
- Updated `plan.md` so this Phase 5 item is marked done; the later bridge from
  snippet output into visualizers remains a separate enhancement.

`npm run build` green. Route smoke checks green for
`/learn/arrays/array-basics` and `/search?q=reverse_in_place`.

---

## 2026-06-09 — Softer light-mode problem roadmap

- Tuned the `/problems` roadmap light mode so nodes use soft token-based fills,
  quieter borders, readable dark labels, lower-contrast connector lines, and a
  lighter dotted canvas.
- Kept the stronger saturated roadmap treatment for dark mode.

`npm run build` green. Route smoke check green for `/problems`.

---

## 2026-06-09 — Removed visible C++ runner UI

- Removed the C++ editor/runner mode from `/playground` and `/problems/:id`
  because a disabled C++ runner made the UI feel awkward without a real compiler
  behind it.
- Kept revealable C++ reference solutions in problem editorials, where they are
  useful without pretending the browser can grade C++ yet.
- Updated `plan.md` and `CLAUDE.md` so future work keeps C++ as reference
  material until an actual compiler/judge integration exists.

`npm run build` green. Route smoke checks green for `/playground` and
`/problems/two-sum`.

---

## 2026-06-09 — Shareable problem filters

- Moved `/problems` roadmap filters into URL params so selected node,
  difficulty, solved/unsolved status, and search text are shareable/bookmarkable.
- Added a solved/unsolved status facet, a visible result count, and a clear
  filters action in the focused problem queue.
- Marked the shareable filter work done in `plan.md`; attempted/recently
  attempted state remains a later enhancement.

`npm run build` green. Route smoke checks green for `/problems` and a filtered
problem-roadmap URL.

---

## 2026-06-09 — C++ problem snippets and editor mode

- Added first-class C++ reference-solution metadata to the problem model and a
  central `src/lib/problems/cpp.ts` snippet map covering all 27 current problems.
- Updated `/problems/:id` with Python/C++ language tabs: Python remains runnable
  and submittable in-browser, while C++ is available as editor/reference mode
  with a clear compiler-runner caveat.
- Updated `/playground` with Python/C++ example tabs. Python runs through
  Pyodide; C++ examples are editable with local `g++` instructions until a WASM
  compiler or backend judge is added.
- Updated `plan.md` and `CLAUDE.md` so future problems include C++ snippets and
  future work tracks real executable C++ grading separately.

`npm run build` green. Verified all 27 problems have C++ snippets. Route smoke
checks green for `/playground`, `/problems/two-sum`, and `/problems`.

---

## 2026-06-09 — Problem roadmap light mode + NeetCode note

- Made the `/problems` topic roadmap support light mode using the app's theme
  tokens while preserving the NeetCode-style dark canvas under dark mode.
- Added a visible note: design inspired from NeetCode, with a link to
  `https://neetcode.io/` for solving more problems.

`npm run build` green. Route smoke check green for `/problems`.

---

## 2026-06-09 — DSU visualizer forest layout

- Reworked the DSU / Union-Find canvas from a flat one-line parent view into a
  proper parent-pointer forest: roots sit at the top, children branch below, and
  parent arrows show the actual structure.
- Kept active find paths, compressed edges, root labels, and the parent/size
  table so path compression is visible in both the diagram and raw arrays.

`npm run build` green. Route smoke checks green for `/visualizers/dsu` and
`/learn/minimum-spanning-trees/kruskal-dsu`.

---

## 2026-06-09 — CP resource section + problem roadmap layout

- Split the CP intro resources into a distinct **Blogs and resources** lesson
  section, updated the NSUPS wording to **North South University's problem
  solver's community**, and kept the USACO Guide CP resources link in that shelf.
- Replaced the `/problems` simple list with a zoomable/pannable **topic roadmap**
  inspired by the requested layout: connected topic nodes, per-node solved
  progress bars, planned-topic nodes, and a focused problem queue.
- Updated `plan.md` so the problem browser direction is the roadmap interface,
  not the older card-grid proposal.

`npm run build` green. Route smoke checks green for `/problems` and
`/learn/competitive-programming/first-problem-walkthroughs`.

---

## 2026-06-09 — CP intro moved to the top of Learn

- Moved **Competitive programming intro** to the first module in `/learn` so
  students see judge workflow, C++ basics, statement reading, and resources
  before the algorithm/problem-heavy modules.
- Updated `plan.md` to make the ordering intentional.

`npm run build` green. Route smoke checks green for `/learn` and
`/learn/competitive-programming/what-cp-is`.

---

## 2026-06-09 — DSU visualizer + USACO Guide resource

- Added a first-class **DSU / Union-Find** visualizer at `/visualizers/dsu`.
  - Shows parent-pointer forest, roots, active find path, path-compressed nodes,
    root sizes, and synced code.
  - Controls: node count, `find(a)`, `unite(a,b)`, singleton reset, and sample
    chain reset for demonstrating path compression.
- Added an embedded `viz("dsu")` simulation to the **Kruskal and DSU** lesson so
  DSU is visible separately from MST edge selection.
- Added [USACO Guide CP resources](https://usaco.guide/general/resources-cp) to
  the CP intro resources list and roadmap notes.

`npm run build` green. Route smoke checks green for `/visualizers/dsu`,
`/learn/minimum-spanning-trees/kruskal-dsu`, and
`/learn/competitive-programming/first-problem-walkthroughs`.

---

## 2026-06-09 — Logo refresh

- Replaced the old ascending-bar mark, which could read like an acronym, with a
  distinct **illuminated algorithm path** logo: glowing connected nodes and a
  small spark inside the same dark rounded tile.
- Updated both the React navbar logo (`Logo.tsx`) and `public/favicon.svg` so the
  site mark and browser tab match.

`npm run build` green.

---

## 2026-06-09 — Vercel SPA refresh fix

- Added `vercel.json` with a catch-all rewrite so deployed React Router routes
  like `/playground`, `/learn/...`, `/problems/...`, and `/visualizers/...`
  serve `index.html` on hard refresh instead of returning Vercel `404: NOT_FOUND`.

`npm run build` green.

---

## 2026-06-09 — CP intro fast I/O, first problems, resources, and numeric roadmap

- Expanded **C to C++ bridge** with a clearer explanation of:
  - `ios::sync_with_stdio(false)` — faster C++ streams by disconnecting them from
    C stdio synchronization, with the warning not to casually mix `scanf/printf`
    and `cin/cout`.
  - `cin.tie(nullptr)` — avoids automatic `cout` flush before every input read;
    notes when manual flushing matters for interactive problems.
  - `\n` vs `endl`, and why output-heavy CP code usually avoids forced flushes.
- Added guidance to prefer dynamic library types:
  `std::vector` / Java `ArrayList`, and `std::string` / Java `StringBuilder`,
  with external resource links.
- Added a new **First problem walkthroughs** lesson covering Codeforces 4A
  Watermelon, UVa 10055 Hashmat the Brave Warrior, and UVa 100 The 3n + 1
  Problem, each with idea, edge case, and C++ solution sketch.
- Added CP resource links in the lesson: NSUPS blogs, cp-algorithms,
  Forthright48 CPPS 101, and GeeksforGeeks references.
- Updated `plan.md` with future sections for **precision and machine arithmetic**,
  **competitive programming number theory**, and **competitive programming game
  theory**.

`npm run build` green. Route smoke checks green for
`/learn/competitive-programming/c-to-cpp-bridge`,
`/learn/competitive-programming/first-problem-walkthroughs`, and
`/learn/competitive-programming/submit-and-debug`.

---

## 2026-06-09 — Minimum spanning trees chapter, visualizer, and problems

- Added a full **Minimum spanning trees** handbook module:
  - **Spanning trees and MSTs** — graph prerequisites, spanning tree definition,
    `V - 1` edge fact, cycles, cut property, cycle property, and complexity.
  - **Kruskal and DSU** — sorted-edge acceptance/rejection, Union-Find with path
    compression + size/rank, proof sketch, C++ code, and complexity.
  - **Prim's algorithm** — cut growth, priority-queue implementation, proof
    sketch, Kruskal-vs-Prim comparison, and complexity.
- Added an **MST visualizer** at `/visualizers/mst` plus `viz("mst")` lesson
  embeds:
  - Kruskal mode shows sorted edges, accepted edges, rejected cycle edges,
    component labels, total weight, and synced pseudocode.
  - Prim mode shows visited vertices, frontier/cut edges, chosen edge, total
    weight, editable weighted graph, start node, and deterministic randomize.
- Added a laddered MST practice set: **Valid Spanning Tree**, **Minimum
  Connection Cost**, and **Second Best MST**; registered topic labels and embedded
  the cards in the new lessons.
- Verified all MST reference solutions against **19 visible/hidden CPython
  cases**; verification caught and fixed one wrong expected value.
- Marked the MST item complete in `plan.md`.

`npm run build` green. Route smoke checks green for
`/learn/competitive-programming/what-cp-is`,
`/learn/competitive-programming/c-to-cpp-bridge`,
`/learn/minimum-spanning-trees/mst-definition`,
`/learn/minimum-spanning-trees/kruskal-dsu`,
`/learn/minimum-spanning-trees/prim`, `/visualizers/mst`, and `/problems`.

---

## 2026-06-09 — Competitive programming onboarding module

- Added a new **Competitive programming intro** handbook module with four
  lessons:
  - **What competitive programming is** — online judges, Accepted, verdicts,
    the judge loop, and why constraints drive algorithm choice.
  - **C to C++ bridge** — fast `iostream`, `vector`, `string`, `pair`, references,
    range-for, lambdas, STL containers, and beginner pitfalls.
  - **Reading statements and constraints** — a five-pass workflow, edge-case
    checklist, and Big-O selection from input limits.
  - **Submitting, verdicts, and templates** — local compile/run loop, AC/WA/TLE/
    MLE/RE/CE, stress testing, and a clean C++17 starter template.
- Wired the module into `/learn`, search/progress/notes via the content registry,
  and added a visible onboarding link at the top of `/problems`.
- Marked the CP intro item complete in `plan.md`.

`npm run build` green.

---

## 2026-06-09 — Practice system, customizable viz depth, CLAUDE.md

- Added **CLAUDE.md**: project rules, architecture, current Phase-6 structure,
  and a comprehensive spec for the playground & problems systems.
- **Tree traversal visualizer** — depth customization: pick the tree *shape*
  (balanced / random / left-skew / right-skew / custom insertion sequence) and a
  node-count slider (≤ 31); shows live node count + height. New helpers in
  `lib/sims/tree.ts`: `shapeValues`, `balancedOrder`, `treeHeight`, and
  `treeTraversal(order, values?)`.
- **Shortest-path visualizer** — custom simulation with limits: node-count
  slider, editable `from to weight` edge list, source selector (BF),
  allow-negative toggle, deterministic Randomize, bounded by `SP_LIMITS` (3–7
  nodes, weights −9..20, ≤16 edges). Builders now take `(nodes, edges, source?)`;
  canvas highlights the chosen source and lays out any node count on a circle.
- **Problems / Practice** (new pillar) at `/problems` and `/problems/:id`:
  - Data model + registry (`lib/problems/`), 14 problems across arrays,
    searching, recursion, hashing, stacks/strings — each with statement,
    examples, hidden tests, progressive hints, reference solution, complexity.
  - In-browser grader (`runner.ts`): builds a Pyodide harness, passes cases as
    base64 JSON, captures per-call stdout, compares with exact/unordered/set/
    approx modes, parses a sentinel result line. Verified end-to-end in CPython.
  - Browser page (filter by topic/difficulty/search), solve page (editor +
    Run examples / Submit + per-case results + hints + revealable solution),
    reactive solved-state store (`solved.ts`).
  - New lesson block `problem("id")` (builder + BlockRenderer + searchIndex);
    embedded into the Arrays and Hashing lessons. "Problems" added to the navbar.
- **Laddered the problem set** — every current topic now has easy + medium + hard
  (24 problems total): arrays (+ product-except-self, trapping-rain-water),
  searching (+ search-rotated, median-of-two-sorted), recursion (+ generate-
  parentheses, permutations), hashing (+ top-k-frequent, longest-consecutive),
  stacks (+ daily-temperatures, largest-rectangle-histogram). Every solution
  verified against all its cases in CPython (caught a wrong expected value).
- **CLAUDE.md** rewritten concise, with the going-forward **per-topic deep-dive
  workflow**: user picks one topic → detailed analysis + custom visualization +
  laddered easy/medium/hard problems.

`npm run build` green.

---

## 2026-06-09 — Combined tree lab + shortest-path simulations

- Combined the BST and red-black-tree visualizer experience into one
  **Trees & BSTs** visualizer card at `/visualizers/trees`.
  - The page has modes for regular BST insert/search/in-order traversal and
    red-black insertion recolor/rotation playback.
  - Old direct routes `/visualizers/bst` and `/visualizers/red-black-tree`
    still resolve to the combined Trees page.
- Added a new **Shortest paths** visualizer at `/visualizers/shortest-paths`.
  - Bellman-Ford shows directed weighted edges, repeated relaxation passes,
    active edge checks, distance-table updates, and negative-cycle check.
  - Floyd-Warshall shows the all-pairs distance matrix, current intermediate
    vertex `k`, active `(i, j)` cell, and updates through `dist[i][k]+dist[k][j]`.
  - Alias routes `/visualizers/bellman-ford` and `/visualizers/floyd-warshall`
    resolve to the same visualizer.
- Embedded simulations into the notes:
  - BFS and DFS mini pathfinding simulations in **Searching a grid**.
  - Bellman-Ford relaxation simulation in the Bellman-Ford lesson.
  - Floyd-Warshall matrix-DP simulation in the Floyd-Warshall lesson.
- Expanded shortest-path notes with unweighted BFS/DFS intuition and an
  algorithm-selection section covering BFS, Dijkstra, A*, Bellman-Ford, and
  Floyd-Warshall.

`npm run build` green. Smoke checks green for `/visualizers`, `/visualizers/trees`,
`/visualizers/bst`, `/visualizers/red-black-tree`, `/visualizers/shortest-paths`,
`/visualizers/bellman-ford`, `/visualizers/floyd-warshall`,
`/learn/pathfinding/search-a-grid`, `/learn/pathfinding/shortest-paths`,
`/learn/pathfinding/bellman-ford`, and `/learn/pathfinding/floyd-warshall`.

Note: in-app Browser verification is still blocked because the installed
Browser plugin cache is missing `scripts/browser-client.mjs`; route checks were
done through the local dev server instead.

---

## 2026-06-09 — CP backlog + deeper traversal notes

- Added future **Intro to competitive programming handbook** notes to
  `plan.md`: what CP is, C to C++ transition, reading constraints, testing,
  submitting, verdicts, fast I/O, templates, and problem-solving habits.
- Added future **Minimum spanning tree** notes to `plan.md`: MST definition,
  graph prerequisites, cut/cycle properties, Kruskal, Prim, DSU, proofs,
  complexity, and visualizer requirements.
- Added a broader content backlog for graph extensions, CP practice sets, and
  editorial-style lesson/problem work.
- Expanded **Tree traversals** into more self-explanatory notes:
  - sample tree with concrete traversal sequences
  - recursive mental model for pre/in/post-order
  - proof intuition for why in-order sorts a BST
  - C++ traversal templates with visit-placement comments
  - choosing the right traversal by problem type
  - deeper DFS vs BFS mechanics, subtree examples, graph visited-set note, and
    memory intuition.

`npm run build` green. Smoke checks green for
`/learn/traversals/tree-traversals`, `/learn/traversals/dfs-vs-bfs`, and
`/learn`.

---

## 2026-06-09 — Sectioned university notes + shortest paths expansion

- Updated the lesson authoring standard in `plan.md`: future content should be
  split into clear sections for concept, math/invariant intuition,
  visualization, time/space complexity, and examples/code.
- Expanded the lesson right-rail outline behavior so visuals and derivations
  can appear in **On this page**, not only prose headings.
- Strengthened **Pathfinding & Graphs**:
  - BFS/DFS grid notes now include graph model definitions, BFS layer proof,
    C++ BFS/DFS sketches, examples, and time/space complexity.
  - Weighted shortest paths now include Dijkstra code, A* heuristic examples,
    and complexity notes.
  - Added full **Bellman-Ford** and **Floyd-Warshall** lessons with recurrence/
    proof intuition, C++ sketches, negative-cycle notes, and complexity.
- Strengthened **Trees & BSTs** with a sectioned BST search lesson: invariant,
  worked example, C++ search code, and balanced-vs-skewed time/space costs.
- Strengthened **Tree traversals** with sectioned DFS/BFS notes, C++ templates,
  BFS layer proof, examples, and detailed space complexity.

`npm run build` green. Smoke checks green for `/learn/pathfinding/search-a-grid`,
`/learn/pathfinding/shortest-paths`, `/learn/pathfinding/bellman-ford`,
`/learn/pathfinding/floyd-warshall`, `/learn/trees/bst-operations`, and
`/learn/traversals/dfs-vs-bfs`.

---

## 2026-06-09 — Hashing intuition + Red-black trees

- Expanded **Hashing** with stronger student intuition: hash tables as lockers,
  hash-code → bucket-index flow, collision explanation, load factor, resizing,
  good hash-function properties, and C++ snippets for separate chaining and
  `unordered_set` two-sum.
- Added a full **Red-black trees** lesson with invariants, insertion cases,
  C++ node sketch, height-bound proof and complexity notes.
- Added a red-black tree simulation:
  - colored red/black nodes in `TreeCanvas`
  - insertion frames for red parent violations, recoloring and rotations
  - embedded lesson visual via `viz("red-black-tree")`
  - dedicated `/visualizers/red-black-tree` page with editable insert sequence

`npm run build` green.

---

## 2026-06-09 — Linked lists now teach C++ pointers first

- Added a new first linked-list lesson: **Pointers first (C++)**. It covers
  addresses, `int*`, `&`, dereferencing, `->`, `nullptr`, heap allocation,
  `new`/`delete`, dangling pointers, leaks, and pointer-drawing habits.
- Reworked the main Linked lists lesson to show the actual C++ node model:
  `struct Node`, traversal, `pushFront(Node*& head, ...)`, and deletion with
  safe unlinking and `delete`.
- Added pointer-order warnings so students understand why assignment order
  matters before they try to mutate links.

`npm run build` green.

---

## 2026-06-09 — Recursion sims upgraded + reused in lessons

- Replaced the old hard-coded recursion visualizer frames with a reusable
  recursion simulation engine (`lib/sims/recursion.ts`) and a shared
  `RecursionCanvas`.
- Full `/visualizers/recursion` is now customizable:
  - **Call stack**: choose `n` for factorial and watch calls push/unwind.
  - **Divide & conquer**: tune input size, branching factor, base size and
    constant-vs-linear combine work.
  - **Backtracking**: tune depth, choices per level and pruning strength.
- Lesson embeds now use the same upgraded simulations via `viz("recursion")`
  for recursion basics, divide-and-conquer and backtracking, instead of generic
  stack/static tree diagrams.

`npm run build` green. Smoke checks green for `/visualizers/recursion`,
`/learn/recursion/recursion-basics`, `/learn/recursion/divide-and-conquer`,
and `/learn/recursion/backtracking`.

---

## 2026-06-09 — Recursion visualizer fix + university-level theory pass

- Fixed the **Recursion & backtracking** visualizer modes so Divide & conquer
  and Backtracking are no longer static: recursion-tree levels reveal/highlight
  with playback, and the backtracking decision tree progressively shows tried,
  pruned and solution branches.
- Added a full **Divide & conquer** lesson covering the template, merge-sort
  recurrence, recursion-tree reasoning, and Master Theorem intuition.
- Strengthened **Pathfinding** notes with graph model definitions, BFS shortest
  path proof, DFS caveats, Dijkstra's invariant/proof, A* admissible heuristic
  proof, and complexity bounds.
- Added more theory to Searching/Sorting: binary search loop invariant and the
  comparison-sort `Ω(n log n)` decision-tree lower bound.

`npm run build` green. Smoke checks green for `/visualizers/recursion`,
`/learn/recursion/divide-and-conquer`, `/learn/pathfinding/search-a-grid`,
`/learn/pathfinding/shortest-paths`, and `/learn/sorting/meet-sorting`.

---

## 2026-06-09 — Recursion/backtracking visualizer + lesson rail links

- Added a dedicated **BacktrackingTree** lesson visual and replaced the generic
  recursion-tree embed in the Backtracking lesson with a prune/solution decision tree.
- Added a full **Recursion & backtracking** visualizer page with modes for call
  stack, divide-and-conquer recursion trees, and backtracking/pruning, plus
  synced code and stats.
- Reordered the Visualizers hub to follow the handbook sequence and added
  numbered order badges to each visualizer card.
- Lesson right rails now always show **On this page** (with Overview even when a
  lesson has no headings) and a **Practice visually** section linking to the
  relevant visualizer page(s).
- Added proof-style derivations to thinner chapters: array indexing, sliding
  window reuse, linked-list access, stack/queue invariants, balanced BST height,
  and traversal `O(n)`.

`npm run build` green.

---

## 2026-06-09 — Responsive sequence sims + recursion/content examples

- `SeqCanvas` now wraps into centered multi-row layouts with smaller responsive
  boxes, so Searching and in-lesson Ternary search stay contained instead of
  sliding/overflowing.
- Added the missing **Linear search** embedded simulation to the Linear search
  lesson and added `linear-search` as a first-class sequence viz module.
- Added a real illustrated thumbnail for the **Searching** card on the
  Visualizers hub.
- Expanded **Time complexity in practice** with concrete worked examples for
  separate loops, nested loops, shrinking loops, and doubling loops.
- Strengthened **Recursion** notes with a recursive checklist, factorial trace,
  sum-array example, chain-vs-tree complexity note, permutation example, and
  pruning example, alongside stack and recursion-tree visuals.

`npm run build` green.

---

## 2026-06-09 — Searching visualizer + deeper complexity foundations

- Added a dedicated **Searching** visualizer card/page with Linear, Binary and
  Ternary modes, custom array input, editable target, random sample generation,
  sorted-copy handling for logarithmic searches, synced code, and live stats.
- Search nav is now an icon button, and `/search` uses a debounced query before
  filtering/updating the URL.
- Expanded Foundations with a deeper **Space complexity** lesson: input vs
  auxiliary space, common patterns, recursion stack derivations, and
  space-saving tricks.
- Added **Time complexity in practice**: best/average/worst cases, amortized
  time, and how Big-O differs from measured runtime.

`npm run build` green.

---

## 2026-06-09 — Ternary search + stronger complexity foundations

- Added **Ternary search** as a new Searching lesson with prose, code, an
  embedded `lo / m1 / m2 / hi` visualizer, and a derivation for `log₃ n`.
- Added a mathematical **bases in search** explanation: fixed log bases differ
  by constant factors, so `log₂ n`, `log₃ n`, etc. all simplify to `O(log n)`,
  plus the practical warning that binary search usually wins for array lookup.
- Expanded Foundations with time-complexity counting tricks, dominant-term
  simplification, and concrete maths examples for loops, nested loops,
  doubling/halving loops, and divide-and-conquer recurrence shape.
- Added Ternary search to the Array techniques visualizer mode list and the
  reusable sequence sim registry.

`npm run build` green.

---

## 2026-06-09 — Full-text search across lessons + notes

- Added `/search` with a handbook-wide search box that scans lesson titles,
  summaries, prose/callouts/derivations/viz metadata, and local saved notes.
- Search results are grouped as lesson/note cards and link straight back to the
  source lesson; note hits use the existing localStorage-backed notes store.
- Added Search to the desktop nav and split the Phase 7 roadmap item so
  full-text search is checked while the command palette remains next.

`npm run build` green.

---

## 2026-06-08 — Better notes + better visualizers

**Notes**
- Lesson notes gained a **markdown toolbar** — Bold, Italic, inline code, code
  block, list, heading — that wraps/prefixes the current selection, plus a live
  character count (kept the preview toggle + autosave).
- The global `/notes` page gained a **search box** (filters by note text or
  lesson title) and a note count; export still dumps everything.

**Visualizers**
- **Sorting**: type your **own array** ("9, 1, 5, 3, 8" → Use) in addition to
  size presets + shuffle; parsed, clamped to 1–100, up to 60 values.
- **Live stat readouts** on every structure page (via `VizShell3` `stats`):
  Stack/Queue/List **Size**, BST **Nodes + Height**, Hash **Items + Load α**,
  Array **Length**, Traversal **Visited + Nodes** — all derived from the current
  frame so they update as the animation plays.

`npm run build` green; browser-verified (bold-wrap, custom array → 7 bars, BST
Nodes/Height chips), no console errors.

## 2026-06-08 — Roadmap kept as branching design + more visualizer sims

- **Learn roadmap**: kept the **branching design** (alternating module cards with
  their lessons branching off a trunk) — the preferred layout. (A central-spine
  timeline variant was tried and reverted.)
- **Visualizers hub cards** still use the richer **accent-tinted illustrated
  headers** with per-type SVG thumbnails (`VizThumb`).
- **More simulations per visualizer** (the structure pages aren't one-trick now):
  - **Array** → a 3-mode picker: two-pointer reverse, **binary search**
    (lo·mid·hi, eliminated halves dimmed), **sliding window** — each with its
    own synced code.
  - **BST** → added **In-order** traversal (animates the visit order, prints the
    sorted sequence) alongside insert/search/sample/clear.
  - **Linked list** → added **Reverse** (flips the list, animating the reorder).
  - **Hash** → added **Lookup** (hash to bucket, scan the chain, match/​not-found,
    code lines 5–9 synced).

`npm run build` green; browser-verified (roadmap + array binary mode + hash
lookup + bst in-order), no console errors.

---

## 2026-06-08 — Roadmap card width + content enrichment (16 → 26 lessons)

- **Card width fix**: roadmap lesson cards were stretching the full column; now
  capped at `max-w-md` and aligned to the trunk side (`ml-auto` on flipped
  rows), so titles read at a sensible width.
- **Two new array sims**: `binary-search` (sorted array shrinking via lo·mid·hi,
  eliminated halves dimmed with a new `dim` SeqRole) and `sliding-window` (max
  sum of k consecutive, window slides as one O(n) pass). Both synced to their
  code; registered as viz modules.
- **Every module is now multi-lesson** (10 new lessons): Foundations +Space
  complexity · Arrays +Sliding window · Searching binary-search now embeds the
  new sim · Sorting +Insertion & selection · Recursion +Backtracking · Linked
  lists +Stacks/queues-from-a-list · Stacks & queues +Applications · Hashing
  +Sets & two-sum (with derivation) · Trees +BST search/balance · Traversals
  +DFS vs BFS · Pathfinding +Weighted (Dijkstra/A*). **26 lessons, ~171 min.**
- plan.md Phase 6 updated: goal is *each module = several lessons*, plus a
  visualizer backlog. Browser-verified (12 routes, 0 errors); build green.

---

## 2026-06-08 — Roadmap: alternating (zigzag) module sides

Modules now alternate sides down the page — even modules keep the card on the
left (lessons branch right); odd modules mirror to the right (lessons branch
left, with the card content mirrored: icon on the right, arrow pointing left,
right-aligned text, trunk/nodes on the right). Browser-verified.

## 2026-06-08 — Learn page → roadmap layout

Replaced the flat chapter list with a **roadmap**: each chapter is a "Module N"
node card on the left (pill, blurb, lesson/min stats, progress bar, and a
Start/Continue/Review CTA to the next unfinished lesson), with its lessons
**branching off a connected trunk** on the right. Each branch has a node dot
(green check when complete) + a lesson card showing a type icon
(Interactive / Derivation / Reading), title, and minutes. Module centres
vertically against its lessons, connector stub bridges to the trunk. Connectors
are `lg`-only; mobile stacks cleanly. Browser-verified, no errors.

`npm run build` green.

---

## 2026-06-08 — Visualizer pages → 3-pane layout + tree scale-to-fit + id bugfix

Matched the structure visualizer pages to the Sorting/Pathfinding shape.

- **3-pane layout** via new `VizShell3`: **left** = customization (operation
  controls + complexity + "read the lesson"), **middle** = visualization +
  caption + transport, **right** = synced code. Replaced the old single-column
  Stage. Refactored stack/queue/list/BST/hash, and added `ArrayViz` (with a
  "New array" shuffle) + `TraversalViz` (order picker) as full 3-pane pages.
  Detail page widened to `max-w-7xl`; registry entries expose a `Component`.
- **Trees scale to fit** the container like the pathfinding graph: `TreeCanvas`
  now uses `viewBox` + `preserveAspectRatio="meet"` filling its box, so a large
  tree shrinks to fit instead of overflowing/scrolling.
- **Bug fixed**: `useRef(bstSeed())` re-ran `bstSeed()` every render, resetting
  the global node-id counter → inserted nodes collided on id and vanished.
  Switched all interactive sims to lazy one-time seeding. Browser-verified:
  inserting 12 values now yields 18 distinct nodes, all fitting the container.

`npm run build` green; browser smoke clean (no page errors).

---

## 2026-06-08 — Side-by-side code panels on every sim + code in notes

Brought the structure visualizers up to the sorting/pathfinding bar, and let
notes hold code.

- **Synced code panels everywhere**: every sim frame now carries `lines`, and
  each structure has one combined pseudocode block (`SEQ_CODE`, `BST_CODE` +
  per-order traversal code, `HASH_CODE`). `EmbeddedSim` and the interactive
  `Stage` render a `CodePanel` **beside the canvas**, highlighting the active
  line as the operation runs — exactly the sorting/pathfinding feel. Verified in
  a browser: inserting into the BST lights up the matching code line.
- **Code in notes**: `MarkdownLite` rewritten as a robust line-scanner that
  recognises ``` fences even without blank lines. `/notes` renders notes as
  markdown; the lesson notes panel gained an **Insert-code** button and a
  **Preview** toggle, so `inline code` and fenced blocks render. Verified the
  preview produces a real code block.

`npm run build` green; browser smoke clean (no page errors). Temp Playwright
harness removed after verifying.

---

## 2026-06-08 — Sim quality pass + browser verification

Raised the structure sims from "C" toward the sorting/pathfinding bar, and
**verified in a real browser** (Playwright driving Edge).

- **Lively, not static**: `usePlayer` gained a `loop` flag; `EmbeddedSim` gained
  `autoPlay`+`loop`. Lesson sims (SeqSim/TreeSim/HashSim) now auto-play and loop,
  so they animate on view instead of sitting on an empty first frame.
- **TreeCanvas rewrite**: layout in node-units (in-order column × spacing, depth
  × row); the canvas sizes its viewBox from the node extents and keeps a fixed
  visual height, so nodes stay readable and wide trees scroll instead of
  shrinking. Bigger nodes, role-coloured fills/strokes, animated positions.
- **SeqCanvas**: pop-in animation for new items, bolder boxes; seeded the canned
  stack/queue demos so frame 0 is populated.
- **Verification**: smoke-tested 12 routes — **0 console errors**; confirmed
  interactions work (BST insert walks the path + adds a node, stack push adds a
  box, hash 19 & 26 collide and chain in bucket 5, in-order traversal outputs
  sorted). Temp Playwright harness removed afterward.

`npm run build` green.

---

## 2026-06-08 — Visualizers hub + interactive structure pages

Turned the embedded sims into dedicated, **interactive** pages — like Sorting/
Pathfinding but you drive the operations.

- **`usePlayer` autoplay** flag: when an interactive op sets new frames, the
  animation plays automatically (existing callers unchanged).
- **Interactive op builders** that take live state + an arg → `{frames, next}`:
  stack push/pop, queue enq/deq, linked-list insert-head/tail + delete
  (`sequence.ts`), BST insert/search showing the path (`tree.ts`), hash insert
  with chaining (`hash.ts`). Extracted `HashCanvas`.
- **Interactive components** (`Interactive.tsx`): `InteractiveSeq`
  (stack/queue/list), `InteractiveBst`, `InteractiveHash` — each with a control
  bar (number input + op buttons, Enter to run) over the shared canvas + player.
  `TraversalViz` picks an order and runs it on a fixed tree.
- **Visualizers hub** (`/visualizers`) + registry + per-structure detail page
  (`/visualizers/:id`) with complexity card + "read the lesson" link. Sorting &
  Pathfinding keep their richer standalone pages and are listed in the hub.
- **Nav** slimmed to **Learn · Visualizers · Playground** (the hub replaces the
  two separate links). Home CTA → hub.
- `npm run build` green; all `/visualizers/*` routes serve.

**Next:** topics 11–22; in-lesson playground + problems; search.

---

## 2026-06-08 — Visual lessons + simulations through topic 10

Made every lesson genuinely visual, turned derivations into interactive
diagrams, and authored content with a simulation on each topic up to #10.

**Reusable simulation engine** (`lib/sims/` + `components/sim/`)
- `EmbeddedSim`: generic frame player (reuses usePlayer + PlaybackControls).
- `SeqCanvas` + `sequence.ts`: one canvas for **array / stack / queue / linked
  list** (boxes, pointer markers, arrows). Frame builders: two-pointer reverse,
  push/pop, enqueue/dequeue, head-insert + delete.
- `TreeCanvas` + `tree.ts`: **BST insert** (shows the search path) and the four
  **traversals** (in/pre/post/level) with the visiting order read out live.
- `HashSim`: hash-table inserts with `h(k)=k mod 7` + separate chaining,
  highlighting collisions.

**Derivations you can see** (interactive SVG, addressing the request directly)
- `GrowthChart` (drag n, watch O(n²) pull away), `SumTriangle` (1+2+…+n ≈ ½n²),
  `HalvingDiagram` (log n), `RecursionTree` (n × log n). Embedded right next to
  the matching `derive(...)` blocks in Big-O, bubble, binary search, merge.

**Authoring** — extended `viz` to ~13 modules via a `Body` dispatcher + a
`variant` field; documented all modules in AUTHORING.md.

**Content (topics 1–10 + pathfinding = 11 chapters)** — new chapters: Arrays &
strings, Recursion (call stack via the stack sim + recursion tree), Linked
lists, Stacks & queues, Hashing, Trees & BSTs, Tree traversals. Each lesson
embeds a relevant simulation.

`npm run build` green; all lesson routes serve. Bundle ~97 kB gzip.

**Next:** topics 11–22; in-lesson playground + problems; search.

---

## 2026-06-08 — Authoring API, derivations, Phases 4/5/7

A big multi-phase push (per "carry on with all phases").

**Easier authoring + better content**
- `content/builder.ts`: terse helpers (`prose/heading/callout/viz/derive/step/
  lesson/chapter`) so adding a lesson is a few lines. `AUTHORING.md` documents
  the 3-step "add a lesson / chapter" flow.
- New **`derivation`** block: step-by-step cost derivations rendered as a clean
  numbered proof ending in the Big-O result. Used to actually *derive*
  complexities — bubble's n(n−1)/2 ⟹ O(n²), binary search's halving ⟹ O(log n),
  merge's T(n)=2T(n/2)+O(n) ⟹ O(n log n), quick's average-vs-worst.
- New content: **Searching** chapter (linear + binary search) and **Merge sort**
  lesson; refactored all chapters to the builder API. Lesson header now shows
  "Ch NN · Chapter" and "Lesson X of Y".

**Phase 4 — Notes & progress** ✅
- `progress.ts` store (useSyncExternalStore) → **mark lessons complete**; checks
  in the sidebar + library, a progress bar on `/learn`.
- Global **`/notes`** page: collects every lesson note, links back, **exports to
  Markdown**, delete per note.

**Phase 5 — Playground** ✅
- `usePyodide.ts`: lazy-loads **Pyodide** (CPython→WASM) from CDN, runs Python in
  the browser, streams stdout/stderr. `CodeEditor` (textarea + line numbers +
  tab-indent, no dependency). `/playground` page with examples + Run + output.

**Phase 7 (partial)** — `useTransportKeys`: **Space = play/pause, ←/→ = step** on
both visualizers. Navbar text links collapse under `md` to avoid overflow.

`npm run build` green; all routes serve.

**Next:** in-lesson playground + problems w/ hidden tests; more chapters;
search/command-palette; IndexedDB + text highlights; mobile nav menu.

---

## 2026-06-08 — Phase 3: Handbook shell ✅

The "book" pillar — lessons that interleave prose, live visualizers and notes.

- **Content-as-data model** (`src/content/`): `LessonBlock` union (prose /
  heading / callout / viz / divider), `Lesson`, `Chapter`, plus a registry with
  lookup + book-wide prev/next (`adjacentLessons`).
- **Authored first chapters**: Foundations (Big-O), Sorting (Meet sorting,
  Bubble, Quick — each embedding the live visualizer), Pathfinding (Searching a
  grid). Real prose, not lorem.
- **Rendering**: a dependency-free `MarkdownLite` (paragraphs, lists, fenced
  code, inline bold/italic/code/links) + `BlockRenderer` (callouts with tone
  icons; viz blocks).
- **Embeddable viz**: compact `EmbeddedSort` (bars + synced code + counters,
  algorithm pills, shuffle) drops straight into a lesson — reuses the engine.
  Pathfinding embeds a live mini-grid + a launch link to the full tool.
- **Reading layout** (`LessonPage`): left = chapter **spine** sidebar, center =
  content column, right rail = **"on this page"** + **per-lesson notes**
  (localStorage, autosaved — an early slice of Phase 4). Reading progress bar,
  prev/next cards, scroll-to-top on navigation.
- **Library** (`LearnPage`) lists chapters → lessons with time estimates.
  Added `/learn` routes, a **Learn** nav entry, and pointed the home hero CTA
  at the handbook.
- `npm run build` green; routes serve.

**Next:** more content + per-lesson "mark complete"; then Phase 5 (Pyodide
playground + problems) or deepen Phase 4 notes (highlights, global /notes).

---

## 2026-06-08 — Rebrand to Algolume + plan reset

Named the project (researched availability — "Algolume" is clear) and reset the
plan around a bigger vision.

- **Rebrand:** AlgoViz → **Algolume** across wordmark, `<title>`, `package.json`,
  README, favicon and logo. New logo: ascending data bars rising into a soft
  radial "lume" (glow) with an apex spark — *algorithms, illuminated*.
- **Light mode is now the default** (boot script only goes dark if the user
  explicitly saved dark; storage key renamed `algolume-theme`, `useTheme` synced).
- **Contact links** added to the navbar (LinkedIn + GitHub repo) and the landing
  footer. Repo: github.com/mahirshahriar1/Algolume.
- **plan.md fully rewritten** around "one place to learn algorithms": five
  pillars (Read / Watch / Play / Practice / Note), a block-based lesson model,
  a handbook shell (chapters→lessons→blocks), a notes system, and a Pyodide
  playground + problems. Roadmap re-sequenced: Phase 3 = handbook shell (next),
  4 = notes, 5 = playground/problems, 6 = content, 7 = polish.

**Next:** Phase 3 — handbook shell (lesson data model + reading layout +
embeddable viz blocks).

---

## 2026-06-08 — Graph mode: custom node count

Made the node graph scalable instead of a fixed 12 nodes.

- `generateGraph(count, seed)` in `graph.ts`: procedural connected weighted
  graph, **5–40 nodes**. Seedable PRNG (mulberry32) → stable layout per
  (count, seed). Jittered-grid placement, k-nearest-neighbour edges, then a
  union-find/Kruskal pass guarantees connectivity. Start/goal = left-/right-most.
- `PathfindingPage`: added a **Nodes slider (5–40)** and a **Regenerate** button.
  Dragged positions are kept as overrides (`dragPos`) separate from the
  generated layout, so changing the count and dragging never conflict; endpoints
  are clamped so a shrunk graph can't reference a missing node. Weight labels
  auto-hide above 20 nodes to avoid clutter.
- `npm run build` green; route serves.

---

## 2026-06-08 — Pathfinding: node-based graph mode ✅

Added a real **node graph** view alongside the grid — both run the same four
searches on the same frame engine.

- `src/lib/graph.ts`: `GraphFrame` + node/edge model + **BFS/DFS/Dijkstra/A***
  via the same shared best-first core (FIFO/LIFO/min-g/min-f). Edge cost = hops
  for BFS/DFS, weight for Dijkstra/A*; A* heuristic = straight-line distance to
  goal. Ships a hand-laid-out 12-node weighted demo graph with multiple routes.
- `GraphCanvas.tsx`: SVG renderer — weighted edges (with weight labels), nodes
  coloured by overlay role, the traced path highlighted edge-by-edge.
  **Draggable nodes** (pointer-capture; edge weights recompute from geometry so
  A* stays consistent) and **click-to-assign** start/goal via an armed toggle.
- `PathfindingPage`: added a **Grid ⇄ Graph** toggle in the header. The
  algorithm selector, transport, captions, stats and code panel are all shared
  between views; only the canvas + a few view-specific controls differ.
- `npm run build` green; route serves.

**Try:** Graph view → Dijkstra vs A* with the same start/goal, then drag a node
and watch the chosen path change.

---

## 2026-06-08 — Phase 1: Editorial landing redesign ✅

Adopted the cartesian-style **editorial / "interactive handbook"** look:
warm paper neutrals · expressive **serif display type** (Fraunces) with
accent-coloured lead words · **soft-neobrutalist "paper cards"** with a hard
offset drop-shadow · alternating two-column prose↔visual rows.

- Added **Fraunces** display font (`font-display`); kept Inter for body, mono
  for code.
- Warmed the **light** palette to paper tones (warm off-white bg, warm
  near-black text, coral-red `swap`); nudged **dark** palette warmer too. Added
  `--card-shadow` tokens so the hard offset shadow adapts per theme.
- New `.card` (paper card + hard shadow) and `.card-hover` (lift on hover) and
  `.eyebrow` component styles.
- New `LandingPreviews.tsx`: four auto-playing/illustrative cards — live
  quicksort bars, a mini BFS frontier grid, a code-playback card (synced code +
  variable chips + array + scrubber), and a Two-Sum challenge mock.
- Rebuilt `HomePage` as an editorial layout: serif accent-word headings
  ("Visualize" / "Code Playback" / "Test Your Might"), bulleted prose, and
  alternating floating cards. Navbar wordmark switched to serif.
- Theme system untouched — the whole redesign works in light **and** dark.
  `npm run build` green; dev server verified.

**Next options:** roll the paper-card/serif treatment into the Sorting &
Pathfinding pages for consistency · Phase 3 runnable Python.

---

## 2026-06-08 — Phase 2: Pathfinding module ✅

A full interactive grid module, reusing the exact same player + controls.

- `src/lib/pathfinding.ts`: `GridFrame` type + **BFS, DFS, Dijkstra, A***, all
  built on one shared best-first `search()` core that differs only in how the
  next cell leaves the frontier (FIFO / LIFO / min-dist / min f=g+h). A* uses a
  Manhattan heuristic and visibly explores far fewer cells than BFS/Dijkstra.
- Each frame stores a compact `Int8Array` overlay (none/frontier/visited/
  current/path) — memory-light and self-contained so scrubbing stays instant.
- `GridCanvas`: renders the grid + overlay; **click-drag to draw/erase walls**,
  **drag the start/goal markers**. Uses event delegation (one mousedown/over on
  the container) instead of per-cell handlers.
- `PathfindingPage`: algorithm picker, random-wall / clear-walls, live
  visited/frontier/path stats, synced code panel, result (path length / no path).
- Reused `usePlayer` + `PlaybackControls` unchanged — the generic engine paid
  off. Home card flipped from "Preview" to live. `npm run build` green.

**Next options:** Phase 3 runnable Python (CodeMirror + Pyodide) · weighted
grid + recursive-division maze · or Phase 1 polish (keyboard shortcuts).

---

## 2026-06-08 — Phase 0: Foundation

Initial scaffold and the first working module.

- Set up Vite + React 18 + TypeScript + Tailwind, React Router, lucide-react.
- Designed the **frame engine**: algorithms are pure `input → Frame[]`
  emitters; a generic `usePlayer` hook scrubs frames (play/pause/step/scrub/
  restart). Rewinding is as cheap as fast-forwarding.
- Built the **Sorting visualizer**: bubble, insertion, selection, merge, quick.
  Synced line-highlighted code panel, live variables, live comparison/swap/
  write counters, per-step captions, adjustable size + reshuffle.
- Landing page with live auto-playing hero; Pathfinding placeholder.
- `npm run build` green; dev server verified (HTTP 200).

**Next:** Phase 1 — light/dark theming + clean-UI pass.

---

## 2026-06-08 — Phase 1: Light & dark mode ✅

Clean, eye-friendly UI in both themes via a semantic color-token system.

- Refactored **all colours into CSS-variable tokens** (`base`, `surface`,
  `elevated`, `line`, `fg`, `muted`, `subtle` + accents `run/compare/pivot/
  swap/visited/bar`). Stored as "R G B" channels so Tailwind opacity modifiers
  (`bg-surface/70`) still work; values swap between `:root` (light) and `.dark`.
- Light theme: soft off-white background (not harsh pure white), slate-900
  text, accents shifted to the -600 range for AA contrast on light surfaces.
- Added `useTheme` hook + `ThemeToggle` in the navbar; persists to localStorage.
- **Flash-free init**: inline boot script in index.html sets the theme class
  before first paint (respects saved choice, falls back to system preference).
- Swept 43 hardcoded `slate-*` classes → semantic tokens across all components/
  pages; fixed two light-mode contrast bugs (white text on pale/white bg).
- `npm run build` green; dev server verified.

**Next options:** keyboard shortcuts (space/←/→) · custom array input ·
algorithm race mode · or start Phase 2 (Pathfinding grid).
