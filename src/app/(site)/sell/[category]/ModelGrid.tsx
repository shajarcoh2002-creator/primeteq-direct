"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import type { CategoryId } from "@/data/catalog";
import { DevicePhoto } from "@/components/DevicePhoto";

interface Item {
  slug: string;
  name: string;
  group: string;
  photo: string | null;
  storage: string[];
  upTo: number;
}

export function ModelGrid({ category, categoryName, models }: { category: CategoryId; categoryName: string; models: Item[] }) {
  const [q, setQ] = useState("");

  const groups = useMemo(() => {
    const term = q.trim().toLowerCase();
    const map = new Map<string, Item[]>();
    for (const m of models) {
      if (term && !m.name.toLowerCase().includes(term)) continue;
      map.set(m.group, [...(map.get(m.group) ?? []), m]);
    }
    return [...map.entries()];
  }, [models, q]);

  return (
    <>
      <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Step 1 · Select</p>
          <h2 className="mt-2 text-3xl font-extrabold md:text-4xl">Choose your {categoryName}.</h2>
        </div>
        <label className="relative block w-full md:max-w-sm">
          <span className="sr-only">Search models</span>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your model" className="field pl-10 pr-10" />
          {q && (
            <button type="button" onClick={() => setQ("")} className="absolute right-2 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-paper" aria-label="Clear search">
              <X className="h-4 w-4" />
            </button>
          )}
        </label>
      </div>

      <div className="mt-8 space-y-7 sm:mt-10 sm:space-y-10">
        {groups.map(([group, items]) => (
          <div key={group}>
            <h3 className="flex items-center gap-4 text-sm font-bold uppercase tracking-[0.1em] text-muted">
              {group}
              <span className="h-px flex-1 bg-line" aria-hidden />
            </h3>
            {/* Mobile: compact list rows. sm+: cards. */}
            <div className="mt-3 divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white sm:mt-4 sm:grid sm:grid-cols-3 sm:gap-3 sm:divide-y-0 sm:overflow-visible sm:rounded-none sm:border-0 sm:bg-transparent lg:grid-cols-4 xl:grid-cols-5">
              {items.map((m) => (
                <Link
                  key={m.slug}
                  href={`/sell/${category}/${m.slug}`}
                  className="group flex items-center gap-3 px-3 py-2.5 transition active:bg-paper sm:min-h-44 sm:flex-col sm:items-stretch sm:gap-0 sm:rounded-[18px] sm:border sm:border-line sm:bg-white sm:p-4 sm:hover:-translate-y-0.5 sm:hover:border-brand sm:hover:shadow-[var(--shadow-lift)] md:p-5"
                >
                  <DevicePhoto category={category} photo={m.photo} alt={m.name} className="h-14 w-10 sm:h-24 sm:w-full md:h-28" sizes="(min-width: 1024px) 200px, (min-width: 640px) 30vw, 40px" />
                  <span className="min-w-0 flex-1 sm:flex sm:flex-1 sm:flex-col">
                    <span className="font-display block text-[15px] font-bold leading-snug sm:mt-4 md:text-base">{m.name}</span>
                    <span className="mt-0.5 block truncate text-xs text-muted sm:mt-1 sm:whitespace-normal">{m.storage.join(" · ")}</span>
                    <span className="mt-auto hidden items-center justify-between pt-3 text-xs font-semibold sm:flex">
                      <span className="text-ink-2">Up to ${m.upTo.toLocaleString("en-US")}</span>
                      <ArrowRight className="h-4 w-4 text-brand opacity-0 transition group-hover:opacity-100" />
                    </span>
                  </span>
                  <span className="flex shrink-0 items-center gap-1.5 text-right text-xs font-semibold text-ink-2 sm:hidden">
                    <span>
                      <span className="block text-[10px] font-medium uppercase tracking-wide text-muted">Up to</span>${m.upTo.toLocaleString("en-US")}
                    </span>
                    <ArrowRight className="h-4 w-4 text-brand" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        ))}
        {groups.length === 0 && (
          <div className="rounded-[18px] border border-dashed border-line p-10 text-center">
            <p className="font-semibold">No models match “{q}”.</p>
            <p className="mt-1 text-sm text-muted">Check the spelling or browse the full list.</p>
            <button type="button" onClick={() => setQ("")} className="btn btn-secondary mt-4">Show all models</button>
          </div>
        )}
      </div>
    </>
  );
}
