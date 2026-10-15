import { notFound } from "next/navigation";
import { getCategory, getModel } from "@/data/catalog";
import { FlowBar } from "@/components/FlowBar";
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
      <FlowBar category={category.id} current={0} />
      <section className="bg-paper">
        <div className="container-page py-8 md:py-12">
          <VariantPicker
            category={category.id}
            modelSlug={model.slug}
            modelName={model.name}
            carriers={category.carriers}
            storage={model.storage.map((s) => s.label)}
            kind={category.kind}
          />
        </div>
      </section>
    </>
  );
}
