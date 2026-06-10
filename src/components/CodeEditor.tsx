import { useRef } from "react";

/**
 * Minimal code editor: a monospace textarea with a synced line-number gutter
 * and tab-to-indent. No editor dependency — deliberately small and reliable.
 */
export function CodeEditor({
  value,
  onChange,
  className,
}: {
  value: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const gutterRef = useRef<HTMLDivElement | null>(null);
  const lineCount = value.split("\n").length;

  const syncScroll = () => {
    if (gutterRef.current && taRef.current) {
      gutterRef.current.scrollTop = taRef.current.scrollTop;
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const ta = e.currentTarget;
      const start = ta.selectionStart;
      const end = ta.selectionEnd;
      onChange(value.slice(0, start) + "    " + value.slice(end));
      requestAnimationFrame(() => {
        ta.selectionStart = ta.selectionEnd = start + 4;
      });
    }
  };

  return (
    <div
      className={`flex overflow-hidden rounded-xl border border-line bg-code font-mono text-[13px] leading-6 ${className ?? ""}`}
    >
      <div
        ref={gutterRef}
        aria-hidden="true"
        className="select-none overflow-hidden py-3 pl-3 pr-2 text-right text-subtle"
      >
        {Array.from({ length: lineCount }, (_, i) => (
          <div key={i}>{i + 1}</div>
        ))}
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoCapitalize="off"
        autoCorrect="off"
        className="h-full w-full flex-1 resize-none bg-transparent py-3 pr-3 text-fg outline-none
          placeholder:text-subtle"
      />
    </div>
  );
}
