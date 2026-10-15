import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { CATEGORIES, modelsIn } from "@/data/catalog";
import { DeviceArt } from "@/components/DeviceArt";
import { FlowBar } from "@/components/FlowBar";
import { ClosingCta, Faq, HowItWorks, TrustGrid } from "@/components/sections";
import { sellFaqs } from "@/components/faqs";

export default function Home() {
  return (
    <>
      <FlowBar current={0} />

      <section className="relative overflow-hidden bg-paper">
        <span aria-hidden className="pointer-events-none absolute -right-28 -top-28 hidden h-96 w-96 rounded-full border-[34px] border-brand/90 lg:block" />
        <div className="container-page relative py-12 md:py-16 lg:py-20">
          <h1 className="max-w-3xl text-[34px] font-extrabold leading-[1.05] sm:text-5xl lg:text-[60px]">
            Sell your <span className="text-brand">device</span>.
          </h1>
          <p className="mt-5 max-w-md text-lg text-muted">Pick your brand, find your model and see your offer.</p>

          <div id="choose" className="mt-10 grid scroll-mt-28 grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/sell/${c.id}`}
                className="group card flex flex-col p-5 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-[var(--shadow-lift)] md:p-6"
              >
                <DeviceArt category={c.id} className="h-24 self-start md:h-28" />
                <span className="font-display mt-5 text-lg font-extrabold md:text-xl">{c.name}</span>
                <span className="mt-1 text-sm text-muted">{modelsIn(c.id).length} models</span>
                <span className="mt-4 flex items-center gap-1.5 text-sm font-semibold text-brand">
                  Sell {c.shortName} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <TrustGrid />
      <Faq items={sellFaqs(null)} />
      <ClosingCta href="/sell/iphone" label="Choose your iPhone" />
    </>
  );
}
