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
        <div className="container-page relative py-9 md:py-16 lg:py-20">
          <h1 className="max-w-3xl text-[34px] font-extrabold leading-[1.05] sm:text-5xl lg:text-[60px]">
            Sell your <span className="text-brand">device</span>.
          </h1>
          <p className="mt-3 max-w-md text-base text-muted sm:mt-5 sm:text-lg">Pick your brand, find your model and see your offer.</p>

          <div id="choose" className="mt-8 grid scroll-mt-28 gap-2.5 sm:mt-10 sm:grid-cols-2 sm:gap-3 md:gap-4 lg:grid-cols-4">
            {CATEGORIES.map((c) => (
              <Link
                key={c.id}
                href={`/sell/${c.id}`}
                className="group card flex items-center gap-4 p-3.5 transition hover:border-brand sm:flex-col sm:items-start sm:gap-0 sm:p-5 sm:hover:-translate-y-0.5 sm:hover:shadow-[var(--shadow-lift)] md:p-6"
              >
                <DeviceArt category={c.id} className="h-14 shrink-0 sm:h-24 md:h-28" />
                <span className="min-w-0 flex-1">
                  <span className="font-display block text-lg font-extrabold sm:mt-5 md:text-xl">{c.name}</span>
                  <span className="block text-sm text-muted sm:mt-1">{modelsIn(c.id).length} models</span>
                  <span className="mt-4 hidden items-center gap-1.5 text-sm font-semibold text-brand sm:flex">
                    Sell {c.shortName} <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
                  </span>
                </span>
                <ArrowRight className="h-5 w-5 shrink-0 text-brand sm:hidden" />
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
