const ITEMS: { label: string; className: string }[] = [
  { label: "Unsorted", className: "bg-bar" },
  { label: "Comparing", className: "bg-compare" },
  { label: "Swapping", className: "bg-swap" },
  { label: "Pivot / key", className: "bg-pivot" },
  { label: "Active range", className: "bg-visited/70" },
  { label: "Sorted", className: "bg-run" },
];

/** Colour key for the array canvas. */
export function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
      {ITEMS.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <span className={`h-3 w-3 rounded-sm ${item.className}`} />
          <span className="text-xs text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
