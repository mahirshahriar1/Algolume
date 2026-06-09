import type { Highlight, SortFrame } from "@/lib/types";
import { cn } from "@/lib/cn";

const BAR_COLORS: Record<Highlight, string> = {
  default: "bg-bar",
  compare: "bg-compare",
  swap: "bg-swap",
  pivot: "bg-pivot",
  sorted: "bg-run",
  range: "bg-visited/70",
};

/**
 * Renders one SortFrame as a bar chart. Bars are positioned with flex and
 * sized by value; colour encodes the semantic role at this step. Heights/colours
 * transition smoothly so stepping between frames reads as motion.
 */
export function ArrayCanvas({
  frame,
  maxValue,
  showValues,
}: {
  frame: SortFrame | undefined;
  maxValue: number;
  showValues: boolean;
}) {
  if (!frame) return null;
  const n = frame.array.length;
  return (
    <div className="flex h-full w-full items-end gap-[2px] sm:gap-1" role="img" aria-label="Array bars">
      {frame.array.map((value, i) => {
        const role = frame.highlights[i] ?? "default";
        const heightPct = (value / maxValue) * 100;
        return (
          <div
            key={i}
            className="flex h-full flex-1 flex-col justify-end"
            style={{ minWidth: 2 }}
          >
            <div
              className={cn(
                "w-full rounded-t-[3px] transition-[height,background-color] duration-200 ease-out",
                BAR_COLORS[role],
                role === "swap" && "shadow-[0_0_12px_-1px] shadow-swap/60",
                role === "compare" && "shadow-[0_0_12px_-1px] shadow-compare/60",
              )}
              style={{ height: `${heightPct}%` }}
            />
            {showValues && n <= 30 && (
              <span className="mt-1 text-center font-mono text-[10px] text-muted tabular-nums">
                {value}
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}
