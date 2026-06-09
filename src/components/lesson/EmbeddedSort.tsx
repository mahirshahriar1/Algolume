import { useEffect, useMemo, useState } from "react";
import { Shuffle } from "lucide-react";
import { SORT_ALGORITHMS, SORT_BY_ID } from "@/lib/sorting";
import { usePlayer } from "@/lib/usePlayer";
import { ArrayCanvas } from "@/components/ArrayCanvas";
import { CodePanel } from "@/components/CodePanel";
import { PlaybackControls } from "@/components/PlaybackControls";
import { Legend } from "@/components/Legend";
import { cn } from "@/lib/cn";

function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 96) + 5);
}

/**
 * Compact, self-contained sorting visualizer for embedding inside a lesson.
 * Reuses the same engine + controls as the standalone page, in a tighter
 * two-column layout (bars | code) that fits a reading column.
 */
export function EmbeddedSort({
  algo,
  size = 18,
}: {
  algo?: string;
  size?: number;
}) {
  const [algoId, setAlgoId] = useState(algo ?? "bubble");
  const [seed, setSeed] = useState(0);
  const [input, setInput] = useState(() => randomArray(size));

  useEffect(() => {
    setInput(randomArray(size));
  }, [size, seed]);

  const a = SORT_BY_ID[algoId];
  const frames = useMemo(() => a.run(input), [a, input]);
  const player = usePlayer(frames, 8);
  const current = player.current;
  const maxValue = useMemo(() => Math.max(...input, 1), [input]);
  const stats = current?.stats;

  return (
    <div className="space-y-4">
      {/* Algorithm pills + reshuffle */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1.5">
          {SORT_ALGORITHMS.map((s) => (
            <button
              key={s.id}
              onClick={() => setAlgoId(s.id)}
              className={cn(
                "rounded-lg px-2.5 py-1 text-xs font-medium transition-colors duration-150 cursor-pointer",
                s.id === algoId
                  ? "bg-run/15 text-fg ring-1 ring-run/40"
                  : "bg-elevated text-muted hover:bg-line/60",
              )}
            >
              {s.name.replace(" Sort", "")}
            </button>
          ))}
        </div>
        <button
          onClick={() => setSeed((s) => s + 1)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-line bg-elevated px-2.5 py-1 text-xs font-medium text-muted transition-colors hover:bg-line/60 cursor-pointer"
        >
          <Shuffle className="h-3.5 w-3.5" />
          Shuffle
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Bars + transport */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Legend />
          </div>
          <div className="h-44 sm:h-52">
            <ArrayCanvas frame={current} maxValue={maxValue} showValues={input.length <= 18} />
          </div>
          <PlaybackControls player={player} />
        </div>

        {/* Code + counters */}
        <div className="space-y-3">
          <CodePanel
            code={a.code}
            activeLines={current?.lines ?? []}
            className="max-h-64"
          />
          <div className="grid grid-cols-3 gap-2">
            <MiniStat label="Comparisons" value={stats?.comparisons ?? 0} />
            <MiniStat label="Swaps" value={stats?.swaps ?? 0} />
            <MiniStat label="Writes" value={stats?.writes ?? 0} />
          </div>
        </div>
      </div>

      {/* Caption */}
      <p className="text-sm text-muted">
        <span className="mr-2 font-mono text-xs text-run tabular-nums">
          {player.index}/{Math.max(0, frames.length - 1)}
        </span>
        {current?.caption}
      </p>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-line bg-elevated/50 p-2 text-center">
      <div className="font-mono text-base font-bold tabular-nums text-fg">{value}</div>
      <div className="text-[10px] text-subtle">{label}</div>
    </div>
  );
}
