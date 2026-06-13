import type { MatchFrame } from "@/lib/sims/matching";
import { cn } from "@/lib/cn";

const CELL = "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border font-mono text-sm transition-colors duration-150";

export function MatchCanvas({ frame }: { frame: MatchFrame | undefined }) {
  if (!frame) return null;
  const { text, pattern, offset, comparePos, matched, status, foundAt } = frame;

  return (
    <div className="w-full space-y-3">
      <div className="overflow-x-auto pb-1">
        <div className="inline-block min-w-full">
          {/* text row */}
          <div className="flex gap-1">
            {text.split("").map((ch, i) => {
              const inFound = foundAt.some((f) => i >= f && i < f + pattern.length);
              const isCompare = comparePos >= 0 && i === offset + comparePos;
              const inWindow = comparePos >= 0 && i >= offset && i < offset + matched;
              return (
                <div
                  key={i}
                  className={cn(
                    CELL,
                    isCompare
                      ? status === "mismatch"
                        ? "border-swap bg-swap/20 text-swap font-bold"
                        : "border-compare bg-compare/20 text-compare font-bold"
                      : inWindow || (status === "found" && i >= offset && i < offset + pattern.length)
                        ? "border-run/50 bg-run/15 text-run"
                        : inFound
                          ? "border-run/40 bg-run/10 text-run"
                          : "border-line bg-surface text-fg",
                  )}
                >
                  {ch}
                </div>
              );
            })}
          </div>
          {/* index ruler */}
          <div className="mt-0.5 flex gap-1">
            {text.split("").map((_, i) => (
              <span key={i} className="w-9 shrink-0 text-center font-mono text-[10px] text-subtle">{i}</span>
            ))}
          </div>
          {/* pattern row, shifted to offset */}
          {status !== "done" && (
            <div className="mt-1.5 flex gap-1" style={{ marginLeft: `calc(${offset} * 2.5rem)` }}>
              {pattern.split("").map((ch, j) => (
                <div
                  key={j}
                  className={cn(
                    CELL,
                    j === comparePos
                      ? status === "mismatch"
                        ? "border-swap bg-swap/20 text-swap font-bold"
                        : "border-compare bg-compare/20 text-compare font-bold"
                      : j < matched
                        ? "border-run/50 bg-run/15 text-run"
                        : "border-pivot/40 bg-pivot/10 text-fg",
                  )}
                >
                  {ch}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-wrap gap-x-3 gap-y-1.5">
        {[
          { label: "Comparing", cls: "bg-compare" },
          { label: "Matched", cls: "bg-run/60" },
          { label: "Mismatch", cls: "bg-swap" },
          { label: "Pattern", cls: "bg-pivot/40" },
        ].map((it) => (
          <span key={it.label} className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className={cn("h-2.5 w-2.5 rounded-sm", it.cls)} />
            {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}
