# Authoring content

Lessons are plain data. Adding one is three steps — no build config, no MDX.

## Add a lesson to an existing chapter

Open the chapter file in [`src/content/chapters/`](src/content/chapters/) and
append a `lesson(...)` to its array:

```ts
lesson(
  "binary-search",                 // url id (kebab-case, unique in the chapter)
  "Binary search",                 // title
  "Halving a sorted array…",       // one-line summary (shown in the library)
  7,                               // estimated minutes
  [
    prose("If the array is **sorted**, you don't have to check every element…"),
    viz("sorting", { algo: "quick" }),
    derive(
      [
        step("n → n/2 → n/4 → … → 1", "Each step halves the window."),
        step("2ᵏ = n  ⟹  k = log₂ n", "Solve for the step count."),
      ],
      "O(log n)",
      "Why it's logarithmic",
    ),
    callout("complexity", "`O(log n)` time, `O(1)` space."),
  ],
)
```

That's it — routing, the sidebar, prev/next, "on this page", and the library
entry all update automatically.

## Add a new chapter

1. Create `src/content/chapters/<name>.ts`:

   ```ts
   import { chapter, lesson, prose } from "../builder";

   export const recursion = chapter(
     "recursion",                         // url id
     "Recursion",                         // title
     "Functions that call themselves.",   // blurb
     "Repeat",                            // lucide icon name
     [ lesson("base-cases", "Base cases", "…", 5, [ prose("…") ]) ],
   );
   ```

2. Register it in [`src/content/index.ts`](src/content/index.ts) — import it and
   add it to the `CHAPTERS` array (order = reading order).

3. If you used a new icon name, add it to the `ICONS` map in
   [`src/pages/LearnPage.tsx`](src/pages/LearnPage.tsx) (and the lesson sidebar
   if needed). Use any [lucide](https://lucide.dev) icon name.

## Block reference (`src/content/builder.ts`)

| Helper | Renders |
|--------|---------|
| `prose("md")` | A markdown block — supports `**bold**`, `*italic*`, `` `code` ``, `[links](url)`, `- bullet` / `1.` lists, and ```` ``` ```` fenced code. |
| `heading("Text")` | A section heading (auto-added to "On this page"). |
| `callout(tone, "md")` | A tinted box. `tone` ∈ `intuition` \| `warning` \| `complexity` \| `note`. |
| `viz(module, opts?)` | An embedded visualizer/sim (see modules below). `opts`: `{ algo?, variant?, size?, title? }`. |
| `derive(steps, result, title?)` | A step-by-step cost derivation. `steps` = `[ step("expr", "why"), … ]`. |
| `divider()` | A horizontal rule. |

### `viz` modules

| module | what it shows | options |
|--------|---------------|---------|
| `sorting` | live bar sort | `algo` (bubble/insertion/selection/merge/quick) |
| `pathfinding` | mini grid + launch to full tool | — |
| `array` `stack` `queue` `linked-list` | step-through structure sims | — |
| `bst` | building a binary search tree | `variant: "insert"` |
| `traversal` | tree traversal order | `variant: "inorder"\|"preorder"\|"postorder"\|"level"` |
| `hash` | hash table inserts + chaining | — |
| `bigo-growth` | interactive growth-class chart | — |
| `sum-triangle` | 1+2+…+n ≈ ½n² (slider) | — |
| `halving` | n → n/2 → … → 1 (slider) | — |
| `recursion-tree` | n×log n recurrence tree | — |

### Tips

- Use unicode for math in derivations: `n²`, `2ⁿ`, `log₂ n`, `√n`, `≈`, `⟹`.
- Keep prose blocks to a paragraph or two; break long lessons with `heading`s.
- A `viz("sorting", { algo: "bubble" })` fixes the default algorithm but still
  lets the reader switch — great for "compare them yourself" moments.
