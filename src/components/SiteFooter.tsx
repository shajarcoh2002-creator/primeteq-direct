import Link from "next/link";
import { CATEGORIES } from "@/data/catalog";
import { Logo } from "./Logo";

const COLUMNS = [
  { title: "Sell", links: CATEGORIES.map((c) => ({ label: `Sell ${c.name}`, href: `/sell/${c.id}` })) },
  {
    title: "Support",
    links: [
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Track Offer", href: "/track" },
      { label: "FAQ", href: "/#faq" },
    ],
  },
  {
    title: "Policies",
    links: [
      { label: "Terms of Service", href: "/terms" },
      { label: "Privacy Policy", href: "#", placeholder: true },
      { label: "Shipping & Payments", href: "#", placeholder: true },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div className="space-y-4">
          <Logo className="h-7 w-auto" />
          <p className="max-w-xs text-sm text-muted">Buy, sell, trade and upgrade your tech.</p>
          <div className="space-y-1 text-sm">
            <a href="https://primeteqdirect.com" className="font-semibold text-ink hover:text-brand">primeteqdirect.com</a>
            <p className="text-muted">
              Email: <span className="placeholder-note">Contact email — to confirm</span>
            </p>
            <p className="text-muted">
              Phone: <span className="placeholder-note">Support phone — to confirm</span>
            </p>
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold text-ink">{col.title}</h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-muted hover:text-brand">
                    {l.label}
                  </Link>
                  {"placeholder" in l && l.placeholder && <span className="placeholder-note ml-2">Placeholder</span>}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-muted">
          <span>© {new Date().getFullYear()} Prime Teq. All rights reserved.</span>
          <span>iPhone and iPad are trademarks of Apple Inc. Other product names belong to their respective owners.</span>
        </div>
      </div>
    </footer>
  );
}
