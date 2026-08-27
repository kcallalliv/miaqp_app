const ITEMS = [
  "PACE",
  "WATTS",
  "FRECUENCIA CARDÍACA",
  "KILÓMETROS",
  "ELEVACIÓN",
  "TIEMPO",
  "VELOCIDAD",
  "VO₂ MAX",
  "CADENCIA",
];

export function MetricsTicker() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="border-y border-[--color-graphite] bg-[--color-anthracite] py-3">
      <div className="flex overflow-hidden">
        <div className="animate-marquee flex shrink-0 items-center gap-8 whitespace-nowrap pr-8">
          {row.map((item, i) => (
            <span key={i} className="flex items-center gap-8">
              <span className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-[--color-muted]">
                {item}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-[--color-volt]" />
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
