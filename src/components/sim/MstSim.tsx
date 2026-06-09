import { useMemo } from "react";
import { EmbeddedSim } from "./EmbeddedSim";
import { MstCanvas } from "./MstCanvas";
import { buildMstFrames, mstCode, type MstMode } from "@/lib/sims/mst";

export function MstSim({ variant = "kruskal" }: { variant?: MstMode }) {
  const frames = useMemo(() => buildMstFrames(variant), [variant]);
  return (
    <EmbeddedSim
      frames={frames}
      code={mstCode(variant)}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(frame) => <MstCanvas frame={frame} />}
    />
  );
}
