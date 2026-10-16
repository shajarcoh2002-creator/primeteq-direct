import Link from "next/link";
import { redirect } from "next/navigation";
import { logout, requireAdmin } from "@/lib/auth";
import { Logo } from "@/components/Logo";

export const dynamic = "force-dynamic";
export const metadata = { title: "Admin" };

const NAV = [
  { href: "/admin", label: "Orders" },
  { href: "/admin/pricing", label: "Pricing formula" },
  { href: "/admin/catalog", label: "Catalog & prices" },
  { href: "/admin/calibration", label: "Calibration" },
];

async function signOut() {
  "use server";
  await logout();
  redirect("/admin/login");
}

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <div className="flex min-h-screen flex-col bg-paper">
      <header className="border-b border-line bg-white">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-3">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="rounded-full bg-ink px-2.5 py-0.5 text-xs font-semibold text-white">Admin</span>
          </div>
          <nav className="flex flex-wrap items-center gap-1 text-sm font-medium">
            {NAV.map((n) => (
              <Link key={n.href} href={n.href} className="rounded-lg px-3 py-1.5 text-ink-2 hover:bg-paper">{n.label}</Link>
            ))}
            <Link href="/" target="_blank" className="rounded-lg px-3 py-1.5 text-muted hover:bg-paper">View site ↗</Link>
            <form action={signOut}>
              <button className="rounded-lg px-3 py-1.5 text-muted hover:bg-paper">Sign out</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="container-page flex-1 py-8">{children}</main>
    </div>
  );
}
