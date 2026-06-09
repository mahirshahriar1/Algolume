import { callout, chapter, derive, heading, lesson, playground, problem, prose, step, viz } from "../builder";

export const arrays = chapter(
  "arrays",
  "Arrays & strings",
  "Contiguous memory, O(1) access, and the two-pointer trick.",
  "Rows3",
  [
    lesson(
      "array-basics",
      "Arrays & two pointers",
      "Why indexing is O(1), why inserting in the middle isn't, and the two-pointer pattern.",
      7,
      [
        prose(
          "An **array** stores its elements in one contiguous block of memory. Because every slot is the same size, the address of `a[i]` is just `start + i × size` — a single calculation. That's why **random access is `O(1)`**: reaching `a[1000]` costs exactly the same as `a[0]`.",
        ),
        callout(
          "complexity",
          "Read/write by index: `O(1)`. Search (unsorted): `O(n)`. Insert/delete in the **middle**: `O(n)`, because everything after the gap must shift over.",
        ),
        heading("Why indexing is constant"),
        derive(
          [
            step("address(a[i]) = start + i × item_size", "The machine computes the address directly."),
            step("one multiplication + one addition", "The number of arithmetic steps does not grow with n."),
            step("no elements before i are inspected", "Indexing jumps straight to the slot."),
          ],
          "O(1) access",
          "Array indexing is address arithmetic",
        ),
        prose(
          "Many array problems have an elegant `O(n)` solution using **two pointers** that move toward each other. Here we reverse an array in place — no extra memory, one pass:",
        ),
        playground(
          `def reverse_in_place(a):
    a = a[:]
    left, right = 0, len(a) - 1
    while left < right:
        a[left], a[right] = a[right], a[left]
        left += 1
        right -= 1
    return a

data = [2, 4, 6, 8, 10]
print("input:   ", data)
print("reversed:", reverse_in_place(data))
`,
          "Run the two-pointer reverse",
        ),
        viz("array", { title: "Reverse in place with two pointers" }),
        prose(
          "The same pattern powers palindrome checks, pair-sum on a sorted array, and merging — any time you can make progress from **both ends** at once.",
        ),
        callout(
          "intuition",
          "Strings are just arrays of characters. Everything here — indexing, scanning, two pointers — applies to string problems too.",
        ),
        problem("running-sum"),
        problem("move-zeroes"),
      ],
    ),
    lesson(
      "sliding-window",
      "The sliding window",
      "Turn an O(n·k) scan into a single O(n) pass by reusing the overlap.",
      6,
      [
        prose(
          "Many array problems ask about **every contiguous block** of some size — the maximum sum of `k` in a row, the longest substring without repeats, and so on. The naive approach recomputes each block from scratch: `O(n·k)`.",
        ),
        prose(
          "The **sliding window** is smarter. As the window moves one step right it **adds the new element and drops the old one** — reusing everything in between. That makes it a single `O(n)` pass:",
        ),
        viz("sliding-window", { title: "Max sum of k consecutive elements" }),
        callout(
          "intuition",
          "The key insight: consecutive windows overlap by `k−1` elements. Don't recompute the overlap — just update the difference.",
        ),
        heading("Why the window is linear"),
        derive(
          [
            step("first window costs k", "Build the initial sum once."),
            step("each slide costs 2 updates", "Add the new right item, subtract the old left item."),
            step("there are n−k slides", "The right edge moves across the rest of the array."),
            step("k + 2(n−k)", "Total work is still a constant amount per item."),
          ],
          "O(n)",
          "Reuse the overlap instead of recomputing",
        ),
        callout(
          "complexity",
          "`O(n)` time, `O(1)` extra space. The window also stretches and shrinks for 'longest/shortest subarray with property X' problems.",
        ),
      ],
    ),
  ],
);
