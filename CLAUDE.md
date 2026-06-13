# CLAUDE.md — Algolume

Local-first, no-signup interactive handbook for data structures & algorithms.
One page lets you **Read** (lessons), **Watch** (live frame-by-frame sims),
**Play** (Python playground), **Practice** (problems with hidden tests), and
**Note**. Vision/roadmap → [plan.md](plan.md); lesson authoring →
[AUTHORING.md](AUTHORING.md).

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build  ← the gate; must stay green
npm run preview
```

No test runner / linter — **`npm run build` is the gate**. Python problem
solutions run in-browser via Pyodide; verify their test data with any local
CPython. C++ snippets are reference-solution material until a WASM compiler or
backend judge exists.

## Stack

React 18 · Vite 5 · TS 5 (strict) · Tailwind 3 · React Router 6 · lucide-react ·
Pyodide (CPython→WASM, lazy CDN). C++ execution is **not implemented yet**; use
C++ only for lesson examples and revealable problem reference solutions until a
compiler runner is added.
Alias **`@/` → `src/`**. Persistence is **localStorage-first**; an **optional**
Supabase + Google-OAuth layer mirrors it to the cloud when configured (see Sync
below). No state lib / UI kit — small hand-rolled components.

## Cloud sync (optional, local-first)

Signed-out is the full experience. When `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY`
are set (`.env.example` has the setup + table SQL), a "Sign in with Google" control
appears and progress/notes/solved-problems mirror to one JSON row per user
(`user_state`, RLS-protected). `lib/supabase.ts` (null when unconfigured →
everything no-ops), `lib/auth.ts` (`useAuth`, sign-in/out), `lib/sync.ts` (pull →
**merge** [union of completed/solved, newest-wins per note via `notes-meta`
timestamps] → push, then debounced push on local change; `useSyncStatus`).
The three stores expose `get*/set*/subscribe*` for the sync layer; never bypass
them when writing progress/solved/notes.

## Rules (always)

1. **Build green** before a chunk is done. The `LessonBlock` switches in
   `searchIndex.ts` and `BlockRenderer.tsx` are exhaustive — add a `case` for new
   block kinds.
2. **Light *and* dark.** Never hardcode colors — use semantic tokens
   (`bg-surface`, `text-muted`, `text-run`, …; CSS vars in `index.css`). Light is
   default. Use `cn()` for conditional classes.
3. **Everything embeds.** A viz/playground/problem is a self-contained,
   data-driven component that drops into a lesson, a page, or a preview.
4. **Content & problems are data**, not bespoke pages (`src/content/`,
   `src/lib/problems/`). Add data, not layouts.
5. **Algorithms emit frames** (`input → Frame[]`); `usePlayer`/`EmbeddedSim`
   scrub them. Keep timing out of the algorithm.
6. **Frame builders stay deterministic** (same controls → same frames). Prefer
   seeded/index-based variation over `Math.random()` in builders.
7. **Respect limits.** Customizable viz caps inputs for legibility (e.g.
   `SP_LIMITS`, traversal ≤ 31 nodes). Add + surface bounds with new controls.

## Structure

```
src/
  App.tsx                 routes
  components/
    sim/                  engine + canvases
      EmbeddedSim.tsx     generic player+canvas+code (lesson embeds)
      VizShell3.tsx       3-pane standalone layout (controls|canvas|code)
      Interactive.tsx     ALL standalone interactive visualizers
      SeqCanvas TreeCanvas HashCanvas RecursionCanvas ShortestPathCanvas
      derivations/        static teaching diagrams
    lesson/               BlockRenderer, MarkdownLite, VizBlock, LessonNotes
    CodeEditor CodePanel Navbar …
  content/                THE HANDBOOK
    types.ts builder.ts index.ts  chapters/*.ts
  lib/
    usePlayer usePyodide useTheme notesStore progress searchIndex
    sims/                 pure builders: sequence tree hash recursion shortestPath
    problems/             THE PRACTICE SYSTEM (types runner solved index sets/*)
  pages/                  Home Learn Lesson Notes Search Playground
                          Problems ProblemPage Sorting Pathfinding visualizers/
```

Routes: `/`, `/learn`, `/learn/:chapter/:lesson`, `/visualizers[/:id]`,
`/playground`, `/problems[/:id]`, `/notes`, `/search`, `/sorting`,
`/pathfinding`.

## Handbook (content-as-data)

A lesson = array of typed `LessonBlock`s. Kinds: `prose`, `heading`, `callout`
(`intuition|warning|complexity|note`), `viz`, `derivation`, **`problem`**,
`divider` — helpers in `content/builder.ts`. Authoring is 3 steps (AUTHORING.md).
**Lesson standard:** no giant prose chunk — section it (Concept · Math/Invariant ·
Visualization · Complexity time+space · Examples/C++) and end with `problem(...)`
cards.

## Visualizers & sim engine

Pure builder in `lib/sims/*` → `Frame[]`; canvas in `components/sim/*` renders one
frame; `usePlayer` scrubs. Standalone in `Interactive.tsx` (registered in
`pages/visualizers/registry.tsx`); lesson embeds wired in `VizBlock.tsx`. Follow
the **customizable** pattern (controls + limits + live stats):

- **Tree traversals**: order + shape (balanced/random/left·right-skew/custom seq)
  + node-count slider; shows height. Helpers in `lib/sims/tree.ts`.
- **Shortest paths**: BF/FW on a custom graph — node slider, editable
  `from to weight` edges, source picker (BF), allow-negative, Randomize; bounded
  by `SP_LIMITS`. Builders take `(nodes, edges, source?)`.

## Playground (`/playground`)

In-browser CPython via Pyodide (`lib/usePyodide.ts`): lazy CDN singleton, runs on
the **main thread** (an infinite loop freezes the tab — Web Worker is the upgrade
path). `run(code) → { ok, output, error }`. Everything local; say so in UI.
Do not add visible C++ run/submit/editor modes until there is a real compiler
runner (WASM clang/gcc stack or backend judge service).

## Practice / Problems (`/problems`)

Data-driven; author once and the browser, solve page, grader, progress, and
lesson-embed all work. **Each topic ships a laddered easy → medium → hard set.**

**Model** (`lib/problems/types.ts`): `Problem { id, title, topic (=chapter id),
difficulty, summary, statement(md), funcName, starter, examples[], tests[]
(hidden), hints[], solution, cppSolution?, compare?, complexity?, lesson?,
tags? }`. A
`TestCase` is `{ input: unknown[] (positional args), expected, explain? }`.
`compare`: `exact` (default) | `unordered` | `set` | `approx`.

**Grader** (`runner.ts`): `runProblem(run, problem, code, "examples"|"all")`
concatenates user code + a Pyodide harness; passes cases as **base64 JSON**,
looks up `funcName` in globals, calls it per case **capturing stdout**, compares
per `compare` mode, prints one `___ALGOLUME_RESULTS___` JSON line that JS parses.
Returns `{ ok, fatal?, cases[], passed, total }`. A passing Submit calls
`markSolved(id)` (reactive `solved.ts`).

**Authoring conventions:** entry functions **return** a value (no in-place
mutation) for clean equality; give 2–3 `examples` (+`explain`) and 3–5 hidden
`tests` with edge cases (empty/single/negative/all-same/bounds); hints go nudge →
step → near-answer; `solution` matches stated `complexity`; set `topic`/`lesson`
to the teaching lesson. **Always verify every solution against all its cases in
CPython before committing** (the longest-consecutive case had a wrong expected
until verification caught it).

**Add a problem:** append to `lib/problems/sets/<topic>.ts` → spread into
`PROBLEMS` in `index.ts` (add `TOPIC_LABEL` if new) → add C++ reference
snippet in `lib/problems/cpp.ts` → optionally embed via `problem("<id>")` in a
chapter.

**C++ policy:** Every new problem should include a concise C++ reference
solution for the reveal panel. Lessons should include C++ examples/sketches
where they help students transfer the idea to CP. Visualizer snippets can remain
concise and do not need full C++ mirrors.

## Per-topic deep-dive workflow (default going forward)

The user picks **one topic** at a time; for that topic, deliver all three:

1. **Detailed topic analysis** — author/extend the lessons to the lesson standard
   (Concept · Math/Invariant · Visualization · Complexity · Examples/C++),
   reading like university notes.
2. **Custom visualization** — a new or extended interactive viz for the topic,
   built on the frame engine with real controls + limits + live stats.
3. **Laddered problems** — relevant **easy + medium + hard** problems tied to the
   topic's lessons, each fully verified in CPython.

Keep `log.md` and `plan.md` updated as topics land.
