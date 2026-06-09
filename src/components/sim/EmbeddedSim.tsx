import type { ReactNode } from "react";
import { usePlayer } from "@/lib/usePlayer";
import { PlaybackControls } from "@/components/PlaybackControls";
import { CodePanel } from "@/components/CodePanel";

/**
 * Generic embeddable simulation: takes precomputed frames + a renderer, and
 * wires up the shared player + transport. When `code` is supplied it renders a
 * synced code panel beside the canvas (the frame's `lines` light up) — the same
 * side-by-side feel as the sorting/pathfinding pages.
 */
export function EmbeddedSim<T extends { caption: string; lines?: number[] }>({
  frames,
  render,
  code,
  speed = 3,
  height = "h-52",
  autoPlay = false,
  loop = false,
}: {
  frames: T[];
  render: (frame: T | undefined) => ReactNode;
  code?: string[];
  speed?: number;
  height?: string;
  autoPlay?: boolean;
  loop?: boolean;
}) {
  const player = usePlayer(frames, speed, autoPlay, loop);
  const current = player.current;
  return (
    <div className="space-y-3">
      <div className={code ? "grid gap-4 md:grid-cols-2" : ""}>
        <div className={`flex items-center justify-center overflow-x-auto ${height}`}>
          {render(current)}
        </div>
        {code && (
          <CodePanel code={code} activeLines={current?.lines ?? []} className="md:max-h-[280px]" />
        )}
      </div>
      <div className="flex min-h-[2.5rem] items-center gap-2 rounded-lg bg-elevated/50 px-3 py-2">
        <span className="font-mono text-[11px] text-run tabular-nums">
          {player.index}/{Math.max(0, frames.length - 1)}
        </span>
        <p className="text-sm text-fg">{current?.caption}</p>
      </div>
      <PlaybackControls player={player} />
    </div>
  );
}
