import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";

/** Floating "back to top" button that appears once the user scrolls down. */
export function ScrollToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-fg shadow-lg transition-transform hover:-translate-y-0.5 hover:text-run"
    >
      <ArrowUp className="h-5 w-5" />
    </button>
  );
}
