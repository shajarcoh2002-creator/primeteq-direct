import type { CategoryId } from "@/data/catalog";

const TONES: Record<CategoryId, [string, string]> = {
  iphone: ["#1c2a4d", "#4b5d86"],
  samsung: ["#16304f", "#3b6aa0"],
  google: ["#2a3346", "#7d8aa6"],
  ipad: ["#25304a", "#6a7899"],
};

/** Neutral device illustration (no third-party product photos). */
export function DeviceArt({ category, className = "h-28" }: { category: CategoryId; className?: string }) {
  const [a, b] = TONES[category];
  const tablet = category === "ipad";
  const id = `g-${category}`;
  return (
    <svg viewBox={tablet ? "0 0 90 120" : "0 0 60 120"} className={className} aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={b} />
          <stop offset="1" stopColor={a} />
        </linearGradient>
      </defs>
      {tablet ? (
        <>
          <rect x="2" y="2" width="86" height="116" rx="9" fill="#0b1733" />
          <rect x="6" y="6" width="78" height="108" rx="5" fill={`url(#${id})`} />
        </>
      ) : (
        <>
          <rect x="2" y="2" width="56" height="116" rx="11" fill="#0b1733" />
          <rect x="5" y="5" width="50" height="110" rx="8" fill={`url(#${id})`} />
          <rect x="22" y="9" width="16" height="4" rx="2" fill="#0b1733" />
        </>
      )}
      <path d={tablet ? "M6 70 L84 30 L84 6 L60 6 Z" : "M5 60 L55 30 L55 5 L40 5 Z"} fill="#fff" opacity="0.08" />
    </svg>
  );
}
