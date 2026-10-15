import Link from "next/link";
import { CATEGORIES } from "@/data/catalog";
import { Logo } from "./Logo";

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-ink text-white/70">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-3">
        <div className="space-y-3">
          <Logo light />
          <p className="max-w-xs text-sm">Sell your phone or tablet for cash. Instant offer, free shipping, fast payment.</p>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Sell</h3>
          <ul className="space-y-2 text-sm">
            {CATEGORIES.map((c) => (
              <li key={c.id}>
                <Link href={`/sell/${c.id}`} className="hover:text-white">Sell {c.name}</Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="mb-3 text-sm font-semibold text-white">Support</h3>
          <ul className="space-y-2 text-sm">
            <li><Link href="/#how-it-works" className="hover:text-white">How it works</Link></li>
            <li><Link href="/track" className="hover:text-white">Track your offer</Link></li>
            <li><Link href="/#faq" className="hover:text-white">FAQ</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms &amp; price promise</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-5 text-center text-xs">© {new Date().getFullYear()} PrimeTeq Direct. All rights reserved.</div>
    </footer>
  );
}
