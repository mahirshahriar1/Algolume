import {
  ChevronFirst,
  ChevronLast,
  Pause,
  Play,
  RotateCcw,
  SkipBack,
  SkipForward,
} from "lucide-react";
import type { Player } from "@/lib/usePlayer";
import { cn } from "@/lib/cn";

const SPEEDS = [2, 4, 6, 12, 24, 48];

/**
 * Transport bar: scrub timeline + step/play controls + speed.
 * Works with any `Player<T>` instance, so it's shared across visualizers.
 */
export function PlaybackControls<T>({
  player,
  className,
}: {
  player: Player<T>;
  className?: string;
}) {
  const { index, frames, isPlaying, atStart, atEnd, speed } = player;
  const total = Math.max(0, frames.length - 1);

  return (
    <div className={cn("panel p-3 sm:p-4", className)}>
      {/* Scrub timeline */}
      <div className="flex items-center gap-3">
        <span className="font-mono text-xs tabular-nums text-muted w-20 shrink-0">
          {index} / {total}
        </span>
        <input
          type="range"
          min={0}
          max={total}
          value={index}
          onChange={(e) => player.seek(Number(e.target.value))}
          aria-label="Scrub through steps"
          className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-line/70
            accent-run [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4
            [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:appearance-none
            [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-run"
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <button
            className="btn-icon"
            onClick={player.restart}
            disabled={atStart}
            aria-label="Restart"
            title="Restart"
          >
            <ChevronFirst className="h-5 w-5" />
          </button>
          <button
            className="btn-icon"
            onClick={player.stepBack}
            disabled={atStart}
            aria-label="Step back"
            title="Step back"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          <button
            className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-run
              text-base shadow-lg shadow-run/20 transition-transform duration-150 cursor-pointer
              hover:bg-run/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-run
              focus-visible:ring-offset-2 focus-visible:ring-offset-surface"
            onClick={player.toggle}
            aria-label={isPlaying ? "Pause" : "Play"}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? (
              <Pause className="h-6 w-6 fill-current" />
            ) : (
              <Play className="h-6 w-6 translate-x-0.5 fill-current" />
            )}
          </button>

          <button
            className="btn-icon"
            onClick={player.stepForward}
            disabled={atEnd}
            aria-label="Step forward"
            title="Step forward"
          >
            <SkipForward className="h-4 w-4" />
          </button>
          <button
            className="btn-icon"
            onClick={() => player.seek(total)}
            disabled={atEnd}
            aria-label="Jump to end"
            title="Jump to end"
          >
            <ChevronLast className="h-5 w-5" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <RotateCcw className="h-4 w-4 text-subtle" />
          <span className="text-xs font-medium text-muted">Speed</span>
          <div className="flex overflow-hidden rounded-lg border border-line/60">
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => player.setSpeed(s)}
                className={cn(
                  "px-2.5 py-1 font-mono text-xs transition-colors duration-150 cursor-pointer",
                  s === speed
                    ? "bg-run text-base font-semibold"
                    : "bg-elevated text-muted hover:bg-line/60",
                )}
                aria-pressed={s === speed}
              >
                {s}×
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
