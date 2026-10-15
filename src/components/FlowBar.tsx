import Link from "next/link";
import { Check } from "lucide-react";
import { CATEGORIES, type CategoryId } from "@/data/catalog";

export const FLOW_STEPS = ["Select", "Get offer", "Payment", "Shipping"] as const;

/** Category tabs + four-stage progress indicator shown under the header. */
export function FlowBar({ category, current }: { category?: CategoryId; current: 0 | 1 | 2 | 3 }) {
  return (
    <div className="border-b border-line bg-white">
      <div className="container-page">
        <nav aria-label="Device categories" className="-mx-4 flex gap-1 overflow-x-auto px-4 pt-3 [scrollbar-width:none] md:mx-0 md:px-0">
          {CATEGORIES.map((c) => {
            const active = c.id === category;
            return (
              <Link
                key={c.id}
                href={`/sell/${c.id}`}
                aria-current={active ? "page" : undefined}
                className={`whitespace-nowrap rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  active ? "bg-ink text-white" : "text-ink-2 hover:bg-paper"
                }`}
              >
                {c.name}
              </Link>
            );
          })}
        </nav>
        <Stepper current={current} />
      </div>
    </div>
  );
}

export function Stepper({ current }: { current: number }) {
  return (
    <div className="py-4">
      {/* Mobile: compact */}
      <div className="md:hidden">
        <p className="text-sm font-semibold">
          <span className="text-brand">Step {current + 1} of {FLOW_STEPS.length}</span>
          <span className="text-muted"> · {FLOW_STEPS[current]}</span>
        </p>
        <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden>
          {FLOW_STEPS.map((s, i) => (
            <span key={s} className={`h-1.5 rounded-full ${i <= current ? "bg-brand" : "bg-line"}`} />
          ))}
        </div>
      </div>
      {/* Desktop: full */}
      <ol className="hidden items-center gap-3 md:flex" aria-label="Progress">
        {FLOW_STEPS.map((s, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <li key={s} className="flex flex-1 items-center gap-3 last:flex-none" aria-current={active ? "step" : undefined}>
              <span className="flex items-center gap-2.5 whitespace-nowrap">
                <span
                  className={`grid h-7 w-7 place-items-center rounded-full text-xs font-bold ${
                    active ? "bg-brand text-white" : done ? "bg-ink text-white" : "border border-line bg-white text-muted"
                  }`}
                >
                  {done ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : i + 1}
                </span>
                <span className={`text-xs font-bold uppercase tracking-[0.1em] ${active ? "text-brand" : done ? "text-ink" : "text-muted"}`}>
                  {s}
                </span>
              </span>
              {i < FLOW_STEPS.length - 1 && <span className={`h-px flex-1 ${done ? "bg-ink" : "bg-line"}`} aria-hidden />}
            </li>
          );
        })}
      </ol>
    </div>
  );
}
