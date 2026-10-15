import { notFound } from "next/navigation";
import { CheckCircle2, Clock } from "lucide-react";
import { CARRIER_LABELS } from "@/data/catalog";
import { STATUS_LABELS, getOrder } from "@/lib/db";
import { CONDITION_LABELS } from "@/lib/pricing";
import { Steps } from "@/components/Steps";

export const dynamic = "force-dynamic";
export const metadata = { title: "Your offer" };

const PREP = [
  "Back up your data.",
  "Sign out of iCloud / Google / Samsung account and turn off Find My (Activation Lock).",
  "Factory reset the device.",
  "Remove the SIM card.",
  "Don't include cases, chargers, cables or boxes — just the device.",
];

const fmtDate = (iso: string) => new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });

export default async function OrderPage({ params, searchParams }: PageProps<"/order/[id]">) {
  const order = await getOrder((await params).id);
  if (!order) notFound();
  const isNew = (await searchParams).new === "1";
  const price = order.finalPrice ?? order.item.quotedPrice;

  return (
    <>
      <Steps current={3} />
      <section className="container-page py-10">
        {isNew && (
          <div className="mb-8 flex items-start gap-3 rounded-2xl bg-cash-soft p-5">
            <CheckCircle2 className="mt-0.5 h-6 w-6 shrink-0 text-cash" />
            <div>
              <p className="font-bold">Offer accepted! Your order number is {order.id}.</p>
              <p className="text-sm text-muted">
                We&apos;ll email your prepaid shipping label to {order.customer.email} within 1 business day. Save your order number to track it.
              </p>
            </div>
          </div>
        )}

        <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
          <div className="space-y-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-muted">Order {order.id}</p>
              <h1 className="mt-1 text-3xl font-extrabold tracking-tight">{STATUS_LABELS[order.status].en}</h1>
            </div>

            <div className="rounded-2xl border border-line p-6">
              <h2 className="text-lg font-bold">Prepare your device</h2>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-muted">
                {PREP.map((p) => <li key={p}>{p}</li>)}
              </ol>
            </div>

            <div className="rounded-2xl border border-line p-6">
              <h2 className="text-lg font-bold">Ship it for free</h2>
              <p className="mt-2 text-sm text-muted">
                Pack your device securely in any small box with padding, attach the prepaid label we email you, and drop it at any USPS location. Ship before{" "}
                <strong className="text-ink">{fmtDate(order.expiresAt)}</strong> to keep your offer.
              </p>
            </div>

            <div>
              <h2 className="text-lg font-bold">History</h2>
              <ul className="mt-3 space-y-3">
                {[...order.history].reverse().map((h, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted" />
                    <div>
                      <p className="font-semibold">{STATUS_LABELS[h.status].en}</p>
                      <p className="text-muted">{fmtDate(h.at)}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="h-fit rounded-2xl border border-line bg-paper p-6">
            <p className="text-sm font-semibold uppercase tracking-wider text-muted">Summary</p>
            <p className="mt-3 font-bold">{order.item.modelName}</p>
            <p className="text-sm text-muted">{order.item.storage} · {CARRIER_LABELS[order.item.carrier]}</p>
            <p className="text-sm text-muted">{CONDITION_LABELS[order.item.condition]}</p>
            <div className="mt-5 flex items-end justify-between border-t border-line pt-4">
              <span className="font-semibold">{order.finalPrice !== null ? "Final offer" : "Your offer"}</span>
              <span className="text-3xl font-extrabold text-cash">${price.toLocaleString("en-US")}</span>
            </div>
            <p className="mt-3 text-sm text-muted">
              Payment: {order.payout.method === "check" ? "Check by mail" : order.payout.method === "paypal" ? "PayPal" : "Zelle"}
            </p>
            <p className="text-sm text-muted">Offer valid until {fmtDate(order.expiresAt)}</p>
          </aside>
        </div>
      </section>
    </>
  );
}
