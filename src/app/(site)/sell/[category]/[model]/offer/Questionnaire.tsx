"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Lock } from "lucide-react";
import type { CategoryId } from "@/data/catalog";
import { type Answers, CONDITION_LABELS, type Condition, conditionFromAnswers } from "@/lib/pricing";
import { QuoteSummary } from "@/components/QuoteSummary";

const FUNCTIONAL_CHECKS = [
  "Screen works and fully lights up",
  "All exterior buttons",
  "Front/back cameras and flash",
  "Speakers and microphones",
  "Charging port",
  "Cellular, Wi-Fi, Bluetooth and GPS",
  "Touchscreen",
  "Face ID / fingerprint sensor",
  "Battery holds a charge",
];

const COSMETIC: { id: Exclude<Condition, "broken">; title: string; body: string }[] = [
  { id: "flawless", title: "Flawless or like new", body: "No scratches, scuffs or signs of use." },
  { id: "good", title: "Lightly used", body: "Light signs of normal use, visible only up close." },
  { id: "fair", title: "Scratched or scuffed", body: "Obvious scratches, scuffs or nicks on the screen or body." },
  { id: "poor", title: "Damaged", body: "Bent, chipped, dented or sun-bleached. No cracks." },
];

type YesNoKey = "powersOn" | "functional" | "noCracks";

interface Props {
  variant: string;
  offers: Record<Condition, number>;
  kind: "phone" | "tablet";
  category: CategoryId;
  modelSlug: string;
  modelName: string;
  photo: string | null;
  storage: string;
  carrierLabel: string;
  carrierTitle: string;
}

function Question({
  n,
  title,
  locked,
  invalid,
  children,
}: {
  n: number;
  title: string;
  locked: boolean;
  invalid: boolean;
  children: React.ReactNode;
}) {
  return (
    <fieldset className={`rounded-2xl border p-5 transition md:p-6 ${invalid ? "border-danger bg-danger-soft/40" : "border-line bg-white"}`} disabled={locked}>
      <legend className="sr-only">{title}</legend>
      <div className="flex items-start gap-3">
        <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${locked ? "bg-paper text-muted" : "bg-brand text-white"}`}>
          {locked ? <Lock className="h-3.5 w-3.5" /> : n}
        </span>
        <h2 className={`font-display pt-0.5 text-lg font-bold leading-snug ${locked ? "text-muted" : ""}`} aria-hidden>
          {title}
        </h2>
      </div>
      <div className="mt-4 md:pl-10">{children}</div>
      {invalid && <p className="mt-3 text-sm font-medium text-danger md:pl-10">Please answer this question to continue.</p>}
    </fieldset>
  );
}

export function Questionnaire(props: Props) {
  const { variant, offers, kind, category, modelSlug, modelName, photo, storage, carrierLabel, carrierTitle } = props;
  const router = useRouter();
  const [a, setA] = useState<Partial<Answers>>({});
  const [tried, setTried] = useState(false);
  const set = (patch: Partial<Answers>) => setA((prev) => ({ ...prev, ...patch }));
  const condition = conditionFromAnswers(a);
  const offer = condition ? offers[condition] : null;

  const locked2 = a.powersOn !== true;
  const locked3 = locked2 || a.functional !== true;
  const locked4 = locked3 || a.noCracks !== true;
  // First unanswered, unlocked question — used for the error state.
  const missing: number | null =
    condition ? null : a.powersOn === undefined ? 1 : a.functional === undefined ? 2 : a.noCracks === undefined ? 3 : 4;

  const yesNo = (key: YesNoKey, q: number, locked: boolean) => (
    <div className="grid max-w-sm grid-cols-2 gap-3" role="radiogroup">
      {[true, false].map((val) => (
        <button
          key={String(val)}
          type="button"
          role="radio"
          aria-checked={a[key] === val}
          data-selected={a[key] === val}
          data-invalid={tried && missing === q}
          disabled={locked}
          className="option"
          onClick={() => set({ [key]: val })}
        >
          <span className="option-dot" aria-hidden />
          {val ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );

  const params = new URLSearchParams({
    v: variant,
    p: a.powersOn ? "1" : "0",
    f: a.functional ? "1" : "0",
    n: a.noCracks ? "1" : "0",
    k: a.cosmetic ?? "",
  });

  const next = () => {
    if (!condition) {
      setTried(true);
      return;
    }
    router.push(`/checkout?${params}`);
  };

  const continueButton = (
    <button type="button" onClick={next} className="btn btn-primary w-full" aria-disabled={!condition}>
      Continue <ArrowRight className="h-4 w-4" />
    </button>
  );

  return (
    <div className="grid gap-8 pb-24 lg:grid-cols-[1fr_360px] lg:pb-0">
      <div className="card p-5 md:p-8">
        <Link href={`/sell/${category}/${modelSlug}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-ink">
          <ArrowLeft className="h-4 w-4" /> Change {carrierTitle.toLowerCase()} or storage
        </Link>
        <h1 className="mt-4 text-[28px] font-extrabold leading-tight md:text-4xl">What condition is it in?</h1>
        <p className="mt-2 text-muted">Answer honestly — your offer updates as you go.</p>

        <div className="mt-8 space-y-4">
          <Question n={1} title="Does the device power on?" locked={false} invalid={tried && missing === 1}>
            {yesNo("powersOn", 1, false)}
          </Question>

          <Question n={2} title="Is it fully functional, with the whole screen lighting up correctly?" locked={locked2} invalid={tried && missing === 2}>
            <p className="text-sm text-muted">Answer “Yes” only if all of these work:</p>
            <ul className="mb-4 mt-2 grid gap-x-6 gap-y-1 text-sm text-ink-2 sm:grid-cols-2">
              {FUNCTIONAL_CHECKS.filter((c) => kind === "phone" || !c.startsWith("Cellular")).map((c) => (
                <li key={c} className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-brand" /> {c}
                </li>
              ))}
            </ul>
            {yesNo("functional", 2, locked2)}
          </Question>

          <Question n={3} title="Are the front and back free of cracks?" locked={locked3} invalid={tried && missing === 3}>
            {yesNo("noCracks", 3, locked3)}
          </Question>

          <Question n={4} title="What’s the overall cosmetic condition?" locked={locked4} invalid={tried && missing === 4}>
            <div className="grid gap-3 sm:grid-cols-2" role="radiogroup">
              {COSMETIC.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  role="radio"
                  aria-checked={a.cosmetic === c.id}
                  data-selected={a.cosmetic === c.id}
                  data-invalid={tried && missing === 4}
                  disabled={locked4}
                  onClick={() => set({ cosmetic: c.id })}
                  className="option !items-start !py-4"
                >
                  <span className="option-dot mt-0.5" aria-hidden />
                  <span>
                    <span className="block">{c.title}</span>
                    <span className="mt-0.5 block text-sm font-normal text-muted">{c.body}</span>
                  </span>
                </button>
              ))}
            </div>
          </Question>
        </div>

        {condition === "broken" && (
          <p className="mt-4 rounded-xl bg-paper p-4 text-sm text-ink-2">
            Based on your answers, your device is quoted as <strong>not fully working or cracked</strong>. You can still sell it.
          </p>
        )}

        <div className="mt-8 flex flex-col-reverse gap-3 border-t border-line pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href={`/sell/${category}/${modelSlug}`} className="btn btn-secondary">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
      </div>

      {/* Mobile / tablet: sticky offer bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 py-3 shadow-[0_-8px_24px_rgb(11_22_64/0.06)] backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-2xl items-center gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-muted">Your offer</p>
            <p className={`font-display text-2xl font-extrabold leading-tight ${offer ? "text-ink" : "text-muted/40"}`} aria-live="polite">
              {offer ? `$${offer.toLocaleString("en-US")}` : "$ ‑‑‑"}
            </p>
          </div>
          <div className="w-40 sm:w-52">{continueButton}</div>
        </div>
      </div>

      <QuoteSummary
        category={category}
        photo={photo}
        title={modelName}
        rows={[
          { label: carrierTitle, value: carrierLabel },
          { label: "Storage", value: storage },
          { label: "Condition", value: condition ? CONDITION_LABELS[condition] : null },
        ]}
        offer={offer}
        footer={
          <>
            Your offer is based on your answers. Inspection and final-amount policy: <span className="placeholder-note">To be confirmed</span>
          </>
        }
      >
        <div className="mt-5 hidden lg:block">{continueButton}</div>
      </QuoteSummary>
    </div>
  );
}
