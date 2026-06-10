import { Link } from "react-router-dom";
import { Compass, BookOpen, MonitorPlay, FlaskConical, Home } from "lucide-react";

const LINKS = [
  { to: "/learn", label: "Learn", icon: BookOpen },
  { to: "/visualizers", label: "Visualizers", icon: MonitorPlay },
  { to: "/problems", label: "Problems", icon: FlaskConical },
  { to: "/", label: "Home", icon: Home },
];

export function NotFoundPage() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-24 text-center">
      <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-elevated text-run">
        <Compass className="h-8 w-8" />
      </span>
      <p className="eyebrow mb-2">404</p>
      <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        This path has no frontier.
      </h1>
      <p className="mt-3 text-muted">
        The page you're after doesn't exist (or moved). Here's where you can go instead:
      </p>
      <div className="mt-7 grid w-full grid-cols-2 gap-3 sm:grid-cols-4">
        {LINKS.map((l) => (
          <Link
            key={l.to}
            to={l.to}
            className="card card-hover flex flex-col items-center gap-2 p-4 text-sm font-semibold"
          >
            <l.icon className="h-5 w-5 text-run" />
            {l.label}
          </Link>
        ))}
      </div>
      <p className="mt-6 text-xs text-subtle">
        Tip: press <kbd className="rounded border border-line bg-elevated px-1 font-mono">Ctrl</kbd>
        +<kbd className="rounded border border-line bg-elevated px-1 font-mono">K</kbd> to jump anywhere.
      </p>
    </div>
  );
}
