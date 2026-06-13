import { useMemo } from "react";
import { buildGameFrames, gameCode, type GameMode } from "@/lib/sims/game";
import { EmbeddedSim } from "./EmbeddedSim";
import { GameCanvas } from "./GameCanvas";

/** Canned subtraction-game animation for lesson embeds. `variant` = wl|grundy. */
export function GameSim({ variant = "wl" }: { variant?: GameMode }) {
  const frames = useMemo(() => buildGameFrames(variant, 16, [1, 2]), [variant]);
  return (
    <EmbeddedSim
      frames={frames}
      code={gameCode(variant)}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(f) => <GameCanvas frame={f} />}
    />
  );
}
