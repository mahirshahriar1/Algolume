import { cn } from "@/lib/cn";

/**
 * Visual for the T(n) = 2T(n/2) + O(n) recurrence behind merge sort: each level
 * splits the problem in half but still touches n elements, and there are log₂ n
 * levels — so the total work is n × log n.
 */
export function RecursionTree({ variant = "merge", step = 5 }: { variant?: string; step?: number }) {
  void variant;
  const n = 8;
  const levels: number[][] = [];
  let row = [n];
  while (row[0] >= 1) {
    levels.push(row);
    if (row[0] === 1) break;
    row = row.flatMap((s) => [Math.floor(s / 2), Math.ceil(s / 2)]);
  }

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        {levels.map((level, i) => {
          const visible = i <= Math.max(0, step - 1);
          const active = i === Math.min(levels.length - 1, Math.max(0, step - 1));
          return (
          <div key={i} className="flex items-center gap-3">
            <span className="w-16 shrink-0 text-right font-mono text-[11px] text-subtle">
              level {i}
            </span>
            <div className="flex flex-1 gap-1">
              {level.map((s, k) => (
                <div
                  key={k}
                  className={cn(
                    "flex h-7 items-center justify-center rounded-md border font-mono text-xs font-semibold transition-all duration-300",
                    visible
                      ? active
                        ? "border-compare bg-compare text-white"
                        : "border-run/40 bg-run/15 text-fg"
                      : "border-line bg-elevated/30 text-subtle opacity-25",
                  )}
                  style={{ flexGrow: s, flexBasis: 0 }}
                >
                  {s}
                </div>
              ))}
            </div>
            <span className={cn("w-20 shrink-0 font-mono text-[11px]", visible ? "text-run" : "text-subtle opacity-40")}>
              {visible ? `= ${level.reduce((a, b) => a + b, 0)} work` : "pending"}
            </span>
          </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-2 rounded-lg bg-elevated/50 p-3 text-sm sm:grid-cols-3">
        <Fact label="Work per level" value={`O(n) = ${n}`} />
        <Fact label="Number of levels" value={`log₂ ${n} = ${Math.log2(n)}`} />
        <Fact label="Total" value="n × log n" accent />
      </div>

      <p className="text-sm text-muted">
        Every level merges all <span className="font-mono">{n}</span> elements once,
        and the splitting forms{" "}
        <span className="font-mono text-compare">log₂ n</span> levels. Multiply them:{" "}
        <span className="font-mono text-run">O(n log n)</span>.
      </p>
    </div>
  );
}

function Fact({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="text-center">
      <div className={cn("font-mono text-sm font-semibold", accent ? "text-run" : "text-fg")}>
        {value}
      </div>
      <div className="text-[11px] text-subtle">{label}</div>
    </div>
  );
}
