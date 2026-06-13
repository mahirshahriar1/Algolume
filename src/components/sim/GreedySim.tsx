import { useMemo } from "react";
import { buildActivitySelection, GREEDY_CODE } from "@/lib/sims/greedy";
import { EmbeddedSim } from "./EmbeddedSim";
import { GreedyCanvas } from "./GreedyCanvas";

/** Canned activity-selection animation for lesson embeds. */
export function GreedySim() {
  const frames = useMemo(() => buildActivitySelection(), []);
  return (
    <EmbeddedSim
      frames={frames}
      code={GREEDY_CODE}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(f) => <GreedyCanvas frame={f} />}
    />
  );
}
