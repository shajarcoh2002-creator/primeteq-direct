import { notFound } from "next/navigation";
import { getCategory, modelsIn } from "@/data/catalog";
import { getOverrides, getSettings } from "@/lib/db";
import { quoteVariant } from "@/lib/pricing";
import { Steps } from "@/components/Steps";
import { ModelGrid } from "./ModelGrid";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: PageProps<"/sell/[category]">) {
  const category = getCategory((await params).category);
  return { title: category ? `Sell your ${category.name}` : "Sell" };
}

export default async function CategoryPage({ params }: PageProps<"/sell/[category]">) {
  const category = getCategory((await params).category);
  if (!category) notFound();

  const [settings, overrides] = await Promise.all([getSettings(), getOverrides()]);
  const best = category.carriers.includes("unlocked") ? "unlocked" : "cellular";
  const models = modelsIn(category.id).map((m) => ({
    slug: m.slug,
    name: m.name,
    upTo: Math.max(...m.storage.map((s) => quoteVariant(m, s, best, settings, overrides).offers.flawless)),
  }));

  return (
    <>
      <Steps current={0} />
      <section className="container-page py-10">
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">Sell your {category.name}</h1>
        <p className="mt-2 text-muted">It takes just a few minutes. Which model do you have?</p>
        <ModelGrid category={category.id} models={models} />
      </section>
    </>
  );
}
