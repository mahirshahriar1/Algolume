/**
 * Sieve of Eratosthenes visualization. Start with every number 2..n a candidate
 * prime; for each prime p, cross out its multiples p², p²+p, …. Whatever stays
 * unmarked is prime. Builders emit Frame[] for the shared player.
 */

export type SieveRole = "candidate" | "prime" | "composite" | "current" | "marking";

export interface SieveFrame {
  n: number;
  roles: SieveRole[]; // index 0..n (0 and 1 unused/blank)
  currentPrime: number;
  caption: string;
  lines: number[];
  stats?: { label: string; value: string | number }[];
}

export const SIEVE_LIMITS = { min: 10, max: 60 };

export const SIEVE_CODE = [
  "is_prime = [True] * (n + 1)",
  "is_prime[0] = is_prime[1] = False",
  "for p in range(2, int(n**0.5) + 1):",
  "    if is_prime[p]:",
  "        for q in range(p*p, n + 1, p):",
  "            is_prime[q] = False   # cross out multiples",
  "primes = [i for i in range(2, n+1) if is_prime[i]]",
];

export function buildSieveFrames(nRaw: number): SieveFrame[] {
  const n = Math.max(SIEVE_LIMITS.min, Math.min(SIEVE_LIMITS.max, Math.floor(nRaw)));
  const isPrime = Array(n + 1).fill(true);
  isPrime[0] = isPrime[1] = false;
  const frames: SieveFrame[] = [];

  const emit = (currentPrime: number, caption: string, lines: number[], marking: number = -1) => {
    const roles: SieveRole[] = Array.from({ length: n + 1 }, (_, i) => {
      if (i < 2) return "composite";
      if (i === marking) return "marking";
      if (i === currentPrime) return "current";
      if (!isPrime[i]) return "composite";
      // A still-unmarked number below the current prime can no longer be marked → prime.
      return currentPrime > 0 && i < currentPrime ? "prime" : "candidate";
    });
    frames.push({
      n,
      roles,
      currentPrime,
      caption,
      lines,
      stats: [
        { label: "p", value: currentPrime || "-" },
        { label: "Primes", value: roles.filter((r) => r === "prime" || r === "current").length },
      ],
    });
  };

  emit(0, `Every number from 2 to ${n} starts as a prime candidate.`, [1, 2]);
  for (let p = 2; p * p <= n; p++) {
    if (!isPrime[p]) continue;
    emit(p, `${p} is still unmarked, so it's prime. Cross out its multiples from ${p * p}.`, [3, 4]);
    for (let q = p * p; q <= n; q += p) {
      if (isPrime[q]) {
        isPrime[q] = false;
        emit(p, `Mark ${q} = ${p} × ${q / p} as composite.`, [5, 6], q);
      }
    }
  }
  // finalize roles: all remaining candidates are prime
  const finalRoles: SieveRole[] = Array.from({ length: n + 1 }, (_, i) =>
    i < 2 ? "composite" : isPrime[i] ? "prime" : "composite",
  );
  frames.push({
    n,
    roles: finalRoles,
    currentPrime: 0,
    caption: `Done — ${finalRoles.filter((r) => r === "prime").length} primes up to ${n}.`,
    lines: [7],
    stats: [{ label: "Primes", value: finalRoles.filter((r) => r === "prime").length }],
  });
  return frames;
}
