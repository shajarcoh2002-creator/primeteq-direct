import Link from "next/link";
import { notFound } from "next/navigation";
import { CARRIER_LABELS } from "@/data/catalog";
import { type OrderStatus, STATUS_LABELS, getOrder } from "@/lib/db";
import { CONDITION_LABELS } from "@/lib/pricing";
import { updateOrder } from "../../../actions";

const yn = (v: boolean) => (v ? "Sí" : "No");

export default async function AdminOrderPage({ params }: PageProps<"/admin/orders/[id]">) {
  const order = await getOrder((await params).id);
  if (!order) notFound();
  const { item, customer, address, payout } = order;

  return (
    <div className="space-y-6">
      <Link href="/admin" className="text-sm font-semibold text-brand hover:underline">← Órdenes</Link>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-mono text-2xl font-bold">{order.id}</h1>
          <p className="text-sm text-muted">
            Creada {new Date(order.createdAt).toLocaleString("es")} · Oferta válida hasta {new Date(order.expiresAt).toLocaleDateString("es")}
          </p>
        </div>
        <span className="rounded-full bg-brand-soft px-3 py-1 text-sm font-semibold text-brand">{STATUS_LABELS[order.status].es}</span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-bold">Equipo</h2>
          <dl className="mt-3 space-y-1 text-sm">
            <div><dt className="inline text-muted">Modelo: </dt><dd className="inline font-semibold">{item.modelName} {item.storage}</dd></div>
            <div><dt className="inline text-muted">Operador: </dt><dd className="inline">{CARRIER_LABELS[item.carrier]}</dd></div>
            <div><dt className="inline text-muted">Condición declarada: </dt><dd className="inline">{CONDITION_LABELS[item.condition]}</dd></div>
            <div><dt className="inline text-muted">Enciende: </dt><dd className="inline">{yn(item.answers.powersOn)}</dd></div>
            <div><dt className="inline text-muted">Funciona todo: </dt><dd className="inline">{yn(item.answers.functional)}</dd></div>
            <div><dt className="inline text-muted">Sin grietas: </dt><dd className="inline">{yn(item.answers.noCracks)}</dd></div>
            <div className="pt-2"><dt className="inline text-muted">Oferta cotizada: </dt><dd className="inline text-lg font-bold text-cash">${item.quotedPrice}</dd></div>
            {order.finalPrice !== null && (
              <div><dt className="inline text-muted">Precio final: </dt><dd className="inline text-lg font-bold">${order.finalPrice}</dd></div>
            )}
          </dl>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-bold">Cliente</h2>
          <div className="mt-3 space-y-1 text-sm">
            <p className="font-semibold">{customer.name}</p>
            <p>{customer.email}</p>
            {customer.phone && <p>{customer.phone}</p>}
            <p className="pt-2 text-muted">Dirección (etiqueta de envío)</p>
            <p>{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
            <p>{address.city}, {address.state} {address.zip}</p>
            <p className="pt-2 text-muted">Pago</p>
            <p className="font-semibold">
              {payout.method === "check" ? "Cheque por correo" : `${payout.method === "paypal" ? "PayPal" : "Zelle"}: ${payout.handle}`}
            </p>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-bold">Actualizar</h2>
          <form action={updateOrder} className="mt-3 space-y-3">
            <input type="hidden" name="id" value={order.id} />
            <div>
              <label className="label" htmlFor="status">Estado</label>
              <select id="status" name="status" defaultValue={order.status} className="field">
                {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
                  <option key={s} value={s}>{STATUS_LABELS[s].es}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label" htmlFor="finalPrice">Precio final / contraoferta (USD)</label>
              <input id="finalPrice" name="finalPrice" defaultValue={order.finalPrice ?? ""} placeholder={`${item.quotedPrice}`} className="field" />
            </div>
            <div>
              <label className="label" htmlFor="note">Nota</label>
              <textarea id="note" name="note" rows={3} className="field" placeholder="Ej: pantalla con rayones profundos, IMEI verificado…" />
            </div>
            <button className="btn btn-primary w-full">Guardar</button>
          </form>
        </section>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-bold">Historial</h2>
        <ul className="mt-3 divide-y divide-line text-sm">
          {[...order.history].reverse().map((h, i) => (
            <li key={i} className="flex flex-wrap gap-x-4 py-2">
              <span className="w-40 text-muted">{new Date(h.at).toLocaleString("es")}</span>
              <span className="font-semibold">{STATUS_LABELS[h.status].es}</span>
              {h.note && <span className="text-muted">— {h.note}</span>}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
