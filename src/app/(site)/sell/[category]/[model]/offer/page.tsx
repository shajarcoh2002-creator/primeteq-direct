import Link from "next/link";
import { notFound } from "next/navigation";
import { CARRIER_LABELS } from "@/data/catalog";
import { quoteById } from "@/lib/db";
import { DeviceArt } from "@/components/DeviceArt";
import { Steps } from "@/components/Steps";
import { Questionnaire } from "./Questionnaire";

export const dynamic = "force-dynamic";
export const metadata = { title: "Get your offer" };

export default async function OfferPage({ searchParams }: PageProps<"/sell/[category]/[model]/offer">) {
  const v = (await searchParams).v;
  const data = typeof v === "string" ? await quoteById(v) : null;
  if (!data) notFound();
  const { model, storage, carrier, category, quote } = data;

  return (
    <>
      <Steps current={1} />
      <section className="container-page py-10">
        <div className="flex items-center gap-5 border-b border-line pb-6">
          <DeviceArt category={category.id} className="h-20 shrink-0" />
          <div>
            <h1 className="text-xl font-extrabold sm:text-2xl">
              {model.name} {storage.label} ({CARRIER_LABELS[carrier]})
            </h1>
            <Link href={`/sell/${category.id}/${model.slug}`} className="text-sm font-semibold text-brand hover:underline">
              Change model
            </Link>
          </div>
        </div>
        <Questionnaire variant={v as string} offers={quote.offers} kind={category.kind} brand={category.id} />
      </section>
    </>
  );
}
