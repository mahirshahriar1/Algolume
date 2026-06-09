import { callout, chapter, derive, divider, heading, lesson, problem, prose, step } from "../builder";

export const competitiveProgramming = chapter(
  "competitive-programming",
  "Competitive programming intro",
  "The judge workflow, C to C++ bridge, constraint reading, submissions, verdicts, and templates.",
  "Terminal",
  [
    lesson(
      "what-cp-is",
      "What competitive programming is",
      "How online judges work, what Accepted means, and why constraints force algorithm choices.",
      8,
      [
        heading("Concept"),
        prose(
          "**Competitive programming** is algorithmic problem solving under a strict contract: read a statement, write a program, submit it to an online judge, and get a verdict. The judge runs your code on visible samples and hidden tests. You do not explain your idea to the judge; your program either produces exactly the required output for every case or it does not.",
        ),
        prose(
          "This is why CP is useful for learning algorithms. It makes the feedback loop honest. A solution that is elegant but too slow gets **TLE**. A solution that passes the samples but misses an edge case gets **WA**. A solution with the right idea but wrong integer type can still fail. The constraints are not decoration; they are the map to the intended complexity.",
        ),
        heading("The judge loop"),
        prose(
          "Most online judges follow the same flow:\n\n1. You choose a problem.\n2. You read the input/output format, constraints, and examples.\n3. You write a complete program in an allowed language.\n4. The judge compiles/runs it against many tests.\n5. You receive a verdict such as AC, WA, TLE, MLE, RE, or CE.",
        ),
        callout(
          "note",
          "**Accepted (AC)** means your program matched the official answers within the stated limits on the judge's test set. It does not mean your code is beautiful; it means it satisfied the contract.",
        ),
        heading("What makes CP different from normal exercises"),
        prose(
          "In a textbook exercise, the hard part is often proving the algorithm. In CP, the hard part is the whole chain: noticing the pattern, choosing data structures, bounding the complexity, translating the idea into bug-resistant code, and handling input exactly. The judge is strict because real software is strict too.",
        ),
        prose(
          "A good CP attempt is not 'I started coding quickly.' It is usually:\n\n- Restate the task in one sentence.\n- Identify input sizes and value ranges.\n- List edge cases before coding.\n- Choose the target complexity.\n- Write the simplest program that meets that bound.\n- Test samples, then make adversarial custom tests.",
        ),
        heading("Constraints decide the algorithm"),
        derive(
          [
            step("n <= 20", "Exponential subset search may be possible because 2^20 is about one million."),
            step("n <= 2,000", "O(n^2) can often pass; O(n^3) is usually risky."),
            step("n <= 100,000", "You usually need O(n), O(n log n), or close to it."),
            step("n <= 1,000,000", "Linear or near-linear work, careful memory, and fast I/O start to matter."),
          ],
          "Constraints are the first clue to the intended complexity",
          "Read limits before designing",
        ),
        callout(
          "intuition",
          "Think of the constraints as the problem setter whispering: 'Brute force is too slow here' or 'A quadratic DP is fine here.' Learn to hear that whisper.",
        ),
      ],
    ),
    lesson(
      "c-to-cpp-bridge",
      "C to C++ bridge",
      "The C++ tools students coming from C need first: streams, vector, string, pair, sort, references, lambdas, and STL containers.",
      14,
      [
        heading("Concept"),
        prose(
          "If you already know C, C++ is less a new universe than a sharper toolbox. You can still write loops, arrays, structs, and functions. The upgrade is that C++ gives you safer strings, dynamic arrays, standard containers, and algorithms that remove a lot of hand-written bookkeeping.",
        ),
        callout(
          "warning",
          "In CP, do not mix C and C++ styles casually unless you know the I/O rules. Prefer `cin`/`cout` with fast I/O enabled, or use `scanf`/`printf`; mixing can create confusing buffering behavior.",
        ),
        heading("Input and output"),
        prose(
          "`iostream` replaces most `scanf`/`printf` work. Add fast I/O at the top of `main` so streams are competitive with C-style I/O:",
        ),
        prose(
          "```cpp\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int n;\n    cin >> n;\n    vector<int> a(n);\n    for (int &x : a) cin >> x;\n\n    long long sum = 0;\n    for (int x : a) sum += x;\n    cout << sum << '\\n';\n}\n```",
        ),
        heading("What the fast I/O lines mean"),
        prose(
          "`ios::sync_with_stdio(false);` disconnects C++ streams (`cin`, `cout`) from C streams (`scanf`, `printf`). By default they are synchronized so mixing C and C++ I/O behaves predictably, but that safety costs time. Turning synchronization off makes `cin`/`cout` much faster. The tradeoff: after doing this, avoid mixing `scanf`/`printf` with `cin`/`cout` in the same program unless you deeply understand the buffering.",
        ),
        prose(
          "`cin.tie(nullptr);` removes the automatic flush of `cout` before every `cin`. Normally, C++ assumes an interactive conversation: before reading input, it flushes pending output so the prompt appears. Contest programs usually read from a file-like stream, not a human typing after a prompt, so the automatic flush is wasted work. If you write an interactive problem later, flush manually with `cout << flush` when the judge must see your output immediately.",
        ),
        callout(
          "note",
          "Use `\\n` for newlines in contest output. `endl` prints a newline **and flushes** the stream, which is usually unnecessary and can slow output-heavy programs.",
        ),
        heading("vector: the CP array"),
        prose(
          "`vector<T>` is a dynamic array. It stores elements contiguously like a C array, supports `O(1)` indexing, and grows when you `push_back`. You can pass it to functions, sort it, and ask for `v.size()` without manually tracking capacity.",
        ),
        prose(
          "```cpp\nvector<int> v;\nv.push_back(10);\nv.push_back(20);\ncout << v[0] << ' ' << v.size() << '\\n';\n\nvector<int> a(n, 0);   // n zeroes\nsort(a.begin(), a.end());\nreverse(a.begin(), a.end());\n```",
        ),
        heading("string, pair, and tuple"),
        prose(
          "`string` replaces manual C strings for most contest work. `pair` and `tuple` group small values without writing a struct every time.",
        ),
        prose(
          "```cpp\nstring s;\ncin >> s;\ncout << s.size() << ' ' << s.substr(0, 3) << '\\n';\n\npair<int, int> cell = {2, 5};\nauto [r, c] = cell;\n\nvector<pair<int, int>> edges;\nedges.push_back({u, v});\n```",
        ),
        heading("Prefer dynamic library types"),
        prose(
          "Coming from C, it is tempting to write `int a[100000]` or `char s[1000]` everywhere. In CP C++, prefer library types unless a problem has a very specific reason not to:",
        ),
        prose(
          "- Instead of static arrays, use [`std::vector`](https://www.geeksforgeeks.org/vector-in-cpp-stl/) in C++.\n- In Java, the matching everyday tool is [`ArrayList`](https://www.geeksforgeeks.org/arraylist-in-java/).\n- Instead of C strings (`char[]`, `char*`), use [`std::string`](https://www.geeksforgeeks.org/stdstring-class-in-c/) in C++.\n- In Java, when you build a string through many appends, use [`StringBuilder`](https://www.geeksforgeeks.org/stringbuilder-class-in-java-with-examples/).",
        ),
        callout(
          "intuition",
          "`vector` and `string` remember their own size, manage their own memory, and work with STL algorithms. That means fewer off-by-one bugs, fewer buffer bugs, and less manual bookkeeping while you are thinking about the algorithm.",
        ),
        heading("References and range-for"),
        prose(
          "A reference is an alias. Use `const T&` to avoid copying large values, and `T&` when you intentionally want to mutate the original.",
        ),
        prose(
          "```cpp\nvoid addOne(vector<int>& a) {\n    for (int &x : a) x++;\n}\n\nlong long sumOf(const vector<int>& a) {\n    long long total = 0;\n    for (int x : a) total += x;\n    return total;\n}\n```",
        ),
        heading("STL containers to learn early"),
        prose(
          "- `vector`: dynamic array, indexing, sorting, prefix sums.\n- `string`: text as a first-class type.\n- `set` / `map`: ordered keys, `O(log n)` operations.\n- `unordered_set` / `unordered_map`: hash tables, average `O(1)` operations.\n- `queue`, `stack`, `deque`: BFS, bracket matching, sliding windows.\n- `priority_queue`: always pull the current largest or smallest item.",
        ),
        heading("Algorithms and lambdas"),
        prose(
          "Many CP solutions become shorter and less buggy when you use standard algorithms. `sort`, `lower_bound`, `upper_bound`, `min`, `max`, `accumulate`, and `count` are worth learning early. For custom sorting, a lambda keeps the comparison beside the call:",
        ),
        prose(
          "```cpp\nvector<pair<int, int>> intervals;\nsort(intervals.begin(), intervals.end(), [](auto a, auto b) {\n    if (a.first != b.first) return a.first < b.first;\n    return a.second > b.second;\n});\n```",
        ),
        callout(
          "note",
          "`#include <bits/stdc++.h>` is accepted by many GNU C++ judges and is convenient in contests. For production C++, include only the headers you use. Algolume uses it in CP snippets because most beginner judges support GNU C++.",
        ),
      ],
    ),
    lesson(
      "read-the-statement",
      "Reading statements and constraints",
      "A repeatable workflow for turning problem text into edge cases, data structures, and a target Big-O.",
      10,
      [
        heading("Concept"),
        prose(
          "A problem statement is not just a story. It is a specification. The story gives context, but the important pieces are the input format, output format, constraints, examples, and hidden assumptions. Read it like an engineer reading an API contract.",
        ),
        heading("The five-pass reading workflow"),
        prose(
          "Use this workflow before coding:\n\n1. **Restate the task.** What exact value must be printed or returned?\n2. **Name the inputs.** What are the sizes and value ranges?\n3. **Find the complexity target.** What Big-O can fit?\n4. **List edge cases.** Empty, one item, duplicates, negative values, all equal, already sorted, disconnected graph, impossible answer.\n5. **Choose data structures.** Array, hash map, heap, stack, graph, DP table, or something else.",
        ),
        heading("From constraints to Big-O"),
        prose(
          "Rough mental limits are enough most of the time. A judge that allows one or two seconds often tolerates around `10^7` to `10^8` simple operations in C++, less in Python. The exact number varies, but the categories are stable:",
        ),
        prose(
          "- `n <= 20`: subsets, bitmasks, backtracking, `O(2^n)` might work.\n- `n <= 500`: `O(n^3)` can be reasonable.\n- `n <= 2,000`: `O(n^2)` is plausible.\n- `n <= 100,000`: aim for `O(n log n)` or `O(n)`.\n- `n <= 1,000,000`: usually `O(n)` and memory-aware.",
        ),
        derive(
          [
            step("n = 100,000 and O(n^2)", "That is 10^10 pair checks, far too many."),
            step("sort + scan", "Sorting costs O(n log n), then one linear pass."),
            step("hash map scan", "If order is not needed, one pass can often be O(n) average."),
          ],
          "The constraints decide whether brute force survives",
          "A common upgrade path",
        ),
        heading("Reading examples correctly"),
        prose(
          "Examples are not tests to memorize; they are small explanations of the input/output contract. Trace them by hand. Ask what would change if the array had one item, if the target was absent, if the graph had no path, if values were negative, or if multiple answers were possible.",
        ),
        heading("Hidden tests and edge cases"),
        prose(
          "Hidden tests usually cover exactly the cases beginners skip: boundaries, maximum sizes, repeated values, empty structures, overflow, and impossible cases. Before submitting, write your own tiny tests and your own stressful tests.",
        ),
        callout(
          "warning",
          "Do not let the samples define your algorithm. Samples are small by design. The constraints tell you whether the algorithm scales.",
        ),
        problem("running-sum"),
        problem("binary-search"),
      ],
    ),
    lesson(
      "first-problem-walkthroughs",
      "First problem walkthroughs",
      "Three classic beginner judge problems, solved by reading the statement contract carefully.",
      14,
      [
        heading("Concept"),
        prose(
          "Beginner CP problems often look tiny, but they teach the real workflow: translate the statement into a condition, identify the edge case, and print exactly what the judge expects. The following three are good first problems because each teaches a different habit.",
        ),
        heading("Codeforces 4A — Watermelon"),
        prose(
          "[Codeforces 4A](https://codeforces.com/problemset/problem/4/A) asks whether a watermelon of weight `w` can be split into two **positive even** parts. The key is that an even number can be written as even + even, but `2` is the trap: `2 = 0 + 2`, and zero is not a positive part.",
        ),
        derive(
          [
            step("w must be even", "Odd total weight cannot be the sum of two even integers."),
            step("w must be greater than 2", "Both parts must be positive, so 2 cannot split into two positive even pieces."),
            step("answer = (w % 2 == 0 && w > 2)", "This single condition covers the full input range."),
          ],
          "Print YES iff w is even and w > 2",
          "Watermelon condition",
        ),
        prose(
          "```cpp\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int w;\n    cin >> w;\n    cout << ((w % 2 == 0 && w > 2) ? \"YES\" : \"NO\") << '\\n';\n    return 0;\n}\n```",
        ),
        heading("UVa 10055 — Hashmat the Brave Warrior"),
        prose(
          "[UVa 10055](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=996) is an input-until-EOF problem. Each line contains two army sizes; print their absolute difference. The important habits are: use `long long`, because values can be large, and loop while input succeeds.",
        ),
        prose(
          "```cpp\n#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    long long a, b;\n    while (cin >> a >> b) {\n        cout << llabs(a - b) << '\\n';\n    }\n    return 0;\n}\n```",
        ),
        callout(
          "note",
          "`while (cin >> a >> b)` is the standard C++ shape for UVa-style 'read until end of file' input. It stops cleanly when there is no complete next pair.",
        ),
        heading("UVa 100 — The 3n + 1 Problem"),
        prose(
          "[UVa 100](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=36) gives pairs `i j`. For every number between them, compute its Collatz cycle length, then print the original `i j` and the maximum cycle length in that inclusive range. The input order may be reversed, so preserve the original pair for output but iterate from `min(i, j)` to `max(i, j)`.",
        ),
        derive(
          [
            step("n even -> n / 2", "The next Collatz value halves an even number."),
            step("n odd -> 3n + 1", "Odd values jump upward before eventually falling."),
            step("cycle length counts visited values including 1", "Start length at 1, then stop once n becomes 1."),
            step("scan all n in [min(i,j), max(i,j)]", "The beginner solution is direct simulation over the range."),
          ],
          "maximum cycle length over the inclusive interval",
          "Simulation contract",
        ),
        prose(
          "```cpp\n#include <bits/stdc++.h>\nusing namespace std;\n\nint cycleLength(long long n) {\n    int len = 1;\n    while (n != 1) {\n        if (n % 2 == 0) n /= 2;\n        else n = 3 * n + 1;\n        len++;\n    }\n    return len;\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int i, j;\n    while (cin >> i >> j) {\n        int lo = min(i, j);\n        int hi = max(i, j);\n        int best = 0;\n        for (int n = lo; n <= hi; n++) {\n            best = max(best, cycleLength(n));\n        }\n        cout << i << ' ' << j << ' ' << best << '\\n';\n    }\n    return 0;\n}\n```",
        ),
        callout(
          "warning",
          "UVa 100 is old-school: the output format is part of the problem. Print the original `i j`, not the sorted `lo hi` pair.",
        ),
        divider(),
        heading("Blogs and resources"),
        prose(
          "Keep a small resource shelf. You do not need to read everything at once; use these when a lesson or problem points you toward a specific topic.",
        ),
        prose(
          "- [NSUPS Blogs & Articles](https://nsups.org/blogs): North South University's problem solver's community writing on getting started, bit manipulation, number theory, graphs, and contest practice.\n- [cp-algorithms](https://cp-algorithms.com/index.html): a dense reference for algorithms used in contests, including number theory, DP, strings, graphs, geometry, and data structures.\n- [USACO Guide CP resources](https://usaco.guide/general/resources-cp): curated practice sites, books, learning paths, and reference material for competitive programming.\n- [Forthright48 CPPS 101](https://forthright48.com/p-cpps-101/): a topic roadmap with many number theory, combinatorics, and contest-analysis notes.\n- [GeeksforGeeks `std::vector`](https://www.geeksforgeeks.org/vector-in-cpp-stl/) and [`std::string`](https://www.geeksforgeeks.org/stdstring-class-in-c/): quick refreshers for C++ library types.\n- [GeeksforGeeks `ArrayList`](https://www.geeksforgeeks.org/arraylist-in-java/) and [`StringBuilder`](https://www.geeksforgeeks.org/stringbuilder-class-in-java-with-examples/): Java equivalents for dynamic arrays and efficient mutable strings.",
        ),
      ],
    ),
    lesson(
      "submit-and-debug",
      "Submitting, verdicts, and templates",
      "How to compile locally, run samples, interpret judge verdicts, and keep a clean CP template.",
      12,
      [
        heading("Concept"),
        prose(
          "A submission is a full program, not just an idea. Your local loop should be boring and repeatable: compile, run samples, test custom cases, then submit. When the verdict is not Accepted, use the verdict to narrow the failure instead of guessing wildly.",
        ),
        heading("Local compile and run"),
        prose(
          "A simple terminal loop for GNU C++ looks like this:",
        ),
        prose(
          "```bash\ng++ -std=c++17 -O2 -Wall -Wextra -pedantic main.cpp -o main\n./main < input.txt\n```",
        ),
        prose(
          "On Windows PowerShell the executable is usually `./main.exe` after compilation. Keep a small `input.txt` with the sample and a few custom cases so you can rerun quickly.",
        ),
        heading("Common verdicts"),
        prose(
          "- **AC**: Accepted; output matched on all judge tests.\n- **WA**: Wrong Answer; logic, edge case, formatting, or overflow problem.\n- **TLE**: Time Limit Exceeded; asymptotic complexity or constant factors are too high.\n- **MLE**: Memory Limit Exceeded; arrays/tables/graphs are too large.\n- **RE**: Runtime Error; out-of-bounds, division by zero, recursion overflow, invalid access.\n- **CE**: Compilation Error; syntax, missing include, wrong language version, or unsupported feature.",
        ),
        heading("Debugging without hidden tests"),
        prose(
          "When you cannot see the failing input, build your own. Generate tiny cases and compare your optimized solution against a brute force solution. This is called stress testing, and it is one of the fastest ways to catch hidden-case bugs.",
        ),
        prose(
          "```cpp\n// Sketch: compare fast(a) with brute(a) on many small random arrays.\nfor (int seed = 1; seed <= 10000; seed++) {\n    vector<int> a = makeSmallRandomCase(seed);\n    if (fast(a) != brute(a)) {\n        cerr << \"Mismatch on seed \" << seed << '\\n';\n        print(a);\n        break;\n    }\n}\n```",
        ),
        heading("A clean beginner template"),
        prose(
          "Keep the template small. A template should remove ceremony, not hide your solution.",
        ),
        prose(
          "```cpp\n#include <bits/stdc++.h>\nusing namespace std;\n\nusing ll = long long;\n\nvoid solve() {\n    int n;\n    cin >> n;\n    vector<ll> a(n);\n    for (ll &x : a) cin >> x;\n\n    // Write the actual idea here.\n}\n\nint main() {\n    ios::sync_with_stdio(false);\n    cin.tie(nullptr);\n\n    int tc = 1;\n    // cin >> tc; // uncomment when the statement has multiple test cases\n    while (tc--) solve();\n    return 0;\n}\n```",
        ),
        heading("Habits that prevent common failures"),
        prose(
          "- Use `long long` for sums, products, counts, and distances unless you are sure `int` is enough.\n- Print exactly what the statement asks: spaces, newlines, case labels.\n- Reset per-test-case data inside `solve()`.\n- Avoid global arrays sized from guesses; size them from constraints.\n- Assert invariants locally, then remove noisy debug output before submitting.\n- For modular arithmetic, normalize negative values with `(x % MOD + MOD) % MOD`.",
        ),
        callout(
          "intuition",
          "Most WA fixes are not heroic insights. They are careful contracts: right type, right boundary, right output, right reset between test cases.",
        ),
        problem("two-sum"),
        problem("valid-parentheses"),
      ],
    ),
  ],
);
