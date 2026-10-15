"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Search, X } from "lucide-react";
import type { CategoryId } from "@/data/catalog";
import { DeviceArt } from "@/components/DeviceArt";

interface Item {
  slug: string;
  name: string;
  group: string;
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

      <div className="mt-10 space-y-10">
        {groups.map(([group, items]) => (
          <div key={group}>
            <h3 className="flex items-center gap-4 text-sm font-bold uppercase tracking-[0.1em] text-muted">
              {group}
              <span className="h-px flex-1 bg-line" aria-hidden />
            </h3>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {items.map((m) => (
                <Link
                  key={m.slug}
                  href={`/sell/${category}/${m.slug}`}
                  className="group flex min-h-44 flex-col rounded-[18px] border border-line bg-white p-4 transition hover:-translate-y-0.5 hover:border-brand hover:shadow-[var(--shadow-lift)] focus-visible:border-brand md:p-5"
                >
                  <DeviceArt category={category} className="h-20 self-start md:h-24" />
                  <span className="font-display mt-4 text-[15px] font-bold leading-snug md:text-base">{m.name}</span>
                  <span className="mt-1 text-xs text-muted">{m.storage.join(" · ")}</span>
                  <span className="mt-auto flex items-center justify-between pt-3 text-xs font-semibold">
                    <span className="text-ink-2">Up to ${m.upTo.toLocaleString("en-US")}</span>
                    <ArrowRight className="h-4 w-4 text-brand opacity-0 transition group-hover:opacity-100" />
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
