"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export const MAIN_NAV = [
  { label: "Buy", href: "/buy", soon: true },
  { label: "Sell", href: "/", soon: false },
  { label: "Trade", href: "/trade", soon: true },
];

/** Which main section the current page belongs to. Everything outside /buy and /trade is Sell. */
export function useSection() {
  const path = usePathname();
  if (path.startsWith("/buy")) return "Buy";
  if (path.startsWith("/trade")) return "Trade";
  return "Sell";
}

export function MainNav() {
  const section = useSection();
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
      {MAIN_NAV.map((l) => {
        const current = l.label === section;
        return (
          <Link
            key={l.label}
            href={l.href}
            aria-current={current ? "page" : undefined}
            className={`relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] transition ${
              current ? "text-brand" : "text-ink hover:text-brand"
            }`}
          >
            {l.label}
            {l.soon && (
              <span className="rounded-full bg-paper px-1.5 py-0.5 text-[9px] font-bold tracking-[0.06em] text-muted ring-1 ring-line">SOON</span>
            )}
            {current && <span className="absolute inset-x-4 -bottom-[23px] h-[3px] rounded-full bg-brand" />}
          </Link>
        );
      })}
    </nav>
  );
}
