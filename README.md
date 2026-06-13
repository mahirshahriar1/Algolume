# Algolume

![Algolume demo](demo.gif)

Algolume is a **local-first, no-signup interactive handbook** for data structures
and algorithms. One project lets you **Read** book-quality lessons, **Watch**
live frame-by-frame visualizers, **Play** with real Python in the browser,
**Practice** problems checked against hidden tests, and take **Notes** — all
running entirely in your browser, with an optional cloud-sync layer when you want
your progress on every device.

- **Author:** Mahir Shahriar
- **LinkedIn:** https://www.linkedin.com/in/mahir-shahriar-tamim/

## What's inside

- **23 chapters** spanning competitive-programming onboarding, foundations,
  NP-hardness, arrays, bit manipulation, searching, sorting, recursion, linked
  lists, stacks & queues, hashing, trees, traversals, heaps, graphs,
  pathfinding, minimum spanning trees, greedy, divide & conquer, dynamic
  programming (1D, 2D, and bitmask/TSP), strings & pattern matching, math, and
  game theory — authored as data and read like university notes.
- **~18 interactive visualizers** built on a single frame engine — arrays,
  searching, sorting, recursion/backtracking, linked lists, stacks, queues, hash
  tables, trees & BSTs, heaps, tree traversals, pathfinding, the Sieve, game
  theory (Nim/Grundy), string matching (naïve vs KMP), greedy (activity
  selection · Kadane · fractional knapsack), bit manipulation, dynamic
  programming tables, and a unified weighted-graph lab (Bellman-Ford,
  Floyd-Warshall, Kruskal, Prim, union-find).
- **A laddered easy → medium → hard problem set per topic**, graded in-browser
  against hidden tests, each with hints, a Python solution, and a C++ reference
  solution.
- **An in-browser Python playground** powered by Pyodide (CPython → WASM).
- **Optional cloud sync** — local-first by default; sign in with Google to mirror
  progress, notes, and solved problems to Supabase.

## How to Run

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Vite will print the local URL, usually:

```text
http://localhost:5173
```

Build for production (`npm run build` is the project's only gate — it must stay
green; there is no separate test runner or linter):

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Available Scripts

```bash
npm run dev      # Start Vite dev server
npm run build    # Type-check (tsc -b) and build production assets into dist/
npm run preview  # Serve the production build locally
```

## Optional cloud sync (Supabase + Google OAuth)

Signed-out is the **full experience** — everything works from `localStorage`. The
sync layer is entirely optional and only switches on when its environment
variables are present.

1. Copy `.env.example` to `.env` and fill in:

   ```bash
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_ANON_KEY=<your publishable/anon key>   # public client key — safe in the frontend
   ```

   > Never commit the Postgres connection string or any secret/service-role key.
   > `.env` is gitignored; only `.env.example` is tracked.

2. Create the `user_state` table and row-level-security policies — the SQL is in
   `.env.example`.
3. In the Supabase dashboard, enable the **Google** auth provider and paste your
   Google OAuth Client ID/Secret.

When configured, a "Sign in with Google" control appears. On sign-in the app
**pulls** the cloud row, **merges** it with local state (union of completed
lessons / solved problems, newest-wins per note via timestamps), applies the
result, then **pushes** — and debounced-pushes on every later local change. One
JSON row per user (`user_state`), protected by RLS.

The optional `VITE_WEB3FORMS_KEY` wires the **Submit an issue** form (`/issue`)
to email reports automatically; without it the form falls back to a `mailto:`
link.

## Main Routes

```text
/                                      Home
/learn                                 Chapter library
/learn/:chapterId/:lessonId            Lesson reader
/visualizers                           Visualizer gallery
/visualizers/:id                       Interactive visualizer page
/playground                            Python playground (Pyodide)
/problems                              Problem roadmap / searchable browser
/problems/:id                          Problem solving page
/notes                                 Saved local notes
/search                                Lesson and notes search
/issue                                 Submit an issue / feedback
/sorting                               Standalone sorting visualizer
/pathfinding                           Standalone pathfinding visualizer
```

A global command palette (⌘/Ctrl-K) jumps to any of these; `?` opens the
keyboard-shortcut help.

## Project Structure

```text
src/
  App.tsx                         # React Router route table
  main.tsx                        # App entry point
  index.css                       # Tailwind layers and theme tokens (light + dark)

  components/
    lesson/                       # BlockRenderer, MarkdownLite, VizBlock, LessonNotes
    sim/                          # Frame engine + canvases
      EmbeddedSim.tsx             #   generic player+canvas+code for lesson embeds
      VizShell3.tsx               #   3-pane standalone layout (controls | canvas | code)
      Interactive.tsx             #   ALL standalone interactive visualizers
      *Canvas.tsx                 #   one canvas renders one frame
    Navbar.tsx                    # Top navigation (palette, account menu, feedback)
    AccountMenu.tsx               # Google sign-in + sync status chip
    CommandPalette.tsx            # ⌘K quick switcher

  content/                        # THE HANDBOOK (content-as-data)
    builder.ts                    #   lesson/chapter/block authoring helpers
    index.ts                      #   chapter registry and reading order
    types.ts                      #   chapter, lesson, and block types
    chapters/                     #   one module per chapter

  lib/
    problems/                     # THE PRACTICE SYSTEM
      types.ts                    #   Problem / TestCase model
      runner.ts                   #   Pyodide grader (base64-JSON harness)
      solved.ts index.ts          #   solved store + registry
      cpp.ts                      #   C++ reference solutions
      sets/                       #   one problem set per topic
    sims/                         # pure frame generators for embedded simulations
    sorting.ts pathfinding.ts     # sorting / grid frame emitters
    usePlayer.ts                  # generic play/pause/step/scrub hook
    usePyodide.ts                 # lazy CDN Pyodide singleton
    progress.ts notesStore.ts     # local lesson-progress / notes stores
    supabase.ts auth.ts sync.ts   # optional cloud-sync layer

  pages/
    visualizers/                  # gallery, registry, and thumbnails
    HomePage.tsx LearnPage.tsx LessonPage.tsx
    ProblemsPage.tsx ProblemPage.tsx PlaygroundPage.tsx
    SearchPage.tsx NotesPage.tsx IssuePage.tsx
    SortingPage.tsx PathfindingPage.tsx
```

Static assets live in `public/`. Production output is written to `dist/`.

## How Lessons Work

Lessons are authored as TypeScript **data**, not one-off React pages. Each
chapter exports a `chapter(...)` object from `src/content/chapters/`, and each
chapter contains `lesson(...)` entries built from typed content blocks. The block
switches in `BlockRenderer.tsx` and `searchIndex.ts` are exhaustive — add a
`case` when you introduce a new block kind.

Common block helpers from `src/content/builder.ts`:

```ts
prose("Markdown-like lesson text")
heading("Section title")
callout("intuition", "Important idea")     // intuition | warning | complexity | note
viz("sorting", { algo: "quick", title: "Quick sort simulation" })
derive([step("T(n) = 2T(n/2) + n", "Split and merge")], "O(n log n)")
problem("two-sum")
divider()
```

**Lesson standard:** no giant prose chunk — section it (Concept · Math/Invariant ·
Visualization · Complexity, time *and* space · Examples/C++) and end with
`problem(...)` cards.

## How to Add a Lesson

1. Open the matching chapter file in `src/content/chapters/`.
2. Import the helpers you need:

   ```ts
   import { callout, chapter, heading, lesson, problem, prose, viz } from "../builder";
   ```

3. Add a `lesson(...)` entry inside that chapter's lesson array:

   ```ts
   lesson("binary-search-invariant", "Binary search invariant", "Keep lo/hi honest.", 12, [
     prose("Binary search works because the answer space is monotonic."),
     heading("Invariant"),
     prose("At every step, keep the possible answer inside `[lo, hi]`."),
     viz("searching", { variant: "binary", title: "Binary search window" }),
     callout("complexity", "Each step halves the range, so the time is `O(log n)`."),
     problem("lower-bound"),
   ])
   ```

4. For a new chapter file, export it from `src/content/chapters/...` and register
   it in `src/content/index.ts` so it appears (in reading order) in `/learn`.
5. Run `npm run build`.

## How to Add a Visualizer

Visualizers follow the frame pattern — a pure builder emits `Frame[]`, a canvas
renders one frame, and `usePlayer` scrubs them. Keep timing out of the algorithm
and keep builders deterministic (same controls → same frames; prefer
seeded/index-based variation over `Math.random()`).

1. Add or update a frame generator in `src/lib/sims/` (a frame is a plain object
   describing one visual state).
2. Add a canvas in `src/components/sim/` that renders one frame.
3. Add an interactive wrapper in `src/components/sim/Interactive.tsx` (controls +
   limits + live stats).
4. Register it in `src/pages/visualizers/registry.tsx`:

   ```ts
   {
     id: "heap",
     title: "Heap / priority queue",
     blurb: "Push, pop, and restore heap order.",
     icon: Triangle,
     accent: "text-pivot",
     lesson: "/learn/heaps/heap-basics",
     complexity: [{ label: "Push", value: "O(log n)" }],
     Component: (e) => <HeapViz complexity={e.complexity} lesson={e.lesson} />,
   }
   ```

5. To embed it in a lesson, use `viz(...)`. For a new `VizModule`, add the module
   name to `src/content/types.ts` and handle it in
   `src/components/lesson/VizBlock.tsx` (and add a thumbnail in
   `src/pages/visualizers/VizThumb.tsx`).

Respect legibility limits — customizable visualizers cap their inputs (e.g.
`SP_LIMITS`, traversal ≤ 31 nodes); surface new bounds alongside new controls.

## How to Add a Problem

Problems are **data** too: author once and the browser, solve page, grader,
progress tracking, and lesson embeds all work. Each topic ships a laddered easy →
medium → hard set under `src/lib/problems/sets/`.

1. Append a `Problem` to `src/lib/problems/sets/<topic>.ts` with:
   `id`, `title`, `topic` (= chapter id), `difficulty`, `summary`,
   `statement` (markdown), `funcName`, `starter`, visible `examples` (with
   `explain`), hidden `tests`, `hints` (nudge → step → near-answer), `solution`,
   and optional `compare` (`exact` | `unordered` | `set` | `approx`),
   `complexity`, `lesson`, `tags`.
2. Spread the set into `PROBLEMS` in `src/lib/problems/index.ts` (add a
   `TOPIC_LABEL` if the topic is new).
3. Add a C++ reference snippet in `src/lib/problems/cpp.ts`.
4. Embed it in a lesson with `problem("problem-id")` where useful.
5. **Verify every solution against all its cases in CPython before committing**,
   then run `npm run build` and try the examples from `/problems/:id`.

Entry functions should **return** a value (no in-place mutation) for clean
equality. The grader (`runner.ts`) concatenates user code with a Pyodide
harness, passes cases as base64 JSON, calls `funcName` per case (capturing
stdout), compares per `compare` mode, and prints a single results line that the
UI parses. A passing Submit calls `markSolved(id)`.

> **Language note:** Python solutions run in-browser via Pyodide. C++ snippets
> are reference-solution / lesson material — there is no C++ runner yet (a WASM
> compiler or backend judge is the upgrade path).

## How to Add a Page or Feature

1. Create the page/component under the closest folder: route-level pages in
   `src/pages/`, shared UI in `src/components/`, algorithm/state logic in
   `src/lib/`, lesson content in `src/content/`.
2. Add a route in `src/App.tsx` if the feature has its own URL.
3. Add navigation only when it should be discoverable from the top-level UI
   (`src/components/Navbar.tsx` and/or the command palette).
4. **Light *and* dark, always.** Never hardcode colors — use the semantic theme
   tokens defined in `src/index.css` / `tailwind.config.js`: `base`, `surface`,
   `elevated`, `code`, `line`, `fg`, `muted`, `subtle`, `run`, `compare`,
   `pivot`, `swap`, `visited`, `bar`. Use `cn()` for conditional classes.
5. Keep visualizers frame-based so play/pause/step/scrub/rewind stay consistent.
6. Run `npm run build`.

## Tech Stack

- React 18
- Vite 5
- TypeScript 5 (strict)
- Tailwind CSS 3
- React Router 6
- lucide-react
- Pyodide (CPython → WASM) for in-browser Python execution
- Supabase + Google OAuth (optional cloud-sync layer)

Path alias: `@/` → `src/`. Persistence is `localStorage`-first; the Supabase
layer is null and no-ops entirely when its environment variables are absent.
