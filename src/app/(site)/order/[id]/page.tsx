import { notFound } from "next/navigation";
import { CheckCircle2, Circle, MapPin } from "lucide-react";
import { parseVariantId } from "@/data/catalog";
import { PAYOUT_LABELS, getOrder, orderCountry } from "@/lib/db";
import { FlowBar } from "@/components/FlowBar";
import { policyFor } from "@/lib/policy";
import { getDevicePhoto } from "@/lib/photos";
import { getLocation, mapsUrl } from "@/lib/locations";
import { QuoteSummary } from "@/components/QuoteSummary";
import { fmt } from "@/i18n/config";
import { rich } from "@/i18n/rich";
import { getDict, getLang } from "@/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return { title: (await getDict()).meta.order };
}

export default async function OrderPage({ params, searchParams }: PageProps<"/order/[id]">) {
  const order = await getOrder((await params).id);
  if (!order) notFound();
  const [t, lang] = await Promise.all([getDict(), getLang()]);
  const P = policyFor(t);
  const o = t.order;
  const fmtDate = (iso: string) =>
    new Date(iso).toLocaleDateString(lang === "es" ? "es-PA" : "en-US", { month: "long", day: "numeric", year: "numeric" });

  const isNew = (await searchParams).new === "1";
  const variant = parseVariantId(order.item.variantId);
  const category = variant?.category.id ?? "iphone";
  const price = order.finalPrice ?? order.item.quotedPrice;
  const photo = variant ? await getDevicePhoto(variant.model.slug) : null;
  const pa = orderCountry(order) === "PA";
  const loc = getLocation(order.dropoff?.locationId);
  const strong = (s: string) => <strong className="text-ink">{s}</strong>;

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
                  <p className="font-display text-lg font-bold">{o.acceptedTitle}</p>
                  <p className="mt-1 text-sm text-muted">
                    {pa
                      ? rich(o.acceptedDropoff, {
                          id: strong(order.id),
                          location: strong(loc?.name ?? "—"),
                          date: fmtDate(order.expiresAt),
                          email: order.customer.email,
                        })
                      : rich(o.acceptedShip, { id: strong(order.id), email: order.customer.email, labelWithin: P.labelWithin })}
                  </p>
                </div>
              </div>
            )}

            <div className="card p-5 md:p-8">
              <p className="eyebrow">{fmt(o.orderN, { id: order.id })}</p>
              <h1 className="mt-2 text-[28px] font-extrabold leading-tight md:text-4xl">{t.status[order.status]}</h1>

              <div className="mt-8 grid gap-6 md:grid-cols-2">
                <div className="rounded-2xl border border-line p-5">
                  <h2 className="font-display text-lg font-bold">{o.prepare}</h2>
                  <ol className="mt-3 space-y-2 text-sm text-ink-2">
                    {o.prep.map((p, i) => (
                      <li key={p} className="flex gap-3">
                        <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-paper text-[11px] font-bold text-muted">{i + 1}</span>
                        {p}
                      </li>
                    ))}
                  </ol>
                </div>
                <div className="rounded-2xl border border-line p-5">
                  {pa ? (
                    <>
                      <h2 className="font-display text-lg font-bold">{o.dropoffTitle}</h2>
                      <p className="mt-3 text-sm text-ink-2">{fmt(o.dropoffBody, { id: order.id })}</p>
                      {loc && (
                        <div className="mt-3 rounded-xl bg-paper p-4 text-sm">
                          <p className="font-semibold">{loc.name}</p>
                          <p className="text-muted">
                            {loc.address[lang] !== loc.name && <>{loc.address[lang]} · </>}
                            {loc.area}
                          </p>
                          {loc.hours && <p className="mt-1 text-muted">{loc.hours[lang]}</p>}
                          <a href={mapsUrl(loc)} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1 font-semibold text-brand hover:underline">
                            <MapPin className="h-4 w-4" /> Google Maps
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <h2 className="font-display text-lg font-bold">{o.sendTitle}</h2>
                      {order.label ? (
                        <>
                          <p className="mt-3 text-sm text-ink-2">{o.labelReady}</p>
                          <a href={order.label.url} target="_blank" rel="noopener noreferrer" className="btn btn-primary mt-4 w-full sm:w-auto">
                            {o.printLabel}
                          </a>
                          {order.label.tracking && (
                            <p className="mt-3 text-sm text-muted">
                              {o.tracking}: <span className="font-mono text-ink">{order.label.tracking}</span>
                            </p>
                          )}
                        </>
                      ) : (
                        <p className="mt-3 text-sm text-ink-2">{fmt(o.labelSoon, { labelWithin: P.labelWithin })}</p>
                      )}
                    </>
                  )}
                  <p className="mt-3 text-sm text-ink-2">{rich(o.validUntil, { date: <strong>{fmtDate(order.expiresAt)}</strong> })}</p>
                </div>
              </div>

              <h2 className="font-display mt-10 text-lg font-bold">{o.history}</h2>
              <ol className="mt-4 space-y-4">
                {/* Internal log lines (emails, alerts) repeat the same status: show each status change once. */}
                {order.history.filter((h, i, all) => i === 0 || h.status !== all[i - 1].status).reverse().map((h, i) => (
                  <li key={i} className="flex gap-3 text-sm">
                    {i === 0 ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0 text-muted" />}
                    <div>
                      <p className="font-semibold">{t.status[h.status]}</p>
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
              { label: variant?.category.kind === "tablet" ? t.picker.connectivity : t.picker.carrier, value: t.carriers[order.item.carrier] },
              { label: t.summary.storage, value: order.item.storage },
              { label: t.summary.condition, value: t.conditions[order.item.condition] },
              { label: t.summary.payment, value: PAYOUT_LABELS[order.payout.method] },
              ...(pa ? [{ label: t.summary.delivery, value: loc?.name ?? null }] : []),
            ]}
            offer={price}
            footer={order.finalPrice !== null ? t.summary.finalAfterInspection : undefined}
          />
        </div>
      </section>
    </>
  );
}
