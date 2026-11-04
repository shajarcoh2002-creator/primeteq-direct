import { notFound } from "next/navigation";
import { quoteById } from "@/lib/db";
import { FlowBar } from "@/components/FlowBar";
import { getDevicePhoto } from "@/lib/photos";
import { getDict } from "@/i18n/server";
import { Questionnaire } from "./Questionnaire";

export const dynamic = "force-dynamic";
export async function generateMetadata() {
  return { title: (await getDict()).meta.getOffer };
}

export default async function OfferPage({ searchParams }: PageProps<"/sell/[category]/[model]/offer">) {
  const v = (await searchParams).v;
  const data = typeof v === "string" ? await quoteById(v) : null;
  if (!data) notFound();
  const { model, storage, carrier, category, quote } = data;
  const photo = await getDevicePhoto(model.slug);

  return (
    <>
      <FlowBar category={category.id} current={1} />
      <section className="bg-paper">
        <div className="container-page py-8 md:py-12">
          <Questionnaire
            variant={v as string}
            offers={quote.offers}
            kind={category.kind}
            category={category.id}
            modelSlug={model.slug}
            modelName={model.name}
            photo={photo}
            storage={storage.label}
            carrier={carrier}
          />
        </div>
      </section>
    </>
  );
}
