import type { BitFrame } from "@/lib/sims/bits";
import { BIT_WIDTH } from "@/lib/sims/bits";
import { cn } from "@/lib/cn";

const PLACE = Array.from({ length: BIT_WIDTH }, (_, i) => 1 << (BIT_WIDTH - 1 - i));

function Cell({ bit, active, tone }: { bit: number | null; active: boolean; tone: "operand" | "result" }) {
  return (
    <div
      className={cn(
        "flex h-9 w-9 items-center justify-center rounded-md border font-mono text-sm font-semibold transition-colors duration-150",
        active
          ? "border-compare bg-compare/20 text-compare"
          : bit === null
            ? "border-dashed border-line bg-surface text-subtle"
            : bit === 1
              ? tone === "result"
                ? "border-run/50 bg-run/15 text-run"
                : "border-pivot/50 bg-pivot/15 text-fg"
              : "border-line bg-elevated text-subtle",
      )}
    >
      {bit === null ? "·" : bit}
    </div>
  );
}

function Row({ label, bits, value, activeCol, tone }: { label: string; bits: (number | null)[]; value: number | string; activeCol: number; tone: "operand" | "result" }) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-8 shrink-0 text-right font-mono text-xs text-subtle">{label}</span>
      <div className="flex gap-1">
        {bits.map((b, i) => (
          <Cell key={i} bit={b} active={i === activeCol} tone={tone} />
        ))}
      </div>
      <span className="ml-1 shrink-0 font-mono text-sm font-semibold text-fg">= {value}</span>
    </div>
  );
}

export function BitsCanvas({ frame }: { frame: BitFrame | undefined }) {
  if (!frame) return null;
  const val = (bits: (number | null)[]) => bits.reduce<number>((a, b, i) => a + (b ? PLACE[i] : 0), 0);

  return (
    <div className="w-full space-y-2">
      {/* place-value header */}
      <div className="flex items-center gap-2">
        <span className="w-8 shrink-0" />
        <div className="flex gap-1">
          {PLACE.map((p, i) => (
            <span key={i} className="w-9 text-center font-mono text-[10px] text-subtle">{p}</span>
          ))}
        </div>
      </div>

      {frame.rows.map((r, i) => (
        <Row key={i} label={r.label} bits={r.bits} value={val(r.bits)} activeCol={frame.activeCol} tone="operand" />
      ))}

      <div className="ml-10 border-t border-dashed border-line" />

      <Row label={frame.resultLabel} bits={frame.result} value={val(frame.result)} activeCol={frame.activeCol} tone="result" />

      <div className="flex flex-wrap gap-x-3 gap-y-1.5 pt-1">
        {[
          { label: "Active column", cls: "bg-compare" },
          { label: "Operand 1-bit", cls: "bg-pivot/60" },
          { label: "Result 1-bit", cls: "bg-run/60" },
          { label: "0 / pending", cls: "bg-elevated border border-line" },
        ].map((it) => (
          <span key={it.label} className="flex items-center gap-1.5 text-[11px] text-muted">
            <span className={cn("h-2.5 w-2.5 rounded-sm", it.cls)} />
            {it.label}
          </span>
        ))}
      </div>
    </div>
  );
}
