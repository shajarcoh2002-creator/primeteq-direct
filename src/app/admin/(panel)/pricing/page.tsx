import { CARRIER_LABELS, type CarrierId, type CurveId, getModel } from "@/data/catalog";
import { getOverrides, getSettings } from "@/lib/db";
import { CONDITION_LABELS, CURVE_LABELS, type Condition, quoteVariant } from "@/lib/pricing";
import { resetPricing, savePricing } from "../../actions";

const COST_FIELDS: { key: string; label: string; unit: "%" | "$"; help: string }[] = [
  { key: "marketplaceFeePct", label: "Resale fee", unit: "%", help: "What eBay / Back Market / your sales channel charges when you resell" },
  { key: "riskPct", label: "Risk (fraud, returns)", unit: "%", help: "Reserve for devices that arrive worse than described or locked" },
  { key: "holdDepreciationPct", label: "Depreciation while held", unit: "%", help: "Offer window (15 days) + time until resold" },
  { key: "marginPct", label: "Your margin", unit: "%", help: "Target margin on the resale price" },
  { key: "refurbCost", label: "Cleaning / testing", unit: "$", help: "Fixed cost per device" },
  { key: "shippingCost", label: "Shipping", unit: "$", help: "Prepaid label + shipping to the buyer" },
];

const money = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;

export default async function PricingPage({ searchParams }: PageProps<"/admin/pricing">) {
  const saved = (await searchParams).saved === "1";
  const [settings, overrides] = await Promise.all([getSettings(), getOverrides()]);
  const c = settings.costs;

  // Worked example shown with the current settings.
  const exModel = getModel("iphone-17-pro")!;
  const exStorage = exModel.storage[0];
  const ex = quoteVariant(exModel, exStorage, "unlocked", settings, overrides);
  const R = ex.resale.resale;
  const pct = (p: number) => (R * p) / 100;
  const beforeCal = R - pct(c.marketplaceFeePct) - pct(c.riskPct) - pct(c.holdDepreciationPct) - pct(c.marginPct) - c.refurbCost - c.shippingCost;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Pricing formula</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Offer = resale price − fee − risk − depreciation − margin − cleaning − shipping, × brand calibration × carrier adjustment × condition
          adjustment. Prices update automatically every day as each model ages along its depreciation curve.
        </p>
      </div>

      {saved && <p className="rounded-lg bg-cash-soft p-3 text-sm font-medium text-cash">Saved. All new offers now use these values.</p>}

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-bold">Live example: {exModel.name} {exStorage.label} unlocked</h2>
        <table className="mt-3 w-full max-w-xl text-sm">
          <tbody className="divide-y divide-line">
            <tr><td className="py-1.5">Resale price {ex.resale.source === "manual" ? "(manual)" : `(${exStorage.msrp} × ${ex.resale.curvePct.toFixed(1)}% at ${ex.resale.ageMonths.toFixed(1)} months)`}</td><td className="text-right font-semibold">{money(R)}</td></tr>
            <tr><td className="py-1.5">− Fee {c.marketplaceFeePct}%</td><td className="text-right">−{money(pct(c.marketplaceFeePct))}</td></tr>
            <tr><td className="py-1.5">− Risk {c.riskPct}%</td><td className="text-right">−{money(pct(c.riskPct))}</td></tr>
            <tr><td className="py-1.5">− Depreciation {c.holdDepreciationPct}%</td><td className="text-right">−{money(pct(c.holdDepreciationPct))}</td></tr>
            <tr><td className="py-1.5">− Margin {c.marginPct}%</td><td className="text-right">−{money(pct(c.marginPct))}</td></tr>
            <tr><td className="py-1.5">− Cleaning + shipping</td><td className="text-right">−{money(c.refurbCost + c.shippingCost)}</td></tr>
            <tr><td className="py-1.5">× iPhone calibration {settings.calibrationPct["apple-phone"]}%</td><td className="text-right">{money(beforeCal)} → {money(ex.base)}</td></tr>
            {(Object.keys(ex.offers) as Condition[]).map((k) => (
              <tr key={k}><td className="py-1.5 font-semibold">Offer: {CONDITION_LABELS[k]} ({settings.conditionPct[k]}%)</td><td className="text-right text-base font-bold text-cash">${ex.offers[k]}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-muted">Gazelle reference (Oct 14, 2026): $663 / $663 / $636 / $378 / $274.</p>
      </section>

      <form action={savePricing} className="space-y-8">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-bold">Costs & margin</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COST_FIELDS.map((f) => (
              <div key={f.key}>
                <label className="label" htmlFor={f.key}>{f.label} ({f.unit})</label>
                <input id={f.key} name={`costs.${f.key}`} defaultValue={c[f.key as keyof typeof c]} className="field" inputMode="decimal" />
                <p className="mt-1 text-xs text-muted">{f.help}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-bold">Condition adjustment (% of the “good” offer)</h2>
            <div className="mt-4 space-y-3">
              {(Object.keys(settings.conditionPct) as Condition[]).map((k) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <label htmlFor={`cond-${k}`} className="text-sm">{CONDITION_LABELS[k]}</label>
                  <input id={`cond-${k}`} name={`condition.${k}`} defaultValue={settings.conditionPct[k]} className="field !w-24 text-right" inputMode="decimal" />
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-line bg-white p-5">
            <h2 className="font-bold">Carrier adjustment (%)</h2>
            <div className="mt-4 space-y-3">
              {(Object.keys(settings.carrierPct) as CarrierId[]).map((k) => (
                <div key={k} className="flex items-center justify-between gap-4">
                  <label htmlFor={`car-${k}`} className="text-sm">{CARRIER_LABELS[k]}</label>
                  <input id={`car-${k}`} name={`carrier.${k}`} defaultValue={settings.carrierPct[k]} className="field !w-24 text-right" inputMode="decimal" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-bold">Depreciation curves & brand calibration</h2>
          <p className="mt-1 text-sm text-muted">
            Format: <code>months:%</code>, comma-separated. E.g. <code>12:88</code> = after one year it resells at 88% of the launch price. Only used when
            a model has no manual resale price.
          </p>
          <div className="mt-4 space-y-5">
            {(Object.keys(settings.curves) as CurveId[]).map((k) => (
              <div key={k} className="grid gap-3 sm:grid-cols-[140px_1fr_140px] sm:items-end">
                <p className="font-semibold">{CURVE_LABELS[k]}</p>
                <div>
                  <label className="label" htmlFor={`curve-${k}`}>Curve</label>
                  <input id={`curve-${k}`} name={`curve.${k}`} defaultValue={settings.curves[k].map(([m, p]) => `${m}:${p}`).join(", ")} className="field font-mono text-xs" />
                </div>
                <div>
                  <label className="label" htmlFor={`cal-${k}`}>Calibration %</label>
                  <input id={`cal-${k}`} name={`calibration.${k}`} defaultValue={settings.calibrationPct[k]} className="field text-right" inputMode="decimal" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="storagePremiumPct">Extra storage value (%)</label>
            <input id="storagePremiumPct" name="storagePremiumPct" defaultValue={settings.storagePremiumPct} className="field" inputMode="decimal" />
            <p className="mt-1 text-xs text-muted">
              Share of a bigger storage tier’s extra launch price that a used device keeps. 26% = Gazelle’s 17 Pro Max 256GB → 1TB gap.
            </p>
          </div>
          <div>
            <label className="label" htmlFor="offerValidDays">Offer valid for (days)</label>
            <input id="offerValidDays" name="offerValidDays" defaultValue={settings.offerValidDays} className="field" inputMode="numeric" />
          </div>
          <div>
            <label className="label" htmlFor="minOffer">Minimum offer (USD)</label>
            <input id="minOffer" name="minOffer" defaultValue={settings.minOffer} className="field" inputMode="decimal" />
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary">Save formula</button>
          <button formAction={resetPricing} className="btn btn-outline">Restore defaults</button>
        </div>
      </form>
    </div>
  );
}
