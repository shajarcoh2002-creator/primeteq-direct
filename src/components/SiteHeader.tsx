import Link from "next/link";
import { CATEGORIES } from "@/data/catalog";
import { Logo } from "./Logo";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-line bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Logo />
        <nav className="flex items-center gap-1 text-sm font-medium text-muted sm:gap-4">
          <Link href="/#how-it-works" className="hidden px-2 py-1 hover:text-ink sm:block">How it works</Link>
          <Link href="/track" className="px-2 py-1 hover:text-ink">Track offer</Link>
          <Link href="/#faq" className="hidden px-2 py-1 hover:text-ink sm:block">Help</Link>
        </nav>
      </div>
      <div className="bg-ink">
        <nav className="container-page flex gap-5 overflow-x-auto py-2.5 text-xs font-semibold uppercase tracking-wide text-white/80 sm:gap-8">
          {CATEGORIES.map((c) => (
            <Link key={c.id} href={`/sell/${c.id}`} className="whitespace-nowrap hover:text-white">
              Sell {c.shortName}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
