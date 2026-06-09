import { Link } from "react-router-dom";
import { ArrowRight, MonitorPlay } from "lucide-react";
import { VISUALIZERS } from "./registry";
import { VizThumb } from "./VizThumb";
import { cn } from "@/lib/cn";

// Accent → tinted header background (literal classes so Tailwind keeps them).
const TINT: Record<string, string> = {
  "text-run": "bg-run/10",
  "text-compare": "bg-compare/10",
  "text-pivot": "bg-pivot/10",
  "text-swap": "bg-swap/10",
  "text-visited": "bg-visited/10",
};

/** Hub listing every interactive visualizer. */
export function VisualizersPage() {
  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-6">
      <div className="mb-10">
        <p className="eyebrow mb-3 inline-flex items-center gap-2">
          <MonitorPlay className="h-3.5 w-3.5 text-run" />
          Visualizers
        </p>
        <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">
          Play with every structure.
        </h1>
        <p className="mt-4 max-w-xl text-lg text-muted">
          Hands-on, interactive simulations — push and pop, insert into a tree,
          hash your own keys. Each pairs with a lesson in the handbook.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {VISUALIZERS.map((v, index) => {
          const href = v.to ?? `/visualizers/${v.id}`;
          return (
            <Link key={v.id} to={href} className="card card-hover group flex flex-col overflow-hidden">
              {/* illustrated header */}
              <div className={cn("relative flex h-28 items-center justify-center border-b border-line", TINT[v.accent] ?? "bg-elevated")}>
                <span className={cn("transition-transform duration-300 group-hover:scale-110", v.accent)}>
                  <VizThumb id={v.id} />
                </span>
                <v.icon className={cn("absolute right-3 top-3 h-4 w-4 opacity-70", v.accent)} />
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="mb-1.5 flex items-center gap-2">
                  <h3 className="font-display text-base font-semibold text-fg">{v.title}</h3>
                  <span className="rounded border border-line px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-subtle">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {v.to && (
                    <span className="rounded border border-line px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-subtle">
                      Full page
                    </span>
                  )}
                </div>
                <p className="flex-1 text-sm leading-relaxed text-muted">{v.blurb}</p>
                <span className={cn("mt-4 inline-flex items-center gap-1 text-sm font-semibold", v.accent)}>
                  Open
                  <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
