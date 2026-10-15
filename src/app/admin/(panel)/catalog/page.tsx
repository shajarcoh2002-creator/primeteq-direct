import { CATEGORIES, MODELS } from "@/data/catalog";
import { getOverrides, getSettings } from "@/lib/db";
import { quoteVariant, resaleKey } from "@/lib/pricing";
import { importResaleCsv, setResale } from "../../actions";

export default async function CatalogPage({ searchParams }: PageProps<"/admin/catalog">) {
  const sp = await searchParams;
  const cat = typeof sp.cat === "string" ? sp.cat : "iphone";
  const imported = typeof sp.imported === "string" ? sp.imported : null;
  const [settings, overrides] = await Promise.all([getSettings(), getOverrides()]);
  const models = MODELS.filter((m) => m.category === cat);
  const best = cat === "ipad" ? "wifi" : "unlocked";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Catálogo y precios</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Ofertas actuales por modelo ({best === "wifi" ? "Wi-Fi" : "desbloqueado"}). Si escribes un <strong>precio de reventa manual</strong> (lo que te
          pagan a ti por ese equipo en buen estado), reemplaza la curva de depreciación para ese modelo. Déjalo vacío para usar la curva.
        </p>
      </div>

      {imported && <p className="rounded-lg bg-cash-soft p-3 text-sm font-medium text-cash">{imported} precios importados.</p>}

      <div className="flex flex-wrap gap-2 text-sm">
        {CATEGORIES.map((c) => (
          <a key={c.id} href={`/admin/catalog?cat=${c.id}`} className="choice !py-1.5" data-active={cat === c.id}>{c.name}</a>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="p-3">Modelo</th>
              <th className="p-3">Lanzamiento</th>
              <th className="p-3 text-right">Precio nuevo</th>
              <th className="p-3 text-right">Reventa estimada</th>
              <th className="p-3 text-right">Bueno</th>
              <th className="p-3 text-right">Rayado</th>
              <th className="p-3 text-right">Dañado</th>
              <th className="p-3 text-right">Roto</th>
              <th className="p-3">Reventa manual</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {models.flatMap((m) =>
              m.storage.map((s, i) => {
                const q = quoteVariant(m, s, best, settings, overrides);
                return (
                  <tr key={`${m.slug}-${s.label}`} className={i === 0 ? "border-t-2 border-line" : ""}>
                    <td className="p-3">
                      <span className="font-semibold">{m.name}</span> {s.label}
                      {m.verify && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">verificar datos</span>}
                    </td>
                    <td className="p-3 text-muted">{m.released} · {q.resale.ageMonths.toFixed(0)}m</td>
                    <td className="p-3 text-right text-muted">${s.msrp}</td>
                    <td className="p-3 text-right">
                      ${Math.round(q.resale.resale)}
                      <span className="block text-xs text-muted">{q.resale.source === "manual" ? "manual" : `curva ${q.resale.curvePct.toFixed(0)}%`}</span>
                    </td>
                    <td className="p-3 text-right font-bold text-cash">${q.offers.good}</td>
                    <td className="p-3 text-right">${q.offers.fair}</td>
                    <td className="p-3 text-right">${q.offers.poor}</td>
                    <td className="p-3 text-right">${q.offers.broken}</td>
                    <td className="p-3">
                      <form action={setResale} className="flex gap-2">
                        <input type="hidden" name="model" value={m.slug} />
                        <input type="hidden" name="storage" value={s.label} />
                        <input name="resale" defaultValue={overrides[resaleKey(m.slug, s.label)] ?? ""} placeholder="—" className="field !w-24 !py-1.5 text-right" inputMode="decimal" />
                        <button className="rounded-lg border border-line px-2 text-xs font-semibold hover:border-brand">OK</button>
                      </form>
                    </td>
                  </tr>
                );
              }),
            )}
          </tbody>
        </table>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5">
        <h2 className="font-bold">Importar precios de reventa (CSV)</h2>
        <p className="mt-1 text-sm text-muted">
          Una línea por equipo: <code>modelo,capacidad,precio</code>. Ej: <code>iphone-17-pro,256GB,950</code>. Útil para cargar la lista semanal de tu
          mayorista.
        </p>
        <form action={importResaleCsv} className="mt-3 space-y-3">
          <textarea name="csv" rows={5} className="field font-mono text-xs" placeholder={"iphone-17-pro,256GB,950\ngalaxy-s25-ultra,256GB,720"} />
          <button className="btn btn-primary">Importar</button>
        </form>
      </section>
    </div>
  );
}
