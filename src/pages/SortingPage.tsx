import { useEffect, useMemo, useState } from "react";
import { Shuffle, BarChart3, ArrowUpDown, Repeat, Hash, CornerDownLeft } from "lucide-react";
import { SORT_ALGORITHMS, SORT_BY_ID } from "@/lib/sorting";
import { usePlayer, useTransportKeys } from "@/lib/usePlayer";
import { ArrayCanvas } from "@/components/ArrayCanvas";
import { CodePanel } from "@/components/CodePanel";
import { PlaybackControls } from "@/components/PlaybackControls";
import { Legend } from "@/components/Legend";
import { cn } from "@/lib/cn";

/** Generate a fresh random array of n values in [5, 100]. */
function randomArray(n: number): number[] {
  return Array.from({ length: n }, () => Math.floor(Math.random() * 96) + 5);
}

const SIZES = [10, 20, 35, 50];

export function SortingPage() {
  const [algoId, setAlgoId] = useState("bubble");
  const [size, setSize] = useState(20);
  const [seed, setSeed] = useState(0); // bump to reshuffle
  const [input, setInput] = useState(() => randomArray(20));
  const [custom, setCustom] = useState("");

  /** Parse "5, 2, 8 ..." into a clamped value array and use it. */
  const applyCustom = () => {
    const nums = custom
      .split(/[\s,]+/)
      .map((t) => parseInt(t, 10))
      .filter((n) => Number.isFinite(n))
      .slice(0, 60)
      .map((n) => Math.max(1, Math.min(100, n)));
    if (nums.length >= 2) setInput(nums);
    setCustom("");
  };

  const algo = SORT_BY_ID[algoId];

  // Recompute the input array whenever size changes or the user reshuffles.
  useEffect(() => {
    setInput(randomArray(size));
  }, [size, seed]);

  // All frames are derived purely from (algorithm, input) — memoized so we only
  // recompute when one of those actually changes.
  const frames = useMemo(() => algo.run(input), [algo, input]);
  const player = usePlayer(frames, 6);
  useTransportKeys(player);

  const current = player.current;
  const maxValue = useMemo(() => Math.max(...input, 1), [input]);
  const stats = current?.stats;

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
      {/* Header */}
      <div className="mb-6 flex flex-col gap-1">
        <div className="flex items-center gap-2 text-sm font-medium text-run">
          <BarChart3 className="h-4 w-4" />
          Sorting
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
          {algo.name}
        </h1>
        <p className="max-w-2xl text-sm text-muted">{algo.blurb}</p>
      </div>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left column: controls */}
        <aside className="lg:col-span-3 space-y-5">
          <section className="panel p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
              Algorithm
            </h2>
            <div className="space-y-1.5">
              {SORT_ALGORITHMS.map((a) => (
                <button
                  key={a.id}
                  onClick={() => setAlgoId(a.id)}
                  className={cn(
                    "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition-colors duration-150 cursor-pointer",
                    a.id === algoId
                      ? "bg-run/15 text-fg ring-1 ring-run/40"
                      : "text-muted hover:bg-elevated",
                  )}
                >
                  <span className="font-medium">{a.name}</span>
                  <span className="font-mono text-[11px] text-subtle">
                    {a.complexity.time}
                  </span>
                </button>
              ))}
            </div>
          </section>

          <section className="panel p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
              Input
            </h2>
            <label className="mb-1.5 block text-xs text-muted">Array size</label>
            <div className="mb-4 flex overflow-hidden rounded-lg border border-line/60">
              {SIZES.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={cn(
                    "flex-1 py-1.5 font-mono text-xs transition-colors duration-150 cursor-pointer",
                    s === size
                      ? "bg-run text-base font-semibold"
                      : "bg-elevated text-muted hover:bg-line/60",
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSeed((s) => s + 1)}
              className="btn-ghost w-full"
            >
              <Shuffle className="h-4 w-4" />
              Shuffle array
            </button>

            <label className="mb-1.5 mt-4 block text-xs text-muted">Or type your own</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  value={custom}
                  onChange={(e) => setCustom(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && applyCustom()}
                  placeholder="5, 2, 8, 1, 9"
                  className="h-9 w-full rounded-lg border border-line bg-surface pl-2.5 pr-7 font-mono text-xs text-fg
                    placeholder:text-subtle focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run/50"
                />
                <CornerDownLeft className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-subtle" />
              </div>
              <button onClick={applyCustom} className="btn-primary px-3 py-1.5 text-xs">
                Use
              </button>
            </div>
            <p className="mt-1.5 text-[11px] text-subtle">Comma or space separated, values 1–100.</p>
          </section>

          <section className="panel p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
              Complexity
            </h2>
            <dl className="space-y-2 text-sm">
              <Row label="Time" value={algo.complexity.time} />
              <Row label="Space" value={algo.complexity.space} />
              <Row
                label="Stable"
                value={algo.complexity.stable ? "Yes" : "No"}
              />
            </dl>
          </section>
        </aside>

        {/* Center column: visualization + transport */}
        <main className="lg:col-span-6 space-y-5">
          <div className="panel relative flex h-[340px] flex-col p-4 sm:h-[420px]">
            <div className="mb-3 flex items-center justify-between">
              <Legend />
              <span className="font-mono text-xs text-subtle">
                n = {input.length}
              </span>
            </div>
            <div className="min-h-0 flex-1">
              <ArrayCanvas
                frame={current}
                maxValue={maxValue}
                showValues={input.length <= 20}
              />
            </div>
          </div>

          {/* Caption / step description */}
          <div className="panel flex min-h-[52px] items-center gap-3 px-4 py-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-run/15 text-[11px] font-bold text-run tabular-nums">
              {player.index}
            </span>
            <p className="text-sm text-fg">
              {current?.caption ?? "Press play to begin."}
            </p>
          </div>

          <PlaybackControls player={player} />

          {/* Operation counters */}
          <div className="grid grid-cols-3 gap-3">
            <Stat
              icon={<ArrowUpDown className="h-4 w-4" />}
              label="Comparisons"
              value={stats?.comparisons ?? 0}
            />
            <Stat
              icon={<Repeat className="h-4 w-4" />}
              label="Swaps"
              value={stats?.swaps ?? 0}
            />
            <Stat
              icon={<Hash className="h-4 w-4" />}
              label="Writes"
              value={stats?.writes ?? 0}
            />
          </div>
        </main>

        {/* Right column: code + live state */}
        <aside className="lg:col-span-3 space-y-5">
          <CodePanel
            code={algo.code}
            activeLines={current?.lines ?? []}
            className="lg:sticky lg:top-20"
          />

          <section className="panel p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">
              Variables
            </h2>
            {current?.vars && Object.keys(current.vars).length > 0 ? (
              <dl className="space-y-1.5 font-mono text-[13px]">
                {Object.entries(current.vars).map(([k, v]) => (
                  <div
                    key={k}
                    className="flex items-center justify-between rounded-md bg-elevated/60 px-2.5 py-1.5"
                  >
                    <dt className="text-compare">{k}</dt>
                    <dd className="text-fg">{v}</dd>
                  </div>
                ))}
              </dl>
            ) : (
              <p className="text-xs text-subtle">No active variables.</p>
            )}
          </section>
        </aside>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-muted">{label}</dt>
      <dd className="font-mono text-fg">{value}</dd>
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="panel flex flex-col items-center justify-center gap-1 p-3 text-center">
      <span className="text-subtle">{icon}</span>
      <span className="font-mono text-xl font-bold tabular-nums text-fg">
        {value}
      </span>
      <span className="text-[11px] text-subtle">{label}</span>
    </div>
  );
}
