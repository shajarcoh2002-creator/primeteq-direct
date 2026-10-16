import { CARRIER_LABELS, type CurveId, MODELS, getCategory, parseVariantId, variantId } from "@/data/catalog";
import { getCalibrationRefs, getOverrides, getSettings } from "@/lib/db";
import { CONDITIONS, CONDITION_LABELS, CURVE_LABELS, quoteVariant } from "@/lib/pricing";
import { addCalibrationRef, applyCalibration, deleteCalibrationRef } from "../../actions";

export default async function CalibrationPage({ searchParams }: PageProps<"/admin/calibration">) {
  const error = (await searchParams).error === "1";
  const [settings, overrides, refs] = await Promise.all([getSettings(), getOverrides(), getCalibrationRefs()]);

  const rows = refs.map((r) => {
    const v = parseVariantId(r.variantId);
    const ours = v ? quoteVariant(v.model, v.storage, v.carrier, settings, overrides).offers[r.condition] : null;
    const diff = ours ? ((ours - r.referencePrice) / r.referencePrice) * 100 : null;
    return { r, v, ours, diff };
  });

  const byCurve = new Map<CurveId, { n: number; sumAbs: number; sum: number }>();
  for (const row of rows) {
    if (!row.v || row.diff === null) continue;
    const k = row.v.model.curve;
    const agg = byCurve.get(k) ?? { n: 0, sumAbs: 0, sum: 0 };
    agg.n++;
    agg.sumAbs += Math.abs(row.diff);
    agg.sum += row.diff;
    byCurve.set(k, agg);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Calibration against competitors</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          To keep your offers close to Gazelle&apos;s: check 20–30 popular models by hand on gazelle.com (in “Lightly used” condition), enter their
          price here and press “Apply adjustment”. The system tunes that brand&apos;s calibration so the offers match on average. Repeat every 1–2 weeks
          with a few models to follow market changes.
        </p>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {(Object.keys(CURVE_LABELS) as CurveId[]).map((k) => {
          const agg = byCurve.get(k);
          return (
            <div key={k} className="rounded-2xl border border-line bg-white p-5">
              <p className="font-bold">{CURVE_LABELS[k]}</p>
              <p className="text-sm text-muted">Current calibration: {settings.calibrationPct[k]}%</p>
              {agg ? (
                <>
                  <p className="mt-3 text-sm">{agg.n} references</p>
                  <p className="text-sm">
                    Average difference:{" "}
                    <strong className={Math.abs(agg.sum / agg.n) < 3 ? "text-cash" : "text-amber-700"}>
                      {agg.sum / agg.n > 0 ? "+" : ""}{(agg.sum / agg.n).toFixed(1)}%
                    </strong>
                  </p>
                  <form action={applyCalibration} className="mt-3">
                    <input type="hidden" name="curve" value={k} />
                    <button className="btn btn-outline !px-4 !py-1.5 text-sm">Apply adjustment</button>
                  </form>
                </>
              ) : (
                <p className="mt-3 text-sm text-muted">No references yet.</p>
              )}
            </div>
          );
        })}
      </section>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-bold">Add reference price</h2>
        {error && <p className="mt-2 text-sm font-medium text-red-700">Check the data: device, condition and price are required.</p>}
        <form action={addCalibrationRef} className="mt-4 grid gap-3 lg:grid-cols-[1fr_200px_120px_120px_auto] lg:items-end">
          <div>
            <label className="label" htmlFor="variantId">Device</label>
            <select id="variantId" name="variantId" className="field" required>
              {MODELS.map((m) => {
                const cat = getCategory(m.category)!;
                return (
                  <optgroup key={m.slug} label={m.name}>
                    {m.storage.flatMap((s) =>
                      cat.carriers.map((c) => (
                        <option key={`${s.label}-${c}`} value={variantId(m.slug, s.label, c)}>
                          {m.name} {s.label} — {CARRIER_LABELS[c]}
                        </option>
                      )),
                    )}
                  </optgroup>
                );
              })}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="condition">Condition</label>
            <select id="condition" name="condition" defaultValue="good" className="field">
              {CONDITIONS.map((c) => <option key={c} value={c}>{CONDITION_LABELS[c]}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="referencePrice">Price (USD)</label>
            <input id="referencePrice" name="referencePrice" className="field" inputMode="decimal" required />
          </div>
          <div>
            <label className="label" htmlFor="source">Source</label>
            <input id="source" name="source" defaultValue="Gazelle" className="field" />
          </div>
          <button className="btn btn-primary">Add</button>
        </form>
      </section>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="p-3">Device</th>
              <th className="p-3">Condition</th>
              <th className="p-3">Source / date</th>
              <th className="p-3 text-right">Reference</th>
              <th className="p-3 text-right">Our offer</th>
              <th className="p-3 text-right">Difference</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {rows.map(({ r, v, ours, diff }) => (
              <tr key={r.id}>
                <td className="p-3">{v ? `${v.model.name} ${v.storage.label} — ${CARRIER_LABELS[v.carrier]}` : r.variantId}</td>
                <td className="p-3">{CONDITION_LABELS[r.condition]}</td>
                <td className="p-3 text-muted">{r.source} · {r.checkedAt}</td>
                <td className="p-3 text-right font-semibold">${r.referencePrice}</td>
                <td className="p-3 text-right font-semibold text-cash">{ours !== null ? `$${ours}` : "—"}</td>
                <td className={`p-3 text-right font-semibold ${diff !== null && Math.abs(diff) <= 3 ? "text-cash" : "text-amber-700"}`}>
                  {diff !== null ? `${diff > 0 ? "+" : ""}${diff.toFixed(1)}%` : "—"}
                </td>
                <td className="p-3 text-right">
                  <form action={deleteCalibrationRef}>
                    <input type="hidden" name="id" value={r.id} />
                    <button className="text-xs font-semibold text-muted hover:text-red-700">Delete</button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
