import { cn } from "@/lib/cn";
import { CopyButton } from "./CopyButton";

/**
 * Read-only source view with the currently-executing line(s) highlighted —
 * the panel stays in lock-step with the visualization as you scrub.
 */
export function CodePanel({
  code,
  activeLines,
  language = "python",
  className,
}: {
  code: string[];
  activeLines: number[];
  language?: string;
  className?: string;
}) {
  const active = new Set(activeLines);
  return (
    <div className={cn("panel overflow-hidden flex flex-col", className)}>
      <div className="flex items-center justify-between border-b border-line/60 px-4 py-2.5">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-swap/70" />
          <span className="h-3 w-3 rounded-full bg-pivot/70" />
          <span className="h-3 w-3 rounded-full bg-run/70" />
        </div>
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs uppercase tracking-wider text-subtle">
            {language}
          </span>
          <CopyButton text={code.join("\n")} />
        </div>
      </div>
      <pre className="overflow-auto bg-code py-2 font-mono text-[13px] leading-relaxed">
        <code>
          {code.map((line, i) => {
            const lineNo = i + 1;
            const isActive = active.has(lineNo);
            return (
              <div
                key={i}
                className={cn(
                  "flex px-3 transition-colors duration-150",
                  isActive
                    ? "bg-run/15 border-l-2 border-run"
                    : "border-l-2 border-transparent",
                )}
              >
                <span
                  className={cn(
                    "mr-4 w-6 shrink-0 select-none text-right tabular-nums",
                    isActive ? "text-run" : "text-subtle",
                  )}
                >
                  {lineNo}
                </span>
                <span
                  className={cn(
                    "whitespace-pre",
                    isActive ? "text-fg" : "text-muted",
                  )}
                >
                  {line || " "}
                </span>
              </div>
            );
          })}
        </code>
      </pre>
    </div>
  );
}
