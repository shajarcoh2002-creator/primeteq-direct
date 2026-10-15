import Link from "next/link";
import { notFound } from "next/navigation";
import { getModel } from "@/data/catalog";
import { getCategory } from "@/data/catalog";
import { DeviceArt } from "@/components/DeviceArt";
import { Steps } from "@/components/Steps";
import { VariantPicker } from "./VariantPicker";

export async function generateMetadata({ params }: PageProps<"/sell/[category]/[model]">) {
  const model = getModel((await params).model);
  return { title: model ? `Sell your ${model.name}` : "Sell" };
}

export default async function ModelPage({ params }: PageProps<"/sell/[category]/[model]">) {
  const p = await params;
  const model = getModel(p.model);
  const category = getCategory(p.category);
  if (!model || !category || model.category !== category.id) notFound();

  return (
    <>
      <Steps current={0} />
      <section className="container-page py-10">
        <div className="flex items-center gap-6 rounded-2xl bg-paper p-6">
          <DeviceArt category={category.id} className="h-28 shrink-0" />
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Great! You selected your {model.name}.</h1>
            <p className="mt-1 text-muted">It takes just a few minutes to sell it.</p>
            <Link href={`/sell/${category.id}`} className="mt-2 inline-block text-sm font-semibold text-brand hover:underline">
              Change model
            </Link>
          </div>
        </div>
        <VariantPicker
          category={category.id}
          modelSlug={model.slug}
          carriers={category.carriers}
          storage={model.storage.map((s) => s.label)}
          kind={category.kind}
        />
      </section>
    </>
  );
}
