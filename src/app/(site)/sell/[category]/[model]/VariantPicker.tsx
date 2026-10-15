"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { CARRIER_LABELS, type CarrierId, type CategoryId, variantId } from "@/data/catalog";

interface Props {
  category: CategoryId;
  modelSlug: string;
  carriers: CarrierId[];
  storage: string[];
  kind: "phone" | "tablet";
}

export function VariantPicker({ category, modelSlug, carriers, storage, kind }: Props) {
  const [carrier, setCarrier] = useState<CarrierId | null>(null);

  return (
    <div className="mt-8 space-y-8">
      <div>
        <h2 className="text-lg font-bold">{kind === "tablet" ? "Select connectivity" : "Select carrier"}</h2>
        {kind === "phone" && <p className="text-sm text-muted">The carrier your phone is locked to, or “Unlocked” if it works with any carrier.</p>}
        <div className="mt-4 flex flex-wrap gap-3">
          {carriers.map((c) => (
            <button key={c} type="button" className="choice" data-active={carrier === c} onClick={() => setCarrier(c)}>
              {CARRIER_LABELS[c]}
            </button>
          ))}
        </div>
      </div>

      {carrier && (
        <div>
          <h2 className="text-lg font-bold">Select storage</h2>
          <div className="mt-4 divide-y divide-line rounded-2xl border border-line">
            {storage.map((s) => (
              <Link
                key={s}
                href={`/sell/${category}/${modelSlug}/offer?v=${variantId(modelSlug, s, carrier)}`}
                className="flex items-center justify-between p-4 transition hover:bg-paper"
              >
                <span className="font-semibold">
                  {s} <span className="font-normal text-muted">({CARRIER_LABELS[carrier]})</span>
                </span>
                <span className="flex items-center gap-1 text-sm font-semibold text-brand">
                  Get an offer <ArrowRight className="h-4 w-4" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
