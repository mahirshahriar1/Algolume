import { useState } from "react";
import { cn } from "@/lib/cn";

/**
 * Visual proof that 1 + 2 + … + n = n(n+1)/2 ≈ ½n². A staircase of filled cells
 * fills (just over) half of an n×n square — so a nested shrinking loop is O(n²).
 */
export function SumTriangle() {
  const [n, setN] = useState(6);
  const sum = (n * (n + 1)) / 2;
  const square = n * n;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start gap-6">
        <div
          className="grid gap-0.5"
          style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`, width: `min(${n * 26}px, 100%)` }}
        >
          {Array.from({ length: n * n }, (_, idx) => {
            const row = Math.floor(idx / n);
            const col = idx % n;
            const filled = col <= row; // staircase: row r has r+1 cells
            return (
              <div
                key={idx}
                className={cn(
                  "aspect-square rounded-[2px] border",
                  filled ? "border-run/40 bg-run/70" : "border-line bg-elevated",
                )}
              />
            );
          })}
        </div>

        <dl className="space-y-2 text-sm">
          <Row label="Filled cells (1+2+…+n)" value={`${sum}`} accent="text-run" />
          <Row label="Full square (n²)" value={`${square}`} accent="text-muted" />
          <Row label="Ratio filled / square" value={`${(sum / square).toFixed(2)}`} accent="text-pivot" />
        </dl>
      </div>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted">n</span>
          <span className="font-mono text-fg">{n}</span>
        </div>
        <input
          type="range"
          min={2}
          max={12}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          aria-label="n"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-run"
        />
      </div>

      <p className="text-sm text-muted">
        The staircase is{" "}
        <span className="font-mono text-run">n(n+1)/2</span> cells — and as n grows
        the ratio settles toward <span className="font-mono text-pivot">½</span>. Half
        of <span className="font-mono">n²</span> is still{" "}
        <span className="font-mono text-swap">O(n²)</span>.
      </p>
    </div>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent: string }) {
  return (
    <div className="flex items-center justify-between gap-6">
      <dt className="text-muted">{label}</dt>
      <dd className={cn("font-mono font-semibold", accent)}>{value}</dd>
    </div>
  );
}
