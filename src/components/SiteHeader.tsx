import Link from "next/link";
import { getDict } from "@/i18n/server";
import type { Dict } from "@/i18n/en";
import { LanguageToggle } from "./LanguageToggle";
import { Logo } from "./Logo";
import { MainNav } from "./MainNav";
import { MobileMenu } from "./MobileMenu";

// Account is not built yet — placeholder until it exists.
export const utilityNav = (t: Dict) => [
  { label: t.nav.howItWorks, href: "/#how-it-works" },
  { label: t.nav.trackOffer, href: "/track" },
  { label: t.nav.help, href: "/#faq" },
  { label: t.nav.account, href: "#", placeholder: true },
];

export async function SiteHeader() {
  const t = await getDict();
  const utility = utilityNav(t);
  return (
    <>
      <div className="border-b border-line bg-paper">
        <div className="container-page flex h-9 items-center justify-end gap-6 text-xs font-medium text-ink-2">
          <nav aria-label="Utility" className="hidden items-center gap-6 md:flex">
            {utility.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-brand" aria-disabled={l.placeholder || undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <LanguageToggle />
        </div>
      </div>
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <div className="container-page flex h-16 items-center justify-between gap-6 md:h-[76px]">
          <Logo />
          <MainNav />
          <div className="flex items-center gap-2 md:hidden">
            <Link href="/sell/iphone" className="btn btn-primary !min-h-10 whitespace-nowrap !px-4 !py-2 text-sm">{t.nav.sellNow}</Link>
            <MobileMenu utility={utility} />
          </div>
        </div>
      </header>
    </>
  );
}
