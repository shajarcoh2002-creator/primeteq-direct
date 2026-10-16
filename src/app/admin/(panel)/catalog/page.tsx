import { CATEGORIES, MODELS } from "@/data/catalog";
import { getOverrides, getSettings } from "@/lib/db";
import { getDevicePhotos } from "@/lib/photos";
import { quoteVariant, resaleKey } from "@/lib/pricing";
import { importResaleCsv, setResale } from "../../actions";

export default async function CatalogPage({ searchParams }: PageProps<"/admin/catalog">) {
  const sp = await searchParams;
  const cat = typeof sp.cat === "string" ? sp.cat : "iphone";
  const imported = typeof sp.imported === "string" ? sp.imported : null;
  const [settings, overrides, photos] = await Promise.all([getSettings(), getOverrides(), getDevicePhotos()]);
  const models = MODELS.filter((m) => m.category === cat);
  const withPhoto = MODELS.filter((m) => photos[m.slug]).length;
  const missingHere = models.filter((m) => !photos[m.slug]).map((m) => m.slug);
  const best = cat === "ipad" ? "wifi" : "unlocked";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Catalog & prices</h1>
        <p className="mt-1 max-w-3xl text-sm text-muted">
          Current offers per model ({best === "wifi" ? "Wi-Fi" : "unlocked"}). Entering a <strong>manual resale price</strong> (what you get paid for that
          device in good condition) replaces the depreciation curve for that model. Leave it empty to use the curve.
        </p>
      </div>

      <section className="rounded-2xl border border-line bg-white p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="font-bold">Product photos</h2>
          <p className="text-sm font-semibold">
            {withPhoto} of {MODELS.length} models have a real photo
          </p>
        </div>
        <p className="mt-1 text-sm text-muted">
          Put the original photo in the <code>photos-raw/</code> folder named exactly after the model (e.g. <code>iphone-17-pro.jpg</code>) and run{" "}
          <code>npm run photos</code>: it crops it, centers it on a 1200×1200 white canvas and publishes it to <code>public/devices/</code>. Models
          without a photo show the illustration.
        </p>
        {missingHere.length > 0 && (
          <details className="mt-3 text-sm">
            <summary className="cursor-pointer font-semibold text-brand">{missingHere.length} missing in this category — see file names</summary>
            <ul className="mt-2 columns-1 gap-6 font-mono text-xs sm:columns-2 lg:columns-3">
              {missingHere.map((slug) => <li key={slug}>{slug}.jpg</li>)}
            </ul>
          </details>
        )}
      </section>

      {imported && <p className="rounded-lg bg-cash-soft p-3 text-sm font-medium text-cash">{imported} prices imported.</p>}

      <div className="flex flex-wrap gap-2 text-sm">
        {CATEGORIES.map((c) => (
          <a key={c.id} href={`/admin/catalog?cat=${c.id}`} className="choice !py-1.5" data-active={cat === c.id}>{c.name}</a>
        ))}
      </div>

      <div className="overflow-x-auto rounded-2xl border border-line bg-white">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
            <tr>
              <th className="p-3">Photo</th>
              <th className="p-3">Model</th>
              <th className="p-3">Released</th>
              <th className="p-3 text-right">Launch price</th>
              <th className="p-3 text-right">Est. resale</th>
              <th className="p-3 text-right">Good</th>
              <th className="p-3 text-right">Scratched</th>
              <th className="p-3 text-right">Damaged</th>
              <th className="p-3 text-right">Broken</th>
              <th className="p-3">Manual resale</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {models.flatMap((m) =>
              m.storage.map((s, i) => {
                const q = quoteVariant(m, s, best, settings, overrides);
                return (
                  <tr key={`${m.slug}-${s.label}`} className={i === 0 ? "border-t-2 border-line" : ""}>
                    <td className="p-3">
                      {i === 0 &&
                        (photos[m.slug] ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={photos[m.slug]} alt="" className="h-10 w-10 rounded object-contain" />
                        ) : (
                          <span className="text-xs font-semibold text-amber-700">Missing</span>
                        ))}
                    </td>
                    <td className="p-3">
                      <span className="font-semibold">{m.name}</span> {s.label}
                      {m.verify && <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs font-semibold text-amber-800">verify data</span>}
                    </td>
                    <td className="p-3 text-muted">{m.released} · {q.resale.ageMonths.toFixed(0)}m</td>
                    <td className="p-3 text-right text-muted">${s.msrp}</td>
                    <td className="p-3 text-right">
                      ${Math.round(q.resale.resale)}
                      <span className="block text-xs text-muted">{q.resale.source === "manual" ? "manual" : `curve ${q.resale.curvePct.toFixed(0)}%`}</span>
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
        <h2 className="font-bold">Import resale prices (CSV)</h2>
        <p className="mt-1 text-sm text-muted">
          One line per device: <code>model,storage,price</code>. E.g. <code>iphone-17-pro,256GB,950</code>. Handy for loading your wholesaler&apos;s
          weekly price list.
        </p>
        <form action={importResaleCsv} className="mt-3 space-y-3">
          <textarea name="csv" rows={5} className="field font-mono text-xs" placeholder={"iphone-17-pro,256GB,950\ngalaxy-s25-ultra,256GB,720"} />
          <button className="btn btn-primary">Import</button>
        </form>
      </section>
    </div>
  );
}
