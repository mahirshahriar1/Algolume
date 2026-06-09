import { callout, chapter, derive, heading, lesson, prose, step, viz } from "../builder";

export const recursion = chapter(
  "recursion",
  "Recursion",
  "Functions that call themselves — base cases, the call stack, and trees of calls.",
  "Repeat",
  [
    lesson(
      "recursion-basics",
      "Recursion & the call stack",
      "Base case, recursive case, and how each call lives on the stack until it returns.",
      8,
      [
        prose(
          "A **recursive** function solves a problem by calling itself on a smaller version of the same problem. Every recursion needs two parts: a **base case** that stops the recursion, and a **recursive case** that makes progress toward it.",
        ),
        heading("The three-question checklist"),
        prose(
          "Before trusting a recursive function, ask:\n\n- **What is the smallest input I can answer immediately?** That is the base case.\n- **How does each call make the problem smaller?** That is the progress measure.\n- **How do smaller answers combine into the current answer?** That is the return step.\n\nIf any one of these is vague, the recursion is probably wrong.",
        ),
        prose(
          "```\ndef factorial(n):\n    if n == 0:        # base case\n        return 1\n    return n * factorial(n - 1)   # recursive case\n```",
        ),
        derive(
          [
            step("factorial(4)", "Needs 4 × factorial(3)."),
            step("factorial(3)", "Needs 3 × factorial(2)."),
            step("factorial(2)", "Needs 2 × factorial(1)."),
            step("factorial(1)", "Needs 1 × factorial(0)."),
            step("factorial(0) = 1", "Base case returns, then the stack unwinds."),
          ],
          "4 × 3 × 2 × 1 = 24",
          "Factorial goes down first, then returns upward",
        ),
        callout(
          "warning",
          "Forget the base case (or never approach it) and the recursion never stops — you get infinite recursion and a **stack overflow**.",
        ),
        prose(
          "Each call gets its own **stack frame** holding its local variables. Calls **push** on the way down and **pop** (returning a value) on the way back up — last in, first out, exactly like a stack:",
        ),
        viz("recursion", { variant: "factorial", title: "Call stack — push on call, pop on return" }),
        heading("Another small example: sum an array"),
        prose(
          "A recursive sum peels off one item and asks the smaller question: what is the sum of the rest?\n\n```\ndef sum_array(a, i=0):\n    if i == len(a):\n        return 0\n    return a[i] + sum_array(a, i + 1)\n```\nThere are `n` calls, each does constant work, so time is `O(n)`. The call stack also reaches depth `n`, so auxiliary space is `O(n)`.",
        ),
        callout(
          "intuition",
          "Anything you can do with a loop you can do with recursion, and vice-versa. Recursion shines when the problem is naturally self-similar — trees, divide-and-conquer, backtracking.",
        ),
        heading("When recursion branches"),
        prose(
          "When a function makes **two** recursive calls (like merge sort, or naive Fibonacci), the calls branch into a **tree** — and the shape of that tree is exactly what the complexity derivations in the sorting chapter measured.",
        ),
        viz("recursion", { variant: "divide", title: "Two recursive calls branch into a tree" }),
        callout(
          "complexity",
          "One recursive call per level usually forms a **chain**. Multiple recursive calls per level form a **tree**. Chain depth controls stack space; tree size controls time.",
        ),
      ],
    ),
    lesson(
      "divide-and-conquer",
      "Divide & conquer",
      "Split a problem, solve smaller copies, and combine the answers with recurrence maths.",
      9,
      [
        prose(
          "**Divide and conquer** is recursion with a particular shape: split the input into smaller independent pieces, solve each piece recursively, then combine their answers. The pattern is powerful because the recursion tree often has only `log n` levels.",
        ),
        heading("The template"),
        prose(
          "```\ndef divide_conquer(problem):\n    if small(problem):\n        return solve_directly(problem)\n    left, right = split(problem)\n    a = divide_conquer(left)\n    b = divide_conquer(right)\n    return combine(a, b)\n```",
        ),
        callout(
          "intuition",
          "Binary search divides and keeps **one** half. Merge sort divides and solves **both** halves. That one difference changes the recurrence from `T(n)=T(n/2)+O(1)` to `T(n)=2T(n/2)+O(n)`.",
        ),
        viz("recursion", { variant: "divide", title: "The recursion tree for T(n)=2T(n/2)+n" }),
        heading("Merge sort recurrence"),
        derive(
          [
            step("T(n) = 2T(n/2) + cn", "Two half-sized recursive sorts, then a linear merge."),
            step("level 0 work = cn", "One problem of size n."),
            step("level 1 work = 2 × c(n/2) = cn", "Two half-sized problems still total n work."),
            step("every level costs cn", "The subproblem sizes across a level add to n."),
            step("number of levels = log₂ n", "Halve until size 1."),
            step("cn log₂ n + O(n leaves)", "Leaves add linear work, dominated by n log n."),
          ],
          "T(n) = O(n log n)",
          "Why merge sort is n log n",
        ),
        heading("The quick Master Theorem intuition"),
        prose(
          "For recurrences of the form `T(n)=aT(n/b)+f(n)`, compare the combine work `f(n)` to `n^{log_b a}`:\n\n- If `f(n)` is smaller, the leaves dominate.\n- If `f(n)` is the same size, every level contributes equally → multiply by `log n`.\n- If `f(n)` is larger, the root/combine work dominates.\n\nFor merge sort, `a=2`, `b=2`, so `n^{log₂2}=n`; combine work is also `n`, so the answer is `O(n log n)`.",
        ),
        callout(
          "warning",
          "Divide-and-conquer is not automatically fast. If subproblems overlap heavily, plain recursion repeats work. That is where dynamic programming enters: remember solved subproblems instead of recomputing them.",
        ),
      ],
    ),
    lesson(
      "backtracking",
      "Backtracking",
      "Explore choices, and undo them when they hit a dead end.",
      7,
      [
        prose(
          "**Backtracking** is recursion that **explores choices and undoes them**. At each step you try an option, recurse, and if it leads nowhere you *backtrack* — rewind the choice and try the next. It's how you solve mazes, N-Queens, Sudoku, and generate permutations.",
        ),
        heading("Permutation example"),
        prose(
          "To generate permutations, choose one unused item for the current slot, recurse, then unchoose it before trying the next item:\n\n```\ndef permute(path, remaining):\n    if not remaining:\n        output(path); return\n    for x in remaining:\n        path.append(x)\n        permute(path, remaining - {x})\n        path.pop()\n```\nFor `n` items there are `n!` complete arrangements, so the output alone is factorial-sized. Backtracking is powerful, but it is not magic.",
        ),
        prose(
          "```\ndef solve(state):\n    if complete(state):\n        record(state); return\n    for choice in options(state):\n        apply(choice)     # try\n        solve(state)      # recurse\n        undo(choice)      # backtrack\n```",
        ),
        callout(
          "intuition",
          "Backtracking is a **depth-first search of the decision tree**. Pruning — abandoning a branch the moment it can't work — is what keeps it from exploring everything.",
        ),
        prose(
          "Each path from root to leaf in that decision tree is one full attempt; the branching is exactly the recursion tree from the last lesson.",
        ),
        viz("recursion", { variant: "backtracking", title: "The decision tree backtracking explores" }),
        heading("Pruning example"),
        prose(
          "In N-Queens, you do not place a queen and wait until the whole board is full to check. The moment a queen attacks another queen, that partial board can never become valid, so the recursion returns immediately. That early return is **pruning**: fewer branches, same correct answer.",
        ),
        callout(
          "warning",
          "Without pruning, backtracking is exponential — `O(bᵈ)` for branching factor `b` and depth `d`. Good constraints prune most branches early.",
        ),
      ],
    ),
  ],
);
