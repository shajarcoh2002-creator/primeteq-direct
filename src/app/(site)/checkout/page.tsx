import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { quoteById } from "@/lib/db";
import { DROPOFF_LOCATIONS, PANAMA_BANKS, mapsUrl } from "@/lib/locations";
import { parseAnswers } from "@/lib/quote-params";
import { FlowBar } from "@/components/FlowBar";
import { getDevicePhoto } from "@/lib/photos";
import { QuoteSummary } from "@/components/QuoteSummary";
import { fmt } from "@/i18n/config";
import { getDict } from "@/i18n/server";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: (await getDict()).meta.checkout };
}

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : null);
  const [data, t] = await Promise.all([quoteById(get("v") ?? ""), getDict()]);
  const parsed = parseAnswers(get);
  if (!data || !parsed) notFound();

  const offer = data.quote.offers[parsed.condition];
  const photo = await getDevicePhoto(data.model.slug);
  const hidden = { v: get("v")!, p: get("p") ?? "", f: get("f") ?? "", n: get("n") ?? "", k: get("k") ?? "" };
  const carrierTitle = data.category.kind === "tablet" ? t.picker.connectivity : t.picker.carrier;
  const locations = DROPOFF_LOCATIONS.map((l) => ({ ...l, maps: mapsUrl(l) }));

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
              <ArrowLeft className="h-4 w-4" /> {t.checkout.editCondition}
            </Link>
            <h1 className="mt-4 text-[28px] font-extrabold leading-tight md:text-4xl">{t.checkout.title}</h1>
            <p className="mt-2 text-muted">{t.checkout.lead}</p>
            <CheckoutForm hidden={hidden} locations={locations} banks={PANAMA_BANKS} />
          </div>
          <QuoteSummary
            category={data.category.id}
            photo={photo}
            title={data.model.name}
            rows={[
              { label: carrierTitle, value: t.carriers[data.carrier] },
              { label: t.summary.storage, value: data.storage.label },
              { label: t.summary.condition, value: t.conditions[parsed.condition] },
            ]}
            offer={offer}
            footer={fmt(t.checkout.validFor, { days: data.settings.offerValidDays })}
          />
        </div>
      </section>
    </>
  );
}
