import Link from "next/link";
import { notFound } from "next/navigation";
import { CARRIER_LABELS } from "@/data/catalog";
import { type OrderStatus, STATUS_LABELS, getOrder } from "@/lib/db";
import { CONDITION_LABELS } from "@/lib/pricing";
import { updateOrder } from "../../../actions";

const yn = (v: boolean) => (v ? "Yes" : "No");

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const order = await getOrder((await params).id);
  if (!order) notFound();
  const { item, customer, address, payout } = order;

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-sm font-semibold text-brand hover:underline">← Orders</Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold">{order.id}</h1>
          <p className="text-sm text-muted">
            Created {new Date(order.createdAt).toLocaleString("en-US")} · Offer valid until {new Date(order.expiresAt).toLocaleDateString("en-US")}
          </p>
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">{STATUS_LABELS[order.status].admin}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-bold">Device</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div><dt className="inline text-muted">Model: </dt><dd className="inline font-semibold">{item.modelName} {item.storage}</dd></div>
            <div><dt className="inline text-muted">Carrier: </dt><dd className="inline">{CARRIER_LABELS[item.carrier]}</dd></div>
            <div><dt className="inline text-muted">Stated condition: </dt><dd className="inline">{CONDITION_LABELS[item.condition]}</dd></div>
            <div><dt className="inline text-muted">Powers on: </dt><dd className="inline">{yn(item.answers.powersOn)}</dd></div>
            <div><dt className="inline text-muted">Fully functional: </dt><dd className="inline">{yn(item.answers.functional)}</dd></div>
            <div><dt className="inline text-muted">No cracks: </dt><dd className="inline">{yn(item.answers.noCracks)}</dd></div>
            <div className="pt-2"><dt className="inline text-muted">Quoted offer: </dt><dd className="inline text-lg font-bold text-cash">${item.quotedPrice}</dd></div>
            {order.finalPrice !== null && (
              <div><dt className="inline text-muted">Final price: </dt><dd className="inline text-lg font-bold">${order.finalPrice}</dd></div>
            )}
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-bold">Customer</h2>
          <div className="mt-3 space-y-1 text-sm">
            <p className="font-semibold">{customer.name}</p>
            <p>{customer.email}</p>
            {customer.phone && <p>{customer.phone}</p>}
            <p className="pt-2 text-muted">Address (shipping label)</p>
            <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
            <p>{address.city}, {address.state} {address.zip}</p>
            <p className="pt-2 text-muted">Payout</p>
            <p className="font-semibold">
              {payout.method === "check" ? "Check by mail" : `${payout.method === "paypal" ? "PayPal" : "Zelle"}: ${payout.handle}`}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-bold">Update</h2>
          <form action={updateOrder} className="mt-3 space-y-3">
            <input type="hidden" name="id" value={order.id} />
            <div>
              <label className="label" htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={order.status} className="field">
                {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s].admin}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="finalPrice">Final price / counter-offer (USD)</label>
              <input id="finalPrice" name="finalPrice" defaultValue={order.finalPrice ?? ""} placeholder={`${item.quotedPrice}`} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="note">Note</label>
              <textarea id="note" name="note" rows={3} className="field" placeholder="e.g. deep scratches on screen, IMEI verified…" />
            </div>
            <button className="btn btn-primary w-full">Save</button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-bold">History</h2>
        <ul className="mt-3 divide-y divide-line text-sm">
          {[...order.history].reverse().map((h, i) => (
            <li key={i} className="flex flex-wrap gap-x-4 py-2">
              <span className="w-40 text-muted">{new Date(h.at).toLocaleString("en-US")}</span>
              <span className="font-semibold">{STATUS_LABELS[h.status].admin}</span>
              {h.note && <span className="text-muted">— {h.note}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
