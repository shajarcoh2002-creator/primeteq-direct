const STEPS = ["Select", "Get offer", "Payment", "Shipping"];

export function Steps({ current }: { current: 0 | 1 | 2 | 3 }) {
  return (
    <div className="border-b border-line bg-paper">
      <ol className="container-page flex items-center gap-2 overflow-x-auto py-3 text-xs font-bold uppercase tracking-wider sm:gap-4">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2 whitespace-nowrap sm:gap-4">
            <span className={i === current ? "text-brand" : i < current ? "text-ink" : "text-muted/60"}>
              {i + 1}. {s}
            </span>
            {i < STEPS.length - 1 && <span className="text-muted/40">›</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}
