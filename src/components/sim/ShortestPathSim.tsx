import { useMemo } from "react";
import { EmbeddedSim } from "./EmbeddedSim";
import { ShortestPathCanvas } from "./ShortestPathCanvas";
import {
  buildShortestPathFrames,
  shortestPathCode,
  type ShortestPathMode,
} from "@/lib/sims/shortestPath";

export function ShortestPathSim({ variant }: { variant: ShortestPathMode }) {
  const frames = useMemo(() => buildShortestPathFrames(variant), [variant]);
  return (
    <EmbeddedSim
      frames={frames}
      code={shortestPathCode(variant)}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(frame) => <ShortestPathCanvas frame={frame} />}
    />
  );
}
