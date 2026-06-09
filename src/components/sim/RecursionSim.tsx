import { useMemo } from "react";
import { EmbeddedSim } from "./EmbeddedSim";
import { RecursionCanvas } from "./RecursionCanvas";
import {
  buildBacktrackingFrames,
  buildDivideFrames,
  buildFactorialFrames,
  REC_CODE,
  type RecMode,
} from "@/lib/sims/recursion";

export function RecursionSim({ variant = "factorial" }: { variant?: string }) {
  const mode = (["factorial", "divide", "backtracking"].includes(variant)
    ? variant
    : "factorial") as RecMode;
  const frames = useMemo(() => {
    if (mode === "divide") return buildDivideFrames({ n: 16, branches: 2, base: 1, combine: "linear" });
    if (mode === "backtracking") return buildBacktrackingFrames({ depth: 3, branching: 3, pruning: "medium" });
    return buildFactorialFrames(5);
  }, [mode]);

  return (
    <EmbeddedSim
      frames={frames}
      code={REC_CODE[mode]}
      speed={2}
      height="h-[24rem]"
      autoPlay
      loop
      render={(frame) => <RecursionCanvas frame={frame} />}
    />
  );
}
