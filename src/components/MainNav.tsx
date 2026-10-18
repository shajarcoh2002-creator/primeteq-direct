"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Buy is shown as "coming soon" and is intentionally not a link.
export const MAIN_NAV = [
  { label: "Buy", href: null, soon: true },
  { label: "Sell", href: "/", soon: false },
] as const;

/** Which main section the current page belongs to. Everything is Sell for now. */
export function useSection() {
  const path = usePathname();
  return path.startsWith("/buy") ? "Buy" : "Sell";
}

export function MainNav() {
  const section = useSection();
  return (
    <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
      {MAIN_NAV.map((l) => {
        const current = l.label === section;
        const inner = (
          <>
            {l.label}
            {l.soon && (
              <span className="rounded-full bg-paper px-1.5 py-0.5 text-[9px] font-bold tracking-[0.06em] text-muted ring-1 ring-line">SOON</span>
            )}
            {current && <span className="absolute inset-x-4 -bottom-[23px] h-[3px] rounded-full bg-brand" />}
          </>
        );
        const cls = "relative flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-[0.08em]";
        return l.href ? (
          <Link
            key={l.label}
            href={l.href}
            aria-current={current ? "page" : undefined}
            className={`${cls} transition ${current ? "text-brand" : "text-ink hover:text-brand"}`}
          >
            {inner}
          </Link>
        ) : (
          <span key={l.label} aria-disabled="true" title="Coming soon" className={`${cls} cursor-default text-muted/70`}>
            {inner}
          </span>
        );
      })}
    </nav>
  );
}
