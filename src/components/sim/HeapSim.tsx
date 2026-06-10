import { useMemo } from "react";
import { buildHeapDemoFrames, HEAP_CODE } from "@/lib/sims/heap";
import { EmbeddedSim } from "./EmbeddedSim";
import { HeapCanvas } from "./HeapCanvas";

/** Canned insert-then-extract min-heap animation for lesson embeds. */
export function HeapSim() {
  const frames = useMemo(() => buildHeapDemoFrames(), []);
  return (
    <EmbeddedSim
      frames={frames}
      code={HEAP_CODE}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(f) => <HeapCanvas frame={f} />}
    />
  );
}
