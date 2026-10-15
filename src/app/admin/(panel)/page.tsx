import Link from "next/link";
import { CARRIER_LABELS } from "@/data/catalog";
import { type OrderStatus, STATUS_LABELS, getOrders } from "@/lib/db";

export default async function OrdersPage({ searchParams }: PageProps<"/admin">) {
  const filter = (await searchParams).status as OrderStatus | undefined;
  const all = await getOrders();
  const orders = filter ? all.filter((o) => o.status === filter) : all;
  const counts = all.reduce<Record<string, number>>((acc, o) => ({ ...acc, [o.status]: (acc[o.status] ?? 0) + 1 }), {});
  const open = all.filter((o) => !["paid", "returned", "cancelled"].includes(o.status));
  const openValue = open.reduce((sum, o) => sum + (o.finalPrice ?? o.item.quotedPrice), 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Órdenes</h1>
          <p className="text-sm text-muted">{open.length} abiertas · ${openValue.toLocaleString("en-US")} comprometidos</p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 text-sm">
        <Link href="/admin" className="choice !py-1.5" data-active={!filter}>Todas ({all.length})</Link>
        {(Object.keys(STATUS_LABELS) as OrderStatus[]).map((s) => (
          <Link key={s} href={`/admin?status=${s}`} className="choice !py-1.5" data-active={filter === s}>
            {STATUS_LABELS[s].es} ({counts[s] ?? 0})
          </Link>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="p-3">Orden</th>
              <th className="p-3">Fecha</th>
              <th className="p-3">Cliente</th>
              <th className="p-3">Equipo</th>
              <th className="p-3">Oferta</th>
              <th className="p-3">Estado</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-paper">
                <td className="p-3 font-mono font-semibold">
                  <Link href={`/admin/orders/${o.id}`} className="text-brand hover:underline">{o.id}</Link>
                </td>
                <td className="p-3 text-muted">{new Date(o.createdAt).toLocaleDateString("es")}</td>
                <td className="p-3">{o.customer.name}<br /><span className="text-muted">{o.customer.email}</span></td>
                <td className="p-3">{o.item.modelName} {o.item.storage}<br /><span className="text-muted">{CARRIER_LABELS[o.item.carrier]} · {o.item.condition}</span></td>
                <td className="p-3 font-semibold">${(o.finalPrice ?? o.item.quotedPrice).toLocaleString("en-US")}</td>
                <td className="p-3">{STATUS_LABELS[o.status].es}</td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={6} className="p-8 text-center text-muted">No hay órdenes todavía.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
