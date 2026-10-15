import { notFound } from "next/navigation";
import { CARRIER_LABELS } from "@/data/catalog";
import { quoteById } from "@/lib/db";
import { CONDITION_LABELS } from "@/lib/pricing";
import { parseAnswers } from "@/lib/quote-params";
import { DeviceArt } from "@/components/DeviceArt";
import { Steps } from "@/components/Steps";
import { CheckoutForm } from "./CheckoutForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Get paid" };

export default async function CheckoutPage({ searchParams }: PageProps<"/checkout">) {
  const sp = await searchParams;
  const get = (k: string) => (typeof sp[k] === "string" ? (sp[k] as string) : null);
  const data = await quoteById(get("v") ?? "");
  const parsed = parseAnswers(get);
  if (!data || !parsed) notFound();

  const offer = data.quote.offers[parsed.condition];
  const hidden = { v: get("v")!, p: get("p") ?? "", f: get("f") ?? "", n: get("n") ?? "", k: get("k") ?? "" };

  return (
    <>
      <Steps current={2} />
      <section className="container-page grid gap-10 py-10 lg:grid-cols-[1fr_340px]">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Almost done</h1>
          <p className="mt-1 text-muted">Tell us how to pay you and where to send your free shipping label.</p>
          <CheckoutForm hidden={hidden} />
        </div>
        <aside className="h-fit rounded-2xl border border-line bg-paper p-6 lg:sticky lg:top-32">
          <p className="text-sm font-semibold uppercase tracking-wider text-muted">Your device</p>
          <div className="mt-4 flex items-center gap-4">
            <DeviceArt category={data.category.id} className="h-16 shrink-0" />
            <div className="text-sm">
              <p className="font-bold">{data.model.name}</p>
              <p className="text-muted">{data.storage.label} · {CARRIER_LABELS[data.carrier]}</p>
              <p className="text-muted">{CONDITION_LABELS[parsed.condition]}</p>
            </div>
          </div>
          <div className="mt-6 flex items-end justify-between border-t border-line pt-4">
            <span className="font-semibold">Your offer</span>
            <span className="text-3xl font-extrabold text-cash">${offer.toLocaleString("en-US")}</span>
          </div>
          <p className="mt-2 text-xs text-muted">Free shipping. Offer locked for {data.settings.offerValidDays} days.</p>
        </aside>
      </section>
    </>
  );
}
