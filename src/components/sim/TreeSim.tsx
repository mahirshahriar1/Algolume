import { useMemo } from "react";
import { buildTreeFrames, treeCode } from "@/lib/sims/tree";
import { EmbeddedSim } from "./EmbeddedSim";
import { TreeCanvas } from "./TreeCanvas";

/** BST insert/search or a traversal, depending on the variant. */
export function TreeSim({ variant }: { variant: string }) {
  const frames = useMemo(() => buildTreeFrames(variant), [variant]);
  return (
    <EmbeddedSim
      frames={frames}
      code={treeCode(variant)}
      speed={2}
      height="h-auto"
      autoPlay
      loop
      render={(f) => <TreeCanvas frame={f} />}
    />
  );
}
