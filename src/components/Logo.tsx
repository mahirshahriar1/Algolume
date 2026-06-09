/**
 * Algolume mark — an illuminated algorithm path. No letterform, so it stays
 * distinct from acronym-style logos while keeping the "lume" idea.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <defs>
        <radialGradient id="algolume-aura" cx="50%" cy="38%" r="62%">
          <stop offset="0%" stopColor="#FDE68A" stopOpacity="0.92" />
          <stop offset="42%" stopColor="#34D399" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="algolume-path" x1="8" y1="24" x2="24" y2="8" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38BDF8" />
          <stop offset="0.52" stopColor="#34D399" />
          <stop offset="1" stopColor="#FBBF24" />
        </linearGradient>
      </defs>

      {/* Tile */}
      <rect width="32" height="32" rx="8" fill="#0F172A" />
      <rect x="0.5" y="0.5" width="31" height="31" rx="7.5" stroke="#334155" />

      {/* Lume — a soft light around the algorithm path */}
      <circle cx="16" cy="14" r="13" fill="url(#algolume-aura)" />

      {/* Algorithm path */}
      <path
        d="M8.5 22.5 C10.75 17.5 13.6 15.35 16 14 C18.9 12.35 21.55 10.6 23.5 7.5"
        stroke="url(#algolume-path)"
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      <path
        d="M16 14 C18.2 16.15 20.1 18.5 23.4 20.7"
        stroke="#34D399"
        strokeWidth="2.2"
        strokeLinecap="round"
        opacity="0.92"
      />

      {/* Decision nodes */}
      <circle cx="8.5" cy="22.5" r="2.5" fill="#38BDF8" />
      <circle cx="16" cy="14" r="3.1" fill="#FDE68A" stroke="#0F172A" strokeWidth="1.2" />
      <circle cx="23.5" cy="7.5" r="2.45" fill="#FBBF24" />
      <circle cx="23.4" cy="20.7" r="2.35" fill="#34D399" />

      {/* Tiny spark, separate from the path so it reads as illumination */}
      <path
        d="M12.3 7.6 L13.1 9.4 L14.9 10.2 L13.1 11 L12.3 12.8 L11.5 11 L9.7 10.2 L11.5 9.4 Z"
        fill="#FDE68A"
      />
    </svg>
  );
}
