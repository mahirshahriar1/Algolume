import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/useTheme";

/** Light/dark switch. Icon shows the theme you'll switch *to*. */
export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      onClick={toggle}
      className="btn-icon"
      aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
    >
      {isDark ? (
        <Sun className="h-5 w-5 text-pivot" />
      ) : (
        <Moon className="h-5 w-5 text-compare" />
      )}
    </button>
  );
}
