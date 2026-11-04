import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/catalog";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/server";
import { DeviceArt } from "./DeviceArt";

export async function ComingSoon({ title, body }: { title: React.ReactNode; body: string }) {
  const t = await getDict();
  return (
    <>
      <section className="relative overflow-hidden bg-paper">
        <span aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border-[30px] border-brand/90 md:-right-20 md:-top-20 md:h-[420px] md:w-[420px] md:border-[38px]" />
        <div className="container-page relative py-16 md:py-24 lg:py-28">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-brand ring-1 ring-line">
            <span className="h-2 w-2 rounded-full bg-brand" aria-hidden />
            {t.soon.badge}
          </span>
          <h1 className="mt-6 max-w-3xl text-[34px] font-extrabold leading-[1.05] sm:text-5xl lg:text-[60px]">{title}</h1>
          <p className="mt-5 max-w-xl text-lg text-muted">{body}</p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/" className="btn btn-primary px-7">
              {t.soon.sell} <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/#how-it-works" className="btn btn-secondary">{t.soon.how}</Link>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-page py-14 md:py-20">
          <p className="eyebrow">{t.soon.eyebrow}</p>
          <h2 className="mt-3 text-3xl font-extrabold md:text-4xl">{t.soon.title}</h2>
          <div className="mt-10 grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/sell/${c.id}`}
                className="group card flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-[var(--shadow-lift)] md:p-6"
              >
                <DeviceArt category={c.id} className="h-20 self-start md:h-24" />
                <span className="font-display mt-5 text-lg font-extrabold">{c.name}</span>
                <span className="mt-3 flex items-center gap-1.5 text-sm font-semibold text-brand">
                  {fmt(t.home.sell, { name: c.shortName })} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
