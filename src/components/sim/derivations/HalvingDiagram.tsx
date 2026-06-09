import { useState } from "react";

/**
 * Visual for O(log n): repeatedly halve n until 1. The number of bars (steps)
 * is ⌈log₂ n⌉ — so halving the work each step gives a logarithmic cost.
 */
export function HalvingDiagram() {
  const [exp, setExp] = useState(5); // n = 2^exp
  const n = 2 ** exp;

  const sizes: number[] = [];
  let cur = n;
  while (cur >= 1) {
    sizes.push(cur);
    cur = Math.floor(cur / 2);
    if (cur < 1) break;
  }
  const steps = sizes.length;

  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        {sizes.map((s, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-10 shrink-0 text-right font-mono text-xs text-subtle">
              step {i + 1}
            </span>
            <div className="h-5 flex-1">
              <div
                className="flex h-full items-center rounded-md bg-compare/70 px-2 font-mono text-[11px] font-semibold text-white transition-all duration-300"
                style={{ width: `${(s / n) * 100}%`, minWidth: "2.5rem" }}
              >
                {s}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted">n = 2^{exp}</span>
          <span className="font-mono text-fg">{n}</span>
        </div>
        <input
          type="range"
          min={1}
          max={10}
          value={exp}
          onChange={(e) => setExp(Number(e.target.value))}
          aria-label="n"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-compare"
        />
      </div>

      <p className="text-sm text-muted">
        Halving <span className="font-mono">{n}</span> down to 1 takes{" "}
        <span className="font-mono text-compare">{steps}</span> steps —and{" "}
        <span className="font-mono">log₂ {n} = {Math.log2(n)}</span>. That's why
        halving each step is <span className="font-mono text-compare">O(log n)</span>.
      </p>
    </div>
  );
}
