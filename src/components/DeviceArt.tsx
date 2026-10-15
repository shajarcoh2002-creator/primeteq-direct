import type { CategoryId } from "@/data/catalog";

/** Neutral line illustration — no product photos, no specific SKU. */
export function DeviceArt({ category, className = "h-24" }: { category: CategoryId; className?: string }) {
  const tablet = category === "ipad";
  return (
    <svg viewBox={tablet ? "0 0 84 112" : "0 0 56 112"} className={className} aria-hidden fill="none">
      {tablet ? (
        <>
          <rect x="1.5" y="1.5" width="81" height="109" rx="9" fill="#F5F7FB" stroke="#0B1640" strokeWidth="2.5" />
          <rect x="7" y="7" width="70" height="98" rx="4" fill="#fff" stroke="#E2E7F0" />
          <circle cx="42" cy="4.3" r="0.9" fill="#0B1640" />
        </>
      ) : (
        <>
          <rect x="1.5" y="1.5" width="53" height="109" rx="11" fill="#F5F7FB" stroke="#0B1640" strokeWidth="2.5" />
          <rect x="5.5" y="5.5" width="45" height="101" rx="7.5" fill="#fff" stroke="#E2E7F0" />
          <rect x="21" y="9" width="14" height="4" rx="2" fill="#0B1640" />
        </>
      )}
      <path d={tablet ? "M7 80 Q 42 60 77 72 V105 H7 Z" : "M5.5 78 Q 28 62 50.5 70 V106.5 H5.5 Z"} fill="#342CFF" opacity="0.08" />
    </svg>
  );
}

/** Hero teaser: shows the three things the flow asks for — no prices, no stock. */
export function HeroTeaser({ category, deviceLabel }: { category: CategoryId; deviceLabel: string }) {
  const rows = [
    { k: "Model", v: deviceLabel },
    { k: "Storage & carrier", v: "Your configuration" },
    { k: "Condition", v: "A few quick questions" },
  ];
  return (
    <div className="relative mx-auto w-full max-w-md">
      <span aria-hidden className="absolute -right-10 -top-10 h-56 w-56 rounded-full border-[18px] border-brand/85 md:-right-12 md:-top-12 md:h-64 md:w-64 md:border-[22px]" />
      <div className="card relative p-6 shadow-[var(--shadow-lift)] md:p-8">
        <div className="flex items-center gap-5">
          <DeviceArt category={category} className="h-28 shrink-0 md:h-32" />
          <div>
            <p className="eyebrow">Your trade</p>
            <p className="font-display mt-1 text-xl font-extrabold">{deviceLabel}</p>
          </div>
        </div>
        <ul className="mt-6 space-y-2.5">
          {rows.map((r, i) => (
            <li key={r.k} className="flex items-center gap-3 rounded-xl border border-line px-4 py-3">
              <span className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold ${i === 0 ? "bg-brand text-white" : "bg-paper text-muted"}`}>
                {i + 1}
              </span>
              <span className="text-sm font-semibold">{r.k}</span>
              <span className="ml-auto truncate text-sm text-muted">{r.v}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
