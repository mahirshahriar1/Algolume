import { useMemo } from "react";
import { buildDpFrames, dpCode, type DpMode } from "@/lib/sims/dp";
import { EmbeddedSim } from "./EmbeddedSim";
import { DpCanvas } from "./DpCanvas";

/** Canned DP-table fill for lesson embeds. `variant` picks the mode. */
export function DpSim({ variant = "coin" }: { variant?: DpMode }) {
  const frames = useMemo(() => buildDpFrames(variant), [variant]);
  return (
    <EmbeddedSim
      frames={frames}
      code={dpCode(variant)}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(f) => <DpCanvas frame={f} />}
    />
  );
}
