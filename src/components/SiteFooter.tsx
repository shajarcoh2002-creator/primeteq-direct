import Link from "next/link";
import { CATEGORIES } from "@/data/catalog";
import { Mail } from "lucide-react";
import { CONTACT } from "@/lib/contact";
import { InstagramIcon } from "./InstagramIcon";
import { Logo } from "./Logo";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/server";

export async function SiteFooter() {
  const t = await getDict();
  const COLUMNS = [
    { title: t.footer.sell, links: CATEGORIES.map((c) => ({ label: fmt(t.home.sell, { name: c.name }), href: `/sell/${c.id}` })) },
    {
      title: t.footer.support,
      links: [
        { label: t.nav.howItWorks, href: "/#how-it-works" },
        { label: t.nav.trackOffer, href: "/track" },
        { label: t.footer.faq, href: "/#faq" },
      ],
    },
    {
      title: t.footer.policies,
      links: [
        { label: t.footer.terms, href: "/terms" },
        { label: t.footer.privacy, href: "/privacy" },
        { label: t.footer.shipping, href: "/shipping-payments" },
      ],
    },
  ];
  return (
    <footer className="border-t border-line bg-white">
      <div className="container-page grid grid-cols-2 gap-x-6 gap-y-9 py-10 md:grid-cols-[1.4fr_1fr_1fr_1fr] md:gap-10 md:py-14">
        <div className="col-span-2 space-y-4 md:col-span-1">
          <Logo className="h-7 w-auto" />
          <p className="max-w-xs text-sm text-muted">{t.footer.tagline}</p>
          <div className="space-y-2 text-sm">
            <a href={`https://${CONTACT.website}`} className="block font-semibold text-ink hover:text-brand">{CONTACT.website}</a>
            <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-2 text-muted hover:text-brand">
              <Mail className="h-4 w-4" /> {CONTACT.email}
            </a>
            <a href={CONTACT.instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-muted hover:text-brand">
              <InstagramIcon /> {CONTACT.instagramHandle}
            </a>
          </div>
        </div>
        {COLUMNS.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold text-ink">{col.title}</h3>
            <ul className="mt-3 space-y-2 text-sm md:mt-4 md:space-y-2.5">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-muted hover:text-brand">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-line">
        <div className="container-page flex flex-wrap items-center justify-between gap-2 py-5 text-xs text-muted">
          <span>© {new Date().getFullYear()} Prime Teq. {t.footer.rights}</span>
          <span>{t.footer.trademarks}</span>
        </div>
      </div>
    </footer>
  );
}
