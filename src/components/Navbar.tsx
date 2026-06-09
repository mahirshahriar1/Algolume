import { Link, useLocation } from "react-router-dom";
import { Github, Linkedin, Search } from "lucide-react";
import { cn } from "@/lib/cn";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";

const REPO_URL = "https://github.com/mahirshahriar1/Algolume";
const LINKEDIN_URL = "https://www.linkedin.com/in/mahir-shahriar-tamim/";

const NAV = [
  { to: "/learn", label: "Learn" },
  { to: "/visualizers", label: "Visualizers" },
  { to: "/playground", label: "Playground" },
  { to: "/problems", label: "Problems" },
];

export function Navbar() {
  const { pathname } = useLocation();
  return (
    <header className="sticky top-0 z-30 border-b border-line/50 bg-base/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2.5 group">
          <Logo className="h-8 w-8" />
          <span className="font-display text-xl font-semibold tracking-tight">
            Algo<span className="text-run">lume</span>
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          <div className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => {
              const active = pathname.startsWith(item.to);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-lg px-3 py-2 text-sm font-medium transition-colors duration-200",
                    active
                      ? "bg-elevated text-fg"
                      : "text-muted hover:text-fg hover:bg-elevated/60",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <span className="mx-1 hidden h-5 w-px bg-line md:block" aria-hidden="true" />
          <Link
            to="/search"
            className={cn(
              "btn-icon",
              pathname.startsWith("/search") && "bg-elevated text-fg",
            )}
            aria-label="Search lessons and notes"
            title="Search"
          >
            <Search className="h-5 w-5" />
          </Link>
          <ThemeToggle />
          <a
            href={LINKEDIN_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-icon"
            aria-label="Author's LinkedIn"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noreferrer"
            className="btn-icon"
            aria-label="GitHub repository"
          >
            <Github className="h-5 w-5" />
          </a>
        </nav>
      </div>
    </header>
  );
}
