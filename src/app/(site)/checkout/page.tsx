import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { CARRIER_LABELS } from "@/data/catalog";
import { quoteById } from "@/lib/db";
import { CONDITION_LABELS } from "@/lib/pricing";
import { parseAnswers } from "@/lib/quote-params";
import { FlowBar } from "@/components/FlowBar";
import { getDevicePhoto } from "@/lib/photos";
import { QuoteSummary } from "@/components/QuoteSummary";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Payment & shipping details" };

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : null);
  const data = await quoteById(get("v") ?? "");
  const parsed = parseAnswers(get);
  if (!data || !parsed) notFound();

  const offer = data.quote.offers[parsed.condition];
  const photo = await getDevicePhoto(data.model.slug);
  const hidden = { v: get("v")!, p: get("p") ?? "", f: get("f") ?? "", n: get("n") ?? "", k: get("k") ?? "" };
  const carrierTitle = data.category.kind === "tablet" ? "Connectivity" : "Carrier";

  return (
    <>
      <FlowBar category={data.category.id} current={2} />
      <section className="bg-paper">
        <div className="container-page grid gap-8 py-8 md:py-12 lg:grid-cols-[1fr_360px]">
          <div className="card p-5 md:p-8">
            <Link
              href={`/sell/${data.category.id}/${data.model.slug}/offer?v=${hidden.v}`}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink"
            >
              <ArrowLeft className="h-4 w-4" /> Edit condition
            </Link>
            <h1 className="mt-4 text-[28px] font-extrabold leading-tight md:text-4xl">Almost done.</h1>
            <p className="mt-2 text-muted">Tell us how you’d like to be paid and where you’ll ship from.</p>
            <CheckoutForm hidden={hidden} />
          </div>
          <QuoteSummary
            category={data.category.id}
            photo={photo}
            title={data.model.name}
            rows={[
              { label: carrierTitle, value: CARRIER_LABELS[data.carrier] },
              { label: "Storage", value: data.storage.label },
              { label: "Condition", value: CONDITION_LABELS[parsed.condition] },
            ]}
            offer={offer}
            footer={`Offer valid for ${data.settings.offerValidDays} days after you accept it.`}
          />
        </div>
      </section>
    </>
  );
}
