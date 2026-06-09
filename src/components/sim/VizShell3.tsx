import { Link } from "react-router-dom";
import { BookOpen } from "lucide-react";
import type { ReactNode } from "react";
import type { Player } from "@/lib/usePlayer";
import { PlaybackControls } from "@/components/PlaybackControls";
import { CodePanel } from "@/components/CodePanel";

/**
 * Shared 3-pane layout for the dedicated visualizer pages — the same shape as
 * the Sorting/Pathfinding pages: customization on the left, the visualization
 * in the middle (with the transport), and the synced code on the right.
 */
export function VizShell3<T extends { caption?: string; lines?: number[] }>({
  controls,
  canvas,
  player,
  code,
  complexity,
  lesson,
  stats,
}: {
  controls: ReactNode;
  canvas: ReactNode;
  player: Player<T>;
  code: string[];
  complexity?: { label: string; value: string }[];
  lesson?: string;
  stats?: { label: string; value: string | number }[];
}) {
  const current = player.current;
  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
      {/* Left — customization */}
      <aside className="space-y-5 lg:col-span-3">
        {controls}
        {complexity && (
          <section className="panel p-4">
            <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-subtle">Complexity</h2>
            <dl className="grid grid-cols-3 gap-2">
              {complexity.map((c) => (
                <div key={c.label} className="text-center">
                  <dd className="font-mono text-base font-bold text-fg">{c.value}</dd>
                  <dt className="text-[10px] text-subtle">{c.label}</dt>
                </div>
              ))}
            </dl>
          </section>
        )}
        {lesson && (
          <Link to={lesson} className="card card-hover flex items-center gap-2 p-4">
            <BookOpen className="h-5 w-5 shrink-0 text-run" />
            <span>
              <span className="block font-display text-sm font-semibold">Read the lesson</span>
              <span className="block text-xs text-muted">The full explanation + derivations.</span>
            </span>
          </Link>
        )}
      </aside>

      {/* Middle — visualization + transport */}
      <main className="space-y-4 lg:col-span-6">
        <div className="card flex min-h-[20rem] items-center justify-center overflow-hidden p-4 sm:min-h-[24rem]">
          {canvas}
        </div>
        {stats && stats.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {stats.map((s) => (
              <div key={s.label} className="panel flex items-baseline gap-1.5 px-3 py-1.5">
                <span className="font-mono text-sm font-bold tabular-nums text-fg">{s.value}</span>
                <span className="text-[11px] text-subtle">{s.label}</span>
              </div>
            ))}
          </div>
        )}
        <div className="panel flex min-h-[52px] items-center gap-3 px-4 py-3">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-run/15 text-[11px] font-bold text-run tabular-nums">
            {player.index}
          </span>
          <p className="text-sm text-fg">{current?.caption}</p>
        </div>
        <PlaybackControls player={player} />
      </main>

      {/* Right — code */}
      <aside className="lg:col-span-3">
        <CodePanel code={code} activeLines={current?.lines ?? []} className="lg:sticky lg:top-20" />
      </aside>
    </div>
  );
}
