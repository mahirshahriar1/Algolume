import { callout, chapter, derive, divider, heading, lesson, problem, prose, step, viz } from "../builder";

export const mathForAlgorithms = chapter(
  "math",
  "Math for algorithms",
  "The number theory and combinatorics that show up in contests: gcd, modular arithmetic, primes, and nCr.",
  "Sigma",
  [
    lesson(
      "number-theory",
      "Divisibility, GCD & modular arithmetic",
      "Euclid's algorithm, LCM, and arithmetic that stays inside a modulus.",
      11,
      [
        heading("GCD and Euclid's algorithm"),
        prose(
          "The **greatest common divisor** `gcd(a, b)` is the largest integer dividing both. Euclid's algorithm uses one fact: every common divisor of `a` and `b` also divides `a mod b`. So `gcd(a, b) = gcd(b, a mod b)`, shrinking the numbers until one hits `0`.",
        ),
        derive(
          [
            step("gcd(a, b) = gcd(b, a mod b)", "Common divisors are preserved by the remainder."),
            step("the remainder strictly shrinks", "0 ≤ a mod b < b."),
            step("it reaches gcd(x, 0) = x", "Terminates in O(log min(a,b)) steps."),
          ],
          "O(log min(a, b))",
          "Why Euclid is fast",
        ),
        prose(
          "```cpp\nlong long gcd(long long a, long long b) {\n    while (b) { a %= b; swap(a, b); }\n    return a;\n}\nlong long lcm(long long a, long long b) {\n    return a / gcd(a, b) * b;   // divide first to avoid overflow\n}\n```",
        ),
        callout(
          "intuition",
          "`lcm(a, b) = a·b / gcd(a, b)`. Divide by the gcd **before** multiplying so the intermediate product doesn't overflow.",
        ),
        heading("Modular arithmetic"),
        prose(
          "Many problems ask for an answer \"modulo `m`\" (often a large prime like `1e9 + 7`) because exact values would be astronomically large. Addition and multiplication play nicely with the modulus:",
        ),
        prose(
          "```\n(a + b) mod m = ((a mod m) + (b mod m)) mod m\n(a · b) mod m = ((a mod m) · (b mod m)) mod m\n```",
        ),
        callout(
          "warning",
          "Take the modulus **as you go**, not at the end, or the numbers overflow. In C++, a product of two values near `1e9` overflows 32-bit `int` and even risks `long long` — cast to `long long` before multiplying. **Division does not distribute over a modulus** — that needs a modular inverse (next lesson).",
        ),
        heading("Negative mod"),
        prose(
          "In C++ and Java, `(-7) % 3` is `-1`, not `2`. When you need a non-negative residue, use `((x % m) + m) % m`. Python's `%` already returns a non-negative result for positive `m`.",
        ),
        problem("gcd"),
      ],
    ),
    lesson(
      "primes-combinatorics",
      "Primes, fast power & combinatorics",
      "Sieve of Eratosthenes, binary exponentiation, modular inverse, and nCr mod p.",
      12,
      [
        heading("Sieve of Eratosthenes"),
        prose(
          "To find all primes up to `n`, start with every number marked prime, then for each prime `p` cross out its multiples `p², p²+p, …`. What remains unmarked is prime. It runs in `O(n log log n)`.",
        ),
        prose(
          "```cpp\nvector<bool> sieve(int n) {\n    vector<bool> is_prime(n + 1, true);\n    is_prime[0] = is_prime[1] = false;\n    for (int p = 2; (long long)p * p <= n; p++)\n        if (is_prime[p])\n            for (int q = p * p; q <= n; q += p)\n                is_prime[q] = false;\n    return is_prime;\n}\n```",
        ),
        viz("sieve", { title: "Sieve of Eratosthenes — cross out each prime's multiples" }),
        callout(
          "note",
          "Why start at `p²`? Every smaller multiple of `p` (like `2p`, `3p`) already has a smaller prime factor and was crossed out earlier.",
        ),
        problem("count-primes"),
        heading("Binary (fast) exponentiation"),
        prose(
          "Computing `base^exp` by multiplying `exp` times is `O(exp)`. **Square the base and halve the exponent** instead: if the current exponent bit is 1, fold the base into the result. That's `O(log exp)` multiplications — essential for big exponents under a modulus.",
        ),
        derive(
          [
            step("base^exp: square base, halve exp", "exp in binary drives the multiplications."),
            step("multiply into result when a bit is 1", "At most log₂ exp folds."),
            step("take mod at every multiply", "Keeps values bounded."),
          ],
          "O(log exp)",
          "Exponentiation by squaring",
        ),
        prose(
          "```cpp\nlong long mod_pow(long long b, long long e, long long m) {\n    long long r = 1 % m; b %= m;\n    while (e) {\n        if (e & 1) r = r * b % m;\n        b = b * b % m;\n        e >>= 1;\n    }\n    return r;\n}\n```",
        ),
        heading("Modular inverse"),
        prose(
          "You can't divide under a modulus directly, but you can **multiply by the inverse**. When `m` is prime, **Fermat's little theorem** gives `a^(m-1) ≡ 1 (mod m)`, so `a⁻¹ ≡ a^(m-2) (mod m)` — compute it with `mod_pow(a, m-2, m)`.",
        ),
        heading("Combinatorics mod a prime"),
        prose(
          "`C(n, r) = n! / (r!·(n-r)!)`. Under a prime modulus, compute the numerator and denominator mod `p`, then multiply by the **modular inverse** of the denominator. Precomputing factorials and inverse factorials answers many queries in `O(1)` each.",
        ),
        heading("Extended Euclid & the general inverse"),
        prose(
          "The **extended Euclidean algorithm** finds integers `x, y` with `a·x + b·y = gcd(a, b)`. When `gcd(a, m) = 1`, that `x` (mod `m`) is the **modular inverse** of `a` — and unlike Fermat's trick, it works for **any** modulus, not just primes.",
        ),
        prose(
          "```cpp\n// returns gcd; sets x, y so that a*x + b*y = gcd(a, b)\nlong long ext_gcd(long long a, long long b, long long& x, long long& y) {\n    if (b == 0) { x = 1; y = 0; return a; }\n    long long x1, y1;\n    long long g = ext_gcd(b, a % b, x1, y1);\n    x = y1; y = x1 - (a / b) * y1;\n    return g;\n}\n```",
        ),
        heading("More number theory to know"),
        prose(
          "- **Euler's totient** `φ(n)` counts integers in `1..n` coprime to `n`; `a^φ(n) ≡ 1 (mod n)` generalises Fermat.\n- **Chinese Remainder Theorem (CRT)** reconstructs a value from its residues modulo pairwise-coprime moduli.\n- **Factorisation & divisors** — trial division to `√n`, or factor fast with a sieve of smallest prime factors; the divisor-count/sum are multiplicative over the prime factorisation.",
        ),
        callout(
          "complexity",
          "Sieve `O(n log log n)`; fast power and a single inverse `O(log p)`; one `C(n, r) mod p` is `O(r + log p)`, or `O(1)` with precomputed factorials.",
        ),
        divider(),
        heading("Number-theory resources"),
        prose(
          "- [cp-algorithms — Number Theory](https://cp-algorithms.com/algebra/): dense, reliable write-ups of the sieve, fast power, extended Euclid, modular inverse, CRT, Euler's totient, and more, with code.\n- [Forthright48 — CPPS 101](https://forthright48.com/p-cpps-101/): a number-theory-heavy CP roadmap with worked blog posts (also linked from the [CP intro](/learn/competitive-programming/first-problem-walkthroughs)).",
        ),
        problem("mod-pow"),
        problem("ncr-mod"),
      ],
    ),
  ],
);
