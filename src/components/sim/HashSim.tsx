import { useMemo } from "react";
import { buildHashFrames, HASH_CODE } from "@/lib/sims/hash";
import { EmbeddedSim } from "./EmbeddedSim";
import { HashCanvas } from "./HashCanvas";

/** Embedded (canned) hash-table demo used inside lessons. */
export function HashSim() {
  const frames = useMemo(() => buildHashFrames(), []);
  return (
    <EmbeddedSim frames={frames} code={HASH_CODE} speed={2} height="h-auto" autoPlay loop render={(f) => <HashCanvas frame={f} />} />
  );
}
