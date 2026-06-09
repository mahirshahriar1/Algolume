import { callout, chapter, derive, heading, lesson, prose, step, viz } from "../builder";

export const stacksQueues = chapter(
  "stacks-queues",
  "Stacks & queues",
  "Two restricted lists: last-in-first-out and first-in-first-out.",
  "Layers",
  [
    lesson(
      "stack",
      "Stacks (LIFO)",
      "Push and pop from one end — the structure behind undo, parsing, and the call stack.",
      5,
      [
        prose(
          "A **stack** only lets you touch one end, the **top**. You **push** to add and **pop** to remove, so the **last** item in is the **first** out — *LIFO*. Think of a stack of plates.",
        ),
        viz("stack", { title: "Push / pop" }),
        callout(
          "complexity",
          "Push and pop are both `O(1)`. Stacks power undo/redo, expression parsing, depth-first search, and — as we saw — the function call stack.",
        ),
        heading("The stack invariant"),
        derive(
          [
            step("only the top is visible", "Push and pop never touch the middle."),
            step("push writes one new top", "Constant pointer/index update."),
            step("pop removes one top", "Constant pointer/index update."),
          ],
          "O(1) push/pop",
          "One end, one update",
        ),
        callout(
          "intuition",
          "Matching brackets is the classic use: push every opening bracket, and on a closing one pop and check it matches. If the stack is empty at the end, the brackets are balanced.",
        ),
      ],
    ),
    lesson(
      "queue",
      "Queues (FIFO)",
      "Add at the rear, remove from the front — fairness, and breadth-first search.",
      5,
      [
        prose(
          "A **queue** adds at one end (the **rear**) and removes from the other (the **front**), so the **first** item in is the **first** out — *FIFO*. Think of a line at a counter.",
        ),
        viz("queue", { title: "Enqueue / dequeue" }),
        callout(
          "complexity",
          "Enqueue and dequeue are `O(1)` with the right implementation (a linked list, or a circular buffer). Queues drive breadth-first search, scheduling, and any 'process in arrival order' task.",
        ),
        heading("The queue invariant"),
        derive(
          [
            step("front points to the next item out", "Dequeue updates the front."),
            step("rear points to the next insertion spot", "Enqueue updates the rear."),
            step("neither operation shifts all elements", "A linked list or circular buffer avoids O(n) movement."),
          ],
          "O(1) enqueue/dequeue",
          "Two ends, constant updates",
        ),
        callout(
          "note",
          "Remember pathfinding? **BFS uses a queue** (explore in rings) and **DFS uses a stack** (plunge deep). The container is the whole difference between the two searches.",
        ),
      ],
    ),
    lesson(
      "applications",
      "Where they shine",
      "Bracket matching, undo histories, and the searches you've already met.",
      6,
      [
        prose(
          "**Stacks** power anything with nesting or reversal: matching brackets, the undo/redo history in your editor, evaluating arithmetic expressions, and the function **call stack** itself.",
        ),
        viz("stack", { title: "Matching brackets: push opens, pop on closes" }),
        prose(
          "**Queues** power anything processed in arrival order: print spoolers, task schedulers, and **breadth-first search**. Remember pathfinding — BFS used a queue to explore in rings, DFS used a stack to plunge deep. The container *is* the algorithm.",
        ),
        viz("queue", { title: "FIFO: processed in arrival order" }),
        callout(
          "intuition",
          "Reach for a **stack** when the most recent thing matters most (LIFO); a **queue** when the oldest waiting thing goes first (FIFO).",
        ),
      ],
    ),
  ],
);
