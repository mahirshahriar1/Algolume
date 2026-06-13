import { useMemo } from "react";
import { buildMatchFrames, matchCode, type MatchMode } from "@/lib/sims/matching";
import { EmbeddedSim } from "./EmbeddedSim";
import { MatchCanvas } from "./MatchCanvas";

/** Canned pattern-matching animation for lesson embeds. `variant` = naive|kmp. */
export function MatchSim({ variant = "naive" }: { variant?: MatchMode }) {
  const frames = useMemo(() => buildMatchFrames(variant, "abxabcabcaby", "abcaby"), [variant]);
  return (
    <EmbeddedSim
      frames={frames}
      code={matchCode(variant)}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(f) => <MatchCanvas frame={f} />}
    />
  );
}
