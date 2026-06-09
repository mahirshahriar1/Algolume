import { useEffect, useRef } from "react";
import type { GridFrame } from "@/lib/pathfinding";
import { OVERLAY } from "@/lib/pathfinding";
import { cn } from "@/lib/cn";

type DragMode = "wall" | "erase" | "start" | "goal" | null;

interface Props {
  rows: number;
  cols: number;
  walls: Set<number>;
  start: number;
  goal: number;
  frame: GridFrame | undefined;
  onSetWall: (idx: number, wall: boolean) => void;
  onMoveStart: (idx: number) => void;
  onMoveGoal: (idx: number) => void;
}

/** Class for a single cell given its static role + overlay state. */
function cellClass(
  idx: number,
  walls: Set<number>,
  start: number,
  goal: number,
  overlay: number,
): string {
  if (idx === start) return "bg-run";
  if (idx === goal) return "bg-swap";
  if (walls.has(idx)) return "bg-fg";
  switch (overlay) {
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

export function GridCanvas({
  rows,
  cols,
  walls,
  start,
  goal,
  frame,
  onSetWall,
  onMoveStart,
  onMoveGoal,
}: Props) {
  const mode = useRef<DragMode>(null);

  // End any drag when the mouse is released anywhere.
  useEffect(() => {
    const up = () => (mode.current = null);
    window.addEventListener("mouseup", up);
    return () => window.removeEventListener("mouseup", up);
  }, []);

  const idxFromEvent = (e: React.MouseEvent): number | null => {
    const el = (e.target as HTMLElement).closest("[data-idx]") as HTMLElement | null;
    return el ? Number(el.dataset.idx) : null;
  };

  const handleDown = (e: React.MouseEvent) => {
    const idx = idxFromEvent(e);
    if (idx == null) return;
    e.preventDefault();
    if (idx === start) {
      mode.current = "start";
    } else if (idx === goal) {
      mode.current = "goal";
    } else if (walls.has(idx)) {
      mode.current = "erase";
      onSetWall(idx, false);
    } else {
      mode.current = "wall";
      onSetWall(idx, true);
    }
  };

  const handleOver = (e: React.MouseEvent) => {
    if (!mode.current) return;
    const idx = idxFromEvent(e);
    if (idx == null) return;
    switch (mode.current) {
      case "wall":
        if (idx !== start && idx !== goal) onSetWall(idx, true);
        break;
      case "erase":
        onSetWall(idx, false);
        break;
      case "start":
        if (idx !== goal && !walls.has(idx)) onMoveStart(idx);
        break;
      case "goal":
        if (idx !== start && !walls.has(idx)) onMoveGoal(idx);
        break;
    }
  };

  const overlay = frame?.overlay;

  return (
    <div
      className="grid select-none gap-[2px] rounded-lg bg-base p-1"
      style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      onMouseDown={handleDown}
      onMouseOver={handleOver}
      role="grid"
      aria-label="Pathfinding grid — click and drag to draw walls"
    >
      {Array.from({ length: rows * cols }, (_, i) => (
        <div
          key={i}
          data-idx={i}
          className={cn(
            "aspect-square rounded-[2px] transition-colors duration-150",
            (i === start || i === goal) && "cursor-grab",
            i !== start && i !== goal && "cursor-pointer",
            cellClass(i, walls, start, goal, overlay ? overlay[i] : 0),
          )}
        />
      ))}
    </div>
  );
}
