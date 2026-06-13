import { callout, chapter, derive, heading, lesson, problem, prose, step, viz } from "../builder";

export const strings = chapter(
  "strings",
  "Strings & pattern matching",
  "Find a pattern inside a text fast: the naive scan, KMP's failure function, and rolling hashes.",
  "Type",
  [
    lesson(
      "pattern-matching",
      "Pattern matching: the naive scan",
      "The substring-search problem and the straightforward O(n·m) sliding approach.",
      9,
      [
        heading("The problem"),
        prose(
          "**Pattern matching** asks: does a pattern `P` (length `m`) occur inside a text `T` (length `n`), and where? It's everywhere — search, find-and-replace, DNA matching, log scanning. A string is just an array of characters, so the array techniques you know apply.",
        ),
        heading("The naive algorithm"),
        prose(
          "Try every possible alignment: place `P` at each start index `i` of `T`, and compare characters left to right. On a mismatch, slide `P` one position right and start over.",
        ),
        prose(
          "```cpp\nfor (int i = 0; i + m <= n; i++) {\n    int j = 0;\n    while (j < m && text[i + j] == pattern[j]) j++;\n    if (j == m) record_match(i);\n}\n```",
        ),
        viz("matching", { variant: "naive", title: "Naive matching: slide by one on a mismatch" }),
        derive(
          [
            step("n − m + 1 alignments", "Each start index of the pattern."),
            step("up to m comparisons each", "Worst case like \"aaaa…\" vs \"aaab\"."),
            step("(n − m + 1) · m", "Multiply."),
          ],
          "O(n · m) worst case",
          "Why naive can be slow",
        ),
        callout(
          "warning",
          "The naive scan **re-checks characters it already matched** after a mismatch. On adversarial inputs (long runs of the same letter) it degrades to `O(n·m)`. KMP fixes exactly this waste.",
        ),
        problem("str-str"),
        problem("count-occurrences"),
      ],
    ),
    lesson(
      "kmp",
      "KMP & the failure function",
      "Never re-compare a matched prefix: precompute borders and skip in O(n + m).",
      12,
      [
        heading("The key idea"),
        prose(
          "When the naive scan mismatches after matching a prefix of `P`, it throws that work away. **KMP** (Knuth–Morris–Pratt) instead asks: *how much of what I just matched is also a prefix of `P`?* That overlap (a **border**) is exactly how far the pattern can safely slide without missing a match — so we never move the text pointer backward.",
        ),
        heading("The failure function (prefix function)"),
        prose(
          "For each position `i`, `π[i]` = the length of the **longest proper prefix** of `P[0..i]` that is also a **suffix** of it. It's precomputed in `O(m)` by matching the pattern against itself:",
        ),
        prose(
          "```cpp\nvector<int> prefix_function(const string& p) {\n    int m = p.size();\n    vector<int> pi(m, 0);\n    for (int i = 1, k = 0; i < m; i++) {\n        while (k > 0 && p[i] != p[k]) k = pi[k - 1];\n        if (p[i] == p[k]) k++;\n        pi[i] = k;\n    }\n    return pi;\n}\n```",
        ),
        heading("Matching with the table"),
        prose(
          "Scan the text once. Keep `j` = how many pattern characters currently match. On a mismatch, jump `j = π[j-1]` (slide the pattern using its border) instead of restarting. The text index never goes backward, so it's linear.",
        ),
        viz("matching", { variant: "kmp", title: "KMP: skip ahead with the failure function" }),
        derive(
          [
            step("build π in O(m)", "Self-match of the pattern."),
            step("scan text, i never moves back", "Each char advances i or shrinks j."),
            step("O(n) for the scan", "Amortised over j's increases/decreases."),
          ],
          "O(n + m) time, O(m) space",
          "KMP is linear",
        ),
        heading("Rolling hash (Rabin–Karp)"),
        prose(
          "Another approach: hash the pattern and every length-`m` window of the text. A **rolling hash** updates the window hash in `O(1)` as it slides (remove the leaving char, add the entering one), giving `O(n + m)` average time. Verify on a hash hit to avoid false positives. It generalises nicely to 2D and multi-pattern search.",
        ),
        callout(
          "intuition",
          "KMP's `π` is the same \"longest prefix that is also a suffix\" idea behind the **longest happy prefix** problem — borders show up across many string algorithms (Z-function, periodicity, automata).",
        ),
        problem("longest-happy-prefix"),
      ],
    ),
  ],
);
