import { useEffect, useMemo, useState } from "react";
import { Check, Play } from "lucide-react";
import { SORT_BY_ID } from "@/lib/sorting";
import { PATH_BY_ID, OVERLAY } from "@/lib/pathfinding";
import { ArrayCanvas } from "@/components/ArrayCanvas";
import { CodePanel } from "@/components/CodePanel";
import { cn } from "@/lib/cn";

/** Loop an index 0..len-1 at a fixed fps — drives the auto-playing previews. */
function useLoop(len: number, fps: number): number {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (len <= 1) return;
    const t = window.setInterval(() => setI((p) => (p + 1) % len), 1000 / fps);
    return () => window.clearInterval(t);
  }, [len, fps]);
  return Math.min(i, Math.max(0, len - 1));
}

/* ---------------------------------------------------------------- *
 * Sorting bars — the hero illustration.
 * ---------------------------------------------------------------- */
export function SortBarsPreview() {
  const frames = useMemo(() => {
    const arr = [42, 18, 73, 9, 55, 27, 88, 34, 61, 12, 49, 80, 23, 67, 5, 38, 71, 16];
    return SORT_BY_ID["quick"].run(arr);
  }, []);
  const i = useLoop(frames.length, 16);
  return (
    <div className="flex h-full flex-col">
      <PreviewBar label="quick_sort.py" />
      <div className="min-h-0 flex-1 px-4 pb-4 pt-3">
        <ArrayCanvas frame={frames[i]} maxValue={88} showValues={false} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Mini pathfinding grid — BFS frontier sweeping around a wall.
 * ---------------------------------------------------------------- */
const G_ROWS = 9;
const G_COLS = 16;

function miniGrid(mode: "bfs" | "dfs") {
  const start = 4 * G_COLS + 2;
  const goal = 4 * G_COLS + 13;
  const walls = new Set<number>();
  for (let r = 0; r <= 6; r++) walls.add(r * G_COLS + 8); // vertical wall, bottom gap
  const frames = PATH_BY_ID[mode].run({
    rows: G_ROWS,
    cols: G_COLS,
    walls,
    start,
    goal,
  });
  return { start, goal, walls, frames };
}

function miniCellClass(
  idx: number,
  walls: Set<number>,
  start: number,
  goal: number,
  ov: number,
): string {
  if (idx === start) return "bg-run";
  if (idx === goal) return "bg-swap";
  if (walls.has(idx)) return "bg-fg";
  switch (ov) {
    case OVERLAY.FRONTIER:
      return "bg-compare/60";
    case OVERLAY.VISITED:
      return "bg-visited/45";
    case OVERLAY.CURRENT:
      return "bg-visited/45 ring-2 ring-inset ring-pivot";
    case OVERLAY.PATH:
      return "bg-pivot";
    default:
      return "bg-elevated";
  }
}

export function GridPreview({ mode = "bfs" }: { mode?: "bfs" | "dfs" }) {
  const { start, goal, walls, frames } = useMemo(() => miniGrid(mode), [mode]);
  const i = useLoop(frames.length, 14);
  const overlay = frames[i]?.overlay;
  return (
    <div className="flex h-full flex-col">
      <PreviewBar label={`${mode}.py — ${mode === "bfs" ? "layer expansion" : "depth-first wandering"}`} />
      <div className="flex min-h-0 flex-1 items-center px-4 pb-4 pt-3">
        <div
          className="grid w-full gap-[3px]"
          style={{ gridTemplateColumns: `repeat(${G_COLS}, minmax(0, 1fr))` }}
        >
          {Array.from({ length: G_ROWS * G_COLS }, (_, idx) => (
            <div
              key={idx}
              className={cn(
                "aspect-square rounded-[3px] transition-colors duration-150",
                miniCellClass(idx, walls, start, goal, overlay ? overlay[idx] : 0),
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Code playback — synced code + array + scrubber, the cartesian-style card.
 * ---------------------------------------------------------------- */
export function PlaybackPreview() {
  const frames = useMemo(() => {
    const arr = [5, 2, 8, 1, 9, 3, 7, 4];
    return SORT_BY_ID["bubble"].run(arr);
  }, []);
  const i = useLoop(frames.length, 6);
  const frame = frames[i];
  const total = Math.max(1, frames.length - 1);
  const progress = i / total;

  return (
    <div className="flex h-full flex-col">
      <PreviewBar label="bubble_sort.py — step playback" />
      <div className="space-y-3 p-4">
        <CodePanel
          code={SORT_BY_ID["bubble"].code}
          activeLines={frame?.lines ?? []}
          className="!rounded-lg !shadow-none"
        />
        {/* live variable chips */}
        <div className="flex flex-wrap gap-1.5">
          {frame?.vars &&
            Object.entries(frame.vars).map(([k, v]) => (
              <span
                key={k}
                className="rounded-md bg-elevated px-2 py-1 font-mono text-[11px] text-muted"
              >
                <span className="text-compare">{k}</span>
                <span className="text-subtle"> = </span>
                <span className="text-fg">{String(v)}</span>
              </span>
            ))}
        </div>
        {/* mini bars */}
        <div className="h-16">
          <ArrayCanvas frame={frame} maxValue={9} showValues />
        </div>
        {/* scrubber */}
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] text-subtle tabular-nums">
            {i}/{total}
          </span>
          <div className="relative h-1.5 flex-1 rounded-full bg-line">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-swap"
              style={{ width: `${progress * 100}%` }}
            />
            <div
              className="absolute top-1/2 h-3 w-3 -translate-y-1/2 rounded-[3px] bg-swap"
              style={{ left: `calc(${progress * 100}% - 6px)` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- *
 * Challenge mock — "Test Your Might". Static illustration of the planned
 * runnable-code challenge experience.
 * ---------------------------------------------------------------- */
export function ChallengePreview() {
  return (
    <div className="flex h-full flex-col">
      <PreviewBar label="two_sum — challenge" />
      <div className="space-y-3 p-4">
        <div className="rounded-lg border border-line bg-elevated p-3">
          <p className="font-display text-[15px] font-semibold text-fg">Two Sum</p>
          <p className="mt-1 text-xs text-muted">
            Return the indices of the two numbers that add up to{" "}
            <span className="font-mono text-fg">target</span>.
          </p>
        </div>
        <pre className="overflow-hidden rounded-lg border border-line bg-code px-3 py-2.5 font-mono text-[12px] leading-relaxed text-muted">
          <code>
            <span className="text-visited">def</span>{" "}
            <span className="text-compare">two_sum</span>(nums, target):
            {"\n  seen = {}"}
            {"\n  "}
            <span className="text-visited">for</span> i, n{" "}
            <span className="text-visited">in</span> enumerate(nums):
            {"\n    "}
            <span className="text-subtle"># your code here</span>
          </code>
        </pre>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-run">
            <Check className="h-3.5 w-3.5" />
            <span>6 / 6 test cases</span>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-run px-2.5 py-1.5 text-xs font-semibold text-white">
            <Play className="h-3 w-3 fill-current" />
            Run
          </span>
        </div>
      </div>
    </div>
  );
}

/* Shared little header bar with a filename, mimicking an editor tab. */
function PreviewBar({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between border-b border-line px-4 py-2.5">
      <div className="flex items-center gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-swap/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-pivot/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-run/70" />
      </div>
      <span className="font-mono text-[11px] text-subtle">{label}</span>
    </div>
  );
}
