"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Info } from "lucide-react";
import { CARRIER_LABELS, type CarrierId, type CategoryId, variantId } from "@/data/catalog";
import { QuoteSummary } from "@/components/QuoteSummary";

interface Props {
  category: CategoryId;
  modelSlug: string;
  modelName: string;
  carriers: CarrierId[];
  storage: string[];
  kind: "phone" | "tablet";
}

export function VariantPicker({ category, modelSlug, modelName, carriers, storage, kind }: Props) {
  const router = useRouter();
  const [carrier, setCarrier] = useState<CarrierId | null>(null);
  const [size, setSize] = useState<string | null>(null);
  const [tried, setTried] = useState(false);
  const carrierTitle = kind === "tablet" ? "Connectivity" : "Carrier";

  const go = () => {
    if (!carrier || !size) {
      setTried(true);
      return;
    }
    router.push(`/sell/${category}/${modelSlug}/offer?v=${variantId(modelSlug, size, carrier)}`);
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="card p-5 md:p-8">
        <Link href={`/sell/${category}#models`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Change model
        </Link>
        <h1 className="mt-4 text-[28px] font-extrabold leading-tight md:text-4xl">Configure your {modelName}.</h1>
        <p className="mt-2 text-muted">Tell us how your device is set up. You’ll see your offer in the next step.</p>

        <fieldset className="mt-8">
          <legend className="flex w-full items-baseline justify-between gap-3">
            <span className="font-display text-lg font-bold">
              <span className="mr-2 text-brand">A.</span>
              {carrierTitle}
            </span>
          </legend>
          {kind === "phone" && (
            <p className="mt-1 flex items-start gap-1.5 text-sm text-muted">
              <Info className="mt-0.5 h-4 w-4 shrink-0" /> Choose the carrier your phone is locked to, or “Unlocked” if it works with any carrier.
            </p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3" role="radiogroup" aria-label={carrierTitle}>
            {carriers.map((c) => (
              <button
                key={c}
                type="button"
                role="radio"
                aria-checked={carrier === c}
                data-selected={carrier === c}
                data-invalid={tried && !carrier}
                className="option"
                onClick={() => setCarrier(c)}
              >
                <span className="option-dot" aria-hidden />
                {CARRIER_LABELS[c]}
              </button>
            ))}
          </div>
          {tried && !carrier && <p className="mt-2 text-sm font-medium text-danger">Please choose a {carrierTitle.toLowerCase()}.</p>}
        </fieldset>

        <fieldset className="mt-8">
          <legend className="font-display text-lg font-bold">
            <span className="mr-2 text-brand">B.</span>Storage
          </legend>
          <p className="mt-1 flex items-start gap-1.5 text-sm text-muted">
            <Info className="mt-0.5 h-4 w-4 shrink-0" /> Find it in{" "}
            {category === "iphone" || category === "ipad" ? "Settings → General → About → Capacity" : "Settings → Storage"}.
          </p>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4" role="radiogroup" aria-label="Storage">
            {storage.map((s) => (
              <button
                key={s}
                type="button"
                role="radio"
                aria-checked={size === s}
                data-selected={size === s}
                data-invalid={tried && !size}
                className="option justify-center"
                onClick={() => setSize(s)}
              >
                {s}
              </button>
            ))}
          </div>
          {tried && !size && <p className="mt-2 text-sm font-medium text-danger">Please choose a storage size.</p>}
        </fieldset>

        <div className="mt-10 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/sell/${category}#models`} className="btn btn-secondary">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
          <button type="button" onClick={go} className="btn btn-primary px-8" aria-disabled={!carrier || !size}>
            Continue <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <QuoteSummary
        category={category}
        title={modelName}
        rows={[
          { label: carrierTitle, value: carrier ? CARRIER_LABELS[carrier] : null },
          { label: "Storage", value: size },
          { label: "Condition", value: null },
        ]}
        footer="Your offer appears once you describe the condition."
      />
    </div>
  );
}
