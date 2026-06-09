# Algolume

Algolume is an interactive algorithms learning app. It combines handbook-style
lessons, visualizers, runnable playgrounds, local notes, and browser-checked
practice problems in one React/Vite project.

- **Author:** Mahir Shahriar
- **LinkedIn:** https://www.linkedin.com/in/mahir-shahriar-tamim/


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

Build for production:

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
npm run build    # Type-check and build production assets into dist/
npm run preview  # Serve the production build locally
```

## Project Structure

```text
src/
  App.tsx                         # React Router route table
  main.tsx                        # App entry point
  index.css                       # Tailwind layers and theme tokens

  components/
    lesson/                       # Lesson renderer, markdown, notes, viz blocks
    sim/                          # Reusable visualizer canvases and controls
    ArrayCanvas.tsx               # Sorting/array visual rendering
    GraphCanvas.tsx               # Graph visual rendering
    GridCanvas.tsx                # Grid/pathfinding visual rendering
    Navbar.tsx                    # Top navigation

  content/
    builder.ts                    # Lesson/chapter authoring helpers
    index.ts                      # Chapter registry and reading order
    types.ts                      # Chapter, lesson, and block types
    chapters/                     # Chapter data modules

  lib/
    problems/                     # Problem model, sets, checker-facing data
    sims/                         # Frame generators for embedded simulations
    sorting.ts                    # Sorting frame emitters
    pathfinding.ts                # Grid/pathfinding frame emitters
    usePlayer.ts                  # Generic play/pause/step/scrub hook
    progress.ts                   # Local lesson progress store
    notesStore.ts                 # Local notes store

  pages/
    visualizers/                  # Visualizer gallery and registry
    HomePage.tsx
    LearnPage.tsx
    LessonPage.tsx
    ProblemsPage.tsx
    ProblemPage.tsx
    PlaygroundPage.tsx
    SearchPage.tsx
    NotesPage.tsx
```

Static assets live in `public/`. Production output is written to `dist/`.

## Main Routes

```text
/                                      Home
/learn                                 Chapter library
/learn/:chapterId/:lessonId            Lesson reader
/visualizers                           Visualizer gallery
/visualizers/:id                       Interactive visualizer page
/playground                            Python playground
/problems                              Problem roadmap/browser
/problems/:id                          Problem solving page
/notes                                 Saved local notes
/search                                Lesson and notes search
/sorting                               Standalone sorting visualizer
/pathfinding                           Standalone pathfinding visualizer
```

## How Lessons Work

Lessons are authored as TypeScript data, not as one-off React pages. Each chapter
exports a `chapter(...)` object from `src/content/chapters/`, and each chapter
contains `lesson(...)` entries built from typed content blocks.

Common block helpers from `src/content/builder.ts`:

```ts
prose("Markdown-like lesson text")
heading("Section title")
callout("intuition", "Important idea")
callout("warning", "Common mistake")
callout("complexity", "Time and space analysis")
viz("sorting", { algo: "quick", title: "Quick sort simulation" })
derive([step("T(n) = 2T(n/2) + n", "Split and merge")], "O(n log n)")
problem("two-sum")
divider()
```

## How to Add a Lesson

1. Open the matching chapter file in `src/content/chapters/`.

2. Import the helpers you need:

```ts
import { callout, chapter, heading, lesson, problem, prose, viz } from "../builder";
```

3. Add a new `lesson(...)` entry inside that chapter's lesson array:

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

4. If this is a new chapter file, export it from `src/content/chapters/...` and
   register it in `src/content/index.ts` so it appears in `/learn`.

5. Run:

```bash
npm run build
```

## How to Add a Visualizer

Most visualizers follow this shape:

1. Add or update a frame generator in `src/lib/sims/` or another `src/lib/`
   module. A frame is a plain object describing one visual state.

2. Add a canvas/component in `src/components/sim/` that renders one frame.

3. If it needs controls, add an interactive wrapper in
   `src/components/sim/Interactive.tsx`.

4. Register it in `src/pages/visualizers/registry.tsx`:

```ts
{
  id: "heap",
  title: "Heap / Priority Queue",
  blurb: "Push, pop, and restore heap order.",
  icon: Layers,
  accent: "text-pivot",
  lesson: "/learn/heaps/heap-basics",
  complexity: [{ label: "Push", value: "O(log n)" }],
  Component: (entry) => <HeapViz complexity={entry.complexity} lesson={entry.lesson} />,
}
```

5. To embed it in a lesson, use `viz(...)`. If it is a new `VizModule`, add the
   module name to `src/content/types.ts` and handle it in
   `src/components/lesson/VizBlock.tsx`.

## How to Add a Problem

Problems live in `src/lib/problems/sets/`.

1. Add a `Problem` object with:
   - `id`
   - `title`
   - `topic`
   - `difficulty`
   - `summary`
   - `statement`
   - `funcName`
   - `starter`
   - visible `examples`
   - hidden `tests`
   - `hints`
   - `solution`

2. Export the problem from its topic set file.

3. If it is a new set file, import and spread it in `src/lib/problems/index.ts`.

4. Add the matching lesson link with `problem("problem-id")` where useful.

5. Run `npm run build` and manually try the examples from `/problems/:id`.

## How to Add a Page or Feature

1. Create the page or component under the closest existing folder:
   - route-level pages go in `src/pages/`
   - shared UI goes in `src/components/`
   - algorithm/state logic goes in `src/lib/`
   - lesson content goes in `src/content/`

2. Add a route in `src/App.tsx` if the feature has its own URL.

3. Add navigation only when the feature should be discoverable from the top-level
   UI. The navbar lives in `src/components/Navbar.tsx`.

4. Reuse existing theme tokens from `src/index.css` and Tailwind colors:
   `base`, `surface`, `elevated`, `line`, `fg`, `muted`, `subtle`, `run`,
   `compare`, `pivot`, `swap`, `visited`, and `bar`.

5. Keep visualizers frame-based where possible: generate immutable frames in
   `src/lib/`, then render the current frame with a canvas/component. This keeps
   play, pause, step, scrub, and rewind behavior consistent.

6. Run:

```bash
npm run build
```

## Tech Stack

- React 18
- Vite
- TypeScript
- Tailwind CSS
- React Router
- lucide-react
- Pyodide for in-browser Python execution

