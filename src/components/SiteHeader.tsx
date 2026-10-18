import Link from "next/link";
import { Logo } from "./Logo";
import { MainNav } from "./MainNav";
import { MobileMenu } from "./MobileMenu";

// Account is not built yet — placeholder until it exists.
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
          <MainNav />
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/sell/iphone" className="btn btn-primary !min-h-10 whitespace-nowrap !px-4 !py-2 text-sm">Sell now</Link>
            <MobileMenu utility={UTILITY_NAV} />
          </div>
        </div>
      </header>
    </>
  );
}
