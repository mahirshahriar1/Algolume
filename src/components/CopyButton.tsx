import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { cn } from "@/lib/cn";

/** Small copy-to-clipboard control with a brief "copied" confirmation. */
export function CopyButton({
  text,
  label,
  className,
}: {
  text: string;
  /** optional visible label (icon-only when omitted) */
  label?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard may be unavailable (insecure context) — ignore */
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      title={copied ? "Copied!" : "Copy"}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] font-medium text-subtle transition-colors hover:text-fg",
        className,
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5 text-run" /> : <Copy className="h-3.5 w-3.5" />}
      {label && <span>{copied ? "Copied" : label}</span>}
    </button>
  );
}
