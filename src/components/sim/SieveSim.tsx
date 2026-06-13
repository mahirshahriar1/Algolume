import { useMemo } from "react";
import { buildSieveFrames, SIEVE_CODE } from "@/lib/sims/sieve";
import { EmbeddedSim } from "./EmbeddedSim";
import { SieveCanvas } from "./SieveCanvas";

/** Canned sieve animation for lesson embeds. */
export function SieveSim() {
  const frames = useMemo(() => buildSieveFrames(30), []);
  return (
    <EmbeddedSim
      frames={frames}
      code={SIEVE_CODE}
      speed={3}
      height="h-auto"
      autoPlay
      loop
      render={(f) => <SieveCanvas frame={f} />}
    />
  );
}
