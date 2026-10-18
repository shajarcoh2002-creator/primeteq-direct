import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategory, groupLabel, modelsIn } from "@/data/catalog";
import { getOverrides, getSettings } from "@/lib/db";
import { getDevicePhotos } from "@/lib/photos";
import { quoteVariant } from "@/lib/pricing";
import { HeroTeaser } from "@/components/DeviceArt";
import { FlowBar } from "@/components/FlowBar";
import { ClosingCta, Faq, HowItWorks, TrustGrid } from "@/components/sections";
import { sellFaqs } from "@/components/faqs";
import { ModelGrid } from "./ModelGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/sell/[category]">) {
  const category = getCategory((await params).category);
  return { title: category ? `Sell your ${category.name}` : "Sell" };
}

export default async function CategoryPage({ params }: PageProps<"/sell/[category]">) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  const [settings, overrides, photos] = await Promise.all([getSettings(), getOverrides(), getDevicePhotos()]);
  const best = category.carriers.includes("unlocked") ? "unlocked" : "cellular";
  const models = modelsIn(category.id).map((m) => ({
    slug: m.slug,
    name: m.name,
    group: groupLabel(m),
    photo: photos[m.slug] ?? null,
    storage: m.storage.map((s) => s.label),
    upTo: Math.max(...m.storage.map((s) => quoteVariant(m, s, best, settings, overrides).offers.flawless)),
  }));

  return (
    <>
      <FlowBar category={category.id} current={0} />

      <section className="relative overflow-hidden bg-paper">
        <div className="container-page grid items-center gap-12 py-10 md:py-12 lg:grid-cols-[1.15fr_1fr] lg:py-14">
          <div>
            <h1 className="text-[34px] font-extrabold leading-[1.05] sm:text-5xl lg:text-[60px]">
              Sell your <span className="text-brand">{category.name}</span>.
            </h1>
            <p className="mt-5 max-w-md text-lg text-muted">Find your model and see your offer.</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="#models" className="btn btn-primary px-7">Choose your model</Link>
              <Link href="#which-model" className="text-sm font-semibold text-ink underline decoration-line decoration-2 underline-offset-4 hover:decoration-brand">
                Which model do I have?
              </Link>
            </div>
          </div>
          <div className="hidden lg:block">
            <HeroTeaser category={category.id} deviceLabel={category.name} />
          </div>
        </div>
      </section>

      <section id="models" className="scroll-mt-28 bg-white">
        <div className="container-page py-12 md:py-16">
          <ModelGrid category={category.id} categoryName={category.name} models={models} />
        </div>
      </section>

      <HowItWorks />
      <TrustGrid />
      <Faq items={sellFaqs(category.id, settings.offerValidDays)} />
      <ClosingCta href="#models" label={`Choose your ${category.name}`} />
    </>
  );
}
