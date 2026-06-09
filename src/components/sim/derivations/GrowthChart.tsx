import { useState } from "react";
import { cn } from "@/lib/cn";

const N = 16;
const MAX = N * N;

const FUNCS = [
  { key: "1", label: "O(1)", f: () => 1, stroke: "stroke-subtle", text: "text-subtle" },
  { key: "log", label: "O(log n)", f: (x: number) => Math.log2(x), stroke: "stroke-compare", text: "text-compare" },
  { key: "n", label: "O(n)", f: (x: number) => x, stroke: "stroke-run", text: "text-run" },
  { key: "nlogn", label: "O(n log n)", f: (x: number) => x * Math.log2(x), stroke: "stroke-pivot", text: "text-pivot" },
  { key: "n2", label: "O(n²)", f: (x: number) => x * x, stroke: "stroke-swap", text: "text-swap" },
];

const sx = (x: number) => 5 + ((x - 1) / (N - 1)) * 92;
const sy = (y: number) => 56 - (Math.min(y, MAX) / MAX) * 52;

/** Interactive plot of the common growth classes, with a draggable n. */
export function GrowthChart() {
  const [n, setN] = useState(8);

  return (
    <div className="space-y-3">
      <svg viewBox="0 0 100 60" className="h-56 w-full">
        {/* axes */}
        <line x1="5" y1="56" x2="97" y2="56" className="stroke-line" strokeWidth="0.5" />
        <line x1="5" y1="4" x2="5" y2="56" className="stroke-line" strokeWidth="0.5" />
        {/* n marker */}
        <line x1={sx(n)} y1="4" x2={sx(n)} y2="56" className="stroke-fg/30" strokeWidth="0.5" strokeDasharray="1.5 1.5" />
        {FUNCS.map((fn) => {
          const pts = [];
          for (let x = 1; x <= N; x += 0.5) pts.push(`${sx(x)},${sy(fn.f(x))}`);
          return <polyline key={fn.key} points={pts.join(" ")} fill="none" className={fn.stroke} strokeWidth="1.1" />;
        })}
        {FUNCS.map((fn) => (
          <circle key={fn.key} cx={sx(n)} cy={sy(fn.f(n))} r="1.1" className={cn(fn.stroke, "fill-base")} strokeWidth="0.8" />
        ))}
        <text x="96" y="59.5" textAnchor="end" className="fill-subtle" style={{ fontSize: 3 }}>n →</text>
      </svg>

      <div>
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="text-muted">n</span>
          <span className="font-mono text-fg">{n}</span>
        </div>
        <input
          type="range"
          min={1}
          max={N}
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
          aria-label="n"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line accent-run"
        />
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 sm:grid-cols-3">
        {FUNCS.map((fn) => (
          <div key={fn.key} className="flex items-center justify-between gap-2">
            <span className={cn("flex items-center gap-1.5 text-xs font-medium", fn.text)}>
              <span className={cn("h-0.5 w-3 rounded-full", fn.stroke.replace("stroke-", "bg-"))} />
              {fn.label}
            </span>
            <span className="font-mono text-xs text-muted">{Math.round(fn.f(n))}</span>
          </div>
        ))}
      </div>
      <p className="text-xs text-subtle">
        At n = {n} the classes barely differ — but watch how <span className="text-swap">O(n²)</span> pulls away as you drag n right. That gap is everything at scale.
      </p>
    </div>
  );
}
