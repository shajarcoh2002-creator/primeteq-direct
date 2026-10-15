import { CARRIER_LABELS, type CarrierId, type CurveId, getModel } from "@/data/catalog";
import { getOverrides, getSettings } from "@/lib/db";
import { CONDITION_LABELS, CURVE_LABELS, type Condition, quoteVariant } from "@/lib/pricing";
import { resetPricing, savePricing } from "../../actions";

const COST_FIELDS: { key: string; label: string; unit: "%" | "$"; help: string }[] = [
  { key: "marketplaceFeePct", label: "Comisión de reventa", unit: "%", help: "Lo que cobra eBay / Back Market / tu canal al revender" },
  { key: "riskPct", label: "Riesgo (fraude, devoluciones)", unit: "%", help: "Reserva para equipos que llegan peor o bloqueados" },
  { key: "holdDepreciationPct", label: "Depreciación mientras lo tienes", unit: "%", help: "30 días de oferta + ~15 días hasta revender" },
  { key: "marginPct", label: "Tu ganancia", unit: "%", help: "Margen objetivo sobre el precio de reventa" },
  { key: "refurbCost", label: "Limpieza / prueba", unit: "$", help: "Costo fijo por equipo" },
  { key: "shippingCost", label: "Envíos", unit: "$", help: "Etiqueta prepagada + envío al comprador" },
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
        <h1 className="text-2xl font-bold">Fórmula de precios</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Oferta = precio de reventa − comisión − riesgo − depreciación − ganancia − limpieza − envíos, × calibración de marca, × ajuste de operador ×
          ajuste de condición. Los precios se recalculan solos cada día porque la edad de cada modelo avanza en la curva de depreciación.
        </p>
      </div>

      {saved && <p className="rounded-lg bg-cash-soft p-3 text-sm font-medium text-cash">Guardado. Todas las ofertas nuevas ya usan estos valores.</p>}

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-bold">Ejemplo en vivo: {exModel.name} {exStorage.label} desbloqueado</h2>
        <table className="mt-3 w-full max-w-xl text-sm">
          <tbody className="divide-y divide-line">
            <tr><td className="py-1.5">Precio de reventa {ex.resale.source === "manual" ? "(manual)" : `(${exStorage.msrp} × ${ex.resale.curvePct.toFixed(1)}% a ${ex.resale.ageMonths.toFixed(1)} meses)`}</td><td className="text-right font-semibold">{money(R)}</td></tr>
            <tr><td className="py-1.5">− Comisión {c.marketplaceFeePct}%</td><td className="text-right">−{money(pct(c.marketplaceFeePct))}</td></tr>
            <tr><td className="py-1.5">− Riesgo {c.riskPct}%</td><td className="text-right">−{money(pct(c.riskPct))}</td></tr>
            <tr><td className="py-1.5">− Depreciación {c.holdDepreciationPct}%</td><td className="text-right">−{money(pct(c.holdDepreciationPct))}</td></tr>
            <tr><td className="py-1.5">− Ganancia {c.marginPct}%</td><td className="text-right">−{money(pct(c.marginPct))}</td></tr>
            <tr><td className="py-1.5">− Limpieza + envíos</td><td className="text-right">−{money(c.refurbCost + c.shippingCost)}</td></tr>
            <tr><td className="py-1.5">× Calibración iPhone {settings.calibrationPct["apple-phone"]}%</td><td className="text-right">{money(beforeCal)} → {money(ex.base)}</td></tr>
            {(Object.keys(ex.offers) as Condition[]).map((k) => (
              <tr key={k}><td className="py-1.5 font-semibold">Oferta: {CONDITION_LABELS[k]} ({settings.conditionPct[k]}%)</td><td className="text-right text-base font-bold text-cash">${ex.offers[k]}</td></tr>
            ))}
          </tbody>
        </table>
        <p className="mt-2 text-xs text-muted">Referencia Gazelle (14 oct 2026): $663 / $663 / $636 / $378 / $274.</p>
      </section>

      <form action={savePricing} className="space-y-8">
        <section className="rounded-2xl border border-line bg-white p-5">
          <h2 className="font-bold">Costos y ganancia</h2>
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
            <h2 className="font-bold">Ajuste por condición (% de la oferta “buena”)</h2>
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
            <h2 className="font-bold">Ajuste por operador (%)</h2>
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
          <h2 className="font-bold">Curvas de depreciación y calibración por marca</h2>
          <p className="mt-1 text-sm text-muted">
            Formato: <code>meses:%</code> separados por coma. Ej. <code>12:88</code> = al año se revende en 88% del precio de lanzamiento. Solo se usa cuando
            el modelo no tiene precio de reventa manual.
          </p>
          <div className="mt-4 space-y-5">
            {(Object.keys(settings.curves) as CurveId[]).map((k) => (
              <div key={k} className="grid gap-3 sm:grid-cols-[140px_1fr_140px] sm:items-end">
                <p className="font-semibold">{CURVE_LABELS[k]}</p>
                <div>
                  <label className="label" htmlFor={`curve-${k}`}>Curva</label>
                  <input id={`curve-${k}`} name={`curve.${k}`} defaultValue={settings.curves[k].map(([m, p]) => `${m}:${p}`).join(", ")} className="field font-mono text-xs" />
                </div>
                <div>
                  <label className="label" htmlFor={`cal-${k}`}>Calibración %</label>
                  <input id={`cal-${k}`} name={`calibration.${k}`} defaultValue={settings.calibrationPct[k]} className="field text-right" inputMode="decimal" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid gap-4 rounded-2xl border border-line bg-white p-5 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="offerValidDays">Días que dura la oferta</label>
            <input id="offerValidDays" name="offerValidDays" defaultValue={settings.offerValidDays} className="field" inputMode="numeric" />
          </div>
          <div>
            <label className="label" htmlFor="minOffer">Oferta mínima (USD)</label>
            <input id="minOffer" name="minOffer" defaultValue={settings.minOffer} className="field" inputMode="decimal" />
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <button className="btn btn-primary">Guardar fórmula</button>
          <button formAction={resetPricing} className="btn btn-outline">Restaurar valores por defecto</button>
        </div>
      </form>
    </div>
  );
}
