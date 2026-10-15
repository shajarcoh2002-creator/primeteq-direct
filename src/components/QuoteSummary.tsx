import type { CategoryId } from "@/data/catalog";
import { DevicePhoto } from "./DevicePhoto";

export interface SummaryRow {
  label: string;
  value: string | null;
}

/** Persistent order/quote summary used across the configurator. Shows only real selections. */
export function QuoteSummary({
  category,
  photo,
  title,
  rows,
  offer,
  footer,
  children,
}: {
  category: CategoryId;
  photo?: string | null;
  title: string;
  rows: SummaryRow[];
  offer?: number | null;
  footer?: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <aside className="card h-fit p-6 lg:sticky lg:top-28">
      <p className="eyebrow">Your trade</p>
      <div className="mt-4 flex items-center gap-4">
        <DevicePhoto category={category} photo={photo} alt={title} className="h-20 w-16" sizes="64px" />
        <p className="font-display text-lg font-extrabold leading-snug">{title}</p>
      </div>
      <dl className="mt-5 divide-y divide-line border-y border-line text-sm">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between gap-4 py-2.5">
            <dt className="text-muted">{r.label}</dt>
            <dd className={r.value ? "text-right font-semibold" : "text-right text-muted/70"}>{r.value ?? "—"}</dd>
          </div>
        ))}
      </dl>
      {offer !== undefined && (
        <div className="mt-5">
          <p className="text-sm font-semibold text-muted">Your offer</p>
          <p className={`font-display mt-1 text-4xl font-extrabold ${offer ? "text-ink" : "text-muted/40"}`} aria-live="polite">
            {offer ? `$${offer.toLocaleString("en-US")}` : "$ ‑‑‑"}
          </p>
        </div>
      )}
      {children}
      {footer && <div className="mt-4 text-xs text-muted">{footer}</div>}
    </aside>
  );
}
