import type { Problem } from "../types";

export const mathProblems: Problem[] = [
  {
    id: "gcd",
    title: "Greatest Common Divisor",
    topic: "math",
    difficulty: "easy",
    summary: "Euclid's algorithm: gcd(a, b) = gcd(b, a mod b).",
    statement: `Return the **greatest common divisor** of non-negative integers \`a\` and \`b\`.
Euclid's insight: any common divisor of \`a\` and \`b\` also divides \`a mod b\`, so
\`gcd(a, b) = gcd(b, a mod b)\`, and \`gcd(x, 0) = x\`.`,
    funcName: "gcd",
    starter: `def gcd(a, b):
    # Return the greatest common divisor of a and b
    pass
`,
    examples: [
      { input: [48, 18], expected: 6, explain: "48 = 2·18 + 12, 18 = 1·12 + 6, 12 = 2·6 + 0." },
      { input: [7, 5], expected: 1 },
    ],
    tests: [
      { input: [0, 5], expected: 5 },
      { input: [100, 10], expected: 10 },
      { input: [17, 17], expected: 17 },
      { input: [270, 192], expected: 6 },
    ],
    hints: [
      "Repeatedly replace (a, b) with (b, a mod b).",
      "Stop when b becomes 0; a is the gcd.",
    ],
    solution: `def gcd(a, b):
    while b:
        a, b = b, a % b
    return a
`,
    complexity: { time: "O(log min(a,b))", space: "O(1)" },
    lesson: "/learn/math/number-theory",
    tags: ["math", "number theory", "euclid"],
  },
  {
    id: "count-primes",
    title: "Count Primes",
    topic: "math",
    difficulty: "medium",
    summary: "How many primes are strictly less than n? — the sieve.",
    statement: `Return the number of prime numbers **strictly less than** \`n\`. Trial-dividing
each number is slow; the **Sieve of Eratosthenes** marks composites in
\`O(n log log n)\`.`,
    funcName: "count_primes",
    starter: `def count_primes(n):
    # Number of primes strictly less than n
    pass
`,
    examples: [
      { input: [10], expected: 4, explain: "2, 3, 5, 7." },
      { input: [2], expected: 0 },
    ],
    tests: [
      { input: [0], expected: 0 },
      { input: [3], expected: 1 },
      { input: [20], expected: 8 },
      { input: [100], expected: 25 },
    ],
    hints: [
      "Make a boolean array is_prime[0..n-1], all true except 0 and 1.",
      "For each prime p (while p² < n), cross out p², p²+p, … as composite.",
      "Count the entries still marked prime.",
    ],
    solution: `def count_primes(n):
    if n < 3:
        return 0
    sieve = [True] * n
    sieve[0] = sieve[1] = False
    p = 2
    while p * p < n:
        if sieve[p]:
            for q in range(p * p, n, p):
                sieve[q] = False
        p += 1
    return sum(sieve)
`,
    complexity: { time: "O(n log log n)", space: "O(n)" },
    lesson: "/learn/math/primes-combinatorics",
    tags: ["math", "sieve", "primes"],
  },
  {
    id: "mod-pow",
    title: "Modular Exponentiation",
    topic: "math",
    difficulty: "medium",
    summary: "Compute base^exp mod m fast with binary exponentiation.",
    statement: `Compute \`base^exp mod m\` efficiently. Naively multiplying \`exp\` times is too
slow for large exponents; **binary exponentiation** squares the base and halves
the exponent, taking the modulus at every step to keep numbers small —
\`O(log exp)\`.`,
    funcName: "mod_pow",
    starter: `def mod_pow(base, exp, mod):
    # Return base**exp % mod in O(log exp)
    pass
`,
    examples: [
      { input: [2, 10, 1000], expected: 24, explain: "1024 mod 1000 = 24." },
      { input: [3, 0, 7], expected: 1, explain: "Anything^0 = 1." },
    ],
    tests: [
      { input: [2, 5, 100], expected: 32 },
      { input: [7, 256, 13], expected: 9 },
      { input: [10, 9, 1000000007], expected: 1000000000 },
      { input: [5, 117, 19], expected: 1 },
    ],
    hints: [
      "If the current exponent bit is 1, multiply it into the result.",
      "Square the base and shift the exponent right each step, always taking mod.",
      "Handle mod == 1 (everything is 0) and exp == 0 (result 1).",
    ],
    solution: `def mod_pow(base, exp, mod):
    if mod == 1:
        return 0
    result = 1
    base %= mod
    while exp > 0:
        if exp & 1:
            result = result * base % mod
        base = base * base % mod
        exp >>= 1
    return result
`,
    complexity: { time: "O(log exp)", space: "O(1)" },
    lesson: "/learn/math/primes-combinatorics",
    tags: ["math", "modular arithmetic"],
  },
  {
    id: "ncr-mod",
    title: "Binomial Coefficient mod p",
    topic: "math",
    difficulty: "hard",
    summary: "C(n, r) mod a prime, using factorials and a modular inverse.",
    statement: `Return \`C(n, r) mod p\` where \`p\` is **prime**. Division isn't allowed under a
modulus, so divide by the denominator using its **modular inverse**: by Fermat's
little theorem, \`x⁻¹ ≡ x^(p-2) (mod p)\`. Compute the numerator and denominator
mod \`p\`, then multiply by the inverse of the denominator.`,
    funcName: "ncr_mod",
    starter: `def ncr_mod(n, r, p):
    # Return C(n, r) % p, with p prime. Return 0 if r < 0 or r > n.
    pass
`,
    examples: [
      { input: [5, 2, 1000000007], expected: 10 },
      { input: [6, 3, 1000000007], expected: 20 },
    ],
    tests: [
      { input: [10, 0, 1000000007], expected: 1 },
      { input: [10, 10, 1000000007], expected: 1 },
      { input: [52, 5, 1000000007], expected: 2598960 },
      { input: [1000, 500, 1000000007], expected: 159835829 },
    ],
    hints: [
      "C(n,r) = n! / (r! (n-r)!). You can't divide under a modulus directly.",
      "Build numerator = n·(n-1)···(n-r+1) mod p and denominator = r! mod p.",
      "Multiply numerator by pow(denominator, p-2, p) (Fermat's little theorem).",
    ],
    solution: `def ncr_mod(n, r, p):
    if r < 0 or r > n:
        return 0
    num = 1
    den = 1
    for i in range(r):
        num = num * ((n - i) % p) % p
        den = den * ((i + 1) % p) % p
    return num * pow(den, p - 2, p) % p
`,
    complexity: { time: "O(r + log p)", space: "O(1)" },
    lesson: "/learn/math/primes-combinatorics",
    tags: ["math", "combinatorics", "modular inverse"],
  },
];
