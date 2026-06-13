import { useMemo } from "react";
import { buildKadaneFrames, KADANE_CODE } from "@/lib/sims/kadane";
import { EmbeddedSim } from "./EmbeddedSim";
import { KadaneCanvas } from "./KadaneCanvas";

/** Canned Kadane animation for lesson embeds. */
export function KadaneSim() {
  const frames = useMemo(() => buildKadaneFrames([-2, 1, -3, 4, -1, 2, 1, -5, 4]), []);
  return (
    <EmbeddedSim
      frames={frames}
      code={KADANE_CODE}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(f) => <KadaneCanvas frame={f} />}
    />
  );
}
