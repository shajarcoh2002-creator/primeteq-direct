"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import type { CategoryId } from "@/data/catalog";
import { DeviceArt } from "@/components/DeviceArt";

interface Item {
  slug: string;
  name: string;
  upTo: number;
}

export function ModelGrid({ category, models }: { category: CategoryId; models: Item[] }) {
  const [q, setQ] = useState("");
  const shown = models.filter((m) => m.name.toLowerCase().includes(q.trim().toLowerCase()));

  return (
    <>
      <label className="relative mt-6 block max-w-md">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search your model" className="field pl-9" />
      </label>

      <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {shown.map((m) => (
          <Link
            key={m.slug}
            href={`/sell/${category}/${m.slug}`}
            className="group flex flex-col items-center rounded-2xl border border-line p-4 text-center transition hover:border-brand hover:shadow-md"
          >
            <DeviceArt category={category} className="h-24 transition group-hover:-translate-y-1" />
            <span className="mt-3 text-sm font-bold">{m.name}</span>
            <span className="mt-1 text-xs font-semibold text-cash">Up to ${m.upTo.toLocaleString("en-US")}</span>
          </Link>
        ))}
      </div>
      {shown.length === 0 && <p className="mt-8 text-muted">No models match “{q}”.</p>}
    </>
  );
}
