import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { VIZ_BY_ID } from "./registry";
import { cn } from "@/lib/cn";

/** A dedicated full page for one interactive visualizer (3-pane layout). */
export function VisualizerDetailPage() {
  const { id = "" } = useParams();
  const v = VIZ_BY_ID[id];
  if (!v || !v.Component) return <Navigate to="/visualizers" replace />;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <Link to="/visualizers" className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted hover:text-fg">
        <ArrowLeft className="h-4 w-4" />
        All visualizers
      </Link>

      <div className="mb-6 flex items-start gap-4">
        <span className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-elevated", v.accent)}>
          <v.icon className="h-6 w-6" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">{v.title}</h1>
          <p className="mt-1 max-w-2xl text-muted">{v.blurb}</p>
        </div>
      </div>

      {v.Component(v, id)}
    </div>
  );
}
