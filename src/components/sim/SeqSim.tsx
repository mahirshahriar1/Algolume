import { useMemo } from "react";
import { SEQ_SIMS, SEQ_CODE } from "@/lib/sims/sequence";
import { EmbeddedSim } from "./EmbeddedSim";
import { SeqCanvas } from "./SeqCanvas";

/** Dispatches a sequence simulation (array / stack / queue / linked-list). */
export function SeqSim({ variant }: { variant: string }) {
  const build = SEQ_SIMS[variant] ?? SEQ_SIMS.array;
  const frames = useMemo(() => build(), [build]);
  const linked = variant === "linked-list";
  const showIndices = ["array", "linear-search", "binary-search", "ternary-search", "sliding-window"].includes(variant);
  return (
    <EmbeddedSim
      frames={frames}
      code={SEQ_CODE[variant]}
      speed={2}
      autoPlay
      loop
      render={(f) => <SeqCanvas frame={f} linked={linked} showIndices={showIndices} />}
    />
  );
}
