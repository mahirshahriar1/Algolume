import { useMemo } from "react";
import { buildBitFrames, bitCode, type BitOp } from "@/lib/sims/bits";
import { EmbeddedSim } from "./EmbeddedSim";
import { BitsCanvas } from "./BitsCanvas";

/** Canned bit-operation animation for lesson embeds. `variant` picks the op. */
export function BitsSim({ variant = "and" }: { variant?: BitOp }) {
  const frames = useMemo(() => buildBitFrames(variant, 182, 90, 2), [variant]);
  return (
    <EmbeddedSim
      frames={frames}
      code={bitCode(variant)}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(f) => <BitsCanvas frame={f} />}
    />
  );
}
