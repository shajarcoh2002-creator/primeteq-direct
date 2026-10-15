import Link from "next/link";
import { Logo } from "./Logo";
import { MobileMenu } from "./MobileMenu";

// BUY / TRADE / Account are not built yet — placeholders until those sections exist.
export const MAIN_NAV = [
  { label: "Buy", href: "#", placeholder: true },
  { label: "Sell", href: "/", current: true },
  { label: "Trade", href: "#", placeholder: true },
];

export const UTILITY_NAV = [
  { label: "How It Works", href: "/#how-it-works" },
  { label: "Track Offer", href: "/track" },
  { label: "Help", href: "/#faq" },
  { label: "Account", href: "#", placeholder: true },
];

export function SiteHeader() {
  return (
    <>
      <div className="hidden border-b border-line bg-paper md:block">
        <nav aria-label="Utility" className="container-page flex h-8 items-center justify-end gap-6 text-xs font-medium text-ink-2">
          {UTILITY_NAV.map((l) => (
            <Link key={l.label} href={l.href} className="hover:text-brand" aria-disabled={l.placeholder || undefined}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[76px]">
          <Logo />
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {MAIN_NAV.map((l) => (
              <Link
                key={l.label}
                href={l.href}
                aria-current={l.current ? "page" : undefined}
                aria-disabled={l.placeholder || undefined}
                className={`relative rounded-lg px-4 py-2 text-sm font-bold uppercase tracking-[0.08em] transition ${
                  l.current ? "text-brand" : "text-ink hover:text-brand"
                }`}
              >
                {l.label}
                {l.current && <span className="absolute inset-x-4 -bottom-[17px] h-[3px] rounded-full bg-brand md:-bottom-[23px]" />}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/sell/iphone" className="btn btn-primary !min-h-10 !px-4 !py-2 text-sm">Sell now</Link>
            <MobileMenu main={MAIN_NAV} utility={UTILITY_NAV} />
          </div>
        </div>
      </header>
    </>
  );
}
