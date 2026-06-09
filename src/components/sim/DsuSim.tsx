import { useMemo } from "react";
import { EmbeddedSim } from "./EmbeddedSim";
import { DsuCanvas } from "./DsuCanvas";
import { buildDsuDemoFrames, DSU_CODE } from "@/lib/sims/dsu";

export function DsuSim() {
  const frames = useMemo(() => buildDsuDemoFrames(), []);
  return (
    <EmbeddedSim
      frames={frames}
      code={DSU_CODE}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(frame) => <DsuCanvas frame={frame} />}
    />
  );
}
