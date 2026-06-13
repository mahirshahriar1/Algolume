/**
 * Small decorative SVG thumbnails per visualizer, drawn in `currentColor` so the
 * parent's accent text colour tints them. Purely illustrative.
 */
export function VizThumb({ id }: { id: string }) {
  const wrap = "h-14 w-auto text-current";
  switch (id) {
    case "sorting":
      return (
        <svg viewBox="0 0 96 56" className={wrap} fill="currentColor">
          {[14, 24, 18, 34, 28, 46].map((h, i) => (
            <rect key={i} x={6 + i * 15} y={52 - h} width="10" height={h} rx="2" opacity={0.35 + i * 0.11} />
          ))}
        </svg>
      );
    case "pathfinding":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="currentColor">
            {Array.from({ length: 18 }, (_, k) => {
              const r = Math.floor(k / 6);
              const c = k % 6;
              const path = (r === 0 && c <= 2) || (c === 2 && r >= 0) || (r === 2 && c >= 2);
              return <rect key={k} x={8 + c * 13} y={8 + r * 14} width="9" height="9" rx="2" opacity={path ? 0.95 : 0.22} />;
            })}
          </g>
        </svg>
      );
    case "array":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="none" stroke="currentColor" strokeWidth="2">
            {[0, 1, 2, 3, 4].map((i) => (
              <rect key={i} x={6 + i * 17} y={20} width="15" height="16" rx="2" opacity={0.5} />
            ))}
          </g>
        </svg>
      );
    case "searching":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M14 28h68" opacity="0.25" />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <rect key={i} x={9 + i * 13} y={22} width="10" height="12" rx="2" opacity={i < 2 ? 0.25 : i === 4 ? 0.95 : 0.5} />
            ))}
            <path d="M61 14l6 6 6-6" opacity="0.9" />
            <circle cx="67" cy="28" r="12" opacity="0.65" />
          </g>
        </svg>
      );
    case "stack":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="currentColor">
            {[0, 1, 2].map((i) => (
              <rect key={i} x={30} y={38 - i * 13} width="36" height="11" rx="2" opacity={0.4 + i * 0.2} />
            ))}
          </g>
        </svg>
      );
    case "recursion":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g stroke="currentColor" strokeWidth="2" fill="none">
            <path d="M48 10v10M48 20 28 36M48 20l20 16M28 36l-10 10M28 36l10 10M68 36l-10 10M68 36l10 10" opacity="0.55" />
          </g>
          <g fill="currentColor">
            {[[48, 10], [48, 22], [28, 36], [68, 36], [18, 48], [38, 48], [58, 48], [78, 48]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i < 2 ? 5 : 4} opacity={i === 0 ? 0.95 : 0.5} />
            ))}
          </g>
        </svg>
      );
    case "queue":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="currentColor">
            {[0, 1, 2, 3].map((i) => (
              <rect key={i} x={8 + i * 19} y={20} width="15" height="16" rx="2" opacity={0.9 - i * 0.18} />
            ))}
          </g>
        </svg>
      );
    case "linked-list":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g stroke="currentColor" strokeWidth="2" fill="none">
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={16 + i * 32} cy={28} r="9" opacity={0.6} />
            ))}
            {[0, 1].map((i) => (
              <line key={i} x1={26 + i * 32} y1={28} x2={38 + i * 32} y2={28} opacity={0.6} />
            ))}
          </g>
        </svg>
      );
    case "trees":
    case "bst":
    case "red-black-tree":
    case "traversals":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g stroke="currentColor" strokeWidth="2" opacity={0.6}>
            <line x1={48} y1={14} x2={28} y2={36} />
            <line x1={48} y1={14} x2={68} y2={36} />
            <line x1={28} y1={36} x2={18} y2={50} />
          </g>
          <g fill="currentColor">
            {[[48, 14], [28, 36], [68, 36], [18, 50]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="6" opacity={i === 0 ? 0.95 : 0.55} />
            ))}
          </g>
        </svg>
      );
    case "dsu":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 38 Q30 16 42 30" opacity="0.7" />
            <path d="M42 30 Q52 14 64 24" opacity="0.85" />
            <path d="M64 24 Q74 18 82 12" opacity="0.4" strokeDasharray="4 4" />
            <path d="M24 46 Q40 18 64 24" opacity="0.9" />
          </g>
          <g fill="currentColor">
            {[[18, 38], [42, 30], [64, 24], [82, 12], [24, 46]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r={i === 2 ? 6 : 5} opacity={i === 2 ? 0.95 : 0.55} />
            ))}
          </g>
        </svg>
      );
    case "shortest-paths":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M16 40 C30 12, 48 48, 66 18 S82 34, 86 12" opacity="0.35" />
            <path d="M16 40 L40 30 L66 18 L86 12" opacity="0.9" />
          </g>
          <g fill="currentColor">
            {[[16, 40], [40, 30], [66, 18], [86, 12]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" opacity={i === 0 || i === 3 ? 0.95 : 0.55} />
            ))}
          </g>
        </svg>
      );
    case "mst":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 40 L38 18 L62 36 L78 14" opacity="0.85" />
            <path d="M18 40 L62 36" opacity="0.3" />
            <path d="M38 18 L78 14" opacity="0.3" strokeDasharray="4 4" />
            <path d="M38 18 L62 36" opacity="0.85" />
          </g>
          <g fill="currentColor">
            {[[18, 40], [38, 18], [62, 36], [78, 14]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" opacity={i === 1 ? 0.95 : 0.6} />
            ))}
          </g>
        </svg>
      );
    case "graphs":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="none" stroke="currentColor" strokeWidth="2">
            {/* tree edges (solid) + a non-tree edge (dashed) */}
            <path d="M20 40 L40 16 L64 34 L80 14" opacity="0.9" />
            <path d="M40 16 L64 34" opacity="0.85" />
            <path d="M20 40 L64 34" opacity="0.3" strokeDasharray="4 4" />
            <path d="M40 16 L80 14" opacity="0.3" strokeDasharray="4 4" />
          </g>
          <g fill="currentColor">
            {[[20, 40], [40, 16], [64, 34], [80, 14]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" opacity={i === 0 ? 0.95 : 0.6} />
            ))}
          </g>
        </svg>
      );
    case "sieve":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="currentColor">
            {Array.from({ length: 18 }, (_, i) => {
              const prime = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29].includes(i + 2);
              return (
                <rect key={i} x={8 + (i % 6) * 14} y={8 + Math.floor(i / 6) * 14} width="11" height="11" rx="2" opacity={prime ? 0.9 : 0.25} />
              );
            })}
          </g>
        </svg>
      );
    case "game-theory":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="currentColor">
            {["L", "W", "W", "L", "W", "W"].map((s, i) => (
              <g key={i}>
                <rect x={8 + i * 14} y={20} width="11" height="14" rx="2" opacity={s === "L" ? 0.3 : 0.85} />
              </g>
            ))}
          </g>
        </svg>
      );
    case "matching":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="currentColor">
            {[0, 1, 2, 3, 4, 5, 6, 7].map((c) => (
              <rect key={`t${c}`} x={8 + c * 11} y={12} width="9" height="11" rx="2" opacity={c >= 2 && c <= 4 ? 0.95 : 0.3} />
            ))}
            {[0, 1, 2].map((c) => (
              <rect key={`p${c}`} x={30 + c * 11} y={32} width="9" height="11" rx="2" opacity="0.7" />
            ))}
          </g>
        </svg>
      );
    case "greedy":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g>
            {[
              [10, 10, 34, 0.55],
              [40, 22, 30, 0.95],
              [16, 34, 28, 0.3],
              [54, 46, 30, 0.95],
            ].map(([x, y, w, op], i) => (
              <rect key={i} x={x} y={y} width={w} height="8" rx="3" className="fill-current" opacity={op as number} />
            ))}
          </g>
        </svg>
      );
    case "bits":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g>
            {[0, 1].map((r) =>
              [0, 1, 2, 3, 4, 5].map((c) => {
                const on = (r === 0 ? [1, 0, 1, 1, 0, 1] : [0, 1, 1, 0, 1, 1])[c] === 1;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={14 + c * 12}
                    y={12 + r * 16}
                    width="9"
                    height="12"
                    rx="2"
                    className="fill-current"
                    opacity={on ? 0.9 : 0.25}
                  />
                );
              }),
            )}
          </g>
        </svg>
      );
    case "dp":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g>
            {[0, 1, 2].map((r) =>
              [0, 1, 2, 3].map((c) => {
                const on = r <= 1 && c <= 2;
                return (
                  <rect
                    key={`${r}-${c}`}
                    x={20 + c * 15}
                    y={8 + r * 14}
                    width="12"
                    height="11"
                    rx="2"
                    className={on ? "fill-current" : "fill-current opacity-25"}
                    opacity={r === 1 && c === 2 ? 1 : on ? 0.6 : 0.25}
                  />
                );
              }),
            )}
          </g>
        </svg>
      );
    case "heap":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M48 12 L30 30" opacity="0.7" />
            <path d="M48 12 L66 30" opacity="0.7" />
            <path d="M30 30 L20 46" opacity="0.5" />
            <path d="M30 30 L40 46" opacity="0.5" />
            <path d="M66 30 L58 46" opacity="0.5" />
          </g>
          <g fill="currentColor">
            <circle cx="48" cy="12" r="6" opacity="0.95" />
            {[[30, 30], [66, 30], [20, 46], [40, 46], [58, 46]].map(([x, y], i) => (
              <circle key={i} cx={x} cy={y} r="5" opacity={0.55} />
            ))}
          </g>
        </svg>
      );
    case "hash":
      return (
        <svg viewBox="0 0 96 56" className={wrap}>
          <g fill="currentColor">
            {[0, 1, 2].map((r) => (
              <g key={r}>
                <rect x={6} y={10 + r * 14} width="10" height="10" rx="2" opacity={0.35} />
                {Array.from({ length: r + 1 }, (_, c) => (
                  <rect key={c} x={22 + c * 14} y={10 + r * 14} width="10" height="10" rx="2" opacity={0.8} />
                ))}
              </g>
            ))}
          </g>
        </svg>
      );
    default:
      return null;
  }
}
