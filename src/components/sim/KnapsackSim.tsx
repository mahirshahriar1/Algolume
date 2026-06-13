import { useMemo } from "react";
import { buildKnapsackFrames, KNAPSACK_CODE } from "@/lib/sims/knapsack";
import { EmbeddedSim } from "./EmbeddedSim";
import { KnapsackCanvas } from "./KnapsackCanvas";

/** Canned fractional-knapsack animation for lesson embeds. */
export function KnapsackSim() {
  const frames = useMemo(() => buildKnapsackFrames(), []);
  return (
    <EmbeddedSim
      frames={frames}
      code={KNAPSACK_CODE}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(f) => <KnapsackCanvas frame={f} />}
    />
  );
}
