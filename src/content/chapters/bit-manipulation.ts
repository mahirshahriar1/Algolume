import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const bitManipulation = chapter(
  "bit-manipulation",
  "Bit manipulation",
  "Think in binary: operators, the standard bit tricks, and subsets-as-integers bitmask DP.",
  "Binary",
  [
    lesson(
      "bit-basics",
      "Binary, operators & bit tricks",
      "How integers are stored, the six bit operators, and the tricks that show up everywhere.",
      12,
      [
        heading("Concept"),
        prose(
          "A fixed-width integer is just a row of bits with place values `…, 8, 4, 2, 1`. Bit manipulation works on those bits directly — it's fast (single CPU instructions), compact, and the natural language for sets, flags, and parity.",
        ),
        heading("Two's complement"),
        prose(
          "Signed integers use **two's complement**: the top bit is the sign, and negating a number is \"invert all bits, then add 1\". This is why `-x == ~x + 1`, why `x & -x` isolates the lowest set bit, and why signed overflow wraps around. In an `n`-bit type the range is `-2ⁿ⁻¹ … 2ⁿ⁻¹ - 1`.",
        ),
        heading("The six operators"),
        prose(
          "- `a & b` — **AND**: 1 where both are 1 (mask/keep bits).\n- `a | b` — **OR**: 1 where either is 1 (set bits).\n- `a ^ b` — **XOR**: 1 where they differ (toggle/cancel).\n- `~a` — **NOT**: flip every bit.\n- `a << k` — **left shift**: multiply by `2ᵏ`.\n- `a >> k` — **right shift**: divide by `2ᵏ` (floor for non-negatives).",
        ),
        viz("bits", { variant: "and", title: "Apply a bit operation column by column" }),
        heading("Standard bit tricks"),
        prose(
          "```cpp\nx & (1 << i)        // test bit i (non-zero if set)\nx | (1 << i)        // set bit i\nx & ~(1 << i)       // clear bit i\nx ^ (1 << i)        // toggle bit i\nx & -x              // lowest set bit (as a value)\nx & (x - 1)         // clear the lowest set bit\nx && !(x & (x - 1)) // is x a power of two?\n__builtin_popcount(x) // number of set bits (GCC)\n```",
        ),
        derive(
          [
            step("x - 1 flips the lowest set bit and everything below it", "e.g. 10110 - 1 = 10101."),
            step("x & (x - 1) clears exactly that lowest set bit", "10110 & 10101 = 10100."),
            step("repeat until x == 0 to count set bits", "Loops once per set bit — Kernighan's trick."),
          ],
          "popcount in O(set bits)",
          "Why x & (x-1) works",
        ),
        viz("bits", { variant: "lowbit", title: "x & -x isolates the lowest set bit" }),
        heading("XOR superpowers"),
        prose(
          "XOR is its own inverse (`a ^ a = 0`, `a ^ 0 = a`), so it **cancels pairs**. That solves \"find the element that appears once\", swapping without a temp, and parity/prefix-XOR problems. Counting set bits with the `i >> 1` recurrence is a tiny DP (see the problems).",
        ),
        callout(
          "warning",
          "Mind the type width: shifting by ≥ the type's bit count is undefined in C++, and `1 << 31` overflows a 32-bit `int` — use `1LL << k` for big shifts. In Python, integers are arbitrary precision, so there's no overflow but also no fixed width.",
        ),
        problem("single-number"),
        problem("counting-bits"),
        callout(
          "note",
          "Using the bits of an integer to represent a **subset** powers **bitmask DP** — covered in the [Dynamic programming](/learn/dynamic-programming/bitmask-dp) chapter (assignment problem and Travelling Salesman).",
        ),
      ],
    ),
  ],
);
