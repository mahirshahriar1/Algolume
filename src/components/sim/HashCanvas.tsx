import type { HashFrame } from "@/lib/sims/hash";
import { cn } from "@/lib/cn";

/** Renders one HashFrame: numbered buckets, each holding a chain of entries. */
export function HashCanvas({ frame }: { frame: HashFrame | undefined }) {
  if (!frame) return null;
  return (
    <div className="w-full space-y-1.5">
      {frame.formula && (
        <div className="mb-2 text-center font-mono text-sm text-pivot">{frame.formula}</div>
      )}
      {frame.buckets.map((bucket, i) => (
        <div key={i} className="flex items-center gap-2">
          <div
            className={cn(
              "flex h-9 w-9 shrink-0 items-center justify-center rounded-md border font-mono text-xs font-semibold transition-colors duration-200",
              i === frame.active ? "border-pivot bg-pivot/15 text-pivot" : "border-line bg-elevated text-subtle",
            )}
          >
            {i}
          </div>
          <div className="flex flex-1 items-center gap-1.5">
            {bucket.length === 0 ? (
              <span className="text-xs text-subtle">—</span>
            ) : (
              bucket.map((e, k) => (
                <div key={k} className="flex items-center gap-1.5">
                  <span
                    className={cn(
                      "flex h-9 min-w-9 items-center justify-center rounded-md border px-2 font-mono text-sm font-semibold transition-colors duration-200",
                      e.hl === "match"
                        ? "border-run bg-run text-white"
                        : e.hl === "active"
                          ? "border-pivot bg-pivot text-white"
                          : e.isNew
                            ? "border-run bg-run text-white"
                            : "border-line bg-surface text-fg",
                    )}
                  >
                    {e.value}
                  </span>
                  {k < bucket.length - 1 && <span className="text-subtle">→</span>}
                </div>
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
