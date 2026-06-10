import { callout, chapter, heading, lesson, prose } from "../builder";

export const npHardness = chapter(
  "np-hardness",
  "NP-hardness & intractability",
  "The complexity landscape beyond Big-O: P, NP, NP-complete, reductions, and what to do when a problem is hard.",
  "Gauge",
  [
    lesson(
      "p-vs-np",
      "P, NP & verification",
      "What 'efficient' means, the difference between solving and checking, and the P vs NP question.",
      10,
      [
        heading("From cost to tractability"),
        prose(
          "Big-O told us how an algorithm's cost grows. Complexity theory asks a deeper question: for a given **problem**, does *any* efficient algorithm exist at all? \"Efficient\" is defined as **polynomial time** — `O(nᵏ)` for some constant `k`. Polynomial is the dividing line because polynomials compose and stay manageable, while exponential (`2ⁿ`, `n!`) blows up past tiny inputs.",
        ),
        heading("Decision problems"),
        prose(
          "Complexity classes are usually phrased over **decision problems** — questions with a yes/no answer (\"is there a route shorter than `L`?\"). Optimisation problems (\"what is the shortest route?\") have an equivalent decision form, so this loses no generality.",
        ),
        heading("The class P"),
        prose(
          "**P** is the set of decision problems solvable in polynomial time. Sorting, shortest paths, matching, linear programming — anything you've written an `O(nᵏ)` algorithm for lives in P. These are the problems we consider \"tractable\".",
        ),
        heading("The class NP"),
        prose(
          "**NP** is the set of problems whose **yes-answers can be verified** in polynomial time, given a short \"certificate\" (a proposed solution). You might not be able to *find* a Sudoku solution quickly, but if someone hands you a filled grid you can *check* it fast. That's the essence of NP: **easy to check, maybe hard to find.**",
        ),
        callout(
          "intuition",
          "NP is not \"non-polynomial\" — it stands for **nondeterministic polynomial**. Every problem in P is also in NP (if you can solve it fast, you can check it fast). The open question is whether the reverse holds.",
        ),
        heading("P vs NP"),
        prose(
          "**Does P = NP?** — i.e., is every problem whose answer is easy to *check* also easy to *solve*? It is the most famous open question in computer science (and a \\$1M Millennium Prize). Almost everyone believes **P ≠ NP**: that some problems are genuinely hard to solve even though solutions are easy to verify. Nothing in this chapter depends on the answer — we just work as if P ≠ NP, because no polynomial algorithm is known for the hard problems below.",
        ),
      ],
    ),
    lesson(
      "np-complete-and-coping",
      "NP-complete, NP-hard & coping strategies",
      "Reductions, the hardest problems in NP, the famous examples, and what to do when you hit one.",
      12,
      [
        heading("Reductions"),
        prose(
          "A **reduction** transforms problem A into problem B in polynomial time so that an answer to B gives an answer to A. If A reduces to B, then B is **at least as hard** as A — a fast algorithm for B would give a fast algorithm for A. Reductions are how we *compare* hardness without solving anything.",
        ),
        heading("NP-complete"),
        prose(
          "A problem is **NP-complete** if it is in NP **and** every problem in NP reduces to it. These are the **hardest problems in NP**: solve one in polynomial time and you've solved *all* of NP (proving P = NP). **Cook–Levin** proved **SAT** (boolean satisfiability) is NP-complete; thousands of others were then shown NP-complete by reducing SAT (or a known NP-complete problem) to them.",
        ),
        prose(
          "Famous NP-complete problems: **SAT / 3-SAT**, the **Travelling Salesman** decision problem, **graph colouring**, **vertex cover**, **independent set**, **clique**, **subset-sum**, **knapsack** (decision), and **Hamiltonian cycle**.",
        ),
        heading("NP-hard"),
        prose(
          "**NP-hard** means \"at least as hard as every problem in NP\" — but **without** the requirement of being in NP itself. Every NP-complete problem is NP-hard; but NP-hard also includes problems that aren't even decision problems or aren't known to be in NP, such as the **optimisation** version of TSP (\"find the shortest tour\", which the [Held-Karp DP](/learn/dynamic-programming/bitmask-dp) solves only in exponential time) and the **halting problem** (which is undecidable, hence harder still).",
        ),
        callout(
          "note",
          "Quick map: **P ⊆ NP**. **NP-complete** = (in NP) ∩ (NP-hard). **NP-hard** is the broad \"≥ everything in NP\" region and reaches outside NP entirely.",
        ),
        heading("How to cope with an NP-hard problem"),
        prose(
          "Recognising a problem as NP-hard isn't defeat — it tells you to stop hunting for a fast exact general algorithm and pick a realistic strategy:",
        ),
        prose(
          "- **Exact but exponential** — fine for small `n`: bitmask DP (Held-Karp TSP, `O(2ⁿn²)`), branch and bound, meet-in-the-middle.\n- **Approximation algorithms** — provably within a factor of optimal (e.g. a 2-approximation for metric TSP via an MST).\n- **Heuristics / local search** — greedy, simulated annealing, genetic algorithms: no guarantee, but good in practice.\n- **Special cases / structure** — many NP-hard problems are polynomial on trees, planar graphs, or bounded-width inputs.\n- **Parameterised algorithms** — fast when some parameter `k` (not `n`) is small: `O(f(k)·nᶜ)`.\n- **ILP / SAT solvers** — modern solvers crush surprisingly large real instances despite worst-case hardness.",
        ),
        callout(
          "intuition",
          "Spotting NP-hardness early saves weeks. If a problem smells like \"choose a best subset/ordering/assignment with global constraints\", check whether it reduces from a known NP-complete problem before promising a polynomial solution.",
        ),
      ],
    ),
  ],
);
