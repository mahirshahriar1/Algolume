import { Keyboard, X } from "lucide-react";

const SHORTCUTS: { keys: string[]; desc: string }[] = [
  { keys: ["Ctrl", "K"], desc: "Open the quick switcher (jump anywhere)" },
  { keys: ["?"], desc: "Show this shortcuts help" },
  { keys: ["Space"], desc: "Play / pause a visualizer" },
  { keys: ["←", "→"], desc: "Step a visualizer back / forward" },
  { keys: ["↑", "↓"], desc: "Move the selection in the quick switcher" },
  { keys: ["Enter"], desc: "Open the highlighted result" },
  { keys: ["Esc"], desc: "Close an overlay" },
];

export function ShortcutsHelp({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-fg/30 px-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-line bg-surface shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-line px-4 py-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-fg">
            <Keyboard className="h-4 w-4 text-run" />
            Keyboard shortcuts
          </div>
          <button onClick={onClose} className="btn-icon h-8 w-8" aria-label="Close">
            <X className="h-4 w-4" />
          </button>
        </div>
        <ul className="divide-y divide-line/60">
          {SHORTCUTS.map((s) => (
            <li key={s.desc} className="flex items-center justify-between gap-4 px-4 py-2.5">
              <span className="text-sm text-muted">{s.desc}</span>
              <span className="flex shrink-0 items-center gap-1">
                {s.keys.map((k) => (
                  <kbd
                    key={k}
                    className="rounded border border-line bg-elevated px-1.5 py-0.5 font-mono text-[11px] text-fg"
                  >
                    {k}
                  </kbd>
                ))}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
