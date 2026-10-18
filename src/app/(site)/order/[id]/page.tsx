import { notFound } from "next/navigation";
import { CheckCircle2, Circle } from "lucide-react";
import { CARRIER_LABELS, parseVariantId } from "@/data/catalog";
import { STATUS_LABELS, getOrder } from "@/lib/db";
import { CONDITION_LABELS } from "@/lib/pricing";
import { FlowBar } from "@/components/FlowBar";
import { POLICY } from "@/lib/policy";
import { getDevicePhoto } from "@/lib/photos";
import { QuoteSummary } from "@/components/QuoteSummary";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your order" };

const PREP = [
  "Back up your data.",
  "Sign out of your Apple, Google or Samsung account and turn off device-finding features (such as Find My).",
  "Erase the device (factory reset).",
  "Remove the SIM card.",
];

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default async function OrderPage({ params, searchParams }: PageProps<"/order/[id]">) {
  const order = await getOrder((await params).id);
  if (!order) notFound();
  const isNew = (await searchParams).new === "1";
  const variant = parseVariantId(order.item.variantId);
  const category = variant?.category.id ?? "iphone";
  const price = order.finalPrice ?? order.item.quotedPrice;
  const photo = variant ? await getDevicePhoto(variant.model.slug) : null;

  return (
    <>
      <FlowBar category={category} current={3} />
      <section className="bg-paper">
        <div className="container-page grid gap-8 py-8 md:py-12 lg:grid-cols-[1fr_360px]">
          <div className="space-y-4">
            {isNew && (
              <div className="card flex items-start gap-4 border-brand/30 p-5 md:p-6">
                <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-brand" />
                <div>
                  <p className="font-display text-lg font-bold">Offer accepted.</p>
                  <p className="mt-1 text-sm text-muted">
                    Your order number is <strong className="text-ink">{order.id}</strong>. We’ll email your free prepaid shipping label and instructions to {order.customer.email} within {POLICY.labelWithin}. Keep your order
                    number to track it.
                  </p>
                </div>
              </div>
            )}

            <div className="card p-5 md:p-8">
              <p className="eyebrow">Order {order.id}</p>
              <h1 className="mt-2 text-[28px] font-extrabold leading-tight md:text-4xl">{STATUS_LABELS[order.status].en}</h1>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-line p-5">
                  <h2 className="font-display text-lg font-bold">Prepare your device</h2>
                  <ol className="mt-3 space-y-2 text-sm text-ink-2">
                    {PREP.map((p, i) => (
                      <li key={p} className="flex gap-3">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-paper text-[11px] font-bold text-muted">{i + 1}</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-2xl border border-line p-5">
                  <h2 className="font-display text-lg font-bold">Send your device</h2>
                  <p className="mt-3 text-sm text-ink-2">
                    Your free prepaid shipping label and instructions arrive by email within {POLICY.labelWithin}. Pack the device securely, attach the label and drop it off with the carrier shown on it.
                  </p>
                  <p className="mt-3 text-sm text-ink-2">
                    This offer is valid until <strong>{fmtDate(order.expiresAt)}</strong>.
                  </p>
                </div>
              </div>

              <h2 className="font-display mt-10 text-lg font-bold">History</h2>
              <ol className="mt-4 space-y-4">
                {[...order.history].reverse().map((h, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    {i === 0 ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted" />}
                    <div>
                      <p className="font-semibold">{STATUS_LABELS[h.status].en}</p>
                      <p className="text-muted">{fmtDate(h.at)}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <QuoteSummary
            category={category}
            photo={photo}
            title={order.item.modelName}
            rows={[
              { label: variant?.category.kind === "tablet" ? "Connectivity" : "Carrier", value: CARRIER_LABELS[order.item.carrier] },
              { label: "Storage", value: order.item.storage },
              { label: "Condition", value: CONDITION_LABELS[order.item.condition] },
              { label: "Payment", value: order.payout.method === "check" ? "Check by mail" : order.payout.method === "paypal" ? "PayPal" : "Zelle" },
            ]}
            offer={price}
            footer={order.finalPrice !== null ? "Final amount after inspection." : undefined}
          />
        </div>
      </section>
    </>
  );
}
